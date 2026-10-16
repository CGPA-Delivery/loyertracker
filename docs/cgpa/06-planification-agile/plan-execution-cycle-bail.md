# Plan d'exécution — Cycle de vie du bail, statut du bien, historique, échéancier

- **Statut** : **Approuvé comme plan-cadre (2026-10-16).** Approbation exprimée dans le chat par le PO/CDO : « plan approuver ». Périmètre de l'approbation : ce plan-cadre et la rédaction des Plans d'Exécution détaillés des lots 1, 2, 3, 6 et 7. **Aucun code applicatif d'un lot avant l'approbation de son Plan d'Exécution détaillé.** Les lots 4 et 5 restent bloqués tant qu'ADR-20 n'est pas « Acceptée ». Aucune promotion. Voir `demande-approbation-plan-cycle-bail.md` §1 et §9.
- **Date** : 2026-10-09 — mis à jour le 2026-10-14 (alignement sur les décisions Q0 à Q3 et sur ADR-20)
- **Source** : `docs/cgpa/reports/audit-cycle-bail-phase1-2026-10-09.md`
- **Propriétaire** : PO (décisions D1 à D5 du rapport d'audit)
- **ADR lié** : `docs/cgpa/05-architecture-conception/adr/ADR-20-patrimoine-multi-bailleurs.md` (décisions D-MB-01 à D-MB-17 et DT-01 à DT-06 prises ; statut « Proposée » jusqu'à revue sécurité)
- **Demande d'approbation** : `docs/cgpa/06-planification-agile/demande-approbation-plan-cycle-bail.md`

## 1. Objectif

Corriger P1 à P6 de façon durable :
- l'état du bien est **dérivé** du bail, et non saisi à la main (C1, C2, C3) ;
- l'interruption de bail est **prospective**, tracée, avec motif, et clôture l'échéancier sans supprimer de données (C4 à C7) ;
- le modèle **patrimoine multi-bailleurs** est posé par ADR avant toute modification du modèle locataire (C9) ;
- la modification de locataire passe par **approbation d'un bailleur** (C8) ;
- l'historique par bien et la page échéancier sont accessibles (C10, C11).

## 2. Règles métier cibles

| Règle | Description |
|---|---|
| R1 | Un bail a un statut `ACTIF` ou `CLOS` (décision Q0). Pas de `INTERROMPU`, pas de `BROUILLON`. Un préavis est un bail `ACTIF` dont la date de fin effective est future. |
| R2 | Une interruption enregistre `date_demande`, `motif_fin`, `auteur`, et la date d'effet dans `date_cloture_effective` réutilisée (≥ aujourd'hui, décision Q0 bis). Elle est **prospective** (D1). |
| R3 | À la date d'effet, un job passe le bail à `CLOS` et le bien redevient `LIBRE` si aucun autre bail `ACTIF` ne porte sur le bien. |
| R4 | Le bien reste `LOUE` pendant le préavis, tant que la date d'effet n'est pas atteinte (D5). |
| R5 | Un bien ne peut recevoir un nouveau bail que s'il est `LIBRE` **et** sans bail `ACTIF` (double garde). |
| R6 | À l'effet d'interruption, les échéances futures passent au statut `CLOTUREE`. Elles ne sont **jamais supprimées** (D4, C7). |
| R7 | Une interruption n'est **pas bloquée** par les impayés (décision PO, Q1). Confirmation explicite affichant le montant dû. Les échéances `IMPAYE`, `EN_RETARD` et `PARTIEL` restent sur le bail clos, visibles et recouvrables, jamais supprimées. |
| R8 | Un patrimoine peut avoir plusieurs biens et plusieurs bailleurs. Un gestionnaire peut être assigné à plusieurs patrimoines (D2). |
| R9 | La modification d'un locataire par un gestionnaire crée une **demande** en attente. Un seul bailleur du patrimoine concerné suffit à l'approuver (D3). |
| R10 | Un bail peut être créé par un bailleur ou par un gestionnaire habilité, uniquement sur un bien `LIBRE`. |

## 3. Prérequis : ADR-20 multi-bailleurs (bloquant)

C9 : le locataire est lié à un seul bailleur, avec RLS (ADR-01). D2 et D3 exigent plusieurs bailleurs par patrimoine.

ADR-20 est rédigé. Décisions PO/CDO du 2026-10-12 :

- `patrimoine_bailleur` : table de liaison N-N ; `patrimoine.bailleur_id` devient le bailleur créateur, informatif (D-MB-01) ;
- RLS sur `patrimoine` par appartenance via `patrimoine_bailleur`, évaluée par une fonction `SECURITY DEFINER` (D-MB-02, correction S1) ;
- les tables filles (`bien`, `bail`, `paiement`, `garantie`, `quittance`) héritent de la visibilité du patrimoine (D-MB-03) ;
- le locataire reste rattaché à un bailleur créateur, visible des co-bailleurs des patrimoines où il a un bail (D-MB-04) ;
- un seul bailleur du patrimoine suffit pour approuver une modification de locataire, jamais le demandeur (D-MB-05).

Décisions complémentaires de l'ADR-20 (2026-10-14 et 2026-10-16) : alertes uniques par bien avec lecture par destinataire (D-MB-06, D-MB-15), émetteur unique de quittances par bail (D-MB-07), co-responsabilité RGPD (D-MB-08), historique complet pour un nouveau co-bailleur (D-MB-09), affectations portées par le patrimoine (D-MB-10), audit avec `acteur_bailleur_id` et `patrimoine_id` (D-MB-11, D-MB-14), règles d'ajout et de retrait des membres (D-MB-12), notifications par co-bailleur (D-MB-13), invitations étendues (D-MB-16), redevable des honoraires (D-MB-17), et décisions techniques DT-01 à DT-06.

**Gate** : aucun lot 4 ou 5 ne démarre tant qu'ADR-20 n'est pas « Acceptée ». Le passage à « Acceptée » exige la revue sécurité de la policy RLS et du `EXISTS` (`docs/cgpa/reports/revue-securite-adr20-rls-multi-bailleurs.md`).

## 4. Lots de travail

Ordre par valeur et risque. Les lots 1 et 2 règlent P1 et P2.

### Lot 1 — Statut du bien dérivé du bail (P2 : C1, C2, C3)
- **Objectif** : R3, R4, R5. Plus aucun statut de bien saisi librement pour `LOUE`/`LIBRE`.
- **Périmètre** :
  - `Bien.statut` ne s'écrit plus à la main pour `LOUE`/`LIBRE` (`BienService.modifier` refuse ces valeurs, ou les ignore) ;
  - à la clôture effective, passage à `LIBRE` si aucun autre bail `ACTIF` ;
  - scheduler de clôture à la date d'effet pour les interruptions futures (voir lot 2).
- **Migration** : script de **détection en lecture seule** d'abord (biens `LOUE` sans bail actif, `LIBRE` avec bail actif). Correction ensuite, après validation des cas listés.
- **Tests** : intégration PostgreSQL (Testcontainers) ; test reproduisant C2 avant correction.
- **Rollback** : code (feature flag) ; données : la migration de correction est réversible par export préalable.

### Lot 2 — Interruption de bail prospective (P1 : C4, C5, C6, C7)
- **Objectif** : R1, R2, R3, R6, R7.
- **Périmètre** :
  - `StatutBail` reste `ACTIF` / `CLOS` (Q0) : aucune migration des baux `CLOS` existants, `uq_bail_actif` préservé ;
  - nouvelles colonnes `date_demande` et `motif_fin` ; `date_cloture_effective` réutilisée comme date d'effet (Q0 bis) ;
  - un bail `ACTIF` avec `date_cloture_effective` future est en préavis ; un job le passe à `CLOS` à cette date ;
  - échéances futures passent à `CLOTUREE` (nouveau statut de paiement, Q2), **sans suppression** ;
  - confirmation avec montant dû, sans blocage sur impayés (Q1, R7) ;
  - le bien reste `LOUE` jusqu'à la date d'effet (lot 1 prend le relais).
- **Point à vérifier avant développement** : V25 documente `date_cloture_effective` comme « renseignée uniquement à la clôture manuelle ». Avec Q0 bis, elle peut être future sur un bail `ACTIF`. Lister toutes les requêtes, alertes et vues qui la lisent (`V25__ep13_fin_de_bail.sql`, `BailService`) et prouver qu'aucune ne traite « non nul » comme « clos ».
- **Migration** : additive (colonnes `date_demande`, `motif_fin` ; CHECK de `paiement.statut` étendu à `CLOTUREE`). Remplacement du `deleteBy...` de `BailService.java:176` par un passage à `CLOTUREE`. La génération des loyers ne recrée pas les échéances `CLOTUREE`.
- **Tests** : interruption à date future ; date passée refusée ; échéances futures clôturées, aucune suppression ; bien `LOUE` pendant le préavis ; job de passage à `CLOS` idempotent.
- **Rollback** : code ; données : les échéances `CLOTUREE` restent visibles, pas de perte.

### Lot 3 — Affectation contrôlée d'un bien libre (P2)
- **Objectif** : R5, R10.
- **Périmètre** : création de bail sur bien `LIBRE` uniquement, double garde (statut + absence de bail `ACTIF`), audit de l'auteur.
- **Dépend de** : lot 1.

### Lot 4 — Patrimoine multi-bailleurs (P3, D2)
- **Dépend de** : ADR-20 « Acceptée » (section 3) et revue sécurité.
- **Périmètre** (ADR-20) :
  - table `patrimoine_bailleur` (clé composite, index `(bailleur_id, patrimoine_id)`), migration : une ligne par patrimoine existant avec son bailleur créateur ;
  - policy RLS par appartenance (fonction `bailleur_est_membre_patrimoine`, `SECURITY DEFINER`) sur `patrimoine` et sur les tables filles ; `patrimoine_bailleur` sous policy simple `bailleur_id = GUC` pour éviter la récursion (S1) ;
  - `AuthorizationService.peutAccederBien` révisé : co-bailleur, gestionnaire affecté (ADR-11), locataire visible via bail ;
  - gestionnaires multi-patrimoines ;
  - feature flag `multi_bailleur_enabled` (arrête l'extension du partage ; ne modifie pas les policies, voir rollback d'ADR-20) ;
  - périmètre ajouté par les décisions D-MB-06 à D-MB-17 : alertes et lecture par destinataire, émetteur de quittances (`emetteur_bailleur_id`), affectations portées par le patrimoine, audit (`acteur_bailleur_id`, `patrimoine_id`), notifications par destinataire, invitations de co-bailleurs, redevable des honoraires ;
  - réécriture des fonctions `SECURITY DEFINER` identifiées au registre d'ADR-20 (23 fonctions) et contrôle CI (DT-02).
- **Découpage recommandé** : ce lot est volumineux. Son Plan d'Exécution détaillé doit le scinder (modèle et RLS d'abord, puis alertes, notifications, audit, invitations, quittances, honoraires), chaque partie avec sa propre revue.
- **Tests** : suite d'autorisation croisée (co-bailleur autorisé, bailleur tiers refusé, gestionnaire hors affectation refusé) ; objectif 0 accès cross-bailleur non autorisé (ENF-02).
- **Risque** : élevé (sécurité et RLS). Revue humaine obligatoire.

### Lot 5 — Demande de modification de locataire approuvée par un bailleur (P4, D3)
- **Dépend de** : lot 4 et ADR-20 (D-MB-04, D-MB-05).
- **Périmètre** : entité `DemandeModificationLocataire` (avant/après, auteur, statut `EN_ATTENTE`/`APPROUVEE`/`REFUSEE`, approbateur) ; un bailleur du patrimoine concerné suffit ; l'approbateur n'est jamais le demandeur (Q3) ; l'approbation s'exécute dans la transaction du bailleur approbateur, avec RLS normale ; journalisation.
- **Précision (audit §6, C8)** : le Gestionnaire n'a aujourd'hui aucun droit de modification (`LocataireController` = BAILLEUR). Le lot **ajoute** cette capacité sous approbation ; `LocataireService.modifier` reste l'action du bailleur. Ajouter un avant/après au journal d'audit.

### Lot 6 — Historique par bien (P5)
- **Périmètre** : chronologie des baux, locataires, dates, loyers, motif de fin et préavis en cours (bail `ACTIF` à date de fin future) ; affichage sur la fiche bien.
- **Dépend de** : lots 2 et 4 pour les données complètes.

### Lot 7 — Page échéancier dédiée (P6, C11)
- **Périmètre** : route propre (ex. `/echeancier`), filtres (bien, locataire, statut, période), statut `CLOTUREE` visible, export.
- **Frontend** : revue UX/Design obligatoire (changement Angular significatif).

## 5. Impacts

| Dimension | Impact |
|---|---|
| Métier | Statut du bien fiable ; interruption tracée ; historique consultable. |
| Logiciel | Modèle bail, bien, locataire, patrimoine ; nouveaux endpoints ; scheduler. |
| Technique | Migrations Flyway additives ; RLS revue (lot 4) ; tests Testcontainers. |
| UX/UI | Page échéancier, fiche bien historique, écran de demande de modification. |
| Financier | Aucune suppression de paiement ; statut `CLOTUREE` ; revue Financial Governance avant lot 2. |
| Sécurité | Approbation bailleur (R9) ; RLS multi-bailleurs (lot 4). |

## 6. Données existantes

- Script de détection en **lecture seule** avant toute correction (lot 1).
- Export préalable des baux, biens et échéances concernés.
- Décision PO sur chaque cas incohérent avant correction.

## 7. Critères d'acceptation (extrait)

- Une interruption saisie aujourd'hui avec `dateEffet` future ne change pas le statut du bien avant cette date.
- À `dateEffet` atteinte, le bien est `LIBRE` si aucun autre bail `ACTIF`.
- Aucune échéance n'est supprimée lors d'une interruption ; les futures passent à `CLOTUREE`.
- Un bien `LIBRE` avec un bail `ACTIF` est impossible (contrôle + détection).
- Une modification de locataire par un gestionnaire reste en `EN_ATTENTE` tant qu'aucun bailleur ne l'approuve.

## 8. Risques

| Risque | Propriétaire | Mitigation |
|---|---|---|
| RLS multi-bailleurs mal conçue (fuite de données) | Tech lead | ADR-20 + revue sécurité + tests d'isolation |
| `date_cloture_effective` future lue comme « clos » par une requête ou alerte existante | Tech | Inventaire des lectures (lot 2) avant développement ; tests sur les alertes V25 |
| Dégradation de performance par jointure `patrimoine_bailleur` | Tech | Index `(bailleur_id, patrimoine_id)` ; mesure avant/après sur le lot 4 |
| Données existantes incohérentes | PO | Détection lecture seule, décision cas par cas |
| Régression sur encaissements | Financial | Tests non-régression paiements ; pas de suppression |
| Scheduler de clôture manqué | Tech | Job idempotent + alerte + rattrapage au démarrage |

## 9. Décisions PO (Q0 à Q3 tranchées ; aucune question métier ouverte)

### Décisions PO (2026-10-12)

- **Q0 — Statuts du bail** : **`ACTIF` / `CLOS`.** Pas de `BROUILLON`, pas de `INTERROMPU`. Un préavis est un bail `ACTIF` avec une date de fin future. Un job le passe à `CLOS` à cette date, avec un motif de fin. Les baux `CLOS` existants ne sont pas migrés ; `uq_bail_actif` est préservé. Remplace la proposition v1 de R1.
- **Q0 bis — Date d'effet de fin** : **réutiliser `date_cloture_effective`.** Pas de nouvelle colonne `dateEffetFin`.


- **Q1 — Impayés** : **Non bloquant.** L'interruption passe après confirmation affichant le montant dû. Impayés, retards et partiels restent sur le bail clos, visibles et recouvrables, jamais supprimés. Remplace R7 (blocage à la LoyerPro).
- **Q2 — Statut de l'échéance clôturée** : **Nouveau statut de paiement `CLOTUREE`.** Migration du CHECK sur `paiement.statut` requise. La génération des loyers ne recrée pas ces échéances.
- **Q3 — Auto-approbation** : **Interdite.** L'approbateur n'est jamais le demandeur. Le bailleur modifie directement son locataire, avec journal avant/après. L'approbation ne concerne que les demandes d'un gestionnaire.

### Réponses proposées (Claude Sonnet 5.5, 2026-10-09) — conservées pour la trace

**Statut : historique.** Ces propositions ont été retenues par le PO/CDO (Q0, Q0 bis, Q1, Q2, Q3 ci-dessus) ; R1, R3, R7 du §2 et les lots 1 et 2 ont été alignés. Elles ne valent pas approbation du plan.

| Q | Réponse proposée | Justification | Non vérifié |
|---|---|---|---|
| Q0 | Garder `ACTIF` / `CLOS`. Un préavis = bail `ACTIF` avec `date_cloture_effective` future ; un job le passe à `CLOS` à cette date, avec un `motif_fin` (résiliation, terme, autre). `INTERROMPU` seulement si le PO veut un état visible distinct pendant le préavis. `BROUILLON` reporté. | Évite de migrer les `CLOS` existants ; préserve `uq_bail_actif` (`V1:159`), le CHECK de `V1` et les alertes de `V25` (filtres `ACTIF`/`CLOS`). Diffère du plan v1 (R1) et du modèle demandé. | Impact exact sur toutes les requêtes filtrant `bail.statut`. |
| Q1 | **Ne pas bloquer** l'interruption sur impayés (remplace R7). Confirmation explicite affichant le montant dû ; impayés, retards et partiels conservés sur le bail clos, visibles et recouvrables, jamais supprimés. | Un bailleur doit pouvoir mettre fin au bail d'un locataire en défaut. Le blocage de LoyerPro ne convient pas à ce cas. | Revue Financial Governance requise. |
| Q2 | `CLOTUREE` = **nouveau statut de paiement**. | Sort naturellement des calculs d'arriérés et des alertes, sans filtre à chaque requête. | CHECK sur `paiement.statut` (migration nécessaire s'il existe) ; la génération des loyers ne doit pas recréer ces échéances. |
| Q3 | Le bailleur modifie directement un locataire, avec journal avant/après. L'approbation ne concerne que les demandes d'un gestionnaire. Un seul bailleur du patrimoine suffit, y compris s'il est seul. L'approbateur n'est jamais le demandeur. | Cohérent avec D3 ; le gestionnaire n'a aujourd'hui aucun droit de modification (`LocataireController:29`). | Dépend de l'ADR multi-bailleurs. |

## 10. Gates et preuves attendues

- Gate : Plan approuvé → ADR-20 « Acceptée » après revue sécurité (lots 4 et 5) → recette par lot → Gate Staging `STG-ISOL-01` → Gate Production.
- Les lots 1, 2, 3, 6 et 7 ne dépendent pas d'ADR-20 et peuvent démarrer dès l'approbation du plan ; les lots 4 et 5 attendent ADR-20.
- **Un Plan d'Exécution détaillé par lot** (modèle `docs/cgpa/templates/plan-execution.md` : fichiers concernés, étapes, commandes prévues, tests, critères de validation) est requis et doit être approuvé avant le code de ce lot. Le présent document est le plan-cadre du programme.
- Preuves par lot : tests verts, script de détection joint, rapport de migration, revue humaine des contributions IA.
- Aucune promotion sans validation humaine (CDO).
