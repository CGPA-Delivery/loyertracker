# Gate Staging v6.1.1 — EP-16 Sprint N+2 Lot A (fallback SMS et garde-fous)

| Champ | Valeur |
|---|---|
| Date d'instruction | 2026-07-28 |
| Périmètre soumis | EP-16 Sprint N+2 **Lot A** — US-124 (fallback SMS contrôlé), US-126 (observabilité, sécurité, exploitation) |
| Périmètre exclu | US-125 (interface préférences/historique) — bloquée par les Gates 02A/04A, cf. §Périmètre |
| Candidat proposé | branche `feat/ep16-sprint-n2-lot-a`, commit `6a56ef1b` — **PR #291 en brouillon, non fusionnée** |
| Rollback envisagé | `sha-27dce09d` (`1.14.0`) — V29 additive, rollback applicatif seul viable |
| Environnement | `ai-test-server` mutualisé |
| Décision | **NO GO — conditions d'entrée non satisfaites** |

## Contrôle d'entrée — verrou d'état de release (R-V54-2)

**Exécuté en premier**, conformément à la checklist.

| Contrôle | Résultat |
|---|---|
| `check-release-state.sh --ci` | **PASS — exit 0**, 5 contrôles cohérents |
| `FLYWAY_EXPECTED` vs fichiers `V*.sql` | PASS — 29 == 29 |
| `RELEASE_VERSION` vs tête du CHANGELOG | PASS — `1.14.0` |
| Format du tag immuable | PASS — `sha-27dce09d` |
| Compteur Flyway codé en dur | PASS — aucun résiduel |

**Réserve non bloquante `RSV-STG-N2-01` — limite du verrou révélée par ce sprint.** Le Sprint N+2
est le **premier lot ajoutant une migration depuis la création du verrou**. `FLYWAY_EXPECTED` sert
deux usages qui **divergent pendant un sprint** : `--ci` et `SchemaMigrationTest` attendent le
compte du **dépôt** (29 depuis V29) ; `--host` et le smoke attendent le compte **réel en
Production** (28 tant que le Lot A n'est pas déployé). Passé à 29 pour garder la CI cohérente,
`--host` signalera donc une **dérive qui n'en est pas une** jusqu'à la bascule.

Sans danger immédiat — `1.14.0` est clôturée et aucune activité Production n'est en cours — mais
le dispositif doit être corrigé avant le prochain cycle Production. Correctif proposé : scinder en
`FLYWAY_EXPECTED_REPO` (contrôlé par `--ci`) et `FLYWAY_EXPECTED_PROD` (contrôlé par `--host`,
ne bougeant qu'à la bascule). Responsable : DevSecOps Lead. Échéance : avant le Gate Production du
Sprint N+2.

## Périmètre — sprint scindé, exclusion tracée

Le Sprint N+2 est exécuté **scindé**, sur arbitrage PO du 2026-07-28 :

| Story | Points | État |
|---|---|---|
| US-124 — SMS fallback contrôlé | 5 | Codée, testée, non promue |
| US-126 — Observabilité, sécurité, exploitation | 8 | Codée, testée, non promue |
| US-125 — Interface préférences et historique | 8 | **Exclue** — premier lot Frontend significatif, Gates 02A/04A obligatoires (`RSV-MIG-611-06`), livrables Phase 04A vides |

L'exclusion d'US-125 est **légitime et tracée** : le projet a plusieurs précédents de Gate Staging
sur un incrément partiel (Sprint 2 « backend-first », Sprints A+B EP-15). Elle n'est pas un motif
de NO GO.

## Conditions d'entrée

| Critère | Résultat | Preuve / motif |
|---|---|---|
| GO explicite Sprint N+2 | **PASS** | Instruction PO du 2026-07-28, distincte des GO Sprints N et N+1 |
| Plan d'Exécution approuvé | **PASS** | `plan-execution-ep16-notifications.md` §Sprint N+2, mis à jour du séquencement |
| Rapport d'exécution Sprint | **PASS** | PR #291 (description détaillée) + CHANGELOG `[Non publié]` |
| **Incrément fusionné sur `main`** | **FAIL à l'instruction, résolu depuis — cf. Addendum** | `origin/main` est à `43f9fbd` (PR #289). **PR #291 est en brouillon, non fusionnée** |
| **Artefact candidat immuable identifié** | **FAIL à l'instruction, résolu depuis — cf. Addendum** | **Aucune image GHCR n'existe** pour `6a56ef1b` — vérifié par lecture de l'API GHCR : 0 version portant un tag `sha-6a56ef1*`. Sans fusion, le job Packaging ne s'exécute pas |
| **CI de la PR conclue** | **NON EXÉCUTÉ à l'instruction, FAIL constaté depuis — cf. Addendum** | À l'heure de l'instruction, `Backend (build + tests + couverture)` et `Analyse CodeQL (java-kotlin)` sont **encore en cours**. Contrôle applicable sans preuve ⇒ `non exécuté`, jamais `non applicable` |
| **Capacité SMS Twilio provisionnée** | **FAIL** | Confirmation PO du 2026-07-28 : le compte couvre la Sandbox WhatsApp, **aucun numéro SMS n'est provisionné**. Or le critère d'acceptation central d'US-124 — « un unique SMS est tenté » — n'est **pas vérifiable en conditions réelles** sans lui |
| Sauvegarde pré-déploiement | **NON EXÉCUTÉ** | Sans candidat, aucun déploiement n'est préparé |

## Contrôles DevSecOps

| Critère | Résultat | Preuve |
|---|---|---|
| Build stable | **PASS (local)** | `mvn -B verify` exit 0 |
| Tests unitaires et d'intégration | **PASS (local)** | **220 tests, 0 échec, 0 erreur** (+9 vs base de 211) |
| Tests dédiés aux critères GO | **PASS (local)** | Fallback refusé sans politique ; refusé sans opt-in ; refusé sur échec temporaire ; unicité du SMS ; kill switch bloquant ; plafond nul bloquant ; dépassement simulé arrêtant le lot |
| Qualité de code | **PASS (local)** | Spotless propre, garde JaCoCo verte |
| Contrôles secrets / SCA / SAST / images | **PASS (distant, partiel)** | Sécurité (gitleaks + SCA + Trivy) PASS, CodeQL `javascript-typescript` PASS, audit structurel PASS, Registry Policy PASS |
| SonarQube | **NON EXÉCUTÉ à l'instruction, FAIL constaté depuis — cf. Addendum** | Porté par le job Backend, encore en cours à l'instruction |
| Migrations DB vérifiées | **PASS (local)** | V29 additive appliquée, Flyway 29/29 en test ; rollback applicatif seul viable |
| Secrets non exposés | **PASS** | Aucun credential versionné ; `.env.example` en `CHANGE_ME` ; `TWILIO_SMS_FROM` vide ⇒ refus `PERMANENT` explicite, jamais d'envoi silencieux |

## Isolation Staging — `STG-ISOL-01`

**NON EXÉCUTÉ.** Aucun déploiement n'a été préparé ni tenté, faute d'artefact candidat. Ce
contrôle reste **bloquant** avant toute promotion : il devra être exécuté avant/après, sur
conteneurs tiers, noms Compose, réseaux, volumes, ports, secrets et routage.

Conformément au verrou CGPA, ce résultat est consigné **`non exécuté`**, et non `non applicable`.

## Décision

# NO GO

**Motif : conditions d'entrée non satisfaites.** Le Gate Staging n'est pas instructible à son
terme. Ce n'est pas un défaut de qualité du lot — les preuves locales sont bonnes — mais l'absence
des prérequis matériels d'une promotion.

Trois bloqueurs, dont deux indépendants de toute considération de qualité :

1. **Aucun artefact candidat immuable n'existe.** La PR #291 est en brouillon et non fusionnée ;
   `origin/main` n'a pas avancé ; aucune image GHCR ne porte le commit `6a56ef1b`. Une promotion
   Staging est la **promotion d'un artefact construit**, jamais d'une branche.
2. **La capacité SMS Twilio n'est pas provisionnée.** Le critère d'acceptation central d'US-124
   ne peut pas être vérifié en conditions réelles. Promouvoir en l'état reviendrait à valider un
   fallback SMS sans avoir jamais pu en observer un seul — précisément ce que le Gate Staging
   existe pour empêcher.
3. **La CI de la PR n'est pas conclue.** Deux jobs restent en cours à l'instruction. *Mise à jour
   post-instruction : la CI s'est conclue depuis, en `FAILURE` (Quality Gate SonarQube) — cf.
   [Addendum](#addendum--ci-conclue-post-instruction-2026-07-29). Ceci ne change ni le NO GO ni
   les bloqueurs 1 et 2, indépendants et suffisants à eux seuls.*

`STG-ISOL-01` n'ayant pas pu être exécuté, aucune décision `GO` ou `GO sous réserve` n'est
recevable — la checklist l'exige explicitement.

**Aucun déploiement, aucune promotion, aucune modification de l'hôte Staging n'a été exécutée.**

## Chemin de remédiation

Dans cet ordre, chaque étape restant un acte distinct :

1. **Corriger la violation SonarQube bloquante puis rejouer la CI de la PR #291** jusqu'à obtenir
   tous les checks au vert, Quality Gate SonarQube inclus — cf.
   [Addendum](#addendum--ci-conclue-post-instruction-2026-07-29) : `java:S125` sur
   `NotificationDispatcher.java:167` fait actuellement échouer le Quality Gate.
2. **Validation humaine finale** de la PR #291, puis fusion par le workflow protégé.
3. **Vérifier la publication de l'artefact** : job Packaging exécuté, tag `sha-<8>` et digests
   API/Web relevés et figés.
4. **Provisionner un numéro SMS Twilio** sur le compte Sandbox — **hors périmètre CGPA, à la main
   du PO/exploitant**. Sans lui, US-124 restera non vérifiable et le Gate Staging devra à nouveau
   être prononcé `NO GO` sur ce point, ou US-124 devra être explicitement retirée du périmètre
   promu.
5. **Ré-instruire le Gate Staging** sur le candidat réel : sauvegarde vérifiée, `STG-ISOL-01`
   avant/après, déploiement strictement ciblé (`api` seul — aucun changement Web dans ce lot),
   smoke, puis vérification réelle du fallback SMS.

## Addendum — CI conclue post-instruction (2026-07-29)

**Vérification effectuée le 2026-07-29**, en reprise de ce dossier, sans nouvelle instruction du
Gate — la décision NO GO du 2026-07-28 reste seule décision engageante. Objet : constater l'état
réel de la CI de la PR #291, non connu à l'instruction (deux jobs alors en cours).

| Vérification | Méthode | Résultat |
|---|---|---|
| État des checks de la PR #291 | `gh pr view 291 --json statusCheckRollup` | Tous conclus. `Backend (build + tests + couverture)` : **FAILURE**. Tous les autres jobs (Frontend, Sécurité, CodeQL ×2, Registry Policy, audit structurel) : **SUCCESS** |
| Tests et build | Log du job `Backend` | `mvn verify` progresse normalement : **220 tests, 0 échec, 0 erreur** (identique aux preuves locales de l'instruction) |
| Cause de l'échec | Log du job `Backend` | `mvn ... sonar:sonar` échoue avec `QUALITY GATE STATUS: FAILED` après les tests |
| Détail Quality Gate | `GET /api/qualitygates/project_status?projectKey=loyertracker-backend` sur `sonar.loyerpro.org` | Une seule condition en `ERROR` : `new_violations = 1` (seuil `> 0`). `new_coverage` (82.5%), `new_duplicated_lines_density` (0.28%) et `new_security_hotspots_reviewed` (100%) sont `OK` |
| Détail de la violation | `GET /api/issues/search?componentKeys=loyertracker-backend&inNewCodePeriod=true&resolved=false` | `java:S125` (MAJOR), `backend/src/main/java/com/loyertracker/notifications/NotificationDispatcher.java:167` — « This block of commented-out lines of code should be removed. » |

**Analyse.** La ligne 167 est un commentaire explicatif légitime référençant US-124 (« Échec
définitif (US-124) : rejouer à l'identique ne peut pas aboutir... »), pas du code mort. Il s'agit
vraisemblablement d'un faux positif de la règle `S125` — sa syntaxe ressemble à du pseudo-code
commenté aux yeux de l'analyseur. **À confirmer par le DevSecOps Lead** avant correctif ; deux
issues possibles, sans arbitrage ici : reformuler le commentaire pour sortir du motif détecté, ou
documenter une exclusion ciblée (`NOSONAR` / règle de projet) si le faux positif est confirmé.

**Effet sur la décision.** Aucun. Les bloqueurs 1 (aucun artefact candidat immuable) et 2 (SMS
Twilio non provisionné) du NO GO du 2026-07-28 sont inchangés et à eux seuls suffisants pour
maintenir `NO GO` — ni l'un ni l'autre ne dépend de l'état de la CI. Le bloqueur 3 passe de
`non exécuté` à **`FAIL` constaté** : la CI ne peut pas se conclure au vert en l'état ; l'étape 1
du chemin de remédiation est mise à jour en conséquence. Aucun code n'a été modifié dans le cadre
de cette vérification — verrou CLAUDE.md « aucun code applicatif sans Plan d'Exécution approuvé ».

### Mise à jour — correctif appliqué et CI au vert (2026-07-29)

**Action correctrice appliquée**, sur instruction explicite et confirmation préalable au push :
reformulation du commentaire `NotificationDispatcher.java:167` (contenu inchangé, syntaxe
seulement, pour sortir du motif détecté par `S125`) — commit `b0e97b0` sur
`feat/ep16-sprint-n2-lot-a`, poussé sur la PR #291. Portée couverte par le Plan d'Exécution EP-16
déjà approuvé (US-124, `NotificationDispatcher` explicitement dans son périmètre) ; il ne s'agit
pas d'un ajout fonctionnel. Le diagnostic de faux positif porté plus haut n'a **pas fait l'objet
d'une confirmation formelle du DevSecOps Lead** avant application — à régulariser a posteriori.

| Vérification | Méthode | Résultat |
|---|---|---|
| Checks de la PR #291 après le push | `gh pr checks 291` (exit 0) | **Tous `pass`** : `Backend (build + tests + couverture)` 3m8s, `Build, scan et SBOM Docker` 3m17s, Frontend, Sécurité, CodeQL ×3, Registry Policy, audit structurel. Seul `Publication, signatures et attestations` reste `skipping` — normal, ce job ne s'exécute qu'à la fusion sur `main`, pas sur une PR en brouillon |
| Quality Gate SonarQube | `GET /api/qualitygates/project_status?projectKey=loyertracker-backend` | **`OK`** — `new_violations` passé de 1 à **0** ; couverture, duplication et hotspots inchangés (`OK`) |

**Effet sur la décision.** Le bloqueur 3 (CI de la PR) est **levé**. Les bloqueurs 1 (PR #291 en
brouillon, non fusionnée, aucun artefact GHCR immuable) et 2 (capacité SMS Twilio non
provisionnée) **restent entiers et inchangés** — ni l'un ni l'autre ne dépendait de l'état de la
CI. **Le NO GO du 2026-07-28 reste donc la décision en vigueur.** Une CI au vert n'est qu'une
condition parmi d'autres du chemin de remédiation (étape 1 désormais franchie) ; elle n'autorise
ni fusion, ni promotion, ni ré-instruction du Gate à elle seule.

### Mise à jour — PR #291 fusionnée, artefact publié (2026-07-29)

**Actions effectuées**, chacune sur instruction explicite distincte : PR #291 marquée « ready for
review », branche mise à jour contre `main` (`gh pr update-branch`), CI rejouée et conclue au vert
sur le nouveau commit, puis **PR #291 fusionnée** par workflow protégé (`gh pr merge --merge`).

| Vérification | Méthode | Résultat |
|---|---|---|
| Fusion sur `main` | `gh pr view 291 --json state,mergedAt,mergeCommit` | **`MERGED`**, `2026-07-29T09:08:17Z`, commit de fusion `ac374193e58a7f8733b29de47a407031b3c1fd12` |
| CI sur `main` post-fusion | `gh run view` sur le run déclenché par le push de fusion | **`success`** sur tous les jobs, y compris `Publication, signatures et attestations` (`success` — pour la première fois de ce dossier, ce job n'est plus `skipping`) |
| Artefact `loyertracker-api` | `GET /users/jptshilombo/packages/container/loyertracker-api/versions` | Tag **`sha-ac374193`** présent, digest `sha256:9603330ea530d2fe4e90b49a63e648c7a8b7679e8819f026f79e8108ca14557a`, publié `2026-07-29T09:16:00Z` |
| Artefact `loyertracker-web` | `GET /users/jptshilombo/packages/container/loyertracker-web/versions` | Tag **`sha-ac374193`** présent, digest `sha256:3d7ddb5fff6346726492079414cbd0679ee3833dfe8721662cd00527024c4067`, publié `2026-07-29T09:16:08Z` |

**Effet sur la décision.** Le bloqueur 1 (aucun artefact candidat immuable) est **levé** : un
incrément fusionné existe sur `main`, et les deux images portent un tag `sha-<8>` immuable avec
digest relevé. **Le bloqueur 2 (capacité SMS Twilio non provisionnée) reste seul, entier et
inchangé** — il ne dépend ni de la CI ni de la fusion, mais d'une action hors périmètre CGPA
(provisionnement PO/exploitant). **Le NO GO du 2026-07-28 reste donc la décision en vigueur** :
conformément à `CLAUDE.md` (« aucun push ou merge ne vaut autorisation de promotion »), la fusion
et la publication de l'artefact ne constituent **ni une promotion ni un GO Staging**. Le Gate
devra être **ré-instruit explicitement** (étape 5 du chemin de remédiation) — avec le blocage SMS
levé ou US-124 explicitement retirée du périmètre, sauvegarde vérifiée et `STG-ISOL-01`
avant/après — avant tout déploiement sur `ai-test-server`.

### Mise à jour — `RSV-STG-N2-01` résolue (PR #294 fusionnée, 2026-07-29)

**Instruction explicite reçue dans la conversation de pilotage** : « j'ai validé #294,
fusionne-la ». Cette déclaration vaut **GO humain final pour la fusion de la PR #294**, limité à la
fusion elle-même — aucun déploiement ni promotion n'est demandé ou autorisé par cette instruction.

PR #294 (`fix(release): scinder FLYWAY_EXPECTED en FLYWAY_EXPECTED_REPO/FLYWAY_EXPECTED_PROD`,
branche `agent/fix-flyway-expected-repo-prod`) a été fusionnée par le workflow GitHub protégé, sans
contournement administrateur.

| Vérification | Méthode | Résultat |
|---|---|---|
| Fusion sur `main` | `gh pr view 294 --json state,mergedAt,mergeCommit` | **`MERGED`**, `2026-07-29T11:43:19Z`, commit de fusion `97d497db42aec07c0ade922a111cba823faa9b7f` (tête de PR revue : `93501f3ab1b5719421d4f694eb3a67331b5dfc4c`) |
| Contrôles post-fusion sur `main` | `gh api .../commits/97d497db.../check-runs` | Tous **`success`** : Backend, Frontend, Sécurité (gitleaks + SCA + Trivy), CodeQL `java-kotlin`/`javascript-typescript`, audit structurel CGPA, Registry Policy (« Quarantaine GHCR latest »), Build/scan/SBOM Docker, Publication/signatures/attestations |
| Artefact `loyertracker-api` | `GET /users/jptshilombo/packages/container/loyertracker-api/versions` | Tag **`sha-97d497db`** présent, digest `sha256:dd70f3a9127d2e13a1f130b53b53d8414f9793553cb226767be4209ce6c5fa48`, publié `2026-07-29T11:54:08Z` |
| Artefact `loyertracker-web` | `GET /users/jptshilombo/packages/container/loyertracker-web/versions` | Tag **`sha-97d497db`** présent, digest `sha256:10515cc27ded96f3fcb812ac0fc11c8e4fe7db0c6561260210184d9bd5fe1d53`, publié `2026-07-29T11:54:17Z` |

**Effet sur `RSV-STG-N2-01`.** La réserve est **résolue** : `FLYWAY_EXPECTED` est scindé en
`FLYWAY_EXPECTED_REPO` (contrôlé par `--ci`, `SchemaMigrationTest` et le smoke — compte du dépôt,
29 depuis V29) et `FLYWAY_EXPECTED_PROD` (contrôlé par `--host` — compte réel en Production, remis
à `28`, valeur exacte de `1.14.0`/`sha-27dce09d`). `--host` ne signalera donc plus de dérive
inexistante tant que le Sprint N+2 (V29) n'est pas effectivement basculé en Production ;
`FLYWAY_EXPECTED_PROD` devra être porté à `29` au moment de cette bascule réelle, pas avant.

**Portée de la fusion.** Comme pour la clôture de la PR #291 ci-dessus, la fusion et la publication
des deux artefacts (tag immuable `sha-97d497db`) ne constituent **ni une promotion ni un GO
Staging/Production**, conformément à `CLAUDE.md` (« aucun push ou merge ne vaut autorisation de
promotion »). **Le NO GO du Sprint N+2 du 2026-07-28 reste la décision en vigueur** : le bloqueur 2
(capacité SMS Twilio non provisionnée) est seul, entier et inchangé — cette fusion documentaire
d'outillage n'a aucun rapport avec lui. Le Gate devra toujours être ré-instruit explicitement
(étape 5 du chemin de remédiation) avant tout déploiement sur `ai-test-server`.

## Addendum — Ré-instruction du Gate, capacité SMS réelle (2026-07-29)

**Instruction explicite reçue dans la conversation de pilotage** : « Ré-instruis le Gate Staging
Sprint N+2 avec le numéro SMS provisionné ». Le PO a confirmé un numéro Sandbox Twilio expéditeur
(`+19379825074`, propre au compte — cf. `/home/ubuntu/INFRASTRUCTURE/twilio/key.md`) et un numéro
destinataire de test (`+18777804236`), levant la condition matérielle du bloqueur 2 du NO GO du
2026-07-28.

### Prérequis techniques découverts et traités avant le déploiement

1. **`docker-compose.staging.yml` ne transmettait pas** `TWILIO_SMS_FROM`,
   `NOTIFICATION_FALLBACK_ENABLED`, `NOTIFICATION_BUDGET_MENSUEL_MAX`,
   `NOTIFICATION_BUDGET_SEUIL_ALERTE` au conteneur `api` — corrigé par la PR #300 (fusionnée,
   commit `51758c30`, CI verte), avant tout déploiement.
2. **Dérive du fichier compose sur l'hôte** `ai-test-server` : la copie locale à l'hôte utilisait
   encore `LOYERTRACKER_TAG` (mécanisme par tag) alors que `main` est passé à
   `API_IMAGE_REF`/`WEB_IMAGE_REF` (pin par digest, probablement issu du chantier supply-chain
   RSV-MIG-611-05). **Non résolu dans ce Gate** (hors périmètre de la ré-instruction) — le
   correctif notifications a été appliqué par patch ciblé sur le fichier existant de l'hôte
   (préservant `LOYERTRACKER_TAG`), sans migrer le mécanisme. **Nouvelle réserve à consigner** :
   `docker-compose.staging.yml` doit être resynchronisé sur l'hôte vers le mécanisme
   `API_IMAGE_REF`/`WEB_IMAGE_REF` avant le prochain cycle Production, sous peine de divergence
   croissante entre le dépôt et l'hôte.
3. **`infra/smoke/smoke-stack.sh` et `infra/release/production-state.env` absents/obsolètes sur
   l'hôte** : le compteur Flyway y était codé en dur à `28` (version pré-R-V54-2). Synchronisés
   depuis `main` (diff limité à ce seul écart, aucune autre divergence). Confirme et clôture la
   vigilance mémorisée « compteur Flyway du smoke à aligner avant chaque migration ».

### Exécution (chaque étape une action distincte, confirmée avant écriture de secrets/déploiement/envoi réel)

| Étape | Résultat |
|---|---|
| Sauvegarde PostgreSQL Staging | `loyertracker-20260729-164100.dump`, 540 Kio, vérifié `pg_restore --list` |
| `STG-ISOL-01` — AVANT | 9 conteneurs `loyertracker-staging-*` + `nginx-proxy-manager` (partagé, inventorié), réseau/volumes namespacés, ports 80/443/18080/18443 sans conflit |
| Secrets Twilio Sandbox | `TWILIO_SMS_FROM`, `NOTIFICATION_FALLBACK_ENABLED=true`, `NOTIFICATION_BUDGET_MENSUEL_MAX=5` écrits dans le `.env` de l'hôte (jamais commités), `.env` sauvegardé avant modification |
| Déploiement ciblé | Image `sha-ac374193` tirée et déployée sur le seul conteneur `api` (`--no-deps`) ; `nginx` reste `sha-27dce09d` (aucun changement Web dans ce lot) ; Flyway 29/29, `RestartCount=0`, `healthy` |
| Smoke générique | **63/0** (1er passage 1 FAIL attendu — compteur Flyway hôte non aligné avant synchronisation des fichiers d'exploitation, cf. ci-dessus) |
| Vérification réelle SMS (US-124) | Scénario de test synthétique (bailleur/événement/préférence/outbox, patron identique à `NotificationDispatchIntegrationTest`) : échec WhatsApp **synchrone** (HTTP 400) → classé `PERMANENT` → **fallback SMS réellement déclenché** (`notification_fallback_total{issue="DECLENCHE"}=1`, log réel, aucun mock) → SMS réellement tenté auprès de Twilio |
| `STG-ISOL-01` — APRÈS | Identique à l'avant (conteneurs, réseaux, volumes, ports) — seul `api` recréé. **PASS** |

### Limite découverte sur le mécanisme de fallback (constat, pas un correctif de ce lot)

Le test avec le numéro destinataire réel (`+18777804236`) a été **accepté de façon asynchrone**
par Twilio (HTTP 2xx, échec de livraison signalé ensuite par callback, code `63015`) —
`TwilioCallbackController` ne fait que mettre à jour le statut de livraison, il ne réévalue jamais
le fallback. `NotificationFallbackService` ne se déclenche que sur un rejet **synchrone** (4xx
immédiat de l'API Twilio). Un rejet synchrone n'a été obtenu qu'avec un numéro manifestement
invalide (`+10000000000`), ce qui a validé le mécanisme de bout en bout (déclenchement, contrôle
de template, tentative d'envoi SMS réelle contre l'API Twilio) **sans qu'un SMS n'atteigne un
téléphone réel** — le numéro invalide ne pouvant par construction recevoir de SMS.

Décision du PO (conversation de pilotage, 2026-07-29) : accepter cette preuve comme suffisante et
documenter la limite plutôt que de multiplier les essais sur le compte Twilio réel. Cette limite
est une caractéristique de conception d'US-124 (le fallback couvre les rejets immédiats, pas les
échecs de livraison différés — pourtant le mode d'échec le plus probable en usage réel : non-
inscription au Sandbox WhatsApp, fenêtre de 24 h expirée). **Nouvelle réserve non bloquante**,
proposée `RSV-EP16-N2-02`, à arbitrer par le PO / Enterprise Architect : étendre ou non le
fallback aux échecs de livraison asynchrones dans un lot futur.

Données de test synthétiques : bailleur, événements, préférences et lignes Outbox de test
conservés (cohérent avec la pratique existante de résidus `bailleur2-smoke-*` sur cet hôte,
purgés périodiquement). Le template SMS ajouté pour les besoins du test a été repassé
`BROUILLON`/`enabled=false` après usage — son approbation avait valeur de test technique, pas de
revue de contenu métier/légal.

### Décision

# GO SOUS RÉSERVE — `STAGING_DEPLOYED`

Les trois bloqueurs du NO GO du 2026-07-28 sont tous levés : artefact immuable déployé
(`sha-ac374193`), CI verte, capacité SMS réelle démontrée (mécanisme prouvé avec de vrais appels
Twilio). `STG-ISOL-01` **PASS** avant/après. Smoke **63/0**.

**Réserves maintenues, aucune bloquante pour ce GO :**
- `RSV-MIG-611-04` (Enterprise Architect, addendum DAT + décision OpenAPI) — reste **ouverte**,
  consignée en réserve, sans effet bloquant sur ce Gate (arbitrage explicite du PO).
- `RSV-MIG-611-06` — reste ouverte et bloquante, mais **sans rapport avec ce Lot A** (US-125
  seule concernée).
- Nouvelle réserve — dérive `docker-compose.staging.yml` de l'hôte (`LOYERTRACKER_TAG` vs
  `API_IMAGE_REF`/`WEB_IMAGE_REF`) à résorber avant le prochain cycle Production.
- Nouvelle réserve `RSV-EP16-N2-02` — couverture des échecs de livraison asynchrones par le
  fallback SMS, à arbitrer PO/Enterprise Architect, sans échéance bloquante fixée.

**Portée.** Conformément à `CLAUDE.md`, ce GO Staging n'autorise **aucun déploiement, aucune
promotion et aucune activation Production**. K8/ADR-18 inchangé : aucun credential Twilio en
Production tant que le Sprint N+2 n'est pas clos en GO. Prochaine action autorisée : instruire le
Gate Production du Sprint N+2 (distinct), sur instruction PO explicite.

## Rappels de verrous

- **K8 / ADR-18 inchangé** : aucune activation de canal externe en Production, aucun credential
  Twilio en Production, tant que le Sprint N+2 n'est pas **clos en GO**.
- **`RSV-MIG-611-06`** reste ouverte et bloquante pour US-125.
- **`RSV-MIG-611-04`** reste ouverte, consignée en réserve non bloquante pour ce GO Staging — à
  confirmer par l'Enterprise Architect avant le Gate Production.
- Aucune commande Docker globale, aucun `down` non ciblé, aucun `prune` sur l'hôte mutualisé.
