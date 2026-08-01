# DDS-LT-006 — Validation visuelle des Design Tokens LoyerTracker (US-129)

> Instance projet d'une Design Decision Specification, même convention que `DDS-LT-001→005`.
> Formalise la revue visuelle/contraste exigée par le critère GWT de `US-129`
> (`addendum-backlog-ep17-ui-foundation-primeng-keycloak.md`) : « les valeurs candidates … sont
> revues et validées visuellement par le Design Architect ». Produit par Claude Code en tant que
> **Design Architect désigné** (`agent-designations-loyertracker.md`) — **limite d'indépendance
> inchangée** : l'auteur de cette revue est aussi l'auteur des valeurs candidates revues
> (`DSG-001.md` v0.1.0, instanciées le 2026-07-30 par ce même rôle). Une validation Product Owner
> explicite reste requise avant tout usage en Production, conformément à `CLAUDE.md`.

## Métadonnées

| Champ | Valeur |
|---|---|
| Identifiant | DDS-LT-006 |
| Titre | Validation visuelle et vérification de contraste WCAG 2.2 AA des Design Tokens LoyerTracker |
| Statut | **Acceptée** — validation Product Owner explicite obtenue le 2026-08-01 (« Accepted, both corrections approved ») |
| Date | 2026-08-01 |
| Responsable | Design Architect — Claude Code, sous-agent CGPA désigné le 2026-07-30 |
| Version DSG | `DSG-001.md` v0.1.0 |
| Product Owner | jptshilombo@gmail.com — validation requise avant clôture de `US-129` |
| Documents amont | `DSG-001.md` §Fondations (Palette et couleurs, Typographie, Spacing/Grid/Breakpoints, Elevation/Shadow/Radius, Tokens, Motion), `ADR-UI-001` §Architecture des Design Tokens |

## Contexte

`US-129` (Lot 1 du Plan d'Exécution) exige que les 13 tokens candidats de `DSG-001.md` §Palette et
couleurs — reconstitués par comptage réel du code, jamais validés visuellement — soient revus et
validés, et que les **13 catégories de tokens** retenues par `ADR-UI-001` (`color`, `surface`,
`text`, `border`, `spacing`, `size`, `typography`, `radius`, `shadow`, `z-index`, `motion`,
`breakpoint`, `focus`, `state`) soient couvertes ou explicitement différées avec justification,
avant production d'un fichier de tokens versionné.

## Méthode

Revue en deux temps :

1. **Vérification de contraste WCAG 2.2** (calcul de luminance relative + ratio de contraste,
   formule W3C — outil déterministe, pas une appréciation subjective) pour chaque token de couleur
   contre les deux surfaces existantes (`--lt-surface-page` `#0f172a`, `--lt-surface-card`
   `#111827`), avec le seuil applicable à son usage réel constaté dans le code (texte = 4.5:1 [SC
   1.4.3] ; bordure/indicateur d'UI = 3:1 [SC 1.4.11]). Les couleurs `state-*` sont vérifiées
   comme **texte**, pas comme fond de badge : lecture directe du code (`bailleur/dashboard`,
   `garanties-bail`, `honoraires-bien`, `paiements-bien`, `alertes-liste`, `audit-journal`,
   `gestionnaire/dashboard`) confirme un usage systématique en `color:` sur les deux surfaces
   sombres, jamais en `background-color:` d'un badge à texte foncé.
2. **Proposition de valeurs candidates** pour les catégories de `ADR-UI-001` non encore couvertes
   par `DSG-001.md` (`spacing`, `size`, `typography`, `z-index`, `breakpoint`, `focus`), dérivées
   des valeurs déjà observées dans le code existant quand elles existent, ou de standards neutres
   sinon — jamais de valeurs arbitraires sans ancrage. `shadow` et `motion` restent **différés
   explicitement** : aucun besoin réel constaté à ce jour (`DSG-001.md` §Elevation/Shadow, §Motion),
   cohérent avec le principe de sobriété (`DSG-001.md` §Principes).

## Résultats — contraste des 13 tokens de couleur

| Token | Valeur | Usage réel | Ratio vs `page` | Ratio vs `card` | Seuil requis | Résultat |
|---|---|---|---|---|---|---|
| `--lt-text-primary` | `#e2e8f0` | Texte principal | 14.48:1 | 14.39:1 | 4.5:1 | **Conforme** |
| `--lt-text-muted` | `#94a3b8` | Texte secondaire | 6.96:1 | 6.92:1 | 4.5:1 | **Conforme** |
| `--lt-text-subtle` | `#cbd5e1` | Libellés | 12.02:1 | 11.95:1 | 4.5:1 | **Conforme** |
| `--lt-focus-ring` | `#38bdf8` | Anneau de focus | 8.33:1 | 8.28:1 | 3:1 | **Conforme** |
| `--lt-state-info` | `#bae6fd` | Texte badges neutres | 13.45:1 | 13.37:1 | 4.5:1 | **Conforme** |
| `--lt-state-danger` | `#fecaca` | Texte erreurs | 12.34:1 | 12.26:1 | 4.5:1 | **Conforme** |
| `--lt-state-warning` | `#fde68a` | Texte avertissements | 14.33:1 | 14.24:1 | 4.5:1 | **Conforme** |
| `--lt-state-success` | `#bbf7d0` | Texte statuts positifs | 14.73:1 | 14.64:1 | 4.5:1 | **Conforme** |
| `--lt-border-default` | `#334155` | Bordures panels/champs/boutons | **1.72:1** | **1.71:1** | 3:1 | **Non conforme** |
| `--lt-state-danger-strong` | `#7f1d1d` | Bordure de zone à risque | **1.78:1** | **1.77:1** | 3:1 | **Non conforme** |
| `--lt-color-background` | `#0f172a` | Fond de page (= surface) | — | — | — | Sans objet (surface de référence) |
| `--lt-surface-page` | `#0f172a` | idem | — | — | — | Sans objet |
| `--lt-surface-card` | `#111827` | idem | — | — | — | Sans objet |

**11 des 13 tokens sont conformes tels quels.** Deux échouent au seuil non-texte de 3:1 (SC 1.4.11,
« Non-text Contrast ») : `--lt-border-default` et `--lt-state-danger-strong`, tous deux utilisés
comme couleur de **bordure** — une frontière de composant d'interface (champ, bouton, panel « zone
à risque ») que WCAG 1.4.11 exige perceptible à 3:1 minimum contre son fond.

## Correction proposée

| Token | Valeur actuelle | Valeur proposée | Ratio vs `page` | Ratio vs `card` | Famille |
|---|---|---|---|---|---|
| `--lt-border-default` | `#334155` (slate-700) | `#64748b` (slate-500) | 3.75:1 | 3.73:1 | Même famille slate, deux crans plus clairs |
| `--lt-state-danger-strong` | `#7f1d1d` (red-900) | `#dc2626` (red-600) | 3.70:1 | 3.67:1 | Même famille red, trois crans plus clairs |

Les deux valeurs proposées appartiennent à la même famille chromatique Tailwind que l'ensemble de
la palette déjà candidatée (`slate`/`sky`/`red`/`amber`/`green`) — cohérence de système préservée,
pas de rupture de langage visuel.

## Catégories de tokens non encore couvertes — candidats proposés

| Catégorie | Tokens proposés | Dérivation |
|---|---|---|
| `spacing` | `--lt-space-3xs: 0.25rem`, `--lt-space-2xs: 0.35rem`, `--lt-space-xs: 0.5rem`, `--lt-space-sm: 0.75rem`, `--lt-space-md: 1rem`, `--lt-space-lg: 1.5rem`, `--lt-space-xl: 2rem` | Bornes basse (`0.35rem`) et haute (`1.5rem`) reprises telles quelles de l'échelle observée (`DSG-001.md` §Spacing) ; échelle intermédiaire normalisée sur un pas de 4px, standard neutre |
| `typography` | `--lt-font-size-xs: 0.75rem`, `--lt-font-size-sm: 0.85rem`, `--lt-font-size-base: 0.9rem`, `--lt-font-size-md: 1rem`, `--lt-font-size-lg: 1.125rem`, `--lt-font-size-xl: 1.5rem` ; `--lt-font-weight-regular: 400`, `--lt-font-weight-medium: 500`, `--lt-font-weight-semibold: 600` ; `--lt-line-height-tight: 1.25`, `--lt-line-height-normal: 1.5` | `0.85rem`/`0.9rem` et le poids `600` sont les valeurs en dur déjà observées dans le code (`DSG-001.md` §Typographie) ; échelle complétée symétriquement, famille de police inchangée |
| `size` | `--lt-control-height-sm: 32px`, `--lt-control-height-md: 40px`, `--lt-control-height-lg: 44px` | `44px` reprend explicitement le seuil de touch target déjà exigé (`DSG-001.md` §Responsive Rules, « cible ≥ 44×44px ») |
| `z-index` | `--lt-z-dropdown: 1000`, `--lt-z-sticky: 1100`, `--lt-z-modal-backdrop: 1200`, `--lt-z-modal: 1300`, `--lt-z-toast: 1400` | Échelle par paliers de 100, ordre dicté par les superpositions attendues (dropdown < sticky < backdrop < modal < toast), aucune valeur en dur constatée à normaliser (première introduction) |
| `breakpoint` | `--lt-breakpoint-mobile: 640px` | Formalise la référence déjà en usage sur 10/11 composants (`DSG-001.md` §Spacing/Grid/Breakpoints) |
| `focus` | `--lt-focus-ring-width: 3px`, `--lt-focus-ring-style: solid` (couleur = `--lt-focus-ring` déjà existant) | Formalise le patron déjà en place (`DSG-001.md` §Accessibilité, « anneau 3px solid #38bdf8 ») |
| `radius` | Inchangé — `--lt-radius-default: 6px` déjà candidat (`DSG-001.md` §Elevation), conservé tel quel | — |
| `shadow` | **Différé explicitement** | Aucune ombre portée utilisée à ce jour (`DSG-001.md` §Elevation) ; à définir seulement si un besoin réel apparaît (ex. `lt-detail-drawer` flottant) |
| `motion` | **Différé explicitement** | Aucune nouvelle animation prévue à ce jour (`DSG-001.md` §Motion) ; durées/easing à normaliser uniquement si introduites |

## Ce que cette revue ne couvre pas

* La conformité des **futurs** composants PrimeNG une fois installés (US-130) — cette revue porte
  uniquement sur les tokens en tant que valeurs, pas sur leur rendu réel dans un composant PrimeNG
  ni sur l'accessibilité clavier/ARIA des composants eux-mêmes (`CHECK-ACCESSIBILITY-01` distinct).
* Le mode clair (`Light Mode`), hors périmètre du premier lot (`DSG-001.md` §Light Mode).
* Une revue humaine indépendante (même limite d'indépendance que `DSG-001.md`/`DDS-LT-001` : cette
  revue est produite par le même rôle qui a candidaté les valeurs initiales).

## Conséquences positives

* Ferme la seule non-conformité WCAG 1.4.11 identifiée dans la palette avant tout usage en
  Production — corrigée avant, plutôt qu'après, l'installation de PrimeNG (US-130).
* Livre un jeu de tokens complet sur les 13 catégories de `ADR-UI-001`, condition d'entrée du
  fichier de tokens versionné exigé par `US-129`.

## Conséquences négatives

* Deux valeurs de bordure changent de teinte perceptible (`#334155`→`#64748b`,
  `#7f1d1d`→`#dc2626`) — impact visuel à valider par le Product Owner avant tout remplacement des
  24 occurrences en dur déjà présentes dans le code (hors périmètre de `US-129`, relève de la
  migration écran par écran des Lots 2+).

## Alternatives rejetées

* **Conserver les valeurs non conformes avec justification d'exception** (bordures « décoratives »
  non essentielles à l'identification du composant) : rejetée — les usages réels constatés
  (bordures de champs de formulaire, boutons, zone « à risque » de garantie) sont précisément le
  cas que WCAG 1.4.11 vise à protéger ; une exception non justifiée par un besoin métier réel
  contredirait le principe d'accessibilité de `DSG-001.md`.

## Traçabilité

* **Origine** : `US-129` (`addendum-backlog-ep17-ui-foundation-primeng-keycloak.md`), `DSG-001.md`
  §Fondations, `ADR-UI-001` §Architecture des Design Tokens.
* **Registre** : `design-decision-register.md`.
* **Gate concerné** : Gate 04A v2 (`gate-04A-decision-ep17-lot0-v2.md`, réserve continue
  `CHECK-UX-01`/`CHECK-FRONTEND-01` — tokens), Gate 02A EP-17 Lot 1
  (`gate-02A-decision-ep17-lot1.md`, critère « design system » jugé à contenu déjà validé, matière
  réelle dont l'implémentation relève du Gate 04A).

## Décision

* **Statut : Acceptée** — décision explicite du Product Owner (jptshilombo@gmail.com), 2026-08-01
  (« Accepted, both corrections approved »). Les deux corrections de couleur
  (`--lt-border-default` → `#64748b`, `--lt-state-danger-strong` → `#dc2626`) sont approuvées telles
  que proposées, sans réserve ni valeur alternative demandée. Les 6 catégories de tokens candidatées
  (`spacing`, `typography`, `size`, `z-index`, `breakpoint`, `focus`) sont acceptées avec la même
  décision, aucune n'ayant été distinguée explicitement par le Product Owner.
* Cette acceptation ne vaut ni GO, ni GO sous réserve, ni NO GO d'un Gate — elle satisfait le
  critère GWT de `US-129` (« revues et validées visuellement par le Design Architect ») avec,
  au-delà de l'avis du sous-agent, la validation humaine désormais obtenue.
* Le fichier de tokens versionné (`frontend/src/styles/tokens/_lt-tokens.scss`) portait déjà les
  valeurs proposées ; son statut est mis à jour pour refléter cette acceptation (plus « en attente
  de validation »). `US-129` est **close**.
* **Ce que cette acceptation n'autorise pas** : le remplacement des 24 occurrences en dur déjà
  présentes dans le code applicatif reste hors périmètre de `US-129`/`DDS-LT-006` — il relève de la
  migration écran par écran des Lots 2 et suivants, chacun restant un point de contrôle distinct.
  L'intégration du fichier de tokens dans `styles.scss` relève de `US-131`, non déclenchée par
  cette acceptation.
