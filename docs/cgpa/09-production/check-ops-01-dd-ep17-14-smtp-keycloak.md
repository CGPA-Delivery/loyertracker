# CHECK-OPS-01 pré-Production — SMTP Keycloak (DD-EP17-14)

| Champ | Valeur |
|---|---|
| Date | 2026-08-13 |
| Candidat de configuration | `ed4a93501a85fc2006c9f720bbea53e226cfb51b` / PR #474, fusionnée dans `main` |
| Hôte | Production canonique `18.158.70.88` (`ip-172-31-22-90`) |
| Déploiement pendant le contrôle | Aucun — réinstruction lecture seule du runtime SMTP déjà actif |
| Résultat technique | **PASS sous réserve de preuve fonctionnelle live et décision CDO** |

## Preflight et observabilité

| Contrôle | Preuve | Résultat |
|---|---|---:|
| Lock release | `check-release-state.sh --host` : digests API/Web et Flyway `32` cohérents | PASS |
| Conteneurs cœur | API/Web/Keycloak/PostgreSQL healthy ; Keycloak `RestartCount=0` | PASS |
| Health/observabilité | Prometheus prêt ; Alertmanager, Pushgateway et Blackbox actifs | PASS |
| Logs à surveiller | `docker compose logs keycloak` ; événements SMTP/erreurs après one-shot | PASS |
| Alertes actives | `KeycloakProbeDown` (2 min), `ApiDown` (2 min), `ApiHighErrorRate` (>5%/5 min), `BackupHeartbeat*` (>26 h) | PASS |
| Secrets SMTP Production | Absents : à injecter dans `.env` local uniquement pendant la fenêtre autorisée | Précondition |
| Runtime SMTP realm | Absent avant changement : état pré-changement attendu | Précondition |

## Backup pré-Gate validé

| Élément | Valeur |
|---|---|
| Dump | `/home/ubuntu/loyertracker-backups/daily/loyertracker-20260812-021502.dump` |
| Taille | `1,079,765` octets |
| SHA-256 | `0c1223fa02cf3e874368f4fb938fb72c5fb748a32057af4770d61d7ccac12ae7` |
| Intégrité | `pg_restore --list` : `873` entrées — PASS |
| Globals | `loyertracker-20260812-021502.globals.sql` |
| Globals SHA-256 | `328ff687ada31e4b53421be26e953976c78fc714cbfde5d4f612235661dc6e3c` |
| Responsable restauration | CDO + Release Manager uniquement |

> Un backup plus récent doit être exécuté et revalidé immédiatement avant la fenêtre de déploiement si ce backup a plus de 24 heures à ce moment-là.

## Procédure de validation live après GO

Le runtime SMTP est déjà configuré vers le relais interne sain : ne pas exécuter le one-shot de reconfiguration pendant cette réinstruction. Après fenêtre UTC et `GO / PRODUCTION_READY` limité au test :

1. Confirmer checkout `main`, lock release et santé sans recréer de conteneur.
2. Générer un backup PostgreSQL + globals frais, SHA-256, puis valider le dump avec `pg_restore --list`.
3. Capturer l'état `smtpServer` pré-test via Admin API, sans valeur secrète.
4. Vérifier par Admin API que le compte de test autorisé est `enabled=true`.
5. Exécuter le flux public « mot de passe oublié » pour ce compte : réception réelle puis action-token terminée, sans conserver d'adresse/token/contenu.
6. Exécuter le même flux pour une adresse synthétique inexistante et comparer HTTP/message normalisé.
7. Vérifier logs, alerting, HTTPS, Actuator, release lock et santé ; démarrer hypercare.

Le one-shot `keycloak-smtp-production-init` reste réservé à une reconfiguration explicitement autorisée, avec `--no-deps`, et ne fait pas partie de ce Gate fonctionnel.

## Rollback et seuils

| Déclencheur | Niveau | Action |
|---|---|---|
| Échec one-shot / erreur SMTP / reset existant non `200` | SEV-1 | Stopper la promotion ; rollback `smtpServer` ciblé sous décision CDO/RM |
| Différence HTTP/message existant vs inexistant | SEV-1 | Rollback ciblé immédiat ; aucun état GO Production |
| Keycloak non healthy > 2 min | SEV-1 | Rollback ciblé, investigation ; pas de redémarrage global |
| API/Web non healthy > 2 min ou 5xx > 5 % / 5 min | SEV-1 | Stopper ; rollback configuration ; escalade CDO/RM |
| Alerting/backup indisponible > 5 min | SEV-2 | Suspendre promotion jusqu'au retour des preuves |
| SMTP fonctionne mais défaut UX mineur | SEV-3 | Hypercare/backlog, sans rollback automatique |

Rollback autorisé :
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile production-smtp run --no-deps --rm keycloak-smtp-production-rollback
```

Ce rollback efface uniquement `smtpServer`. Il ne touche ni images, ni API, ni Nginx, ni PostgreSQL, ni migrations. Toute restauration de dump est destructive et reste une décision séparée CDO + Release Manager.

## Hypercare et escalade

| Moment | Critères |
|---|---|
| T0 + 15 min | Services healthy, reset + anti-énumération PASS, aucune erreur SMTP/5xx non qualifiée |
| T+12 h ±30 min | Métriques/alertes stables, aucun incident AuthN, backup heartbeat présent |
| T+24 h ±30 min | Même contrôle ; clôture uniquement par décision CDO distincte |

- Canal d'escalade : Telegram CDO + GitHub PR/issue de release.
- SEV-1 : CDO et Release Manager immédiatement ; décision rollback sous 15 min.
- SEV-2 : SRE → Release Manager → CDO sous 30 min.

## Décision CHECK-OPS-01

**PASS sous réserve opérationnelle.** Le préflight, la sauvegarde vérifiée, le rollback ciblé et l'observabilité sont prêts. Il manque uniquement une fenêtre UTC approuvée, l'injection des secrets hors dépôt, le test live Production et la décision explicite CDO `GO / PRODUCTION_READY`. Aucun déploiement n'est autorisé par cette checklist seule.
