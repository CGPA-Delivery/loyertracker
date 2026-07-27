# Rapport Validation Finale — Release `1.14.0` (EP-16 Sprint N+1 — WhatsApp P0)

| Champ | Valeur |
|---|---|
| Date | 2026-07-27 |
| Fenêtre | ~16:36–16:47 UTC |
| `PRODUCTION_DEPLOYED` | **Confirmé le 2026-07-27 ~16:46 UTC** (déploiement technique réellement exécuté le 2026-07-24 ~12:48 UTC — cf. `deploiement-technique-v1.14.0-report.md`) |
| Hôte | `loyertracker-prod-server` (`18.158.70.88`) |
| Tag en Production | `sha-27dce09d` |
| Digest API | `sha256:089028b45a93afd4f12d5aa22cfc63a38f5687bb1d0f7204bc1965154ce8d7ff` |
| Digest Web | `sha256:7dbc551ee722e1da7697d71749b94a731fce0b028b7b7288c88d8346488e8bc8` |
| Verdict | **PASS — `PRODUCTION_DEPLOYED` atteint** |

## Autorisation

Réactivation temporaire de `bailleur-test@test.local` et exécution du smoke Production :
**autorisation PO explicite donnée le 2026-07-27** (« instruis la validation finale »), distincte
de la régularisation du déploiement technique du même jour — même discipline que toutes les
releases précédentes.

Cette validation lève la réserve bloquante ouverte par
`deploiement-technique-v1.14.0-report.md` : la release était en service depuis le 2026-07-24 sans
avoir jamais été validée fonctionnellement.

## Contrôle d'entrée — conforme, aucune anomalie

Contrairement à la validation `1.13.0` (où `bailleur-test` avait été trouvé `enabled=true` après un
réimport de realm), **aucune anomalie n'a été constatée** :

| Contrôle | Résultat |
|---|---|
| `bailleur-test@test.local` | `enabled=false` — conforme |
| `directAccessGrantsEnabled` (`loyertracker-spa`) | `false` — conforme |
| Flyway | 28/28 ; compteur attendu par le smoke aligné à **28** (`smoke-stack.sh:92`) |
| Baseline métier | 3 bailleurs, 2 patrimoines, 8 biens, 8 baux, 8 garanties, 1 gestionnaire, 8 locataires, 7 quittances |
| Tables `notification_*` | 17 `event`, 0 `outbox`, 0 `delivery`, 3 `template`, 0 `preference` |
| Services | 8/8 actifs, 4/4 healthy |

Le compte `bailleur-test` a été activé pour le run (le smoke l'exige), puis redésactivé en fin
d'opération (cf. §Nettoyage).

## Smoke Production

Invocation :

```
env BASE=https://localhost:18443 CACERT=infra/nginx/certs/localhost.pem \
  COMPOSE_FILE=docker-compose.yml:docker-compose.prod.yml bash infra/smoke/smoke-stack.sh
```

RUN_ID `1785170429`. Code de sortie du script : **0** (capturé directement, non masqué par un pipe).

**Résultat : 63 PASS / 0 FAIL au premier passage** — identique à `1.12.0`, `1.13.0` et au Gate
Staging du Sprint N+1. Couverture : sanity Flyway **28/28**, pool `loyertracker_api`
NOSUPERUSER/NOBYPASSRLS, JWT réels via Nginx TLS, parcours bailleur complet (inscription,
patrimoine, bien, création de `Locataire`, bail avec `locataireId`), invitation → acceptation via
Admin API réelle → JWT gestionnaire, affectation/échéances/pointage/honoraires, alertes (PREAVIS)
et audit, scoping gestionnaire, isolation cross-tenant live (2e bailleur), RGPD (export, effacement
locataire — 403 gestionnaire / 204 bailleur, anonymisation confirmée, audit `EFFACEMENT_LOCATAIRE`),
garde-fous AuthN/ports, surface publique de vérification des quittances sans oracle.

Échafaudage `directAccessGrants` révoqué automatiquement par le script (`OFF` vérifié après run).

### Volet notifications — activité interne confirmée, aucun envoi externe

Différence notable avec la validation `1.13.0`, où les tables `notification_*` restaient à 0 : le
Sprint N+1 câble effectivement la production d'événements. Le run a généré **8 nouveaux
`notification_event`** (17 → 25) :

| Type d'événement | Créés par le run |
|---|---:|
| `LOYER_EN_RETARD` | 5 |
| `PAIEMENT_RECU` | 1 |
| `BAIL_CREE` | 1 |
| `PREAVIS` | 1 |

**`notification_outbox` et `notification_delivery` sont restés à 0 avant, pendant et après le
run.** Aucune tentative d'envoi externe n'a donc eu lieu, y compris pour l'événement
`PAIEMENT_RECU` — dont l'absence de template approuvé avait été confirmée en Staging comme menant
à `DEAD`, sans envoi. La condition 6 du Gate Production (« 0 activité `notification_delivery` »)
est **satisfaite en conditions réelles de Production**.

`NotificationProvider` en service reste exclusivement `NoopNotificationProvider` ; les credentials
Twilio sont vides et les trois flags externes à `false` (`NOTIFICATION_DRY_RUN=true`).

## Nettoyage transactionnel

Toutes les entités du RUN_ID `1785170429` ont été identifiées par leur identifiant réel **avant**
toute suppression, puis supprimées en **une seule transaction** (`BEGIN` … `COMMIT`, psql
`ON_ERROR_STOP=1`) :

| Entité | Quantité | Détail |
|---|---:|---|
| Audit log | 4 | `bailleur_id` ∈ {`c7296c69-…`, `fec03ece-…`} |
| **`notification_event`** | **8** | `bailleur_id=c7296c69-…` (les 17 événements préexistants appartiennent au bailleur réel `5df3adf2-…`, séparation vérifiée avant suppression) |
| Honoraire | 10 | `affectation_id=49d7d2fa-…` |
| Paiement | 10 | `bail_id=a89ae372-…` |
| Alerte | 6 | `bail_id=a89ae372-…` |
| Invitation | 1 | `gest-smoke-1785170429@test.local` |
| Affectation | 1 | `49d7d2fa-…` |
| Bail | 1 | `a89ae372-…` |
| Bien | 1 | `406915ba-…` |
| Locataire | 1 | `f89b88cc-…` (créé puis anonymisé par le test d'effacement RGPD — données 100 % synthétiques) |
| Patrimoine | 2 | `3db40f08-…` (sous `bailleur-test`) et `95060e97-…` (auto-créé à l'inscription du 2e bailleur) |
| Gestionnaire | 1 | `efa3ecb6-…` |
| Bailleur (2e bailleur smoke) | 1 | `fec03ece-…` |
| **Total** | **47 lignes** | une seule transaction, `COMMIT` confirmé |

Vérifié avant suppression : **0 quittance** référencée sur les paiements du run.

**Note de méthode** : une première tentative a échoué avant tout `DELETE` — le shell distant avait
expansé les marqueurs `$$` du here-doc en PID. `ON_ERROR_STOP=1` a interrompu la transaction juste
après le `BEGIN` ; l'état de la base a été explicitement revérifié comme **inchangé** avant de
relancer le nettoyage en transmettant le SQL par stdin. Aucune donnée n'a été supprimée par cette
tentative.

Comptes Keycloak du run supprimés : `gest-smoke-1785170429@test.local`
(`fa02bc0f-ec9c-47a1-9ce4-90757a0c792c`), `bailleur2-smoke-1785170429@test.local`
(`69161c7f-17a6-42fa-bae2-48eb98ac58cf`) — recherche `smoke-1785170429` renvoyant `[]` après
suppression. `bailleur-test` redésactivé (`enabled=false`), `directAccessGrantsEnabled=false`
reconfirmé sur `loyertracker-spa`.

## État final

| Contrôle | Résultat |
|---|---|
| Résidus du RUN_ID | **0** — aucun bailleur, gestionnaire, patrimoine, locataire ni compte Keycloak surnuméraire |
| Baseline métier post-nettoyage | **3 bailleurs, 2 patrimoines, 8 biens, 8 baux, 8 garanties, 1 gestionnaire, 8 locataires, 7 quittances** — identique à l'état pré-test |
| Tables `notification_*` post-nettoyage | **17 `event`, 0 `outbox`, 0 `delivery`, 3 `template`, 0 `preference`** — identique à l'état pré-test |
| Flyway | 28/28, inchangé |
| Tag / digests | `sha-27dce09d`, inchangés |
| Services | 8/8 actifs, 4/4 healthy |
| `/healthz` | 200 |
| Production publique | `https://loyertracker.loyerpro.org` → 200 |
| Prometheus | **5/5** cibles `up` |
| Alertmanager | **0 alerte active** |
| 5xx Nginx | **0** |
| `bailleur-test` | `enabled=false`, `directAccessGrantsEnabled=false` |

### Note non bloquante — 1 ligne `ERROR` API pendant le smoke

Une unique entrée `ERROR` a été émise à 16:40:38 UTC :
`duplicate key value violates unique constraint "bailleur_keycloak_id_key"`
(`org.hibernate.engine.jdbc.spi.SqlExceptionHelper`). **Pattern déjà documenté** lors de
l'hypercare `1.10.0` T+12 : le smoke rejoue une inscription sur un compte déjà enregistré, la
contrainte d'unicité protège correctement l'invariant et l'API répond **409**. Hibernate journalise
la violation au niveau `ERROR` alors que le cas est nominalement géré. Aucune régression, aucun
impact fonctionnel — la piste d'amélioration (abaisser ce cas en `WARN` côté application) reste
une dette cosmétique connue, hors périmètre de cette validation.

## Verdict

**Validation finale PASS — `PRODUCTION_DEPLOYED` confirmé le 2026-07-27 ~16:46 UTC pour la release
`1.14.0` (`sha-27dce09d`, EP-16 Sprint N+1 WhatsApp P0).** Le déploiement technique réel datant du
2026-07-24, l'état `PRODUCTION_DEPLOYED` est prononcé rétroactivement à la date de sa preuve, selon
le même principe que la régularisation `1.11.0` du 2026-07-19.

Migration V28 additive confirmée stable en conditions réelles ; aucune régression sur le socle
existant (63/0 au premier passage) ; production d'événements de notification confirmée
fonctionnelle **sans aucun envoi externe**. `NoopNotificationProvider` reste l'unique fournisseur
actif et **aucun canal externe (WhatsApp/SMS) n'est activé** — l'activation reste interdite jusqu'à
la clôture en GO du Sprint N+2 (K8, ADR-18).

**Étapes distinctes restant à instruire** : hypercare T0/T+12/T+24, puis clôture de release CDO.
L'écart de gouvernance **R-V54-2** (déploiement non tracé, en récidive) reste **ouvert** : la
mesure structurelle à mettre en place doit être arbitrée par le PO indépendamment de cette
validation.
