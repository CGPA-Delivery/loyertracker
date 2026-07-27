# CHECK-CICD-01 - Checklist CI/CD Standard

## Objectif

Verifier qu'un changement applicatif suit le workflow CI/CD standard CGPA avant promotion vers Dev, Staging ou Production. Cette checklist est obligatoire pour tout changement significatif affectant code, migrations, infrastructure, pipeline, secrets, images, dependances ou environnements.

## Identification

* [ ] Projet et changement identifies.
* [ ] Branche source et branche cible identifiees.
* [ ] Version, commit, image ou artefact candidat et son identifiant immutable traces.
* [ ] Environnement cible identifie.
* [ ] Responsable technique et validateur release identifies.

## Controle local et CI

* [ ] Build local ou justification documentee.
* [ ] Tests unitaires et controles de conventions executes.
* [ ] Migrations verifiees si applicables.
* [ ] Aucun secret ajoute au code, aux logs ou a la configuration.
* [ ] Pipeline CI declenche et build conforme.
* [ ] Tests unitaires et integration critique conformes.
* [ ] Analyses qualite, dependances et vulnerabilites executees selon le risque.
* [ ] Quality gate satisfait ou reserve non bloquante documentee.
* [ ] Rapport CI/CD disponible et archivable.

## Deploiement Dev Server

* [ ] Deploiement Dev autorise apres CI conforme.
* [ ] Environnement, variables et secrets Dev maitrises.
* [ ] Migration, smoke tests, logs et anomalies Dev traces.

## Promotion vers Staging

* [ ] Pull Request revue selon la Branch Strategy.
* [ ] Plan d'Execution respecte ou ecarts acceptes.
* [ ] Rapport d'execution disponible si applicable.
* [ ] `DEVSECOPS-07` renseigne selon le risque.
* [ ] `STG-ISOL-01` completee si Staging est partage.
* [ ] Migration, rollback et smoke tests Staging prepares.
* [ ] Gate Staging execute.
* [ ] Decision Gate Staging : `GO` / `GO sous reserve` / `NO GO`.

## Validation sur Staging

* [ ] Validation fonctionnelle et technique realisee.
* [ ] Validation securite realisee selon le risque.
* [ ] Validation UX/UI realisee si applicable.
* [ ] Tests de non-regression critiques executes.
* [ ] Avis QA Lead trace.
* [ ] Defauts bloquants absents.
* [ ] Eligibilite Production explicite.

## Promotion vers Production

* [ ] Gate 07A execute et valide.
* [ ] `CHECK-REL-01` completee.
* [ ] Section pre-Production de `CHECK-OPS-01` completee.
* [ ] Release Candidate versionnee, provenancee et immutable.
* [ ] Changelog et release notes disponibles.
* [ ] Artefact Production strictement identique a celui valide en Staging, preuve par digest ou identifiant non ambigu.
* [ ] Migration, rollback et restauration prepares.
* [ ] Monitoring, logs, alertes et escalade prets.
* [ ] Gate Production execute.
* [ ] Decision Gate Production : `GO` / `GO sous reserve` / `NO GO`.

## Post-deploiement Production

* [ ] Smoke tests, logs, monitoring et alertes verifies.
* [ ] Section post-Production de `CHECK-OPS-01` completee.
* [ ] Incident ou anomalie post-release trace.
* [ ] `docs/project-state.md` et rapport de release mis a jour.

## Resultat

Le resultat est etabli pour un environnement cible, un jalon et un artefact identifies. Les sections correspondant a des jalons futurs restent non executees et sont exclues du resultat courant. Appliquer `../VALIDATION-FRAMEWORK-v6.1.1.md`.

| Resultat | Signification |
| --- | --- |
| PASS | Le changement peut etre promu vers l'environnement cible. |
| PASS sous reserve | Promotion possible avec reserves non bloquantes, acceptees, datees et assignees. |
| FAIL | Promotion interdite et decision `NO GO` au Gate concerne. |
