# Rapport d'Execution Sprint

## 1. Identification

* Sprint :
* Projet :
* Version :
* Branche :
* Commit :
* Responsable :
* Agent :
* Date :

## 2. Objectif

Decrire l'objectif du sprint.

## 3. Plan approuve

* Reference du Plan d'Execution :
* Date d'approbation :
* Approbateur :
* Conditions ou reserves :

## 4. Stories realisees

| Story | Statut | Observation |
| ----- | ------ | ----------- |

## 5. Stories reportees

| Story | Motif | Prochaine action |
| ----- | ----- | ---------------- |

## 6. Fichiers modifies

| Fichier | Nature de modification | Risque |
| ------- | ---------------------- | ------ |

## 7. Tests executes

| Test | Resultat | Observation |
| ---- | -------- | ----------- |

## 8. Resultats

Resumer les resultats techniques, fonctionnels et DevSecOps.

## 8A. Rapport DEVSECOPS-07

| Controle | Resultat | Preuve | Observation |
| -------- | -------- | ------ | ----------- |
| Build applicable |  |  |  |
| Tests automatises |  |  |  |
| Analyse statique de qualite |  |  |  |
| Analyse automatisee des vulnerabilites |  |  |  |
| Quality gates projet |  |  |  |

## 9. Ecarts par rapport au plan

| Ecart | Impact | Decision |
| ----- | ------ | -------- |

## 10. Dette technique

Lister la dette technique creee, reduite ou reportee.

## 11. Risques restants

| Risque | Niveau | Mitigation |
| ------ | ------ | ---------- |

## 12. Eligibilite au Gate Staging

* Build stable :
* Tests unitaires :
* Tests integration critiques :
* Analyse qualite :
* Analyse vulnerabilites :
* Quality gates :
* Rapport DEVSECOPS-07 :
* Migrations DB :
* Secrets :
* Rollback :
* Rapport d'execution :

## 13. Recommandation Gate Staging

* GO
* GO sous reserve
* NO GO

Justification :

## 14. Statut Staging

* Statut Staging :
* Date de deploiement Staging :
* Environnement Staging :
* Version ou artefact deployee :
* Smoke tests Staging :
* Reserves Staging :

## 15. Validations release

* Validation Product Owner :
* Date validation Product Owner :
* Validation Release Manager :

## 19. Controle CHECK-FIN-01

* Financial Governance Pack applicable : oui / non
* Perimetre financier concerne :
* Checklist : `docs/cgpa/finance/CHECK-FIN-01.md`
* Resultat avant merge significatif : PASS / PASS sous reserve / FAIL / non applicable
* Resultat avant cloture Sprint : PASS / PASS sous reserve / FAIL / non applicable
* Preuves de tests financiers :
* Recalcul et rapprochement :
* Migrations et rollback :
* Reserves, responsables et echeances :
* Date validation Release Manager :

## 16. Eligibilite Production

* Eligible Production : oui / non / sous reserve
* Perimetre Production potentiel : Epic / Release / Hotfix / non applicable
* Elements restant en Staging :
* Risques de derive Staging / Production :
* Rollback Production identifie :

## 17. Decision Gate Production

* Gate Production requis : oui / non
* Decision Gate Production : GO / GO sous reserve / NO GO / non execute
* Date decision :
* Justification :
* Actions avant Production :

## 18. Controle STG-ISOL-01

| Verification | Resultat | Preuve |
| ------------ | -------- | ------ |
| Conteneurs des autres projets non arretes |  |  |
| Volumes des autres projets non impactes |  |  |
| Ressources partagees maitrisees |  |  |
| Conventions Docker respectees |  |  |
| Nom Compose explicite et unique |  |  |

* Resultat STG-ISOL-01 : PASS / FAIL
* Validation DevSecOps Lead :
* Validation Release Manager :
