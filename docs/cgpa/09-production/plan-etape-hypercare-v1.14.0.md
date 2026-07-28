# Plan Hypercare — Release `1.14.0` (EP-16 Sprint N+1 — WhatsApp P0)

| Champ | Valeur |
|---|---|
| `PRODUCTION_DEPLOYED` | 2026-07-27 ~16:46 UTC (`validation-finale-v1.14.0-report.md`) — déploiement technique réel du 2026-07-24, statut prononcé à la date de sa preuve |
| T0 | 2026-07-27 ~16:57 UTC — **PASS** (`date -u` vérifié : `2026-07-27T16:57:05Z`) |
| T+12 | cible **2026-07-28 ~04:46 UTC** ± 30 min — à instruire |
| T+24 | cible **2026-07-28 ~16:46 UTC** ± 30 min — à instruire |
| Tag surveillé | `sha-27dce09d` |
| Rollback | `sha-e4744d92` (`1.13.0`) — images présentes localement ; viable même après application de V28 (additive) |

## Particularité de cette hypercare

La release a été **déployée le 2026-07-24 et validée seulement le 2026-07-27** (écart de
traçabilité `R-V54-2`). L'hypercare ne couvre donc pas les trois jours de service antérieurs à la
validation : ceux-ci ont été contrôlés a posteriori (0 `ERROR`, 0 5xx, 0 alerte sur 26 h au
constat du 2026-07-27) mais **sans télémétrie continue observée en temps réel**. La fenêtre
d'hypercare démarre à la date de la preuve, conformément au principe retenu pour `1.11.0`.

## Critères de suspension

- restart inattendu, service non healthy ou dérive de tag/digest ;
- erreur 5xx ou régression sur le socle existant ;
- **toute ligne apparaissant dans `notification_outbox` ou `notification_delivery`** : aucun
  dispatch n'est possible tant que les canaux externes sont désactivés — une seule ligne serait le
  signal d'une activation non voulue et impose la suspension immédiate ;
- activation inattendue d'un flag externe (`NOTIFICATIONS_EXTERNAL_ENABLED` /
  `TWILIO_WHATSAPP_ENABLED` / `TWILIO_SMS_ENABLED`) ou apparition d'un credential `TWILIO_*`
  renseigné dans le `.env` hôte (K8, ADR-18) ;
- hausse anormale des 5xx, pool Hikari en attente ou alerte non qualifiée ;
- `bailleur-test` ou `directAccessGrants` retrouvés actifs de façon inattendue.

## Checkpoint T0 — 2026-07-27 ~16:57 UTC (`date -u` vérifié)

**Statut : PASS**

| Contrôle | Résultat |
|---|---|
| Smoke | 63/0 au premier passage (validation finale, RUN_ID `1785170429`) |
| Stack | 8/8 actifs, 4/4 healthy, `RestartCount=0` sur les 4 services applicatifs (`StartedAt=2026-07-26T14:42:00Z` — redémarrage complet de l'hôte antérieur à la validation, aucun redémarrage causé par elle) |
| Tag / digests | `sha-27dce09d` ; API `sha256:089028b4…`, Web `sha256:7dbc551e…` — conformes au Gate/Préflight |
| Flyway | 28/28 |
| Tables `notification_*` | **17 `event`, 0 `outbox`, 0 `delivery`, 3 `template`, 0 `preference`** — identiques à l'état pré-validation |
| **Résidu du RUN_ID de validation** | **0 ligne** `notification_event` sur `bailleur_id=c7296c69-…` — voir note ci-dessous |
| Baseline métier | 3 bailleurs, 2 patrimoines, 8 biens, 8 baux, 8 garanties, 1 gestionnaire, 8 locataires, 7 quittances — inchangée |
| Keycloak | `bailleur-test` désactivé ; `directAccessGrantsEnabled=false` sur `loyertracker-spa` |
| Flags externes | `NOTIFICATIONS_EXTERNAL_ENABLED=false`, `TWILIO_WHATSAPP_ENABLED=false`, `TWILIO_SMS_ENABLED=false`, `NOTIFICATION_DRY_RUN=true` |
| Santé | `/healthz` 200 ; site public `https://loyertracker.loyerpro.org` 200 |
| Observabilité | Prometheus **5/5** cibles `up` ; Alertmanager **0 alerte active** |
| Pool Hikari | `hikaricp_connections_pending` = **0** |
| Logs Nginx (15 min) | **0** ligne 5xx |
| Logs API (15 min) | **0** entrée `ERROR` |
| Capacité | 30 Gio disque libres (22 % utilisé), ~1 Gio mémoire disponible (`free -g`, valeur arrondie), charge 0,00 / 0,03 / 0,06 |

### Note — le résidu `notification_event` de `1.13.0` ne s'est pas reproduit

Le T0 de `1.13.0` avait découvert **8 lignes `notification_event`** laissées en base par le
nettoyage de la validation finale : la table, introduite par V27 et alimentée en écriture inline
par les mêmes opérations métier que celles exercées par le smoke, n'avait pas été ajoutée à la
liste de vérification post-nettoyage. La leçon enregistrée était de l'y inclure explicitement.

**Cette leçon a été appliquée** : la validation finale `1.14.0` a supprimé les 8
`notification_event` du run dans sa transaction de nettoyage, après avoir vérifié que les 17
événements préexistants appartenaient à un bailleur réel (`5df3adf2-…`) et non au compte de test.
Le contrôle T0 confirme **0 ligne résiduelle** sur `bailleur_id=c7296c69-…`. Aucune correction
n'a été nécessaire à ce checkpoint, contrairement à `1.13.0`.

### Note — `BackupHeartbeatMissing` absente à ce T0

Contrairement aux T0 de `1.10.0` et `1.13.0`, aucune alerte `BackupHeartbeatMissing` n'est active :
le backup du Préflight `1.14.0` (2026-07-24) a poussé un heartbeat, et l'hôte est allumé en continu
depuis le 2026-07-26 14:41 UTC. Le pattern reste susceptible de réapparaître si l'hôte est éteint
à 02h15 UTC (cron de backup) — il serait alors non bloquant et sans rapport avec `1.14.0`.

## Checkpoint T+12 — cible 2026-07-28 ~04:46 UTC ± 30 min

**Statut : PASS sous surveillance** — exécuté le **2026-07-28 à 15:33:34 UTC** (`date -u`
capturé sur l'hôte), soit **≈ T+22h47**.

### Écart de fenêtre — qualifié

La fenêtre cible (04:16–05:16 UTC) est tombée **hôte volontairement éteint** : le boot est
horodaté **2026-07-28 06:50:32 UTC** (`who -b`, corroboré par `uptime` et par le `StartedAt`
identique des quatre services applicatifs). Le contrôle live a été exécuté en rattrapage dès la
session d'instruction suivante. `RestartCount=0` depuis le boot couvre l'intégralité de la
période observée. Même qualification que `1.9.0` et `1.12.0`.

| Contrôle | Résultat |
|---|---|
| Stack | 8/8 actifs, 4/4 `(healthy)`, `RestartCount=0` sur les 4 services applicatifs (`StartedAt=2026-07-28T06:50:32Z` = boot hôte, aucun redémarrage de service) |
| Tag / digests | `LOYERTRACKER_TAG=sha-27dce09d` ; API `sha256:089028b45a93afd4…`, Web `sha256:7dbc551ee722e1da…` — **conformes au Gate, au Préflight et au T0** |
| Flyway | **28/28** succès, 0 échec |
| Tables `notification_*` | **34 `event`, 0 `outbox`, 0 `delivery`, 3 `template`, 0 `preference`** — `event` en hausse de 17, voir note ci-dessous ; **`outbox`/`delivery` à 0** |
| Résidu du RUN_ID de validation | **0 ligne** `notification_event` sur `bailleur_id=c7296c69-…` |
| Baseline métier | 3 bailleurs, 2 patrimoines, 8 biens, 8 baux, 8 garanties, 1 gestionnaire, 8 locataires, 7 quittances — **inchangée** |
| **Invariant financier** | **0 écart** — pour les 8 garanties, `garantie.solde_actuel` = `solde_apres` du dernier `garantie_movement` (tri `date_mouvement desc, cree_le desc`) ; 0 garantie sans mouvement |
| Contrôle `OBS-S10-01` (§2 de l'arbitrage) | **0 ligne** — aucun `cree_le` partagé entre deux mouvements d'une même garantie ; tri déterministe, garde-fou **non déclenché** (voir note) |
| Keycloak | `bailleur-test@test.local` **désactivé** (`enabled=f`) ; `direct_access_grants_enabled=f` sur `loyertracker-spa` **et** `loyertracker-admin` |
| Flags externes | `NOTIFICATIONS_EXTERNAL_ENABLED=false`, `TWILIO_WHATSAPP_ENABLED=false`, `TWILIO_SMS_ENABLED=false`, `NOTIFICATION_DRY_RUN=true` |
| **Credentials Twilio** | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM` → **longueur 0** (vides) ; **0 occurrence** de `TWILIO_` dans le `.env` hôte — **K8 / ADR-18 respecté** |
| Santé | `/healthz` **200** ; site public `https://loyertracker.loyerpro.org` **200** |
| Observabilité | Prometheus **5/5** cibles `up` ; Alertmanager **1 alerte active** : `BackupHeartbeatMissing` — **qualifiée non bloquante**, voir note |
| Pool Hikari | `hikaricp_connections_pending` = **0** |
| Logs Nginx | **0** ligne 5xx sur 15 min **et 0 depuis le boot** |
| Logs API | **0** entrée `ERROR` sur 15 min **et 0 depuis le boot** |
| Capacité | 30 Gio disque libres (22 % utilisé), ~1 Gio mémoire disponible, charge 0,02 / 0,02 / 0,01 |

**Aucun critère de suspension atteint.**

### Note — 17 événements métier réels créés après le T0

`notification_event` est passé de **17** (T0) à **34**. Les 17 lignes nouvelles ont été créées le
**2026-07-27 entre 18:29:45 et 18:34:42 UTC**, soit **après le T0** (16:57 UTC) : 3
`GARANTIE_DEBITEE` puis 14 `PAIEMENT_RECU`, toutes sur le bailleur **réel** `5df3adf2-…`.

L'origine est **établie factuellement** par `audit_log`, et non présumée : **un acteur unique**,
`5df3adf2-…`, rôle **`BAILLEUR`**, 20 actions auditées sur la fenêtre — 3 `RETENUE_LOYER`
(`garantie_movement`) accompagnées de 3 `RETENUE_LOYER_GARANTIE` (`paiement`), puis 14
`POINTER_PAIEMENT`. Aucune autre activité ce jour-là, aucun compte de test impliqué. L'espacement
régulier de 10 à 20 secondes correspond à une cadence d'utilisation humaine de l'IHM. La
corrélation avec les 17 `notification_event` est exacte.

**Conclusion : usage métier légitime du bailleur réel, authentifié et intégralement audité.**
Aucune ligne n'est apparue dans `notification_outbox` ni `notification_delivery` — le
`NoopNotificationProvider` reste l'unique fournisseur actif et **aucun envoi externe n'a été
possible**, ce que ce trafic réel vient précisément démontrer en conditions non simulées.

**Conséquence transverse à enregistrer** : l'hypothèse permanente « produit non annoncé,
**aucun trafic réel** », utilisée de façon répétée pour qualifier les écarts de fenêtre
d'hypercare depuis `1.4.0`, **n'est plus vraie**. Elle doit cesser d'être invoquée telle quelle ;
la qualification des écarts de fenêtre doit désormais reposer sur `RestartCount=0` et sur les
compteurs applicatifs, non sur une présomption d'absence d'activité.

### Note — `OBS-S10-01` : garde-fou vérifié, **non déclenché**, observation maintenue close

L'assiette du ledger a **significativement changé** depuis l'arbitrage du 2026-07-05, qui
reposait sur « les 3 garanties réelles ont chacune 1 seul mouvement ». Mesure au présent
checkpoint : **13 mouvements sur 8 garanties**, dont **2 garanties portant plusieurs
mouvements** :

| Garantie | Mouvements | Détail |
|---|---|---|
| `b5c743db…` | 3 | `DEPOT_INITIAL` 600,00 (07-08) puis 2 × `RETENUE_LOYER` 200,00 (07-15) → soldes 600,00 / 400,00 / 200,00 |
| `459a934a…` | 4 | `DEPOT_INITIAL` 2100,00 (07-08) puis 3 × `RETENUE_LOYER` 700,00 (07-27) → soldes 2100,00 / 1400,00 / 700,00 / 0,00 |

Le garde-fou n° 1 impose de rejouer **la requête de contrôle consignée au §2 de l'arbitrage**,
qui groupe sur `garantie_id, date_mouvement, **cree_le**` — la condition d'ambiguïté est un
`cree_le` **identique** (même transaction), et non une simple coïncidence de journée.

**Résultat de la requête officielle : 0 ligne.** Le contrôle est confirmé par le comptage des
`cree_le` distincts : la garantie à 4 mouvements porte **4 `cree_le` distincts**, celle à 3
mouvements en porte **3**. Chaque mouvement provient donc d'une **transaction distincte**, et le
tri `ORDER BY date_mouvement, cree_le, id` est **pleinement déterministe** — le tie-break par
UUID n'est jamais atteint.

C'est exactement le comportement bénin anticipé au §3 de l'arbitrage : « chaque endpoint métier
insère un seul mouvement par transaction — deux appels distincts obtiennent des `cree_le`
distincts ». L'apparition de garanties multi-mouvements **ne constitue pas** le « premier cas
réel » visé par le garde-fou.

**`OBS-S10-01` reste ACCEPTÉE EN L'ÉTAT et CLOSE.** Aucune réouverture n'est justifiée. Deux
éléments sont toutefois consignés pour la suite :

1. L'assiette ayant cessé d'être triviale, la requête de contrôle §2 devient un **contrôle
   d'hypercare permanent**, à rejouer à chaque checkpoint plutôt qu'à la faveur d'une
   observation ponctuelle.
2. Le **garde-fou n° 2 reste entier et non matérialisé** : toute future fonctionnalité insérant
   plusieurs mouvements de garantie **dans une même transaction** (batch, import, reprise)
   recréerait la condition et doit prévoir un ordre déterministe explicite, à vérifier au Gate
   Staging du sprint concerné.

L'invariant financier est par ailleurs vérifié à **0 écart** : aucune donnée n'est fausse.

### Note — `BackupHeartbeatMissing` active, qualifiée non bloquante

Alerte active depuis **2026-07-28 07:20:35 UTC**. Cause établie : le cron de sauvegarde est
programmé à **02:15 UTC** (`15 2 * * *`, `crontab -l` vérifié) et l'hôte était éteint à cette
heure ; le Pushgateway, purgé au boot de 06:50 UTC, ne porte donc aucun heartbeat. Pattern
récurrent et documenté (`1.10.0`, `1.13.0`), **explicitement exclu des critères de suspension**,
sans rapport avec `1.14.0`. La dernière sauvegarde vérifiée reste celle du Préflight du
2026-07-24.

## Checkpoint T+24 — cible 2026-07-28 ~16:46 UTC ± 30 min

**Statut : PASS sous surveillance** — exécuté le **2026-07-28 de 15:43:52 à 15:44:25 UTC**
(`date -u` capturé sur l'hôte), soit **≈ T+22h58**.

### Écart de fenêtre — qualifié

Le checkpoint a été **anticipé d'environ 1 h sur la cible** et exécuté **hors de la fenêtre**
(16:16–17:16 UTC), sur **instruction explicite du PO** demandant son exécution immédiate. L'hôte
était allumé et la fenêtre atteignable ; l'anticipation relève donc d'un choix de pilotage
assumé, non d'une contrainte d'exploitation. Elle est tracée à ce titre, sans impact sur les
mesures. Précédents d'anticipation qualifiée : `1.7.0` et `1.8.0` (T+24 anticipé d'~7 h).

En conséquence, la qualification retenue est **« PASS sous surveillance »** et non un `PASS`
plein : la période 15:44–16:46 UTC n'est pas couverte par une observation directe. Elle reste
néanmoins couverte indirectement par `RestartCount=0` depuis le boot et par l'absence totale
d'erreur applicative sur toute la journée.

| Contrôle | Résultat | vs T+12 |
|---|---|---|
| Stack | 8/8 actifs, 4/4 `(healthy)`, `RestartCount=0` (`StartedAt=2026-07-28T06:50:32Z` inchangé) | identique |
| Tag / digests | `sha-27dce09d` ; API `sha256:089028b45a93afd4…`, Web `sha256:7dbc551ee722e1da…` | identiques — **aucune dérive** |
| Flyway | **28/28** succès, 0 échec | identique |
| Tables `notification_*` | **34 `event`, 0 `outbox`, 0 `delivery`, 3 `template`, 0 `preference`** | identique — **`outbox`/`delivery` toujours à 0** |
| Résidu du RUN_ID de validation | **0 ligne** sur `bailleur_id=c7296c69-…` | identique |
| Baseline métier | 3 bailleurs, 2 patrimoines, 8 biens, 8 baux, 8 garanties, 1 gestionnaire, 8 locataires, 7 quittances | **inchangée** |
| **Activité métier depuis le T+12** | **0 action** dans `audit_log` depuis 15:33 UTC — explique la stabilité de `notification_event` à 34 | — |
| **Invariant financier** | **0 écart** sur les 8 garanties ; 13 mouvements au total | identique |
| Contrôle `OBS-S10-01` (§2) | **0 ligne ambiguë** | identique |
| Keycloak | `bailleur-test@test.local` `enabled=false` ; `direct_access_grants_enabled=false` sur `loyertracker-spa` **et** `loyertracker-admin` | identique |
| Flags externes | `NOTIFICATIONS_EXTERNAL_ENABLED=false`, `TWILIO_WHATSAPP_ENABLED=false`, `TWILIO_SMS_ENABLED=false`, `NOTIFICATION_DRY_RUN=true` | identique |
| **Credentials Twilio** | `ACCOUNT_SID`, `AUTH_TOKEN`, `WHATSAPP_FROM` → **longueur 0** ; **0 occurrence** dans le `.env` — **K8 / ADR-18 respecté** | identique |
| Santé | `/healthz` **200** ; site public `https://loyertracker.loyerpro.org` **200** | identique |
| Observabilité | Prometheus **5/5** cibles `up` ; Alertmanager **1 alerte** : `BackupHeartbeatMissing` (qualifiée non bloquante, cf. note T+12) | identique |
| Pool Hikari | `hikaricp_connections_pending` = **0** | identique |
| Logs Nginx | **0** ligne 5xx sur 15 min **et 0 depuis le boot** | identique |
| Logs API | **0** entrée `ERROR` sur 15 min **et 0 depuis le boot** | identique |
| Capacité | 30 Gio disque libres (22 % utilisé), ~1 Gio mémoire disponible, charge 0,38 / 0,14 / 0,05 | stable |

**Aucun critère de suspension atteint.**

## Synthèse de l'hypercare `1.14.0`

| Checkpoint | Cible | Exécution | Statut |
|---|---|---|---|
| T0 | — | 2026-07-27 ~16:57 UTC | **PASS** |
| T+12 | 2026-07-28 ~04:46 UTC | 2026-07-28 15:33:34 UTC (rattrapage, hôte éteint en fenêtre) | **PASS sous surveillance** |
| T+24 | 2026-07-28 ~16:46 UTC | 2026-07-28 15:44 UTC (anticipé ~1 h sur instruction PO) | **PASS sous surveillance** |

**Hypercare `1.14.0` sans incident.** Sur l'ensemble du cycle : aucun redémarrage inattendu,
aucune dérive de tag ni de digest, Flyway stable à 28/28, invariant financier à 0 écart, 0 ligne
en `notification_outbox`/`notification_delivery`, aucun credential Twilio, 0 erreur 5xx et 0
entrée `ERROR` applicative. Les deux écarts de fenêtre sont qualifiés et tracés ; la seule alerte
active (`BackupHeartbeatMissing`) est un pattern d'exploitation connu, exclu des critères de
suspension.

La surveillance planifiée est **close**. La **clôture de release CDO reste un acte distinct**,
non prononcé par le présent document et subordonné à une instruction PO explicite.

### Rappel du pattern d'exploitation

L'hôte est **volontairement éteint entre les opérations** (produit non annoncé publiquement). Les
fenêtres T+12 et T+24 tombent fréquemment hôte éteint : dans ce cas, un contrôle live en
rattrapage est exécuté dès le redémarrage suivant et qualifié **« PASS sous surveillance »**,
l'écart de fenêtre étant tracé sans impact — précédents `1.9.0`, `1.12.0`. À l'inverse, si l'hôte
reste allumé (cas de `1.10.0`), `RestartCount=0` couvre rétroactivement toute la fenêtre.

**Correction apportée par ce cycle** : la formulation historique ajoutait « aucun trafic réel ».
Le T+12 de `1.14.0` a établi le contraire (17 événements métier réels du bailleur `5df3adf2-…`
le 2026-07-27). La qualification d'un écart de fenêtre doit donc s'appuyer sur `RestartCount=0`
et sur les compteurs applicatifs mesurés, **jamais sur une présomption d'absence d'activité**.

La clôture de release CDO reste **interdite avant que T+12 et T+24 ne soient statués**.

## Après l'hypercare

- **Clôture de release CDO** `1.14.0` — étape distincte, sur instruction PO.
- **`R-V54-2` est FERMÉ** depuis le 2026-07-27 : le verrou d'état de release
  (`infra/release/production-state.env` + `infra/release/check-release-state.sh`) a été livré et
  éprouvé le jour même, sur GO explicite du PO. *(La rédaction initiale de ce plan, antérieure à
  la livraison, indiquait « reste ouvert » — mention corrigée ici.)*
- **`OBS-S10-01` reste close** — garde-fou rejoué au T+12 avec la requête de contrôle consignée :
  **0 ligne**, tri déterministe, aucune réouverture justifiée. La requête devient un contrôle
  d'hypercare permanent ; le garde-fou n° 2 (insertions multi-mouvements en une transaction)
  reste entier.
- **Sprint N+2 (US-124/125/126)** : aucun GO explicite reçu à ce jour. Son achèvement en GO est la
  condition posée par K8 (ADR-18) pour toute activation de canal externe en Production.
