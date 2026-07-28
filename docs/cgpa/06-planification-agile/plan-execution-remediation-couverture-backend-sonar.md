# Plan d'Exécution — Remédiation du Quality Gate Backend SonarQube

## 1. Identification

- Projet : LoyerTracker.
- Version applicative : inchangée.
- Phase CGPA : Phase 06 — DevSecOps Readiness.
- Sujet : blocage du Quality Gate Backend observé après la fusion de la PR #278.
- Date : 2026-07-28.
- Responsables : QA Lead, Engineering Lead et DevSecOps Lead.
- Statut : **approuvé humainement**.
- Décision : **GO explicite reçu le 2026-07-28 via la conversation de pilotage**.

## 2. Constat prouvé

- CI `main` post-fusion #278, run `30336444301` : échec Backend à l'analyse SonarQube.
- CI PR #279, run `30336894626` : même échec sur deux tentatives du même SHA.
- Build, tests Maven et garde JaCoCo locale : PASS.
- Quality Gate : `new_coverage = 79,9 %`, seuil bloquant `80 %`.
- Mesures complémentaires : `new_line_coverage = 83,8 %`,
  `new_branch_coverage = 62,1 %`, 257 lignes non couvertes sur 1 586.
- `new_violations = 0`, duplication et security hotspots conformes.
- La PR #279 ne modifie aucun fichier Backend : le déficit appartient à la baseline récente et
  n'est pas causé par son diff documentaire.

## 3. Objectif

Restaurer un Quality Gate Backend conforme par des tests utiles et ciblés sur du code récent,
avec une marge au-dessus de 80 %, sans masquer ni requalifier la dette.

## 4. Périmètre

### Inclus

- analyse locale du rapport JaCoCo et des fichiers Backend modifiés dans la période SonarQube ;
- ajout ou renforcement de tests Backend déterministes ;
- mise à jour additive du Project State et preuve d'exécution ;
- validation Maven, JaCoCo, SonarQube et CI GitHub.

### Exclus

- modification du seuil de 80 % ;
- exclusion SonarQube ou JaCoCo supplémentaire ;
- `continue-on-error`, skip ou neutralisation de l'analyse ;
- changement de comportement métier ou de code de Production ;
- modification Frontend, SQL, Docker, Staging ou Production ;
- promotion d'artefact ou déploiement.

## 5. Fichiers concernés

- À créer ou modifier : tests sous `backend/src/test/**`, déterminés après analyse de couverture.
- À modifier : `docs/project-state.md` et le présent rapport après exécution.
- À ne pas modifier : `backend/src/main/**`, `pom.xml`, configuration SonarQube, Quality Gate,
  workflows CI/CD, migrations Flyway et fichiers d'environnement.

## 6. Étapes d'exécution

1. Produire le rapport JaCoCo local par `mvn verify`.
2. Croiser les classes récentes avec les branches/lignes non couvertes du rapport XML/HTML.
3. Sélectionner le plus petit ensemble de scénarios métier significatifs permettant une marge
   raisonnable au-dessus de 80 %.
4. Ajouter uniquement des tests déterministes, sans modifier le code de Production.
5. Exécuter les tests ciblés puis `mvn verify` complet.
6. Vérifier l'absence de modification hors périmètre et exécuter l'audit CGPA.
7. Publier une PR dédiée et exiger le Quality Gate SonarQube PASS.
8. Ne reprendre la fusion de #279 qu'après retour au vert de `main` et de la PR de remédiation.

## 7. Risques et mitigations

| Risque | Impact | Mitigation |
| --- | --- | --- |
| test artificiel sans valeur métier | couverture fragile | couvrir décisions, erreurs ou branches observables |
| marge trop faible | échec persistant à 79,9/80,0 | viser une marge mesurable, pas un arrondi minimal |
| test instable | CI non fiable | pas de temps réel, réseau externe ou ordre global implicite |
| dérive fonctionnelle | périmètre élargi | aucune modification de `src/main` |
| contournement du Gate | perte de gouvernance | seuil, exclusions et workflow intacts |

## 8. Tests et critères d'acceptation

- tests ciblés : PASS ;
- `mvn verify` : PASS ;
- garde JaCoCo locale : PASS ;
- Quality Gate SonarQube Backend : PASS avec `new_coverage >= 80 %` ;
- `new_violations = 0` ;
- CI, CodeQL, Sécurité et audit CGPA : PASS ;
- diff limité aux tests et documents annoncés ;
- validation humaine finale avant fusion.

## 9. Rollback

Rollback Git non destructif par `git revert` via une PR dédiée. Aucun seuil, artefact, donnée ou
environnement n'étant modifié, le rollback retire uniquement les tests et les preuves associées.

## 10. Action autorisée

Ajouter les tests Backend ciblés décrits par ce plan sur la branche
`agent/backend-coverage-quality-gate`, publier une PR dédiée et recueillir les preuves CI. Cette
décision n'autorise ni la fusion sans validation humaine finale, ni une promotion ou un déploiement.

## 11. Rapport d'exécution local

Exécution du 2026-07-28 sur la branche `agent/backend-coverage-quality-gate` :

- fichier ajouté :
  `backend/src/test/java/com/loyertracker/notifications/NotificationPreferenceTest.java` ;
- périmètre respecté : aucun fichier `backend/src/main/**`, seuil, exclusion, configuration Sonar,
  workflow, migration SQL ou environnement modifié ;
- tests ciblés : 6 exécutés, 0 échec, 0 erreur, 0 ignoré ;
- `mvn -B verify` complet : **BUILD SUCCESS**, 211 tests, 0 échec, 0 erreur, 0 ignoré ;
- Spotless : PASS ;
- garde JaCoCo locale du paquet sécurité : PASS ;
- `NotificationPreference.java` après remédiation : 52 lignes couvertes et 1 manquée,
  16 branches couvertes et 1 manquée, contre 8 lignes couvertes/45 manquées et
  3 branches couvertes/14 manquées avant remédiation ;
- gain local ciblé : 44 lignes et 13 branches supplémentaires couvertes.

Le Quality Gate SonarQube distant, la CI GitHub et `new_violations = 0` restent à confirmer sur la
Pull Request. Ces preuves locales n'autorisent pas la fusion.

## 12. Preuves distantes de la Pull Request #280

Première exécution distante sur le commit `e000673481e8094eef6877e9802adc50d1f05c80` :

- CI GitHub run `30338746285` : Backend PASS, Frontend PASS, Sécurité PASS et Packaging Docker
  PASS ;
- Backend : 211 tests, 0 échec, 0 erreur, 0 ignoré et build PASS ;
- SonarQube Backend : `QUALITY GATE STATUS: PASSED` ;
- CodeQL run `30338746266` : Java/Kotlin PASS et JavaScript/TypeScript PASS ;
- audit structurel run `30338746311` : PASS.

Le blocage de couverture à 79,9 % est donc levé sans modification du seuil ni exclusion. La PR
reste en brouillon et sa fusion demeure conditionnée à une validation humaine finale explicite.

## 13. Validation humaine finale

Le 2026-07-28, après revue de la PR #280 et de ses preuves terminales sur le commit
`b52f054e222ab4505ac956ed0e2e0e6212859192`, le validateur humain a déclaré dans la conversation
de pilotage : « j'ai revu #280 et c'est ok pour moi ». Cette déclaration est enregistrée comme
**GO humain final pour la fusion de #280**.

Le présent ajout transcrit la décision sans modifier les tests, le code de Production, les seuils,
la CI ou les environnements. La fusion reste exécutée exclusivement par le workflow GitHub protégé
après confirmation des checks du commit de transcription.
