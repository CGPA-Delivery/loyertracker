# Décision GO / NO GO CGPA v6.1.1 — Gate 02A, instance EP-17 Lot 5 (Validation)

> Instance du gabarit `docs/cgpa/templates/go-no-go.md`, même convention que
> `gate-02A-decision-ep17-lot4.md`. **Différence structurelle avec les instances Lot 3/Lot 4** :
> celles-ci introduisaient de nouveaux écrans (migration Angular, thème Keycloak). Le Lot 5 ne
> produit **aucun nouvel écran** — il valide, teste et documente les écrans déjà livrés par les
> Lots 1 à 4. L'instruction de ce Gate 02A est donc allégée : les parcours et maquettes existent
> déjà, validés par les Gates précédents. **La section 6 est volontairement laissée non renseignée
> par Claude Code** — seul le Product Owner peut la compléter.

## 1. Identification

* ID décision : `GATE-02A-EP17-LOT5-2026-08-10`
* Projet : LoyerTracker
* Gate ou jalon évalué : Gate 02A — UX Gate (`docs/cgpa/gates/gate-02A-ux-design-readiness.md`)
* Phase : Phase 02 → Gate 02A → Phase 03, périmètre EP-17 Lot 5 (Validation :
  `plan-execution-ux-ui-primeng-keycloak.md` §3 « Lot 5 — Validation »)
* Environnement source et cible : Aucun à ce stade — documentaire. Le Lot 5 couvre la validation
  des Lots 1-4 déjà livrés (PrimeNG, composants `lt-*`, pilote Angular Patrimoines/Biens, thème
  Keycloak), et prépare le Gate Staging du pilote.
* Artefact, version, commit ou digest : Lots 1-4 mergés sur `main` ; thème Keycloak déployé en
  Production (`KEYCLOAK_THEME_DEPLOYED`, 2026-08-04) ; `phase-02-user-journeys-ep17-lot3.md`,
  `phase-02-ui-mockups-ep17-lot3.md`, `phase-02-user-journeys-ep17-lot4.md`,
  `phase-02-ui-mockups-ep17-lot4.md` (produits et vérifiés)
* Date : 2026-08-10
* Décision précédente référencée : `gate-02A-decision-ep17-lot4.md` (GO sous réserve, Lot 4,
  2026-08-03) — périmètre épuisé par la livraison et le déploiement Production du Lot 4

## 2. Périmètre et applicabilité

* Contrôles applicables : les 11 points de contrôle GO de `gate-02A-ux-design-readiness.md`,
  évalués contre le périmètre du Lot 5 tel que décrit par le Plan d'Exécution §3 et l'addendum
  backlog EP-17 (US-136 à US-141).
* **Nature du Lot 5** : validation, pas de nouvel écran. Les stories US-136 (Accessibilité),
  US-137 (Responsive), US-138 (Régression visuelle), US-139 (Documentation), US-140 (Gate 04A
  pilote) et US-141 (Gate Staging pilote) sont des activités de contrôle qualité et de
  gouvernance, pas de développement Frontend.
* **Conséquence pour ce Gate 02A** : les critères « personas », « user journeys », « maquettes »
  et « navigation » sont déjà couverts par les instances Lot 3 et Lot 4 — ce Gate 02A Lot 5
  vérifie qu'ils restent valides et complets après livraison, sans exiger de nouvelle production
  UX.
* Exemptions justifiées : aucune posée par cette instance.

## 3. Preuves et résultats — les 11 critères du Gate 02A appliqués au Lot 5

| Critère | Constat pour le périmètre Lot 5 | Preuve |
| --- | --- | --- |
| Personas validés | **Déjà couvert** — `UXR-001.md` couvre Bailleur/Gestionnaire ; les instances Lot 3/Lot 4 n'ont pas introduit de nouveau persona | `UXR-001.md` ; `gate-02A-decision-ep17-lot3.md` §3 ; `gate-02A-decision-ep17-lot4.md` §3 |
| User journeys documentés | **Déjà couvert** — `phase-02-user-journeys-ep17-lot3.md` (Patrimoines/Biens), `phase-02-user-journeys-ep17-lot4.md` (6 écrans Keycloak) | `docs/cgpa/phases/phase-02-user-journeys-ep17-lot3.md` ; `docs/cgpa/phases/phase-02-user-journeys-ep17-lot4.md` |
| Parcours critiques identifiés | **Déjà couvert** — J-Lot3-1 (dashboard Patrimoines), J-Lot4-1 (connexion), J-Lot4-4 (erreur générique) | Documents ci-dessus |
| Cas nominaux et cas d'erreur documentés | **Déjà couvert** — les deux documents de parcours couvrent cas nominaux et erreurs ; `DD-EP17-14` (SMTP cassé) documenté comme erreur connue | `phase-02-user-journeys-ep17-lot4.md` J-Lot4-2 |
| Information architecture validée | **Déjà couvert** — `phase-02-information-architecture.md` §1 (Angular) ; pages Keycloak hors routing Angular, documenté en Gate 02A Lot 4 | `phase-02-information-architecture.md` ; `gate-02A-decision-ep17-lot4.md` §3 |
| Navigation globale stabilisée | **Déjà couvert** — Angular : routes inchangées par EP-17 ; Keycloak : redirections OIDC non modifiées (`ADR-UI-001` §Sécurité) | `frontend/src/app/app.routes.ts` ; `ADR-UI-001` §Sécurité |
| Design system validé | **Déjà couvert** — `DSG-001.md` v0.2.0, tokens `--lt-*` implémentés (`tokens.css` + `_lt-tokens.scss`), `DD-EP17-03` close | `DSG-001.md` ; `infra/keycloak/themes/loyertracker/login/resources/css/tokens.css` ; `frontend/src/styles/tokens/_lt-tokens.scss` |
| Responsive strategy définie | **Déjà couvert** — `DSG-001.md` §Responsive Rules ; breakpoint 640px ; thème Keycloak déjà responsive (vérifié, `phase-02-ui-mockups-ep17-lot4.md` §5) | `DSG-001.md` ; `phase-02-ui-mockups-ep17-lot4.md` §5 |
| Accessibilité minimale définie | **Déjà couvert** — cible WCAG 2.2 AA (`DSG-001.md` §Accessibilité) ; US-136 doit produire les preuves | `DSG-001.md` §Accessibilité |
| Maquettes des écrans critiques disponibles | **Déjà couvert** — `phase-02-ui-mockups-ep17-lot3.md` (Patrimoines/Biens), `phase-02-ui-mockups-ep17-lot4.md` (6 écrans Keycloak), recoupées avec l'implémentation réelle | `docs/cgpa/phases/phase-02-ui-mockups-ep17-lot3.md` ; `docs/cgpa/phases/phase-02-ui-mockups-ep17-lot4.md` |
| Validation Product Owner obtenue | **Objet de cette soumission** — non obtenue au moment de la rédaction | §6 |

## 4. Bloqueurs et réserves

| ID | Type | Impact | Autorité d'acceptation | Responsable | Échéance | Preuve attendue | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| — (preuves US-136 accessibilité non produites) | Réserve | Les audits WCAG 2.2 AA automatisés et manuels clavier n'ont pas encore été exécutés sur les écrans pilotés | Product Owner | QA Lead | Pendant le Lot 5 | `CHECK-ACCESSIBILITY-01` PASS ou PASS sous réserve | Ouvert |
| — (preuves US-137 responsive non produites) | Réserve | Les tests au breakpoint 640px et sur viewport mobile réel n'ont pas encore été exécutés | Product Owner | QA Lead | Pendant le Lot 5 | `CHECK-RESPONSIVE-01` PASS | Ouvert |
| — (preuves US-138 régression visuelle non produites) | Réserve | Les captures baseline (US-127) n'ont pas encore été comparées aux captures post-pilote | Product Owner | Design QA | Pendant le Lot 5 | Rapport de Visual Review | Ouvert |
| — (US-139 documentation non mise à jour) | Réserve | `DSG-001.md`, `component-inventory-loyertracker.md`, `traceability-ui-loyertracker.md` doivent refléter l'état post-pilote | Product Owner | Technical Writer | Pendant le Lot 5 | Documents versionnés et incrémentés | Ouvert |
| DD-EP17-14 | Réserve existante, Majeur | Flux « mot de passe oublié » cassé (HTTP 500, SMTP absent) — ne bloque pas le Lot 5 mais reste une dette de Production | Product Owner | DevSecOps Lead | Suivi propre | Résolution SMTP ou acceptation explicite | Ouvert |
| DD-EP17-13 | Réserve existante, Majeur | Traduction française des écrans Keycloak — partiellement traitée (connexion en français, `DD-EP17-13` close), mais les autres écrans restent à vérifier | Product Owner | UX/UI Design Lead | Pendant le Lot 5 | Vérification langue française sur les 6 écrans | Ouvert |

## 5. Avis spécialisés

| Agent | Avis | Réserves |
| --- | --- | --- |
| UX/UI Design Lead (Claude Code, désigné 2026-07-30, limite d'indépendance tracée) | **GO sous réserve** — les 11 critères du Gate 02A sont structurellement couverts par les instances Lot 3 et Lot 4. Le Lot 5 n'introduit aucun nouvel écran ni nouveau parcours : c'est un lot de validation, pas de conception. Les réserves portent sur l'absence de preuves d'exécution (accessibilité, responsive, régression visuelle, documentation) — à produire pendant le Lot 5, pas avant son démarrage | `DD-EP17-14` (SMTP) et `DD-EP17-13` (langue Keycloak) restent des dettes de Production à suivre, mais ne bloquent pas la validation des écrans déjà livrés |

* Décision spécialisée Release Manager, si applicable : Non applicable à ce stade.

## 6. Décision finale

**Décision** : **GO sous réserve**.

**Instruction reçue (2026-08-10)** : « Je valide aussi la prochaine étape », du Product Owner /
CGPA Chief Delivery Officer, en réponse à la soumission de cette instance et de
`gate-04A-decision-ep17-lot5.md`.

**Portée de la décision** : ce GO sous réserve couvre le périmètre de ce Gate 02A tel qu'instruit
(§1-§5) — validation UX des écrans déjà livrés par les Lots 1 à 4, sans nouvelle production de
parcours ni de maquettes. Le Lot 5 (US-136 à US-141) est autorisé à démarrer.

**Réserves qui subsistent après ce GO** :
* Preuves US-136 (accessibilité WCAG 2.2 AA) à produire pendant le Lot 5 — `CHECK-ACCESSIBILITY-01`
  PASS ou PASS sous réserve requis avant clôture du Lot.
* Preuves US-137 (responsive, breakpoint 640px) à produire pendant le Lot 5 — `CHECK-RESPONSIVE-01`
  PASS requis avant clôture du Lot.
* Preuves US-138 (régression visuelle) à produire pendant le Lot 5 — rapport de Visual Review requis
  avant clôture du Lot.
* US-139 (documentation) — `DSG-001.md`, `component-inventory-loyertracker.md`,
  `traceability-ui-loyertracker.md` à mettre à jour avant clôture du Lot.
* `DD-EP17-14` (SMTP cassé) — suivi propre, ne bloque pas le Lot 5.
* `DD-EP17-13` (langue Keycloak) — close pour l'écran de connexion, vérification des 5 autres
  écrans à produire pendant le Lot 5.

**Ce que ce GO n'autorise pas** : conformément à `CLAUDE.md` (« aucun code applicatif sans Plan
d'Exécution approuvé »), ce GO sous réserve de Gate 02A ne vaut à lui seul ni extension du Plan
d'Exécution au Lot 5, ni autorisation de développement. L'extension du Plan d'Exécution reste une
action Product Owner distincte, préalable à tout travail du Lot 5.

## 7. Traçabilité

* Mise à jour `/docs/project-state.md` : entrée d'instruction à ajouter lors de la soumission.
* Rédacteur : Claude Code, en tant que UX/UI Design Lead désigné
  (`agent-designations-loyertracker.md`), limite d'indépendance tracée.
* Décision et validation humaine : en attente (§6).
