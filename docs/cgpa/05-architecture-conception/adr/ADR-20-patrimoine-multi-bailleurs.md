# ADR-20 — Patrimoine multi-bailleurs et visibilité partagée

| Champ | Valeur |
|---|---|
| Statut | **Proposée — en attente de décision PO/CDO** (aucune option retenue) |
| Date | 2026-10-12 |
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

## Décisions à trancher

### D-MB-01 — Table de liaison des bailleurs (recommandé : Option A)

- **Option A (recommandée)** : table `patrimoine_bailleur (patrimoine_id, bailleur_id, role, date_ajout)`, clé composite. `patrimoine.bailleur_id` devient le **bailleur créateur**, informatif, non discriminant.
- **Option B** : tableau `bailleur_ids UUID[]` sur `patrimoine`. Rejetée : pas de contrainte d'intégrité, pas de clé étrangère, pas de traçabilité par bailleur.

### D-MB-02 — Policy RLS sur `patrimoine` (recommandé : Option A)

- **Option A (recommandée)** : `USING (EXISTS (SELECT 1 FROM patrimoine_bailleur pb WHERE pb.patrimoine_id = patrimoine.id AND pb.bailleur_id = current_bailleur))`. La table `patrimoine_bailleur` est elle-même sous RLS (un bailleur voit ses propres lignes et celles de ses co-bailleurs sur ses patrimoines).
- **Option B** : policy par `bailleur_id` créateur + vue `patrimoine_partage` pour les co-bailleurs. Rejetée : deux chemins d'accès à maintenir, risque d'oubli.

### D-MB-03 — Visibilité des tables filles (recommandé : Option A)

Les tables `bien`, `bail`, `paiement`, `garantie`, `quittance` héritent de la visibilité du patrimoine par jointure (`patrimoine_id` ou `bien_id` → `patrimoine`), et non d'un `bailleur_id` propre.

- **Option A (recommandée)** : policy RLS sur chaque table fille par `EXISTS` vers `patrimoine_bailleur`. `bailleur_id` reste en colonne informative (créateur).
- **Option B** : maintenir `bailleur_id` sur chaque table fille avec une copie par bailleur. Rejetée : duplication, incohérence possible à la rotation.

### D-MB-04 — Locataire : propriété et visibilité (à trancher par le PO)

Question ouverte : un locataire lié à un bail sur un patrimoine partagé, qui est son propriétaire ?

- **Option A (recommandée)** : le locataire reste rattaché à un **bailleur créateur**, mais sa visibilité suit les **patrimoines où il a un bail actif ou clos**. Un co-bailleur de ces patrimoines le voit. La modification passe par D3 (approbation).
- **Option B** : locataire rattaché à l'**organisation** (nouveau concept), visible par tous les bailleurs qui partagent un patrimoine où il apparaît. Plus propre, mais impose une migration du modèle locataire.
- **Option C** : un locataire par bailleur (doublons acceptés, rapprochement manuel). Rejetée : contredit l'historique unifié demandé (P3, P5).

### D-MB-05 — Approbation des modifications (D3) (recommandé : Option A)

- **Option A (recommandée)** : une `DemandeModificationLocataire` est créée par le gestionnaire. N'importe quel bailleur du patrimoine concerné peut l'approuver ou la refuser. L'approbateur n'est jamais le demandeur (Q3 du plan). L'approbation s'exécute dans la transaction du bailleur approbateur, avec RLS normale.
- **Option B** : approbation par **tous** les bailleurs. Rejetée par le PO (D3 : un seul suffit).

## Conséquences

- ✅ Modèle conforme au besoin métier (plusieurs bailleurs, plusieurs gestionnaires).
- ✅ La RLS reste le filet de sécurité (ADR-01 couche 2), étendue par `EXISTS`.
- ⚠️ Chaque requête sur une table fille fait une jointure vers `patrimoine_bailleur` : prévoir les index (`patrimoine_bailleur(bailleur_id, patrimoine_id)`).
- ⚠️ `AuthorizationService` (ADR-02) doit résoudre le périmètre à trois niveaux : bailleur co-propriétaire, gestionnaire affecté (ADR-11), locataire visible via bail.
- ⚠️ Migration : un `patrimoine_bailleur` par `patrimoine` existant, avec le bailleur créateur. Aucune donnée n'est perdue.
- ⚠️ Les tests d'autorisation doivent couvrir l'accès croisé entre co-bailleurs et l'accès d'un bailleur tiers (objectif 0 accès cross-bailleur non autorisé, ENF-02).

## Rollback

- Code : feature flag `multi_bailleur_enabled` ; désactivé, la RLS redevient strictement par `bailleur_id` créateur.
- Données : la table `patrimoine_bailleur` est additive ; la supprimer ne touche pas aux tables existantes.

## Preuves attendues avant acceptation

- Tests d'autorisation d'accès croisé (positif et négatif) pour chaque table touchée.
- Script de détection en lecture seule : patrimoines sans bailleur créateur, locataires sans bail.
- Revue humaine (sécurité) de la policy RLS et du `EXISTS`.

## Gouvernance

- Cet ADR ne vaut pas approbation des lots 4 et 5.
- Statut à passer en « Acceptée » uniquement après décision PO/CDO sur D-MB-01 à D-MB-05, et revue sécurité.
