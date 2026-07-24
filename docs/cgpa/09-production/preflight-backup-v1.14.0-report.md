# Rapport Préflight + Backup — Release `1.14.0` (EP-16 Sprint N+1 — WhatsApp P0)

| Champ | Valeur |
|---|---|
| Date | 2026-07-24, ~13:42–13:45 UTC |
| Hôte | `loyertracker-prod-server` — `18.158.70.88` |
| Candidat | `sha-27dce09d` |
| Digests Staging | API `sha256:089028b45a93afd4f12d5aa22cfc63a38f5687bb1d0f7204bc1965154ce8d7ff` ; Web `sha256:7dbc551ee722e1da7697d71749b94a731fce0b028b7b7288c88d8346488e8bc8` |
| Production / rollback | `1.13.0` — `sha-e4744d92` |
| Verdict | **PASS** |

## Aucune réserve bloquante héritée

Contrairement au Préflight `1.13.0` (bloqué par l'hypercare `1.12.0`), la release `1.13.0` est
**déjà clôturée** (CDO GO le 2026-07-24, hypercare T0/T+12/T+24 complète) au moment de ce
Préflight — aucune condition de séquencement de release précédente ne s'applique ici.

## Contrôles lecture seule (Production `1.13.0` avant migration)

- 4/4 conteneurs applicatifs actifs et `healthy`, **`RestartCount=0`** sur
  `api`/`nginx`/`postgres`/`keycloak` ; tag courant `sha-e4744d92` inchangé.
- Flyway **27/27** ; V28 (seed 3 templates + 2 fonctions `SECURITY DEFINER`) **pas encore
  appliquée** — état propre avant migration.
- `bailleur-test@test.local` confirmé **désactivé** (`enabled: false`) ;
  `directAccessGrantsEnabled=false` sur `loyertracker-spa`.
- Prometheus **5/5** cibles `up`. Alertmanager : **1 alerte active** `BackupHeartbeatMissing` au
  moment du contrôle — pattern récurrent déjà qualifié (cron 02h15 manqué) ; **résolue par ce
  Préflight** : le backup ci-dessous pousse un heartbeat réussi vers le Pushgateway.
- **0 ligne 5xx** (30 dernières minutes) ; **0 entrée `ERROR`** API (30 dernières minutes) ; site
  public `https://loyertracker.loyerpro.org` → **200** ; `/healthz` → **200**.
- Pool Hikari `hikaricp_connections_pending` = 0.
- 30 Gio disque libres (22 %), ~2,0 Gio mémoire disponible, charge 0,18/0,12/0,03.
- Données métier baseline : 3 bailleurs, 2 patrimoines, 8 biens, 8 baux, 8 garanties,
  1 gestionnaire, 8 locataires, 7 quittances — inchangée depuis la clôture `1.13.0`.
- **Aucune variable `TWILIO_*`/`NOTIFICATIONS_EXTERNAL_ENABLED` dans le `.env` hôte** (grep : 0
  occurrence) — confirmation explicite exigée par le Gate Production (condition 5).
- Dépôt hôte au commit `5d59b5f`, en retard sur `origin/main` — à synchroniser au déploiement
  technique (`git pull --ff-only`) ; aucun `pull` exécuté durant ce Préflight.
- Aucune commande de mutation applicative exécutée (lecture seule + `pg_dump` + `cp .env`
  uniquement ; aucune commande Docker à portée globale).

## Backup vérifié (avant migration V28)

| Fichier | Taille | Mode | SHA-256 |
|---|---:|---:|---|
| `loyertracker-20260724-134344.dump` | 854175 | 600 | `492f5017b85d93792f9562420de8a15f220f57625820bf14095748f582c7010e` |
| `loyertracker-20260724-134344.globals.sql` | 1108 | 600 | `abd54c4ff92f04da292a5d87426f0cef75a00aa85f3fe4f52216ae8538c54b84` |

Backup produit et vérifié par `infra/backup/backup-postgres.sh` (« OK dump vérifié »). Heartbeat de
sauvegarde poussé avec succès vers le Pushgateway, levant l'alerte `BackupHeartbeatMissing`
constatée ci-dessus (propagation Alertmanager à la prochaine évaluation).

## Volet migration V28 — additive (aucune condition renforcée)

Comme V27/`1.13.0`, la migration V28 est **strictement additive** : seed de trois templates dans
`notification_template` (référentiel déjà créé, table vide) et deux fonctions `SECURITY DEFINER`
(`notification_bailleurs_en_attente()`, `notification_delivery_appliquer_statut()`). L'application
`1.13.0` actuelle ignore ces objets si un rollback applicatif seul devait être exécuté après
migration. **Aucun second backup post-migration n'est requis** comme condition bloquante ; le
backup pré-migration ci-dessus suffit comme point de restauration.

## Feature flags et absence de dépendance Twilio réelle (condition 5 du Gate Production)

Confirmé en double lecture :

- **Aucune variable `TWILIO_*` ni `NOTIFICATIONS_EXTERNAL_ENABLED`** dans le `.env` de l'hôte de
  production (grep explicite, 0 occurrence).
- `application.yml` (`backend/src/main/resources/application.yml:108-124`) : chaque propriété a un
  fallback Spring sûr par défaut (`${VAR:false}`) — `NotificationProvider` actif après déploiement
  sera donc **`NoopNotificationProvider`**, exactement comme en `1.13.0`.
- **Ce Préflight n'ajoute, ne modifie et ne planifie l'ajout d'aucun credential Twilio** au `.env`
  de production. Le compte Twilio Sandbox reste exclusivement sur `ai-test-server` (Staging).
  Conformément à K8 (ADR-18), cette situation perdure jusqu'à la clôture en GO du Sprint N+2.

## Secrets et rollback

- **Aucune nouvelle variable d'environnement/secret requise** pour ce Préflight.
- `.env.bak-pre-1.14.0` créé (mode 600), `.env` hôte inchangé (tag `sha-e4744d92`, aucun service
  redémarré).
- Rollback `sha-e4744d92` : images API/Web déjà présentes localement sur l'hôte (aucun pull requis
  pour un retour arrière) ; V28 étant additive, ce rollback reste viable **même après** application
  de la migration.

## Verdict

`CHANGELOG.md` `[Non publié]` couvrait déjà le Sprint N+1 EP-16 ; promu en
`[1.14.0] — 2026-07-24` dans le même commit que ce rapport (condition 4 du Gate Production).

**Préflight Production `1.14.0` : PASS.** Toutes les conditions bloquantes du Gate Production
(`gate-production-sprint-n1-ep16-decision.md`) sont satisfaites : (1) Production `1.13.0` vérifiée
saine en lecture seule (aucune réserve de séquencement héritée), (2) backup base+globals produit et
vérifié, (3) candidat `sha-27dce09d` et rollback `sha-e4744d92` confirmés, (4) changelog promu,
(5) **absence explicite de toute variable/credential Twilio confirmée**, flags externes à valeurs
sûres, (6) smoke canonique ≥63 et contrôle 0 activité `notification_delivery` restent à exécuter
**au déploiement technique** (prochaine étape), (7) déploiement/rollback devra cibler exclusivement
`api`+`nginx`. **Aucun déploiement exécuté par ce Préflight.** Une instruction explicite distincte
reste requise pour déployer `api`+`nginx` et appliquer la migration V28. **L'activation des canaux
externes reste interdite jusqu'à la clôture en GO du Sprint N+2 (K8, ADR-18).**
