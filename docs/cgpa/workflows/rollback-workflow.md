# Workflow - Rollback

## Cadre

Workflow canonique CGPA v6.1.1. References : `../delivery/REL-001.md`, `../delivery/OBS-001.md` et `../gates/gate-09-production-readiness.md`.

## Objectif

Preparer, autoriser, executer et verifier un retour controle vers un etat stable lorsque les seuils approuves l'exigent.

## Perimetres possibles

* application ou image ;
* base de donnees et donnees ;
* infrastructure ;
* configuration ou secrets ;
* feature flag.

## Preparation avant Production

1. Identifier la version stable cible par un identifiant immutable.
2. Definir les composants, donnees et dependances affectes.
3. Documenter les commandes ou actions dans le runbook du projet sans secret en clair.
4. Definir sauvegardes, restauration et traitement des migrations irreversibles.
5. Definir seuils, signaux, fenetre de decision et responsables.
6. Tester ou demontrer la procedure selon le risque.
7. Associer la preuve au Gate Production et a `CHECK-REL-01`.

L'absence d'un rollback credible pour une Production applicable impose `NO GO`. Une exception ne peut pas contourner un critere bloquant du Gate Production.

## Declencheurs

* smoke test critique en echec ;
* indisponibilite ou degradation au-dela du seuil approuve ;
* erreur securite, integrite de donnees ou conformite critique ;
* migration en echec ;
* decision d'incident exigeant le retour a l'etat stable.

## Sequence d'execution

1. Ouvrir ou mettre a jour l'incident et geler les promotions suivantes.
2. Le Site Reliability Engineer qualifie les signaux ; le QA Lead confirme l'impact ; le DevSecOps Lead confirme l'executabilite technique.
3. Le Release Manager propose l'execution et coordonne la fenetre.
4. Le CGPA Chief Delivery Officer prononce la decision de rollback sur la base des avis specialises et des seuils approuves.
5. Proteger les donnees et executer la procedure approuvee vers la cible immutable.
6. Executer restauration, migrations inverses ou mesures compensatoires approuvees.
7. Verifier smoke tests, disponibilite, integrite, logs, metriques et alertes.
8. Si le rollback echoue, maintenir l'incident critique, appliquer le plan de continuite et escalader selon le runbook.
9. Tracer heure, operateur, artefacts, resultats, ecarts et decision de stabilite.
10. Mettre a jour `CHECK-OPS-01`, le rapport de release et `../../project-state.md`.

## Sorties

* decision et preuve d'execution ;
* version restauree ou etat de continuite ;
* resultats de validation apres restauration ;
* incident et actions correctives ;
* suspension ou reprise explicitement autorisee des promotions.
