# ADR-20 — Patrimoine multi-bailleurs et visibilité partagée

| Champ | Valeur |
|---|---|
| Statut | **Proposée** — décisions D-MB-01 à D-MB-05 prises par le PO/CDO ; en attente de revue sécurité |
| Date | 2026-10-12 (révisée le 2026-10-14 : corrections S1, S2, S3 du dossier de revue) |
| Dossier de revue | `docs/cgpa/reports/revue-securite-adr20-rls-multi-bailleurs.md` |
| Phase | 05 — Architecture (prérequis bloquant des lots 4 et 5 du plan cycle de vie du bail) |
| Amende | ADR-01 (règle « toute table métier porte `bailleur_id` » et policy RLS), ADR-11 (`Patrimoine.bailleur_id` unique) |
| Complète | ADR-02 (autorisation), ADR-16 (portée du locataire), ADR-17 (fin de bail) |
| Source | `docs/cgpa/06-planification-agile/plan-execution-cycle-bail.md` §3, décisions D2 et D3 du PO |

## Contexte

Le PO a validé le modèle suivant (2026-10-09) :

- un patrimoine contient **un ou plusieurs biens** (appartement, boutique, bureau…) ;
- un patrimoine appartient à **un ou plusieurs bailleurs** ;
- un gestionnaire peut être assigné à **un ou plusieurs patrimoines** ;
- une modification de locataire demandée par un gestionnaire est **approuvée par l'un des bailleurs** du patrimoine.

Le code et les ADR actuels supposent un propriétaire unique :

| Source | Hypothèse actuelle | Conflit |
|---|---|---|
| ADR-11, `Patrimoine` | `patrimoine.bailleur_id` non nul, un seul propriétaire | Un patrimoine ne peut pas avoir deux bailleurs |
| ADR-01 | Toute table métier porte `bailleur_id`, RLS `bailleur_id = app.current_bailleur_id` | La RLS ne voit qu'un bailleur par ligne |
| `Locataire.java` (V24) | `bailleur_id` non nul, `updatable = false`, RLS sur `bailleur_id` | Un locataire vu par plusieurs bailleurs est impossible |
| `Bail` (V1) | `bailleur_id` non nul | Un bail sur un patrimoine partagé n'a pas de propriétaire unique |
| ADR-16 | Locataire « rattaché à un seul bailleur » (les personnes sont scopées par bailleur) | À réviser pour les baux partagés |

Sans décision, le lot 4 (patrimoine multi-bailleurs) et le lot 5 (approbation par un bailleur) ne peuvent pas être développés sans risque de fuite de données.

## Problème

1. Où porte-t-on la liste des bailleurs d'un patrimoine ?
2. Comment la RLS décide-t-elle qu'un bailleur voit une ligne qu'il ne possède pas seul ?
3. Quel est le propriétaire d'un locataire ou d'un bail quand plusieurs bailleurs partagent le patrimoine ?
4. Comment se fait l'approbation (D3) sans auto-approbation et sans contourner la RLS ?

## Décisions

Décisions PO/CDO du 2026-10-12 : toutes les options recommandées sont retenues. Les options rejetées sont conservées pour la trace.

| Code | Décision retenue |
|---|---|
| D-MB-01 | Table de liaison `patrimoine_bailleur` (Option A). |
| D-MB-02 | Policy RLS sur `patrimoine` par appartenance via `patrimoine_bailleur` (Option A), évaluée par une fonction `SECURITY DEFINER` (correction S1). |
| D-MB-03 | Visibilité des tables filles héritée du patrimoine (Option A). |
| D-MB-04 | Locataire rattaché à un bailleur créateur, visibilité par patrimoine (Option A). |
| D-MB-05 | Un seul bailleur du patrimoine suffit pour approuver ; jamais le demandeur (Option A). |

Détail des options, pour référence :

### D-MB-01 — Table de liaison des bailleurs (retenue : Option A)

- **Option A (recommandée)** : table `patrimoine_bailleur (patrimoine_id, bailleur_id, role, date_ajout)`, clé composite. `patrimoine.bailleur_id` devient le **bailleur créateur**, informatif, non discriminant.
- **Option B** : tableau `bailleur_ids UUID[]` sur `patrimoine`. Rejetée : pas de contrainte d'intégrité, pas de clé étrangère, pas de traçabilité par bailleur.

### D-MB-02 — Policy RLS sur `patrimoine` (retenue : Option A)

- **Option A (recommandée)** : un bailleur voit un patrimoine s'il y est membre dans `patrimoine_bailleur`.
  - **Correction S1.** La rédaction initiale faisait lire `patrimoine_bailleur` par sa propre policy (pour que chaque bailleur voie ses co-bailleurs). Une policy qui interroge sa propre table provoque l'erreur PostgreSQL `infinite recursion detected in policy`. Rédaction retenue :
    - `patrimoine_bailleur` porte une policy **simple** : `bailleur_id = app.current_bailleur_id` (chaque bailleur voit ses propres lignes d'appartenance) ;
    - l'appartenance est évaluée par une fonction `bailleur_est_membre_patrimoine(patrimoine, bailleur)` en `SECURITY DEFINER`, `STABLE`, lecture seule, `search_path` fixé, `GRANT EXECUTE` limité à `loyertracker_api` (patron déjà utilisé : V12 `patrimoine_appartient_au_bailleur`, V13) ;
    - la liste des co-bailleurs d'un patrimoine (écran de gestion) passe par une fonction `SECURITY DEFINER` dédiée, appelée après vérification d'appartenance.
  - Ce changement est une **correction technique**, non un changement de décision : l'Option A reste « appartenance via `patrimoine_bailleur` ». La relecture sécurité doit confirmer le recours à une fonction `SECURITY DEFINER` (propriétaire, coût du plan par ligne).
- **Option B** : policy par `bailleur_id` créateur + vue `patrimoine_partage` pour les co-bailleurs. Rejetée : deux chemins d'accès à maintenir, risque d'oubli.

### D-MB-03 — Visibilité des tables filles (retenue : Option A)

Les tables `bien`, `bail`, `paiement`, `garantie`, `quittance` héritent de la visibilité du patrimoine par jointure (`patrimoine_id` ou `bien_id` → `patrimoine`), et non d'un `bailleur_id` propre.

- **Option A (recommandée)** : policy RLS sur chaque table fille par appartenance au patrimoine, via la même fonction `bailleur_est_membre_patrimoine` (correction S1). `bailleur_id` reste en colonne informative (créateur de la ligne).
- **Périmètre non couvert ici (S4)** : la RLS actuelle s'applique à plus de tables que les cinq citées (`invitation`, `affectation`, `honoraire`, `alerte`, `audit_log`, `garantie_movement`, `quittance_numerotation`, `notification_*`, `locataire`). Leur traitement, table par table, est à inventorier avant acceptation (voir dossier de revue §2, S4).
- **Option B** : maintenir `bailleur_id` sur chaque table fille avec une copie par bailleur. Rejetée : duplication, incohérence possible à la rotation.

### D-MB-04 — Locataire : propriété et visibilité (retenue : Option A)

Question ouverte : un locataire lié à un bail sur un patrimoine partagé, qui est son propriétaire ?

- **Option A (recommandée)** : le locataire reste rattaché à un **bailleur créateur**, mais sa visibilité suit les **patrimoines où il a un bail actif ou clos**. Un co-bailleur de ces patrimoines le voit. La modification passe par D3 (approbation).
- **Option B** : locataire rattaché à l'**organisation** (nouveau concept), visible par tous les bailleurs qui partagent un patrimoine où il apparaît. Plus propre, mais impose une migration du modèle locataire.
- **Option C** : un locataire par bailleur (doublons acceptés, rapprochement manuel). Rejetée : contredit l'historique unifié demandé (P3, P5).

### D-MB-05 — Approbation des modifications (D3) (retenue : Option A)

- **Option A (recommandée)** : une `DemandeModificationLocataire` est créée par le gestionnaire. N'importe quel bailleur du patrimoine concerné peut l'approuver ou la refuser. L'approbateur n'est jamais le demandeur (Q3 du plan). L'approbation s'exécute dans la transaction du bailleur approbateur, avec RLS normale.
- **Option B** : approbation par **tous** les bailleurs. Rejetée par le PO (D3 : un seul suffit).

## Décisions complémentaires (PO/CDO, 2026-10-14)

Prises pendant la préparation de la revue sécurité (points S6 à S14 du dossier). Toutes les options recommandées sont retenues.

| Code | Point | Décision retenue |
|---|---|---|
| D-MB-06 | S6 — Alertes | Une alerte par bien et par période, portée par le patrimoine, visible de tous les co-bailleurs. Pas de doublon par bailleur. |
| D-MB-07 | S7 — Quittances | Un **émetteur unique par bail**, désigné à la création du bail parmi les co-bailleurs. La numérotation reste continue par émetteur et par année (clé `(bailleur_id, annee)` inchangée). Les autres co-bailleurs voient les quittances. |
| D-MB-08 | S8 — RGPD | Les co-bailleurs du patrimoine sont **co-responsables de traitement**. Une demande d'effacement **anonymise** les données personnelles du locataire pour tous ; baux, paiements et quittances sont conservés (obligation comptable). |
| D-MB-09 | S9 — Historique | Un nouveau co-bailleur voit **tout l'historique** du patrimoine, sans filtre par date d'ajout. |
| D-MB-10 | S10 — Affectations | Les affectations de gestionnaires sont **portées par le patrimoine** : tout co-bailleur les voit, les crée et les révoque. Chaque action est tracée. |
| D-MB-11 | S13 — Audit | Ajout de `acteur_bailleur_id`, distinct du bailleur propriétaire, dans `audit_log`. |
| D-MB-12 | S14 — Membres | Ajout d'un co-bailleur sur **accord d'un membre** (invitation à accepter) ; retrait de soi-même, ou d'un autre membre par le **créateur** ; le dernier membre ne peut pas partir. Toutes les actions sont tracées. |

Conséquences à traiter au plan d'exécution (lots 4 et 5) :

- D-MB-07 : le bail porte un champ `emetteur_bailleur_id` ; revue Financial Governance avant le lot concerné.
- D-MB-08 : `RgpdService` (export et effacement) est à revoir pour la co-responsabilité ; l'anonymisation ne doit jamais supprimer les pièces financières.
- D-MB-10 : `affectation` passe d'une isolation par `bailleur_id` à une isolation par patrimoine ; la migration reprend les affectations existantes sans changer leur périmètre.

## Contexte d'exécution et gestionnaires (correction S3 — règles confirmées par le PO/CDO le 2026-10-14)

**Problème.** Le contexte RLS repose sur un seul GUC, `app.current_bailleur_id`, positionné par `TenantContext.positionner`. Pour un gestionnaire, `activerDepuisBien` résout `bien.bailleur_id` (le créateur) et agit sous son identité (`V4`, `resolve_bien_bailleur`). Avec plusieurs bailleurs, si le créateur n'est plus membre du patrimoine, le gestionnaire agirait sous une identité qui n'a plus accès, ou perdrait l'accès.

**Faits vérifiés.** `Patrimoine.bailleurId` est `updatable = false` (`patrimoine/Patrimoine.java:22`) : le créateur ne change pas. Le GUC reste un **seul** bailleur par transaction.

**Règles retenues** (confirmées telles qu'écrites par le PO/CDO le 2026-10-14) :

1. Le GUC reste un bailleur unique, appelé « bailleur acteur ». Aucun GUC multiple.
2. Pour un gestionnaire, le bailleur acteur est un **membre actif** du patrimoine du bien : le créateur tant qu'il est membre, sinon le membre dont `date_ajout` est la plus ancienne. `resolve_bien_bailleur` est réécrite en ce sens.
3. Le dernier membre d'un patrimoine ne peut pas être retiré.
4. Un membre qui est créateur d'affectations `ACTIVE` ne peut pas être retiré tant que ces affectations n'ont pas été transférées à un autre membre.
5. Une ligne créée par un co-bailleur porte son `bailleur_id` (informatif) ; sa visibilité vient du patrimoine, pas de ce champ.

**Point d'articulation à faire examiner par la revue.** La règle 4 suppose que les affectations appartiennent au bailleur qui les a créées. Avec D-MB-10, elles sont portées par le patrimoine : la règle 4 devient sans objet une fois la migration faite. Elle est conservée telle que confirmée, pour la période de transition et pour les affectations historiques, et le relecteur confirmera si elle peut être retirée.

## Conséquences

- ✅ Modèle conforme au besoin métier (plusieurs bailleurs, plusieurs gestionnaires).
- ✅ La RLS reste le filet de sécurité (ADR-01 couche 2), étendue par l'appartenance au patrimoine.
- ⚠️ Chaque requête sur une table fille appelle `bailleur_est_membre_patrimoine` : prévoir les index (`patrimoine_bailleur(bailleur_id, patrimoine_id)`) et mesurer le coût sur `paiement` et `quittance` (S11).
- ⚠️ `AuthorizationService` (ADR-02) doit résoudre le périmètre à trois niveaux : bailleur co-propriétaire, gestionnaire affecté (ADR-11), locataire visible via bail.
- ⚠️ Migration : un `patrimoine_bailleur` par `patrimoine` existant, avec le bailleur créateur. Aucune donnée n'est perdue.
- ℹ️ **État de production (déclaré par le PO le 2026-10-14, non vérifié en base)** : la version en production ne connaît aucune situation de co-bailleur. Chaque patrimoine existant a donc un seul bailleur, et la migration crée exactement une ligne d'appartenance par patrimoine. Conséquences : la bascule ne change aucun accès existant, et le rollback de niveau 2 (voir ci-dessous) est trivial tant qu'aucun co-bailleur n'a été ajouté. Preuve à produire avant migration : requête en lecture seule confirmant un seul bailleur par patrimoine.
- ⚠️ Les tests d'autorisation doivent couvrir l'accès croisé entre co-bailleurs et l'accès d'un bailleur tiers (objectif 0 accès cross-bailleur non autorisé, ENF-02).

## Rollback (corrigé — S2)

**Correction.** La rédaction initiale affirmait qu'un feature flag `multi_bailleur_enabled` désactivé ramenait la RLS à un fonctionnement strictement par `bailleur_id` créateur. C'est inexact : les policies sont en base, un flag applicatif ne les modifie pas.

Rollback en trois niveaux (la production actuelle n'ayant aucun co-bailleur, la perte de visibilité du niveau 2 ne s'applique qu'une fois des co-bailleurs ajoutés) :

1. **Arrêt de l'extension (flag applicatif).** `multi_bailleur_enabled` désactivé empêche d'ajouter de nouveaux co-bailleurs et masque les écrans de partage. Il ne change **aucune** policy.
2. **Retour à l'état « un seul membre par patrimoine ».** Après export, retirer de `patrimoine_bailleur` toutes les lignes non créateur. La policy par appartenance donne alors le même résultat que l'ancien fonctionnement (seul le créateur est membre). **Décision PO (2026-10-14) : la perte de visibilité est acceptée, sans réattribution.** Les lignes créées par un co-bailleur portent son `bailleur_id` ; elles ne sont **ni supprimées ni réattribuées**. Après le rollback, elles deviennent invisibles du créateur sous l'ancienne policy (elles restent visibles du co-bailleur qui les a créées, pour ses propres données). Garde-fous obligatoires, sans changer cette décision :
   - avant le retrait, un script **en lecture seule** liste les lignes concernées par table (baux, paiements, garanties, quittances, locataires, etc.) et ce rapport est archivé avec le rapport de rollback ;
   - un export de ces lignes est conservé avant retrait ;
   - les quittances émises par un co-bailleur restent valides (numérotation par `bailleur_id`) ; leur invisibilité côté créateur est consignée dans le rapport, pour la Financial Governance.
3. **Migration inverse versionnée** restaurant les policies `bailleur_isolation` d'origine (V1, V12, V20, V22, V24, V27) et les fonctions `SECURITY DEFINER` précédentes. Elle doit être écrite, testée sur une base de test avant la migration directe (test T15 du dossier de revue) et jouée seulement après le niveau 2.

- Données : la table `patrimoine_bailleur` est additive ; la supprimer après la migration inverse ne touche pas aux tables existantes.

## Preuves attendues avant acceptation

- Tests d'autorisation d'accès croisé (positif et négatif) pour chaque table touchée.
- Script de détection en lecture seule : patrimoines sans bailleur créateur, locataires sans bail.
- Revue humaine (sécurité) de la policy RLS, de la fonction `bailleur_est_membre_patrimoine` et de la règle du bailleur acteur.
- Test de la migration inverse sur une base de test (T15 du dossier de revue).

## Gouvernance

- Cet ADR ne vaut pas approbation des lots 4 et 5.
- Décisions D-MB-01 à D-MB-05 prises par le PO/CDO le 2026-10-12.
- Révision du 2026-10-14 : corrections techniques S1 (récursion de policy), S2 (rollback) et règles S3 (bailleur acteur, confirmées). Aucune décision PO antérieure n'est modifiée.
- Décisions complémentaires D-MB-06 à D-MB-12 (S6 à S10, S13, S14) prises par le PO/CDO le 2026-10-14.
- Décision PO du 2026-10-14 : la perte de visibilité après rollback est acceptée (voir §Rollback).
- **Restent ouverts**, tous techniques, à traiter à la revue (dossier de revue §2) : S4 (inventaire des tables, à compléter avec les nouvelles décisions : `alerte`, `affectation`, `quittance`, `audit_log`), S5 (réaudit des fonctions `SECURITY DEFINER`), S11 (performance de la fonction d'appartenance), S12 (vérifier `bien.patrimoine_id NOT NULL`). Ils conditionnent le passage à « Acceptée ».
- Statut à passer en « Acceptée » après revue sécurité humaine et traitement des points ci-dessus. Cette revue n'a pas encore eu lieu.
