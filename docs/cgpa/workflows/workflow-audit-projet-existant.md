# Workflow - Audit d'un projet existant CGPA v6.1.1

Appliquer `../VALIDATION-FRAMEWORK-v6.1.1.md` et le template `../templates/rapport-audit-cgpa.md`.

## Etapes

1. Lire `/docs/project-state.md` et identifier version, phase, Gates, preuves, DCL et action autorisee.
2. Si le Project State est absent, constater l'ecart sans inventer de valeur ; proposer sa creation depuis `../templates/project-state.md`.
3. Realiser un premier audit en lecture seule.
4. Inventorier livrables, code, configuration, documentation, CI/CD, rapports, decisions et historiques.
5. Comparer le Project State avec la realite du depot et signaler les contradictions.
6. Determiner l'applicabilite des domaines et justifier les exemptions.
7. Evaluer les controles avec des preuves recevables et identifier les bloqueurs.
8. Calculer le score normalise uniquement sur les axes applicables et tracer le DCL separement.
9. Recueillir les avis des agents specialises.
10. Le CGPA Chief Delivery Officer produit GO, GO sous reserve ou NO GO.
11. Produire un plan de remediation avec responsables, echeances et preuves attendues.
12. Mettre a jour `/docs/project-state.md` uniquement apres autorisation explicite, sans supprimer l'historique.

## Regles de continuite

* ne jamais revenir a la Phase 00 pour un projet engage ;
* ne jamais rejouer artificiellement un Gate valide ;
* une reevaluation cree une nouvelle decision et reference la precedente ;
* un score ne compense jamais un FAIL bloquant ;
* une preuve ou une validation ne doit jamais etre inventee.

## Livrable final

Rapport d'audit, score normalise, couverture des preuves, DCL, avis specialises, bloqueurs, reserves, decision finale et prochaine action autorisee.
