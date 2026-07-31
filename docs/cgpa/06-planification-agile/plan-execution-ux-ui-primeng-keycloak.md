# Plan d'Exécution — Fondation UX/UI PrimeNG, Design Tokens et thème Keycloak

| Champ | Valeur |
|---|---|
| Statut | **PROPOSÉ — NON APPROUVÉ — CODE INTERDIT** |
| Date | 2026-07-30 |
| Product Owner | jptshilombo@gmail.com |
| Décision de socle liée | `docs/cgpa/design/decisions/DDS-LT-001-socle-ui-primeng-keycloak.md` (Acceptée) |
| ADR liée | `docs/cgpa/05-architecture-conception/adr/ADR-UI-001-socle-frontend-primeng-design-tokens-keycloak.md` |
| Epic | EP-17 — Fondation UX/UI et continuité d'identité Angular–Keycloak (`addendum-backlog-ep17-ui-foundation-primeng-keycloak.md`) |
| Prérequis | Aucun code Frontend n'est autorisé avant GO explicite du Product Owner sur ce Plan, puis Gate 02A et Gate 04A statués par lot |

> **Ce Plan ne remplace ni le Gate 02A ni le Gate 04A.** Il organise le travail à soumettre à ces
> Gates, lot par lot. Chaque lot ci-dessous reste un point de contrôle GO/NO GO distinct — un GO
> global sur ce Plan n'autorise pas automatiquement le lot suivant.

## 1. Périmètre

* Fondations du Design System LoyerTracker (tokens, principes, gouvernance — `DSG-001.md`).
* Design Tokens sémantiques (`--lt-*`), source de vérité à trancher (Option A/B, `ADR-UI-001`).
* Installation future de PrimeNG (après vérification de compatibilité Angular 22).
* Thème PrimeNG basé sur les tokens LoyerTracker.
* Composants transverses prioritaires (`lt-data-table`, `lt-status-tag`, `lt-confirm-dialog`,
  `lt-form-field`, `lt-empty-state`, service Toast).
* Thème Keycloak (login a minima), aligné visuellement sans dépendance technique.
* Pilote Angular limité (dashboard Bailleur, Patrimoines/Biens, détail d'un bien, paiements ou
  échéances).
* Pilote Keycloak limité (login, mot de passe oublié, erreurs).
* Accessibilité (WCAG 2.2 AA), responsive, tests, documentation, déploiement contrôlé du pilote.

## 2. Hors périmètre

* Refonte globale immédiate de tous les écrans.
* Tout changement métier (règles de gestion, calculs financiers).
* Tout changement de contrat d'API.
* Toute migration de données.
* Remplacement de Keycloak par un autre IdP.
* Tailwind CSS comme framework global.
* Angular Material.
* Dark mode et light mode simultanés : le mode sombre reste la cible initiale (`DSG-001.md`
  §Dark Mode) ; un mode clair complet reste soumis à décision PO explicite ultérieure.
* Refonte de la totalité des écrans en un seul sprint.
* Installation effective de PrimeNG, modification de `package.json`/`package-lock.json`,
  modification de code Angular applicatif ou de thème Keycloak **pendant la présente mission de
  cadrage** — strictement documentaire.

## 3. Découpage en lots

### Lot 0 — Gouvernance et baseline

* Finaliser/valider `DDS-LT-001`, `ADR-UI-001`, `UXR-001` (extension), `DSG-001` (v0.1.0 → version
  validée) par les rôles CGPA requis. **UX/UI Design Lead et Design Architect sont désignés**
  depuis le 2026-07-30 (Claude Code, `agent-designations-loyertracker.md` — limite d'indépendance
  tracée, une validation humaine indépendante reste recommandée) ; **Frontend Architect toujours à
  désigner**.
* Inventaire écrans/composants : `component-inventory-loyertracker.md`,
  `screen-inventory-loyertracker.md` (produits, à faire valider).
* Baseline accessibilité : audit manuel des 11 composants existants contre WCAG 2.2 AA (non
  encore réalisé — à planifier).
* Baseline responsive : vérification du seul breakpoint existant (640px) sur les écrans réels.
* Baseline performance : mesure du bundle actuel (`angular.json`, budgets `1mb`/`2.5mb`) avant
  toute dépendance ajoutée.
* Captures de référence (Visual Review baseline) : à produire avant tout changement visuel.
* **Choix de version PrimeNG compatible avec Angular 22.0.8** — vérification officielle
  obligatoire (documentation éditeur, matrice de compatibilité), aucune version supposée.
* Analyse licences et sécurité de la dépendance PrimeNG (gouvernance DevSecOps existante).
* Gate 02A : **statué pour US-125 le 2026-07-31 — GO sous réserve**
  (`gate-02A-decision-ep16-us125.md`, réserves non bloquantes DDS-cand-1→4 avant Gate 04A). Ne
  couvre que US-125 (EP-16), pas le socle EP-17 traité par ce Plan.
* Gate 04A : préparé (livrables ci-dessus), statué NO GO en l'état le 2026-07-31 pour le périmètre
  EP-17 (`gate-04A-decision-ep17-lot0.md`).

**Sortie du Lot 0** : rapport de compatibilité PrimeNG, version candidate proposée (non installée),
choix Option A/B pour la source de tokens partagée Angular/Keycloak documenté dans `ADR-UI-001`.

### Lot 1 — Fondation technique

* Installer PrimeNG (version confirmée au Lot 0).
* Installer les icônes uniquement si un besoin réel est justifié (aucune bibliothèque d'icônes
  complète par défaut).
* Configurer le thème PrimeNG à partir des tokens `--lt-*`.
* Créer les fichiers de tokens (fondations SCSS/CSS).
* Mettre en place les conventions de nommage (`DSG-001.md` §Naming Convention).
* **Ne migrer aucun écran métier complet** à ce stade.

**Preuve attendue** : mesure de bundle avant/après installation, comparée au budget existant.

### Lot 2 — Composants transverses

* `lt-page-header`, `lt-stat-card`, `lt-status-tag`, `lt-empty-state`, `lt-data-table`,
  `lt-confirm-dialog`, `lt-form-field`, service Toast — développés et testés isolément (Storybook
  ou équivalent à documenter si retenu), sans intégration dans un écran métier existant.

### Lot 3 — Pilote Angular

Pilote recommandé (mission §15.3, repris tel quel) : dashboard Bailleur, liste
Patrimoines/Biens, détail d'un bien, tableau des paiements ou échéances. **Le pilote exact doit
être confirmé par le Product Owner avant exécution** — ce Plan ne le fige pas au-delà de la
recommandation.

### Lot 4 — Pilote Keycloak

Écrans à préparer puis implémenter (login, mot de passe oublié, reset password, invitation,
invitation expirée, session expirée, accès refusé, logout, profil si l'Account Console est
réellement utilisée — non constaté à ce jour, cf. `screen-inventory-loyertracker.md`).
**Prérequis bloquants avant tout déploiement, même en Staging** :

* Aucune modification des flux OIDC/PKCE ni des fichiers de realm.
* Respect intégral des interdictions de sécurité (`ADR-UI-001` §Sécurité).
* `STG-ISOL-01` obligatoire avant toute promotion sur `ai-test-server` (mutualisé).

### Lot 5 — Validation

Tests unitaires, tests composants, tests accessibilité (automatisés + navigation clavier
manuelle), responsive, Visual Review, régression visuelle, contrôle bundle, contrôle sécurité,
contrôle Keycloak (§17), validation métier du Product Owner, Gate Staging du pilote.

### Lot 6 — Extension progressive

Baux, locataires, gestionnaires, affectations, garanties, honoraires, alertes, quittances, audit —
migration écran par écran, chaque lot restant un point de contrôle GO/NO GO distinct, aucune
extension automatique.

## 4. Architecture Keycloak à préparer (non créée techniquement)

```text
infra/keycloak/themes/loyertracker/
├── login/
│   ├── theme.properties
│   ├── messages/
│   └── resources/
│       ├── css/
│       ├── img/
│       └── js/
└── account/   (uniquement si l'Account Console est réellement utilisée — à confirmer avant tout codage)
```

Source de tokens partagée (candidate, cf. `ADR-UI-001` §Isolation entre Angular et Keycloak) :

```text
design-system/
├── tokens/
│   ├── tokens.json   (Option A, si retenue)
│   ├── tokens.css    (Option B, recommandée pour le pilote — cf. ADR-UI-001)
│   └── tokens.scss
└── assets/
    ├── logo/
    └── icons/
```

**Décision de l'Option A vs B non prise par ce Plan** — recommandation Option B (source CSS
commune) documentée dans `ADR-UI-001`, à confirmer explicitement au Lot 0.

## 5. Sécurité Keycloak — rappel des interdictions (mission §17)

Le thème ne doit jamais : modifier les flux OIDC ; affaiblir les politiques de mot de passe ;
masquer les erreurs importantes ; exposer des détails techniques ; injecter des scripts externes
non maîtrisés ; introduire des CDN ; modifier les cookies ou les tokens ; stocker des secrets ;
contourner les protections CSRF ; modifier les URLs de redirection sans ADR ; casser les
protections anti-clickjacking ; altérer les messages de sécurité au profit de l'esthétique.

**Tests de sécurité prévus au Lot 5** : login valide/invalide, compte désactivé, mot de passe
oublié, reset expiré, invitation expirée, session expirée, logout, redirection après login,
accessibilité, mobile, absence de fuite d'information.

## 6. Accessibilité (cible WCAG 2.2 AA)

Couverture prévue : contraste, focus visible, navigation clavier, ordre de tabulation, labels,
`aria-live`, erreurs de formulaire, touch targets, zoom 200 %, reduced motion, tableaux
accessibles, modales, menus, dropdowns, date pickers, toast non bloquant, lecteurs d'écran,
Keycloak. Toute incompatibilité connue d'un composant PrimeNG doit être documentée dans
`DSG-001.md` §Composants et compensée ou le composant exclu.

## 7. Responsive

Desktop-first pragmatique pour les écrans de gestion dense, adaptation mobile obligatoire pour
toute tâche critique. Ne jamais masquer une information financière critique. Éviter les
interactions uniquement au survol. Touch targets suffisants. Ne pas remplacer systématiquement les
tableaux par des cartes sur mobile sans analyse métier au cas par cas.

## 8. Performance et bundle

* Mesure du bundle avant installation de PrimeNG (référence : budgets actuels `angular.json`,
  `1mb`/`2.5mb` initial, `4kb`/`8kb` par style de composant).
* Estimation puis mesure réelle après installation.
* Imports ciblés obligatoires — interdiction d'importer toute la bibliothèque.
* Lazy loading selon les routes (aucune route supplémentaire prévue par ce Plan).
* Icônes limitées au strict nécessaire.
* Suppression du CSS inutilisé (purge, si l'outillage PrimeNG le permet).
* Toute évolution de budget fait l'objet d'une décision explicite, jamais d'une augmentation
  silencieuse.

## 9. Tests et preuves à prévoir (toutes non exécutées à ce stade)

| Preuve | Statut |
|---|---|
| Rapport d'audit UI initial | Non exécuté |
| Captures baseline | Non exécuté |
| Matrice écrans (`screen-inventory-loyertracker.md`) | Produite (Lot 0) |
| Inventaire composants (`component-inventory-loyertracker.md`) | Produit (Lot 0) |
| Rapport de compatibilité PrimeNG | Non exécuté |
| Audit licence | Non exécuté |
| Audit sécurité dépendances | Non exécuté |
| Tests unitaires | Non exécuté |
| Tests composants | Non exécuté |
| Tests a11y automatisés | Non exécuté |
| Tests manuels clavier | Non exécuté |
| Tests responsive | Non exécuté |
| Rapport Visual Review | Non exécuté |
| Rapport régression visuelle | Non exécuté |
| Comparaison bundle avant/après | Non exécuté |
| Rapport thème Keycloak | Non exécuté |
| Validation Product Owner | Non exécuté (décision de socle DDS-LT-001 obtenue ; validation de mise en œuvre non obtenue) |
| Décision Gate 04A | Non exécuté |
| Décision Gate Staging | Non exécuté |

## 10. Gates applicables (CGPA v6.1.1 constaté dans le dépôt)

* **Gate 02A** — déjà en cours d'instruction pour US-125 (`UXR-001.md`, `phase-02-*.md`) ;
  applicable également à EP-17 dès qu'un écran est concerné.
* **Phase 04A** puis **Gate 04A — Design Readiness** (`gate-04A-design-readiness.md`) :
  obligatoire avant tout développement Frontend (Navigation/flows, wireframes, `DSG-001`
  versionné, DDS structurantes acceptées, responsive, accessibilité, inventaire composants, UI
  Specifications, dette UX acceptable, validation PO, `CHECK-DESIGN-01`,
  `CHECK-ACCESSIBILITY-01`, `CHECK-RESPONSIVE-01`, `CHECK-DESIGN-TOKENS-01`, `CHECK-FRONTEND-01`).
* **Gate DevSecOps** pour toute nouvelle dépendance (PrimeNG) — gouvernance existante, non
  redéfinie ici.
* **Gate Staging** (avec `STG-ISOL-01`) pour le pilote Angular et le pilote Keycloak — distincts.
* **Gate Production** — hors périmètre de ce Plan, phase ultérieure.

**Le chantier ne sera pas déclaré prêt au développement tant que les éléments bloquants de
`CHECK-UX-01` ne sont pas couverts** — instance créée en `CHECK-UX-01-ep17-ui-foundation.md`,
statut `NON EXÉCUTÉ`/`PRÉPARATION EN COURS`, jamais `PASS` sur la seule base de ce Plan.

## 11. Sprints et stories

Epic **EP-17 — Fondation UX/UI et continuité d'identité Angular–Keycloak** (numérotation vérifiée
libre : derniers Epic/US occupés EP-16/US-126). Stories **US-127 à US-142**, détaillées dans
`addendum-backlog-ep17-ui-foundation-primeng-keycloak.md`. **Aucune story n'est insérée dans un
sprint actif sans décision explicite du Product Owner.**

## 12. Décision

* **Statut : PROPOSÉ — NON APPROUVÉ — CODE INTERDIT.**
* Aucun développement Frontend, aucune installation de dépendance, aucun déploiement de thème
  Keycloak n'est autorisé tant que ce Plan n'est pas explicitement approuvé par le Product Owner
  et que les Gates 02A/04A applicables ne sont pas statués GO ou GO sous réserve.
* Prochaine étape : soumission de ce Plan, de `DDS-LT-001`, `ADR-UI-001`, `DSG-001` et de
  l'addendum backlog EP-17 au Product Owner. UX/UI Design Lead, Design Architect, Frontend
  Architect et DevSecOps Lead sont désignés (Claude Code, `agent-designations-loyertracker.md`) et
  ont tous rendu leur avis proposé : UX/UI Design Lead (`UXR-001.md`, GO sous réserve), Design
  Architect (`DSG-001.md`, NO GO en l'état), DevSecOps Lead
  (`CHECK-DEVSECOPS-01-ep17-lot1-readiness.md`, PASS sous réserve — réserve bloquante pour l'entrée
  en Lot 1 = rapport de compatibilité/licence/sécurité PrimeNG non produit), Frontend Architect
  (`CHECK-FRONTEND-01-ep17-ui-foundation.md`, NO GO en l'état — architecture par domaines et lazy
  loading déjà réels et sains, mais stratégie d'état absente, nouvelle dette `DD-EP17-08`).
  **Décision Product Owner rendue le 2026-07-31** : Gate 04A **NO GO en l'état**
  (`gate-04A-decision-ep17-lot0.md`) ; Gate 06A **PASS sous réserve**
  (`gate-06A-decision-ep17-lot1.md`, réserve bloquante = rapport licence/sécurité PrimeNG). Le
  Gate 04A étant NO GO, **le statut du Plan reste inchangé : PROPOSÉ — NON APPROUVÉ — CODE
  INTERDIT** — le Gate 06A PASS sous réserve ne suffit pas seul à lever cette interdiction.
