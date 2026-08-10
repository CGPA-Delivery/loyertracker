# Addendum CGPA — quatre flux Keycloak restants / US-136

**Date :** 2026-08-10
**Branche :** `feat/us136-keycloak-five-flow-a11y-e2e`

## Décision de périmètre

Les flux sont testés contre la stack Docker isolée CI, certificat localhost de confiance et realm éphémère. Aucun realm Staging/Production, secret persistant, Direct Grant ou bypass TLS n’est autorisé.

## Déclencheurs runtime validés

| Flux | Déclencheur réel | Preuve attendue |
|---|---|---|
| Session expirée | Après un login PKCE, conserver les cookies et appeler `login-actions/authenticate` avec `execution=BAD` et le `tab_id` réel du formulaire. | Page `La page a expiré`, landmark, axe. |
| Accès refusé | Demande Authorization Code/PKCE vers le client existant bearer-only `loyertracker-api`. | HTTP 403 / page `error.ftl`, landmark, axe. |
| Logout OIDC | Session PKCE réelle du compte CI, puis endpoint logout avec `client_id` et `post_logout_redirect_uri` autorisé. | Confirmation logout, axe, redirect, puis `prompt=none` retourne `login_required`. |
| Reset action token | Mailpit ajouté au seul Compose CI, SMTP configuré à l’exécution dans le realm isolé ; lien action-token récupéré dans la mailbox locale. | Formulaire réel update-password, landmark, axe. |

## Protection des secrets

Le mot de passe et l’utilisateur de test sont générés dans `.env.ci`, transmis uniquement au processus Playwright de ce job et détruits au teardown. Mailpit est réseau Docker isolé, API liée à `127.0.0.1`, sans identifiant de production. L’action token n’est jamais journalisé.

## Ordre et critères

Un scénario est ajouté, exécuté dans CI et committé à la fois. Toute preuve exige : état Keycloak atteint réellement, `main#kc-content`, titre non vide et absence axe `serious`/`critical`. Les échecs restent des réserves US-136 ; aucune promotion n’est induite.
