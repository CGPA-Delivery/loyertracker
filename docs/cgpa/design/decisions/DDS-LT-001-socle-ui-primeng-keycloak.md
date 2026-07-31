# DDS-LT-001 — Socle UI PrimeNG, Design Tokens LoyerTracker et continuité visuelle Keycloak

> Instance projet d'une Design Decision Specification. Le format canonique reste
> `docs/cgpa/design/DDS-001.md` (gabarit générique, non modifié par cette décision). Les décisions
> projet portent l'identifiant `DDS-LT-NNN` pour ne jamais collisionner avec une future convention
> séquentielle du dépôt.

## Métadonnées

| Champ | Valeur |
|---|---|
| Identifiant | DDS-LT-001 |
| Titre | Socle UI PrimeNG, Design Tokens LoyerTracker et continuité visuelle Keycloak |
| Statut | **Acceptée** (décision de socle) — mise en œuvre subordonnée au Plan d'Exécution `plan-execution-ux-ui-primeng-keycloak.md`, lui-même **PROPOSÉ — NON APPROUVÉ — CODE INTERDIT** |
| Date de décision | 2026-07-30 |
| Product Owner | jptshilombo@gmail.com |
| Validateurs requis | Product Owner (décision de socle actée) ; UX/UI Design Lead — **Claude Code, sous-agent CGPA désigné le 2026-07-30** (`agent-designations-loyertracker.md`) ; Design Architect — **Claude Code, sous-agent CGPA désigné le 2026-07-30** ; Frontend Architect — **Claude Code, sous-agent CGPA désigné le 2026-07-31** ; validation formelle de mise en œuvre au Gate 04A |
| Documents amont | `phase-02-user-journeys.md`, `phase-02-information-architecture.md`, `phase-02-design-system.md`, `phase-02-ui-mockups.md`, `UXR-001.md` (Gate 02A/US-125, 2026-07-30) |
| Documents liés | `ADR-UI-001-socle-frontend-primeng-design-tokens-keycloak.md`, `DSG-001.md` (instance projet), `design-decision-register.md`, `design-debt-register-loyertracker.md`, `addendum-backlog-ep17-ui-foundation-primeng-keycloak.md` |

## Contexte

LoyerTracker dispose aujourd'hui d'une interface Angular 22 fonctionnelle (11 composants réels,
cf. `component-inventory-loyertracker.md`) mais **sans aucune bibliothèque de composants UI**, sans
design tokens nommés et sans thème Keycloak personnalisé (constat vérifié par lecture directe du
code : `frontend/package.json` ne déclare que `@angular/*`, `keycloak-angular` et `keycloak-js` ;
`frontend/src/styles.scss` ne définit aucune variable CSS, chaque composant duplique ses propres
valeurs hexadécimales — dette déjà tracée en `DD-611-02`). Le premier lot Frontend significatif du
produit (US-125) est aujourd'hui bloqué par les Gates 02A/04A précisément pour cette raison
(`project-state.md`, 2026-07-28). Le Product Owner a validé une décision de socle avant de
poursuivre US-125 et tout futur développement Frontend.

## Problème

Choisir la fondation technique et visuelle du Frontend LoyerTracker (bibliothèque de composants,
architecture de style, gouvernance des tokens) de façon à :

* accélérer les développements Frontend futurs sans réinventer des composants de base à chaque
  écran (formulaires, tables, dialogues, notifications) ;
* garantir une cohérence visuelle durable, gouvernée par un Design System propre à LoyerTracker et
  non par les défauts d'une bibliothèque tierce ;
* assurer une continuité d'identité visuelle entre l'application Angular et les écrans Keycloak
  (login, mot de passe oublié, erreurs), aujourd'hui strictement par défaut (aucun thème
  personnalisé, réalm importé sans configuration `loginTheme`/`accountTheme`) ;
* rester compatible avec Angular 22.0.8 et Keycloak 24.0 (versions réellement constatées dans le
  dépôt, cf. `ADR-UI-001` §Compatibilité) sans figer une version de bibliothèque non vérifiée.

## Objectifs

* Réduire le temps de développement des écrans futurs (US-125 Lot B, puis EP-17 Lot 6).
* Éliminer la duplication de valeurs visuelles en dur (24 occurrences de `#334155`, 15 de
  `#0f172a`, etc. — cf. `phase-02-design-system.md` §2) au profit de tokens sémantiques.
* Fournir une continuité perçue entre Angular et Keycloak pour l'utilisateur final (mêmes couleurs,
  même typographie, même logo).
* Ne pas dégrader le bundle initial en dessous du budget existant (`1mb` warning / `2.5mb` erreur,
  `angular.json`).
* Ne pas introduire de dette d'accessibilité ou de responsive supplémentaire.
* Rester réversible tant que le pilote (Lot 3/4 du Plan d'Exécution) n'est pas validé.

## Contraintes

* Application déjà en Production (`1.15.0`) : aucune régression visuelle ou fonctionnelle
  n'est tolérée sur les écrans existants pendant la fondation (Lots 0-2 n'y touchent pas).
* Équipe **dev solo** (cf. `product-backlog.md` §0) : la charge de maintenance d'un Design System
  doit rester proportionnée.
* Keycloak est mutualisé en Staging (`ai-test-server`, `STG-ISOL-01`) — toute évolution de thème doit
  respecter l'isolement inter-projets déjà en vigueur.
* Aucune dépendance ne doit être ajoutée pendant cette mission de cadrage (§Périmètre du Plan
  d'Exécution).

## Options étudiées

| Option | Description | Avantages | Inconvénients |
|---|---|---|---|
| **Angular Material** | Bibliothèque officielle Angular, Material Design | Intégration Angular native, forte popularité, accessibilité déjà travaillée par Google | Identité visuelle Material forte et difficile à neutraliser complètement ; theming basé sur des palettes Material (moins naturel pour des tokens métier « gestion locative ») ; aucun lien natif avec Keycloak ; composants de données financières (tables denses, montants) moins adaptés out-of-the-box |
| **PrimeNG** | Bibliothèque de composants Angular orientée applications de gestion/back-office | Très large couverture de composants « entreprise » (Table, DataTable avec tri/filtre, ConfirmDialog, Toast, Drawer, Timeline — alignés sur les besoins déjà identifiés en `phase-02-ui-mockups.md`, ex. premier modal du produit) ; theming par design tokens CSS (variables), compatible avec une couche de tokens LoyerTracker indépendante ; pas d'identité visuelle imposée forte | Bibliothèque tierce non maintenue par l'équipe Angular officielle ; nécessite une discipline d'encapsulation (`lt-*`) pour éviter l'usage anarchique explicitement proscrit par le PO ; compatibilité Angular 22 à vérifier formellement avant tout codage (non confirmée à ce jour, cf. `ADR-UI-001`) |
| **Tailwind CSS seul** | Framework utilitaire CSS, aucun composant fonctionnel fourni | Contrôle visuel total, aucune dépendance de composants tiers | Ne fournit aucun composant fonctionnel (table, dialogue, dropdown accessible) — tout devrait être recodé à la main, charge disproportionnée pour un dev solo ; risque de dérive vers des classes utilitaires anarchiques dans les templates, à l'opposé de la gouvernance Design System recherchée |
| **Combinaison de plusieurs frameworks** (ex. Material + Tailwind, ou PrimeNG + Tailwind global) | Cumul de bibliothèques | Aucun avantage net identifié | Deux systèmes de design en tension (deux jeux de tokens, deux stratégies de reset CSS) ; risque élevé d'incohérence visuelle et de duplication de dépendances ; explicitement écarté par la décision PO (§3 de la mission) |

## Décision retenue

**PrimeNG est retenu comme moteur de composants fonctionnels Angular. Un Design System propre à
LoyerTracker, fondé sur des Design Tokens sémantiques, reste la source de vérité visuelle. Keycloak
consomme les mêmes tokens (couleurs, typographie, logo) mais ne dépend techniquement pas de
PrimeNG — le thème Keycloak reste un artefact CSS/HTML autonome (FreeMarker + CSS), aligné
visuellement mais sans lien de dépendance logicielle.**

Angular Material n'est pas adopté. Tailwind CSS n'est pas installé comme framework global — des
classes utilitaires internes limitées et documentées restent possibles, sous contrôle du Design
System (`DSG-001.md` §Naming Convention), jamais comme substitut à celui-ci.

## Justification

* PrimeNG couvre nativement les composants « entreprise » déjà nécessaires (table de données,
  confirmation, notification, panneau latéral) identifiés dans les mockups US-125 sans qu'aucun
  composant sur mesure ne doive être écrit dès le premier lot.
* Le theming par variables CSS de PrimeNG permet une couche de tokens LoyerTracker (§DSG-001)
  strictement en amont, sans hériter d'une identité visuelle imposée — contrairement à Material.
* La stratégie d'encapsulation `lt-*` (composants transverses/métier) préserve la maîtrise du
  Design System sur l'apparence perçue, quel que soit le moteur de composants sous-jacent —
  cohérent avec l'interdiction explicite d'un usage anarchique des composants PrimeNG (§3.8 de la
  mission).
* La séparation Angular/Keycloak (tokens partagés, pas de dépendance technique) limite le risque
  d'un upgrade Keycloak cassant l'application Angular, ou inversement.

## Conséquences positives

* Vélocité accrue pour les futurs écrans (US-125 Lot B, EP-17 Lot 6 — baux, locataires,
  gestionnaires, affectations, garanties, honoraires, alertes, quittances, audit).
* Élimination progressive de la duplication de valeurs visuelles en dur.
* Continuité perçue Angular/Keycloak pour l'utilisateur final.
* Un seul Design System à maintenir, transverse aux deux surfaces (app + IdP).

## Conséquences négatives

* Nouvelle dépendance tierce (PrimeNG) à maintenir dans le temps (veille sécurité/licence,
  upgrades) — dette de maintenance nouvelle, à documenter dans `design-debt-register-loyertracker.md`.
* Charge de gouvernance supplémentaire : toute utilisation de composant PrimeNG hors du mapping
  documenté (`DSG-001.md` §Composants) doit être revue, sous peine de dérive anarchique.
* Risque de divergence entre les tokens consommés par Angular et ceux dupliqués manuellement dans
  le thème Keycloak si aucun mécanisme de synchronisation n'est mis en place (cf. `ADR-UI-001`
  §Architecture des tokens, Option A vs B).

## Risques

| # | Risque | Mitigation proposée | Statut |
|---|---|---|---|
| RSV-UI-01 | Compatibilité PrimeNG × Angular 22.0.8 non vérifiée avant décision | Tâche de vérification officielle inscrite au Lot 0 du Plan d'Exécution avant toute installation | Ouvert |
| RSV-UI-02 | Usage anarchique des composants PrimeNG dans les écrans, dérive du Design System | Mapping `DSG-001.md` §Composants + revue Design obligatoire (`CHECK-DESIGN-01`) à chaque Gate 04A | Ouvert — mitigation de gouvernance |
| RSV-UI-03 | Divergence entre tokens Angular et thème Keycloak (double maintenance manuelle) | Choix d'une source de vérité unique des tokens à trancher dans `ADR-UI-001` (Option A JSON vs Option B CSS) avant tout codage | Ouvert |
| RSV-UI-04 | Dégradation du budget bundle (`1mb`/`2.5mb`, `angular.json`) par import non ciblé de PrimeNG | Mesure de bundle avant/après obligatoire au Lot 1, imports ciblés exigés, interdiction d'import global documentée au Plan d'Exécution | Ouvert |
| RSV-UI-05 | Personnalisation du thème Keycloak affaiblissant la sécurité (CSP, scripts externes, CDN, messages d'erreur) | Interdictions explicites listées dans `ADR-UI-001` §Sécurité et dans le Plan d'Exécution Lot 4 ; aucune implémentation avant Gate dédié | Ouvert |
| RSV-UI-06 | Accessibilité PrimeNG incomplète sur certains composants (ex. date picker, dropdown) | Chaque composant du mapping `DSG-001.md` documente ses limites d'accessibilité connues et leur compensation ; `CHECK-ACCESSIBILITY-01` au Gate 04A | Ouvert |

## Dette créée

* Nouvelle dépendance externe à surveiller (licences, CVE) — à ajouter à
  `design-debt-register-loyertracker.md` lors de l'installation réelle (Lot 1), pas avant.
* Double surface visuelle à maintenir en synchronisation (Angular + Keycloak) tant que le
  mécanisme de tokens partagés n'est pas implémenté (Lot 4).

## Alternatives rejetées

* **Angular Material** : rejeté pour l'identité visuelle imposée et l'absence de continuité
  naturelle avec Keycloak (cf. tableau §Options étudiées).
* **Tailwind CSS seul** : rejeté car il ne fournit aucun composant fonctionnel, charge
  disproportionnée pour un dev solo, et risque de dérive vers des classes utilitaires anarchiques.
* **Combinaison de frameworks** : rejetée, tension entre deux systèmes de tokens/reset CSS,
  explicitement écartée par la décision PO.

## Compatibilité

* **Angular 22** : à vérifier formellement (tâche Lot 0 du Plan d'Exécution) — non confirmée par ce
  document, aucune version PrimeNG n'est figée ici (cf. `ADR-UI-001`).
* **Keycloak 24.0** (version réellement déployée, `docker-compose.yml`) : le thème reste un
  artefact FreeMarker/CSS standard, sans dépendance à Angular ni à PrimeNG — compatibilité de
  principe, à confirmer par un pilote (Lot 4).
* **Responsive et accessibilité** : PrimeNG ne remplace pas la stratégie déjà définie en
  `phase-02-design-system.md` (breakpoint 640px, focus-visible, skip-link, reduced-motion) — ces
  patrons restent la référence, PrimeNG s'y intègre.

## Impact bundle et performance

Non mesuré à ce stade (aucune installation effectuée). Le budget existant (`1mb` warning/`2.5mb`
erreur initial, `4kb`/`8kb` par style de composant, `angular.json`) est la contrainte de référence
pour le Lot 1 du Plan d'Exécution — voir `ADR-UI-001` §Budgets.

## Stratégie de migration progressive

Aucune refonte globale immédiate (interdite par la mission, §3.10). Migration lot par lot selon le
découpage du Plan d'Exécution : fondation (Lot 0-1) → composants transverses (Lot 2) → pilote
Angular limité (Lot 3) → pilote Keycloak limité (Lot 4) → validation (Lot 5) → extension
progressive du reste des écrans (Lot 6), chaque lot restant un point de contrôle GO/NO GO distinct.

## Interdictions

* Aucune installation de PrimeNG, Angular Material ou Tailwind global avant GO explicite du Plan
  d'Exécution.
* Aucune modification de `frontend/package.json`/`package-lock.json` par cette décision.
* Aucun composant PrimeNG utilisé directement dans un écran métier hors du mapping `DSG-001.md`
  sans revue Design.
* Aucune modification des fichiers de realm Keycloak (`infra/keycloak/realm-*.json`) par cette
  décision.

## Critères de réversibilité

* Tant que seul le Lot 0/1 (fondation, sans écran métier migré) est livré, un retrait de PrimeNG
  est trivial (suppression de dépendance, aucune donnée ni migration SQL concernée).
* Au-delà du pilote (Lot 3), la réversibilité doit être réévaluée écran par écran dans le rapport
  de Gate Staging du lot concerné — non couvert par cette décision de socle.

## Traçabilité

* **ADR** : `ADR-UI-001-socle-frontend-primeng-design-tokens-keycloak.md` (impact architectural et
  technique détaillé).
* **DSG** : `DSG-001.md`, instance projet en cours de complétion à partir de cette décision.
* **Backlog** : `addendum-backlog-ep17-ui-foundation-primeng-keycloak.md` (nouvel Epic EP-17).
* **Plan d'Exécution** : `plan-execution-ux-ui-primeng-keycloak.md` — statut PROPOSÉ, non approuvé.
* **Checklists** : `CHECK-UX-01` (instance à créer au Gate 04A), `CHECK-DESIGN-01`,
  `CHECK-ACCESSIBILITY-01`, `CHECK-RESPONSIVE-01`, `CHECK-DESIGN-TOKENS-01`, `CHECK-FRONTEND-01`
  (Gate 04A, `gate-04A-design-readiness.md`).
* **Gates** : Gate 02A (déjà en cours d'instruction pour US-125), Phase 04A, Gate 04A — aucun
  rejoué, aucun anticipé par cette décision.

## Décision

* **Statut : Acceptée** (décision de socle, 2026-07-30, Product Owner jptshilombo@gmail.com).
* Cette acceptation **ne vaut pas GO de mise en œuvre** : elle ne prononce ni GO, ni GO sous
  réserve, ni NO GO sur un Gate. La mise en œuvre reste entièrement subordonnée à l'approbation du
  Plan d'Exécution (`plan-execution-ux-ui-primeng-keycloak.md`) puis aux Gates 02A/04A applicables,
  conformément à l'autorité CGPA (le CGPA Chief Delivery Officer conserve seul la décision finale).
* **Aucune installation, aucun code Angular, aucun thème Keycloak n'est autorisé par ce document.**
