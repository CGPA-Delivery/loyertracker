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
