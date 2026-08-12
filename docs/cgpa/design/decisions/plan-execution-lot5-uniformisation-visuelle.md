# Plan d'Exécution — Lot 5 : Uniformisation visuelle (5 dettes Design)

| Champ | Valeur |
|---|---|
| Date | 2026-08-12 |
| Auteur | CDO / Enterprise Architect |
| Dettes | DD-EP17-04, DD-EP17-06, DD-EP17-07, DD-EP17-09, DD-EP17-11 |
| Criticité | P2 |
| Statut | **Plan proposé — en attente de validation PO/CDO** |

---

## 1. Contexte

Cinq dettes Design de criticité Mineur, toutes liées à l'uniformisation visuelle et à la qualité du code frontend. Aucune n'est bloquante pour la Production, mais leur résolution améliore la maintenabilité et la cohérence du produit.

---

## 2. Dettes concernées

| ID | Constat | Statut actuel |
|---|---|---|
| DD-EP17-04 | Hétérogénéité composants (`.panel`/`.list` dupliqués) | Partiellement traité — 2 emplacements restants |
| DD-EP17-06 | Spacing non normalisé | Partiellement traité — tokens définis, non adoptés |
| DD-EP17-07 | Aucun `data-testid` | Ouvert |
| DD-EP17-09 | `VerifyReceiptComponent` hors breakpoint/radius | Ouvert |
| DD-EP17-11 | Touch targets `button` < 44×44px | Ouvert — `min-height: 44px` déjà présent dans `_button.scss` |

---

## 3. Solution proposée

### 3.1 DD-EP17-04 — Finaliser l'adoption de `lt-data-table`

| Étape | Action |
|---|---|
| 1 | Migrer `AlertesListeComponent` vers `lt-data-table` |
| 2 | Migrer `AuditJournalComponent` vers `lt-data-table` |
| 3 | Migrer le dashboard Gestionnaire vers `lt-data-table` |

### 3.2 DD-EP17-06 — Adopter les tokens de spacing

| Étape | Action |
|---|---|
| 1 | Audit des valeurs de spacing hardcodées (`px`, `rem`) |
| 2 | Remplacer par les tokens `--lt-space-*` définis |
| 3 | Vérifier la non-régression visuelle |

### 3.3 DD-EP17-07 — Ajouter `data-testid`

| Étape | Action |
|---|---|
| 1 | Définir une convention de nommage (`data-testid="<page>-<element>"`) |
| 2 | Ajouter sur les composants critiques (formulaires, boutons, tableaux) |
| 3 | Mettre à jour les tests Playwright pour utiliser `data-testid` |

### 3.4 DD-EP17-09 — Harmoniser `VerifyReceiptComponent`

| Étape | Action |
|---|---|
| 1 | Remplacer `@media (max-width: 560px)` par le breakpoint standard `640px` |
| 2 | Remplacer les `border-radius` ad hoc par `--lt-radius-*` |
| 3 | Vérifier la non-régression du QR code et de l'impression |

### 3.5 DD-EP17-11 — Vérifier les touch targets

| Étape | Action |
|---|---|
| 1 | Mesure navigateur réel des boutons (Chrome Headless) |
| 2 | Si `min-height: 44px` déjà effectif → clôture documentaire |
| 3 | Sinon → ajustement ciblé + test |

---

## 4. Tâches

| # | Tâche | Effort |
|---|---|---|
| 1 | Migrer les 3 composants restants vers `lt-data-table` (DD-EP17-04) | 1 j |
| 2 | Audit + adoption des tokens de spacing (DD-EP17-06) | 0,5 j |
| 3 | Ajout `data-testid` + mise à jour tests Playwright (DD-EP17-07) | 1 j |
| 4 | Harmoniser `VerifyReceiptComponent` (DD-EP17-09) | 0,5 j |
| 5 | Vérification touch targets + clôture (DD-EP17-11) | 0,3 j |
| 6 | Tests de non-régression visuelle | 0,5 j |
| 7 | Mise à jour Design Debt Register | 0,2 j |

**Total estimé** : 3-5 jours.

---

## 5. Décision

**GO proposé** — sous réserve de validation PO/CDO. Ce lot est le moins prioritaire (P2) et peut être exécuté en parallèle ou après les Lots 1-4.
