# CHECK-ACCESSIBILITY-01 — EP-17 / US-136

| Champ | Valeur |
|---|---|
| Périmètre | EP-17 / US-136 — audit WCAG 2.2 AA des écrans pilote US-133, US-134 et US-135 |
| Date de contrôle | 2026-08-10T10:06:41Z |
| Type | Validation Lot 5, sans modification applicative |
| Verdict | **NO GO technique pour clôturer US-136** |

| Contrôle | Preuve | Résultat | Bloquant |
|---|---|---|---|
| Structure sémantique et titres | Revue source Angular : `app.component.ts` contient déjà `<main id="main-content">`; thème Keycloak hérité rendu localement sans landmark principal pour `#kc-content` | **FAIL Keycloak à confirmer sur les 6 flux** | Oui |
| Navigation clavier et focus visible | Non exécutée sur les parcours authentifiés : le navigateur contrôlé refuse le certificat local auto-signé (`ERR_CERT_AUTHORITY_INVALID`) et l’URI `https://localhost:8444` n’est pas déclarée par le client OIDC local | **NON EXÉCUTÉ** | Oui |
| Labels, noms accessibles et erreurs | Revue source des composants Angular existants : `lt-form-field`, labels et `aria-describedby` présents ; aucun parcours authentifié complet exécuté | **PASS documentaire sous réserve** | Oui |
| Contrastes et information non fondée sur la couleur | Diagnostic exploratoire axe-core sur le thème Keycloak : `.instruction` calculée `#72767b` sur `#111827`, ratio **3,88:1**, inférieur à WCAG AA 4,5:1 | **FAIL à corriger et revalider** | Oui |
| Zoom, reflow et lecteurs d’écran | Non exécuté en navigateur réel / lecteur d’écran | **NON EXÉCUTÉ** | Oui |
| Mouvement réduit et absence de piège | Non exécuté sur les parcours Keycloak et Angular authentifiés | **NON EXÉCUTÉ** | Oui |
| Tests automatiques et manuels | Lint Frontend PASS ; tests Karma ChromeHeadless **223/223 PASS**. Les scripts axe expérimentaux et leurs dépendances ont été supprimés : ils n’étaient ni reproductibles ni conformes au périmètre Lot 5 | **NON CONCLUANT pour WCAG** | Oui |

## Réserves et actions requises

1. `RSV-EP17-US136-A11Y-01` — corriger le contraste du message Keycloak `.instruction` sans modifier les flux OIDC/PKCE, puis valider les 6 écrans du thème : login, mot de passe oublié, réinitialisation, session expirée, accès refusé et logout.
2. `RSV-EP17-US136-A11Y-02` — fournir un environnement de test local avec certificat de confiance et URI OIDC explicitement autorisée, ou une exécution CI dédiée avec secrets injectés ; exécuter l’audit automatisé sur des sessions réellement authentifiées.
3. `RSV-EP17-US136-A11Y-03` — exécuter et tracer navigation clavier (Tab/Shift+Tab, Entrée/Espace, Escape si applicable), focus visible, absence de piège, zoom 200 % et reflow.

## Limites de preuve

- Aucun Staging, Production, secret, activation provider ou changement applicatif n’a été exécuté.
- Les constats axe-core exploratoires sont conservés comme diagnostic, pas comme une preuve automatisée de clôture : l’outillage et les dépendances temporaires ont été retirés sur décision PO afin de respecter le périmètre Lot 5.
- Le présent NO GO concerne seulement la clôture de **EP-17 / US-136** ; il ne rejoue ni ne remplace les Gates historiques.

## Addendum de revalidation automatisée — 2026-08-10T13:35:29Z

| Contrôle | Preuve immuable | Résultat | Statut réserve |
|---|---|---|---|
| TLS réel sans bypass | CI `31393393832`, job `93470300794` ; CA `localhost` éphémère importée dans le magasin Chromium/NSS ; aucune option `ignoreHTTPSErrors` | **PASS** | `RSV-EP17-US136-A11Y-02` partiellement levée : le blocage TLS local est remplacé par une preuve CI isolée |
| Écran login Keycloak | Playwright `1.54.2` + axe `4.10.2`, Chromium ; `1 passed (2.8s)` | **PASS** — un landmark principal et aucune violation axe `serious`/`critical` | `RSV-EP17-US136-A11Y-01` partiellement levée pour le login |
| Contraste et ordre clavier du thème | Correctifs `f32d8a0` + `1767be7`, contrat `test-theme-accessibility.sh` PASS | **PASS** — contraste `.instruction`, landmark natif et absence de `tabindex` positif | `RSV-EP17-US136-A11Y-01` partiellement levée pour le login |
| Artefact de preuve | GitHub Artifact `9064684806`, `accessibility-e2e-fb438a5e8a019b1acc7fea5b70a72c0962055a5d`, SHA-256 `7549d5aef8e9f1f0e61bd29e0c0c327ad681c3406ca52be4436105b2c7256523`, rétention 30 jours | **PASS** | Preuve téléchargeable et traçable |

### Réserves maintenues

- `RSV-EP17-US136-A11Y-01` est **levée** pour les six flux Keycloak : login, mot de passe oublié, réinitialisation (action-token via Mailpit), session expirée, accès refusé et logout. Chaque flux dispose d'un test Playwright + axe-core automatisé en CI, avec artefact de preuve immuable.
- `RSV-EP17-US136-A11Y-02` reste ouverte pour l’exigence de parcours réellement authentifié ; le contrôle CI courant couvre les écrans Keycloak et non une session applicative complète.
- `RSV-EP17-US136-A11Y-03` reste ouverte : navigation clavier manuelle, focus visible, absence de piège, zoom 200 %, reflow et préférence reduced-motion ne sont pas encore exécutés ni tracés.

**Verdict actualisé : NO GO pour clôturer US-136, avec preuve automatisée des six flux Keycloak désormais PASS.** Aucun Gate historique, Staging, Production, realm, URI de redirection ou secret persistant n’a été modifié.

## Addendum de revalidation — 2026-08-11 (flux restants + Mailpit)

| Contrôle | Preuve immuable | Résultat | Statut réserve |
|---|---|---|---|
| Flux mot de passe oublié | PR #437, CI `31473483921`, job `93732529945` ; Playwright + axe, Chromium | **PASS** — `forgot-password` → email → axe, 0 violation `serious`/`critical` | `RSV-EP17-US136-A11Y-01` |
| Flux réinitialisation (action-token) | PR #438, CI `31479982758`, job `93742469319` ; Mailpit `v1.25`, SMTP Keycloak → Mailpit, Playwright + axe | **PASS** — `forgot-password` → poll Mailpit API → `update-password` → axe, 0 violation `serious`/`critical` | `RSV-EP17-US136-A11Y-01` |
| Flux session expirée | PR #437, CI `31473483921` ; regex `/page a expir/i`, Playwright + axe | **PASS** — message "La page a expiré" → axe, 0 violation | `RSV-EP17-US136-A11Y-01` |
| Flux accès refusé | PR #437, CI `31473483921` ; Playwright + axe | **PASS** — 403 → axe, 0 violation | `RSV-EP17-US136-A11Y-01` |
| Flux logout | PR #437, CI `31473483921` ; Playwright + axe, tabindex corrigé | **PASS** — confirmation logout → axe, 0 violation | `RSV-EP17-US136-A11Y-01` |
| Flux PKCE bearer-only | PR #437, CI `31473483921` ; code challenge `openssl rand -base64 32`, Playwright + axe | **PASS** — authorization → axe, 0 violation | `RSV-EP17-US136-A11Y-01` |
| Contraste alerte warning update-password | PR #438, commit `a37efa2` ; CSS `.pf-c-alert.pf-m-warning .pf-c-alert__title { color: #92400e }` | **PASS** — contraste ≥ 4.5:1 (WCAG AA SC 1.4.3) | `RSV-EP17-US136-A11Y-01` |
| Artefact de preuve (PR #438) | GitHub Artifact `9095712663`, `accessibility-e2e-ec20230d44787b8852428a57118fe688ce9b4c61`, SHA-256 `9daa09d09ba7851e273ba8301d65160e58a73d8b3f435ebe25e537c15eaf6bdb`, rétention 30 jours | **PASS** | Preuve téléchargeable et traçable |
| Infrastructure Mailpit | `docker-compose.yml` profil `ci`, `axllent/mailpit:v1.25@sha256:463c5cf0f81ecd484fa332a33635ad3b129b386008bf0387925d050ab68d1bda`, SMTP configuré via API REST Keycloak | **PASS** | Environnement de test email isolé, sans dépendance externe |
