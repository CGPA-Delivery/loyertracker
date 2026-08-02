# Phase 02 — Maquettes des écrans critiques, EP-17 Lot 3 (Pilote Angular — Patrimoines/Biens)

| Champ | Valeur |
|-------|--------|
| Livrable CGPA | Gate 02A — UX & Design Readiness (`docs/cgpa/gates/gate-02A-ux-design-readiness.md`) |
| Périmètre couvert | EP-17 Lot 3 — section **Patrimoines/Biens** du dashboard Bailleur uniquement (`US-133` restreinte + `US-134`), confirmé Product Owner le 2026-08-02. |
| Statut | **Proposé — premier jet, non validé** |
| Auteur | Claude Code (rédaction assistée) |
| Date | 2026-08-02 |
| Validateurs requis | Product Owner (jptshilombo@gmail.com), UX/UI Design Lead (à désigner) |
| Documents amont | `phase-02-user-journeys-ep17-lot3.md`, `phase-02-information-architecture.md` §1, `DSG-001.md` §Composants, `CHECK-UX-01-ep17-ui-foundation.md` |
| Comble le blocage | `gate-02A-decision-ep17-lot3.md` §4 (« maquettes absentes »), avis UX/UI Design Lead §5 |

> **Niveau de fidélité.** Wireframes texte (fidélité basse), même convention que
> `phase-02-ui-mockups.md`. Les libellés de champs, valeurs de statut et actions reprennent
> exactement les noms réels du code actuel (`dashboard.component.ts`, Bailleur —
> `bienForm`/`patrimoineForm`, `StatutBien`, `Patrimoine`), pour éviter tout écart entre la
> maquette et l'implémentation existante. **Principe directeur de cette migration : substitution de
> présentation uniquement** — chaque champ, action et message ci-dessous existe déjà dans le code
> actuel ; rien n'est ajouté sauf mention explicite « NOUVEAU » (limité à l'état d'erreur du
> chargement, absent aujourd'hui, cf. `phase-02-user-journeys-ep17-lot3.md` §3).

---

## 0. Correspondance composants `lt-*` (Lot 2) ↔ éléments migrés

| Élément actuel | Composant `lt-*` cible | Preuve Lot 2 |
|---|---|---|
| `<div class="panel"><h2>Biens</h2>...` (liste + lignes `.row`) | `lt-data-table` | `frontend/src/app/shared/data-table/` |
| Formulaire `bienForm` (labels + inputs/selects) | `lt-form-field` (par champ) | `frontend/src/app/shared/form-field/` |
| `<span class="badge">{{ bien.statut }}</span>` | `lt-status-tag` (`severityForStatut()`) | `frontend/src/app/shared/status-tag/` |
| `<p class="muted">Aucun bien.</p>` / `Aucun patrimoine.` | `lt-empty-state` | `frontend/src/app/shared/empty-state/` |
| En-tête de section (« Biens », « Patrimoines », toolbar Rafraîchir) | `lt-page-header` (si retenu au niveau section) ou conservé tel quel — décision Gate 04A, pas figée par cette maquette | `frontend/src/app/shared/page-header/` |
| Confirmation d'archivage (`globalThis.confirm()`) | **Non migré dans ce Lot** — préservé tel quel (cf. `phase-02-user-journeys-ep17-lot3.md` §3) | — |

---

## 1. Écran « Biens » — Bailleur (section du dashboard)

### 1.1 État nominal (liste peuplée, aucun bien sélectionné)

```
┌─ Nouveau bien ────────────────────────┐  ┌─ Biens ──────────────────────────────────┐
│                                        │  │  ↻ Rafraîchir                             │
│  Adresse                              │  │                                            │
│  [ ............................. ]    │  │  12 rue des Lilas          [ LOUE ]       │
│                                        │  │  Appartement T3                           │
│  Type                                 │  │  ──────────────────────────────────────   │
│  [ Appartement          ▾ ]           │  │  8 avenue du Parc           [ LIBRE ]     │
│                                        │  │  Maison                                    │
│  Patrimoine                           │  │  ──────────────────────────────────────   │
│  [ Choisir un patrimoine ▾ ]          │  │  3 impasse des Roses        [ EN_TRAVAUX ]│
│                                        │  │  Studio                                    │
│  Statut                               │  │                                            │
│  [ LIBRE                 ▾ ]          │  │                                            │
│                                        │  │                                            │
│  [ Créer ]      [ Nouveau ]           │  │                                            │
└────────────────────────────────────────┘  └────────────────────────────────────────────┘
```

**Annotations**
- Colonne gauche : `lt-form-field` par champ (Adresse, Type, Patrimoine, Statut) — titre du
  formulaire dynamique (« Nouveau bien » / « Modifier le bien »), déjà géré côté logique
  (`bienSelectionne()`), inchangé par la migration.
- Colonne droite : `lt-data-table` — une ligne par bien, colonnes visibles Adresse (fort) + Type
  (secondaire), Statut en `lt-status-tag` (mapping `LIBRE`→info, `LOUE`→success, `EN_TRAVAUX`→
  warning, `ARCHIVE`→neutre — mapping proposé, à confirmer au Gate 04A avec le Design Architect,
  cohérent avec `severityForStatut()` déjà utilisé pour d'autres statuts du produit).
- Sélection d'une ligne : reprend le comportement actuel (`[class.selected]`, `(click)="selectionnerBien"`)
  — pas de nouveau mécanisme d'interaction, seulement un nouveau rendu visuel.
- **Aucun tri ni filtre dans ce premier jet** — même principe que `lt-data-table` en Lot 2 (aucun
  besoin ≥ 2 écrans confirmé), et cohérent avec l'absence de tri/filtre dans le code actuel.

### 1.2 État — bien sélectionné (formulaire pré-rempli, action Archiver visible)

```
┌─ Modifier le bien ─────────────────────┐  ┌─ Biens ──────────────────────────────────┐
│                                        │  │  ↻ Rafraîchir                             │
│  Adresse                              │  │                                            │
│  [ 12 rue des Lilas             ]     │  │ ▶12 rue des Lilas          [ LOUE ]       │  ← sélectionné
│                                        │  │  Appartement T3                           │
│  Type                                 │  │  ──────────────────────────────────────   │
│  [ Appartement          ▾ ]           │  │  8 avenue du Parc           [ LIBRE ]     │
│                                        │  │  ──────────────────────────────────────   │
│  Patrimoine                           │  │  3 impasse des Roses        [ EN_TRAVAUX ]│
│  [ Résidence Lilas       ▾ ]          │  │                                            │
│                                        │  │                                            │
│  Statut                               │  │                                            │
│  [ LOUE                  ▾ ]          │  │                                            │
│                                        │  │                                            │
│  [ Enregistrer ]  [ Nouveau ]         │  │                                            │
│  [ Archiver ce bien ]  (.danger)      │  │                                            │
└────────────────────────────────────────┘  └────────────────────────────────────────────┘
```

**Annotation** : le clic sur « Archiver ce bien » déclenche toujours `globalThis.confirm('Archiver
ce bien ?')` — **non migré dans ce Lot** (cf. §0). La maquette ne montre pas ce dialogue natif : il
reste hors du système de design `lt-*` pour cette itération, décision explicite, pas un oubli.

### 1.3 État vide (aucun bien créé)

```
┌─ Nouveau bien ────────────────────────┐  ┌─ Biens ──────────────────────────────────┐
│  (formulaire vide, identique à 1.1)   │  │  ↻ Rafraîchir                             │
│                                        │  │                                            │
│                                        │  │       Aucun bien.                         │
│                                        │  │                                            │
└────────────────────────────────────────┘  └────────────────────────────────────────────┘
```

Reprend `lt-empty-state` avec le texte exact déjà en production (« Aucun bien. ») — aucune
reformulation, cohérent avec le principe de substitution de présentation.

### 1.4 État erreur au chargement (NOUVEAU — absent du code actuel, cf. §3 du parcours écrit)

```
┌─ Nouveau bien ────────────────────────┐  ┌─ Biens ──────────────────────────────────┐
│  (formulaire vide, identique à 1.1)   │  │  ↻ Rafraîchir                             │
│                                        │  │                                            │
│                                        │  │  ⚠ Impossible de charger vos biens.      │
│                                        │  │     [ Réessayer ]                         │
│                                        │  │                                            │
└────────────────────────────────────────┘  └────────────────────────────────────────────┘
```

**Annotation** : variante erreur de `lt-empty-state`, déjà livrée en Lot 2. Le libellé exact et le
bouton « Réessayer » (rappelant `chargerBiens()`, méthode déjà existante) restent à valider avec le
Product Owner — premier texte d'erreur utilisateur pour cette section, candidat à une revue de
contenu légère au Gate 04A, pas une DDS séparée (peu de risque, cohérent avec les messages d'erreur
déjà en place ailleurs dans le produit).

---

## 2. Écran « Patrimoines » — Bailleur (section du dashboard)

### 2.1 État nominal (liste peuplée, aucun patrimoine en modification)

```
┌─ Modifier un patrimoine ───────────────┐  ┌─ Patrimoines ─────────────────────────────┐
│                                        │  │                                            │
│  Patrimoine                           │  │  Résidence Lilas                          │
│  [ Choisir un patrimoine ▾ ]          │  │  12 rue des Lilas, Paris, France           │
│                                        │  │  Réf. RES-LILAS-01           [ ACTIF ]    │
│  (formulaire masqué tant qu'aucun     │  │  ──────────────────────────────────────   │
│   patrimoine n'est choisi)            │  │  Domaine du Parc                          │
│                                        │  │  8 avenue du Parc, Lyon, France             [ ACTIF ]    │
│                                        │  │                                            │
└────────────────────────────────────────┘  └────────────────────────────────────────────┘
```

### 2.2 État — patrimoine sélectionné (formulaire complet)

```
┌─ Modifier un patrimoine ───────────────┐  ┌─ Patrimoines ─────────────────────────────┐
│                                        │  │                                            │
│  Patrimoine                           │  │ ▶Résidence Lilas            [ ACTIF ]     │  ← sélectionné
│  [ Résidence Lilas — 12 rue... ▾ ]    │  │  12 rue des Lilas, Paris, France           │
│                                        │  │  Réf. RES-LILAS-01                        │
│  Nom                                  │  │  ──────────────────────────────────────   │
│  [ Résidence Lilas              ]     │  │  Domaine du Parc            [ ACTIF ]     │
│  Adresse                              │  │  8 avenue du Parc, Lyon, France             │
│  [ 12 rue des Lilas              ]    │  │                                            │
│  Ville          [ Paris          ]    │  │                                            │
│  Commune        [ .............. ]    │  │                                            │
│  Quartier       [ .............. ]    │  │                                            │
│  Province/État  [ .............. ]    │  │                                            │
│  Pays           [ France         ]    │  │                                            │
│  Référence interne                    │  │                                            │
│  [ RES-LILAS-01                  ]    │  │                                            │
│  Description                          │  │                                            │
│  [ ............................. ]    │  │                                            │
│                                        │  │                                            │
│  [ Modifier ]                         │  │                                            │
└────────────────────────────────────────┘  └────────────────────────────────────────────┘
```

**Annotation** : 9 champs `lt-form-field`, tous facultatifs sauf ceux déjà requis par le
`FormGroup` actuel (validation inchangée, migration de présentation uniquement). Aucune action de
création ni de suppression de patrimoine — absente de l'interface actuelle (§3 du parcours écrit).

### 2.3 État vide (aucun patrimoine créé)

```
┌─ Modifier un patrimoine ───────────────┐  ┌─ Patrimoines ─────────────────────────────┐
│  Patrimoine                           │  │                                            │
│  [ Choisir un patrimoine ▾ ]          │  │       Aucun patrimoine.                   │
│  (désactivé, aucune option)           │  │                                            │
└────────────────────────────────────────┘  └────────────────────────────────────────────┘
```

### 2.4 État erreur au chargement (NOUVEAU — même constat qu'en §1.4)

```
┌─ Modifier un patrimoine ───────────────┐  ┌─ Patrimoines ─────────────────────────────┐
│  (sélecteur désactivé)                │  │  ⚠ Impossible de charger vos patrimoines. │
│                                        │  │     [ Réessayer ]                         │
└────────────────────────────────────────┘  └────────────────────────────────────────────┘
```

---

## 3. Variante responsive (< 640px, `DSG-001.md` §Responsive Rules, breakpoint déjà en place)

```
┌─ Biens ────────────────┐
│ ↻ Rafraîchir            │
│                        │
│ 12 rue des Lilas       │
│ Appartement T3         │
│ [ LOUE ]               │
│ ──────────────────     │
│ 8 avenue du Parc       │
│ Maison                 │
│ [ LIBRE ]              │
│                        │
│ ── Modifier le bien ── │
│ Adresse                │
│ [ ............. ]      │
│ Type                   │
│ [ Appartement    ▾ ]   │
│ Patrimoine             │
│ [ Résidence Lilas ▾ ]  │
│ Statut                 │
│ [ LOUE           ▾ ]   │
│ [ Enregistrer ]        │
│ [ Nouveau ]            │
│ [ Archiver ce bien ]   │
└────────────────────────┘
```

Empilement vertical simple (liste au-dessus du formulaire), cohérent avec le patron déjà appliqué
en §5 de `phase-02-ui-mockups.md` — la liste passe avant le formulaire en mobile pour laisser le
contexte de sélection visible avant l'action d'édition, ordre inverse de la disposition bureau
(formulaire à gauche). Ce choix d'ordre reste une proposition à confirmer au Gate 04A, pas une
règle déjà tranchée par le breakpoint lui-même.

---

## 4. Accessibilité — annotations transverses

- Chaque section (« Biens », « Patrimoines ») porte un titre `<h2>` explicite, repère de navigation
  pour lecteur d'écran — déjà en place dans le code actuel, inchangé par la migration.
- Les messages de confirmation (« Bien créé », « Bien modifié », « Bien archivé ») utilisent le
  `role="status" aria-live="polite"` déjà en place (`<span role="status">{{ message() }}</span>`,
  toolbar globale de la section) — aucun nouveau mécanisme.
- L'état d'erreur au chargement (§1.4/§2.4, nouveau) doit porter `role="alert"` ou
  `aria-live="assertive"` (contrairement au statut neutre), cohérent avec la sévérité « erreur » de
  `lt-empty-state` déjà définie en Lot 2 — à vérifier explicitement au Gate 04A, pas supposé par
  cette maquette.
- Le bouton « Archiver ce bien » reste un `<button class="danger">` natif avec `confirm()` du
  navigateur — son accessibilité (annonce du dialogue natif par le lecteur d'écran) est déléguée au
  navigateur, non modifiée par ce Lot, non couverte par `DDS-LT-005` (qui porte spécifiquement sur
  `lt-confirm-dialog`, non utilisé ici).

---

## 5. Traçabilité

- Parcours : `phase-02-user-journeys-ep17-lot3.md` (J-Lot3-1 §1.1-1.4, J-Lot3-2 §2.1-2.4).
- Information architecture : `phase-02-information-architecture.md` §1 (emplacement de la section
  dans `/bailleur`, inchangé).
- Composants : `DSG-001.md` §Component Mapping ; correspondance détaillée en §0 de ce document.
- Dette ajoutée par ce document : absence d'état d'erreur de chargement dans le code actuel
  (§1.4/§2.4) — à tracer dans `design-debt-register-loyertracker.md` si le Product Owner souhaite
  la formaliser au-delà de cette maquette, ou à traiter directement comme une amélioration de la
  Story `US-133`/`US-134` elle-même.
