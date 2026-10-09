# Plan d'exécution — Cycle de vie du bail, statut du bien, historique, échéancier

- **Statut** : **Proposé — en attente de validation PO/CDO.** Aucun code applicatif ne doit être écrit avant approbation.
- **Date** : 2026-10-09
- **Source** : `docs/cgpa/reports/audit-cycle-bail-phase1-2026-10-09.md`
- **Propriétaire** : PO (décisions D1 à D5 du rapport d'audit)

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
| R1 | Un bail a un statut `ACTIF`, `INTERROMPU` (nouveau), ou `CLOS`. |
| R2 | Une interruption enregistre `dateDemande`, `dateEffet` (≥ aujourd'hui), `motif`, `auteur`. Elle est **prospective** (D1). |
| R3 | À la date d'effet, le bail passe à `CLOS` (ou `INTERROMPU`) et le bien redevient `LIBRE` si aucun autre bail `ACTIF` ne porte sur le bien. |
| R4 | Le bien reste `LOUE` pendant le préavis, tant que la date d'effet n'est pas atteinte (D5). |
| R5 | Un bien ne peut recevoir un nouveau bail que s'il est `LIBRE` **et** sans bail `ACTIF` (double garde). |
| R6 | À l'effet d'interruption, les échéances futures passent au statut `CLOTUREE`. Elles ne sont **jamais supprimées** (D4, C7). |
| R7 | Une interruption est refusée si des échéances `IMPAYE`, `EN_RETARD` ou `PARTIEL` existent. Le blocage est une règle, pas un avertissement (C6). À confirmer par PO (voir Q1). |
| R8 | Un patrimoine peut avoir plusieurs biens et plusieurs bailleurs. Un gestionnaire peut être assigné à plusieurs patrimoines (D2). |
| R9 | La modification d'un locataire par un gestionnaire crée une **demande** en attente. Un seul bailleur du patrimoine concerné suffit à l'approuver (D3). |
| R10 | Un bail peut être créé par un bailleur ou par un gestionnaire habilité, uniquement sur un bien `LIBRE`. |

## 3. Prérequis : ADR multi-bailleurs (bloquant)

C9 : le locataire est lié à un seul bailleur, avec RLS (ADR-01). D2 et D3 exigent plusieurs bailleurs par patrimoine.

- **Action** : rédiger un ADR `docs/cgpa/adr/` qui tranche :
  - où vit la propriété multi-bailleurs (table de liaison `patrimoine_bailleur`) ;
  - comment la RLS évolue (le locataire reste rattaché à l'organisation, pas à un seul bailleur) ;
  - le sort de `locataire.bailleur_id` (migration progressive, ou dérivation via les patrimoines).
- **Gate** : aucun lot 4 ou 5 ne démarre sans ADR approuvé.

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
- **Objectif** : R1, R2, R6, R7.
- **Périmètre** :
  - statut `INTERROMPU` ajouté à `StatutBail` (migration CHECK) ;
  - champs `dateDemande`, `dateEffet`, `motif` ;
  - échéances futures passent à `CLOTUREE` (nouveau statut de paiement), **sans suppression** ;
  - le bien reste `LOUE` jusqu'à `dateEffet` (lot 1 prend le relais).
- **Migration** : additive (nouvelles colonnes, nouveau statut). Remplacement du `deleteBy...` de `BailService.java:176` par un passage à `CLOTUREE`.
- **Tests** : interruption future vs passée (refus) ; échéances futures clôturées, aucune suppression ; bien `LOUE` pendant le préavis.
- **Rollback** : code ; données : les échéances `CLOTUREE` restent visibles, pas de perte.

### Lot 3 — Affectation contrôlée d'un bien libre (P2)
- **Objectif** : R5, R10.
- **Périmètre** : création de bail sur bien `LIBRE` uniquement, double garde (statut + absence de bail `ACTIF`), audit de l'auteur.
- **Dépend de** : lot 1.

### Lot 4 — Patrimoine multi-bailleurs (P3, D2)
- **Dépend de** : ADR (section 3).
- **Périmètre** : table de liaison, RLS, `peutAccederBien` révisé pour plusieurs bailleurs, gestionnaires multi-patrimoines.
- **Risque** : élevé (sécurité et RLS). Revue humaine obligatoire.

### Lot 5 — Demande de modification de locataire approuvée par un bailleur (P4, D3)
- **Dépend de** : lot 4.
- **Périmètre** : entité `DemandeModificationLocataire` (avant/après, auteur, statut `EN_ATTENTE`/`APPROUVEE`/`REFUSEE`, approbateur) ; un bailleur suffit ; journalisation.
- **Précision (audit §6, C8)** : le Gestionnaire n'a aujourd'hui aucun droit de modification (`LocataireController` = BAILLEUR). Le lot **ajoute** cette capacité sous approbation ; `LocataireService.modifier` reste l'action du bailleur. Ajouter un avant/après au journal d'audit.

### Lot 6 — Historique par bien (P5)
- **Périmètre** : chronologie des baux, locataires, dates, loyers, motif de fin, statut d'interruption ; affichage sur la fiche bien.
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
| RLS multi-bailleurs mal conçue (fuite de données) | Tech lead | ADR + revue humaine + tests d'isolation |
| Données existantes incohérentes | PO | Détection lecture seule, décision cas par cas |
| Régression sur encaissements | Financial | Tests non-régression paiements ; pas de suppression |
| Scheduler de clôture manqué | Tech | Job idempotent + alerte + rattrapage au démarrage |

## 9. Questions ouvertes (bloquantes pour le lot 2)

- **Q0** : jeu de statuts du bail : `ACTIF/INTERROMPU/CLOS` (v1) ou `BROUILLON/ACTIF/RESILIE/TERMINE/INTERROMPU` (demande PO) ? Réutiliser `date_cloture_effective` comme `dateEffetFin` ? Voir audit §6.

- **Q1** : confirmer R7 : une interruption est-elle **refusée** tant qu'il y a des impayés, ou seulement signalée ?
- **Q2** : `CLOTUREE` est-il un nouveau statut de paiement, ou un marqueur sur l'échéance ?
- **Q3** : un bailleur qui approuve sa propre demande (cas de patrimoine à un seul bailleur) : autorisé ?

## 10. Gates et preuves attendues

- Gate : Plan approuvé → ADR approuvé (lot 4) → recette par lot → Gate Staging `STG-ISOL-01` → Gate Production.
- Preuves par lot : tests verts, script de détection joint, rapport de migration, revue humaine des contributions IA.
- Aucune promotion sans validation humaine (CDO).
