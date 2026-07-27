# Checklist - Staging partage - Alias de compatibilite

Checklist canonique : `docs/cgpa/checklists/stg-isol-01-checklist.md`.

Le contenu ci-dessous est conserve pour compatibilite avec CGPA v5.4.

# Checklist - Staging partage

## Identification

* [ ] Projet et environnement Staging identifies.
* [ ] Nom de projet Docker Compose unique defini.
* [ ] Proprietaire technique de la stack identifie.

## Isolation

* [ ] Stack Docker Compose propre au projet.
* [ ] Reseau Docker propre au projet.
* [ ] Volumes persistants propres au projet.
* [ ] Variables d'environnement et secrets propres au projet.
* [ ] Pipeline CI/CD propre au projet.
* [ ] Ressources partagees inventoriees et maitrisees.

## Deploiement

* [ ] Aucune commande Docker globale dans le pipeline.
* [ ] Les commandes ciblent explicitement le projet Compose.
* [ ] Aucun conteneur d'un autre projet n'est arrete.
* [ ] Aucun volume d'un autre projet n'est modifie ou supprime.
* [ ] Rollback cible documente.

## Reseau et ports

* [ ] Reverse proxy configure.
* [ ] Nom DNS Staging defini.
* [ ] Aucun acces public direct a un port applicatif n'est requis.
* [ ] Conventions de nommage Docker respectees.

## Controle

* Resultat `STG-ISOL-01` : PASS / FAIL
* Preuve :
* Reserves :
* Validation DevSecOps Lead :
* Validation Release Manager :

Un resultat `FAIL` impose `NO GO` au Gate Staging.
