# Matrice de traçabilité UI — LoyerTracker

| Champ | Valeur |
|---|---|
| Objet | Relier Epic/Story, parcours, écran, DDS, DSG, composant technique et preuves de test |
| Périmètre | Chantier socle UI PrimeNG/Design Tokens/Keycloak (EP-17) + US-125 (EP-16 Lot B) |
| Statut | Préparatoire — prépare la levée de `DD-611-03` (traçabilité Story-écran-composant-test) |
| Règle | Toute case non définie porte la mention **À définir**, jamais une valeur inventée |

| Epic/Story | Parcours | Écran | DDS | DSG | Composant technique | Test unitaire | Test a11y | Test responsive | Visual Review | Statut |
|---|---|---|---|---|---|---|---|---|---|---|
| EP-17 / US-127 (audit UI et baseline) | — | Tous (transverse) | `DDS-LT-001` | `DSG-001` v0.1.0 | — | À définir | À définir | À définir | À définir | Documenté, non codé |
| EP-17 / US-128 (validation version PrimeNG) | — | — | `DDS-LT-001` | `DSG-001` §Compatibilité | — | À définir | Non applicable | Non applicable | Non applicable | Non exécuté |
| EP-17 / US-129 (tokens) | — | Tous (transverse) | `DDS-LT-001` | `DSG-001` §Tokens | `tokens.css` (candidat) | À définir | Non applicable | Non applicable | À définir | Non exécuté |
| EP-17 / US-130 (thème PrimeNG) | — | Tous (transverse) | `DDS-LT-001` | `DSG-001` §Composants | — | À définir | À définir | À définir | À définir | Non exécuté |
| EP-17 / US-131 (architecture SCSS) | — | Tous (transverse) | `ADR-UI-001` | `DSG-001` §Fondations | `frontend/src/styles.scss` (à étendre) | À définir | Non applicable | Non applicable | Non applicable | Non exécuté |
| EP-17 / US-132 (composants transverses) | J1 (préférences, `phase-02-user-journeys.md`) | `/bailleur/profil` (source, runtime à corriger) | `DDS-LT-001` | `DSG-001` v0.3.0 §État post-pilote | `lt-page-header`, `lt-stat-card`, `lt-status-tag`, `lt-empty-state`, `lt-data-table`, `lt-confirm-dialog`, `lt-form-field`, `lt-toast` — implémentés | Tests unitaires CI Frontend PASS | Couverture composant détaillée non prouvée | Dashboard Bailleur / Login Keycloak contrôlés ; autres routes runtime non vérifiables | `CHECK-VISUAL-REGRESSION-01` — périmètre partiel | Livré ; preuves runtime partielles |
| EP-17 / US-133 (pilote dashboard) | Dashboard Bailleur | `/bailleur` | `DDS-LT-001` | `DSG-001` §État post-pilote | `BailleurDashboardComponent` + composants `lt-*` | Tests unitaires CI Frontend PASS | Parcours Angular authentifié non couvert par US-136 | Responsive PASS (`overflowX=0`) | Dashboard Bailleur PASS | Livré ; runtime vérifié |
| EP-17 / US-134 (pilote biens) | Liste/détail Patrimoines-Biens | `/bailleur` (section Biens) | `DDS-LT-001` | `DSG-001` §État post-pilote | Sections biens/patrimoines de `BailleurDashboardComponent` | Tests unitaires CI Frontend PASS | Parcours Angular authentifié non couvert par US-136 | Données métier insuffisantes pour validation complète | Inclus dans Dashboard Bailleur PASS, données insuffisantes | Livré ; validation complète réservée |
| EP-17 / US-135 (thème Keycloak) | Login, mot de passe oublié, erreurs | Écrans Keycloak (hors Angular) | `ADR-UI-001` §Stratégie de thème Keycloak | `DSG-001` §État post-pilote | `infra/keycloak/themes/loyertracker/login/` — CSS + `template.ftl`/`login.ftl` ciblés | Test thème dédié + CI PASS | 6 flux Keycloak PASS (US-136) | Login contrôlé ; `overflowX=10px` | Login PASS sous réserve `RES-VR-04` | Livré avec réserve visuelle |
| EP-17 / US-136 (accessibilité) | Six parcours Keycloak | Transverse Keycloak | — | `DSG-001` §Accessibilité | Thème + tests E2E | CI PASS | 6/6 flux Keycloak PASS ; Angular authentifié reste ouvert | Non applicable | Non applicable | GO sous réserve |
| EP-17 / US-137 (responsive) | Écrans pilotés réellement accessibles | Dashboard Bailleur, Login Keycloak | — | `DSG-001` §Responsive Rules | Build/runtime contrôlé | Non applicable | Non applicable | Dashboard Bailleur PASS ; Login Keycloak sous réserve ; autres routes redirigées | Preuves US-138 croisées | GO sous réserve |
| EP-17 / US-138 (régression visuelle) | Écrans pilotés réellement accessibles | Dashboard Bailleur, Login Keycloak | — | `DSG-001` §État post-pilote | Captures `evidence/ep17-us138/` | Non applicable | Non applicable | 640px/390px capturés | Dashboard PASS ; Keycloak `overflowX=10px` ; baseline US-127 absente | GO sous réserve |
| EP-17 / US-139 (documentation) | État post-pilote | Toutes | Toutes | `DSG-001` v0.3.0 | Inventaire + matrice mis à jour | Revue documentaire à exécuter en CI | Liens US-136 établis | Liens US-137 établis | Liens US-138 établis | En cours — soumission PR requise |
| EP-17 / US-140 (Gate 04A) | — | — | Toutes | `DSG-001` v0.3.0 | — | Non applicable | Preuve US-136 liée | Preuve US-137 liée avec réserves | Preuve US-138 liée avec réserves | À ré-instruire après US-139 |
| EP-17 / US-141 (Gate Staging du pilote) | — | — | — | — | — | Non applicable | Non applicable | Non applicable | Non applicable | Déjà GO / STAGING_DEPLOYED ; documentation rectifiée postérieurement |
| EP-17 / US-142 (stratégie migration restante) | Baux, locataires, gestionnaires, affectations, garanties, honoraires, alertes, quittances, audit | `/bailleur`, `/gestionnaire` (sections) | — | — | Tous composants de `component-inventory-loyertracker.md` restants | À définir | À définir | À définir | À définir | Non exécuté |
| EP-16/US-125 (préférences et historique notifications) | J1/J2/J3 (`phase-02-user-journeys.md`) | `/bailleur/profil` (source), sections dashboards | `DDS-LT-001` (socle) ; DDS candidates listées dans `UXR-001.md` | `DSG-001` v0.3.0 | `NotificationsPreferencesComponent`, `NotificationsHistoriqueComponent` — implémentés | Tests unitaires CI Frontend PASS | Parcours Angular authentifié non couvert par US-136 | Non rendu faute de données de test | Non rendu faute de données de test | Livré ; validation runtime réservée |

## Légende des statuts

* **Documenté, non codé** : livrable de cadrage produit, aucune ligne de code.
* **Non exécuté** : au sens du Validation Framework CGPA v6.1.1 §5 — applicable mais preuve non
  encore disponible, jamais présumé PASS.
* **Bloqué** : dépendance explicite non levée (Gate non statué, rôle non désigné).

## Numérotation des User Stories EP-17

US-127 à US-142 (16 stories, suite de US-126 dernière occupée par EP-16) — cf.
`addendum-backlog-ep17-ui-foundation-primeng-keycloak.md` pour le détail complet (critères GWT,
points, dépendances).

## Traçabilité inverse (registres)

* `design-decision-register.md` : entrée `DDS-LT-001`/`ADR-UI-001`.
* `design-debt-register-loyertracker.md` : `DD-611-01`→`04` (statuts mis à jour), nouvelles dettes
  UI ajoutées.
* `check-ux-01` (instance EP-17) : tous contrôles `Non exécuté`/`Préparation en cours`.

## Avis de validation Frontend Architect — DD-611-03 (2026-07-31)

> Produit par Claude Code en tant que **Frontend Architect désigné**, à l'instruction explicite du
> Product Owner (« produis l'avis DD-611-03 avec le Frontend Architect »). Distinct de la revue
> déjà rendue dans `CHECK-FRONTEND-01-ep17-ui-foundation.md` §« Revue de `traceability-ui-loyertracker.md`
> (DD-611-03) » (2026-07-31, readiness du Gate 04A) : celui-ci porte sur la **validation du
> contenu** de cette matrice elle-même, sur le même principe que l'avis Design Architect rendu pour
> `DD-611-02` (`DSG-001.md` §Avis de validation). Même limite d'indépendance qu'ailleurs dans ce
> chantier : Claude Code est co-auteur de l'artefact revu ici.

### Méthode

Recoupement direct de chaque affirmation factuelle de la matrice (colonne « Composant
technique ») avec le code réel (`frontend/src/app/**`), pas une relecture éditoriale de la
structure — une validation qui ne vérifie pas les preuves qu'elle valide n'en est pas une.

### Constats vérifiés exacts

| Affirmation (ligne de la matrice) | Vérification | Résultat |
|---|---|---|
| `BailleurDashboardComponent` existe (US-133/US-134) | `grep "^export class" bailleur/dashboard/dashboard.component.ts` | **Exact** |
| `GestionnaireDashboardComponent` existe (référence transverse) | `grep "^export class" gestionnaire/dashboard/dashboard.component.ts` | **Exact** |
| Sections biens/patrimoines dans `BailleurDashboardComponent` (US-134) | `Bien`, `BienPayload`, `Patrimoine`, `PatrimoinePayload` importés et utilisés | **Exact** |
| `/bailleur/profil` déjà route existante, « étendu » (US-125, US-132) | `app.routes.ts` : route `bailleur/profil` → `ProfilComponent` | **Exact** |
| `profil.service.ts`, `s02/s03/s04-api.service.ts` exposent les `Observable` cités (référence `DD-EP17-08`) | Fichiers présents à `bailleur/profil/`, `core/s02/`, `core/s03/`, `core/s04/` | **Exact** |
| `tokens.css` non créé, « candidat » (US-129) | `find -iname tokens.css` | **Exact** — 0 résultat |
| `lt-page-header`, `lt-stat-card`, `lt-status-tag`, `lt-empty-state`, `lt-data-table`, `lt-confirm-dialog`, `lt-form-field` non codés, « candidats » (US-132) | `find -iname "lt-*"` ; recoupement avec `DSG-001.md` §Composants LoyerTracker candidats | **Exact** — 0 résultat, sept noms cohérents avec `DSG-001.md` |
| `NotificationsPreferencesComponent`, `NotificationsHistoriqueComponent` non codés, « candidats » (US-125) | `find -iname "*notification*"` sous `frontend/src/app` | **Exact** — 0 résultat |
| `infra/keycloak/themes/loyertracker/` non créé (US-135) | `find` sous `infra/keycloak` | **Exact** — seuls les fichiers de realm existent, aucun répertoire de thème |
| `frontend/src/styles.scss` existant, « à étendre » (US-131) | Fichier présent à la racine `frontend/src` | **Exact** |

Neuf affirmations recoupées, **neuf exactes** — aucune inexactitude trouvée dans cette matrice
(à la différence de la validation `DD-611-02`, qui en avait trouvé une dans `DSG-001.md`).

### Verdict de validation

**Validation partielle** — la matrice est **structurellement correcte et factuellement exacte**
sur les neuf affirmations vérifiables recoupées avec le code réel ; la règle propre du document
(« toute case non définie porte la mention À définir, jamais une valeur inventée ») est
**respectée sans exception constatée**. Le Frontend Architect **valide donc la structure et
l'exactitude factuelle de la matrice en l'état**.

Cette validation ne suffit toutefois pas à clore `DD-611-03`. La dette porte précisément sur la
**complétude de la traçabilité Story-écran-composant-test** — c'est-à-dire l'existence de preuves
de test (unitaire, a11y, responsive, Visual Review) par Story, pas seulement l'exactitude des
colonnes déjà renseignables sans code. Or ces preuves sont **structurellement inexistantes** :
aucun composant `lt-*` ni `Notifications*` n'est codé, et
`plan-execution-ux-ui-primeng-keycloak.md` reste « PROPOSÉ — NON APPROUVÉ — CODE INTERDIT ». Une
mention « À définir » sur une preuve de test qui ne peut pas encore exister n'est pas un défaut de
la matrice — c'est l'application correcte de sa propre règle. `DD-611-03` reste donc **non close** :
non par défaut de qualité de l'artefact, mais parce que sa preuve attendue (colonnes de test
renseignées) ne peut matériellement apparaître qu'au fur et à mesure de l'implémentation de chaque
Lot, dans le respect du verrou CODE INTERDIT déjà en vigueur.

**Ce que cet avis ne fait PAS** : il ne clôt pas `DD-611-03` (le statut reste « En traitement,
matrice validée structurellement ») ; il ne prononce aucune décision de Gate (déjà NO GO en
l'état, `gate-04A-decision-ep17-lot0.md`, non rouvert) ; il n'autorise aucun développement
Frontend ; il ne remplace pas une revue par un Frontend Architect humain indépendant.
