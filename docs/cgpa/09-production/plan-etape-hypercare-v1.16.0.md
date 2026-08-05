# Plan Hypercare — Release `1.16.0` (EP-18 Notifications EMAIL Resend)

| Champ | Valeur |
|---|---|
| `PRODUCTION_DEPLOYED` | 2026-08-05T19:25:04Z (`validation-finale-ep18-notifications-email-resend-report.md`) |
| T0 | 2026-08-05T19:57:29Z — **PASS** |
| T+12 | cible 2026-08-06T07:25:04Z ± 30 min — pré-check anticipé 2026-08-05T21:05:52Z **PASS technique / WARN fenêtre** |
| T+24 | cible 2026-08-06T19:25:04Z ± 30 min — pré-check anticipé 2026-08-05T21:57:20Z **PASS technique / WARN fenêtre** |
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

## Pré-check T+12 — 2026-08-05T21:05:52Z

**Statut : PASS technique / WARN fenêtre.** Contrôles exécutés immédiatement sur instruction PO explicite, en avance sur la fenêtre cible T+12 (`2026-08-06T07:25:04Z ± 30 min`). Les preuves ci-dessous ne montrent aucun critère de suspension Production, mais ne clôturent pas à elles seules la fenêtre officielle si le PO exige une mesure strictement dans la bande cible.

| Contrôle | Résultat |
|---|---:|
| PR #377 / dépôt local | ✅ mergée (`e381357120b71f40e8a88bbd3882a3a7ac89f9b1`) ; `main` local à jour `origin/main` |
| Hôte Production | ✅ resynchronisé `main` sur `e381357120b71f40e8a88bbd3882a3a7ac89f9b1` ; seules sauvegardes `.env.bak*` non suivies présentes |
| `check-release-state.sh --host` | ✅ **COHÉRENT** — release `1.16.0`, tag `sha-8c9f1e4a`, Flyway réel `31` |
| API | ✅ healthy, `RestartCount=0`, `StartedAt=2026-08-05T18:55:22Z`, digest EP-18 attendu |
| Web/Nginx | ✅ healthy, `RestartCount=0`, `StartedAt=2026-08-05T18:55:22Z`, digest EP-18 attendu |
| PostgreSQL | ✅ healthy, `RestartCount=0`, `StartedAt=2026-08-05T14:13:21Z` |
| Keycloak | ✅ healthy, `RestartCount=0`, `StartedAt=2026-08-05T14:13:21Z` |
| `/healthz` / racine publique | ✅ `200` / `200` |
| Flyway | ✅ `31/31` ; dernières migrations V31 `ep18 sprint b invitation email`, V30 `ep18 sprint a email resend fondation` |
| `notification_event/outbox/delivery/template/preference` | ✅ `34 / 0 / 0 / 4 / 0` |
| Baseline métier | ✅ `3 bailleurs, 2 patrimoines, 8 biens, 8 baux, 8 garanties, 1 gestionnaire, 8 locataires, 7 quittances` |
| `directAccessGrantsEnabled` | ✅ `false` |
| `bailleur-test@test.local` | ✅ `enabled=false` |
| Resend | ✅ `RESEND_EMAIL_ENABLED=false`, `RESEND_FROM_EMAIL` absent ; secrets seulement présents par métadonnée (`SET len=N`), valeurs non lues/non exposées |
| Prometheus | ✅ `5/5` cibles `up` |
| Hikari pending | ✅ `0` |
| Nginx 5xx 12 h | ✅ `0` |
| API `ERROR` 12 h | ⚠️ 1 ligne qualifiée : `duplicate key value violates unique constraint "bailleur_keycloak_id_key"` à `2026-08-05T19:25:14Z`, pattern du smoke Production final déjà qualifié, sans résidu ni outbox/delivery |
| Disque / mémoire / charge | ✅ `/` 24 % utilisé, 29 Gio libres ; ~1,8 Gio mémoire disponible ; load 0.39/0.13/0.03 |

## Alertes qualifiées au pré-check T+12

### `NotificationKillSwitchFerme` — warning, non bloquante

Alerte active depuis `2026-08-05T14:20:05Z`. Qualification inchangée et renforcée : le kill-switch est volontairement fermé, `RESEND_EMAIL_ENABLED=false`, `notification_outbox=0`, `notification_delivery=0`, aucun canal externe activé.

Conclusion : **non bloquant**, attendu tant que Resend et les canaux externes restent fermés.

### `BackupHeartbeatMissing` — critical, non bloquante qualifiée au moment du pré-check

Alerte active depuis `2026-08-05T14:14:35Z`. Preuves relevées : `backup_metric_series=0`, cron hôte présent (`15 2 * * * ... backup-postgres.sh`), dernier `backup.log` disponible daté `2026-07-30T02:15:01Z`, Pushgateway volatil depuis le redémarrage de la stack. Au moment de l'exécution anticipée (`2026-08-05T21:05Z`), la prochaine fenêtre cron quotidienne `02:15 UTC` suivant le redémarrage n'avait pas encore rejoué.

Conclusion : **non bloquant pour ce pré-check**, à requalifier dans la fenêtre officielle T+12/T+24 après passage potentiel du cron.

## Décision pré-check T+12

**Aucun critère technique de suspension n'est atteint.** Décision opérationnelle : **PASS technique / WARN fenêtre** car l'exécution a eu lieu avant la cible T+12. Resend reste désactivé ; aucune migration, aucun smoke destructif, aucune suppression de données et aucune activation externe n'ont été effectués.


## Pré-check T+24 — 2026-08-05T21:57:20Z

**Statut : PASS technique / WARN fenêtre.** Contrôles exécutés immédiatement sur instruction PO explicite, **~21h27m44 avant la cible** (`2026-08-06T19:25:04Z ± 30 min`). Les preuves ci-dessous ne montrent aucun critère de suspension Production, mais ne remplacent pas une observation dans la fenêtre T+24 officielle sauf acceptation PO/CDO de ce compromis de gouvernance.

| Contrôle | Résultat |
|---|---:|
| Dépôt local / hôte | ✅ `main` à jour `origin/main` ; hôte Production resynchronisé sur `21b7e4d` |
| `check-release-state.sh --host` | ✅ **COHÉRENT** — release `1.16.0`, tag `sha-8c9f1e4a`, Flyway réel `31` |
| API | ✅ healthy, `RestartCount=0`, `StartedAt=2026-08-05T18:55:22Z`, digest EP-18 attendu |
| Web/Nginx | ✅ healthy, `RestartCount=0`, `StartedAt=2026-08-05T18:55:22Z`, digest EP-18 attendu |
| PostgreSQL | ✅ healthy, `RestartCount=0`, `StartedAt=2026-08-05T14:13:21Z` |
| Keycloak | ✅ healthy, `RestartCount=0`, `StartedAt=2026-08-05T14:13:21Z` |
| `/healthz` / racine publique | ✅ `200 / 200` |
| Flyway | ✅ `31/31` ; dernières migrations V31 `ep18 sprint b invitation email`, V30 `ep18 sprint a email resend fondation`, V29 `ep16 sprint n2 budget notifications` |
| `notification_event/outbox/delivery/template/preference` | ✅ `34 / 0 / 0 / 4 / 0` |
| Baseline métier | ✅ `3 bailleurs, 2 patrimoines, 8 biens, 8 baux, 8 garanties, 1 gestionnaire, 8 locataires, 7 quittances` |
| `directAccessGrantsEnabled` | ✅ `false` |
| `bailleur-test@test.local` | ✅ `enabled=false` |
| Resend | ✅ `RESEND_EMAIL_ENABLED=false`, `RESEND_FROM_EMAIL` absent ; secrets présents uniquement comme métadonnée redacted par le terminal, valeurs non lues/non exposées |
| Prometheus | ✅ `5/5` cibles `up` |
| Hikari pending | ✅ `0` |
| Nginx 5xx 24 h | ✅ `0` |
| API `ERROR` 24 h | ⚠️ 1 ligne qualifiée : `duplicate key value violates unique constraint "bailleur_keycloak_id_key"` à `2026-08-05T19:25:14Z`, pattern du smoke Production final déjà qualifié, sans résidu ni outbox/delivery |
| Backups | ⚠️ dernier dump listé `2026-08-04T17:52:00Z` ; cron `15 2 * * * ... backup-postgres.sh` présent ; prochain cron quotidien non encore rejoué depuis le redémarrage/Pushgateway volatil |
| Disque / mémoire / charge | ✅ `/` 24 % utilisé, 29 Gio libres ; ~1,8 Gio mémoire disponible ; load 0.09/0.03/0.01 |

## Alertes qualifiées au pré-check T+24

### `NotificationKillSwitchFerme` — warning, non bloquante

Alerte active depuis `2026-08-05T14:20:05Z`. Qualification inchangée : le kill-switch est volontairement fermé, `RESEND_EMAIL_ENABLED=false`, `notification_outbox=0`, `notification_delivery=0`, aucun canal externe activé.

Conclusion : **non bloquant**, attendu tant que Resend et les canaux externes restent fermés.

### `BackupHeartbeatMissing` — critical, non bloquante qualifiée au moment du pré-check

Alerte active depuis `2026-08-05T14:14:35Z`. Preuves relevées : cron hôte présent (`15 2 * * * ... backup-postgres.sh`), historique `backup.log` avec heartbeats réussis jusqu'au `2026-07-30`, dernier dump listé `2026-08-04T17:52:00Z`, Pushgateway volatil redémarré/purgé depuis la dernière fenêtre de backup. Au moment de ce pré-check (`2026-08-05T21:57Z`), le cron quotidien `02:15 UTC` suivant le redémarrage n'avait pas encore rejoué.

Conclusion : **non bloquant pour ce pré-check**, mais à requalifier dans la vraie fenêtre T+24 si le PO/CDO exige une mesure à `2026-08-06T19:25:04Z ± 30 min`.

## Décision pré-check T+24

**Aucun critère technique de suspension n'est atteint.** Décision opérationnelle : **PASS technique / WARN fenêtre** car l'exécution a eu lieu avant la cible T+24 officielle. Resend reste désactivé ; aucune migration, aucun smoke destructif, aucune suppression de données et aucune activation externe n'ont été effectués.
