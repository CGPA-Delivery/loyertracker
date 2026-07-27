# Gate 06A - DevSecOps Readiness

## Cadre

Gate actif CGPA v6.1.1. CGPA v6.1 a introduit la pipeline readiness ; v6.1.1 en synchronise les criteres sans creer de nouveau Gate.

## Objectif

Verifier que le projet dispose d'une strategie CI/CD, de controles DevSecOps et d'une capacite de promotion reproductible, securisee et tracable.

Gate 06A valide la capacite du dispositif. Il ne remplace pas `DEVSECOPS-07`, qui controle l'execution effective sur chaque artefact candidat a une promotion, ni `CHECK-CICD-01`, execute avant Gate Staging.

## Conditions d'entree

* Delivery Strategy, Branch Strategy et Promotion Strategy definies ;
* pipeline et environnements cibles identifies ;
* dependances, secrets et migrations inventories ;
* niveau de risque et Delivery Capability Level actuel explicites ;
* mecanisme de tracabilite des preuves defini.

## Criteres GO

* pipeline fonctionnel et reproductible ;
* build, tests automatiques et quality gates executables ;
* SAST, SCA, controle des secrets et des dependances disponibles selon le risque ;
* artefact identifiable et tracable entre les environnements ;
* promotions soumises a des controles explicites ;
* resultats archivables dans `docs/project-state.md` ou un rapport associe ;
* capacite d'executer `DEVSECOPS-07`, `CHECK-CICD-01` et, si applicable, `STG-ISOL-01`.

## Criteres GO sous reserve

* capacite utilisable avec ecarts non bloquants ;
* build et tests critiques reproductibles ;
* aucune exposition de secret connue ;
* controles reportes assortis d'un responsable, d'une echeance et d'une acceptation de risque ;
* trajectoire DCL documentee.

## Criteres NO GO

* build non reproductible ou tests critiques inexecutable ;
* secret expose ou suspicion non traitee ;
* dependances critiques inconnues ;
* absence de controle securite pour un projet a risque ;
* artefact ou promotion non tracable ;
* impossibilite d'executer `DEVSECOPS-07` ou `CHECK-CICD-01` ;
* impossibilite d'executer `STG-ISOL-01` sur un Staging partage.

## Avis et decision

* DevSecOps Lead : avis sur les controles automatises et la securite ;
* Delivery Architect : avis sur la strategie de branche, de promotion et de pipeline ;
* Enterprise Architect : avis sur les NFR et les ecarts structurants ;
* CGPA Chief Delivery Officer : decision finale `GO`, `GO sous reserve` ou `NO GO`.

Un `GO sous reserve` exige des reserves non bloquantes, datees, assignees et acceptees. Tout critere bloquant impose `NO GO`.

## Sortie attendue

* decision Gate 06A et avis consolides ;
* reserves et actions correctives ;
* DCL actuel et cible ;
* preuves referencees ;
* mise a jour de `docs/project-state.md`.

## Capacite d'isolation Staging

Lorsque le Staging est partage, le projet doit pouvoir deployer avec un nom Compose unique, des reseaux et volumes isoles, des secrets separes, un reverse proxy maitrise et un pipeline limite aux ressources du projet.
