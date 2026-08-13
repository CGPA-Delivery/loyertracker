# Convention `data-testid` — LoyerTracker

| Champ | Valeur |
|---|---|
| Date | 2026-08-13 |
| Version | 1.0.0 |
| Cadre | DD-EP17-07 (Design Debt Register) |

## Format

```
data-testid="<page>-<element>"
```

- **`<page>`** : nom de la page/composant en kebab-case (`bailleur-dashboard`, `verify-receipt`, `profil`)
- **`<element>`** : rôle de l'élément (`submit-btn`, `email-input`, `bien-table`, `logout-link`)

## Règles

1. **Boutons d'action** : suffixe `-btn` (`submit-btn`, `cancel-btn`, `delete-btn`)
2. **Champs de formulaire** : suffixe `-input`/`-select` (`email-input`, `devise-select`)
3. **Tableaux** : suffixe `-table` (`bien-table`, `audit-table`)
4. **Liens de navigation** : suffixe `-link` (`profil-link`, `logout-link`)
5. **Messages/alertes** : suffixe `-msg` (`error-msg`, `success-msg`)

## Composants couverts (Lot 5)

| Composant | `data-testid` ajoutés |
|---|---|
| `BailleurDashboardComponent` | `bailleur-dashboard-refresh-btn`, `bailleur-dashboard-bien-table`, `bailleur-dashboard-patrimoine-table` |
| `GestionnaireDashboardComponent` | `gestionnaire-dashboard-refresh-btn`, `gestionnaire-dashboard-bien-table` |
| `ProfilComponent` | `profil-submit-btn`, `profil-nom-input`, `profil-email-input` |
| `InvitationAcceptationComponent` | `invitation-accept-btn`, `invitation-decline-btn` |
| `VerifyReceiptComponent` | `verify-receipt-download-link` |
| `LoginPage` (Keycloak) | `login-submit-btn`, `login-username-input`, `login-password-input` |

## Non couvert

Les composants sans interaction utilisateur critique (affichage seul, pas de formulaire/bouton) ne reçoivent pas de `data-testid` à ce stade. La convention est extensible : tout nouveau composant interactif DOIT ajouter un `data-testid`.
