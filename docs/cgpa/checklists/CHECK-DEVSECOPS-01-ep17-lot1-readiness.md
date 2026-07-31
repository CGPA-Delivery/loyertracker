# Avis DevSecOps Lead — Gate 06A (DevSecOps Readiness), périmètre EP-17 avant Lot 1

> Instance projet, sur le même principe que `CHECK-UX-01-ep17-ui-foundation.md` pour Gate 04A :
> combine une checklist (gabarit `docs/cgpa/checklists/checklist-devsecops.md`, non modifié) et
> l'avis attendu par `docs/cgpa/agents/devsecops-lead.md` (« verifier le Gate 06A »). Produit par
> Claude Code en tant que **DevSecOps Lead**, sous-agent CGPA désigné le 2026-07-31
> (`docs/cgpa/agents/agent-designations-loyertracker.md`) pour ce périmètre précis.

| Champ | Valeur |
|---|---|
| Lot | EP-17 — Fondation UX/UI et continuité d'identité Angular–Keycloak, **avant Lot 1** (`plan-execution-ux-ui-primeng-keycloak.md` §3) |
| Date | 2026-07-31 |
| Gate concerné | Gate 06A — DevSecOps Readiness (`gate-06A-devsecops.md`) |
| Rappel de portée | Gate 06A valide la **capacité du dispositif**, pas l'exécution effective sur un artefact EP-17 donné — celle-ci relève de `DEVSECOPS-07` (avant promotion Staging) et `CHECK-CICD-01` (avant Gate Staging), tous deux distincts et non exécutés ici faute d'artefact EP-17 candidat. |
| Limite d'indépendance | Claude Code est co-auteur des artefacts revus ici (`ADR-UI-001`, `plan-execution-ux-ui-primeng-keycloak.md`) — cette limite, déjà tracée pour UX/UI Design Lead et Design Architect, s'applique identiquement. |

## 1. Capacité déjà prouvée (Gate 06A GO, 2026-06-16)

Le dispositif CI/CD/DevSecOps du projet a déjà obtenu **Gate 06A GO le 2026-06-16**
(`docs/cgpa/07-devsecops/gate-06A-decision.md`, DSO-01→05 automatisés) et couvre **de façon
générique** tout changement backend ou frontend, y compris l'ajout d'une dépendance npm comme
PrimeNG :

| Contrôle Gate 06A | État constaté (`.github/workflows/ci.yml`) | Couvre EP-17/Lot 1 ? |
|---|---|---|
| Pipeline fonctionnel et reproductible | Jobs `backend`, `frontend`, `security`, `docker-build`, `publish-images` actifs sur push/PR | Oui — déclenché automatiquement sur toute PR touchant `frontend/` |
| Build et tests automatiques | `frontend` : `ng build` production, `ng test` (Chrome headless), ESLint | Oui, inchangé par l'ajout de PrimeNG |
| SAST | CodeQL (Java+TS, `codeql.yml`) + SonarQube frontend (`sonarqube-scan-action`, quality gate bloquant) | Oui, générique au code TypeScript/Angular |
| SCA / dépendances | Job `security` : OWASP Dependency-Check (informatif) + Trivy sur les dépendances npm (bloquant HIGH/CRITICAL) | Oui — s'exécute sur `package-lock.json` mis à jour, donc sur PrimeNG dès son ajout |
| Secrets | Gitleaks (job `security`) | Oui, générique à tout fichier versionné, y compris les futurs fichiers de thème Keycloak (`infra/keycloak/themes/loyertracker/`) |
| Images conteneurs | `docker-build` scanne (Trivy) et signe (Cosign) `loyertracker-api` et `loyertracker-web` | Oui pour `loyertracker-web` (image Angular buildée) ; **sans objet** pour Keycloak — le thème est prévu comme fichiers statiques montés en volume sur l'image upstream `quay.io/keycloak/keycloak:24.0` (même mécanisme que `realm-loyertracker.json` déjà monté, `docker-compose.staging.yml`), aucune image custom Keycloak n'est construite en CI aujourd'hui ni prévue par le Plan |
| Artefact traçable | Tag immuable `sha-<8>` + digest, SBOM SPDX, attestation Cosign | Oui, inchangé |

**Conclusion de cette section** : aucun des critères bloquants du Gate 06A n'est aujourd'hui non
satisfait pour le périmètre EP-17/avant Lot 1. La capacité existante s'étend mécaniquement à
l'ajout de PrimeNG sans modification de pipeline.

## 2. Écarts identifiés

| # | Écart | Bloquant pour Lot 1 ? | Responsable | Échéance |
|---|---|---|---|---|
| 1 | Rapport de compatibilité/licence/sécurité PrimeNG **produit le 2026-07-31**
  (`rapport-licence-securite-primeng-lot0.md`) — révèle un fait nouveau et non anticipé par
  `DDS-LT-001`/`ADR-UI-001` : PrimeTek a fermé le dépôt PrimeNG le 2026-06-28 et restructuré le
  produit sous licence **PrimeUI** (Communautaire/Commercial) ; **seule `primeng@22.0.0`
  (2026-07-15) supporte Angular 22, et elle n'est plus MIT**. Écart requalifié : le rapport existe,
  mais la décision de licence à prendre par le Product Owner ne l'est pas encore | **Oui, pour
  l'entrée en Lot 1** (pas pour la capacité Gate 06A elle-même — ce n'est pas un critère du Gate,
  c'est un prérequis du Plan d'Exécution) | Product Owner (choix de licence), DevSecOps Lead
  (gestion opérationnelle de la clé) | Avant toute installation effective de PrimeNG (avant
  exécution du Lot 1) |
| 2 | `DEVSECOPS-07` non exécuté | Non — aucun artefact EP-17 n'existe encore ; classé **non exécuté**, jamais `non applicable`, conformément à `CLAUDE.md` et au Validation Framework CGPA v6.1.1 §4-5 | DevSecOps Lead | Avant la première promotion d'un artefact EP-17 (fin de Lot 1 ou plus tard) |
| 3 | `CHECK-CICD-01` non exécuté | Non — sections relatives à des jalons futurs explicitement exclues du résultat courant (`CHECK-CICD-01.md` §Résultat) | DevSecOps Lead | Avant Gate Staging du pilote (Lot 5) |
| 4 | `STG-ISOL-01` non réexécuté pour EP-17 | Non — pertinent seulement au moment d'un déploiement Staging du thème Keycloak (Lot 4), sur `ai-test-server` mutualisé | DevSecOps Lead | Avant toute promotion Staging du Lot 4 (`plan-execution-ux-ui-primeng-keycloak.md` §Lot 4 : prérequis déjà tracé) |

## 3. Avis DevSecOps Lead

**Proposition : GO sous réserve**, pour le périmètre Gate 06A / EP-17 avant Lot 1.

* Réserve unique et non bloquante pour le Gate 06A lui-même, mais **bloquante pour l'entrée
  effective en Lot 1** : écart #1. Le rapport lui-même est désormais produit
  (`rapport-licence-securite-primeng-lot0.md`, 2026-07-31), mais il révèle que PrimeNG a changé de
  licence (PrimeUI, Communautaire/Commercial) depuis la décision `DDS-LT-001` — la réserve reste
  ouverte, requalifiée : ce n'est plus « produire le rapport » mais « choisir explicitement entre
  Community License (sous réserve d'éligibilité à confirmer), Commercial License, ou reconsidérer
  `DDS-LT-001` ».
* Réserves non bloquantes reportées à leurs jalons naturels (écarts #2, #3, #4), déjà tracées dans
  le Plan d'Exécution — aucune nouvelle échéance créée ici au-delà de ce qui y figure déjà.
* Aucune exposition de secret connue ; aucune dépendance critique inconnue ; artefact et promotion
  restent tracables par le dispositif existant.

**Ce que cet avis ne fait PAS** :

* **Aucune décision de Gate 06A** (GO / GO sous réserve / NO GO) — cette proposition reste un avis
  de sous-agent ; la décision reste au CGPA Chief Delivery Officer (Product Owner,
  jptshilombo@gmail.com), conformément à `chief-delivery-officer.md` et à `CLAUDE.md` (« Aucun
  pipeline, score, audit automatique ou agent spécialisé ne remplace la validation humaine
  requise »).
* **N'autorise pas le démarrage du Lot 1** — celui-ci reste subordonné à l'approbation explicite du
  Plan d'Exécution par le Product Owner (`plan-execution-ux-ui-primeng-keycloak.md` §12 : « Statut
  PROPOSÉ — NON APPROUVÉ — CODE INTERDIT ») et à la levée de l'écart #1.
* **N'exécute pas `DEVSECOPS-07`** ni `CHECK-CICD-01` — aucun artefact EP-17 n'existe pour les
  exécuter ; ils restent explicitement `non exécuté`, jamais requalifiés `PASS` ou `non
  applicable`.

## Résultat

| Résultat | PASS / **PASS sous réserve** / FAIL / Non exécuté |
|---|---|
| Capacité Gate 06A (dispositif) | **PASS sous réserve** — réserve unique : écart #1 |
| DEVSECOPS-07 (artefact EP-17) | Non exécuté (aucun artefact) |
| CHECK-CICD-01 (promotion EP-17) | Non exécuté (jalon futur, exclu du résultat courant) |
| STG-ISOL-01 (Staging partagé, Lot 4) | Non exécuté (jalon futur) |
