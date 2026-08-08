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
| Escalade | SRE/Release Manager à désigner dans le Gate | À VALIDER |
| Avis SRE | non encore signé | À VALIDER |

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

## Avis requis

- **SRE :** `À VALIDER`
- **Delivery Architect :** `À VALIDER`
- **Release Manager :** `À VALIDER`
