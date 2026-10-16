# Lot 1 — Étape 2 : preuve d'exécution du test de détection existant

- **Date** : 2026-10-16
- **Plan** : `docs/cgpa/06-planification-agile/plan-execution-lot1-statut-bien-derive.md`, étape 2 (approuvé le 2026-10-16)
- **Objet** : obtenir une preuve réelle d'exécution de `infra/scripts/detection-incoherences-bail-bien.sql` avant de s'y fier. L'en-tête du script portait la mention « NON EXÉCUTÉ, syntaxe non vérifiée contre PostgreSQL ».
- **Nature** : lecture du journal de la CI. **Aucune exécution locale** et **aucune exécution sur des données de production**.

## 1. Résultat

| Élément | Valeur |
|---|---|
| Test | `com.loyertracker.db.DetectionIncoherencesBailBienScriptTest` |
| Tests exécutés | 3 |
| Échecs / erreurs / ignorés | 0 / 0 / 0 |
| Durée | 5,822 s |
| Base | PostgreSQL 16 (Testcontainers), schéma migré par Flyway (V1 à V36), données strictement synthétiques |
| Exécution | Job « Backend (build + tests + couverture) », run `38900839095`, job `116972406136`, 2026-10-16 |
| Commit exécuté | `4c5b668` (tête de la PR #583, branche `chore/retirer-ancien-serveur-sonar`) ; la suite complète du job : 283 tests, 0 échec, 0 erreur, 0 ignoré, `BUILD SUCCESS` |

Le test exécute le script **tel quel** via le datasource administrateur (contournement de la RLS, comme exigé par le script). Ses trois tests, d'après `DetectionIncoherencesBailBienScriptTest.java` :

1. `scriptEstEnTransactionLectureSeuleSansInstructionDEcriture` : garde statique (transaction `READ ONLY`, aucune écriture) ;
2. `chaqueRegleDetecteSonAnomalieEtLesCasSainsNeProduisentRien` : une anomalie isolée par règle, plus des cas sains qui ne doivent rien produire ;
3. `baseVideNeProduitAucuneAnomalie`.

## 2. Ce que cela prouve et ne prouve pas

- **Prouve** : la syntaxe du script est valide sur PostgreSQL 16 ; chacune des règles A1 à A12 détecte son cas synthétique ; les cas sains ne produisent aucune ligne ; le script ne modifie aucune donnée.
- **Ne prouve pas** : le comportement sur des données réelles de production (volumétrie, valeurs inattendues, version de PostgreSQL de la production). Le schéma réellement déployé en production n'a pas été comparé aux migrations.
- **Reste soumis à l'autorisation du CDO** : toute exécution sur une copie de la production.

## 3. Suites

- L'en-tête du script est mis à jour (mention « NON EXÉCUTÉ » remplacée par cette preuve) ; la logique du script est inchangée.
- Étape 3 du plan : écrire les tests qui reproduisent aujourd'hui C1 et C2 (la clôture ne libère pas le bien, la création après clôture est refusée).
- Si l'exécution locale est nécessaire, démarrer Docker Desktop (le démon n'était pas démarré lors de cette étape) puis lancer `mvn -f backend/pom.xml -Dtest=DetectionIncoherencesBailBienScriptTest verify`.
