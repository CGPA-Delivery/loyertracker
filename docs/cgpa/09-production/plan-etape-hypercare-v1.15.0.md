# Plan Hypercare — Release `1.15.0` (EP-16 Sprint N+2 Lot A)

| Champ | Valeur |
|---|---|
| `PRODUCTION_DEPLOYED` | 2026-07-30 ~13:20 UTC (`validation-finale-v1.15.0-report.md`) |
| T0 | 2026-07-30 ~13:27–13:28 UTC — **PASS** (`date -u` vérifié : `2026-07-30T13:27:43Z`) |
| T+12 | cible **2026-07-31 ~01:20 UTC** ± 30 min — à instruire |
| T+24 | cible **2026-07-31 ~13:20 UTC** ± 30 min — à instruire |
| Tag surveillé | `sha-ac374193` |
| Rollback | `sha-27dce09d` (`1.14.0`) — image présente localement ; viable même après application de V29 (additive) |

## Critères de suspension

- restart inattendu, service non healthy ou dérive de tag/digest ;
- erreur 5xx ou régression sur le socle existant ;
- **toute ligne apparaissant dans `notification_outbox` ou `notification_delivery`** : aucun
  dispatch n'est possible tant que les canaux externes sont désactivés — une seule ligne serait le
  signal d'une activation non voulue et impose la suspension immédiate ;
- activation inattendue d'un flag externe (`NOTIFICATIONS_EXTERNAL_ENABLED` /
  `TWILIO_WHATSAPP_ENABLED` / `TWILIO_SMS_ENABLED`) ou apparition d'un credential `TWILIO_*`
  renseigné dans le `.env` hôte (K8, ADR-18) ;
- hausse anormale des 5xx, pool Hikari en attente, ou alerte non qualifiée ;
- `bailleur-test` ou `directAccessGrants` retrouvés actifs de façon inattendue ;
- réapparition de l'invariant financier en écart, ou du garde-fou `OBS-S10-01` (ambiguïté de tri
  des mouvements de garantie).

## Checkpoint T0 — 2026-07-30 ~13:27–13:28 UTC (`date -u` vérifié)

**Statut : PASS**

| Contrôle | Résultat |
|---|---|
| Smoke | 65/0 au second passage propre (validation finale, RUN_ID `1785417509`, après resynchronisation du dépôt hôte) |
| Stack | 8/8 actifs, 4/4 `healthy`, `RestartCount=0` sur les 4 services applicatifs (`api` recréé `2026-07-30T12:31:51Z` par le déploiement technique ; `nginx`/`postgres`/`keycloak` `StartedAt=2026-07-29T07:43:43Z`, non recréés dans ce lot) |
| Tag / digests | `API_IMAGE_REF` `sha256:9603330e…`, `WEB_IMAGE_REF` `sha256:7dbc551e…` (inchangé) — conformes au Gate/Préflight/déploiement technique |
| Flyway | **29/29** |
| Tables `notification_*` | **34 `event`, 0 `outbox`, 0 `delivery`, 3 `template`, 0 `preference`** — identiques à l'état pré-/post-validation |
| Résidu des RUN_ID de validation | **0 ligne** `notification_event` sur `bailleur_id=c7296c69-…` (`bailleur-test`) |
| Baseline métier | 3 bailleurs, 2 patrimoines, 8 biens, 8 baux, 8 garanties, 13 mouvements, 1 gestionnaire, 8 locataires, 7 quittances — inchangée |
| **Invariant financier** | **0 écart** — `garantie.solde_actuel` = `solde_apres` du dernier `garantie_movement` (tri `date_mouvement desc, cree_le desc, id desc`), pour les 8 garanties |
| **`OBS-S10-01`** (garde-fou ambiguïté de tri) | **0 ligne** — aucun `(garantie_id, date_mouvement, cree_le)` partagé par deux mouvements ; tri déterministe |
| Keycloak | `bailleur-test@test.local` `enabled=false` ; `directAccessGrantsEnabled=false` sur `loyertracker-spa` |
| Flags externes (conteneur `api`) | `NOTIFICATIONS_EXTERNAL_ENABLED=false`, `TWILIO_WHATSAPP_ENABLED=false`, `TWILIO_SMS_ENABLED=false`, `NOTIFICATION_DRY_RUN=true` |
| Credentials Twilio (`.env` hôte) | **0 occurrence** `TWILIO_`/`NOTIFICATIONS_EXTERNAL_ENABLED`/`NOTIFICATION_FALLBACK_ENABLED` |
| Santé | `/healthz` 200 ; site public `https://loyertracker.loyerpro.org` 200 |
| Observabilité | Prometheus **5/5** cibles `up` ; Alertmanager **0 alerte active** |
| Pool Hikari | `hikaricp_connections_pending` = **0** |
| Logs Nginx (15 min) | **0** ligne 5xx |
| Logs API (15 min) | **2** entrées `ERROR` — voir note ci-dessous, **non nouvelles, déjà documentées** |
| Capacité | 30 Gio disque libres (23 % utilisé), ~1,7 Gio mémoire disponible, charge 0,33 / 0,21 / 0,14 |

### Note — les 2 lignes `ERROR` sont résiduelles de la validation finale, pas un nouvel incident

Les deux entrées `ERROR` (`13:17:38Z`, `13:18:37Z` — `duplicate key value violates unique
constraint "bailleur_keycloak_id_key"`) sont **exactement 2 des 3 occurrences déjà identifiées et
expliquées** dans `validation-finale-v1.15.0-report.md` (pattern connu depuis l'hypercare `1.10.0`
et la validation `1.14.0` : ré-inscription de `bailleur-test` déjà enregistré, correctement gérée
en 409). Elles apparaissent dans la fenêtre glissante de 15 minutes de ce T0 uniquement parce que
le contrôle a été exécuté ~9 minutes après la validation finale — **aucune nouvelle occurrence**
générée entre la validation finale et ce T0. Aucun impact fonctionnel, aucune action requise.

## Checkpoint T+12 — cible 2026-07-31 ~01:20 UTC ± 30 min

**Statut : PASS — anticipé de ~12 h sur instruction PO explicite, valeur probante réduite**

### Écart de fenêtre — anticipation majeure, qualifiée et non comparable aux précédentes

Exécuté le **2026-07-30 à 13:38–13:39 UTC** (`date -u` vérifié), soit **T+0h18**, alors que la
cible réelle T+12 est le 2026-07-31 ~01:20 UTC. Contrairement aux anticipations déjà tracées sur
`1.7.0`/`1.8.0`/`1.14.0` (~1 h d'écart), **cet écart est de l'ordre de ~12 h** : quasiment aucun
temps réel supplémentaire ne s'est écoulé depuis le T0 (13:27–13:28 UTC) au moment de ce contrôle.
Ce checkpoint **ne peut donc pas apporter la même garantie qu'un T+12 réel** — il confirme
seulement l'absence de régression dans les ~10 minutes suivant le T0, pas la stabilité sur 12 h de
service. Exécuté sur **instruction PO explicite** (« Instruis le checkpoint T+12 »), après
clarification du décalage de fenêtre et confirmation explicite de vouloir procéder malgré tout.

**La cible T+24 n'est pas avancée en conséquence** : elle reste 2026-07-31 ~13:20 UTC (24 h réelles
après `PRODUCTION_DEPLOYED`), afin de préserver au moins une observation à distance temporelle
réelle significative sur ce cycle.

| Contrôle | Résultat | vs T0 |
|---|---|---|
| Stack | 8/8 actifs, 4/4 `healthy`, `RestartCount=0` (`api` `StartedAt=2026-07-30T12:31:51Z` inchangé) | identique |
| Tag / digests | `API_IMAGE_REF` `sha256:9603330e…`, `WEB_IMAGE_REF` `sha256:7dbc551e…` | identiques — aucune dérive |
| Flyway | **29/29** | identique |
| Tables `notification_*` | **34 `event`, 0 `outbox`, 0 `delivery`, 3 `template`, 0 `preference`** | identique |
| Résidu du RUN_ID de validation | **0 ligne** sur `bailleur_id=c7296c69-…` | identique |
| **Activité métier depuis le T0** | **0** ligne `audit_log` postérieure à `2026-07-30 13:28:00` | cohérent avec ~10 min écoulées |
| Baseline métier | 3 bailleurs, 2 patrimoines, 8 biens, 8 baux, 8 garanties, 13 mouvements, 1 gestionnaire, 8 locataires, 7 quittances | inchangée |
| Invariant financier | **0 écart** | identique |
| `OBS-S10-01` | **0 ligne ambiguë** | identique |
| Keycloak | `bailleur-test` `enabled=false` ; `directAccessGrantsEnabled=false` | identique |
| Flags externes | `NOTIFICATIONS_EXTERNAL_ENABLED=false`, `TWILIO_WHATSAPP_ENABLED=false`, `TWILIO_SMS_ENABLED=false`, `NOTIFICATION_DRY_RUN=true` | identique |
| Credentials Twilio (`.env`) | **0 occurrence** | identique |
| Santé | `/healthz` 200 ; site public 200 | identique |
| Observabilité | Prometheus **5/5** `up` ; Alertmanager **0 alerte** | identique |
| Pool Hikari | `hikaricp_connections_pending` = **0** | identique |
| Logs Nginx (70 min) | **0** ligne 5xx | — |
| Logs API (20 min, hors fenêtre de la validation finale) | **0** entrée `ERROR` | amélioration vs T0 (2 résiduelles) |
| Capacité | 30 Gio disque libres (23 %), ~1,7 Gio mémoire disponible, charge 0,47/0,17/0,12 | stable |

**Aucun critère de suspension atteint.** Ce PASS ne dispense pas d'une observation à une échéance
réellement éloignée dans le temps ; le T+24 réel (2026-07-31 ~13:20 UTC) reste la seule occasion de
ce cycle d'observer un intervalle de service significatif.

## Checkpoint T+24 — cible 2026-07-31 ~13:20 UTC ± 30 min

**À instruire.**

## Après l'hypercare

- **Clôture de release CDO** `1.15.0` — étape distincte, sur instruction PO, interdite avant que
  T+12 et T+24 ne soient statués.
- L'activation des canaux externes reste interdite jusqu'à la clôture en GO du Sprint N+2
  **complet** (Lot A et Lot B), conformément à K8 (ADR-18) ; Lot B (US-125) reste bloqué.
