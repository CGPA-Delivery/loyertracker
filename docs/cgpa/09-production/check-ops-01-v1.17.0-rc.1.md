# CHECK-OPS-01 Pré-Production — `1.17.0-rc.1`

- **Candidat :** `d19c4fea850263c5bfbb92fcb288dd7bd2e56e2a`
- **Environnement inspecté :** `loyertracker-prod-server` (`172.31.22.90`)
- **Déploiement pendant ce contrôle :** aucun
- **Résultat technique :** PASS sous réserve des avis humains SRE/Delivery Architect

## Readiness opérationnelle

| Critère | Preuve | Résultat |
|---|---|---:|
| Logs applicatifs disponibles | conteneur API/Nginx et Docker logging actifs | PASS |
| Métriques applicatives | Actuator interne Prometheus `200` | PASS |
| Prometheus | conteneur présent et opérationnel | PASS |
| Alertmanager | conteneur présent | PASS |
| Pushgateway | conteneur présent, liaison localhost | PASS |
| Blackbox | conteneur présent | PASS |
| Health API | `/healthz` HTTPS `200` | PASS |
| Surface Actuator publique | `/api/actuator/prometheus` `404` | PASS |
| Rollback applicatif | anciens digests Production `1.16.0` conservés | PASS |
| Rollback données | dump custom + globals vérifiés | PASS |
| Escalade | rôles SRE/RM assignés aux sous-agents, délais SEV-1/SEV-2 documentés | PASS sous réserve |
| Avis SRE | PASS sous réserve documentaire — voir section 7 | PASS sous réserve |

## Sauvegarde pré-Gate

- Répertoire : `/home/ubuntu/backups/loyertracker/gate-us125-20260808-222432/`
- Dump : `loyertracker-prod-20260808-222432.dump`
- SHA-256 : `43e08fce11e0ab877c28575df6f7c6b977029ee72947b8580692a5c2b77d3915`
- Globals SHA-256 : `537c67925d7712a424aa112f98de7168b85a93048accf8999e220a7d1958a512`
- Intégrité : `pg_restore --list` — 858 entrées

## Conditions de rollback

Déclencher un rollback applicatif ciblé vers les digests Production `1.16.0` si l’un des seuils suivants est atteint :

- healthcheck API ou Web non healthy après la fenêtre de stabilisation ;
- erreurs HTTP 5xx inattendues ou régression AuthN/AuthZ ;
- violation d’isolation tenant/ReBAC/RLS ;
- erreur Flyway ou échec de démarrage ;
- perte des métriques/alertes critiques ;
- défaut fonctionnel bloquant confirmé par le PO/QA.

La migration V32 étant additive, le rollback applicatif ne supprime pas la migration. Toute restauration de données doit être décidée séparément par le CDO et le Release Manager à partir du backup vérifié.

## 7. Avis SRE / Operations — clôture documentaire

- **Auteur :** sous-agent SRE / Operations, non humain.
- **Périmètre :** RC `v1.17.0-rc.1` / US-125, pré-Production.
- **Verdict agent :** **PASS sous réserve documentaire**.
- **Décision CDO :** avis accepté ; réserves non bloquantes sous suivi CHECK-OPS-01.

### Seuils observables et actions

| Domaine | Seuil / critère | Action |
|---|---|---|
| Health API | `/healthz` non `200` pendant plus de 2 minutes après stabilisation | SEV-1 + rollback applicatif |
| Health Web | racine publique non `200` pendant plus de 2 minutes | SEV-1 + rollback applicatif |
| Conteneurs | `api`/`nginx` non healthy ou restart non expliqué pendant T0 | SEV-1/SEV-2 selon impact |
| Flyway | erreur, version inattendue ou application partielle V32 | stop promotion ; restauration données uniquement sur décision CDO/RM |
| HTTP 5xx | 5xx non qualifié détecté sur fenêtre de 5 minutes | SEV-2 ; rollback si blocage fonctionnel confirmé |
| AuthN/AuthZ | régression login ou 401/403 anormal sur parcours nominal | SEV-1/SEV-2 + rollback selon impact |
| Isolation | toute violation tenant/ReBAC/RLS | SEV-1 + rollback immédiat |
| Observabilité | Prometheus/Alertmanager/Actuator indisponible plus de 5 minutes | SEV-2 ; rollback si visibilité critique absente |
| Backup | backup absent, hash invérifiable ou restauration non listable | NO GO opérationnel |
| Smoke Production | au moins 1 FAIL non qualifié | SEV-1/SEV-2 ; rollback si bloquant |
| Logs | erreur critique non qualifiée dans les 30 minutes | SEV-2 ; rollback selon impact |

### Rollback applicatif

1. Restaurer les anciens digests Production `1.16.0`.
2. Recréer uniquement `api` et `nginx`.
3. Ne pas toucher PostgreSQL, Keycloak, volumes, secrets, providers ou flags.
4. Vérifier `check-release-state.sh --host`, health API/Web, conteneurs healthy, Flyway et isolation.
5. La restauration de données est une décision séparée CDO + Release Manager.

### Stabilisation et hypercare

- **T0 :** 15 minutes après retour healthy des conteneurs.
- **T+12 :** T0 + 12 heures ± 30 minutes.
- **T+24 :** T0 + 24 heures ± 30 minutes.
- **Clôture :** après T+24 PASS, sur décision CDO distincte.

Critères de passage : health API/Web `200`, Actuator interne `200`, Actuator public `404`, `RestartCount=0` ou qualifié, 5xx non qualifiés = 0, smoke PASS, aucune violation AuthN/AuthZ/ReBAC/RLS, Prometheus/Alertmanager disponibles.

### Escalade par rôle d’agent

| Responsabilité | Rôle assigné | Statut |
|---|---|---|
| Surveillance T0/T+12/T+24 | sous-agent SRE / Operations | accepté par CDO |
| Exécution ciblée | sous-agent Release Manager + sous-agent SRE | accepté par CDO |
| Recommandation rollback | sous-agent SRE | accepté par CDO |
| Décision rollback applicatif | CDO + sous-agent Release Manager | accepté par CDO |
| Décision restauration données | CDO + sous-agent Release Manager | accepté par CDO |
| Validation fonctionnelle | PO + sous-agent QA | accepté par CDO |
| Communication incident | CDO + sous-agent Release Manager | accepté par CDO |

### Délais d’escalade

- **SEV-1 :** escalade immédiate ; décision rollback ciblée sous 15 minutes.
- **SEV-2 :** SRE → Release Manager → CDO sous 30 minutes.
- **SEV-3 :** suivi hypercare/backlog, sans rollback automatique.

### Valeurs confirmées par le CDO

- fenêtre UTC : `2026-08-09T01:00:00Z` → `2026-08-09T02:00:00Z` ;
- canal officiel d’escalade et de communication : GitHub PR de release + Telegram CDO ;
- fenêtres hypercare : T0 + 15 minutes, T+12 ± 30 minutes, T+24 ± 30 minutes ;
- les références exactes de publication : [PR #410](https://github.com/CGPA-Delivery/loyertracker/pull/410) ;

**Conclusion SRE Agent : PASS technique ; déploiement exécuté le 2026-08-09T00:24:03Z, smoke 63/0. Écart de fenêtre UTC accepté par le CDO le 2026-08-09T05:45:17Z ; hypercare T+12/T+24 reste à exécuter.**
