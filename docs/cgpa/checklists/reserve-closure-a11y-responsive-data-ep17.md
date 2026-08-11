# Levée technique proposée — RES-A11Y-ANGULAR-01 / RES-RESP-PROOF-01 / RES-DATA-01

| Champ | Valeur |
|---|---|
| Date | 2026-08-11 |
| Branche/worktree | `agent/reserves-audit-a11y-resp-data` depuis `origin/main` |
| Statut | **Candidat technique en isolation** — aucune clôture CDO implicite |
| Portée | Angular authentifié, preuve responsive reproductible, données non sensibles Invitation/Notifications/finances |
| Exclusions | aucun push, merge, Staging, Production, secret persistant, migration ou déploiement |

## 1. Audit des réserves

| Réserve | Constat sur `origin/main` | Traitement proposé |
|---|---|---|
| `RES-A11Y-ANGULAR-01` | Le dépôt versionne `frontend/playwright.a11y.config.ts` et `frontend/e2e/accessibility/keycloak-login.spec.ts`, mais ils couvrent les flux Keycloak. Les parcours Angular authentifiés restent hors preuve runtime axe/clavier. Les specs Angular unitaires couvrent déjà le dialogue Notifications (focus initial, `Escape`, restitution, boucle Tab), mais ce n'est pas une preuve navigateur authentifiée. | Ajouter un parcours Playwright authentifié Angular et une matrice manuelle clavier/focus/zoom/reflow/reduced-motion. La clôture nécessite une exécution sur stack TLS/OIDC réelle avec comptes et données seedés. |
| `RES-RESP-PROOF-01` | Les captures `docs/cgpa/evidence/ep17-us138/*.png` sont versionnées, mais le script Playwright responsive vu dans l'ancien worktree était **non suivi** et utilisait `ignoreHTTPSErrors: true`; il ne peut donc pas être preuve durable. | Versionner `frontend/playwright.responsive.config.ts` + `frontend/e2e/responsive/authenticated-angular-responsive.spec.ts` avec TLS strict, assertions overflow/touch/forms/reduced-motion et captures reproductibles. |
| `RES-DATA-01` | Les écrans intégrés Invitation/Notifications/finance étaient non prouvables avec `0 gestionnaire / 0 bien / 0 paiement`. Le smoke existant sait créer ces données mais son périmètre est plus large et destructif en nettoyage RGPD. | Ajouter un script dédié `infra/test-data/seed-a11y-responsive-data.sh` : données `@test.local`, patrimoine/bien/bail/paiement/honoraires, invitation acceptée, affectation, préférences et historique notifications. |

## 2. Tests Playwright versionnés

### Existing tracked

- `frontend/playwright.a11y.config.ts` : E2E axe Keycloak, TLS strict (`ignoreHTTPSErrors: false`).
- `frontend/e2e/accessibility/keycloak-login.spec.ts` : login, forgot-password, reset via Mailpit, session expirée, accès refusé, logout.

### Existing non suivi dans le worktree de départ

- `frontend/playwright.responsive.config.ts`
- `frontend/e2e/responsive/check-responsive.spec.ts`
- `frontend/e2e/responsive/diag-post-login.spec.ts`
- `docs/cgpa/checklists/check-responsive-01-ep17-us137.md`

Ces fichiers non suivis étaient utiles comme brouillon, mais insuffisants pour fermer une réserve : absence de traçabilité Git et `ignoreHTTPSErrors: true` sur la config responsive.

### Candidat versionné ajouté ici

- `frontend/playwright.responsive.config.ts` : config durable, TLS strict, artifacts HTML/JUnit, screenshots/traces/videos en échec.
- `frontend/e2e/responsive/authenticated-angular-responsive.spec.ts` :
  - viewports `360`, `390`, `640`, `1024` ;
  - login OIDC Authorization Code + PKCE via Keycloak ;
  - routes bailleur `/bailleur`, `/bailleur/profil`, `/bailleur/locataires`, `/bailleur/gestionnaires` ;
  - route gestionnaire `/gestionnaire` si variables gestionnaire seedées ;
  - invariants : URL non redirigée vers fallback, heading attendu visible, `overflowX <= 1`, touch targets >= 44 px, formulaires mono-colonne <= 640 px, absence d'animations/transitions sous `prefers-reduced-motion: reduce`, captures full-page.

## 3. Préconditions OIDC/Keycloak

1. Stack locale ou Staging isolée démarrée, services healthy.
2. URL publique OIDC unique et autorisée par le realm : `E2E_BASE_URL=https://localhost` par défaut.
3. Certificat TLS localhost de confiance pour Chromium ; ne pas utiliser `ignoreHTTPSErrors`.
4. Realm `loyertracker`, client public `loyertracker-spa`, PKCE S256 et redirect URI `${E2E_BASE_URL}/` autorisée.
5. Compte bailleur de test existant : `RESPONSIVE_BAILLEUR_EMAIL` (défaut `bailleur-test@test.local`) + `KEYCLOAK_TEST_BAILLEUR_PASSWORD`.
6. Pour `/gestionnaire`, exécuter le seed et exporter `RESPONSIVE_GESTIONNAIRE_EMAIL` / `RESPONSIVE_GESTIONNAIRE_PASSWORD`.

## 4. Jeu de données non sensible

Script candidat : `infra/test-data/seed-a11y-responsive-data.sh`.

Données créées :

| Domaine | Données |
|---|---|
| Invitation | `gestionnaire-<RUN_ID>@test.local`, mot de passe généré, invitation acceptée via API publique. |
| Notifications | préférences courantes `smsOptIn=true`, `whatsappOptIn=true`, téléphone factice `+33600000000`, historique alimenté par événement `PAIEMENT_RECU`. |
| Finances | patrimoine, bien, locataire `@test.local`, bail EUR, échéances, paiement `RECU`, honoraires calculés via affectation gestionnaire 8%. |
| Isolation | identifiants suffixés par `RUN_ID`; aucune donnée réelle, aucun email/téléphone client, aucun provider externe requis. |

Le script écrit `frontend/test-results/responsive/seed-a11y-responsive.env` (ignoré Git) pour alimenter Playwright.

## 5. Matrice manuelle clavier/focus/zoom/reflow/reduced-motion

| Écran | Rôle | Données requises | Clavier / focus | Zoom 200% | Reflow 320/390 px | Reduced motion | Critère d'acceptation |
|---|---|---|---|---|---|---|---|
| Keycloak login | Anonyme | aucune | Tab suit logo/titre → identifiant → mot de passe → submit → lien MDP oublié ; focus visible. | Pas de contenu masqué. | Pas de scroll horizontal ; formulaire lisible. | Aucun mouvement essentiel. | PASS si axe Keycloak vert + navigation clavier complète. |
| `/bailleur` Dashboard | Bailleur | seed complet | Tab parcourt navigation, rafraîchir, formulaires, tableaux, sélection bien, actions financières ; focus visible/restauré. | Montants et statuts restent visibles. | Cartes et formulaires empilés ; finance non tronquée. | Transitions absentes ou neutralisées. | PASS si aucun piège clavier, aucune action uniquement hover, `overflowX<=1`. |
| `/bailleur/profil` | Bailleur | compte inscrit | Champs et boutons atteignables au clavier ; erreurs reliées aux champs. | Adresse/nom lisibles. | Formulaire mono-colonne. | Aucun mouvement bloquant. | PASS si sauvegarde/annulation utilisables au clavier. |
| `/bailleur/locataires` | Bailleur | locataire seedé | Recherche/liste/détail atteignables ; sélection visible. | Nom/email test lisibles sans masquage intempestif. | Tableau ou liste reflow sans scroll horizontal. | N/A. | PASS si route ne fallback pas vers `/bailleur`. |
| `/bailleur/gestionnaires` | Bailleur | gestionnaire seedé | Liste, détail, révocation/affectation atteignables. | Identifiant gestionnaire test lisible. | Liste reflow. | N/A. | PASS si route ne fallback pas vers `/bailleur`. |
| Invitation intégrée | Bailleur | gestionnaire ou capacité d'inviter | Champ email et submit au clavier ; message live visible. | Libellés non tronqués. | Formulaire mono-colonne. | N/A. | PASS si invitation peut être créée avec email `@test.local` sans donnée réelle. |
| Notifications préférences | Bailleur/Gestionnaire | préférences seedées | Checkboxes et dialogue désinscription : focus initial, `Escape`, restitution, boucle Tab. | Libellés canaux lisibles. | Toggling sans overflow. | Dialog sans animation obligatoire. | PASS si specs unitaires + preuve navigateur concordent. |
| Notifications historique | Bailleur/Gestionnaire | événement notification | Liste/statuts atteignables et lisibles. | Statut/date/canal non tronqués. | Liste empilée sans overflow. | N/A. | PASS si historique non vide avec destinataire masqué. |
| Finance paiements/honoraires | Bailleur/Gestionnaire | bien+bail+paiement+honoraires | Actions pointage/validation atteignables selon rôle. | Montants, statut paiement et honoraire visibles. | R03 : aucune info financière critique masquée. | N/A. | PASS si montants/stats visibles aux viewports obligatoires. |

## 6. Commandes de preuve

```bash
# Depuis la racine du dépôt / worktree isolé
npm ci --prefix frontend

# Préparer la stack locale isolée et les données non sensibles
BASE=https://localhost CACERT=infra/nginx/certs/localhost.pem \
  ./infra/test-data/seed-a11y-responsive-data.sh

# Charger les variables gestionnaire générées puis exécuter les preuves
set -a
source frontend/test-results/responsive/seed-a11y-responsive.env
set +a
cd frontend
npm run a11y:e2e
npm run responsive:e2e
```

## 7. Critères d'acceptation pour levée

- `npm run a11y:e2e` vert sur six flux Keycloak, TLS strict.
- `npm run responsive:e2e` vert sur tous les viewports et routes listées ; aucun test `skipped` pour manque de mot de passe ou données.
- Captures `frontend/test-results/responsive/*.png`, JUnit et rapport HTML archivés en artifact CI ou copiés sous `docs/cgpa/evidence/<lot>/` avec décision additive.
- Matrice manuelle ci-dessus exécutée par QA/UX ; résultat signé/accepté par PO/CDO.
- Aucune route source déclarée ne doit être validée si le runtime redirige vers `/bailleur`.
- Données test : uniquement `@test.local`, téléphone factice, aucun locataire/bailleur réel, pas de provider externe activé.

## 8. Statut recommandé

- `RES-RESP-PROOF-01` : **traitée techniquement par fichiers versionnables**, à lever après exécution Playwright verte et artifact durable.
- `RES-DATA-01` : **traitée techniquement par seed non sensible**, à lever après preuve que les écrans Invitation/Notifications/finance sont rendus non vides.
- `RES-A11Y-ANGULAR-01` : **traitée techniquement par parcours navigateur authentifiés + axe serious/critical + matrice manuelle**, à lever après exécution verte sans skip et validation humaine de la matrice clavier/focus/zoom/reflow/reduced-motion.

## 9. Décision de levée — 2026-08-11

Les critères du §7 sont déclarés satisfaits : PR #447 intégrée à `main`, CI post-merge verte, preuve responsive TLS stricte **20/20 PASS** sans skip, données `@test.local` et matrice manuelle QA/UX validée par le PO/CDO.

| Réserve | Statut final |
|---|---|
| `RES-RESP-PROOF-01` | **Levée** |
| `RES-DATA-01` | **Levée** |
| `RES-A11Y-ANGULAR-01` | **Levée pour le périmètre Angular authentifié couvert** |

La levée est limitée au périmètre a11y/responsive US-137. Elle n’emporte aucune décision sur le Gate 04A global, la baseline visuelle, Staging ou Production.
