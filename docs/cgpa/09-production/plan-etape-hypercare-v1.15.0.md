# Plan Hypercare — Release `1.15.0` (EP-16 Sprint N+2 Lot A)

| Champ | Valeur |
|---|---|
| `PRODUCTION_DEPLOYED` | 2026-07-30 ~13:20 UTC (`validation-finale-v1.15.0-report.md`) |
| T0 | 2026-07-30 ~13:27–13:28 UTC — **PASS** (`date -u` vérifié : `2026-07-30T13:27:43Z`) |
| T+12 | cible **2026-07-31 ~01:20 UTC** ± 30 min — **PASS** (valeur probante réduite, cf. ci-dessous) |
| T+24 | cible **2026-07-31 ~13:20 UTC** ± 30 min — **PASS**, exécuté le 2026-08-04 (cf. ci-dessous) |
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

**Statut : PASS — contrôle très tardif, hors gabarit des écarts de fenêtre déjà tracés**

### Écart de fenêtre — retard majeur, distinct des anticipations/rattrapages précédents

Exécuté le **2026-08-04 de 15:24 à 15:32 UTC** (`date -u` vérifié en ouverture : `Tue Aug 4
15:24:08 UTC 2026`), soit **~4 jours 2 h après la cible** (2026-07-31 ~13:20 UTC), et non quelques
heures comme les écarts déjà qualifiés sur `1.7.0`/`1.8.0`/`1.9.0`/`1.12.0`/`1.14.0` (anticipations
ou rattrapages de l'ordre de 1 à 12 h). Ce n'est ni une anticipation ni un rattrapage au sens
habituel : c'est une reprise tardive du suivi d'hypercare, sur instruction explicite reçue le
2026-08-04. Conformément au principe retenu pour ce cycle (ne pas copier mécaniquement la
qualification des précédents), le résultat est qualifié sur la base des faits observés, pas du
gabarit.

**Accès à l'hôte** : la règle SSH (port 22) du security group `loyertracker-prod-sg`
(`sg-095b269cbd42907b0`) ne contenait plus l'IP d'egress de cette session (dérive déjà documentée
— le PO édite ce SG directement). Un ingress `52.29.80.119/32` a été ajouté (`sgr-0b187eac7a6b0d997`)
après confirmation explicite, pour permettre ce contrôle en lecture seule ; aucune autre règle
modifiée.

**Redémarrage complet de l'hôte constaté** : les 4 services applicatifs (`api`/`nginx`/`postgres`/
`keycloak`) ainsi que la chaîne `monitoring` affichaient tous `StartedAt=2026-08-04T15:07:1{4,5}Z`
— soit **17 minutes avant ce contrôle**, cohérent avec le pattern d'exploitation documenté (hôte
volontairement éteint entre les opérations, produit non annoncé publiquement). **Conséquence** :
`RestartCount=0` ne couvre que ces 17 dernières minutes, pas les ~4 jours écoulés depuis le T+12 —
ce contrôle ne peut donc pas non plus se prévaloir d'une continuité d'observation totale sur
l'intervalle. Il s'appuie à la place sur l'**état persistant** (base de données, Keycloak, `.env`,
digests d'image), qui a traversé ce ou ces cycles d'arrêt/redémarrage sans aucune dérive détectée —
un signal au moins aussi solide qu'un `RestartCount=0` continu, puisqu'il montre que l'état
appliqué (pas seulement le processus) est resté stable à travers les redémarrages.

| Contrôle | Résultat | vs T+12 |
|---|---|---|
| Stack | 8/8 actifs, 4/4 `(healthy)` ; `RestartCount=0` sur les 4 services applicatifs, mais `StartedAt=2026-08-04T15:07:1{4,5}Z` (redémarrage complet de l'hôte, 17 min avant ce contrôle) | **hôte redémarré depuis le T+12** — cf. note ci-dessus |
| Tag / digests | `check-release-state.sh --host` : digest API conforme ; **1 « ÉCART » signalé sur `nginx`, investigué et écarté** (cf. note ci-dessous — faux positif du script, pas une dérive réelle) ; `.env` hôte et digest réellement chargé (`docker inspect .Image` / `RepoDigests`) **identiques** à `sha256:9603330e…` (api) / `sha256:7dbc551e…` (web) | aucune dérive réelle |
| Flyway | **29/29**, confirmé par `check-release-state.sh --host` | identique |
| Tables `notification_*` | **34 `event`, 0 `outbox`, 0 `delivery`, 3 `template`, 0 `preference`** | identique — **`outbox`/`delivery` toujours à 0** |
| Résidu du RUN_ID de validation | **0 ligne** sur `bailleur_id=c7296c69-…` | identique |
| Baseline métier | 3 bailleurs, 2 patrimoines, 8 biens, 8 baux, 8 garanties, 13 mouvements, 1 gestionnaire, 8 locataires, 7 quittances | **inchangée**, malgré ~4 jours écoulés et un redémarrage complet |
| **Invariant financier** | **0 écart** sur les 8 garanties (requête `DISTINCT ON` par garantie, tri `date_mouvement desc, cree_le desc, id desc`) | identique |
| Contrôle `OBS-S10-01` (§2) | **0 ligne ambiguë** (requête de contrôle consignée rejouée telle quelle) | identique |
| Keycloak | `bailleur-test@test.local` `enabled=false` ; `directAccessGrantsEnabled=false` sur `loyertracker-spa` **et** `loyertracker-admin` (vérifié via `kcadm.sh` dans le conteneur, identifiants lus depuis l'environnement du conteneur, jamais affichés) | identique |
| Flags externes (conteneur `api`) | `NOTIFICATIONS_EXTERNAL_ENABLED=false`, `TWILIO_WHATSAPP_ENABLED=false`, `TWILIO_SMS_ENABLED=false`, `NOTIFICATION_DRY_RUN=true` | identique |
| Credentials Twilio (`.env` hôte) | **0 occurrence** `TWILIO_`/`NOTIFICATIONS_EXTERNAL_ENABLED`/`NOTIFICATION_FALLBACK_ENABLED` | identique |
| Santé | `/healthz` **200** ; `/api/actuator/health` **UP** ; site public `https://loyertracker.loyerpro.org` **200** | identique |
| Observabilité | Prometheus **5/5** cibles `up` ; Alertmanager **1 alerte active** : `NotificationKillSwitchFerme` (warning) — **nouvelle par rapport à T0/T+12, investiguée et qualifiée non bloquante** (cf. note ci-dessous) | **nouveau** — absent à T0/T+12 |
| Pool Hikari | `hikaricp_connections_pending` = **0** | identique |
| Logs Nginx (depuis le boot, 17 min) | **0** ligne 5xx | identique |
| Logs API (depuis le boot, 17 min) | **0** entrée `ERROR` | amélioration vs T0 |
| Capacité | 30 Gio disque libres (23 % utilisé), ~1,3 Gio mémoire disponible (`free -h`), charge 0,04 / 0,10 / 0,12 | stable |

**Aucun critère de suspension atteint.**

### Note — faux positif du verrou d'état de release sur le digest `nginx`

`infra/release/check-release-state.sh --host` a signalé une « DÉRIVE » sur `loyertracker-nginx-1`
(`docker inspect -f '{{.Config.Image}}'` renvoyait la forme `...loyertracker-web:sha-27dce09d`,
une référence par **tag**, alors que le fichier d'état déclare une référence par **digest**).
Vérification réelle menée avant de conclure : `docker inspect loyertracker-nginx-1 --format
'{{.Image}}'` (l'ID d'image local réellement exécuté) et `docker image inspect
...loyertracker-web:sha-27dce09d --format '{{.RepoDigests}}'` pointent tous deux vers
**exactement** `sha256:7dbc551ee722e1da7697d71749b94a731fce0b028b7b7288c88d8346488e8bc8` — le même
digest que celui déclaré dans `production-state.env` et que celui présent dans le `.env` hôte
(sous forme digest). **Aucune dérive réelle** : le conteneur `nginx` exécute bien l'image attendue,
seule la chaîne mise en cache par Docker au moment de la création du conteneur (non recréé depuis
`1.14.0`, cf. T0) diffère en forme littérale. **Dette technique identifiée, non corrigée ici** : le
script compare `Config.Image` (chaîne figée à la création du conteneur) au lieu de l'ID d'image ou
du `RepoDigests` réel — il produit un faux positif chaque fois que le format de référence du
`.env` change entre deux recréations d'un même conteneur. À corriger par un Plan d'Exécution
distinct (le script touche à l'outillage de gouvernance, hors périmètre d'une simple mise à jour
documentaire).

### Note — nouvelle alerte `NotificationKillSwitchFerme`, qualifiée non bloquante

Absente à T0 et T+12, cette alerte (règle `infra/monitoring/alerts.yml`,
`increase(notification_killswitch_bloque_total[30m]) > 0` pendant 5 min) est active depuis
`15:14:05Z`, soit ~7 min après le redémarrage complet de l'hôte. Investigation réelle (pas une
lecture de l'annotation seule) : `NotificationDispatcher` s'exécute toutes les ~15 s
(`scheduling-1`), journalise `WARN` « Dispatch de notifications suspendu :
app.notifications.external.enabled=false » à chaque cycle (92 occurrences en 24 min depuis le
boot, cohérent avec la cadence), et incrémente le compteur en conséquence (`89` au moment du
contrôle) — **sans jamais écrire dans `notification_outbox` ni `notification_delivery`** (tous
deux confirmés à 0 ci-dessus). L'annotation de la règle elle-même qualifie ce cas explicitement :
« Attendu pendant un incident Twilio ou avant activation ; anormal en régime nominal » — c'est
exactement l'état courant (canaux externes intentionnellement désactivés, K8/ADR-18, Sprint N+2
Lot B non GO). **Constat le plus probable** : cette règle d'alerte, livrée avec Sprint N+2 Lot A
(`1.15.0`), n'avait encore jamais été évaluée en continu par la chaîne `monitoring` avant ce
redémarrage (le déploiement technique du 2026-07-30 n'a recréé que `api`, pas les conteneurs
`prometheus`/`alertmanager` qui portent les règles) — ce contrôle est donc la **première
observation réelle** de cette alerte en conditions live, et elle se comporte comme conçu. Qualifiée
**non bloquante**, cohérente avec les critères de suspension (seule une ligne dans `outbox`/
`delivery`, ou un flag externe activé, déclencherait une suspension réelle).

## Synthèse de l'hypercare `1.15.0`

| Checkpoint | Cible | Exécution | Statut |
|---|---|---|---|
| T0 | — | 2026-07-30 ~13:27–13:28 UTC | **PASS** |
| T+12 | 2026-07-31 ~01:20 UTC | 2026-07-30 13:38–13:39 UTC (anticipé de ~12 h sur instruction PO explicite) | **PASS**, valeur probante réduite |
| T+24 | 2026-07-31 ~13:20 UTC | 2026-08-04 15:24–15:32 UTC (repris tardivement, ~4 j après la cible, sur instruction PO explicite) | **PASS** |

**Hypercare `1.15.0` sans incident** sur l'ensemble des trois checkpoints : aucune dérive de tag ni
de digest réelle, Flyway stable à 29/29, invariant financier à 0 écart sur les 8 garanties,
`OBS-S10-01` à 0 ligne ambiguë, 0 ligne en `notification_outbox`/`notification_delivery` du début à
la fin, aucun credential Twilio, `bailleur-test`/`directAccessGrants` désactivés en continu, 0 5xx
et 0 `ERROR` API non qualifiée à chaque contrôle. Un redémarrage complet de l'hôte est survenu
entre le T+12 et ce T+24 (pattern d'exploitation connu, hôte volontairement éteint) : l'état
persistant a traversé ce cycle sans dérive, ce qui constitue en soi une preuve de stabilité. Une
nouvelle alerte (`NotificationKillSwitchFerme`) et un faux positif du verrou d'état de release
(digest `nginx`) ont été découverts et investigués à ce T+24 — tous deux qualifiés sans impact.

**Les deux écarts de fenêtre de ce cycle (T+12 anticipé de ~12 h, T+24 repris ~4 jours après la
cible) sont d'une ampleur inédite dans l'historique du projet.** Ils sont tracés ici sans les
présenter comme équivalents aux anticipations/rattrapages de quelques heures déjà qualifiés sur
les cycles précédents — la valeur probante de ce cycle repose davantage sur la cohérence de l'état
persistant observé à trois moments distincts que sur une couverture continue de la fenêtre de 24 h.

La **surveillance planifiée est close**. La **clôture de release CDO reste un acte distinct**, non
prononcée par le présent document, subordonnée à une instruction PO explicite.

## Après l'hypercare

- **Clôture de release CDO `1.15.0`** — **GO le 2026-08-04 ~15:36 UTC**, sur instruction PO
  explicite reçue le même jour. Dossier : `docs/cgpa/09-production/cloture-release-v1.15.0.md`.
- L'activation des canaux externes reste interdite jusqu'à la clôture en GO du Sprint N+2
  **complet** (Lot A et Lot B), conformément à K8 (ADR-18) ; Lot B (US-125) reste bloqué.
- Dette technique identifiée, hors périmètre de cette hypercare : faux positif du digest `nginx`
  dans `infra/release/check-release-state.sh --host` (cf. note ci-dessus) — candidat à un futur
  Plan d'Exécution correctif.
