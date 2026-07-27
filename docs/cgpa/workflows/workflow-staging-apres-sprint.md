> Statut : support historique CGPA v5.2.1, non canonique pour v6.1.1. Utiliser `ci-cd-standard-workflow.md` et `environment-promotion-workflow.md` ; le Gate Staging courant exige `CHECK-CICD-01`.

# Workflow - Staging apres sprint

```text
Sprint termine
-> Rapport d'execution
-> Mise a jour project-state.md
-> Verification Gate 06A si controles DevSecOps modifies
-> Execution DEVSECOPS-07 pour l'artefact candidat
-> Gate Staging Readiness
-> Decision GO / GO sous reserve / NO GO
-> Deploiement staging si autorise
-> Smoke tests
-> Validation observabilite staging
-> Validation fonctionnelle
-> Mise a jour staging-state.md
-> Mise a jour project-state.md
-> Cloture formelle du sprint
```

## Regles de controle

* Le deploiement staging est interdit si le Gate Staging Readiness est NO GO.
* Un GO sous reserve exige des reserves documentees, acceptees et suivies.
* Le staging ne remplace pas la production.
* Staging et Production doivent rester distincts.
* Tout artefact candidat a Staging doit disposer des resultats DEVSECOPS-07 ou d'une reserve explicitement acceptee selon le risque.
* La validation staging inclut logs disponibles, monitoring actif et alertes critiques definies.
* La cloture formelle du sprint exige un rapport d'execution et un statut staging renseigne.

## Controle Staging partage

Le workflow inclut STG-ISOL-01 avant le Gate Staging. Le deploiement cible uniquement la stack du projet. Un resultat FAIL interdit le deploiement.
