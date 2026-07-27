# Guide de migration CGPA v6.1 vers v6.1.1

## 1. Objet

CGPA v6.1.1 corrige la propagation incomplete de l'Enterprise Delivery Governance introduite par CGPA v6.1 dans les documents actifs et les templates du framework.

## 2. Nature de la version

CGPA v6.1.1 est une version corrective de synchronisation. Elle n'introduit aucun nouveau concept de gouvernance, aucune nouvelle phase, aucun nouveau Gate, aucun nouvel agent et aucune nouvelle checklist permanente.

Le document `CGPA-v6.1.md` demeure le referentiel normatif de fond. Le present guide decrit uniquement la correction documentaire v6.1.1.

## 3. Projets concernes

La migration concerne :

* le framework CGPA lui-meme ;
* les nouveaux projets initialises avec un ancien template Project State ;
* les projets v6.1 dont le Project State ne contient pas les blocs Delivery ;
* les projets encore declares v6.0 alors qu'ils utilisent des artefacts Enterprise Delivery Governance v6.1.

## 4. Changements obligatoires

Pour chaque projet concerne :

* mettre la version active a jour vers v6.1.1 ;
* renseigner `framework.current_version` et conserver la version source dans `migrated_from` ;
* synchroniser le Project State avec le template v6.1.1 ;
* ajouter les blocs Delivery manquants sans supprimer les valeurs existantes ;
* verifier les references internes et les chemins des artefacts Delivery ;
* conserver les historiques de phases, Gates, decisions, risques, reserves et releases.

## 5. Changements non requis au LOT 1

Le LOT 1 ne modifie pas :

* le modele des agents, reserve au LOT 2 ;
* les Gates, reserves au LOT 3 ;
* les workflows, reserves au LOT 4 ;
* les prompts Enterprise complets, reserves au LOT 5 ;
* l'automatisation d'audit, reservee a un lot ulterieur.

Les incoherences detectees dans ces domaines sont documentees, pas corrigees pendant le LOT 1.

## 6. Procedure de migration

1. Creer ou reprendre une branche dediee depuis la derniere version de `origin/main` sans reecrire l'historique.
2. Executer `git status` et inventorier les changements locaux afin de les preserver.
3. Copier le Project State existant dans l'historique Git et comparer sa structure au template `docs/cgpa/templates/project-state.md`.
4. Mettre a jour uniquement les declarations de version actives ; ne pas remplacer les references historiques.
5. Ajouter les champs manquants du template en conservant toutes les valeurs, decisions et preuves existantes.
6. Renseigner `migrated_from: "6.1"`; laisser `migration_date` vide tant que la validation n'est pas finalisee.
7. Verifier l'existence et la casse de chaque chemin ajoute ou modifie.
8. Examiner `git diff`, executer `git diff --check` et exclure du commit tout changement hors perimetre.
9. Creer un commit documentaire unique, pousser uniquement la branche dediee et soumettre le LOT 1 a validation humaine.

Cette procedure est reversible car chaque modification reste isolee dans un commit Git et aucun historique n'est reecrit.

## 7. Controles de validation

La validation doit confirmer :

* la declaration active de v6.1.1 dans les cinq documents du LOT 1 ;
* la presence du bloc YAML `framework` dans les deux Project State ;
* l'alignement structurel des domaines essentiels des deux Project State ;
* la presence de Branch Strategy, Promotion Strategy, Release Candidate, artefact immutable, rollback, observabilite, Operations Readiness et DCL ;
* la presence des checklists et artefacts Delivery attendus ;
* la validite et la casse des liens et chemins internes ;
* l'absence de perte de donnees utiles ;
* la conservation des historiques et des references historiques legitimes.

## 8. Rollback

En cas d'echec, ne pas utiliser `git reset --hard`, `git clean` ni une reecriture d'historique.

Pour une branche non fusionnee, creer un nouveau commit qui restaure le contenu connu du commit precedent. Pour une branche deja partagee ou fusionnee, utiliser `git revert <commit>` afin de produire un commit inverse auditable. Verifier ensuite le Project State restaure et conserver le rapport d'incident ou la reserve associee.

## 9. Decision

La validation du projet migre produit une decision explicite :

* **GO** : tous les controles du LOT 1 passent sans reserve ;
* **GO sous reserve** : aucun ecart bloquant, mais une ou plusieurs reserves sont assignees et tracees ;
* **NO GO** : version, structure, liens, integrite des donnees ou historique non conformes.

Aucun LOT suivant ne commence avant validation humaine de la decision du LOT 1.