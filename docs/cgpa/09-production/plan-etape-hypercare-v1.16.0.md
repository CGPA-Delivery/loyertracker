# Plan Hypercare — Release `1.16.0` (EP-18 Notifications EMAIL Resend)

| Champ | Valeur |
|---|---|
| `PRODUCTION_DEPLOYED` | 2026-08-05T19:25:04Z (`validation-finale-ep18-notifications-email-resend-report.md`) |
| T0 | 2026-08-05T19:57:29Z — **PASS** |
| T+12 | cible 2026-08-06T07:25:04Z ± 30 min — à exécuter |
| T+24 | cible 2026-08-06T19:25:04Z ± 30 min — à exécuter |
| Tag surveillé | `sha-8c9f1e4a` |
| Rollback applicatif | `sha-ac374193` (`1.15.0`) — backup Préflight disponible |

## Critères de suspension

- service applicatif non healthy, restart inattendu ou dérive de digest/tag ;
- `check-release-state.sh --host` non cohérent ;
- Flyway différent de `31/31` ;
- 5xx Nginx ou `ERROR` API non qualifié ;
- toute activation non voulue de Resend ou canal externe ;
- ligne persistante dans `notification_outbox` ou `notification_delivery` hors scénario explicitement autorisé ;
- `bailleur-test@test.local` ou `directAccessGrantsEnabled` retrouvés actifs ;
- alerte critique non qualifiée ou dégradation ressource.

## Checkpoint T0 — 2026-08-05T19:57:29Z

**Statut : PASS**

| Contrôle | Résultat |
|---|---:|
| PR #375 | mergée (`a239e0a`) |
| Hôte Production | resynchronisé sur `a239e0a` |
| `check-release-state.sh --host` | ✅ **COHÉRENT** |
| API | ✅ healthy, `RestartCount=0`, `ghcr.io/jptshilombo/loyertracker-api@sha256:2522ae210603cb94efc03ce5f8053a0c20b2c10e81ff6c48cde62b3c53232d60` |
| Web/Nginx | ✅ healthy, `RestartCount=0`, `ghcr.io/jptshilombo/loyertracker-web@sha256:9be1a4cd8b0b27d3b868e69481e7255ecbd1c3c47251875136d1ea897727c359` |
| PostgreSQL | ✅ healthy, `RestartCount=0` |
| Keycloak | ✅ healthy, `RestartCount=0` |
| `/healthz` / racine publique | ✅ `200 / 200` |
| Flyway | ✅ `31/31` ; V31 `ep18 sprint b invitation email`, V30 `ep18 sprint a email resend fondation` |
| `notification_event/outbox/delivery/template/preference` | ✅ `34 / 0 / 0 / 4 / 0` |
| Baseline métier | ✅ `3 bailleurs, 2 patrimoines, 8 biens, 8 baux, 8 garanties, 1 gestionnaire, 8 locataires, 7 quittances` |
| `directAccessGrantsEnabled` | ✅ `false` |
| `bailleur-test@test.local` | ✅ `enabled=false` |
| Resend | ✅ `RESEND_EMAIL_ENABLED=false`, `RESEND_FROM_EMAIL` absent |
| Prometheus | ✅ `5/5` cibles `up` |
| Hikari pending | ✅ `0` |
| Nginx 5xx 30 min | ✅ `0` |
| API `ERROR` 15 min | ✅ `0` |
| Disque / mémoire / charge | ✅ 29 Gio libres, 24 % utilisé ; ~1,8 Gio mémoire disponible ; load 0.38/0.11/0.12 |

## Alertes qualifiées au T0

### `NotificationKillSwitchFerme` — warning, non bloquante

Alerte active depuis `2026-08-05T14:20:05Z`. Elle est attendue tant que les notifications externes restent volontairement désactivées. Le T0 confirme :

- `RESEND_EMAIL_ENABLED=false` ;
- `notification_outbox=0` ;
- `notification_delivery=0` ;
- aucun envoi externe.

Conclusion : **non bloquant**, cohérent avec K8/ADR-18 et le périmètre EP-18 Production validé sans activation Resend.

### `BackupHeartbeatMissing` — critical, non bloquante qualifiée

Alerte active depuis `2026-08-05T14:14:35Z`. Investigation :

- Pushgateway en fonctionnement (`loyertracker-pushgateway-1` running, `RestartCount=0`) ;
- aucune métrique backup présente dans Pushgateway ;
- cron backup hôte existe : `15 2 * * * cd /home/ubuntu/loyertracker ... backup-postgres.sh` ;
- le conteneur Pushgateway a été redémarré le 2026-08-05T14:13:21Z, ce qui purge les métriques volatiles ;
- le prochain cron quotidien n'a pas encore tourné depuis ce redémarrage.

Pattern déjà documenté dans l'historique Production (`BackupHeartbeatMissing` non bloquante après redémarrage/purge Pushgateway ou hôte éteint au moment du cron). Le backup Préflight EP-18 vérifié reste disponible.

Conclusion : **non bloquant pour T0**, à recontrôler à T+12/T+24 après fenêtre de cron.

## Décision T0

**Hypercare EP-18 T0 PASS. Aucun critère de suspension atteint.**

Prochaine étape : checkpoint **T+12** cible `2026-08-06T07:25:04Z ± 30 min`, puis T+24.
