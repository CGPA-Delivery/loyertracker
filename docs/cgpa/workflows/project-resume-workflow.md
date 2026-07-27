> Statut : support historique CGPA v5.0.1. Pour une reprise v6.1.1, utiliser `workflow-project-state.md`, `workflow-audit-projet-existant.md` et le routage contextuel `../agents/agent-routing-rules.md`. L'activation automatique d'agents decrite ci-dessous reste historique.

# Project Resume Workflow - CGPA v5.0.1

## Objectif

Ce workflow encadre la reprise d'un projet existant sous CGPA v5.0.1.

Il garantit que la migration conserve l'historique, les gates valides, les decisions, le backlog, les sprints et les rapports existants.

## Etape 1 - Lecture project-state.md

Le CGPA Chief Delivery Officer lit `/docs/project-state.md` avant toute decision.

Si le fichier n'existe pas, il doit etre cree depuis `docs/cgpa/templates/project-state.md`, puis complete a partir des livrables existants sans inventer de validation.

## Etape 2 - Identification

Identifier :

* phase courante ;
* gate courant ;
* sprint courant ;
* version framework ;
* version source de migration ;
* gates deja valides ;
* livrables disponibles ;
* reserves ouvertes.

## Etape 3 - Validation coherence

Verifier la coherence entre :

* phase courante ;
* gate courant ;
* historique des decisions ;
* historique des etapes ;
* backlog ;
* registre des risques ;
* rapports d'execution ;
* rapports de staging ;
* ADR et decisions d'architecture ;
* pipelines, releases et rollback.

La validation ne doit jamais rejouer un gate deja valide. Elle controle uniquement la coherence documentaire et operationnelle.

## Etape 4 - Activation des sous-agents

Activer automatiquement les sous-agents CGPA v5.0 :

* Governance Officer ;
* Enterprise Architect ;
* DevSecOps Lead ;
* Release Manager.

Chaque sous-agent execute son controle de continuite dans son domaine.

## Etape 5 - Reprise du projet

Reprendre le projet a la phase courante documentee.

Les actions suivantes doivent etre tracees dans `/docs/project-state.md` :

* decision de reprise ;
* reserves bloquantes ;
* reserves non bloquantes ;
* actions correctives ;
* prochaine action autorisee.

## Sortie

La sortie du workflow est une decision :

* `Resume Approved` ;
* `Resume Approved with Reservations` ;
* `Resume Rejected`.

## Regle de protection

Une reprise CGPA v5.0.1 ne peut pas :

* revenir a la phase 0 ;
* supprimer l'historique ;
* rejouer un gate valide ;
* reconstruire le backlog ;
* annuler une decision validee sans justification formelle.
