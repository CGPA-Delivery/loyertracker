# Workflow - Environment Promotion

## Cadre

Workflow canonique CGPA v6.1.1. References : `../delivery/ADR-CICD-002.md`, `../delivery/ENV-001.md` et `ci-cd-standard-workflow.md`.

## Objectif

Promouvoir un artefact immutable entre environnements sans reconstruction, substitution ou contournement des Gates.

## Entrees

* environnement source, environnement cible et proprietaires identifies ;
* artefact candidat avec version, provenance et digest ou identifiant non ambigu ;
* criteres d'entree et de sortie documentes ;
* preuves et rollback applicables disponibles ;
* decision du Gate requise pour la cible.

## Controles par cible

| Cible | Controle minimal | Decision ou statut attendu |
| --- | --- | --- |
| Dev | CI conforme | deploiement automatise autorise par la strategie |
| Integration / QA | tests specialises selon le risque | avis technique ou QA trace |
| Staging | `CHECK-CICD-01`, `STG-ISOL-01` si applicable, Gate Staging | `STAGING_READY` puis `STAGING_DEPLOYED` |
| Pilot | decision release documentee | statut propre au projet sans nouveau statut CGPA |
| Production | Gate 07A, `CHECK-REL-01`, `CHECK-OPS-01` pre-Production, Gate Production | `PRODUCTION_READY` puis `PRODUCTION_DEPLOYED` apres Gate 10 |

## Sequence

1. Identifier la source, la cible et l'artefact candidat.
2. Comparer l'identifiant immutable aux preuves de l'environnement source.
3. Refuser toute reconstruction ou substitution de l'artefact.
4. Verifier les criteres d'entree, secrets, donnees, migrations et dependances de la cible.
5. Executer les checklists et obtenir les avis specialises requis.
6. Le CDO prononce la decision du Gate applicable.
7. Sur `NO GO` ou checklist `FAIL`, arreter la promotion et tracer les corrections.
8. Sur `GO` ou `GO sous reserve`, enregistrer l'artefact autorise, les reserves et la fenetre.
9. Promouvoir l'artefact selon la strategie approuvee.
10. Executer les migrations et smoke tests prevus.
11. En cas d'echec critique, suspendre la promotion, proteger l'environnement et evaluer le rollback.
12. Mettre a jour le statut, les preuves et `../../project-state.md`.

## Responsabilites

* Delivery Architect : coherence de la Promotion Strategy et de l'identite de l'artefact ;
* DevSecOps Lead : execution technique et preuves pipeline ;
* QA Lead : avis tests et non-regression ;
* Site Reliability Engineer : observabilite et seuils Production ;
* Release Manager : coordination de la fenetre et avis de promotion ;
* CGPA Chief Delivery Officer : decision finale du Gate.

## Regles bloquantes

* Production exige un rollback credible et approuve ; une simple strategie de correction ne le remplace pas.
* Un `FAIL` critique ou un artefact non identique impose l'arret.
* Un `GO sous reserve` ne couvre que des ecarts non bloquants, acceptes, dates et assignes.
