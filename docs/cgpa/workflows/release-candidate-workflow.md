# Workflow - Release Candidate

## Cadre

Workflow canonique CGPA v6.1.1. References : `../delivery/REL-001.md`, `../checklists/CHECK-REL-01.md` et `../gates/gate-07A-release.md`.

## Objectif

Produire une Release Candidate identifiable, versionnee, immutable et issue de l'artefact exact valide en Staging, puis la presenter au Gate 07A.

## Declencheur et entrees

* perimetre Epic, Release, Patch ou Hotfix valide ;
* artefact Staging deploye et preuves Staging disponibles ;
* rapport QA et non-regression critique conforme ;
* version selon SemVer, CalVer ou une convention documentee ;
* rollback et release notes en preparation.

## Sequence

1. Fixer le perimetre fonctionnel et technique de la release.
2. Identifier l'artefact Staging par provenance, commit, version et digest ou identifiant immutable.
3. Verifier que les validations Staging concernent exactement cet artefact.
4. Attribuer la version de Release Candidate selon la convention du projet.
5. Figer l'artefact sans reconstruction ni substitution.
6. Produire changelog, release notes et inventaire des migrations.
7. Documenter rollback applicatif, donnees, configuration et conditions de declenchement.
8. Executer `CHECK-REL-01` et associer chaque preuve a la Release Candidate.
9. Le QA Lead rend l'avis qualite ; le Delivery Architect confirme provenance et immutabilite ; le Release Manager rend l'avis de readiness.
10. Le CGPA Chief Delivery Officer prononce la decision Gate 07A.
11. Un `FAIL` ou `NO GO` bloque la RC ; toute correction produit une nouvelle RC et une nouvelle identite.
12. Une decision favorable autorise la preparation de `CHECK-OPS-01` pre-Production, sans attribuer encore `PRODUCTION_READY`.
13. Mettre a jour `../../project-state.md` avec RC, decision, preuves, reserves et prochaine action.

## Regles

* toute modification binaire, de configuration embarquee ou de migration apres gel cree une nouvelle RC ;
* la RC promue en Production est strictement celle validee en Staging ;
* Gate 07A ne remplace pas Gate Production ;
* `PASS sous reserve` et `GO sous reserve` exigent des reserves non bloquantes, acceptees, datees et assignees.

## Sorties

* identite immutable de la RC ;
* changelog et release notes ;
* rapport QA et preuves Staging ;
* `CHECK-REL-01` ;
* rollback ;
* decision Gate 07A et avis specialises.
