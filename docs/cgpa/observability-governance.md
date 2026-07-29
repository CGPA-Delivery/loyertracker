# Observability Governance — LoyerTracker

> Formalisation de l'Observability Governance CGPA v5.2
> (`setup-cgpa/docs/cgpa/observability-governance.md`). Couvre OBS-01/02/03. Traite la
> réserve **OBS-02/03** (alerting centralisé) du cap production. Document vivant.

## OBS-01 — Logs, métriques et supervision

| Pilier | Mise en œuvre |
|---|---|
| **Logs** | JSON ECS (`api`), JSON access log (`nginx`), sur stdout (12-factor). ENF-03 : aucune PII journalisée. |
| **Métriques** | Micrometer/Prometheus à `/api/actuator/prometheus` (JVM, `http_server_requests` avec histogramme p99, pool Hikari, métriques métier des jobs planifiés). Scrape **interne uniquement**, bloqué publiquement par Nginx (404). |
| **Supervision** | Serveur **Prometheus** auto-hébergé (profil Compose `monitoring`) scrutant API, sondes blackbox (PostgreSQL, Keycloak) et Pushgateway (backup) ; **Alertmanager** pour la notification. Healthchecks Docker + `/api/actuator/health` + `/healthz`. |

La profondeur est proportionnée (profil PME) : pas d'astreinte 24/7 ni de tableaux de bord
Grafana à ce stade ; alerting par webhook vers le canal de l'équipe.

## OBS-02 — Incidents critiques détectables

Alertes définies dans `infra/monitoring/alerts.yml`, évaluées par Prometheus, notifiées par
Alertmanager (`infra/monitoring/alertmanager.yml`) :

| Incident critique (exemple OBS-02) | Alerte |
|---|---|
| API indisponible | `ApiDown` |
| Base de données inaccessible | `PostgresProbeDown`, `DbPoolPendingConnections` |
| Erreur d'authentification massive | `AuthErrorSurge` |
| Taux d'erreur anormal | `ApiHighErrorRate` |
| Latence critique | `ApiHighLatency` |
| Job planifié bloqué | `BatchJobStale` |
| Sauvegarde en échec / absente | `BackupHeartbeatStale`, `BackupHeartbeatMissing` |

## OBS-03 — Composants critiques supervisés

| Composant critique | Mécanisme de supervision |
|---|---|
| API | scrape Micrometer (`up`, erreurs, latence, pool) |
| Base de données (PostgreSQL) | sonde TCP blackbox + métriques Hikari |
| Service d'identité (Keycloak) | sonde HTTP blackbox `/auth/health/ready` |
| Jobs planifiés (échéances/honoraires, alertes) | jauge `loyertracker_batch_last_success_epoch{job}` |
| Stockage / sauvegarde | heartbeat Pushgateway (`loyertracker_backup_last_success_epoch`) |

*Hors périmètre actuel (pas de file de messages ni de service externe critique dans
l'architecture MVP).*

## Niveau minimal et exploitation

Détection : automatique (Prometheus/Alertmanager) **et** manuelle (runbook §7/§8,
`docker compose ps`, logs). Procédures d'incident et **validation par simulation** : runbook
`docs/cgpa/07-devsecops/runbook-exploitation.md` §7. Activation : overlay
`docker-compose.monitoring.yml` (profil `monitoring`, opt-in), combinable avec le compose de base
(dev) ou de staging ; notification injectée par `.env` (`ALERTMANAGER_WEBHOOK_URL`, jamais versionnée).

## Addendum EP-16 Sprint N+2 — Notifications externes (US-126)

*Extension **additive** : aucun élément OBS-01/02/03 ci-dessus n'est modifié ni retiré. Ce
addendum étend le périmètre supervisé à la chaîne de notification externe, qui devient le premier
**service externe critique** de l'architecture — cas explicitement noté « hors périmètre » du MVP
jusqu'à EP-16.*

### Composant critique ajouté (OBS-03)

| Composant | Sonde |
|---|---|
| Chaîne de notification externe (Twilio WhatsApp/SMS) | compteurs et jauges `notification_*` exposés par l'API sur `/api/actuator/prometheus` |

### Incidents détectables ajoutés (OBS-02)

Quatre règles portant toutes le label `component: notifications` (`infra/monitoring/alerts.yml`) :

| Alerte | Sévérité | Signification |
|---|---|---|
| `NotificationBudgetProche` | warning | Consommation ≥ 80 % du plafond mensuel — avertit **avant** l'arrêt, pour laisser arbitrer |
| `NotificationBudgetEpuise` | critical | Plafond atteint : dispatch arrêté, notifications en file (aucune perte) |
| `NotificationEchecPermanentEleve` | warning | > 20 % d'échecs définitifs — symptôme de configuration, pas d'incident réseau |
| `NotificationKillSwitchFerme` | warning | Dispatch suspendu volontairement : attendu en incident, anormal en régime nominal |

### Métriques exposées (OBS-01)

`notification_dispatch_total{canal,issue}`, `notification_fallback_total{issue}`,
`notification_budget_consomme`, `notification_budget_plafond`,
`notification_budget_bloque_total`, `notification_killswitch_bloque_total`.

### Contrainte structurante — aucune PII en label

**Aucun label de ces métriques ne porte de donnée personnelle**, et cette propriété doit être
préservée par toute évolution ultérieure. Les seules dimensions autorisées sont des énumérations
fermées (canal, issue). Deux raisons cumulatives, l'une technique et l'autre réglementaire : chaque
valeur de label crée une série temporelle persistante — un numéro de téléphone ou un identifiant de
destinataire produirait une cardinalité non bornée ; et Prometheus n'est pas un système conçu pour
héberger des données personnelles, ni soumis aux mêmes contrôles d'accès que la base sous RLS.

La supervision indique **qu'**un problème existe et de quelle nature ; `notification_outbox` et
`notification_delivery`, sous RLS, indiquent **qui** est concerné.

### Exploitation

Runbook dédié : `docs/cgpa/runbook-notifications.md` — incident Twilio, kill switch, reprise
manuelle bornée, plafond budgétaire, rotation des secrets, diagnostic du fallback.

## Lien avec les gates

- **Gate Staging Readiness (enrichi v5.2)** : logs disponibles ✅, monitoring actif ✅,
  alertes critiques définies ✅ — à re-valider sur staging par simulation d'incident.
- **Gate 07A — Release Readiness** : l'observabilité fait partie des prérequis de promotion
  production.

---
*Livrable CGPA v5.2 — Observability Governance (OBS-01/02/03). Réf. :
`setup-cgpa/docs/cgpa/observability-governance.md`. Voir `infra/monitoring/` et le runbook §7.*
