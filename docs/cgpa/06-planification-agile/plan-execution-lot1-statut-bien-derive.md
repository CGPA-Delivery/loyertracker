# Plan d'Exécution — Lot 1 : statut du bien dérivé du bail

- **Statut** : **En attente d'approbation.** Aucun code applicatif ne doit être écrit avant l'approbation de ce plan par le PO/CDO.
- **Plan-cadre** : `docs/cgpa/06-planification-agile/plan-execution-cycle-bail.md` (approbation du plan-cadre enregistrée dans la PR #581 ; à vérifier sur `main` avant de démarrer)
- **Rédigé par** : Claude Code (contribution IA) ; **à relire par un humain** avant décision.

## 1. Identification

* Projet : LoyerTracker
* Version : à déterminer à la release (aucune release décidée)
* Phase CGPA : 07 — Développement (préparation), après audit phase 1 et plan-cadre
* Sprint / étape : Lot 1 du programme « Cycle de vie du bail »
* Date : 2026-10-16
* Responsable : PO/CDO (décision) ; réalisation par Claude Code sous revue humaine

## 2. D'où l'on vient

* Livrables déjà validés : audit phase 1 (`docs/cgpa/reports/audit-cycle-bail-phase1-2026-10-09.md`) ; plan-cadre approuvé comme cadre.
* Décisions déjà prises : D1 interruption prospective ; D5 un bien en préavis reste loué ; Q0 statuts de bail `ACTIF` / `CLOS` ; Q1, Q2, Q3 (voir plan-cadre §9).
* Développements déjà réalisés : script de détection en lecture seule `infra/scripts/detection-incoherences-bail-bien.sql` (anomalies A1 à A12) et son test d'intégration `backend/src/test/java/com/loyertracker/db/DetectionIncoherencesBailBienScriptTest.java` (commits `cb27180`, `4d97ee1`, 2026-10-10). **Ils sont réutilisés, pas recréés.**
* Points ouverts : décisions L1-D1 à L1-D5 (§13) ; exécution du script sur une copie de la production, sous autorisation du CDO.

## 3. Où l'on est

* État actuel : `Bien` ne sait que passer à `LOUE` (`louer()`) ou `ARCHIVE` (`archiver()`) (`backend/src/main/java/com/loyertracker/biens/Bien.java:58-64`). `BailService.cloturer` ne touche pas au bien (`BailService.java:147-186`). `BailService.creer` exige un bien `LIBRE` (`BailService.java:75-77`). `BienService.modifier` écrit le statut reçu tel quel (`BienService.java:71`). Conséquence : après une clôture, le bien reste `LOUE`, aucun nouveau bail n'est possible sans saisie manuelle du statut.
* Phase actuelle : développement, non démarré.
* Gate concerné : Gate 07 (Plan d'Exécution approuvé requis).
* Niveau de maturité : le comportement actuel est établi par lecture du code ; **aucun test n'a été exécuté dans le cadre de ce plan**.
* Blocages connus : aucun technique. La correction des données de production exige l'autorisation du CDO.

Chemins qui modifient `bail.statut` : uniquement `BailService.creer`, `cloturer`, `rouvrir` (recherche dans `backend/src/main` : aucune migration ni fonction SQL ne le modifie après la création). Aucun traitement automatique ne clôture un bail à son terme (anomalie A5 du script).

## 4. Où l'on va

* Objectif : le statut `LOUE` / `LIBRE` d'un bien est **déduit des baux** et n'est plus saisi à la main.
* Résultat attendu :
  * clôturer un bail libère le bien s'il n'a plus de bail `ACTIF` ;
  * rouvrir un bail le remet `LOUE` ;
  * un bien avec un bail `ACTIF` est toujours `LOUE`, un bien sans bail `ACTIF` est `LIBRE`, sauf `EN_TRAVAUX` et `ARCHIVE` qui restent des états manuels ;
  * les biens incohérents en production sont listés, puis corrigés cas par cas.
* Valeur métier : un bien clôturé peut être relogé sans manipulation manuelle ; fin de la divergence entre le statut du bien et la réalité du bail (P2).
* Critères d'acceptation : voir §12.

## 5. Périmètre

### Inclus

* Règle de dérivation `LOUE` / `LIBRE` dans le domaine et dans `BailService` (création, clôture, réouverture).
* Règles de `BienService` sur la saisie du statut (création, modification, archivage).
* Verrouillage du bien pendant les opérations de bail pour éviter une course entre création et clôture.
* Formulaire frontend du bien : ne plus proposer `LIBRE` / `LOUE` en saisie.
* Exécution du script de détection existant sur une copie de la production, rapport, puis script de correction **cas par cas** après décision du PO.
* Drapeau de configuration pour désactiver le nouveau comportement en cas de problème.
* Tests (§10), documentation, `CHANGELOG.md`.

### Exclus

* Interruption prospective, motif de fin, `date_demande`, job de clôture à date future, statut `CLOTUREE` : **lot 2**.
* Affectation contrôlée d'un bien libre à un autre locataire (garde supplémentaire) : **lot 3**.
* Multi-bailleurs, RLS, fonctions `SECURITY DEFINER` : **lots 4 et 5**, ADR-20.
* Historique par bien (lot 6), page échéancier (lot 7).
* Anomalies A5 à A12 du script (dates, chevauchements, créances, locataire archivé, bailleur incohérent) : elles sont **listées dans le rapport** mais traitées hors de ce lot.
* Toute promotion en Staging ou en Production.

## 6. Fichiers concernés

### À créer

* `backend/src/test/java/com/loyertracker/biens/BienStatutDeriveIntegrationTest.java` — scénarios d'intégration PostgreSQL (Testcontainers), même patron que `BailClotureIntegrationTest`.
* `infra/scripts/correction-statut-bien.sql` — correction **transactionnelle, non exécutée**, paramétrée par une liste d'identifiants validés par le PO ; export préalable obligatoire dans l'en-tête.
* `docs/cgpa/evidence/lot1-statut-bien/rapport-detection.md` — rapport de l'exécution du script (anomalies, décisions du PO), créé à l'exécution.

### À modifier

* `backend/src/main/java/com/loyertracker/biens/Bien.java` — ajout de `liberer()`, gardes sur `louer()` (états autorisés).
* `backend/src/main/java/com/loyertracker/baux/BailService.java` — `creer`, `cloturer`, `rouvrir`.
* `backend/src/main/java/com/loyertracker/biens/BienService.java` — `creer`, `modifier`, `archiver`.
* `backend/src/main/java/com/loyertracker/biens/BienRepository.java` — verrou pessimiste en écriture pour la lecture du bien dans les opérations de bail.
* `backend/src/main/resources/application.yml` — drapeau `app.biens.statut-derive.enabled`.
* `backend/src/test/java/com/loyertracker/baux/BailClotureIntegrationTest.java`, `BailClotureReouvertureTest.java`, `backend/src/test/java/com/loyertracker/s02/S02BiensBauxAffectationsIntegrationTest.java` — adaptation et ajouts.
* `frontend/src/app/bailleur/dashboard/dashboard.component.ts` (liste de statuts à `:92-94`, formulaire à `:759` et `:938`), `frontend/src/app/core/s02/s02-api.service.ts` (type `StatutBien`) et les tests associés.
* `infra/scripts/detection-incoherences-bail-bien.sql` — mise à jour de l'en-tête (« NON EXÉCUTÉ ») avec la preuve réelle d'exécution du test ; **aucune modification de la logique**.
* `CHANGELOG.md`, `docs/project-state.md`.

### À ne pas toucher

* Les migrations `V1` à `V36` (immuables). **Aucune migration de schéma n'est prévue dans ce lot.**
* Les fonctions `SECURITY DEFINER`, les policies RLS, `AuthorizationService`, les schedulers de `batch/`.
* Le code des paiements, garanties, quittances, honoraires.
* La sémantique des dates de bail (`date_fin`, `date_cloture_effective`) : lot 2.

## 7. Étapes techniques prévues

1. **Cadrage** : obtenir les décisions L1-D1 à L1-D5 (§13), vérifier que le plan-cadre approuvé est sur `main`, créer la branche de travail.
2. **Preuve de base** : lancer le test existant `DetectionIncoherencesBailBienScriptTest` et consigner le résultat réel ; ne conserver la mention « NON EXÉCUTÉ » de l'en-tête du script que si le test ne passe pas.
3. **Tests d'abord** : écrire les tests qui échouent aujourd'hui (clôture ne libère pas le bien, création après clôture refusée, modification manuelle du statut).
4. **Domaine** : `Bien.liberer()` (autorisé depuis `LOUE` seulement), `Bien.louer()` (autorisé depuis `LIBRE` seulement), refus explicite depuis `EN_TRAVAUX` et `ARCHIVE`.
5. **`BailService.creer`** : lire le bien avec verrou en écriture ; conserver la double garde (bien `LIBRE` et aucun bail `ACTIF`) ; appeler `louer()`.
6. **`BailService.cloturer`** : après enregistrement du bail clos, si aucun autre bail `ACTIF` ne porte sur le bien, appeler `liberer()` (sans effet si le bien est `EN_TRAVAUX` ou `ARCHIVE`). Même transaction que la clôture.
7. **`BailService.rouvrir`** : le bien doit être `LIBRE` (décision L1-D1) ; sinon 409 avec message explicite ; puis `louer()`.
8. **`BienService`** : selon les décisions L1-D2 et L1-D4 : création forcée à `LIBRE` (sauf `EN_TRAVAUX` / `ARCHIVE` autorisés) ; modification ignorant `LOUE` / `LIBRE` en entrée et renvoyant la valeur dérivée ; `EN_TRAVAUX` et `ARCHIVE` refusés (409) si un bail `ACTIF` existe.
9. **Date de clôture future** (décision L1-D3) : refus 400 jusqu'au lot 2, avec message renvoyant à l'interruption programmée.
10. **Drapeau** : `app.biens.statut-derive.enabled` ; désactivé, `BailService` et `BienService` retrouvent le comportement actuel.
11. **Frontend** : retirer `LIBRE` / `LOUE` du formulaire de bien, afficher le statut dérivé en lecture seule ; ne plus envoyer ces valeurs.
12. **Détection sur copie de production** (autorisation du CDO, voir §8) : exécuter `detection-incoherences-bail-bien.sql`, produire le rapport, soumettre les cas A1 à A4 au PO.
13. **Correction des données** : après décision du PO, renseigner la liste d'identifiants validés dans `correction-statut-bien.sql`, exécuter sur la copie, vérifier par une seconde détection, puis planifier la production sous autorisation du CDO.
14. **Documentation et revue** : `CHANGELOG.md`, `docs/project-state.md`, revue humaine, revue UX légère du formulaire, PR.

## 8. Dépendances

* Techniques : Docker pour les tests Testcontainers (PostgreSQL 16) ; aucun nouvel outil.
* Fonctionnelles : décisions L1-D1 à L1-D5 ; le lot 2 (interruption prospective) dépend de ce lot.
* Sécurité : aucune modification d'authentification, de rôle, de RLS ni de fonction `SECURITY DEFINER`. Le script de détection exige un rôle qui **contourne la RLS** (sinon résultat partiel sans erreur, comme indiqué dans son en-tête). Les endpoints existants gardent leurs `@PreAuthorize`.
* DevOps : aucune migration, aucun changement de pipeline, d'image ou de dépendance. Variable de configuration ajoutée : `APP_BIENS_STATUT_DERIVE_ENABLED` (à documenter dans `.env.example`).
* Autorisations humaines : exécution sur la production uniquement avec l'autorisation du CDO ; accès à une sauvegarde pour la copie.

## 9. Risques et points de vigilance

| Risque | Impact | Mesure de mitigation |
|---|---|---|
| Course entre création et clôture sur un même bien | Bien dans un état faux malgré l'unicité du bail actif | Verrou pessimiste du bien dans les opérations de bail ; test de concurrence ; l'index `uq_bail_actif` (`V1:159`) reste le filet |
| Données de production incohérentes (A1 à A4) | Correction erronée de biens | Détection en lecture seule d'abord ; décision du PO cas par cas ; export préalable ; correction transactionnelle |
| Changement de contrat d'API (`statut` ignoré pour `LOUE` / `LIBRE`) | Un client existant croit avoir changé le statut | Réponse renvoyant la valeur dérivée ; documentation ; tests ; frontend mis à jour dans le même lot |
| Clôture à date future libérant un bien encore occupé | Contredit D5 (préavis = loué) | Refus 400 de la date future jusqu'au lot 2 (décision L1-D3) |
| Bien `EN_TRAVAUX` ou `ARCHIVE` lors d'une clôture ou d'une réouverture | Statut écrasé à tort | Gardes explicites dans `Bien` ; tests de chaque combinaison |
| Le script de détection porte la mention « NON EXÉCUTÉ » | Confiance mal fondée | Étape 2 : preuve réelle d'exécution avant usage |
| Divergence future par un autre chemin que `BailService` | Retour du problème | Une seule voie d'écriture documentée ; le script de détection sert de contrôle récurrent ; évaluer un déclencheur en base après ADR-20 |

## 10. Tests prévus

* Tests unitaires : `Bien.liberer()` et `louer()` (transitions autorisées et refusées) ; `Bail` inchangé.
* Tests d'intégration (Testcontainers PostgreSQL 16, `BienStatutDeriveIntegrationTest` et extensions) :
  1. clôturer le seul bail actif libère le bien ;
  2. clôturer un bail alors qu'un autre bail `ACTIF` existe ne libère pas (cas défensif) ;
  3. nouveau bail possible juste après une clôture, sans intervention manuelle ;
  4. réouverture remet le bien `LOUE` ; réouverture refusée si le bien est `EN_TRAVAUX` ou `ARCHIVE` ;
  5. clôture d'un bien `EN_TRAVAUX` ou `ARCHIVE` ne change pas son statut ;
  6. modification du statut avec `LOUE` / `LIBRE` ignorée, valeur dérivée renvoyée ;
  7. `EN_TRAVAUX` / `ARCHIVE` refusés avec un bail `ACTIF` ;
  8. clôture à date future refusée (400) ;
  9. concurrence : deux créations simultanées sur le même bien, une seule réussit ;
  10. drapeau désactivé : comportement d'origine.
* Tests API : codes HTTP et messages des cas ci-dessus (200, 400, 409) ; accès refusé à un autre bailleur (déjà couvert, non régressé).
* Tests UI : formulaire de bien sans `LIBRE` / `LOUE`, statut dérivé affiché (tests de composant existants adaptés).
* Tests sécurité : non-régression de `SecurityIntegrationTest` et `AuthorizationServiceIntegrationTest` (aucun changement attendu).
* Tests de non-régression : suite backend complète, suite frontend, E2E accessibilité ; `DetectionIncoherencesBailBienScriptTest` (le script reste en lecture seule).
* Test du script de correction : sur base de test Testcontainers avec données synthétiques ; vérification qu'une seconde détection ne renvoie plus A1 et A2 pour les biens corrigés.

## 11. Commandes prévues

À confirmer à l'exécution (aucune commande n'a été lancée pour ce plan).

```bash
# Backend : build, tests, couverture, contrôle de format (Spotless)
mvn -f backend/pom.xml verify

# Backend : test de détection seul
mvn -f backend/pom.xml -Dtest=DetectionIncoherencesBailBienScriptTest verify

# Frontend
cd frontend && npm ci && npm run lint && npm run build && npm test
```

Détection et correction sur une copie de la production, hors dépôt :

```bash
psql -v ON_ERROR_STOP=1 -d <base_copie> -f infra/scripts/detection-incoherences-bail-bien.sql
```

La correction ne s'exécute qu'après décision du PO, sur la copie d'abord. Aucune commande Docker globale (`STG-ISOL-01`).

## 12. Critères de validation

1. Un bail clôturé sans autre bail `ACTIF` libère son bien dans la même transaction ; un nouveau bail est créé sans intervention manuelle.
2. La réouverture remet le bien `LOUE`, ou est refusée (409) selon la décision L1-D1.
3. `BienService` ne permet plus de saisir `LOUE` / `LIBRE` ; la réponse renvoie le statut dérivé.
4. Aucun bien `LIBRE` ne porte de bail `ACTIF`, aucun bien `LOUE` n'est sans bail `ACTIF` après les scénarios de test (contrôle par le script de détection).
5. Les 10 scénarios de §10 passent ; la suite backend, la suite frontend et les contrôles CI existants restent verts.
6. Aucune migration de schéma, aucune modification de RLS ni de fonction `SECURITY DEFINER`.
7. Rapport de détection produit sur la copie de production, chaque cas A1 à A4 décidé par le PO avant correction.
8. Rollback documenté et testé : drapeau désactivé (code), restauration depuis l'export préalable (données).
9. Revue humaine de la contribution IA consignée.

## 13. Décision attendue

* Approuver
* Approuver sous réserve
* Corriger le plan
* Refuser

**Décisions à prendre avant ou avec l'approbation** (réponse recommandée en premier) :

| Code | Question | Réponse recommandée | Alternative |
|---|---|---|---|
| L1-D1 | Réouvrir un bail dont le bien est `EN_TRAVAUX` ou `ARCHIVE` | Refus 409 avec message explicite | Réouverture qui force `LOUE` (écrase l'état manuel) |
| L1-D2 | Passer un bien en `EN_TRAVAUX` ou `ARCHIVE` alors qu'un bail `ACTIF` existe | Refus 409 (anomalies A3 et A4 deviennent impossibles) | Autoriser `EN_TRAVAUX` avec bail actif |
| L1-D3 | Clôture avec une date future | Refus 400 jusqu'au lot 2 | Accepter et libérer immédiatement (contredit D5) |
| L1-D4 | Saisie de `LOUE` / `LIBRE` dans `BienRequest` | Ignorer la valeur, renvoyer le statut dérivé, documenter | Refuser (400), contrat cassé |
| L1-D5 | Drapeau `app.biens.statut-derive.enabled` | Oui, activé par défaut, pour permettre un retour arrière | Pas de drapeau |

**Autorisation distincte requise du CDO** : exécution du script de détection sur une copie de la production, puis toute correction de données en production.

## 14. Statut

* **En attente d'approbation**
* Approuvé
* Refusé
* Exécuté
* Clôturé

## Rollback

* **Application** : drapeau `app.biens.statut-derive.enabled` désactivé, ou retour au commit précédent ; aucune migration à défaire.
* **Données** : restauration des statuts de biens depuis l'export préalable à la correction (liste `bien_id`, ancien statut) ; le script de correction est transactionnel et ne touche que les identifiants validés.
* **Infrastructure** : sans objet (aucun changement d'image, de configuration d'hôte ni de pipeline).

## Gouvernances applicables

* DevSecOps / Enterprise Delivery : code modifié, aucune dépendance ni migration ; CHECK-CICD-01, CHECK-REL-01, CHECK-OPS-01, CHECK-VAL-01 : `non exécuté`, à appliquer au jalon de livraison.
* UX / Design / Frontend : changement limité au formulaire de bien ; revue UX légère demandée.
* Financial Governance : le lot ne modifie ni loyers, ni paiements, ni garanties, ni quittances. Son applicabilité est à confirmer par le CDO ; en l'absence de confirmation, le contrôle est `non exécuté` et non « non applicable ».
* Staging : `STG-ISOL-01` bloquant avant toute promotion.
* Traçabilité et revue humaine de la contribution IA.

## Limites

* Aucun test, build ni script n'a été exécuté pour rédiger ce plan.
* Le comportement actuel vient de la lecture du code ; la présence d'anomalies en production n'est pas connue.
* Le frontend a été examiné uniquement aux endroits cités ; une revue complète des écrans affichant le statut du bien reste à faire à l'étape 11.
* Aucune estimation de charge n'est fournie.
