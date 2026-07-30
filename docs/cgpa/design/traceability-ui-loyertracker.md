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
| EP-17 / US-132 (composants transverses) | J1 (préférences, `phase-02-user-journeys.md`) | `/bailleur/profil` (étendu) | `DDS-LT-001` | `DSG-001` §Composants LoyerTracker candidats | `lt-page-header`, `lt-stat-card`, `lt-status-tag`, `lt-empty-state`, `lt-data-table`, `lt-confirm-dialog`, `lt-form-field` (candidats) | À définir | À définir | À définir | À définir | Non exécuté |
| EP-17 / US-133 (pilote dashboard) | Dashboard Bailleur (existant) | `/bailleur` | `DDS-LT-001` | `DSG-001` §Mapping composants | `BailleurDashboardComponent` (à faire évoluer) | À définir | À définir | À définir | À définir | Non exécuté |
| EP-17 / US-134 (pilote biens) | Liste/détail Patrimoines-Biens (existant) | `/bailleur` (section Biens) | `DDS-LT-001` | `DSG-001` §Mapping composants | Sections biens/patrimoines de `BailleurDashboardComponent` | À définir | À définir | À définir | À définir | Non exécuté |
| EP-17 / US-135 (thème Keycloak) | Login, mot de passe oublié, erreurs | Écrans Keycloak (hors Angular) | `ADR-UI-001` §Stratégie de thème Keycloak | `DSG-001` (tokens partagés) | `infra/keycloak/themes/loyertracker/` (non créé) | Non applicable | À définir | À définir | À définir | Non exécuté |
| EP-17 / US-136 (accessibilité) | Tous parcours critiques (`UXR-001` extension) | Transverse | — | `DSG-001` §Accessibilité | — | Non applicable | À définir | Non applicable | Non applicable | Non exécuté |
| EP-17 / US-137 (responsive) | Tous parcours critiques | Transverse | — | `DSG-001` §Responsive Rules | — | Non applicable | Non applicable | À définir | Non applicable | Non exécuté |
| EP-17 / US-138 (régression visuelle) | Tous écrans migrés | Transverse | — | — | — | Non applicable | Non applicable | Non applicable | À définir (`DD-611-04`) | Non exécuté |
| EP-17 / US-139 (documentation) | — | — | Toutes | Toutes | — | Non applicable | Non applicable | Non applicable | Non applicable | En cours (ce lot) |
| EP-17 / US-140 (Gate 04A) | — | — | Toutes | `DSG-001` | — | Non applicable | Non applicable | Non applicable | Non applicable | Non exécuté |
| EP-17 / US-141 (Gate Staging du pilote) | — | — | — | — | — | Non applicable | Non applicable | Non applicable | Non applicable | Non exécuté |
| EP-17 / US-142 (stratégie migration restante) | Baux, locataires, gestionnaires, affectations, garanties, honoraires, alertes, quittances, audit | `/bailleur`, `/gestionnaire` (sections) | — | — | Tous composants de `component-inventory-loyertracker.md` restants | À définir | À définir | À définir | À définir | Non exécuté |
| US-125 (préférences et historique notifications) | J1/J2/J3 (`phase-02-user-journeys.md`) | `/bailleur/profil` (étendu), sections dashboards (`phase-02-information-architecture.md`) | `DDS-LT-001` (socle), DDS candidates listées dans `UXR-001.md` (emplacement Gestionnaire, filtre historique, mapping statuts, modal) — aucune créée formellement | `DSG-001` | `NotificationsPreferencesComponent`, `NotificationsHistoriqueComponent` (candidats, non codés) | Non exécuté | Non exécuté | Non exécuté | Non exécuté | Bloqué — Gates 02A/04A non statués |

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
