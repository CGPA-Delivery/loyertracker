# DD-EP17-14 — Validation live SMTP Production canonique et hypercare T0

| Champ | Valeur |
|---|---|
| Date de test | 2026-08-13 |
| Hôte canonique | `18.158.70.88` — `loyertracker.loyerpro.org` |
| Référence source | `main` `d63b3467cf0b340260bb31ace779b237a413f895` |
| Fenêtre autorisée | 17:20–18:00 UTC |
| Périmètre | Test du runtime SMTP existant ; aucune reconfiguration realm/SMTP |
| Décision T0 | **PASS — hypercare ouverte** |

## Preuves fonctionnelles

| Contrôle | Résultat |
|---|---:|
| Backup PostgreSQL + globals frais | PASS — dump validé `pg_restore --list`, contrôles hashés hors Git |
| Flux public « mot de passe oublié » | PASS — HTTP/UI générique |
| Anti-énumération | PASS — réponse HTTP et message normalisé identiques pour compte existant et adresse synthétique inexistante |
| Relais SMTP | PASS — remise fournisseur acceptée (`2xx`), sans détail de relais, identifiant de file ou destinataire dans ce document |
| Réception réelle | PASS — confirmée par le détenteur de la boîte de test autorisée |
| Action-token | PASS — réinitialisation du mot de passe terminée par le détenteur de la boîte contrôlée |
| Release lock / Flyway | PASS — cohérent / `32` |
| API, Nginx, Keycloak, PostgreSQL, relais | PASS — healthy, aucun restart pendant le Gate |
| HTTPS / Actuator | PASS — `200` / `UP` |

## Remédiation observabilité associée

L’alerte `BackupHeartbeatMissing` a bloqué la conclusion T0. L’investigation a établi : cron installé, backups historiques valides et Pushgateway disponible, mais le script de backup interprétait `.env` en Bash. Une valeur SMTP valide pour Docker Compose pouvait interrompre le cron avant le heartbeat.

La PR #477, fusionnée après CI SUCCESS, lit désormais les métadonnées PostgreSQL depuis le conteneur déjà démarré sans interpréter `.env`. Un backup Production contrôlé a ensuite réussi, le dump a été revalidé, Prometheus a scrapé le heartbeat et la cible Pushgateway est `up`. L’API Alertmanager ne retourne plus aucune alerte `BackupHeartbeat*` active.

## Décision et limites

**PASS T0.** Le SMTP Keycloak existant est fonctionnel en Production canonique, avec preuve de remise, réception et consommation action-token. Aucune mutation SMTP/realm, image, Compose, base ou service n’a été effectuée pendant le Gate.

Hypercare obligatoire, non anticipable :

| Échéance | Cible UTC | Statut |
|---|---|---:|
| T0 +15 min | 2026-08-13 17:53 UTC | PASS |
| T+12h ±30 min | 2026-08-14 05:23 UTC | PENDING |
| T+24h ±30 min | 2026-08-14 17:23 UTC | PENDING |

Chaque contrôle futur devra confirmer : lock release, services/restarts, HTTPS/API, logs SMTP/Keycloak redigés, relay, Prometheus/Alertmanager et heartbeat backup. La clôture finale exige une décision CDO distincte après T+24h.
