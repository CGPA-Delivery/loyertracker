# Workflow - Project State File

## Objectif

Maintenir `/docs/project-state.md` comme source de continuite entre sessions humaines et agents IA, sans remplacer les livrables CGPA, les gates, le Plan d'Execution ou le rapport d'execution.

## Flux obligatoire

```text
Debut de session agent
-> Lecture obligatoire de /docs/project-state.md
-> Identification de la phase CGPA
-> Identification release, environnement et etat DevSecOps
-> Execution de l'action autorisee
-> Mise a jour du Plan d'Execution ou du rapport d'execution
-> Mise a jour de /docs/project-state.md
-> Resume final utilisateur
```

## Debut de session

1. Lire `/docs/project-state.md` s'il existe.
2. Si le fichier n'existe pas, le creer depuis `docs/cgpa/templates/project-state.md`.
3. Lire les livrables CGPA necessaires pour confirmer la phase, le gate, les risques et la prochaine action.
4. Identifier release actuelle, environnement actuel, etat DevSecOps et dernier gate de promotion si disponibles.
5. Produire un resume de reprise avant action: phase courante, gate, decision, livrables disponibles, ecarts connus et action autorisee.

## Pendant l'action

L'agent execute uniquement l'action autorisee par le gate et par le Plan d'Execution approuve lorsque l'action implique du codage, une refactorisation, une correction technique, une integration DevSecOps ou une modification applicative.

## Fin d'action

1. Mettre a jour le Plan d'Execution ou le rapport d'execution si l'etape l'exige.
2. Mettre a jour `/docs/project-state.md`.
3. Ajouter les decisions et etapes dans les historiques.
4. Actualiser release actuelle, environnement actuel, etat DevSecOps, observabilite, risques ouverts, blocages et prochaine action claire.
5. Signaler les contradictions entre le depot et le Project State.

## Livrable final

Resume utilisateur incluant les fichiers modifies, la phase CGPA, le gate, la decision, les risques residuels et la prochaine action recommandee.
