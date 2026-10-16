# Demande d'approbation — Plan d'exécution « Cycle de vie du bail »

- **Date de la demande** : 2026-10-16
- **Destinataires** : PO (décision métier) et CGPA Chief Delivery Officer (décision CGPA finale)
- **Plan concerné** : `docs/cgpa/06-planification-agile/plan-execution-cycle-bail.md`
- **Statut de cette demande** : **traitée le 2026-10-16 : plan-cadre approuvé** (voir §9). Ce document ne vaut ni autorisation de code, ni autorisation de promotion.
- **Préparé par** : Claude Code (contribution IA) ; **à relire par un humain** avant décision.

## 1. Ce qui est demandé

Décider entre **Approuver**, **Approuver sous réserve**, **Corriger le plan** ou **Refuser** (modèle `docs/cgpa/templates/plan-execution.md`, §13), sur le point suivant :

> Approuver le plan-cadre « Cycle de vie du bail » comme cadre du programme, et autoriser le démarrage de la rédaction des Plans d'Exécution détaillés des lots 1, 2, 3, 6 et 7.

**Ce que l'approbation n'autoriserait pas** :

- aucun code applicatif d'un lot avant l'approbation de **son** Plan d'Exécution détaillé ;
- aucun démarrage des lots 4 et 5 tant qu'ADR-20 n'est pas « Acceptée » ;
- aucune promotion en Staging ni en Production (Gate Staging avec `STG-ISOL-01`, puis Gate 09 / Gate Production restent requis) ;
- aucune exécution du contrôle S12b sur la production sans une autorisation distincte du PO.

## 2. Pourquoi ce programme

Problèmes constatés par le PO (audit phase 1, `docs/cgpa/reports/audit-cycle-bail-phase1-2026-10-09.md`) :

| # | Problème | Cause constatée dans le code |
|---|---|---|
| P1 | On ne sait pas interrompre un bail proprement | Pas de motif ni de date d'effet ; les échéances futures sont **supprimées** à la clôture (`BailService.java:176`) ; impayés seulement signalés |
| P2 | Un bien ne redevient jamais « libre » automatiquement | `Bien` ne sait que passer à `LOUE` ; la clôture d'un bail ne touche pas au bien ; seule voie : saisie manuelle du statut |
| P3 | Plusieurs baux par locataire dans un patrimoine | Déjà permis par le schéma ; mais le modèle suppose un seul bailleur par patrimoine |
| P4 | Modification de locataire sous approbation du bailleur | Aucun workflow ; seul le bailleur modifie, avec journal d'audit |
| P5 | Historique de location par bien | API existante, écran non confirmé |
| P6 | Échéancier sur sa propre page | Attaché à la vue bien |

## 3. Décisions déjà prises (rappel)

Toutes consignées avec leur date dans le plan et dans l'ADR-20.

- **Règles du bail** (2026-10-09 / 10-12) : interruption **prospective** ; statuts `ACTIF` / `CLOS` uniquement ; préavis = bail `ACTIF` à date de fin future, passage à `CLOS` par job ; `date_cloture_effective` réutilisée ; échéances futures **clôturées** (`CLOTUREE`), jamais supprimées ; interruption **non bloquée** par les impayés (confirmation avec montant dû) ; pas d'auto-approbation.
- **Modèle multi-bailleurs** (ADR-20, D-MB-01 à D-MB-17) : table de liaison `patrimoine_bailleur`, visibilité héritée du patrimoine, émetteur unique de quittances par bail, co-responsabilité RGPD, affectations portées par le patrimoine, notifications par co-bailleur, redevable des honoraires désigné.
- **Décisions techniques** (DT-01 à DT-06) : lignes batch au `bailleur_id` de la ligne parente, contrôle CI des fonctions `SECURITY DEFINER`, mesure de performance avec seuil +20 % p95, contrôle de cohérence sur copie de production.
- **Production actuelle** : aucune situation de co-bailleur (déclaré par le PO ; non vérifié en base).

## 4. Contenu du plan : 7 lots

| Lot | Contenu | Dépend de | Peut démarrer après approbation |
|---|---|---|---|
| 1 | Statut du bien **dérivé** du bail (P2) | — | Oui (Plan détaillé d'abord) |
| 2 | Interruption prospective, échéancier clôturé (P1) | — (vérification préalable de `date_cloture_effective`, voir §6) | Oui (Plan détaillé d'abord) |
| 3 | Affectation contrôlée d'un bien libre (P2) | Lot 1 | Oui |
| 4 | Patrimoine multi-bailleurs (P3) | ADR-20 « Acceptée » | **Non** |
| 5 | Demande de modification de locataire approuvée (P4) | Lot 4 | **Non** |
| 6 | Historique par bien (P5) | Lots 2 et 4 pour les données complètes | Oui, version réduite possible |
| 7 | Page échéancier dédiée (P6) | Statut `CLOTUREE` (lot 2) | Oui (revue UX/Design requise) |

Ordre proposé : **1 → 2 → 3**, puis **7** et **6**, en parallèle de la levée des conditions d'ADR-20, puis **4 → 5**.

## 5. Conditions et gouvernance appliquées

- **Plan détaillé par lot** : le plan soumis est un plan-cadre. Il n'a pas, par lot, tous les éléments du modèle (fichiers concernés, étapes, commandes prévues, tests par type, critères de validation). Chaque lot aura son Plan d'Exécution détaillé, approuvé avant son code. C'est le garde-fou qui évite de reproduire l'écart constaté sur la migration Spring Boot 4 (code fusionné avant plan approuvé, `docs/project-state.md`).
- **Financial Governance** : revue avant le lot 2 (statut `CLOTUREE`, fin de suppression physique des paiements), avant l'émetteur de quittances (D-MB-07) et le redevable des honoraires (D-MB-17).
- **UX / Design / Frontend** : revue obligatoire pour la page échéancier (lot 7), la fiche bien et l'écran de demande de modification.
- **DevSecOps / Enterprise Delivery** : migrations Flyway additives, rollback documenté (application, données, flags), contrôle CI des fonctions `SECURITY DEFINER` (CHECK-CICD-01), CHECK-REL-01, CHECK-OPS-01 et CHECK-VAL-01 au prochain jalon concerné.
- **Staging mutualisé** : `STG-ISOL-01` bloquant avant promotion ; aucune commande Docker globale sur `ai-test-server`.
- **Revue humaine** de toute contribution IA significative.

## 6. Risques à connaître avant de décider

| Risque | Gravité | Traitement prévu |
|---|---|---|
| `date_cloture_effective` future lue comme « clos » par des requêtes ou alertes existantes (V25) | Majeur | Inventaire des lectures avant le lot 2 ; tests sur les alertes |
| Isolation multi-bailleurs mal conçue (fuite de données) | Critique | ADR-20, revue sécurité humaine, suite de tests d'accès croisé ; lots 4 et 5 bloqués |
| Données existantes incohérentes (bien `LOUE` sans bail actif, etc.) | Majeur | Script de détection en **lecture seule** d'abord ; décision du PO cas par cas |
| Régression sur les encaissements | Majeur | Tests de non-régression des paiements ; aucune suppression |
| Job de clôture manqué | Moyen | Job idempotent, alerte, rattrapage au démarrage |
| Lot 4 trop volumineux | Moyen | Découpage obligatoire dans son Plan détaillé |

## 7. Prérequis encore ouverts (ils n'empêchent pas l'approbation du plan-cadre)

Pour que l'ADR-20 passe à « Acceptée » et libère les lots 4 et 5 :

1. Audit humain des **23 fonctions `SECURITY DEFINER`** (registre : `docs/cgpa/evidence/adr20-s5-s11-s12b/decisions-techniques-et-registre.md`).
2. Mesure de performance (seuil +20 % p95).
3. Exécution du contrôle S12b sur une copie restaurée de la production (autorisation du PO d'accéder à une sauvegarde).
4. Revue sécurité humaine de la policy RLS et de la règle du bailleur acteur (`docs/cgpa/reports/revue-securite-adr20-rls-multi-bailleurs.md`).

## 8. Ce qui n'a pas été vérifié

- Aucune exécution : pas de base interrogée, pas de test lancé, pas de build. Les constats viennent de la lecture du code et des migrations.
- Le schéma réellement déployé en production n'a pas été comparé aux migrations.
- Les corps des 23 fonctions `SECURITY DEFINER` n'ont pas été relus ; leurs impacts sont présumés.
- La navigation complète du frontend (fiche bien, routes enfants) n'a pas été auditée.
- Aucune estimation de charge ni de calendrier n'est fournie : elle sera faite dans chaque Plan détaillé.

## 9. Décision

| Champ | Décision |
|---|---|
| Décision | **Approuver** |
| Formulation | « plan approuver », exprimée dans le chat par le PO/CDO |
| Date | 2026-10-16 |
| Réserves exprimées | Aucune dans le message. |
| Périmètre retenu (interprétation) | Plan-cadre approuvé ; rédaction des Plans d'Exécution détaillés des lots 1, 2, 3, 6 et 7 autorisée. Lots 4 et 5 bloqués par ADR-20. Aucun code, aucune promotion. |

**Interprétation à confirmer.** Le message ne précisait pas le périmètre. Il a été interprété comme l'approbation demandée au §1, sans extension : il n'autorise pas de code avant le Plan détaillé d'un lot, ni les lots 4 et 5, ni une promotion. Si l'intention était plus large, elle doit être exprimée explicitement avant toute action.

Statut du plan mis à jour (« Approuvé comme plan-cadre ») et `docs/project-state.md` mis à jour. Une réserve ne neutralise jamais un bloqueur.
