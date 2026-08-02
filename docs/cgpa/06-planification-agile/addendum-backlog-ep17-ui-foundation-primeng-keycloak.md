# Addendum Backlog — Epic EP-17 (Fondation UX/UI et continuité d'identité Angular–Keycloak)

| Champ | Valeur |
|-------|--------|
| Document de référence | `product-backlog.md`, `addendum-backlog-ep16-notifications.md` — **non modifiés** |
| Statut | **Proposé — À arbitrer.** Aucun développement autorisé avant approbation du Plan d'Exécution `plan-execution-ux-ui-primeng-keycloak.md` |
| Date | 2026-07-30 |
| Décision liée | `docs/cgpa/design/decisions/DDS-LT-001-socle-ui-primeng-keycloak.md` (Acceptée — socle uniquement) |
| Plan d'exécution | `plan-execution-ux-ui-primeng-keycloak.md` (**PROPOSÉ — NON APPROUVÉ — CODE INTERDIT**) |

> **Numérotation — vérifiée avant rédaction.** Dernier Epic occupé : **EP-16** (Notifications
> multicanales). Dernières User Stories occupées : **US-119 à US-126** (EP-16). Ce document
> introduit donc **EP-17** et **US-127 à US-142**, sans collision vérifiée avec `product-backlog.md`
> ni les addenda EP-09 à EP-16.

---

## EP-17 — Fondation UX/UI et continuité d'identité Angular–Keycloak

| ID | Epic | Jalons | Priorité |
|----|------|--------|----------|
| EP-17 | **Fondation UX/UI et continuité d'identité Angular–Keycloak** — socle PrimeNG, Design Tokens LoyerTracker, composants transverses `lt-*`, pilote Angular limité, pilote Keycloak limité | Transverse (aucun jalon CDC dédié — fondation technique) | Must |

**Aucun développement n'est autorisé avant GO explicite du Product Owner sur
`plan-execution-ux-ui-primeng-keycloak.md`, puis Gates 02A/04A statués par lot.**

---

### US-127 — Audit UI et baseline

**En tant que** Design Architect, **je veux** disposer d'un audit factuel du Frontend existant et
d'une baseline (accessibilité, responsive, performance) **afin de** mesurer objectivement tout
changement futur.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** le Frontend actuel (11 composants, `component-inventory-loyertracker.md`) **W** l'audit est exécuté **T** un rapport de baseline (accessibilité manuelle WCAG 2.2 AA, responsive au breakpoint 640px, bundle mesuré contre les budgets `angular.json`) est produit et versionné, sans aucune modification de code. |
| Dépendances | Aucune |
| Priorité | Must |
| Points | 3 |
| Sprint cible | Lot 0 |

### US-128 — Validation de la version PrimeNG

**En tant que** Frontend Architect, **je veux** vérifier officiellement la compatibilité d'une
version PrimeNG avec Angular 22.0.8 **afin de** ne jamais figer une version non vérifiée.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** Angular 22.0.8 (`frontend/package.json`) **W** la matrice de compatibilité PrimeNG est consultée officiellement (documentation éditeur) **T** une version candidate est proposée avec preuve documentée ; en l'absence de preuve recevable, aucune version n'est choisie et la tâche reste `non exécutée`. |
| Dépendances | Aucune |
| Priorité | Must |
| Points | 2 |
| Sprint cible | Lot 0 |

### US-129 — Design Tokens LoyerTracker

**En tant que** Design Architect, **je veux** définir les Design Tokens sémantiques
LoyerTracker **afin de** disposer d'une source de vérité visuelle indépendante de PrimeNG.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** les valeurs candidates reconstituées (`DSG-001.md` §Palette et couleurs) **W** elles sont revues et validées visuellement par le Design Architect **T** un fichier de tokens (`--lt-*`) versionné est produit, toutes les catégories (`color`, `surface`, `text`, `border`, `spacing`, `size`, `typography`, `radius`, `shadow`, `z-index`, `motion`, `breakpoint`, `focus`, `state`) sont couvertes ou explicitement différées avec justification. |
| Dépendances | US-127 |
| Priorité | Must |
| Points | 5 |
| Sprint cible | Lot 1 |

### US-130 — Thème PrimeNG

**En tant que** Frontend Architect, **je veux** configurer le theming PrimeNG à partir des tokens
LoyerTracker **afin d'**éviter toute identité visuelle par défaut de la bibliothèque.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** PrimeNG installé (version confirmée US-128) et les tokens définis (US-129) **W** le thème est configuré **T** aucun composant PrimeNG n'affiche sa palette par défaut ; le bundle reste sous le budget `angular.json`. |
| Dépendances | US-128, US-129 |
| Priorité | Must |
| Points | 5 |
| Sprint cible | Lot 1 |

### US-131 — Architecture SCSS

**En tant que** Frontend Architect, **je veux** organiser les styles en couches (fondations, thème,
composants, utilitaires limités) **afin d'**éviter la duplication de valeurs en dur constatée
aujourd'hui (24 occurrences de `#334155`, etc.).

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** `frontend/src/styles.scss` actuel **W** la réorganisation en couches est appliquée **T** aucune régression visuelle sur les écrans non migrés (Visual Review baseline comparée) ; convention de nommage `DSG-001.md` respectée. |
| Dépendances | US-129 |
| Priorité | Must |
| Points | 3 |
| Sprint cible | Lot 1 |

### US-132 — Composants transverses

**En tant que** Frontend Architect, **je veux** livrer les composants `lt-*` prioritaires
(`lt-page-header`, `lt-stat-card`, `lt-status-tag`, `lt-empty-state`, `lt-data-table`,
`lt-confirm-dialog`, `lt-form-field`) **afin de** disposer d'un vocabulaire réutilisable avant tout
pilote d'écran.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** le thème PrimeNG configuré (US-130) **W** chaque composant `lt-*` est développé isolément **T** chaque composant a un test unitaire, une entrée dans `DSG-001.md` §Component Mapping, et — pour `lt-confirm-dialog` — un test de focus-trap/restitution du focus (premier modal du produit, `DD-EP17-05`). |
| Dépendances | US-130, US-131 |
| Priorité | Must |
| Points | 8 |
| Sprint cible | Lot 2 |

### US-133 — Pilote dashboard Bailleur

**En tant que** Bailleur, **je veux** que mon dashboard utilise les composants `lt-*` **afin de**
bénéficier d'une expérience cohérente sans régression fonctionnelle.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** `BailleurDashboardComponent` actuel (1177 lignes) **W** les sections concernées par le pilote sont migrées **T** non-régression fonctionnelle complète (CRUD biens/patrimoines/baux/affectations inchangé), Visual Review PASS, aucune donnée financière masquée. |
| Dépendances | US-132, confirmation PO du périmètre exact du pilote |
| Priorité | Must |
| Points | 8 |
| Sprint cible | Lot 3 |

> **Note de confirmation Product Owner (2026-08-02)** : périmètre exact tranché — « sections
> concernées par le pilote » limité à la section **Patrimoines/Biens** du dashboard Bailleur
> uniquement (lecture principalement, en cohérence avec `US-134`). Explicitement **hors périmètre
> de ce Lot 3** : Affectations, Paiements, Garanties, Honoraires, Alertes, Journal d'audit — ces
> sections restent en l'état, migration différée à un Lot ultérieur, chacun son propre point de
> contrôle Gate. Décision tracée dans `docs/project-state.md` et
> `gate-04A-decision-ep17-lot3.md`/`gate-02A-decision-ep17-lot3.md` §4. GWT ci-dessus non réécrit,
> conformément à la préservation des décisions historiques (`CLAUDE.md`).

### US-134 — Pilote Biens/Patrimoines

**En tant que** Bailleur, **je veux** que la liste et le détail d'un bien utilisent
`lt-data-table`/`lt-form-field` **afin de** valider le pattern de table de données avant extension
au reste du produit.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** la section Biens du dashboard Bailleur **W** elle est migrée vers `lt-data-table` **T** tri/filtre si introduits sont couverts par un test, aucune régression sur l'unicité/l'isolation cross-bailleur déjà garanties par le backend. |
| Dépendances | US-133 |
| Priorité | Must |
| Points | 5 |
| Sprint cible | Lot 3 |

> **Note de confirmation Product Owner (2026-08-02)** : périmètre inchangé par la confirmation
> ci-dessus (`US-133`) — cette Story couvrait déjà la section Biens seule, cohérente avec le
> périmètre restreint retenu pour le Lot 3.

### US-135 — Thème Keycloak

**En tant que** Bailleur ou Gestionnaire, **je veux** que les écrans Keycloak (login, mot de passe
oublié, erreurs) partagent l'identité visuelle de l'application **afin de** ne pas percevoir de
rupture d'expérience à l'authentification.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** le realm Keycloak 24.0 actuel, sans thème personnalisé **W** le thème `loyertracker` (login) est appliqué en Staging isolé **T** aucune modification des flux OIDC/PKCE, aucun secret exposé, `STG-ISOL-01` PASS avant/après, tests de sécurité de `plan-execution-ux-ui-primeng-keycloak.md` §5 tous PASS. |
| Dépendances | US-129 (tokens), décision Option A/B tranchée (`ADR-UI-001`) |
| Priorité | Must |
| Points | 8 |
| Sprint cible | Lot 4 |

### US-136 — Accessibilité

**En tant que** QA Lead accessibilité, **je veux** couvrir WCAG 2.2 AA sur les écrans du pilote
**afin de** ne pas introduire de régression d'accessibilité avec PrimeNG.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** les écrans pilotés (US-133/134/135) **W** l'audit accessibilité est exécuté (automatisé + manuel clavier) **T** `CHECK-ACCESSIBILITY-01` PASS ou PASS sous réserve tracée, toute incompatibilité PrimeNG documentée avec compensation. |
| Dépendances | US-133, US-134, US-135 |
| Priorité | Must |
| Points | 5 |
| Sprint cible | Lot 5 |

### US-137 — Responsive

**En tant que** QA Lead, **je veux** valider le comportement responsive des écrans pilotés **afin
de** garantir qu'aucune information financière critique n'est masquée sur mobile.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** les écrans pilotés **W** testés au breakpoint existant (640px) et sur viewport mobile réel **T** `CHECK-RESPONSIVE-01` PASS, aucune donnée financière masquée, touch targets suffisants. |
| Dépendances | US-133, US-134 |
| Priorité | Must |
| Points | 3 |
| Sprint cible | Lot 5 |

### US-138 — Régression visuelle

**En tant que** Design QA, **je veux** comparer les captures avant/après du pilote **afin de**
détecter toute dérive visuelle non approuvée.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** les captures baseline (US-127) **W** comparées aux captures post-pilote **T** rapport de Visual Review produit, tout écart est soit corrigé, soit accepté explicitement comme dette (`DD-611-04`). |
| Dépendances | US-133, US-134, US-135 |
| Priorité | Should |
| Points | 3 |
| Sprint cible | Lot 5 |

### US-139 — Documentation

**En tant que** Technical Writer, **je veux** que `DSG-001.md`, `component-inventory-loyertracker.md`
et `traceability-ui-loyertracker.md` reflètent l'état réel post-pilote **afin de** garder la
documentation exploitable pour le Lot 6.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** les livrables du pilote **W** la documentation est mise à jour **T** `DSG-001.md` passe de statut Proposé à une version incrémentée, `traceability-ui-loyertracker.md` n'a plus de case « À définir » pour les lignes du pilote. |
| Dépendances | US-133, US-134, US-135, US-136, US-137, US-138 |
| Priorité | Must |
| Points | 2 |
| Sprint cible | Lot 5 |

### US-140 — Gate 04A du pilote

**En tant que** Chief Delivery Officer, **je veux** instruire le Gate 04A sur le pilote **afin
d'**autoriser ou refuser la poursuite du Frontend au-delà du pilote.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** tous les livrables du Lot 5 **W** `CHECK-UX-01` (instance EP-17) est instruit **T** décision GO / GO sous réserve / NO GO tracée dans `project-state.md`, aucun critère bloquant en échec silencieux. |
| Dépendances | US-136, US-137, US-138, US-139 |
| Priorité | Must |
| Points | 2 |
| Sprint cible | Lot 5 |

### US-141 — Gate Staging du pilote

**En tant que** Release Manager, **je veux** promouvoir le pilote en Staging isolé **afin de**
valider en conditions réelles avant toute décision Production.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** Gate 04A GO ou GO sous réserve (US-140) **W** promotion Staging exécutée **T** `STG-ISOL-01` PASS avant/après, smoke rejoué sans régression, aucune promotion Production autorisée par ce seul Gate. |
| Dépendances | US-140 |
| Priorité | Must |
| Points | 3 |
| Sprint cible | Lot 5 |

### US-142 — Stratégie de migration du reste des écrans

**En tant que** Product Owner, **je veux** un plan de migration explicite pour les écrans restants
(baux, locataires, gestionnaires, affectations, garanties, honoraires, alertes, quittances, audit)
**afin d'**éviter une refonte non maîtrisée.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** le pilote validé (US-141) **W** la stratégie est formalisée **T** un découpage lot par lot est proposé, chaque lot restant un point de contrôle GO/NO GO distinct, aucun développement du Lot 6 n'est autorisé par cette seule story. |
| Dépendances | US-141 |
| Priorité | Should |
| Points | 3 |
| Sprint cible | Lot 6 (cadrage uniquement) |

---

## Récapitulatif & priorisation

| Story | Points | Priorité | Lot |
|-------|--------|----------|-----|
| US-127 — Audit UI et baseline | 3 | Must | 0 |
| US-128 — Validation version PrimeNG | 2 | Must | 0 |
| US-129 — Design Tokens | 5 | Must | 1 |
| US-130 — Thème PrimeNG | 5 | Must | 1 |
| US-131 — Architecture SCSS | 3 | Must | 1 |
| US-132 — Composants transverses | 8 | Must | 2 |
| US-133 — Pilote dashboard Bailleur | 8 | Must | 3 |
| US-134 — Pilote Biens/Patrimoines | 5 | Must | 3 |
| US-135 — Thème Keycloak | 8 | Must | 4 |
| US-136 — Accessibilité | 5 | Must | 5 |
| US-137 — Responsive | 3 | Must | 5 |
| US-138 — Régression visuelle | 3 | Should | 5 |
| US-139 — Documentation | 2 | Must | 5 |
| US-140 — Gate 04A du pilote | 2 | Must | 5 |
| US-141 — Gate Staging du pilote | 3 | Must | 5 |
| US-142 — Stratégie migration restante | 3 | Should | 6 |
| **Total EP-17** | **68** | — | — |

> **Aucune de ces stories n'est insérée dans un sprint actif.** Statut global : **Proposé — À
> arbitrer**, dans l'attente d'un GO explicite du Product Owner sur
> `plan-execution-ux-ui-primeng-keycloak.md`.

## Dépendances & risques (synthèse)

* US-128 (validation PrimeNG) doit précéder US-130/132/133/134 — dépendance technique bloquante.
* US-129 (tokens) doit précéder US-130/131/135 — dépendance de conception.
* US-135 (thème Keycloak) dépend d'un choix Option A/B non tranché (`ADR-UI-001`) — risque de
  reprise si le choix change après un premier codage.
* US-133/134 (pilotes Angular) dépendent d'une confirmation explicite du Product Owner sur le
  périmètre exact du pilote (mission §15.3 : « Le pilote doit être confirmé par le Product Owner
  avant exécution »).
* Risque transverse : **équipe dev solo** — vélocité des Lots 3-6 ajustable, aucun engagement de
  date pris par ce document.
