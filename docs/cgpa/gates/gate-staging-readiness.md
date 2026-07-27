# Gate Staging Readiness

## Cadre

Gate actif CGPA v6.1.1. Il conserve l'acquis CGPA v5.3 du deploiement Staging apres sprint valide et applique les controles Enterprise Delivery introduits en v6.1.

## Objectif

Autoriser ou refuser la promotion vers Staging d'un artefact immutable, identifie et controle.

## Conditions d'entree

* sprint ou perimetre de changement cloture et rapport d'execution disponible ;
* Plan d'Execution respecte ou ecarts acceptes ;
* artefact candidat identifie par version et identifiant immutable ;
* build et tests critiques executes ;
* `DEVSECOPS-07` disponible ;
* `CHECK-CICD-01` executee pour la promotion ;
* rollback Staging et smoke tests definis ;
* `STG-ISOL-01` executee si le Staging est partage.

## Criteres GO

* `CHECK-CICD-01` est `PASS` ;
* build, tests unitaires, integration critique et non-regression critique conformes ;
* quality gates, analyses qualite et vulnerabilites conformes au risque ;
* migrations verifiees et secrets non exposes ;
* rollback, logs, monitoring et alertes critiques prets ;
* `STG-ISOL-01` est `PASS` lorsqu'elle est applicable ;
* risques residuels acceptables et preuves archivables.

## Criteres GO sous reserve

* `CHECK-CICD-01` est `PASS sous reserve` ;
* controles critiques conformes ;
* uniquement des ecarts non bloquants ;
* chaque reserve est acceptee, assignee et datee ;
* `STG-ISOL-01` ne contient aucun echec d'isolation bloquant.

## Criteres NO GO

* `CHECK-CICD-01` absente ou `FAIL` ;
* build casse, tests critiques echoues ou non-regression critique non demontree ;
* artefact non identifiable ou non tracable ;
* migration non verifiee, secret expose ou rollback absent ;
* resultats DevSecOps indisponibles ;
* risque majeur non traite ;
* `STG-ISOL-01` en `FAIL` sur un controle bloquant ;
* `CHECK-FIN-01` absente ou en `FAIL` bloquant lorsque le perimetre financier est applicable.

## Avis et decision

* DevSecOps Lead : avis `DEVSECOPS-07` et securite ;
* QA Lead : avis tests et non-regression ;
* Delivery Architect : avis promotion et tracabilite de l'artefact ;
* Release Manager : avis de readiness Staging ;
* CGPA Chief Delivery Officer : decision finale `GO`, `GO sous reserve` ou `NO GO`.

Un echec bloquant ne peut pas etre transforme en `GO sous reserve`.

## Sortie attendue

* decision et avis consolides ;
* identite de l'artefact autorise ;
* reserves et actions correctives ;
* statut `STAGING_READY`, puis `STAGING_DEPLOYED` apres deploiement effectif ;
* mise a jour de `docs/project-state.md`.

## STG-ISOL-01 - Isolation du deploiement Staging

Sur un Staging partage, la checklist canonique `../checklists/stg-isol-01-checklist.md` est obligatoire. Un resultat `FAIL` sur un controle d'isolation bloquant impose `NO GO` sans exception. Un `PASS sous reserve` n'est recevable que pour un ecart non bloquant, date, assigne et accepte avant promotion.

## CHECK-FIN-01 - Integrite financiere

Pour un projet financier, la checklist canonique `../finance/CHECK-FIN-01.md` doit etre completee. Les tests financiers critiques, migrations, rollback, securite, recalcul et rapprochement doivent disposer de preuves. Un echec bloquant d'immutabilite, de coherence du ledger, de tracabilite, de devise ou d'idempotence impose `NO GO`.
