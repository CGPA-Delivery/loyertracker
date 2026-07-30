# Rapport de préparation — Chantier socle UI PrimeNG + Design Tokens + thème Keycloak

| Champ | Valeur |
|---|---|
| Date | 2026-07-30 |
| Auteur | Claude Code (copilote CGPA v6.1.1) |
| Périmètre | Formalisation de la décision de socle UX/UI et préparation du chantier (EP-17) — aucune exécution |
| Produit | LoyerTracker |
| Statut | Dossier prêt à soumettre — **non exécuté, non approuvé** |

## 1. Objet

Formaliser dans les artefacts CGPA la décision du Product Owner de retenir **PrimeNG + Design
Tokens LoyerTracker + thème Keycloak personnalisé** comme socle UI, sans Angular Material ni
Tailwind comme framework global, et préparer — sans l'exécuter — le chantier correspondant : Design
System instancié, inventaires, matrice de traçabilité, Plan d'Exécution, backlog, checklist
préparatoire, mise à jour du Project State.

## 2. Périmètre analysé

* Frontend Angular complet (`frontend/package.json`, `angular.json`, `src/app/**`, `src/styles.scss`).
* Authentification/Keycloak (`core/auth/`, `app.config.ts`, `infra/keycloak/`, `docker-compose.yml`).
* Documentation CGPA UX/UI existante (`design/`, `frontend/`, `architecture/architecture-ux-ui.md`,
  `phases/phase-04A-*`, `gates/gate-04A-*`, `checklists/check-ux-01.md`,
  `workflows/ux-design-delivery-workflow.md`, `06-planification-agile/product-backlog.md`).
* Cartographie exhaustive des écrans et composants réellement présents.
* Gouvernance CGPA v6.1.1 (`CLAUDE.md`, `AGENTS.md`, `project-state.md`, `prod-state.md`,
  `staging-state.md`, `CGPA-v6.1.md`, `VALIDATION-FRAMEWORK-v6.1.1.md`,
  `AUTOMATED-AUDIT-v6.1.1.md`).

## 3. État réel du frontend

* Angular **22.0.8**, architecture **standalone** (aucun `NgModule`), builder
  `@angular-devkit/build-angular:application`, TypeScript **6.0.3**.
* **Aucune bibliothèque UI** installée (ni Material, ni PrimeNG, ni Tailwind) — confirmé par lecture
  exhaustive de `package.json` et `angular.json`.
* **11 composants Angular réels** (cf. `component-inventory-loyertracker.md`) : `AppComponent`,
  `NavbarComponent`, deux dashboards (Bailleur 1177 lignes, Gestionnaire 336 lignes),
  `ProfilComponent`, `AlertesListeComponent`, `AuditJournalComponent`, `GarantiesBailComponent`,
  `HonorairesBienComponent`, `PaiementsBienComponent`, `VerifyReceiptComponent`.
* **4 routes** seulement (`/bailleur`, `/bailleur/profil`, `/gestionnaire`,
  `/verify/receipt/:id`) — la majorité des « écrans » sont des sections empilées dans deux pages
  uniques.
* Aucun token CSS nommé ; duplication de valeurs en dur constatée par comptage (24× `#334155`,
  15× `#0f172a`, etc.).
* Budgets Angular existants : bundle initial `1mb`/`2.5mb`, style par composant `4kb`/`8kb`.
* Mono-thème sombre de fait, aucune bascule claire/sombre réelle.
* Dette UX transverse identifiée : aucun état « accès refusé »/404 uniforme, aucune pagination/
  filtre sur les listes transversales, aucun sélecteur de test.

## 4. État réel de Keycloak

* Version **24.0** exactement (image `quay.io/keycloak/keycloak:24.0`, digest figé,
  `docker-compose.yml`).
* `keycloak-angular` **22.0.0** (API fonctionnelle, `provideKeycloak`), `keycloak-js` **^26.2.4**.
* OIDC/PKCE **S256**, `onLoad: 'check-sso'` (pas de login imposé au bootstrap, routes protégées
  gardées par `authGuard`).
* **Aucun thème personnalisé** : `grep -n "theme"` sur les deux fichiers de realm
  (`realm-loyertracker.json`, `realm-loyertracker-production.json`) ne retourne aucune occurrence.
* Aucune arborescence `infra/keycloak/themes/` n'existe.
* Réalm importé par montage de volume en lecture seule (`docker-compose.yml`), patron réutilisable
  pour un futur thème.

## 5. État des artefacts UX/UI

| Artefact | État avant cette mission | État après |
|---|---|---|
| `UXR-001.md` | Gabarit vide | Instancié pour US-125 (session précédente) puis étendu en base de recherche produit |
| `DDS-001.md` | Gabarit générique | **Non modifié** (canonique) — décision projet dans `DDS-LT-001` |
| `DSG-001.md` | Gabarit générique | **Instancié en version 0.1.0 « Proposé »** |
| `design-decision-register.md` | Vide (header seul) | Entrée `DDS-LT-001` ajoutée |
| `design-debt-register-loyertracker.md` | 4 dettes ouvertes (DD-611-01→04) | Statuts mis à jour (jamais Clos) + 7 nouvelles dettes DD-EP17-01→07 |
| `architecture-ux-ui.md`, `frontend-architecture.md`, `frontend-quality-governance.md`, `angular-profile.md`, `check-ux-01.md`, `ux-design-delivery-workflow.md` | Gabarits génériques | **Non modifiés** (référencés, pas instanciés — hors périmètre de cette mission) |
| `product-backlog.md` | Figé depuis Gate 5 (2026-06-04), EP-01→08 | **Non modifié** (convention déjà observée pour EP-09→16 : chaque epic ultérieur vit dans son propre addendum) |

## 6. Décision formalisée

**DDS-LT-001 (Acceptée)** : PrimeNG comme moteur de composants Angular ; Design System
LoyerTracker (tokens sémantiques `--lt-*`) comme source de vérité visuelle ; Keycloak consomme les
mêmes tokens sans dépendance technique à PrimeNG ; Angular Material et Tailwind global écartés ;
classes utilitaires internes limitées et documentées tolérées ; encapsulation `lt-*` pour tout
composant transverse/métier à comportement stable. **ADR-UI-001** couvre l'architecture technique
associée (compatibilité Angular/Keycloak à vérifier formellement, aucune version figée par
supposition, choix de source de tokens partagée recommandé mais non tranché définitivement).

Cette décision est un **socle**, pas un GO de mise en œuvre : aucune installation, aucun code,
aucun déploiement n'en découle automatiquement.

## 7. Fichiers créés

| Fichier | Objet | Statut |
|---|---|---|
| `docs/cgpa/design/decisions/DDS-LT-001-socle-ui-primeng-keycloak.md` | Décision UX/UI de socle | Acceptée (socle) |
| `docs/cgpa/05-architecture-conception/adr/ADR-UI-001-socle-frontend-primeng-design-tokens-keycloak.md` | ADR technique | Acceptée (architecture) |
| `docs/cgpa/design/component-inventory-loyertracker.md` | Inventaire des 11 composants réels | Produit |
| `docs/cgpa/design/screen-inventory-loyertracker.md` | Inventaire des écrans réels + écrans inexistants marqués | Produit |
| `docs/cgpa/design/traceability-ui-loyertracker.md` | Matrice Epic/Story/écran/DDS/DSG/composant/tests | Produit, cases majoritairement « À définir » |
| `docs/cgpa/06-planification-agile/plan-execution-ux-ui-primeng-keycloak.md` | Plan d'Exécution EP-17 | **PROPOSÉ — NON APPROUVÉ — CODE INTERDIT** |
| `docs/cgpa/06-planification-agile/addendum-backlog-ep17-ui-foundation-primeng-keycloak.md` | Nouvel Epic EP-17, US-127→142 | Proposé — À arbitrer |
| `docs/cgpa/checklists/CHECK-UX-01-ep17-ui-foundation.md` | Instance CHECK-UX-01 pour EP-17 | Résultat agrégé **NON EXÉCUTÉ** |
| `docs/cgpa/reports/preparation-chantier-ui-primeng-keycloak-report.md` | Ce rapport | Final |

## 8. Fichiers modifiés

| Fichier | Modification | Justification |
|---|---|---|
| `docs/cgpa/design/DSG-001.md` | Instanciation complète (gouvernance, principes, tokens candidats, modes, mapping composants, composants `lt-*` candidats) | Gabarit générique jusqu'ici vide ; DSG est le seul artefact « instance unique par projet » (contrairement aux DDS), instanciation en place cohérente avec la convention du dépôt |
| `docs/cgpa/design/UXR-001.md` | Extension additive (profils, tâches, irritants, contraintes, parcours critiques, hypothèses, mesures futures) + correction d'une phrase devenue inexacte (« DSG-001 toujours un gabarit vide ») | La revue US-125 existante n'est pas supprimée ; extension clairement délimitée et datée |
| `docs/cgpa/design/design-decision-register.md` | Ajout de la ligne `DDS-LT-001` | Registre vide auparavant, additif |
| `docs/cgpa/design/design-debt-register-loyertracker.md` | Statuts DD-611-01→03 mis à jour (Préparé/En traitement, jamais Clos), 7 nouvelles dettes ajoutées | Logique explicite de la mission, aucune dette fermée automatiquement |
| `docs/project-state.md` | Nouvelle entrée §1 (Derniere mise a jour) et §12 (journal détaillé) | Toute décision significative met à jour le Project State (règle CGPA absolue) |

## 9. Fichiers intentionnellement non modifiés

* `frontend/package.json`, `frontend/package-lock.json`, `frontend/angular.json`
* Tout fichier `frontend/src/**/*.ts`, `*.html`, `*.scss`
* `backend/**`
* `infra/keycloak/realm-loyertracker.json`, `infra/keycloak/realm-loyertracker-production.json`
* `docker-compose.yml`, `docker-compose.prod.yml`, `docker-compose.staging.yml`,
  `docker-compose.monitoring.yml`
* `.github/workflows/**`
* `docs/cgpa/design/DDS-001.md` (gabarit générique canonique)
* `docs/cgpa/design/designops-governance.md`, `docs/cgpa/architecture/architecture-ux-ui.md`,
  `docs/cgpa/frontend/*.md`, `docs/cgpa/checklists/check-ux-01.md`,
  `docs/cgpa/workflows/ux-design-delivery-workflow.md` (gabarits génériques référencés, non
  instanciés — hors périmètre demandé)
* `docs/cgpa/06-planification-agile/product-backlog.md` (figé depuis Gate 5, convention du dépôt)

## 10. Risques

Repris de `DDS-LT-001` et `ADR-UI-001` : RSV-UI-01 (compatibilité PrimeNG × Angular 22 non
vérifiée), RSV-UI-02 (usage anarchique des composants PrimeNG), RSV-UI-03 (divergence de tokens
Angular/Keycloak), RSV-UI-04 (dégradation du budget bundle), RSV-UI-05 (personnalisation Keycloak
affaiblissant la sécurité), RSV-UI-06 (accessibilité PrimeNG incomplète), RSV-UI-07 (thème Keycloak
cassant un flux d'authentification en Staging mutualisé), RSV-UI-08 (divergence de version
Keycloak entre environnements). Tous **Ouverts**, aucun mitigé par ce cadrage documentaire seul.

## 11. Dettes

`DD-611-01` → Préparé ; `DD-611-02`/`DD-611-03` → En traitement (non closes) ; `DD-611-04` →
inchangée. Nouvelles : `DD-EP17-01` (absence thème Keycloak) à `DD-EP17-07` (absence de sélecteurs
de test) — détail complet dans `design-debt-register-loyertracker.md`.

## 12. Gates

* **Gate 02A** : en cours d'instruction pour US-125 (session précédente), non rejoué ni anticipé
  par cette mission.
* **Phase 04A / Gate 04A** : préparés (livrables ci-dessus), non instruits. `CHECK-UX-01` (instance
  EP-17) résultat agrégé **NON EXÉCUTÉ**.
* **Gate DevSecOps** : applicable dès l'ajout réel de PrimeNG (Lot 1), non instruit.
* **Gate Staging** (`STG-ISOL-01`) : applicable aux Lots 3 et 4 (pilotes), non instruit.
* **Gate Production** : hors périmètre de cette mission.

## 13. Preuves produites

Inventaire composants et écrans (lecture exhaustive du code), constat d'absence de bibliothèque UI
et de thème Keycloak (grep exhaustif), comptage réel des couleurs dupliquées, versions exactes
Angular/keycloak-angular/keycloak-js/Keycloak constatées dans les fichiers du dépôt.

## 14. Preuves non exécutées

Rapport de compatibilité PrimeNG × Angular 22 (aucune installation, aucune vérification officielle
réalisée), audit licence/sécurité de la dépendance, mesure de bundle après installation, tests
unitaires/composants/accessibilité/responsive du pilote, Visual Review, rapport thème Keycloak,
validation Product Owner de mise en œuvre, décisions Gate 04A et Gate Staging. Toutes marquées
**« Non exécuté »** dans les documents concernés, jamais présumées.

## 15. Écarts

* Le mapping des couleurs « succès » (`--lt-state-success`) repose sur la variante la plus
  fréquente parmi plusieurs valeurs vertes légèrement différentes observées dans le code —
  harmonisation complète différée au Lot 1/2, signalé dans `DSG-001.md`.
* Aucune vérification empirique de connectivité mobile réelle des utilisateurs (hypothèse non
  validée, tracée comme telle dans `UXR-001.md`).
* Le choix Option A/B (source de tokens partagée Angular/Keycloak) est recommandé (Option B) mais
  non tranché définitivement — à confirmer au Lot 0.

## 16. Recommandations

* Désigner sans délai un UX/UI Design Lead et un Design Architect : aucun des livrables de ce
  dossier n'a de validateur humain nommé à ce jour, ce qui bloque toute progression vers le Gate
  04A.
* Vérifier officiellement la compatibilité PrimeNG × Angular 22.0.8 avant toute autre décision
  technique (US-128) — ne jamais présumer une version.
* Trancher explicitement l'Option A/B de tokens partagés avant le Lot 4 (thème Keycloak) pour
  éviter une double maintenance manuelle.
* Confirmer le périmètre exact du pilote Angular (Lot 3) avec le Product Owner avant tout codage.

## 17. Prochaine action autorisée

Soumettre ce dossier complet (`DDS-LT-001`, `ADR-UI-001`, `DSG-001`, `UXR-001` étendu, inventaires,
matrice de traçabilité, registres mis à jour, Plan d'Exécution, addendum backlog EP-17, instance
`CHECK-UX-01`) au Product Owner et aux rôles CGPA requis (UX/UI Design Lead, Design Architect,
Frontend Architect, DevSecOps Lead — tous à désigner).

## 18. Actions explicitement interdites

Aucune installation de PrimeNG, aucune modification de `package.json`/`package-lock.json`, aucune
création ou modification de composant Angular applicatif, aucune modification des écrans
existants, aucune modification du comportement de Keycloak, aucun déploiement de thème Keycloak,
aucune modification des fichiers de realm, aucune action sur les environnements Dev, Staging ou
Production — tant que le Plan d'Exécution et le Gate Design Readiness ne sont pas approuvés.

## 19. Résumé exécutif

La décision de socle UI de LoyerTracker (PrimeNG + Design Tokens + thème Keycloak) est désormais
formalisée dans les artefacts CGPA (`DDS-LT-001`, `ADR-UI-001`), appuyée sur un audit factuel
complet du frontend (11 composants, aucune bibliothèque UI, aucun token, aucun thème Keycloak) et
sur les livrables déjà produits pour US-125. Le Design System LoyerTracker (`DSG-001`) est
instancié en version 0.1.0 « Proposé », un nouvel Epic EP-17 (16 stories, 68 points) est préparé, et
un Plan d'Exécution en 7 lots est proposé mais **non approuvé**. Aucune ligne de code, aucune
dépendance et aucun déploiement n'ont été produits par cette mission. Le chantier est **prêt à être
soumis à validation**, dans l'attente de la désignation des rôles CGPA requis et d'un GO explicite
du Product Owner sur le Plan d'Exécution.
