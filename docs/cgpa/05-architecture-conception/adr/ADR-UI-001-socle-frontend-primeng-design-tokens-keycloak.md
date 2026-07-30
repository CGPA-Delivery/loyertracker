# ADR-UI-001 — Socle Frontend PrimeNG, Design Tokens et thème Keycloak

> Numérotation dédiée `ADR-UI-NNN`, distincte de la séquence `ADR-01`→`ADR-18` (décisions
> métier/architecture applicative), sur le même principe que `ADR-STG-001` (gouvernance Staging
> partagée) — décision transverse à l'architecture Frontend, pas une évolution d'un domaine
> métier existant.

| Champ | Valeur |
|---|---|
| Statut | **Acceptée** (architecture de socle) — mise en œuvre subordonnée au Plan d'Exécution |
| Date | 2026-07-30 |
| Décision produit liée | `DDS-LT-001-socle-ui-primeng-keycloak.md` |
| Auteur | Claude Code (rédaction assistée), validation Product Owner sur la décision de socle |
| Validateurs requis pour la mise en œuvre | Design Architect — **Claude Code, sous-agent CGPA désigné le 2026-07-30** (`docs/cgpa/agents/agent-designations-loyertracker.md`) ; Frontend Architect, DevSecOps Lead (nouvelle dépendance), Security Architect Keycloak — à désigner |

## Contexte technique

LoyerTracker est un frontend Angular **standalone** (aucun `NgModule`, `provideRouter`/
`provideKeycloak`/`provideHttpClient` dans `app.config.ts`), Angular **22.0.8** exactement (`@angular/core` etc.,
`frontend/package.json`), `typescript` 6.0.3, `keycloak-angular` **22.0.0** (API fonctionnelle,
`provideKeycloak`), `keycloak-js` **^26.2.4**. Le builder est `@angular-devkit/build-angular:application`
(nouveau moteur esbuild), avec un unique fichier de styles global (`src/styles.scss`, 87 lignes) et
`assets: []` — aucune ressource statique (police, icône) n'est actuellement servie par Angular.

## État actuel du frontend

* **Aucune bibliothèque de composants UI** n'est déclarée dans `package.json` : ni Angular
  Material, ni PrimeNG, ni Tailwind. Chaque composant définit son propre bloc `styles: [...]`
  avec des valeurs hexadécimales dupliquées (24 occurrences de `#334155`, 15 de `#0f172a`, etc. —
  cf. `phase-02-design-system.md` §2, comptage exhaustif).
* Onze composants réels (cf. `component-inventory-loyertracker.md`) : `AppComponent`,
  `NavbarComponent`, deux dashboards (Bailleur, Gestionnaire), `ProfilComponent`,
  `AlertesListeComponent`, `AuditJournalComponent`, `GarantiesBailComponent`,
  `HonorairesBienComponent`, `PaiementsBienComponent`, `VerifyReceiptComponent`. Aucun composant
  n'est publié dans une bibliothèque partagée versionnée.
* Patrons répétés déjà stabilisés par convention (jamais formalisés en tokens) : `.panel`/
  `.panel-head`/`.toolbar`/`.list`/`.row`, badges par attribut `[attr.data-type]`, focus-visible
  global, skip-link, `prefers-reduced-motion`, breakpoint unique à `640px`.
* Budgets Angular actuels (`angular.json`, configuration `production`) : bundle initial
  `1mb` (warning) / `2.5mb` (erreur) ; style par composant `4kb` (warning) / `8kb` (erreur).
* Mono-thème sombre de fait (`color-scheme: light dark` déclaré mais fond fixé en dur
  `background: #0f172a` sur `body`) — aucun mode clair réel, aucune bascule.

## Absence actuelle de bibliothèque UI

Confirmée par lecture exhaustive de `package.json`, `angular.json` (aucun style tiers importé) et
des blocs `styles:` de chaque composant. Aucune dépendance UI, aucun système d'icônes, aucune
police custom chargée (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` uniquement).

## Décision PrimeNG

PrimeNG devient le moteur de composants fonctionnels Angular du produit (cf. `DDS-LT-001`
§Décision). Cette ADR en couvre l'architecture technique ; la justification métier/UX reste dans la
DDS.

## Non-adoption d'Angular Material

Écartée : identité visuelle Material forte à neutraliser, aucune continuité native avec Keycloak,
composants de données financières denses moins naturels que dans une bibliothèque orientée
back-office. Détail comparatif : `DDS-LT-001` §Options étudiées.

## Non-adoption de Tailwind global

Écartée comme framework global : ne fournit aucun composant fonctionnel, charge de recodage
disproportionnée pour un dev solo. Des classes utilitaires internes limitées restent possibles
(§Architecture des styles ci-dessous), mais jamais comme mécanisme de composition principal.

## Architecture des Design Tokens

Catégories de tokens à instancier (détail complet dans `DSG-001.md` §Tokens) : `color`, `surface`,
`text`, `border`, `spacing`, `size`, `typography`, `radius`, `shadow`, `z-index`, `motion`,
`breakpoint`, `focus`, `state`. Convention de nommage : préfixe `--lt-`, nom sémantique indépendant
de la valeur physique (ex. `--lt-color-primary`, `--lt-surface-card`, `--lt-state-danger`).

Les valeurs candidates initiales sont **reconstituées par comptage réel** des couleurs déjà
utilisées dans le code (cf. `phase-02-design-system.md` §2) — elles ne sont **pas validées
visuellement** et doivent être confirmées par le Design Architect avant tout usage en Production
(cf. `DSG-001.md`, marquage explicite « candidate »).

## Architecture des styles

Couches proposées, alignées sur `docs/cgpa/frontend/frontend-architecture.md` §CSS et SCSS :

1. **Fondations** (`tokens.scss` ou équivalent) — variables CSS uniquement, aucune règle de mise
   en page.
2. **Thème PrimeNG** — mapping des tokens LoyerTracker vers les variables de thème PrimeNG
   (mécanisme de theming CSS-variables de PrimeNG, compatible avec des tokens externes).
3. **Composants** — styles des composants `lt-*` et des composants applicatifs existants,
   progressivement migrés vers les tokens.
4. **Utilitaires internes limités** — classes ponctuelles documentées (ex. espacement, troncature
   de texte), jamais un système utilitaire complet façon Tailwind ; toute classe utilitaire ajoutée
   doit être répertoriée dans `DSG-001.md` §Naming Convention.

Isolation des styles : composants standalone Angular, encapsulation `ViewEncapsulation.Emulated`
par défaut (comportement Angular natif déjà en usage), pas de style global supplémentaire hors
fondations et thème.

## Stratégie d'encapsulation `lt-*`

Un composant PrimeNG est encapsulé dans un composant LoyerTracker préfixé `lt-` lorsqu'au moins un
des critères suivants s'applique (cf. mission §9.6) : comportement transverse à plusieurs écrans,
règle métier associée (ex. formatage monétaire, statut coloré), apparence devant rester stable
indépendamment des évolutions de PrimeNG, besoin d'accessibilité renforcé au-delà du défaut
PrimeNG, instrumentation (analytics/audit), ou risque de divergence visuelle identifié. Un usage
ponctuel et unique d'un composant PrimeNG simple (ex. un bouton isolé sans règle métier) ne
nécessite pas d'encapsulation systématique — cf. mapping initial `DSG-001.md` §Composants
(« encapsulation `lt-*` : oui/selon usage »).

## Stratégie de thème PrimeNG

À définir précisément au Lot 1 du Plan d'Exécution, une fois la version PrimeNG confirmée
compatible avec Angular 22 (theming CSS-variables natif de PrimeNG 17+, à vérifier formellement
plutôt que présumé — cf. §Gestion des dépendances).

## Stratégie de thème Keycloak

Arborescence cible documentée (non créée techniquement, cf. mission §16) :

```text
infra/keycloak/themes/loyertracker/
├── login/
│   ├── theme.properties
│   ├── messages/
│   └── resources/
│       ├── css/
│       ├── img/
│       └── js/
└── account/        (uniquement si l'Account Console est réellement utilisée — non constaté à ce jour)
```

Le thème reste un artefact FreeMarker + CSS **statique et autonome**, packagé dans l'image
`quay.io/keycloak/keycloak:24.0` (montage de volume, même patron que
`./infra/keycloak/realm-loyertracker.json:/opt/keycloak/data/import/...:ro` déjà en place dans
`docker-compose.yml`), sans dépendance logicielle à Angular ni à PrimeNG.

## Isolation entre Angular et Keycloak

Aucune dépendance de build ou d'exécution entre les deux surfaces. Le seul lien est la **source de
tokens partagée** (couleurs, typographie, logo), consommée différemment par chacune :

* **Option A — Source de vérité JSON** (`design-system/tokens/tokens.json` → génération
  `tokens.css` + `tokens.scss`) : outillage de génération à écrire et maintenir, mais garantit une
  source unique vérifiable ; risque de divergence uniquement si le générateur n'est pas rejoué.
* **Option B — Source CSS commune** (`tokens.css` consommé directement par Keycloak et importé
  côté Angular) : plus simple, aucun outillage de génération, mais risque de divergence si l'un des
  deux consommateurs est modifié sans reporter l'autre (pas de garde-fou automatique).

**Comparaison** :

| Critère | Option A (JSON + génération) | Option B (CSS commun) |
|---|---|---|
| Simplicité | Moindre (générateur à écrire) | Élevée |
| Risque de divergence | Faible si CI rejoue la génération | Moyen, dépend de la discipline |
| Outillage | Nouveau script à maintenir (dev solo) | Aucun |
| Sécurité | Neutre | Neutre |
| Maintenance solo | Charge supplémentaire | Charge minimale |
| Intégration CI | Étape de génération à ajouter | Aucune étape nouvelle |
| Portabilité | Réutilisable hors CSS si besoin futur (ex. mobile) | Limité à CSS |

**Recommandation** : Option B (source CSS commune) pour le pilote, cohérent avec la contrainte
« dev solo » et l'absence d'outillage de design tokens déjà en place dans le dépôt. Une migration
vers l'Option A reste possible sans rupture si un besoin de portabilité multi-format apparaît (ex.
consommation par une future app mobile). **Ce choix reste à confirmer explicitement au Lot 0 du
Plan d'Exécution** — cette ADR ne fige pas le Lot 4 (thème Keycloak), qui reste un lot distinct
soumis à son propre Gate.

## Organisation des fichiers

Voir arborescences cibles ci-dessus (§Stratégie de thème Keycloak) et
`design-system/tokens/`/`design-system/assets/` (mission §16) — non créées pendant cette mission,
documentées uniquement.

## Versioning

Design Tokens et `DSG-001.md` suivent Semantic Versioning (déjà la convention du gabarit
`DSG-001.md` §Versioning et évolution) : toute rupture de token (renommage, suppression) exige plan
de migration, changelog et DDS dédiée.

## Compatibilité avec Angular 22

**Non confirmée par ce document.** Aucune version de PrimeNG n'est figée ici : la compatibilité
réelle avec Angular 22.0.8 doit être vérifiée officiellement (documentation PrimeNG, matrice de
compatibilité publiée, essai d'installation isolé) avant toute décision de version — tâche
explicitement inscrite au Lot 0 du Plan d'Exécution (`plan-execution-ux-ui-primeng-keycloak.md`
§Lot 0). Inventer une version ici serait une preuve non recevable au sens du Validation Framework
CGPA v6.1.1 (§5).

## Compatibilité avec Keycloak

Version réellement constatée : **Keycloak 24.0** (image `quay.io/keycloak/keycloak:24.0`, digest
figé, `docker-compose.yml`). Le thème personnalisé (FreeMarker + CSS statique) est compatible par
construction avec cette version — aucune dépendance à une version ultérieure n'est requise pour un
thème login basique. Un upgrade Keycloak futur (hors périmètre de cette mission) devra revérifier
la compatibilité du thème avec la nouvelle version avant promotion.

## Gestion des dépendances

Aucune dépendance n'est ajoutée par cette ADR (`package.json`/`package-lock.json` non modifiés,
conformément à l'interdiction de mission §3). L'ajout réel de PrimeNG au Lot 1 du Plan d'Exécution
devra suivre la gouvernance DevSecOps existante (scan de dépendance, licence, CVE) avant merge.

## Stratégie de mise à jour

Non définie à ce stade (aucune dépendance installée). À documenter au Lot 1 : cadence de mise à
jour PrimeNG, politique de version majeure, tests de non-régression visuelle avant upgrade.

## Budgets bundle

Contrainte de référence : `angular.json` configuration `production`, budget initial `1mb`
(warning) / `2.5mb` (erreur), budget de style par composant `4kb` (warning) / `8kb` (erreur). Le
Plan d'Exécution (Lot 1) devra mesurer le bundle avant installation de PrimeNG puis après, avec
imports ciblés obligatoires (jamais `import 'primeng'` global) — toute augmentation de budget devra
faire l'objet d'une décision explicite, jamais d'un ajustement silencieux (mission §20).

## Tests

Non produits par cette ADR. Le Plan d'Exécution définit les preuves futures (tests unitaires,
composants, accessibilité automatisée/manuelle, responsive, Visual Review, régression visuelle) —
cf. `plan-execution-ux-ui-primeng-keycloak.md` §Lot 5.

## Sécurité

Le thème Keycloak ne doit jamais (cf. mission §17, repris intégralement comme contrainte
d'architecture) : modifier les flux OIDC/PKCE, affaiblir les politiques de mot de passe, masquer un
message de sécurité important, exposer un détail technique, injecter un script externe non
maîtrisé, introduire un CDN, modifier les cookies ou les tokens, stocker un secret, contourner une
protection CSRF, modifier une URL de redirection sans ADR dédiée, casser une protection
anti-clickjacking. Toute personnalisation reste un template FreeMarker + CSS statique, sans script
tiers.

## Accessibilité

Cible **WCAG 2.2 AA** (mission §18), héritée du Design System (`DSG-001.md` §Accessibilité). Toute
incompatibilité connue d'un composant PrimeNG (ex. date picker, dropdown complexe) doit être
documentée dans le mapping `DSG-001.md` §Composants avec sa compensation, ou le composant est exclu.

## Rollback

* **Lot 0/1 (fondation seule)** : rollback trivial — retrait de la dépendance, aucune donnée ni
  migration SQL concernée, aucun écran métier encore migré.
* **Lot 3/4 (pilotes)** : rollback = retour à l'implémentation existante de l'écran/du thème
  Keycloak par défaut, à documenter précisément dans le rapport de Gate Staging du lot concerné.
* Aucune migration de base de données n'est impliquée par cette ADR à quelque lot que ce soit.

## Conséquences

Voir `DDS-LT-001` §Conséquences positives/négatives (dimension produit/UX). Sur le plan strictement
technique : introduction d'une dépendance Frontend supplémentaire à maintenir, gouvernance de
tokens à opérer en continu, et un artefact Keycloak supplémentaire (thème) à faire évoluer en
synchronisation avec le Design System.

## Risques et mitigations

Repris et détaillés depuis `DDS-LT-001` §Risques (RSV-UI-01 à RSV-UI-06) ; cette ADR ajoute :

| # | Risque technique | Mitigation |
|---|---|---|
| RSV-UI-07 | Thème Keycloak cassant un flux d'authentification en Staging mutualisé | Aucun déploiement de thème sans Gate Staging dédié incluant `STG-ISOL-01` ; pilote testé isolément avant toute promotion |
| RSV-UI-08 | Divergence de version Keycloak entre Dev/Staging/Production affectant la compatibilité du thème | Vérification de version Keycloak par environnement inscrite comme preuve attendue au Lot 4 du Plan d'Exécution |

## Traçabilité

`DDS-LT-001-socle-ui-primeng-keycloak.md`, `DSG-001.md`, `component-inventory-loyertracker.md`,
`screen-inventory-loyertracker.md`, `plan-execution-ux-ui-primeng-keycloak.md`,
`addendum-backlog-ep17-ui-foundation-primeng-keycloak.md`, `gate-04A-design-readiness.md`.
