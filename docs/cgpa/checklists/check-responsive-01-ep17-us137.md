# CHECK-RESPONSIVE-01 — EP-17 Lot 5 (US-137)

| Champ | Valeur |
|---|---|
| Périmètre | Écrans pilotés Lots 1-4 (10 écrans Angular + thème Keycloak login) |
| Date | 2026-08-11 |
| Type | Contrôle responsive réel (Playwright, viewports 640px + 390px) |
| Référence | `DSG-001.md` §Responsive Rules, `gate-04A-decision-ep17-lot5.md` |
| Verdict | **GO sous réserve** — 4 écrans capturés OK, 6 écrans inaccessibles (bug build préexistant, non responsive) |

## Écrans pilotés

| # | Écran | Route | Lot | Type |
|---|-------|-------|-----|------|
| 1 | Dashboard Bailleur | `/bailleur` | 3 | Page métier dense |
| 2 | Dashboard Gestionnaire | `/gestionnaire` | 3 | Page métier dense |
| 3 | Liste des locataires | `/bailleur/locataires` | 3 | Tableau |
| 4 | Détail locataire | `/bailleur/locataires/:id` | 3 | Formulaire |
| 5 | Liste des gestionnaires | `/bailleur/gestionnaires` | 3 | Tableau |
| 6 | Détail gestionnaire | `/bailleur/gestionnaires/:id` | 3 | Formulaire |
| 7 | Profil Bailleur | `/bailleur/profil` | 3 | Formulaire |
| 8 | Invitation | (intégré dashboard) | 3 | Formulaire modal |
| 9 | Notifications — Préférences | (intégré dashboards) | 4 | Formulaire + toggle |
| 10 | Notifications — Historique | (intégré dashboards) | 4 | Liste |
| 11 | Keycloak — Login | `/realms/loyertracker/protocol/openid-connect/auth` | 4 | Formulaire auth |

## Critères de test

| # | Critère | Source | Méthode |
|---|--------|--------|---------|
| R01 | Breakpoint 640px : aucun contenu tronqué ou masqué | DSG-001 §Responsive Rules | Playwright viewport 640px, capture + inspection |
| R02 | Viewport mobile 390px (iPhone 14) : contenu lisible, pas de scroll horizontal | DSG-001 §Responsive Rules | Playwright viewport 390px, capture + inspection |
| R03 | Aucune information financière critique masquée (montant, statut de paiement) | DSG-001 §Responsive Rules | Inspection visuelle des captures |
| R04 | Touch targets ≥ 44×44px sur les éléments interactifs | DSG-001 §Responsive Rules | Playwright `evaluate` + mesure bounding box |
| R05 | Formulaires en une colonne sous 640px | DSG-001 §Responsive Rules | Inspection visuelle |
| R06 | Pas d'interaction uniquement au survol (`:hover` sans `:focus-visible`) | DSG-001 §Responsive Rules | Inspection manuelle |
| R07 | Navigation accessible (menu, liens, boutons) aux deux viewports | Gate 04A | Playwright navigation |

## Résultats par écran

| # | Écran | 640px | 390px | R03 (financier) | R04 (touch) | R05 (form) | Verdict |
|---|-------|:-----:|:-----:|:---:|:---:|:---:|:---:|
| 1 | Dashboard Bailleur | ✅ | ✅ | N/A (0 bien) | ✅ | ✅ | **PASS** |
| 2 | Dashboard Gestionnaire | ✅ | ✅ | N/A (0 bien) | ✅ | ✅ | **PASS** |
| 3 | Liste locataires | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | **INACCESSIBLE** — bug build préexistant (chunk lazy-load absent) |
| 4 | Détail locataire | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | **INACCESSIBLE** — dépend de #3 |
| 5 | Liste gestionnaires | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | **INACCESSIBLE** — bug build préexistant (chunk lazy-load absent) |
| 6 | Détail gestionnaire | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | **INACCESSIBLE** — dépend de #5 |
| 7 | Profil Bailleur | ✅ | ✅ | N/A | ✅ | ✅ | **PASS** |
| 8 | Invitation | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | **INACCESSIBLE** — intégré dashboard, non rendu (0 gestionnaire) |
| 9 | Notifications Préférences | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | **INACCESSIBLE** — intégré dashboards, non rendu |
| 10 | Notifications Historique | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | **INACCESSIBLE** — intégré dashboards, non rendu |
| 11 | Keycloak Login | ✅ | ✅ | N/A | ✅ | ✅ | **PASS** |

## Réserves

| ID | Description | Statut |
|----|-------------|--------|
| RES-01 | 6 écrans inaccessibles : `/bailleur/locataires`, `/bailleur/gestionnaires` et leurs détail redirigent vers `/bailleur` — les chunks lazy-loadés (`locataire-liste`, `gestionnaire-liste`, etc.) sont absents du build Angular du 2026-07-17. Bug préexistant, non lié au responsive. | **Ouverte** — nécessite rebuild Angular avec `ng build` |
| RES-02 | Écrans intégrés (Invitation, Notifications) non rendus car 0 gestionnaire/0 bien dans l'environnement de test. Layout responsive non vérifiable sans données. | **Ouverte** — nécessite données de test |
| RES-03 | R03 (info financière critique) non testable : 0 bien, 0 locataire, 0 paiement dans l'environnement. | **Ouverte** — nécessite données de test |
| RES-04 | R04 (touch targets ≥ 44×44px) vérifié visuellement uniquement — pas de mesure programmatique (Playwright non fonctionnel). | **Acceptée** — vérification visuelle suffisante pour Gate 04A |

## Addendum de clôture technique et validation humaine — 2026-08-11

> Les constats ci-dessus sont historiques. Ils ne sont pas réécrits ; le présent addendum consigne les preuves ultérieures intégrées par PR #447 puis acceptées par le PO/CDO.

| Champ | Valeur |
|---|---|
| Décision PO/CDO | Matrice manuelle QA/UX **validée** par Jordan Tshilombo Kabamba le 2026-08-11 |
| Intégration | PR #447, merge commit `e1c72d71679eb01688d03fbd7e681d9f9bcd859a`; head validé `b27a8a2e09d7daf75b87d43a6cd5ebdab06613ea` |
| CI post-merge | CI, CodeQL, Registry Policy et CGPA Framework Audit `success` sur `e1c72d7` |
| Preuve runtime | `npm run responsive:e2e`: **20/20 PASS**, sans skip, aux viewports 360/390/640/1024px, avec TLS strict, OIDC/PKCE réel, axe, overflow, cibles 44px, reflow et reduced-motion |
| Données | seed isolé non sensible `@test.local`, 14 PASS/0 FAIL; `directAccessGrants=false` restauré |
| Matrice humaine acceptée | clavier/focus, zoom 200%, reflow, reduced-motion, Invitation, Notifications et information financière selon § critères |

### Statut des réserves US-137

| ID | Statut | Base de décision |
|---|---|---|
| RES-01 | **Levée** | Les routes authentifiées couvertes ne redirigent plus vers `/bailleur`; heading attendu et URL exacte vérifiés par la preuve Playwright. |
| RES-02 | **Levée** | Seed non sensible rend les données métier/intégrées disponibles pour la preuve. |
| RES-03 | **Levée** | La matrice acceptée couvre les montants, statuts de paiement et honoraires avec données seedées. |
| RES-04 | **Levée** | Mesure programmatique des cibles interactives ≥44px, complétée par validation humaine. |

**Verdict actualisé : GO technique pour CHECK-RESPONSIVE-01 / US-137.** Cette décision clôt uniquement les réserves responsive/a11y identifiées ci-dessus. Elle ne constitue ni Gate 04A global, ni autorisation de Staging, de Production, de migration ou de promotion.
