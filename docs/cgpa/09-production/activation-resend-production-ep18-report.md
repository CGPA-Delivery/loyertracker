# Activation Resend Production EP-18 — rapport opérationnel

| Champ | Valeur |
|---|---|
| Date UTC | `2026-08-06T00:21:46Z` |
| Release | `1.16.0` / `sha-8c9f1e4a` |
| Instruction PO | « Active le resend » |
| Décision | **RESEND_PRODUCTION_ENABLED** |
| Type | Activation opérationnelle ciblée, sans migration |

## Pré-checks

| Contrôle | Résultat |
|---|---:|
| `check-release-state.sh --host` avant activation | ✅ cohérent |
| `/healthz` public avant activation | ✅ `200` |
| Token Resend | ✅ présent, valeur non exposée |
| `RESEND_EMAIL_ENABLED` initial | `false` |
| `RESEND_FROM_EMAIL` initial | absent |
| `notification_outbox` / `notification_delivery` initial | `0 / 0` |

## Actions réalisées

1. Backup hôte `.env` avant activation Resend : `.env.bak-pre-resend-activation-20260806T001756Z`.
2. Activation initiale Resend :
   - `RESEND_EMAIL_ENABLED=true` ;
   - `RESEND_FROM_EMAIL=onboarding@resend.dev` ;
   - `RESEND_FROM_NAME=LoyerTracker` ;
   - `RESEND_BASE_URL=https://api.resend.com`.
3. Détection d'une activation incomplète :
   - `NOTIFICATIONS_EXTERNAL_ENABLED` absent → kill-switch externe global fermé ;
   - `NOTIFICATION_DRY_RUN=true` par défaut ;
   - budget global `0/0` → dispatch suspendu par plafond.
4. Backup hôte `.env` avant ouverture externe : `.env.bak-pre-resend-external-enable-20260806T002013Z`.
5. Ouverture contrôlée :
   - `NOTIFICATIONS_EXTERNAL_ENABLED=true` ;
   - `NOTIFICATION_DRY_RUN=false`.
6. Détection d'un drift Compose : le budget `NOTIFICATION_BUDGET_MENSUEL_MAX` était lu par l'application mais non transmis au conteneur API par `docker-compose.yml`.
7. Backup hôte Compose + `.env` avant correction budget :
   - `docker-compose.yml.bak-pre-resend-budget-20260806T002146Z` ;
   - `.env.bak-pre-resend-budget-20260806T002146Z`.
8. Correctif Compose appliqué : propagation de `NOTIFICATION_BUDGET_MENSUEL_MAX` et `NOTIFICATION_BUDGET_SEUIL_ALERTE` au service `api`.
9. Budget conservateur défini :
   - `NOTIFICATION_BUDGET_MENSUEL_MAX=100` ;
   - `NOTIFICATION_BUDGET_SEUIL_ALERTE=0.8`.
10. Recréation ciblée **API uniquement** via `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps api`.

## Invariants de déploiement

| Service | Changement |
|---|---:|
| `api` | ✅ recréé |
| `nginx` | ✅ inchangé |
| `postgres` | ✅ inchangé |
| `keycloak` | ✅ inchangé |
| Migrations Flyway | ✅ aucune nouvelle migration |
| Données DB | ✅ aucune suppression |
| Smoke destructif | ✅ non exécuté |

## État runtime final

| Variable / métrique | Valeur finale |
|---|---:|
| `NOTIFICATIONS_EXTERNAL_ENABLED` | `true` |
| `NOTIFICATION_DRY_RUN` | `false` |
| `NOTIFICATION_BUDGET_MENSUEL_MAX` | `100` |
| `NOTIFICATION_BUDGET_SEUIL_ALERTE` | `0.8` |
| `RESEND_EMAIL_ENABLED` | `true` |
| `RESEND_API_KEY` | `SET` — valeur non exposée |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` |
| `RESEND_FROM_NAME` | `LoyerTracker` |
| `RESEND_BASE_URL` | `https://api.resend.com` |
| `TWILIO_WHATSAPP_ENABLED` / `TWILIO_SMS_ENABLED` | `false / false` |
| `notification_budget_consomme` | `0` |
| `notification_budget_plafond` | `100` |
| `notification_outbox` / `notification_delivery` | `0 / 0` |
| `notification_event/template/preference` | `34 / 4 / 0` |

## Vérifications finales

| Contrôle | Résultat |
|---|---:|
| API | ✅ `healthy` |
| Nginx/PostgreSQL/Keycloak | ✅ healthy, non recréés |
| `/healthz` public | ✅ `200` |
| Racine publique | ✅ `200` |
| Release lock hôte | ✅ cohérent |
| Logs API récents | ✅ aucune erreur / exception Resend |
| Budget | ✅ `0 / 100` |

## Alertes

`NotificationKillSwitchFerme` reste encore firing immédiatement après activation. Qualification : non bloquant à cet instant, car la règle Prometheus est basée sur `increase(notification_killswitch_bloque_total[30m]) > 0` avec `for: 5m`; les blocages générés avant l'ouverture complète restent visibles pendant la fenêtre de 30 minutes. À recontrôler après expiration de la fenêtre.

`BackupHeartbeatMissing` reste une alerte d'exploitation déjà qualifiée pendant l'hypercare : Pushgateway volatil / cron backup quotidien à revalider séparément.

## Décision

**RESEND_PRODUCTION_ENABLED — PASS avec réserve de surveillance courte.**

L'activation technique Production est effective et vérifiée, sous plafond conservateur `100` envois/mois. Aucun e-mail de test externe n'a été envoyé pendant cette activation pour éviter un trafic artificiel non demandé.
