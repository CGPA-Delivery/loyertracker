# Checklist migration CGPA v5.3 vers v5.4

## Continuite

* [ ] Version source et phase courante identifiees.
* [ ] Gates valides et historique conserves.
* [ ] `current_version` passe a `5.4`.
* [ ] `migrated_from` renseigne avec la version source.

## Inventaire Staging

* [ ] Projets et stacks heberges inventories.
* [ ] Conteneurs, reseaux, volumes et ports inventories.
* [ ] Ressources partagees identifiees avec leur proprietaire.
* [ ] Commandes globales dangereuses recherchees dans les pipelines.

## Isolation

* [ ] Nom Compose unique attribue a chaque projet.
* [ ] Reseaux et volumes isoles.
* [ ] Variables et secrets separes.
* [ ] Reverse proxy et noms DNS definis.
* [ ] Pipeline limite aux ressources du projet.
* [ ] Rollback cible documente.

## Gouvernance

* [ ] ADR-STG-001 reference.
* [ ] D-STG-01 a D-STG-05 traces.
* [ ] STG-ISOL-01 ajoute au Gate Staging.
* [ ] DevSecOps Lead et Release Manager responsables identifies.
* [ ] Exceptions inscrites au registre des decisions.

## Validation

* [ ] STG-ISOL-01 execute avant la prochaine promotion Staging.
* [ ] Smoke tests executes sans impact interprojets.
* [ ] `staging-state.md` mis a jour.
* [ ] `/docs/project-state.md` mis a jour.
