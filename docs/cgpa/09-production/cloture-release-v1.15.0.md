# Clôture Release `1.15.0`

| Champ | Valeur |
|---|---|
| Date de clôture | 2026-08-04 |
| Heure CDO GO | ~15:36 UTC (après hypercare complète — cf. §5) |
| Release | `1.15.0` — EP-16 Sprint N+2 **Lot A** (fallback SMS contrôlé et garde-fous, US-124/126) |
| Tag Production | `sha-ac374193` |
| `PRODUCTION_DEPLOYED` | 2026-07-30 ~13:20 UTC (`validation-finale-v1.15.0-report.md`) |
| Statut | **RELEASE CLÔTURÉE** |

## 1. Récapitulatif du cycle `1.15.0`

| Étape | Date | Résultat | Référence |
|---|---|---|---|
| Gate Staging EP-16 Sprint N+2 Lot A | 2026-07-28 | GO — `STAGING_DEPLOYED`, sprint scindé (Lot B hors périmètre) | `gate-staging-sprint-n2-ep16-decision.md` |
| Gate Production Sprint N+2 Lot A | 2026-07-29 | GO sous réserve — `PRODUCTION_READY` (`RSV-MIG-611-04`, `RSV-EP16-N2-02`) | `gate-production-sprint-n2-ep16-decision.md` |
| Préflight Production | 2026-07-29 ~18:05–18:13 UTC | PASS — backup vérifié, aucune réserve bloquante héritée de `1.14.0` | `preflight-backup-v1.15.0-report.md` |
| Déploiement technique | 2026-07-30 ~12:27–12:33 UTC | **Rédigé dans la même session que la bascule** — `R-V54-2` non récidivé. Bascule ciblée `api` uniquement, migration V29 additive, `nginx`/`postgres`/`keycloak` non recréés | `deploiement-technique-v1.15.0-report.md` |
| Validation finale (smoke Production) | 2026-07-30 ~13:20 UTC | Deux passages : 64/1 (dérive de synchronisation dépôt, non applicative) puis **65 PASS / 0 FAIL au second passage propre** ; `PRODUCTION_DEPLOYED` | `validation-finale-v1.15.0-report.md` |
| Hypercare T0 | 2026-07-30 ~13:27–13:28 UTC | PASS | `plan-etape-hypercare-v1.15.0.md` |
| Hypercare T+12 | 2026-07-30 13:38–13:39 UTC | **PASS, valeur probante réduite** — anticipé de ~12 h sur instruction PO explicite | idem |
| Hypercare T+24 | 2026-08-04 15:24–15:32 UTC | **PASS** — repris tardivement, ~4,5 jours après la cible, sur instruction PO explicite du 2026-08-04 | idem |

## 2. Périmètre livré

**EP-16 — Notifications multicanales, Sprint N+2 Lot A (fallback SMS et garde-fous), US-124/126**

- Migration **V29 strictement additive** : une seule fonction `SECURITY DEFINER`
  (`notification_envois_du_mois`), aucune table ni colonne modifiée. Rollback applicatif seul
  viable vers `1.14.0` (`sha-27dce09d`).
- Fallback SMS contrôlé sur échec WhatsApp `PERMANENT`, jamais automatique
  (`NOTIFICATION_FALLBACK_ENABLED=false` par défaut, K5) ; kill switch câblé
  (`NOTIFICATIONS_EXTERNAL_ENABLED`) ; plafond budgétaire mensuel bloquant
  (`NOTIFICATION_BUDGET_MENSUEL_MAX=0` par défaut) ; métriques `notification.*` et alertes
  Alertmanager dédiées ; canal SMS pris en charge par `TwilioNotificationProvider` (livré,
  **non activé**).
- Capacité applicative livrée en Production **sans aucun canal externe actif**. **Aucun credential
  Twilio en Production**, aucune activation de flag externe, aucune modification Docker ou
  infrastructure au-delà du service `api`.
- **Lot B (US-125, interface préférences/historique) reste hors périmètre** de cette release,
  toujours bloqué par les Gates 02A/04A Frontend (`RSV-MIG-611-06`). Conformément à K8 (ADR-18),
  toute activation réelle de canal externe reste interdite jusqu'à la clôture en GO du Sprint N+2
  **complet** (Lot A **et** Lot B) — non atteinte par cette clôture, qui ne porte que sur le Lot A.

Le kill switch a été vérifié en conditions réelles à trois reprises (T0, T+12, T+24) :
`NoopNotificationProvider` reste l'unique fournisseur en service, `notification_outbox` et
`notification_delivery` sont restés à **0** à chaque contrôle, et le comportement de suspension du
dispatch (`NotificationDispatcher`, alerte `NotificationKillSwitchFerme`) a été observé et
investigué en direct au T+24 — fonctionnant exactement comme conçu.

## 3. Réserves

| ID | Nature | Statut à la clôture |
|----|--------|---------------------|
| `RSV-MIG-611-04` — addendum DAT et décision OpenAPI (Enterprise Architect) | Ouverte, non bloquante | ⚠️ **MAINTENUE** — reportée comme aux releases précédentes, sans échéance bloquante fixée, sans rapport spécifique avec `1.15.0` |
| `RSV-EP16-N2-02` — couverture des échecs de livraison asynchrones par le fallback SMS | Limite de conception constatée en Staging (vrais appels Twilio) | ⚠️ **MAINTENUE, non bloquante** — à arbitrer PO/Enterprise Architect dans un lot futur ; sans impact tant que le fallback SMS n'est pas activé en Production |
| `RSV-MIG-611-06` — Gates 02A/04A Frontend | Bloquante **pour US-125 (Lot B) uniquement** | ⚠️ **MAINTENUE** — sans rapport avec le périmètre Lot A clôturé ici |
| Écart de fenêtre hypercare T+12 | Mineur gouvernance | ✅ **Qualifié et tracé** — anticipé de ~12 h sur instruction PO explicite, hôte allumé, fenêtre atteignable ; valeur probante réduite assumée, pas dissimulée |
| Écart de fenêtre hypercare T+24 | Mineur gouvernance, ampleur inédite | ✅ **Qualifié et tracé** — repris ~4,5 jours après sa cible sur instruction PO explicite du 2026-08-04 ; l'écart le plus important de l'historique du projet, documenté comme tel plutôt que rapproché des anticipations de quelques heures des cycles précédents |
| Redémarrage complet de l'hôte entre T+12 et T+24 | Mineur exploitation | ✅ **Qualifié** — pattern connu (hôte volontairement éteint) ; état persistant (DB, Keycloak, digests) vérifié intact à travers ce redémarrage |
| Faux positif digest `nginx` — `check-release-state.sh --host` | Dette technique outillage | ⚠️ **MAINTENUE, non bloquante** — script compare `Config.Image` (chaîne figée à la création du conteneur) au lieu du digest réel ; digest réellement exécuté confirmé conforme. Correction hors périmètre, candidat à un Plan d'Exécution distinct |
| Nouvelle alerte `NotificationKillSwitchFerme` | Observabilité, comportement conforme | ✅ **Qualifiée non bloquante** — kill switch fermé comme attendu tant que les canaux externes restent désactivés (K8/ADR-18) ; 0 ligne en `outbox`/`delivery` tout au long du cycle |
| `RSV-STG-01` (héritée) | Confirmation live `STG-ISOL-01` au prochain déploiement Staging | ⚠️ **MAINTENUE** — sans rapport avec `1.15.0` |
| `RSV-GHCR-EXT-01` | Absence de consommateur externe du tag `latest` non prouvée | ⚠️ **MAINTENUE** — DevSecOps Lead, échéance 2026-10-28, sans rapport avec `1.15.0` |

Aucune réserve bloquante ne subsiste sur le périmètre `1.15.0` (Lot A).

## 4. État de Production au moment de la clôture

Relevé live le **2026-08-04 à 15:36:28 UTC**.

| Contrôle | Valeur |
|---|---|
| Tag Production | `sha-ac374193` |
| Digest API | `sha256:9603330ea530d2fe4e90b49a63e648c7a8b7679e8819f026f79e8108ca14557a` |
| Digest Web | `sha256:7dbc551ee722e1da7697d71749b94a731fce0b028b7b7288c88d8346488e8bc8` (inchangé depuis `1.14.0` — Lot A ne touche pas Nginx/Web) |
| Flyway | V1→**V29** (29/29, 0 échec) |
| Services | 8/8 conteneurs `Up`, 4/4 `(healthy)`, tous démarrés `2026-08-04T15:07:1{4,5}Z` (redémarrage complet de l'hôte, 29 min avant ce relevé — pattern d'exploitation connu) |
| Tables `notification_*` | 34 `event`, **0 `outbox`**, **0 `delivery`**, 3 `template`, 0 `preference` |
| Invariant financier | **0 écart** sur 8 garanties (13 mouvements) |
| Contrôle `OBS-S10-01` | **0 ligne ambiguë** — tri déterministe |
| Prometheus | 5/5 cibles `up` |
| Alertmanager | 1 alerte : `NotificationKillSwitchFerme` (qualifiée non bloquante, cf. §3) |
| Pool Hikari | `hikaricp_connections_pending` = 0 |
| 5xx / `ERROR` (depuis le boot, 29 min) | 0 / 0 |
| Données métier (baseline) | 3 bailleurs, 2 patrimoines, 8 biens, 8 baux, 8 garanties, 1 gestionnaire, 8 locataires, 7 quittances |
| `bailleur-test` | `enabled=false` ; `directAccessGrantsEnabled=false` (`loyertracker-spa` et `loyertracker-admin`) |
| Credentials Twilio (`.env` hôte) | 0 occurrence |
| Site public | `https://loyertracker.loyerpro.org` → 200 ; `/healthz` → 200 |

## 5. Décision CDO

**Chief Delivery Officer : GO — Release `1.15.0` (Lot A) CLÔTURÉE le 2026-08-04 (~15:36 UTC).**

- **Hypercare complète et sans incident** : T0 PASS, T+12 PASS (valeur probante réduite,
  anticipation majeure), T+24 PASS (repris très tardivement). Aucun critère de suspension atteint
  sur l'un des trois checkpoints. Sur tout le cycle : aucune dérive de tag ni de digest réelle,
  Flyway stable à 29/29, 0 erreur 5xx et 0 entrée `ERROR` applicative non qualifiée.
- **K8 / ADR-18 respecté et prouvé** : `NoopNotificationProvider` demeure l'unique fournisseur en
  service ; `notification_outbox` et `notification_delivery` sont restés à 0 aux trois checkpoints
  et au relevé de clôture, credentials Twilio absents du `.env`. La nouvelle alerte
  `NotificationKillSwitchFerme`, observée pour la première fois en conditions live à ce cycle, en
  est la preuve directe : le kill switch fonctionne exactement comme conçu.
- **Intégrité financière vérifiée** : invariant du ledger de garantie à **0 écart** sur les 8
  garanties, contrôle `OBS-S10-01` à **0 ligne ambiguë**, à chaque contrôle du cycle y compris au
  relevé de clôture. Aucun écart d'intégrité — le critère qui imposerait un `NO GO` au titre de la
  Financial Governance n'est pas rencontré.
- **Deux écarts de fenêtre assumés et tracés, non dissimulés, d'une ampleur inédite dans
  l'historique du projet** : T+12 anticipé de ~12 h (choix de pilotage PO) et T+24 repris ~4,5
  jours après sa cible (reprise tardive du suivi, sur instruction PO explicite du 2026-08-04). Ni
  l'un ni l'autre n'est comparable aux écarts de quelques heures déjà qualifiés sur les cycles
  précédents (`1.7.0`, `1.8.0`, `1.9.0`, `1.12.0`, `1.14.0`) — traités comme tels dans le plan
  d'hypercare, pas rapprochés mécaniquement du même gabarit. La valeur probante de ce cycle repose
  davantage sur la cohérence de l'état persistant observé à trois moments distincts, y compris à
  travers un redémarrage complet de l'hôte entre T+12 et T+24, que sur une couverture continue de
  la fenêtre de 24 h.
- **Deux découvertes du T+24 intégrées ici sans être minimisées** : un faux positif du verrou
  d'état de release sur le digest `nginx` (dette technique d'outillage, consignée, correction hors
  périmètre) et l'alerte `NotificationKillSwitchFerme` (comportement conforme à la conception,
  qualifiée non bloquante). Aucune des deux ne constitue un écart d'intégrité ou de sécurité.
- **`R-V54-2` reste fermé** : le déploiement technique de `1.15.0` a été rédigé dans la même
  session que la bascule (contrairement à `1.11.0`/`1.14.0`), confirmant que le verrou d'état de
  release livré à la clôture de `1.14.0` continue de prévenir la récidive.
- **Prochaine action autorisée** : instruction PO explicite et distincte pour le **GO du Sprint
  N+2 complet** (Lot B, US-125), condition posée par K8 (ADR-18) pour toute activation de canal
  externe en Production — Lot B reste bloqué par les Gates 02A/04A Frontend
  (`RSV-MIG-611-06`). Aucun code, aucune migration, aucun credential Twilio, aucune promotion et
  aucun déploiement n'est autorisé par la présente clôture.

## 6. Base de rollback après clôture

`1.15.0` (`sha-ac374193`, digest API) devient la **base de rollback applicatif** des releases
suivantes ; `1.14.0` (`sha-27dce09d`) reste disponible localement sur l'hôte. V29 étant additive,
le rollback applicatif seul demeure viable dans les deux sens. Le digest Web reste celui de
`1.14.0` (`sha256:7dbc551e…`) — Lot A n'a jamais recréé `nginx`.
