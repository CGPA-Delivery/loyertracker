# US-142 — Stratégie de migration du reste des écrans

> **En tant que** Product Owner, **je veux** un plan de migration explicite pour les écrans restants
> (baux, locataires, gestionnaires, affectations, garanties, honoraires, alertes, quittances, audit)
> **afin d'**éviter une refonte non maîtrisée.

- **Projet :** LoyerTracker
- **EP-17 Lot 6** — cadrage uniquement, aucun développement autorisé
- **Date :** 2026-08-11
- **Dépendance :** US-141 (Gate Staging pilote) — GO / STAGING_DEPLOYED ✅
- **Références :** `component-inventory-loyertracker.md`, `DSG-001.md` v0.2.0, `ADR-UI-001`

---

## 1. État des lieux

### 1.1 Composants déjà migrés (Lots 1-3)

| Composant | Lot | Tokens `--lt-*` | Composants `lt-*` | PrimeNG |
|-----------|-----|:---:|:---:|:---:|
| `locataire-liste` | 3 | ✅ | `lt-data-table` | ✅ |
| `locataire-detail` | 3 | ✅ | `lt-form-field` | `ConfirmationService` |
| `gestionnaire-liste` | 3 | ✅ | `lt-data-table` | ✅ |
| `gestionnaire-detail` | 3 | ✅ | `lt-form-field` | `ConfirmationService` |
| `notifications-preferences` | US-125 | ✅ | — | ✅ |
| `notifications-historique` | US-125 | ✅ | — | ✅ |
| `bailleur/dashboard` | 3 | Partiel | `lt-data-table` | Partiel |
| `gestionnaire/dashboard` | 3 | Partiel | Composants partagés | Partiel |
| `invitation-form` | 3 | ✅ | `lt-form-field` | ✅ |

### 1.2 Composants NON migrés — styles en dur

| Composant | Priorité | Réutilisation | Risque | Classes en dur |
|-----------|:---:|:---:|:---:|---|
| `alertes-liste` | **P0** | 2 dashboards | Moyen | `.panel`, `.panel-head`, `.toolbar`, `.list`, `.row` |
| `garanties-bail` | **P0** | 2 dashboards | **Élevé** (financier) | `.panel`, `.panel-head`, `.toolbar`, `.list`, `.row` |
| `honoraires-bien` | **P0** | 2 dashboards | **Élevé** (financier) | `.panel`, `.panel-head`, `.toolbar`, `.list`, `.row` |
| `paiements-bien` | **P0** | 2 dashboards | **Élevé** (financier, irréversible) | `.panel`, `.panel-head`, `.toolbar`, `.list`, `.row` |
| `audit-journal` | P1 | Unique | Faible | `.panel`, `.panel-head`, `.toolbar`, `.list`, `.row` |
| `navbar` | P1 | Unique | Faible | Couleurs en dur (`#1e293b`, `#334155`, `#38bdf8`) |
| `profil` | P0 | Unique | Moyen | Déjà propre, pas de tokens |
| `verify-receipt` | P2 | Unique | **Élevé** (surface publique) | Radius/breakpoint non alignés (`DD-EP17-09`) |

### 1.3 Bibliothèque de composants `lt-*` disponible (Lot 2)

| Composant | Remplaçant pour |
|-----------|----------------|
| `lt-data-table` | `.list`/`.row` + tableaux manuels |
| `lt-form-field` | `input`/`select`/`textarea` sans wrapper |
| `lt-status-tag` | Badges statut en dur |
| `lt-stat-card` | Cartes statistiques dashboard |
| `lt-page-header` | `.panel-head` + titre |
| `lt-empty-state` | Messages "Aucune entrée" |
| `lt-confirm-dialog` | `window.confirm()` / dialogues inline |
| `lt-toast` | Messages de succès/erreur inline |

---

## 2. Stratégie de découpage

### Principe directeur

**Migration par composant réutilisable, pas par écran.** Les 4 composants P0 (`alertes-liste`, `garanties-bail`, `honoraires-bien`, `paiements-bien`) partagent le même patron CSS (`.panel`/`.panel-head`/`.toolbar`/`.list`/`.row`) et sont réutilisés dans les deux dashboards. Les migrer ensemble réduit la duplication et garantit la cohérence visuelle.

### Lot 6A — Composants réutilisables P0 (8 pts, Must)

| Story | Composant | Points | Dépendance |
|-------|-----------|:---:|---|
| US-143 | `alertes-liste` → `lt-data-table` + `lt-status-tag` + `lt-page-header` | 2 | — |
| US-144 | `paiements-bien` → `lt-data-table` + `lt-form-field` + `lt-confirm-dialog` | 3 | — |
| US-145 | `garanties-bail` → `lt-data-table` + `lt-form-field` + `lt-status-tag` + `lt-confirm-dialog` | 3 | — |
| US-146 | `honoraires-bien` → `lt-data-table` + `lt-confirm-dialog` | 2 | — |

**Livrable** : 4 composants migrés, 2 dashboards automatiquement mis à jour (les composants sont partagés). Suppression des classes `.panel`/`.panel-head`/`.toolbar`/`.list`/`.row` du CSS global.

### Lot 6B — Composants uniques P1 (5 pts, Must)

| Story | Composant | Points | Dépendance |
|-------|-----------|:---:|---|
| US-147 | `audit-journal` → `lt-data-table` + `lt-page-header` | 2 | Lot 6A |
| US-148 | `navbar` → tokens `--lt-*` (couleurs) + `lt-page-header` | 2 | — |
| US-149 | `profil` → `lt-form-field` + tokens `--lt-*` | 1 | — |

**Livrable** : 3 composants migrés, navbar responsive avec tokens, profil aligné DSG.

### Lot 6C — Surface publique + polish (3 pts, Should)

| Story | Composant | Points | Dépendance |
|-------|-----------|:---:|---|
| US-150 | `verify-receipt` → tokens `--lt-*` + `lt-status-tag` (alignement radius/breakpoint) | 2 | Lot 6B |
| US-151 | Nettoyage CSS global : suppression classes `.panel`/`.toolbar`/`.list`/`.row` résiduelles | 1 | Lot 6A |

**Livrable** : surface publique alignée DSG, CSS legacy supprimé.

---

## 3. Récapitulatif

| Lot | Stories | Points | Priorité | Risque |
|-----|---------|:---:|:---:|:---:|
| 6A | US-143→US-146 | 8 | Must | Élevé (financier, régression) |
| 6B | US-147→US-149 | 5 | Must | Faible |
| 6C | US-150, US-151 | 3 | Should | Moyen (surface publique) |
| **Total** | **9 stories** | **16** | — | — |

---

## 4. Règles de migration

1. **Une story = un composant** — PR indépendante, CI complète, merge atomique.
2. **Pas de régression fonctionnelle** — les tests unitaires existants doivent rester verts.
3. **Accessibilité** — chaque story inclut un check axe-core sur le composant migré (dans la limite de ce qui est testable sans parcours OIDC complet).
4. **Tokens uniquement** — toute nouvelle couleur utilise un token `--lt-*` existant ; pas de nouvelle valeur en dur.
5. **Composants `lt-*` uniquement** — pas de nouveau composant sans DDS préalable.
6. **Gate 04A par lot** — chaque lot (6A, 6B, 6C) a son propre Gate 04A avant démarrage.
7. **STG-ISOL-01 + smoke par lot** — le Staging est revalidé après chaque lot.

---

## 5. Dépendances et prérequis

- ✅ US-141 (Gate Staging pilote) — GO
- 🔴 `CHECK-RESPONSIVE-01` (US-137) — à produire avant ou pendant Lot 6A
- 🔴 `CHECK-DESIGN-01` — à produire avant Lot 6A
- 🔴 `DD-EP17-10` (état d'erreur au chargement) — à traiter pendant Lot 6A
- 🔴 `DD-611-02/03` (traçabilité DSG/documentation) — US-139, à traiter avant Lot 6A

---

## 6. Risques

| Risque | Impact | Mitigation |
|--------|:---:|---|
| Régression financière (paiements, garanties, honoraires) | Critique | Smoke Staging complet après chaque PR P0 |
| Duplication de code entre les 4 composants P0 | Moyen | Migration groupée en Lot 6A, revue croisée |
| Surface publique `verify-receipt` | Élevé | Migration en dernier, tests de non-régression spécifiques |
| Dette CSS résiduelle après migration | Faible | US-151 dédiée au nettoyage |

---

## 7. Décision

**Statut : Proposé — À arbitrer par le Product Owner.**

Ce document est un cadrage (US-142, Should, 3 pts). Il n'autorise aucun développement. Le Lot 6 (US-143→US-151, 16 pts) reste un point de contrôle GO/NO GO distinct, subordonné à :
- la validation PO de cette stratégie,
- la clôture des réserves Lot 5 (`CHECK-RESPONSIVE-01`, `CHECK-DESIGN-01`, `DD-EP17-10`, `DD-611-02/03`),
- un Gate 02A/04A distinct pour le Lot 6.
