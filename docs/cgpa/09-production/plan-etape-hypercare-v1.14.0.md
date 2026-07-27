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

**À instruire.** Mêmes contrôles que T0.

## Checkpoint T+24 — cible 2026-07-28 ~16:46 UTC ± 30 min

**À instruire.** Mêmes contrôles que T0.

### Rappel du pattern d'exploitation

L'hôte est **volontairement éteint entre les opérations** (produit non annoncé publiquement, aucun
trafic réel). Les fenêtres T+12 et T+24 tombent fréquemment hôte éteint : dans ce cas, un contrôle
live en rattrapage est exécuté dès le redémarrage suivant et qualifié **« PASS sous surveillance »**,
l'écart de fenêtre étant tracé sans impact — précédents `1.9.0`, `1.12.0`. À l'inverse, si l'hôte
reste allumé (cas de `1.10.0`), `RestartCount=0` couvre rétroactivement toute la fenêtre.

La clôture de release CDO reste **interdite avant que T+12 et T+24 ne soient statués**.

## Après l'hypercare

- **Clôture de release CDO** `1.14.0` — étape distincte, sur instruction PO.
- **`R-V54-2` reste ouvert** : la mesure structurelle contre la récidive des déploiements non
  tracés est indépendante de cette hypercare et doit être arbitrée par le PO.
- **Sprint N+2 (US-124/125/126)** : aucun GO explicite reçu à ce jour. Son achèvement en GO est la
  condition posée par K8 (ADR-18) pour toute activation de canal externe en Production.
