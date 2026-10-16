# Plan d'Exécution — Lot 2 : interruption de bail prospective et échéancier clôturé

- **Statut** : **En attente d'approbation.** Aucun code applicatif ne doit être écrit avant l'approbation de ce plan par le PO/CDO.
- **Plan-cadre** : `docs/cgpa/06-planification-agile/plan-execution-cycle-bail.md` (approuvé le 2026-10-16)
- **Lot précédent** : lot 1 « statut du bien dérivé du bail », livré dans `main` (PR #586 et #587). Ce lot en dépend.
- **Rédigé par** : Claude Code (contribution IA) ; **à relire par un humain** avant décision.

## 1. Identification

* Projet : LoyerTracker
* Version : à déterminer à la release (aucune release décidée)
* Phase CGPA : 07 — Développement (préparation)
* Sprint / étape : Lot 2 du programme « Cycle de vie du bail »
* Date : 2026-10-16
* Responsable : PO/CDO (décision) ; réalisation par Claude Code sous revue humaine

## 2. D'où l'on vient

* Livrables déjà validés : audit phase 1, plan-cadre, plan détaillé du lot 1 (tous approuvés) ; ADR-20 reste « Proposée » et n'est pas une dépendance de ce lot.
* Décisions déjà prises : D1 (interruption prospective), D4 (échéancier clôturé), D5 (un bien en préavis reste loué) ; Q0 (statuts `ACTIF` / `CLOS`), Q0 bis (`date_cloture_effective` réutilisée), Q1 (interruption non bloquée par les impayés, confirmation avec montant dû), Q2 (statut de paiement `CLOTUREE`) ; L1-D3 (une clôture à date future est refusée jusqu'à ce lot).
* Développements déjà réalisés : lot 1 (la clôture libère le bien, la réouverture le reloue, drapeau `app.biens.statut-derive.enabled`).
* Points ouverts : revue Financial Governance avant développement ; revue des fonctions `SECURITY DEFINER` modifiées ou créées (DT-02). Les décisions L2-D1 à L2-D8 sont prises (§13).

## 3. Où l'on est

* État actuel :
  * `BailService.cloturer` clôture à une date unique, sans motif ni date de demande, et **supprime physiquement** les échéances `A_VENIR` postérieures au mois de clôture (`deleteByBailIdAndStatutAndPeriodeGreaterThan`, `BailService.java`, appelé dans `cloturer`).
  * Une clôture à date future est refusée depuis le lot 1 (message renvoyant à « l'interruption programmée »), qui n'existe pas encore.
  * Aucun traitement automatique ne clôture un bail à une date d'effet.
* Phase actuelle : développement, non démarré pour ce lot.
* Gate concerné : Gate 07 (Plan d'Exécution approuvé requis).
* Niveau de maturité : l'état est établi par lecture du code ; **aucun test n'a été exécuté pour rédiger ce plan.**
* Blocages connus : aucun technique. La Financial Governance doit se prononcer avant le développement (suppression physique remplacée par un statut).

### Inventaire préalable (point « à vérifier » du plan-cadre)

Le plan-cadre exigeait de lister toutes les lectures de `date_cloture_effective` avant de développer. Résultat de la lecture du dépôt :

| Lecteur | Constat |
|---|---|
| Fonctions SQL, vues, alertes (V25 et fonctions `generer_alertes`) | **Aucune ne lit `date_cloture_effective`.** Elles filtrent sur `bail.statut` (`ACTIF` / `CLOS`), jamais sur la nullité de cette date. Un bail `ACTIF` portant une date d'effet future n'est donc pas pris pour un bail clos. |
| `Bail`, `BailDto`, `BailService`, `ClotureRequest` | Écriture à la clôture, remise à `NULL` à la réouverture, exposition dans l'API. |
| Frontend (`dashboard.component.ts`, `s02-api.service.ts`) | Le type porte le champ ; la clôture envoie `null` (date du jour). |
| Script `infra/scripts/detection-incoherences-bail-bien.sql` | A5, A6, A7, A8, A9 la lisent. Pour un bail `ACTIF`, A8 prend déjà `COALESCE(date_cloture_effective, date_fin)`. Aucune règle ne détecte un préavis échu non clos : à ajouter (A13). |

Le risque « date future lue comme clos » est donc **levé par lecture** ; il reste à le prouver par des tests (§10).

### Constats qui conditionnent la conception

| # | Constat | Preuve | Conséquence |
|---|---|---|---|
| F1 | La clé d'unicité des échéances est **par bien et par période**, totale : `uq_paiement_periode ON paiement (bien_id, periode)`. | `V1__init_schema.sql:165` | Conserver des échéances `CLOTUREE` (au lieu de les supprimer) **bloquerait les échéances d'un nouveau bail sur le même bien** pour ces mois : `generer_echeances_loyers` insère avec `ON CONFLICT (bien_id, periode) DO NOTHING` (`V18`) et ignorerait silencieusement les lignes. L'index doit devenir partiel (hors `CLOTUREE`) et la fonction doit être adaptée. |
| F2 | `PaiementRepository.findByBienIdAndPeriode` renvoie un `Optional` ; trois services l'utilisent (`PaiementService.pointer`, `QuittanceService`, `QuittanceCertifieeService`). | `PaiementRepository.java`, `PaiementService.java:66` | Avec deux lignes pour la même période (une `CLOTUREE`, une du nouveau bail), la lecture lèverait une erreur. Le finder doit exclure `CLOTUREE`. |
| F3 | Le pointage d'une échéance clôturée n'est pas gardé. | `PaiementService.pointer` | Refuser (409) le pointage d'une échéance `CLOTUREE`. |
| F4 | La **réouverture** d'un bail clos doit rendre ses échéances : sinon elles restent `CLOTUREE` et, par `ON CONFLICT`, la génération ne les recrée pas. | `V18`, `BailService.rouvrir` | La réouverture repasse les échéances `CLOTUREE` du bail à `A_VENIR` (décision L2-D7). |
| F5 | `generer_echeances_loyers` génère des échéances pour tout bail `ACTIF` jusqu'à `date_fin` : pendant un préavis, des `A_VENIR` au-delà de la date d'effet continuent d'être créées. | `V18` | Sans gravité : elles passent `CLOTUREE` à la date d'effet (job). À documenter. |
| F6 | `marquer_loyers_en_retard` ne touche que `IMPAYE`. | `V7` | `CLOTUREE` n'est jamais passée `EN_RETARD` : aucune modification. |
| F7 | Les alertes `FIN_BAIL` et `PREAVIS` sont calculées sur `date_fin`, pas sur la date d'effet. | `V25` | Un bail en préavis programmé peut émettre une alerte basée sur la date contractuelle (décision L2-D6). |
| F8 | `AuditService.enregistrer` exige une `Authentication` ; `audit_log.acteur_role` n'a pas de contrainte `CHECK`. | `AuditService.java`, `V1` | Le job n'a pas d'utilisateur : ajouter une surcharge « acteur système ». |
| F9 | Précédent pour un job inter-bailleurs : une fonction `SECURITY DEFINER` en lecture seule liste les bailleurs concernés, puis le traitement se fait en Java, bailleur par bailleur. | `NotificationDispatcher`, `notification_bailleurs_en_attente()` (`V28`) | Même patron pour la clôture à date d'effet : la logique métier reste en Java, une seule fonction SQL de **lecture** est ajoutée. |

## 4. Où l'on va

* Objectif : permettre de **programmer la fin d'un bail à une date future**, de façon tracée, sans supprimer aucune donnée, et clôturer le bail automatiquement à cette date.
* Résultat attendu :
  * une fin de bail se programme avec une date d'effet (≥ aujourd'hui), un motif et un commentaire optionnel ; le bail reste `ACTIF` et le bien `LOUE` jusqu'à cette date (D5) ;
  * la programmation peut être annulée avant la date (décision L2-D3) ;
  * à la date d'effet, un job passe le bail à `CLOS`, libère le bien (lot 1) et clôture l'échéancier futur ;
  * les échéances futures ne sont **jamais supprimées** : elles passent au statut `CLOTUREE` (Q2, D4) ;
  * l'interruption n'est pas bloquée par les impayés ; la confirmation affiche le montant dû (Q1) ;
  * la clôture immédiate existante bénéficie du même traitement des échéances (plus de suppression physique).
* Valeur métier : un préavis est représentable et fiable ; fin de la perte de données financières à la clôture (P1).
* Critères d'acceptation : voir §12.

## 5. Périmètre

### Inclus

* Migration `V37` : colonnes `date_demande_fin`, `motif_fin`, `commentaire_fin` sur `bail` ; statut `CLOTUREE` dans le CHECK de `paiement.statut` ; `uq_paiement_periode` rendu **partiel** (hors `CLOTUREE`) ; adaptation de `generer_echeances_loyers` ; fonction de lecture `baux_arrives_a_terme`.
* API : programmer une fin de bail, l'annuler, aperçu avant confirmation (montant dû, nombre d'échéances concernées), motif sur la clôture immédiate.
* Clôture des échéances futures (`CLOTUREE`) à la clôture immédiate **et** par le job ; retour à `A_VENIR` à la réouverture.
* Job quotidien de clôture à date d'effet, idempotent, avec rattrapage au démarrage et déclenchement manuel (patron `BatchController`).
* Gardes sur les échéances `CLOTUREE` (pointage refusé, finders).
* Audit (action, acteur système pour le job) et notification `BAIL_CLOS` au locataire à la clôture effective (événement existant).
* Frontend : écran de programmation / annulation, affichage « fin programmée le … », statut `CLOTUREE` dans l'échéancier de la fiche bien.
* Détection : nouvelle règle A13 (préavis échu non clos) dans le script existant, avec son test.
* Drapeau `app.baux.fin-programmee.enabled` pour le retour arrière applicatif.
* Tests (§10), `CHANGELOG.md`, `docs/project-state.md`.

### Exclus

* Prorata du loyer du mois d'effet (décision L2-D5 : loyer du mois dû en entier, comme aujourd'hui).
* Clôture automatique d'un bail à son **terme contractuel** (`date_fin`, anomalie A5) : traitement distinct, à décider séparément.
* Alertes `FIN_BAIL` / `PREAVIS` basées sur la date d'effet (décision L2-D6, recommandation : inchangées).
* Page échéancier dédiée (lot 7), historique par bien (lot 6), multi-bailleurs et approbations (lots 4 et 5).
* Restitution de garantie, quittances : inchangées.
* Toute promotion en Staging ou en Production.

## 6. Fichiers concernés

### À créer

* `backend/src/main/resources/db/migration/V37__lot2_fin_de_bail_prospective.sql` — migration additive (voir §5) ; **la V37 est numérotée sous réserve : confirmer qu'aucune autre migration n'a été fusionnée entre-temps**.
* `backend/src/main/java/com/loyertracker/baux/MotifFinBail.java` — liste fermée des motifs (L2-D1).
* `backend/src/main/java/com/loyertracker/baux/InterruptionRequest.java`, `ApercuFinBailDto.java`, `InterruptionBailDto.java` — contrats d'API.
* `backend/src/main/java/com/loyertracker/baux/FinDeBailService.java` — logique partagée : programmer, annuler, aperçu, terminer un bail (clôture immédiate et job).
* `backend/src/main/java/com/loyertracker/batch/BailFinScheduler.java` — job quotidien + rattrapage au démarrage.
* Tests : `FinDeBailIntegrationTest`, `FinDeBailJobIntegrationTest`, `EcheancesClotureesIntegrationTest`, tests unitaires de `Bail` et `Paiement`.
* `docs/cgpa/evidence/lot2-fin-de-bail/revue-fonctions-security-definer.md` — revue de la fonction créée et de la fonction modifiée (DT-02).
* `docs/cgpa/evidence/lot2-fin-de-bail/rapport-financial-governance.md` — avis Financial Governance (à produire avant développement).

### À modifier

* `Bail.java`, `BailDto.java`, `BailRequest.java` / `ClotureRequest.java` (motif), `BailController.java` (nouveaux endpoints), `BailService.java` (clôture : plus de suppression, déléguée à `FinDeBailService`).
* `Paiement.java`, `StatutPaiement.java` (`CLOTUREE`), `PaiementRepository.java` (finder hors `CLOTUREE`, mise à jour en masse), `PaiementService.java` (pointage refusé), `QuittanceService.java`, `QuittanceCertifieeService.java` (finder).
* `AuditService.java` (surcharge acteur système), `BatchController.java`, `BatchMetrics.java` (nouveau job), `application.yml` (cron et drapeau), `.env.example`, `docker-compose.yml`, `docker-compose.staging.yml` (drapeau, comme au lot 1).
* `infra/scripts/detection-incoherences-bail-bien.sql` (règle A13, en-tête) et son test.
* Frontend : `core/s02/s02-api.service.ts`, `bailleur/dashboard/dashboard.component.ts` et son spec, `shared/status-tag/status-tag.component.ts` (`CLOTUREE`), `paiements/paiements-bien.component.ts` et son spec.
* `CHANGELOG.md`, `docs/project-state.md`.

### À ne pas toucher

* Les migrations `V1` à `V36` (immuables) ; les policies RLS ; `AuthorizationService`.
* `generer_alertes` (décision L2-D6, recommandation : inchangée) ; `marquer_loyers_en_retard`.
* Le multi-bailleurs (lots 4 et 5), l'historique (lot 6), la page échéancier (lot 7).
* La sémantique de `date_fin` (terme contractuel).

## 7. Étapes techniques prévues

1. **Cadrage** : décisions L2-D1 à L2-D8 prises (§13) ; avis Financial Governance, vérification du numéro de migration, vérification que le présent plan est approuvé, branche de travail.
2. **Preuve de base** : lancer la suite backend existante et consigner le résultat réel.
3. **Tests d'abord (rouges)** : scénarios de programmation, d'annulation, de job, d'échéances `CLOTUREE`, de réouverture, de nouveau bail sur le même bien, de pointage refusé.
4. **Migration V37** : colonnes ; CHECK `paiement.statut` ; `uq_paiement_periode` partiel ; `generer_echeances_loyers` adaptée (cible `ON CONFLICT` alignée sur l'index partiel) ; fonction de lecture `baux_arrives_a_terme(date)`.
5. **Domaine** : `Bail.programmerFin(...)` / `annulerFinProgrammee()` ; `cloturer(...)` avec motif ; `Paiement.cloturer()` / `rouvrir()`.
6. **`PaiementRepository` et services** : finder hors `CLOTUREE` ; pointage d'une échéance clôturée refusé (409) ; mise à jour en masse des échéances futures.
7. **`FinDeBailService`** : `terminerBail(bailId, dateEffet, motif, acteur)` commun à la clôture immédiate et au job — clôture du bail, libération du bien (lot 1), échéances `A_VENIR` de période postérieure au mois d'effet → `CLOTUREE`, audit, notification `BAIL_CLOS`.
8. **`BailService.cloturer`** : délègue à `FinDeBailService` ; suppression physique retirée ; avertissements (garantie non restituée, impayés) conservés.
9. **`BailService.rouvrir`** : échéances `CLOTUREE` du bail → `A_VENIR` ; effacement de `motif_fin`, `commentaire_fin`, `date_demande_fin`, `date_cloture_effective`.
10. **API** : `POST .../interruption`, `DELETE .../interruption`, `GET .../fin-apercu` ; mêmes droits que la clôture actuelle (décision L2-D8) ; la clôture à date future garde son refus (400) tant que la fonctionnalité est désactivée.
11. **Job** : `BailFinScheduler` (cron quotidien, zone `app.batch.zone`) ; liste via `baux_arrives_a_terme`, traitement bailleur par bailleur dans une transaction distincte ; idempotent ; rattrapage au démarrage ; déclenchement manuel ; métrique.
12. **Audit système** : surcharge d'`AuditService` pour le job.
13. **Drapeau** : `app.baux.fin-programmee.enabled` ; désactivé, programmation et job inactifs, la clôture immédiate garde le comportement du lot 1.
14. **Détection** : règle A13 « bail `ACTIF` dont `date_cloture_effective` est passée » dans le script et son test ; mise à jour de la description d'A9.
15. **Frontend** : formulaire de programmation (date, motif, commentaire), aperçu avec montant dû, annulation, mention « fin programmée le … », tag `CLOTUREE`.
16. **Revue des fonctions SQL** : fichier de revue des deux fonctions (création, modification) ; mise à jour du registre `SECURITY DEFINER` d'ADR-20 (23 → 24 fonctions).
17. **Documentation et revue** : `CHANGELOG.md`, `docs/project-state.md`, revue humaine, revue UX, PR.
18. **Données de production** : aucune reprise nécessaire pour ce lot, hors la vérification en lecture seule de l'absence de doublons `(bien_id, periode)` avant la modification de l'index (simple relâchement, mais à prouver) — exécution soumise à l'autorisation du CDO.

## 8. Dépendances

* Techniques : lot 1 livré ; Docker pour Testcontainers.
* Fonctionnelles : décisions L2-D1 à L2-D8 ; avis Financial Governance.
* Sécurité : une fonction `SECURITY DEFINER` **créée** (lecture seule) et une **modifiée** (`generer_echeances_loyers`) : revue obligatoire (DT-02), registre d'ADR-20 à mettre à jour ; aucune policy RLS modifiée ; les nouveaux endpoints reprennent les `@PreAuthorize` de la clôture.
* DevOps : migration Flyway additive (hors l'index rendu partiel) ; variable `APP_BAUX_FIN_PROGRAMMEE_ENABLED` transmise par `docker-compose.yml` et `docker-compose.staging.yml` ; aucun changement d'image ni de dépendance. Supervision : règle d'alerte Prometheus pour le nouveau job à décider (`infra/monitoring/alerts.yml`, hors fichiers listés ci-dessus).
* Autorisations humaines : exécution de la vérification de doublons sur une copie de la production, sous autorisation du CDO.

## 9. Risques et points de vigilance

| Risque | Impact | Mesure de mitigation |
|---|---|---|
| Échéances `CLOTUREE` qui bloquent les échéances d'un nouveau bail sur le même bien (F1) | Perte silencieuse de loyers attendus | Index partiel, fonction adaptée, test « nouveau bail sur le même bien après clôture » |
| Doublons `(bien_id, periode)` créés après l'index partiel, et finders qui échouent (F2) | Erreur de pointage ou de quittance | Finder hors `CLOTUREE` dans les trois services ; tests de chaque service |
| Modification de `generer_echeances_loyers` (fonction `SECURITY DEFINER` batch) | Régression de la génération des loyers | Revue DT-02 ; tests de non-régression S03 ; comparaison avant/après sur données synthétiques |
| Retour arrière de code alors que des `CLOTUREE` existent | L'ancien code peut échouer sur des doublons | Rollback documenté : drapeau, puis migration inverse conditionnée par une requête de doublons (§Rollback) |
| Job qui échoue ou ne tourne pas | Un bail reste `ACTIF` après sa date d'effet | Idempotence, rattrapage au démarrage, métrique, règle A13 du script de détection, déclenchement manuel |
| Course entre le job et une action utilisateur (annulation, clôture) | État incohérent | Verrou du bien et du bail (lot 1) ; traitement bailleur par bailleur dans une transaction ; test de concurrence |
| Suppression physique remplacée par un statut | Écart avec la pratique actuelle de purge | Avis Financial Governance avant développement |
| Alertes `FIN_BAIL` / `PREAVIS` sur la date contractuelle (F7) | Alerte trompeuse pendant un préavis programmé | Limitation consignée (L2-D6) |
| Gestionnaire qui programme la fin d'un bail | Droit étendu | Même périmètre que la clôture actuelle ; décision L2-D8 |

## 10. Tests prévus

* Tests unitaires : `Bail` (programmer, annuler, clôturer avec motif, rouvrir efface les champs) ; `Paiement` (clôturer, rouvrir, pointage refusé) ; `MotifFinBail`.
* Tests d'intégration (Testcontainers PostgreSQL 16) :
  1. programmer une fin future : bail `ACTIF`, bien `LOUE`, champs enregistrés ;
  2. date d'effet passée refusée (400) ; date du jour selon L2-D2 ;
  3. annuler une fin programmée avant la date (L2-D3) ; impossible après clôture ;
  4. le job clôture un bail dont la date d'effet est atteinte : `CLOS`, bien `LIBRE`, échéances futures `CLOTUREE`, aucune suppression ;
  5. le job est idempotent et rattrape un retard de plusieurs jours ;
  6. le job ne touche pas un bail dont la date est future, ni un bail déjà `CLOS` ;
  7. un bail en préavis ne génère pas d'alerte `LOYER_EN_RETARD` à tort et reste `ACTIF` pour les alertes (non-régression V25) ;
  8. un nouveau bail sur le même bien après clôture reçoit ses échéances pour les périodes déjà `CLOTUREE` (F1) ;
  9. pointage d'une échéance `CLOTUREE` refusé (409) ; pointage et quittance d'une période avec ligne `CLOTUREE` et ligne active : la ligne active est retenue (F2) ;
  10. réouverture : échéances `CLOTUREE` du bail repassent `A_VENIR` (L2-D7) ;
  11. impayés : l'interruption passe, l'aperçu donne le montant dû, les créances restent visibles (Q1) ;
  12. clôture immédiate : plus aucune suppression physique, échéances futures `CLOTUREE`, motif enregistré ;
  13. drapeau désactivé : programmation indisponible, job inactif, comportement du lot 1 conservé ;
  14. concurrence : annulation et job simultanés sur le même bail ;
  15. migration V37 appliquée sur une base existante contenant des échéances (jeu synthétique), sans perte.
* Tests API : codes HTTP, droits (bailleur, gestionnaire habilité, autre bailleur refusé), validations.
* Tests UI : formulaire de programmation, aperçu, annulation, tag `CLOTUREE` ; tests de composant existants adaptés.
* Tests sécurité : `SecurityIntegrationTest` et `AuthorizationServiceIntegrationTest` inchangés et verts ; test d'accès croisé sur les nouveaux endpoints.
* Tests de non-régression : suite backend complète, suite frontend complète, E2E accessibilité ; `DetectionIncoherencesBailBienScriptTest` étendu pour A13 ; génération d'échéances S03 et honoraires inchangés (une échéance `CLOTUREE` n'a aucun montant reçu).

## 11. Commandes prévues

À confirmer à l'exécution (aucune commande n'a été lancée pour ce plan).

```bash
# Backend : build, tests, couverture, contrôle de format (Spotless)
mvn -f backend/pom.xml verify

# Frontend
cd frontend && npm ci && npm run lint && npm run build && npm test
```

Rendu des fichiers compose pour contrôler le drapeau (sans démarrer de conteneur) : `docker compose --env-file .env.example -f docker-compose.yml config`. Aucune commande Docker globale (`STG-ISOL-01`).

## 12. Critères de validation

1. On peut programmer une fin de bail à une date future avec un motif ; le bail reste `ACTIF` et le bien `LOUE` jusqu'à cette date.
2. À la date d'effet, le job clôture le bail, libère le bien et passe les échéances futures à `CLOTUREE`, sans aucune suppression physique.
3. Un nouveau bail sur le même bien reçoit toutes ses échéances, y compris pour les périodes que l'ancien bail avait clôturées.
4. Le pointage et les quittances ignorent les lignes `CLOTUREE` ; le pointage d'une échéance `CLOTUREE` est refusé.
5. La réouverture rend les échéances ; l'annulation d'une fin programmée est possible avant la date.
6. L'interruption n'est jamais bloquée par des impayés ; le montant dû est affiché avant confirmation et les créances restent visibles.
7. La clôture immédiate ne supprime plus aucune échéance.
8. Le job est idempotent, rattrape les retards et publie une métrique ; la règle A13 du script détecte un préavis échu non clos.
9. Les 15 scénarios de §10 passent ; la suite backend, la suite frontend et les contrôles CI restent verts.
10. Revue DT-02 des deux fonctions SQL consignée ; registre d'ADR-20 mis à jour ; avis Financial Governance produit.
11. Rollback documenté et testé (§Rollback).
12. Revue humaine de la contribution IA consignée.

## 13. Décision attendue

* Approuver
* Approuver sous réserve
* Corriger le plan
* Refuser

**Décisions du PO/CDO du 2026-10-16** (exprimées dans le chat ; options recommandées retenues) :

| Code | Question | Décision retenue | Alternative écartée |
|---|---|---|---|
| L2-D1 | Motifs de fin de bail | **Liste fermée** : résiliation par le bailleur, résiliation par le locataire, terme, autre ; **plus un commentaire libre** (500 caractères) | Texte libre seul |
| L2-D2 | Date d'effet égale à aujourd'hui | **Traitée comme une clôture immédiate** (même code) | Refusée : la date d'effet doit être strictement future |
| L2-D3 | Annuler une fin programmée avant la date | **Autorisé**, tracé en audit | Interdit : seule la clôture manuelle est possible |
| L2-D4 | Moment du passage des échéances à `CLOTUREE` | **À la date d'effet, par le job** (réversible tant que la date n'est pas atteinte) | Dès la programmation |
| L2-D5 | Loyer du mois d'effet | **Dû en entier** : échéances conservées jusqu'au mois d'effet inclus, comme la purge actuelle | Prorata (hors ce lot) |
| L2-D6 | Alertes `FIN_BAIL` / `PREAVIS` | **Inchangées** (basées sur `date_fin`) ; limitation consignée | Basées sur la date d'effet (modifie `generer_alertes`) |
| L2-D7 | Réouverture d'un bail clos | **Les échéances `CLOTUREE` du bail repassent `A_VENIR`** | Elles restent `CLOTUREE` |
| L2-D8 | Qui programme ou annule une fin de bail | **Mêmes droits que la clôture actuelle** : bailleur et gestionnaire habilité | Bailleur seul |

Ces décisions sont intégrées aux étapes du §7 et aux scénarios du §10. **Elles ne valent pas approbation du plan** : le statut reste « En attente d'approbation ».

**Avis requis avant développement** : Financial Governance sur le remplacement de la suppression physique par le statut `CLOTUREE`, la clé d'unicité partielle et le traitement du loyer du mois d'effet.

**Autorisation distincte du CDO** : vérification de l'absence de doublons `(bien_id, periode)` sur une copie de la production, puis toute exécution en production.

## 14. Statut

* **En attente d'approbation**
* Approuvé
* Refusé
* Exécuté
* Clôturé

## Rollback

* **Application** : drapeau `app.baux.fin-programmee.enabled` désactivé : programmation indisponible, job inactif ; la clôture immédiate garde le comportement du lot 1 avec échéances `CLOTUREE`. Retour à l'image précédente possible, **sous la condition ci-dessous**.
* **Données** : les échéances `CLOTUREE` sont conservées (aucune perte). Avant de revenir à un code antérieur au lot 2, vérifier l'absence de doublons `(bien_id, periode)` ; s'il y en a, repasser les `CLOTUREE` concernées à `A_VENIR` pour un bail réouvert, ou les conserver et ne pas revenir à l'ancien code.
* **Schéma** : migration inverse `V38` à écrire et tester **avant** la migration directe : recréer l'index unique total, supprimer le statut `CLOTUREE` du CHECK uniquement s'il n'en reste aucune ligne, retirer la fonction de lecture et restaurer `generer_echeances_loyers`. Elle ne s'exécute qu'après la vérification de doublons ci-dessus.
* **Infrastructure** : sans objet hors la variable de configuration.

## Gouvernances applicables

* DevSecOps / Enterprise Delivery : migration, fonctions `SECURITY DEFINER`, job planifié ; CHECK-CICD-01, CHECK-REL-01, CHECK-OPS-01, CHECK-VAL-01 : `non exécuté`, à appliquer au jalon de livraison.
* Financial Governance : **applicable** (échéances, loyers, statut de paiement, clé d'unicité) ; avis requis avant développement.
* UX / Design / Frontend : écran de programmation et d'annulation, aperçu, tag `CLOTUREE` ; revue UX obligatoire.
* Staging : `STG-ISOL-01` bloquant avant toute promotion.
* Traçabilité et revue humaine de la contribution IA.

## Limites

* Aucun test, build ni script n'a été exécuté pour rédiger ce plan ; tout vient de la lecture du code et des migrations.
* L'absence de doublons `(bien_id, periode)` en production n'est pas connue.
* La liste des lecteurs du statut des paiements a été établie par recherche textuelle dans le backend, les migrations et le frontend ; un lecteur en dehors de ces zones pourrait manquer.
* Le numéro de migration `V37` suppose qu'aucune autre migration n'est fusionnée avant ce lot.
* Aucune estimation de charge n'est fournie.
