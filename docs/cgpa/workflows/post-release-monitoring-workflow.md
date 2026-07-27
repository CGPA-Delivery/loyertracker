# Workflow - Post-release Monitoring

## Cadre

Workflow canonique CGPA v6.1.1. References : `../delivery/OBS-001.md`, `../checklists/CHECK-OPS-01.md` et `../gates/gate-10-mise-en-production.md`.

## Objectif

Surveiller la Release Candidate apres Production, verifier Gate 10 et cloturer la section post-Production de `CHECK-OPS-01` ou declencher incident et rollback.

## Entrees

* decision Gate Production valide et artefact autorise identifie ;
* deploiement Production effectif ;
* fenetre d'observation, metriques, seuils, alertes et responsables definis ;
* rollback executable ;
* section pre-Production de `CHECK-OPS-01` validee.

## Sequence

1. Horodater le debut de la fenetre de surveillance et confirmer l'identite de l'artefact deploye.
2. Executer les smoke tests Production.
3. Verifier disponibilite, erreurs critiques, logs, metriques systeme et metriques applicatives.
4. Verifier alertes, dashboards et canaux d'escalade.
5. Comparer les resultats aux seuils approuves pendant la fenetre convenue.
6. Le QA Lead rend l'avis smoke tests ; le Site Reliability Engineer rend l'avis stabilite et observabilite ; le Release Manager consolide l'etat de release.
7. Completer la section post-Production de `CHECK-OPS-01`.
8. Si un seuil critique est depasse, ouvrir l'incident, suspendre les promotions et evaluer immediatement le workflow `rollback-workflow.md`.
9. Gate 10 consolide les preuves d'execution ; le CGPA Chief Delivery Officer prononce `GO`, `GO sous reserve` ou `NO GO`.
10. Mettre a jour le rapport de release, les reserves, incidents et `../../project-state.md`.

## Correspondance des resultats

| CHECK-OPS-01 post-Production | Etat operationnel | Effet |
| --- | --- | --- |
| PASS | Stable | Gate 10 cloturable et suivi normal |
| PASS sous reserve | Stable sous surveillance | actions assignees et fenetre prolongee |
| FAIL | Incident ouvert | `NO GO`, promotions suspendues, rollback ou continuite decidee |

## Preuves et sorties

* smoke tests et mesures horodatees ;
* logs, dashboards, alertes et incidents references ;
* resultat post-Production de `CHECK-OPS-01` ;
* decision Gate 10 ;
* statut `PRODUCTION_DEPLOYED` seulement si les criteres du Gate 10 sont satisfaits ;
* decision de cloture, surveillance prolongee ou rollback.
