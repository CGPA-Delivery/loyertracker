# Inventaire des composants — LoyerTracker

| Champ | Valeur |
|---|---|
| Périmètre | Chantier socle UI PrimeNG/Design Tokens/Keycloak (EP-17) |
| Méthode | Inventaire recoupé avec `frontend/src/app/**/*.component.ts` et `infra/keycloak/themes/loyertracker/`, 2026-08-11 (US-139) |
| Statut | **État post-pilote factuel** — source Angular + thème Keycloak, distinct des vérifications runtime US-137/US-138 |
| Documents liés | `DSG-001.md` v0.3.0, `screen-inventory-loyertracker.md`, `traceability-ui-loyertracker.md`, `check-*-ep17-us136→138.md` |

> **26 composants Angular réels** sont présents dans le dépôt à la date de cet inventaire : 18
> composants applicatifs/métier et 8 composants transverses `lt-*`/Toast. Les composants et routes
> listés ci-dessous décrivent le **source**. Leur accessibilité réelle dans le build/runtime est
> explicitement qualifiée par les preuves US-137/US-138 ; aucune preuve n'est inventée à partir de
> la seule déclaration source.

| Composant | Responsabilité | Localisation | Réutilisation | Dette | PrimeNG candidat | Wrapper `lt-*` | Action future | Risque | Priorité |
|---|---|---|---|---|---|---|---|---|---|
| `AppComponent` | Shell applicatif (skip-link, navbar, router-outlet) | `frontend/src/app/app.component.ts` | Unique (racine) | Faible | — | `lt-app-shell` (candidat) | Adapter | Faible | P2 |
| `NavbarComponent` | Navigation principale, déconnexion | `frontend/src/app/shared/navbar/navbar.component.ts` | Unique | Couleurs en dur (`#1e293b`, `#334155`, `#38bdf8`…), pas de menu responsive au-delà d'un wrap | — (composant applicatif, pas un composant DSG générique) | — | Adapter (migrer vers tokens) | Faible | P1 |
| `BailleurDashboardComponent` | Page unique Bailleur : patrimoines, biens, baux, affectations, exceptions | `frontend/src/app/bailleur/dashboard/dashboard.component.ts` | Unique, 1177 lignes | Très forte (composant monolithique, styles dupliqués avec les autres) | Table, Select, InputText, Tag | Composé de plusieurs `lt-*` (`lt-data-table`, `lt-form-field`, `lt-status-tag`) | Adapter progressivement (EP-17 Lot 6) | Élevé (cœur métier, non-régression critique) | P1 |
| `GestionnaireDashboardComponent` | Page unique Gestionnaire : biens affectés, baux | `frontend/src/app/gestionnaire/dashboard/dashboard.component.ts` | Unique, 336 lignes | Duplication de patrons avec le dashboard Bailleur | Table, Select, InputText | Idem | Adapter progressivement (EP-17 Lot 6) | Élevé | P1 |
| `ProfilComponent` | Profil Bailleur (identité, adresse postale, futures préférences US-125) | `frontend/src/app/bailleur/profil/profil.component.ts` | Unique | Faible (petit composant, déjà propre) | InputText, Button | `lt-form-field` | Adapter (extension US-125) | Moyen (US-125 en dépend) | P0 |
| `AlertesListeComponent` | Liste des alertes NON_LUE, réutilisée Bailleur/Gestionnaire | `frontend/src/app/alertes/alertes-liste.component.ts` | **Élevée** (2 dashboards) | Sans filtre ni pagination (limite volontaire tracée) | Table ou DataView, Tag (badge par type) | `lt-data-table` + `lt-status-tag` | Adapter en priorité (patron déjà réutilisé, gain immédiat) | Moyen | P0 |
| `AuditJournalComponent` | Journal d'audit, Bailleur uniquement (US-62) | `frontend/src/app/audit/audit-journal.component.ts` | Unique | Sans filtre ni pagination (limite volontaire tracée) | Table | `lt-data-table` | Adapter | Faible | P1 |
| `GarantiesBailComponent` | Historique et actions de garantie par bail | `frontend/src/app/garanties/garanties-bail.component.ts` | Élevée (2 dashboards) | Non inspectée en détail (hors scope de cet audit initial) | Table, Tag, ConfirmDialog | `lt-data-table`, `lt-status-tag`, `lt-confirm-dialog` | Adapter | Moyen (financier) | P0 |
| `HonorairesBienComponent` | Consultation/validation des honoraires par bien | `frontend/src/app/honoraires/honoraires-bien.component.ts` | Élevée (2 dashboards) | Non inspectée en détail | Table, Button, ConfirmDialog | `lt-data-table`, `lt-confirm-dialog` | Adapter | Moyen (financier) | P0 |
| `PaiementsBienComponent` | Pointage des paiements, téléchargement quittance/avis | `frontend/src/app/paiements/paiements-bien.component.ts` | Élevée (2 dashboards) | Non inspectée en détail | Table, Button | `lt-data-table` | Adapter | Élevé (financier, action irréversible) | P0 |
| `VerifyReceiptComponent` | Vérification publique non authentifiée d'une quittance | `frontend/src/app/public/verify-receipt/verify-receipt.component.ts` | Unique | **Corrigé le 2026-07-31** (validation Design Architect, `DD-611-02`) : radius (2/8/10/16/50%/999px) et breakpoint (560px) non alignés avec le reste du produit — `DD-EP17-09` | Card, Tag | `lt-status-tag` (statut VALIDE/INVALIDE) | Conserver, adapter visuellement en dernier (surface publique sensible) | Élevé (surface publique, sécurité) | P2 |

## Ajouts post-pilote vérifiés (US-139)

| Composant | Responsabilité | Localisation | Route/source | État runtime prouvé |
|---|---|---|---|---|
| `GestionnaireListeComponent` | Liste de gestionnaires | `gestionnaire/gestionnaire-liste.component.ts` | `/bailleur/gestionnaires` | Route source déclarée ; runtime redirigé vers `/bailleur` |
| `GestionnaireDetailComponent` | Détail gestionnaire | `gestionnaire/gestionnaire-detail.component.ts` | `/bailleur/gestionnaires/:id` | Route source déclarée ; runtime non vérifiable |
| `LocataireListeComponent` | Liste de locataires | `locataire/locataire-liste.component.ts` | `/bailleur/locataires` | Route source déclarée ; runtime redirigé vers `/bailleur` |
| `LocataireDetailComponent` | Détail locataire | `locataire/locataire-detail.component.ts` | `/bailleur/locataires/:id` | Route source déclarée ; runtime non vérifiable |
| `InvitationFormComponent` | Invitation de gestionnaire | `invitation/invitation-form.component.ts` | Intégré Dashboard Bailleur | Non rendu faute de données de test |
| `NotificationsPreferencesComponent` | Préférences de notifications | `notifications/notifications-preferences.component.ts` | Intégré aux dashboards | Non rendu faute de données de test |
| `NotificationsHistoriqueComponent` | Historique de notifications | `notifications/notifications-historique.component.ts` | Intégré aux dashboards | Non rendu faute de données de test |
| `lt-page-header` | En-tête réutilisable | `shared/page-header/page-header.component.ts` | Transverse | Implémenté ; CI Frontend verte |
| `lt-stat-card` | Carte de statistique | `shared/stat-card/stat-card.component.ts` | Transverse | Implémenté ; CI Frontend verte |
| `lt-status-tag` | Étiquette de statut | `shared/status-tag/status-tag.component.ts` | Transverse | Implémenté ; CI Frontend verte |
| `lt-empty-state` | État vide | `shared/empty-state/empty-state.component.ts` | Transverse | Implémenté ; CI Frontend verte |
| `lt-form-field` | Champ de formulaire | `shared/form-field/form-field.component.ts` | Transverse | Implémenté ; CI Frontend verte |
| `lt-data-table` | Tableau de données | `shared/data-table/data-table.component.ts` | Transverse | Implémenté ; CI Frontend verte |
| `lt-confirm-dialog` | Dialogue de confirmation | `shared/confirm-dialog/confirm-dialog.component.ts` | Transverse | Implémenté ; CI Frontend verte |
| `lt-toast` | Restitution de notification | `shared/toast/toast.component.ts` | Transverse | Implémenté ; CI Frontend verte |

**Thème Keycloak :** `infra/keycloak/themes/loyertracker/login/` existe et contient
`theme.properties`, `tokens.css`, `login.css`, `template.ftl`, `login.ftl` et le script de test
d'accessibilité. Il combine CSS et surcharges FreeMarker ciblées pour l'accessibilité ; il n'est
pas CSS-only.

## Services et utilitaires transverses (hors composants visuels)

| Élément | Rôle | Localisation | Remarque |
|---|---|---|---|
| `MoneyFormatPipe` / `money-format.ts` | Formatage monétaire multi-devises (EUR/USD/CDF) | `frontend/src/app/shared/money/` | Base directe du futur `lt-money` — aucune réécriture nécessaire, seulement une exposition en composant si besoin d'affichage enrichi (icône devise, etc.) |
| `AuthService` | Façade Keycloak (login/logout/rôles) | `frontend/src/app/core/auth/auth.service.ts` | Hors périmètre visuel, sans impact PrimeNG |
| `authGuard` | Garde de route (redirection login si non authentifié) | `frontend/src/app/core/auth/auth.guard.ts` | Aucun état « accès refusé » côté client — dette UX transverse (cf. `UXR-001.md` extension, `design-debt-register-loyertracker.md`) |
| `S02ApiService`/`S03ApiService`/`S04ApiService` | Accès API par sprint historique | `frontend/src/app/core/s0{2,3,4}/` | Hors périmètre visuel |

## Constats transverses

* **PrimeNG est installé et utilisé** (`primeng@22.0.0`, `providePrimeNG`, `TableModule`, `Tag`,
  `Toast`, `ConfirmDialog`) ; les composants `lt-*` restent des wrappers Angular propres au produit,
  et certains écrans métier conservent des styles locaux en cours de convergence vers les tokens.
* **Duplication de patrons** : `.panel`/`.panel-head`/`.toolbar`/`.list`/`.row` sont réimplémentés
  à l'identique dans `AlertesListeComponent`, `AuditJournalComponent` et partiellement dans les deux
  dashboards — candidat naturel de fusion en `lt-section-card`/`lt-data-table`.
* **Aucun état « accès refusé »** côté client dans aucun des onze composants — dette nouvelle,
  reportée dans `design-debt-register-loyertracker.md`.
* **Aucun sélecteur de test** (`data-testid` ou équivalent) dans aucun composant — dette à traiter
  si des tests end-to-end sont introduits (hors périmètre de cette mission).
* Priorité P0 attribuée aux composants à plus forte réutilisation ou plus forte sensibilité
  financière, cohérent avec le découpage Lot 2/3 du Plan d'Exécution.
