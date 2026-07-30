# Rapport Validation Finale — Release `1.15.0` (EP-16 Sprint N+2 Lot A)

| Champ | Valeur |
|---|---|
| Date | 2026-07-30, ~12:57–13:20 UTC |
| Hôte | `loyertracker-prod-server` (`18.158.70.88`) |
| Tag en Production | `sha-ac374193` |
| Digest API | `sha256:9603330ea530d2fe4e90b49a63e648c7a8b7679e8819f026f79e8108ca14557a` |
| Digest Web | `sha256:7dbc551ee722e1da7697d71749b94a731fce0b028b7b7288c88d8346488e8bc8` (inchangé depuis `1.14.0`) |
| Verdict | **PASS — `PRODUCTION_DEPLOYED` atteint** |

## Autorisation

Réactivation temporaire de `bailleur-test@test.local` et exécution du smoke Production :
**autorisation PO explicite donnée le 2026-07-30** (« Instruis la validation finale Production »),
distincte du déploiement technique du même jour (~12:27–12:33 UTC) — même discipline que toutes
les releases précédentes.

Cette validation lève la réserve bloquante ouverte par `deploiement-technique-v1.15.0-report.md` :
la release était en service depuis ce même jour sans avoir jamais été validée fonctionnellement.

## Contrôle d'entrée — conforme, aucune anomalie

| Contrôle | Résultat |
|---|---|
| `api`/`nginx`/`postgres`/`keycloak` | `healthy`, cohérent avec la bascule du matin |
| `bailleur-test@test.local` | `enabled=false` — conforme |
| `directAccessGrantsEnabled` (`loyertracker-spa`) | `false` — conforme |
| `.env` : `API_IMAGE_REF` | digest `9603330e…` conforme au déploiement technique |
| Flyway | 29/29 |
| Baseline métier | 3 bailleurs (2 réels + `bailleur-test`, confirmé par correspondance `keycloak_id`), 2 patrimoines, 8 biens, 8 baux, 8 garanties/13 mouvements, 1 gestionnaire, 8 locataires, 7 quittances |
| Tables `notification_*` | 34 `event`, 0 `outbox`, 0 `delivery`, 3 `template`, 0 `preference` |
| Prometheus / Alertmanager | 5/5 cibles `up` / 0 alerte active |
| 5xx / `ERROR` (10 min) | 0 / 0 |
| `/healthz` / site public | 200 / 200 |

## Smoke Production — deux passages, dérive de synchronisation identifiée et corrigée

Invocation :

```
sudo env BASE=https://localhost:18443 CACERT=infra/nginx/certs/localhost.pem \
  COMPOSE_FILE=docker-compose.yml:docker-compose.prod.yml bash infra/smoke/smoke-stack.sh
```

**Premier passage** (RUN_ID `1785417450`) : **64 PASS / 1 FAIL**, code de sortie **1** (capturé
directement, non masqué par un pipe). L'unique échec — `DÉRIVE R-V54-2 : API_IMAGE_REF '…9603330e…'
!= '…089028b4…'` — n'est **pas une régression applicative** : le dépôt de l'hôte de production était
encore au commit `66c2f4a` (avant la fusion de la PR #304, qui promeut
`infra/release/production-state.env` à `1.15.0`), exactement la dérive anticipée dans
`deploiement-technique-v1.15.0-report.md` (« ces 3 écarts disparaîtront [...] une fois la PR
fusionnée et le dépôt hôte resynchronisé »).

**Correction** : `git pull --ff-only origin main` sur l'hôte (`66c2f4a` → `162154e`, incluant la
fusion des PR #304 et #305), aucune mutation Docker. `production-state.env` déclare désormais
`RELEASE_VERSION=1.15.0` et le digest API exact.

**Second passage** (RUN_ID `1785417509`), après resynchronisation : **65 PASS / 0 FAIL au premier
passage propre**, code de sortie **0**. Couverture : sanity Flyway **29/29**, conformité digest
API/Web Production (nouveaux contrôles R-V54-2 sur `docker-compose.prod.yml`, absents avant
`1.15.0`), pool `loyertracker_api` NOSUPERUSER/NOBYPASSRLS, JWT réels via Nginx TLS, parcours
bailleur complet, invitation → acceptation via Admin API réelle → JWT gestionnaire,
affectation/échéances/pointage/honoraires (72,00 € = 8 % de 900 encaissés), alertes (PREAVIS à
J+75) et audit, scoping gestionnaire, isolation cross-tenant live (2e bailleur), RGPD (export,
effacement locataire — 403 gestionnaire / 204 bailleur, anonymisation confirmée, audit
`EFFACEMENT_LOCATAIRE`), garde-fous AuthN/ports, surface publique de vérification des quittances
sans oracle.

Échafaudage `directAccessGrants` révoqué automatiquement par le script à chacun des deux passages
(`OFF` vérifié après chaque run).

### Volet notifications — activité interne confirmée, aucun envoi externe

Les deux passages ont généré **17 `notification_event`** au total (34 → 51, cumul des deux runs).
**`notification_outbox` et `notification_delivery` sont restés à 0 avant, pendant et après les deux
runs.** Aucune tentative d'envoi externe n'a eu lieu. La condition 6 du Gate Production (« 0
activité `notification_delivery` ») est **satisfaite en conditions réelles de Production**.
`NotificationProvider` en service reste exclusivement `NoopNotificationProvider` ; les credentials
Twilio sont vides et absents du `.env`.

## Nettoyage transactionnel — deux runs, une seule transaction

Toutes les entités des RUN_ID `1785417450` **et** `1785417509` ont été identifiées par leur
identifiant réel (jointures explicites bailleur→patrimoine→bien→bail→locataire, affectation,
invitation, audit_log, notification_event), en excluant soigneusement les données réelles
(cross-vérifiées par `keycloak_id`, nom de patrimoine et noms de locataires réels non-smoke), puis
supprimées en **une seule transaction** (`BEGIN` … `COMMIT`, psql `ON_ERROR_STOP=1`, SQL transmis
par stdin) :

| Entité | Quantité |
|---|---:|
| Paiement | 20 (10 par run) |
| Honoraire | 20 (10 par run) |
| Alerte | 13 (6 + 7) |
| Audit log (`bailleur_id`=`bailleur-test`) | 8 |
| `notification_event` (`bailleur_id`=`bailleur-test`) | 17 |
| Bail | 2 |
| Locataire (déjà anonymisé par le test RGPD) | 2 |
| Affectation | 2 |
| Bien | 2 |
| Patrimoine (2 sous `bailleur-test`, 2 « Patrimoine principal » des 2e bailleurs) | 4 |
| Invitation | 2 |
| Gestionnaire | 2 |
| Bailleur (les 2 « 2e bailleur » smoke — `bailleur-test` lui-même conservé, réserve permanente) | 2 |
| **Total** | **96 lignes**, un seul `COMMIT` |

Vérifié avant suppression : `garantie`/`quittance`/`quittance_numerotation` — **0** ligne créée par
les runs (ces parcours ne sont pas exercés par le smoke).

Comptes Keycloak des deux runs supprimés : `bailleur2-smoke-1785417450@test.local`,
`bailleur2-smoke-1785417509@test.local`, `gest-smoke-1785417450@test.local`,
`gest-smoke-1785417509@test.local` — recherche `smoke-1785417450`/`smoke-1785417509` renvoyant
`[]` après suppression. `bailleur-test` redésactivé (`enabled=false`), `directAccessGrantsEnabled`
reconfirmé `false` sur `loyertracker-spa`.

## État final

| Contrôle | Résultat |
|---|---|
| Résidus des deux RUN_ID | **0** — aucun bailleur, gestionnaire, patrimoine, locataire ni compte Keycloak surnuméraire |
| Baseline métier post-nettoyage | **3 bailleurs, 2 patrimoines, 8 biens, 8 baux, 8 garanties, 13 mouvements, 1 gestionnaire, 8 locataires, 7 quittances** — identique à l'état pré-test |
| Tables `notification_*` post-nettoyage | **34 `event`, 0 `outbox`, 0 `delivery`, 3 `template`, 0 `preference`** — identique à l'état pré-test |
| Flyway | 29/29, inchangé |
| Services | 8/8 actifs, 4/4 `healthy` |
| `/healthz` | 200 |
| Production publique | `https://loyertracker.loyerpro.org` → 200 |
| Prometheus | **5/5** cibles `up` |
| Alertmanager | **0** alerte active |
| 5xx Nginx (30 min) | **0** |
| `bailleur-test` | `enabled=false`, `directAccessGrantsEnabled=false` |

### Note non bloquante — 3 lignes `ERROR` API pendant les deux passages

`duplicate key value violates unique constraint "bailleur_keycloak_id_key"`
(`org.hibernate.engine.jdbc.spi.SqlExceptionHelper`), à 13:03:19, 13:17:38 et 13:18:37 UTC. **Pattern
déjà documenté** lors de l'hypercare `1.10.0` et de la validation `1.14.0` : le smoke rejoue une
inscription sur un compte déjà enregistré (`bailleur-test`, permanent entre les runs), la contrainte
d'unicité protège correctement l'invariant et l'API répond **409** (accepté explicitement par le
script : `[[ "$out" == "201" || "$out" == "409" ]]`). Hibernate journalise la violation au niveau
`ERROR` alors que le cas est nominalement géré. Aucune régression, aucun impact fonctionnel — la
piste d'amélioration (abaisser ce cas en `WARN` côté application) reste une dette cosmétique
connue, hors périmètre de cette validation.

## Verdict

**Validation finale PASS — `PRODUCTION_DEPLOYED` confirmé le 2026-07-30 ~13:20 UTC pour la release
`1.15.0` (`sha-ac374193`, EP-16 Sprint N+2 Lot A).** Migration V29 confirmée stable en conditions
réelles (fonction `notification_envois_du_mois` disponible, aucune régression sur le socle
existant — 65/0 au premier passage propre) ; production d'événements de notification confirmée
fonctionnelle **sans aucun envoi externe**. `NoopNotificationProvider` reste l'unique fournisseur
actif et **aucun canal externe (WhatsApp/SMS) n'est activé** — l'activation reste interdite jusqu'à
la clôture en GO du Sprint N+2 **complet** (Lot A et Lot B), conformément à K8 (ADR-18) ; Lot B
(US-125) reste bloqué.

**Réserves inchangées** : `RSV-MIG-611-04` (Enterprise Architect) reste ouverte sans échéance ;
`RSV-MIG-611-06` reste bloquante pour US-125 uniquement ; `RSV-EP16-N2-02` (fallback SMS,
couverture des échecs asynchrones) reste ouverte ; la dérive `docker-compose.staging.yml` sur
`ai-test-server` reste à résorber (résorbée côté Production par ce cycle).

**Étapes distinctes restant à instruire** : hypercare T0/T+12/T+24, puis clôture de release CDO.
