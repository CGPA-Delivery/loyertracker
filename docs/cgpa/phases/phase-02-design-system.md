# Phase 02 — Design System (socle minimal)

| Champ | Valeur |
|-------|--------|
| Livrable CGPA | Gate 02A — UX & Design Readiness (`docs/cgpa/gates/gate-02A-ux-design-readiness.md`) |
| Périmètre couvert | US-125 — Interface de préférences et historique des notifications (EP-16, Sprint N+2 Lot B) |
| Statut | **Proposé — premier jet, non validé** |
| Auteur | Claude Code (rédaction assistée) |
| Date | 2026-07-30 |
| Validateurs requis | Design Architect (à désigner), UX/UI Design Lead (à désigner) |
| Documents amont | `phase-02-user-journeys.md`, `phase-02-information-architecture.md` |
| Registre de dette lié | `DD-611-02` (DDS-001/DSG-001/inventaire composants non instanciés) |

> **Portée et limite de ce document.** Le Gate 02A exige un « design system validé » — au niveau
> minimal proportionné à l'entrée en architecture, pas le DSG-001 complet exigé au Gate 04A
> (Atomic Design intégral, tous composants, dark/light explicites, motion, etc. —
> `docs/cgpa/design/DSG-001.md`, toujours un gabarit vide). Ce document **reconstitue** le socle
> visuel qui existe déjà de facto dans le code (jamais documenté formellement) et l'étend au strict
> nécessaire pour les deux nouveaux composants d'US-125. Il ne remplace pas DSG-001 ; il en
> constitue une première matière, à charge du Design Architect de l'instancier formellement au
> Gate 04A.

---

## 1. Constat — aucun design system documenté, mais un style cohérent de facto

Recherche exhaustive dans `frontend/src/styles.scss` et les blocs `styles: [...]` des composants
existants (`dashboard.component.ts` bailleur/gestionnaire, `alertes-liste`, `audit-journal`,
`garanties-bail`, `paiements-bien`, `honoraires-bien`, `verify-receipt`) : aucun token nommé,
aucune variable CSS (`:root { --... }`), aucune bibliothèque de composants — chaque composant
répète les mêmes valeurs hexadécimales en dur. La cohérence visuelle observée est réelle mais
**non garantie structurellement** : c'est exactement le constat DD-611-02.

## 2. Tokens reconstitués (valeurs réellement utilisées, comptage sur le code)

### Couleurs — fond, surface, texte

| Rôle sémantique proposé | Valeur observée | Occurrences | Usage actuel |
|---|---|---|---|
| `color-background` | `#0f172a` | 15 | fond de page, fond des champs input/select |
| `color-surface` (panel) | `#111827` | 7 | fond des blocs `.panel` |
| `color-border` | `#334155` | 24 | bordures panels, champs, boutons, séparateurs |
| `color-text` (primaire) | `#e2e8f0` | 13 | texte principal, boutons |
| `color-text-muted` | `#94a3b8` | 11 | labels secondaires, `.muted`, horodatages |
| `color-text-subtle` | `#cbd5e1` | 7 | libellés de formulaire, rôle/entité (audit) |

### Couleurs — accent et statuts sémantiques

| Rôle sémantique proposé | Valeur observée | Occurrences | Usage actuel |
|---|---|---|---|
| `color-accent` / focus | `#38bdf8` | 7 | anneau de focus (`:focus-visible`), bordure sélectionnée |
| `color-info` | `#bae6fd` | 7 | badges neutres (type d'alerte par défaut, action d'audit) |
| `color-danger` | `#fecaca` | 6 | badge `LOYER_EN_RETARD`, erreurs de champ (`.field-error`) |
| `color-warning` | `#fde68a` | 5 | badge `PREAVIS` |
| `color-success` (famille verte) | `#bbf7d0` / `#065f46` / `#047857` / `#ecfdf5` | 2 chacun | badges de statut positif (paiements, garanties, honoraires, quittance vérifiée) |
| `color-danger-strong` (bordure) | `#7f1d1d` | 1 | `.danger` (bordure de zone à risque) |

> Ces couleurs ne sont **pas exhaustives sur tout le dépôt** (chaque composant a sa propre palette
> légèrement variée pour les statuts positifs, ex. `#a7f3d0`, `#b42318`, `#91180f`) — signe
> supplémentaire de l'absence de tokens partagés, déjà consigné en DD-611-02. Ce document retient
> la variante la plus fréquente par rôle sémantique ; l'harmonisation complète relève du Gate 04A.

### Typographie

- Famille : `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` (aucune police custom
  chargée — pas de dépendance de chargement de police à couvrir en performance).
- Aucune échelle typographique nommée : tailles observées en dur (`0.85rem`, `0.9rem`), `h1`/`h2`
  sans taille explicite (héritage navigateur), `margin-top: 0` systématique sur `h1`/`h2`/`p`.

### Spacing, radius, layout

- Échelle d'espacement observée : `0.35rem`, `0.4rem`, `0.5rem`, `0.6rem`, `0.75rem`, `0.8rem`,
  `0.9rem`, `1rem`, `1.5rem` — pas de suite normalisée, valeurs choisies au cas par cas.
- Rayon de bordure constant : `6px` sur tous les panels, champs, boutons, badges de ligne.
- Grille : `.grid.two` = `repeat(auto-fit, minmax(280px, 1fr))` — seul patron de grille observé.
- Conteneur global : `max-width: 960px` centré, padding `1.5rem` (`1rem` sous 640px).

### Focus, accessibilité minimale déjà en place

- `:focus-visible` global : anneau `3px solid #38bdf8`, `outline-offset: 2px` — appliqué à
  `a`/`button`/`input`/`select`.
- `.skip-link` : lien d'évitement présent globalement (`styles.scss`), visible au focus clavier.
- `@media (prefers-reduced-motion: reduce)` : transitions neutralisées globalement.
- Messages de statut : patron `role="status" aria-live="polite" aria-atomic="true"` déjà utilisé
  (ex. `dashboard.component.ts` bailleur, `profil.component.ts`).

### Mode sombre / clair

`color-scheme: light dark` est déclaré, mais `body` fixe un fond sombre non conditionnel
(`background: #0f172a`) : **il n'existe aujourd'hui aucun thème clair réel ni bascule** — l'app est
mono-thème sombre de fait. Ce n'est pas un manque à combler par US-125 (hors périmètre, 8 points,
priorité *Should*) ; à consigner comme limite connue plutôt que régression à corriger ici.

---

## 3. Composants existants réutilisables pour US-125 (Atomic Design — niveau minimal)

| Patron | Précédent(s) dans le code | Réutilisation prévue |
|---|---|---|
| `.panel` + `.panel-head` (titre + message d'état) | `AlertesListeComponent`, `AuditJournalComponent` | Conteneur des deux nouveaux composants (Préférences, Historique) |
| `.toolbar` (bouton Rafraîchir + actions conditionnelles) | idem | Bouton « Rafraîchir » sur l'historique ; pas d'action de génération (n/a ici) |
| `.list` / `.row` (liste de lignes uniformes) | `AlertesListeComponent`, `AuditJournalComponent` | Liste des notifications de l'historique (une ligne par notification) |
| Badge coloré par attribut (`[attr.data-type]`) | `.type[data-type='LOYER_EN_RETARD']` etc. | Badge de statut de livraison (`PROCESSED`/`DELIVERED`/`DEAD`…), mapping proposé §4 |
| État vide (`<p class="muted">Aucun…</p>`) | `AlertesListeComponent` (« Aucune alerte non lue »), `AuditJournalComponent` (« Aucune entrée ») | « Aucune notification externe envoyée » (cf. J2/J3, cas d'erreur) |
| Formulaire (`label` + `input`/`select` + bouton + `.field-help`/`.field-error`) | `bienForm` (dashboard bailleur), `ProfilComponent` | Formulaire des préférences (numéro, canal, opt-in) |
| Message de statut accessible | `role="status" aria-live="polite"` | Confirmation d'enregistrement des préférences, effet de la désinscription (J1) |

**Aucun nouveau primitif visuel n'est nécessaire pour ce lot** : les deux composants d'US-125
peuvent être entièrement construits avec le vocabulaire déjà en place, ce qui limite la dette
introduite — cohérent avec la dette déjà ouverte (DD-611-02) qu'il ne faut pas aggraver.

---

## 4. Mapping proposé — statuts de livraison de notification

Aucun badge de statut « succès » cohérent n'existe à ce jour dans un seul composant central (la
famille verte est dupliquée avec des valeurs légèrement différentes selon paiements/garanties/
honoraires/quittance). Proposition pour l'historique des notifications, à valider en DDS au Gate
04A avant implémentation :

| Statut `NotificationDelivery` | Rôle sémantique | Couleur proposée |
|---|---|---|
| `DELIVERED` | success | `#bbf7d0` (variante la plus fréquente de la famille verte) |
| `PROCESSED` / `PENDING` | info | `#bae6fd` (déjà utilisé comme badge neutre) |
| `DEAD` / `FAILED` | danger | `#fecaca` (déjà utilisé pour `LOYER_EN_RETARD` et les erreurs de champ) |
| (réservé, si introduit plus tard) avertissement de retry | warning | `#fde68a` (déjà utilisé pour `PREAVIS`) |

---

## 5. Point de vigilance — pas de précédent de filtre/pagination

Les deux seules listes transverses existantes (`AlertesListeComponent`, `AuditJournalComponent`)
sont **volontairement non filtrées et non paginées** (« liste brute la plus récente d'abord, sans
filtre ni pagination », commentaire explicite du code sur l'audit — décision de Plan d'Exécution
antérieure). Les user journeys J2/J3 (`phase-02-user-journeys.md`) envisagent des filtres (bien,
destinataire, statut, période) pour l'historique des notifications : **ce serait le premier
composant filtrable/paginé du dépôt**, une extension du vocabulaire de composants, pas une simple
réutilisation. Deux options, à trancher au Gate 04A (DDS) plutôt que par ce document :

- **Aligner sur le précédent minimal** : liste brute la plus récente d'abord, sans filtre, pour
  cette première itération — cohérent avec la priorité *Should* et le format déjà accepté deux fois
  (alertes, audit).
- **Introduire un filtre minimal** (a minima par statut) si le volume attendu de notifications
  rend la liste brute inexploitable — à justifier par une estimation de volume réelle avant Gate
  04A, pas par défaut.

---

## 6. Traçabilité

- User journeys : `phase-02-user-journeys.md` (J1 → formulaire de préférences ; J2/J3 → historique).
- Information architecture : `phase-02-information-architecture.md` (emplacement des deux blocs).
- Registre de dette : `DD-611-02` — ce document ne le clôture pas (DSG-001 reste à instancier
  formellement par le Design Architect) mais lui fournit une matière de départ.
- Décision ouverte reportée au Gate 04A : mapping des statuts de livraison (§4), filtre/pagination
  de l'historique (§5).
