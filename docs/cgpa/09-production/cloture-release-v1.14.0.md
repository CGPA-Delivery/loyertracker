# Clôture Release `1.14.0`

| Champ | Valeur |
|---|---|
| Date de clôture | 2026-07-28 |
| Heure CDO GO | ~15:49 UTC (après hypercare complète — cf. §5) |
| Release | `1.14.0` — EP-16 Sprint N+1 (WhatsApp P0, US-122/123) |
| Tag Production | `sha-27dce09d` |
| `PRODUCTION_DEPLOYED` | 2026-07-27 ~16:46 UTC (`validation-finale-v1.14.0-report.md`) |
| Statut | **RELEASE CLÔTURÉE** |

## 1. Récapitulatif du cycle `1.14.0`

| Étape | Date | Résultat | Référence |
|---|---|---|---|
| Gate Staging EP-16 Sprint N+1 | 2026-07-24 | GO — `STAGING_DEPLOYED`, vérification WhatsApp réelle en Staging | `gate-staging-sprint-n1-ep16-decision.md` |
| Gate Production Sprint N+1 | 2026-07-24 | GO sous réserve — `PRODUCTION_READY` (RSV-PROD-EP16-N1-01/02) | `gate-production-sprint-n1-ep16-decision.md` |
| Préflight Production | 2026-07-24 | PASS — backup vérifié, V28 additive confirmée | `preflight-backup-v1.14.0-report.md` |
| Déploiement technique | 2026-07-24 ~12:48 UTC | **Exécuté sans rapport écrit** — constaté et régularisé le 2026-07-27, techniquement conforme (digests exacts, `api`+`nginx` seuls recréés, Flyway 28/28) | `deploiement-technique-v1.14.0-report.md` |
| Écart de traçabilité `R-V54-2` | 2026-07-27 | **Récidive** de l'écart `1.11.0` — arbitrage PO, verrou d'état de release livré et éprouvé le jour même, **risque FERMÉ** | `plan-execution-rv542-verrou-etat-release.md` |
| Validation finale (smoke Production) | 2026-07-27 ~16:46 UTC | **63 PASS / 0 FAIL au premier passage** ; `PRODUCTION_DEPLOYED` | `validation-finale-v1.14.0-report.md` |
| Hypercare T0 | 2026-07-27 ~16:57 UTC | PASS — 0 résidu `notification_event` du run (leçon `1.13.0` appliquée) | `plan-etape-hypercare-v1.14.0.md` |
| Hypercare T+12 | 2026-07-28 15:33:34 UTC | **PASS sous surveillance** — rattrapage, fenêtre cible tombée hôte éteint | idem |
| Hypercare T+24 | 2026-07-28 15:44 UTC | **PASS sous surveillance** — anticipé ~1 h hors fenêtre sur instruction PO | idem |

## 2. Périmètre livré

**EP-16 — Notifications multicanales, Sprint N+1 (WhatsApp P0), US-122/123**

- Migration **V28 additive** : seed de 3 templates de notification et 2 fonctions
  `SECURITY DEFINER`. Rollback applicatif seul viable vers `1.13.0` (`sha-e4744d92`), aucun
  second backup post-migration requis.
- Capacité applicative WhatsApp livrée en Production **sans aucun canal externe actif**.
- **Aucun credential Twilio en Production**, aucune activation de flag externe, aucune
  modification Docker ou infrastructure.

Le volet notifications a été validé **en conditions réelles** : la validation finale a produit
8 `notification_event` sans qu'aucune ligne n'apparaisse dans `notification_outbox` ni
`notification_delivery`. Ce constat a été **confirmé sous trafic métier réel non simulé** pendant
l'hypercare (cf. §5), ce qui constitue la meilleure preuve obtenue à ce jour du respect de
K8 / ADR-18.

## 3. Réserves

| ID | Nature | Statut à la clôture |
|----|--------|---------------------|
| `RSV-PROD-EP16-N1-01` — aucune activation réelle des canaux externes | Condition **permanente** du Gate | ✅ **Satisfaite et vérifiée** aux trois checkpoints : `NOTIFICATIONS_EXTERNAL_ENABLED`/`TWILIO_WHATSAPP_ENABLED`/`TWILIO_SMS_ENABLED` à `false`, credentials Twilio de **longueur 0** et **absents du `.env`**, `outbox`/`delivery` à 0. **Reste permanente** jusqu'au GO du Sprint N+2 |
| `RSV-PROD-EP16-N1-02` — observabilité dédiée aux notifications externes | Non bloquante, prévue Sprint N+2 (US-126) | ⚠️ **MAINTENUE** — sans impact tant que les canaux restent inactifs |
| `R-V54-2` — récidive de l'écart de traçabilité de déploiement | Majeur gouvernance | ✅ **FERMÉ le 2026-07-27** — verrou d'état de release versionné livré et éprouvé (`infra/release/production-state.env` + `check-release-state.sh`) |
| Écart de fenêtre hypercare T+12 | Mineur exploitation | ✅ **Qualifié et tracé** — fenêtre 04:16–05:16 UTC tombée hôte volontairement éteint (boot 06:50:32 UTC), rattrapage immédiat, `RestartCount=0` couvrant la période (pattern `1.9.0`/`1.12.0`) |
| Écart de fenêtre hypercare T+24 | Mineur gouvernance | ⚠️ **Assumé et tracé** — anticipé d'~1 h et exécuté **hors fenêtre sur instruction PO explicite**, alors que l'hôte était allumé et la fenêtre atteignable. **Écart de pilotage, distinct d'une contrainte d'exploitation** ; la période 15:44–16:46 UTC n'a pas d'observation directe, mais reste couverte indirectement par `RestartCount=0` et l'absence totale d'erreur applicative |
| Alerte `BackupHeartbeatMissing` | Mineur exploitation | ⚠️ **Active mais non bloquante** — cron de backup à 02:15 UTC non joué (hôte éteint), Pushgateway purgé au boot. Pattern connu `1.10.0`/`1.13.0`, explicitement exclu des critères de suspension. Dernière sauvegarde vérifiée : Préflight du 2026-07-24 |
| `RSV-STG-01` (héritée) | Confirmation live `STG-ISOL-01` au prochain déploiement Staging | ⚠️ **MAINTENUE** — sans rapport avec `1.14.0` |
| `RSV-GHCR-EXT-01` | Absence de consommateur externe du tag `latest` non prouvée | ⚠️ **MAINTENUE** — DevSecOps Lead, échéance 2026-10-28, sans rapport avec `1.14.0` |
| `RSV-MIG-611-04` / `RSV-MIG-611-06` | Architecture / UX-Frontend | ⚠️ **MAINTENUES** — exigibles au prochain lot concerné, sans rapport avec `1.14.0` |

Aucune réserve bloquante ne subsiste sur le périmètre `1.14.0`.

## 4. État de Production au moment de la clôture

Relevé live le **2026-07-28 à 15:49:04 UTC**.

| Contrôle | Valeur |
|---|---|
| Tag Production | `sha-27dce09d` |
| Digest API | `sha256:089028b45a93afd4f12d5aa22cfc63a38f5687bb1d0f7204bc1965154ce8d7ff` |
| Digest Web | `sha256:7dbc551ee722e1da7697d71749b94a731fce0b028b7b7288c88d8346488e8bc8` |
| Flyway | V1→**V28** (28/28, 0 échec) |
| Services | 8/8 Up, 4/4 `(healthy)`, **`RestartCount=0`** depuis le boot hôte du 2026-07-28 06:50:32 UTC |
| Tables `notification_*` | 34 `event`, **0 `outbox`**, **0 `delivery`**, 3 `template`, 0 `preference` |
| Invariant financier | **0 écart** sur 8 garanties (13 mouvements) |
| Contrôle `OBS-S10-01` | **0 ligne ambiguë** — tri déterministe |
| Prometheus | 5/5 cibles `up` |
| Alertmanager | 1 alerte : `BackupHeartbeatMissing` (non bloquante, cf. §3) |
| Pool Hikari | `hikaricp_connections_pending` = 0 |
| 5xx / `ERROR` (15 min) | 0 / 0 — et **0 / 0 depuis le boot** |
| Données métier (baseline) | 3 bailleurs, 2 patrimoines, 8 biens, 8 baux, 8 garanties, 1 gestionnaire, 8 locataires, 7 quittances |
| `bailleur-test` | `enabled=false` ; `directAccessGrantsEnabled=false` (`loyertracker-spa` et `loyertracker-admin`) |
| Site public | `https://loyertracker.loyerpro.org` → 200 |

## 5. Décision CDO

**Chief Delivery Officer : GO — Release `1.14.0` CLÔTURÉE le 2026-07-28 (~15:49 UTC).**

- **Hypercare complète et sans incident** : T0 PASS, T+12 et T+24 **PASS sous surveillance**.
  Aucun critère de suspension atteint sur l'un des trois checkpoints. Sur tout le cycle : aucun
  redémarrage inattendu, aucune dérive de tag ni de digest, Flyway stable à 28/28, 0 erreur 5xx
  et 0 entrée `ERROR` applicative.
- **K8 / ADR-18 respecté et prouvé** : `NoopNotificationProvider` demeure l'unique fournisseur en
  service ; `notification_outbox` et `notification_delivery` sont restés à 0 aux trois
  checkpoints, credentials Twilio vides et absents du `.env`. `RSV-PROD-EP16-N1-01` est
  satisfaite et **reste une condition permanente**.
- **Intégrité financière vérifiée** : invariant du ledger de garantie à **0 écart**, contrôle
  `OBS-S10-01` à **0 ligne ambiguë**. Aucun écart d'intégrité — le critère qui imposerait un
  `NO GO` au titre de la Financial Governance n'est pas rencontré.
- **`R-V54-2` est FERMÉ** : la récidive de l'écart de traçabilité de déploiement, constatée sur
  ce cycle, a été traitée à la racine par un verrou d'état de release versionné livré et éprouvé
  le 2026-07-27. C'est le premier cycle où l'écart est non seulement consigné mais **structurellement
  neutralisé pour les suivants**.
- **Fait nouveau consigné — l'hypothèse « aucun trafic réel » est invalidée.** 17 événements
  métier réels ont été produits le 2026-07-27 entre 18:29 et 18:34 UTC par le bailleur
  `5df3adf2-…`. L'origine est **établie par `audit_log`**, non présumée : acteur unique, rôle
  `BAILLEUR`, 20 actions auditées (3 `RETENUE_LOYER` puis 14 `POINTER_PAIEMENT`), à cadence
  humaine. Usage légitime et intégralement tracé. Cette hypothèse, invoquée depuis `1.4.0` pour
  qualifier les écarts de fenêtre d'hypercare, **cesse d'être opposable** : la qualification doit
  désormais reposer sur `RestartCount=0` et les compteurs applicatifs mesurés. **Cette clôture ne
  vaut pas validation rétroactive** des qualifications antérieures qui s'en réclamaient ; elle
  corrige la règle pour l'avenir.
- **Deux écarts de fenêtre sont assumés et tracés**, non dissimulés : le T+12 en rattrapage
  (contrainte d'exploitation) et le T+24 anticipé hors fenêtre (choix de pilotage PO). Le second
  laisse la période 15:44–16:46 UTC sans observation directe ; c'est la raison pour laquelle les
  deux checkpoints sont qualifiés « PASS sous surveillance » et non `PASS` pleins. Cet écart est
  **mineur et non bloquant** au regard de l'ensemble des mesures conformes.
- **Prochaine action autorisée** : instruction PO explicite et distincte pour le **GO du Sprint
  N+2** (US-124/125/126). Son achèvement en GO reste la condition posée par K8 (ADR-18) pour
  toute activation de canal externe en Production. Aucun code, aucune migration, aucun credential
  Twilio, aucune promotion et aucun déploiement n'est autorisé par la présente clôture.

## 6. Base de rollback après clôture

`1.14.0` (`sha-27dce09d`) devient la **base de rollback** des releases suivantes. `1.13.0`
(`sha-e4744d92`) reste disponible localement sur l'hôte ; V28 étant additive, le rollback
applicatif seul demeure viable dans les deux sens.
