# ADR-CICD-002 - Environment Promotion Model

## Statut

Acceptee.

## Contexte

Les environnements Dev, Staging et Production sont souvent confondus. CGPA v6.1 impose une separation claire des objectifs, proprietaires, donnees et criteres de passage.

## Decision

Le modele de promotion standard est :

Local -> Dev -> Integration -> QA -> Staging -> Pilot -> Production.

Tous les environnements ne sont pas obligatoires pour tous les projets, mais Dev, Staging et Production doivent etre separes lorsqu'une Production existe.

## Regles

* Local sert au developpement individuel.
* Dev sert a l'integration technique rapide.
* Integration/QA servent aux validations specialisees si le risque le justifie.
* Staging sert a la pre-production fonctionnelle.
* Pilot sert a une exposition limitee si necessaire.
* Production sert a l'exploitation reelle.

## Consequences

* Les criteres d'entree et de sortie sont explicites.
* Les donnees sensibles sont mieux controlees.
* Les promotions deviennent auditables.