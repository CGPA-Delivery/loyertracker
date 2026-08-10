# Plan d’exécution CGPA — EP-17 / US-136 : extension E2E des cinq flux Keycloak

**Date :** 2026-08-10

**Statut :** démarré sur instruction explicite CDO ; aucun Gate Staging/Production autorisé.

**Branche :** `feat/us136-keycloak-five-flow-a11y-e2e`

## Objectif borné

Étendre l’épreuve Playwright + axe de l’écran login aux cinq flux Keycloak restants : mot de passe oublié, réinitialisation, session expirée, accès refusé et logout. Chaque scénario doit établir l’état Keycloak réel avant de vérifier le landmark principal et l’absence de violations axe `serious`/`critical`.

Cette extension ne clôt pas US-136 : l’audit Angular authentifié et la matrice manuelle clavier/focus/zoom/reflow/reduced-motion restent hors périmètre.

## Préconditions inviolables

- stack Docker CI isolée, certificat `localhost` importé dans NSS et `ignoreHTTPSErrors: false` ;
- pas de Direct Grant, de secret persistant, de modification realm/redirect URI ou de bypass OIDC ;
- chaque test doit prouver son URL finale, titre/heading et le DOM Keycloak attendu ;
- ne pas représenter une erreur générique ou un redirect comme une session Angular authentifiée.

## Découpage et commits

| Étape | Preuve attendue | Validation | Commit |
|---|---|---|---|
| 1 | Plan et matrice de couverture | `git diff --check` | `docs(cgpa): cadrer extension E2E des flux Keycloak US-136` |
| 2 | Helper Playwright commun + test oublié | RED puis GREEN du test ciblé | `test(a11y): couvrir flux oubli mot de passe Keycloak` |
| 3 | Test réinitialisation avec action token éphémère généré dans la stack CI | RED puis GREEN | `test(a11y): couvrir réinitialisation mot de passe Keycloak` |
| 4 | Test session expirée, état réel obtenu sans altérer le realm | RED puis GREEN | `test(a11y): couvrir session expirée Keycloak` |
| 5 | Test accès refusé depuis requête OIDC/URI non autorisée contrôlée | RED puis GREEN | `test(a11y): couvrir accès refusé Keycloak` |
| 6 | Test logout OIDC et écran final réellement rendu | RED puis GREEN | `test(a11y): couvrir logout Keycloak` |
| 7 | CI, artifacts, checklist/rapport et revue croisée | checks complets sur SHA de PR | `docs(a11y): tracer preuves cinq flux Keycloak` |

## Matrice d’acceptation runtime

| Flux | Déclencheur réel | Assertion a11y minimale |
|---|---|---|
| Mot de passe oublié | lien `doForgotPassword` depuis login | `main#kc-content`, heading nommé, axe sans serious/critical |
| Réinitialisation | action token éphémère issu de Keycloak CI | `main#kc-content`, heading/forme reset, axe |
| Session expirée | session navigateur expirée/invalide, non simulée par simple URL | `main#kc-content`, message d’expiration, axe |
| Accès refusé | erreur OIDC/autorisation réellement rendue par Keycloak | `main#kc-content`, erreur non ambiguë, axe |
| Logout | endpoint OIDC logout avec `post_logout_redirect_uri` autorisée | état final Keycloak/logout prouvé, axe |

## Fichiers anticipés

- `frontend/e2e/accessibility/keycloak-login.spec.ts` ou nouveaux specs dédiés sous `frontend/e2e/accessibility/`
- `frontend/playwright.a11y.config.ts` seulement si un fixture strictement nécessaire doit être déclaré
- `.github/workflows/ci.yml` seulement si une création d’état éphémère est indispensable et justifiée
- `docs/cgpa/checklists/check-accessibility-01-ep17-us136.md`
- `docs/cgpa/06-planification-agile/rapport-audit-accessibilite-ep17-us136-2026-08-10.md`

## Non-actions

Aucun changement Staging/Production, déploiement, secret persisté, utilisateur de production, URI OIDC de production, Direct Grant, ni clôture automatique de la réserve `RSV-EP17-US136-A11Y-03`.
