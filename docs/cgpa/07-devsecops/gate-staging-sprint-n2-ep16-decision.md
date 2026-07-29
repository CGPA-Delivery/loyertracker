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
| **Incrément fusionné sur `main`** | **FAIL** | `origin/main` est à `43f9fbd` (PR #289). **PR #291 est en brouillon, non fusionnée** |
| **Artefact candidat immuable identifié** | **FAIL** | **Aucune image GHCR n'existe** pour `6a56ef1b` — vérifié par lecture de l'API GHCR : 0 version portant un tag `sha-6a56ef1*`. Sans fusion, le job Packaging ne s'exécute pas |
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

## Rappels de verrous

- **K8 / ADR-18 inchangé** : aucune activation de canal externe en Production, aucun credential
  Twilio en Production, tant que le Sprint N+2 n'est pas **clos en GO**.
- **`RSV-MIG-611-06`** reste ouverte et bloquante pour US-125.
- **`RSV-MIG-611-04`** (addendum DAT, décision OpenAPI) devient exigible : le Lot A introduit une
  fonction SQL et une logique de dispatch nouvelles. À confirmer par l'Enterprise Architect avant
  la ré-instruction du Gate.
- Aucune commande Docker globale, aucun `down` non ciblé, aucun `prune` sur l'hôte mutualisé.
