# Inventaire des composants — LoyerTracker

| Champ | Valeur |
|---|---|
| Périmètre | Chantier socle UI PrimeNG/Design Tokens/Keycloak (EP-17) |
| Méthode | Lecture exhaustive de `frontend/src/app/**/*.ts` (hors `*.spec.ts`), 2026-07-30 |
| Statut | Instantané factuel — aucun composant n'a été modifié pour produire cet inventaire |
| Documents liés | `DSG-001.md`, `screen-inventory-loyertracker.md`, `traceability-ui-loyertracker.md` |

> Onze composants Angular réels existent dans le dépôt à la date de cet inventaire. Aucun composant
> supplémentaire n'est inventé ; tout composant futur (candidats `lt-*`) est marqué comme tel dans
> `DSG-001.md`, pas ici.

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
| `VerifyReceiptComponent` | Vérification publique non authentifiée d'une quittance | `frontend/src/app/public/verify-receipt/verify-receipt.component.ts` | Unique | Aucune dette identifiée à ce stade | Card, Tag | `lt-status-tag` (statut VALIDE/INVALIDE) | Conserver, adapter visuellement en dernier (surface publique sensible) | Élevé (surface publique, sécurité) | P2 |

## Services et utilitaires transverses (hors composants visuels)

| Élément | Rôle | Localisation | Remarque |
|---|---|---|---|
| `MoneyFormatPipe` / `money-format.ts` | Formatage monétaire multi-devises (EUR/USD/CDF) | `frontend/src/app/shared/money/` | Base directe du futur `lt-money` — aucune réécriture nécessaire, seulement une exposition en composant si besoin d'affichage enrichi (icône devise, etc.) |
| `AuthService` | Façade Keycloak (login/logout/rôles) | `frontend/src/app/core/auth/auth.service.ts` | Hors périmètre visuel, sans impact PrimeNG |
| `authGuard` | Garde de route (redirection login si non authentifié) | `frontend/src/app/core/auth/auth.guard.ts` | Aucun état « accès refusé » côté client — dette UX transverse (cf. `UXR-001.md` extension, `design-debt-register-loyertracker.md`) |
| `S02ApiService`/`S03ApiService`/`S04ApiService` | Accès API par sprint historique | `frontend/src/app/core/s0{2,3,4}/` | Hors périmètre visuel |

## Constats transverses

* **Aucune bibliothèque de composants** n'est utilisée à ce jour (confirmé par `package.json`,
  cf. `ADR-UI-001`) : tous les composants ci-dessus sont des implémentations Angular natives avec
  styles en dur.
* **Duplication de patrons** : `.panel`/`.panel-head`/`.toolbar`/`.list`/`.row` sont réimplémentés
  à l'identique dans `AlertesListeComponent`, `AuditJournalComponent` et partiellement dans les deux
  dashboards — candidat naturel de fusion en `lt-section-card`/`lt-data-table`.
* **Aucun état « accès refusé »** côté client dans aucun des onze composants — dette nouvelle,
  reportée dans `design-debt-register-loyertracker.md`.
* **Aucun sélecteur de test** (`data-testid` ou équivalent) dans aucun composant — dette à traiter
  si des tests end-to-end sont introduits (hors périmètre de cette mission).
* Priorité P0 attribuée aux composants à plus forte réutilisation ou plus forte sensibilité
  financière, cohérent avec le découpage Lot 2/3 du Plan d'Exécution.
