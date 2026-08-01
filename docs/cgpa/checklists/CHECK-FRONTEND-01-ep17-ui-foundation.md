# Avis Frontend Architect — Gate 04A (`CHECK-FRONTEND-01`), instance EP-17

> Instance projet du gabarit `docs/cgpa/checklists/check-frontend-01.md` (non modifié), sur le
> même principe que `CHECK-UX-01-ep17-ui-foundation.md` (Design Architect) et
> `CHECK-DEVSECOPS-01-ep17-lot1-readiness.md` (DevSecOps Lead). Produit par Claude Code en tant
> que **Frontend Architect**, sous-agent CGPA désigné le 2026-07-31
> (`docs/cgpa/agents/agent-designations-loyertracker.md`).

| Champ | Valeur |
|---|---|
| Lot | EP-17 — Fondation UX/UI et continuité d'identité Angular–Keycloak |
| Date | 2026-07-31 |
| Gate concerné | Gate 04A (`gate-04A-design-readiness.md`), critère « Architecture Frontend → `CHECK-FRONTEND-01` » |
| Résultat global | **NON EXÉCUTÉ** (cohérent avec le résultat agrégé déjà établi par `CHECK-UX-01-ep17-ui-foundation.md`) |
| Limite d'indépendance | Claude Code est co-auteur des artefacts revus ici (`ADR-UI-001`, `DSG-001`, `traceability-ui-loyertracker.md`) — limite déjà tracée pour les trois autres rôles désignés, identique ici. |

## Constat de départ — ce qui existe déjà réellement dans le code

Contrairement à `CHECK-UX-01` (système de composants inexistant), une partie du périmètre
Frontend Architect est déjà en place dans le code actuel, vérifié par lecture directe :

* **Architecture par domaines** : `frontend/src/app/` est déjà structuré par domaine
  (`bailleur/`, `gestionnaire/`, `alertes/`, `audit/`, `garanties/`, `honoraires/`, `paiements/`,
  `public/`, `shared/`, `core/`), conforme au principe `frontend-architecture.md` §Structure.
* **Routing et lazy loading** : `app.routes.ts` utilise déjà `loadComponent` (chargement paresseux
  par route, pas de `NgModule`), avec `authGuard` sur les routes protégées et une route publique
  explicite (`verify/receipt/:id`) pour la vérification tierce de quittance.

Ces deux points constituent une base réelle, non une simple intention documentaire.

## Contrôles

| Contrôle | Preuve | Résultat | Bloquant |
|---|---|---|---|
| Architecture par features/domaines | Structure `frontend/src/app/*` existante (voir ci-dessus) ; continuité pour les nouveaux composants `lt-*`/`design-system/` **non confirmée explicitement** par `ADR-UI-001` | **Préparation en cours** | Oui |
| Routing, lazy loading et erreurs | `app.routes.ts` (lazy loading + guard déjà en place) ; fallback `**` silencieux vers `/bailleur` déjà tracé comme dette (`DD-EP17-02`, non close) ; aucune nouvelle route EP-17 documentée (composants transverses, pas des routes) | **Préparation en cours** | Oui |
| Stratégie d'état justifiée | **Aucune stratégie documentée** : services (`profil.service.ts`, `s02/s03/s04-api.service.ts`) exposent des `Observable` consommés par des champs de composant, jamais formalisé, `ADR-UI-001` ne couvre pas le sujet — dette nouvellement identifiée par cet avis (`DD-EP17-08`) | **Non exécuté** | Oui |
| Shared library gouvernée | `ADR-UI-001` §Stratégie d'encapsulation `lt-*`, §Versioning (SemVer) ; `DSG-001.md` §Ownership (Design Architect + Frontend Architect) ; aucun composant publié | **Préparation en cours** | Oui |
| Mapping DSG et tokens | `ADR-UI-001` §Architecture des Design Tokens, `DSG-001.md` §Tokens/§Composants ; valeurs candidates non validées visuellement | **Préparation en cours** | Oui |
| Architecture CSS/SCSS | `ADR-UI-001` §Architecture des styles (4 couches : fondations/thème PrimeNG/composants/utilitaires limités), isolation `ViewEncapsulation.Emulated` déjà en usage natif Angular | **Préparation en cours** | Oui |
| Budgets et performance | Budgets actuels connus et cités (`angular.json` : 1mb/2.5mb bundle, 4kb/8kb style composant) ; mesure avant/après PrimeNG planifiée au Lot 1, non réalisée (aucune dépendance installée) | **Non exécuté** | Oui |
| Component, accessibility et responsive tests | `ADR-UI-001` §Tests : « Non produits par cette ADR », renvoyé au Lot 5 sans détail technique (framework, seuils de couverture) à ce stade | **Non exécuté** | Oui |

## Revue de `traceability-ui-loyertracker.md` (DD-611-03)

Relue en tant que Frontend Architect, responsable désigné de la levée de `DD-611-03`. La matrice
est structurellement correcte (colonnes Epic/Story → Écran → DDS/DSG → composant → preuves de
test) mais **la majorité des cases restent « À définir »** (tests unitaires, a11y, responsive pour
quasiment toutes les stories EP-17). Conformément à la règle propre du document (« toute case non
définie porte la mention À définir, jamais une valeur inventée »), **aucune approbation
Frontend Architect n'est donnée à ce stade** — `DD-611-03` reste **non close**, statut inchangé.

## Lecture du résultat

Sur 8 contrôles : **0 PASS**, **5 « Préparation en cours »**, **3 « Non exécuté »**, **0 FAIL**.
Conformément au Validation Framework CGPA v6.1.1 (§8, règle d'agrégation 2 : « tout contrôle
bloquant non exécuté impose NO GO »), le résultat agrégé de cette instance est :

**Résultat agrégé : NO GO (en l'état) — confirme, sous un angle Architecture Frontend, le NO GO
déjà établi par `CHECK-UX-01-ep17-ui-foundation.md` et l'avis Design Architect (`DSG-001.md`).**

## Avis Frontend Architect

**Proposition : NO GO en l'état pour le Gate 04A** — non un jugement défavorable sur la base
existante (architecture par domaines et lazy loading déjà réels et sains), mais l'application
stricte de la règle d'agrégation : trois contrôles bloquants restent non exécutés, dont un
nouvellement identifié (stratégie d'état).

* **Nouvelle dette ajoutée** : `DD-EP17-08` (stratégie d'état absente), `design-debt-register-loyertracker.md`
  — Majeur, Frontend Architect, échéance avant Lot 2.
* **Dettes déjà assignées au Frontend Architect, non résolues par cet avis** : `DD-611-03`
  (traçabilité, non close), `DD-EP17-02` (état accès refusé/404), `DD-EP17-04` (hétérogénéité
  composants, Lot 2), `DD-EP17-07` (sélecteurs de test, conditionnel).
* **Ce qui n'a pas besoin d'être refait** : l'architecture par domaines et le lazy loading actuels
  sont une fondation valable pour EP-17 — aucune réécriture recommandée, seule une confirmation
  explicite dans `ADR-UI-001` que cette structure reste la cible reste à ajouter (non bloquant en
  soi, clarification documentaire).

**Ce que cet avis ne fait PAS** :

* **Aucune décision de Gate** — la décision GO/GO sous réserve/NO GO reste au CGPA Chief Delivery
  Officer (Product Owner), conformément à `chief-delivery-officer.md` et `CLAUDE.md`.
* **Aucune clôture de dette** au-delà de la preuve documentaire réelle produite ici — `DD-611-03`
  reste explicitement non close.
* **N'autorise aucun développement Frontend** — `plan-execution-ux-ui-primeng-keycloak.md` reste
  « PROPOSÉ — NON APPROUVÉ — CODE INTERDIT ».

## Note de mise à jour (2026-07-31, postérieure à cet avis)

Deux évolutions matérielles depuis cet avis, toutes deux tracées dans
`design-debt-register-loyertracker.md` et `gate-04A-decision-ep17-lot0.md` §4 :

* **« Stratégie d'état justifiée »** (ligne ci-dessus, « Non exécuté ») : une stratégie a depuis
  été documentée (`ADR-UI-001` §Stratégie d'état) et acceptée par le Product Owner sans réserve
  (`DD-EP17-08`, close). Reclassée **Préparation en cours** — documentée et acceptée, mais non
  testée/implémentée, donc pas `PASS`.
* **Revue de `traceability-ui-loyertracker.md` (`DD-611-03`)** : un avis de validation de contenu
  distinct, séparé de cette revue de readiness, a depuis été rendu (`traceability-ui-loyertracker.md`
  §Avis de validation — neuf affirmations exactes sur neuf) et accepté par le Product Owner sans
  réserve comme validation humaine du contenu. `DD-611-03` reste toutefois **non close** : les
  preuves de test par Story restent structurellement inexistantes.

**Décompte agrégé mis à jour** : sur 8 contrôles, **0 PASS**, **6 « Préparation en cours »**,
**2 « Non exécuté »** (Budgets et performance ; Component/accessibility/responsive tests — tous
deux nécessitant une implémentation réelle, non substituables par de la documentation). Conformément
à la règle d'agrégation 2, le résultat agrégé reste **NO GO (en l'état)** — inchangé dans sa
conclusion, mais pour un motif réduit à ces deux seuls contrôles restants. Contenu de l'avis
d'origine non réécrit, conformément à la préservation des décisions historiques (`CLAUDE.md`).

## Note de mise à jour (2026-08-01, postérieure à cet avis) — Lot 1 livré

Le Lot 1 (`US-129`/`US-130`/`US-131`) est mergé sur `main` (PR #331-334) — implémentation réelle,
pas seulement une intention documentaire. Trois lignes évoluent :

* **« Budgets et performance »** (notait « mesure … planifiée, non réalisée, aucune dépendance
  installée ») : PrimeNG installé, mesure avant/après réalisée — `333,32 kB → 514,07 kB`
  (transfert estimé `91,23 kB → 123,50 kB`), soit **~50 % du budget** `angular.json` (1 Mo
  avertissement, 2,5 Mo erreur), aucun avertissement à la compilation. Reclassée **Préparation en
  cours** (mesure de bundle réelle obtenue ; « performance » au sens large — Lighthouse,
  perçue — reste non mesurée, cf. `CHECK-UX-01` « Performance UX/perçue », non bloquant, toujours
  Non exécuté).
* **« Architecture CSS/SCSS »** (notait « 4 couches documentées dans `ADR-UI-001`, aucune
  implémentation ») : implémentée réellement (`US-131`, `frontend/src/styles/{foundations,theme,
  components,utilities}/`), preuve d'absence de régression visuelle par diff CSS sémantique
  (`project-state.md`, 2026-08-01). Reclassée **PASS**.
* **« Mapping DSG et tokens »** (notait « valeurs candidates non validées visuellement ») : même
  évolution que `CHECK-UX-01` « Tokens » — `DDS-LT-006` acceptée, tokens validés et partiellement
  adoptés. Reclassée **PASS**.

**Décompte recalculé** : sur 8 contrôles, **2 PASS** (Architecture CSS/SCSS, Mapping DSG et
tokens), **5 « Préparation en cours »** (dont Budgets et performance, reclassé), **1 « Non
exécuté »** (Component/accessibility/responsive tests — nécessite des composants `lt-*` réels,
objet du Lot 2). Conformément à la règle d'agrégation 2, le résultat agrégé reste **NO GO (en
l'état)** pour un Gate 04A global EP-17 complet, motif réduit à ce seul contrôle — sans préjuger
d'un GO sous réserve limité au Lot 2 (`gate-04A-decision-ep17-lot2.md`). Contenu de l'avis
d'origine non réécrit, conformément à la préservation des décisions historiques (`CLAUDE.md`).
