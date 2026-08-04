# Décision Gate Staging — EP-17 Lot 4 (Pilote Keycloak)

| Champ | Valeur |
|---|---|
| Date d'instruction | 2026-08-04 |
| Périmètre | Thème Keycloak `login/` — 6 écrans confirmés (login, mot de passe oublié, reset password, session expirée, accès refusé, logout), `infra/keycloak/themes/loyertracker/`, `infra/keycloak/activate-login-theme.sh` |
| Distinct de | Gate Staging du pilote Angular (Lots 1-3), non couvert par ce document — `plan-execution-ux-ui-primeng-keycloak.md` §10 les traite explicitement comme deux Gates distincts |
| Environnement | `ai-test-server` (Staging mutualisé), déploiement ciblé `keycloak`/`keycloak-init`/`keycloak-theme-init` uniquement (`api`/`nginx`/`postgres`/monitoring non touchés) |
| Artefact | Aucune image Docker modifiée — fichiers de thème (CSS/`theme.properties`) + script d'activation Admin API, montés en lecture seule |
| Rollback | Suppression du montage du thème + réimport `loginTheme=keycloak` (défaut), aucune migration de données concernée |

## 1. Ce que ce Gate couvre

La validation de la **promotion Staging** du thème Keycloak du Lot 4 — pas une autorisation de
Gate Production (distinct, hors périmètre), pas le Gate Staging du pilote Angular (distinct), et
pas une clôture du Lot 5 dans son ensemble (les items non-Keycloak du Lot 5 — a11y automatisé,
responsive formel, tests unitaires/composants Angular, Visual Review, bundle — restent `Non
exécuté`, hors périmètre de ce thème CSS-only sans composant Angular).

## 2. Checklist

| Critère | Statut | Preuve |
|---|---|---|
| Aucune modification des flux OIDC/PKCE ni des fichiers de realm | **PASS** | `git diff` vide sur `realm-loyertracker.json`/`realm-loyertracker-production.json` vérifié à chaque étape (câblage du thème, activation locale) |
| 13 interdictions de sécurité `ADR-UI-001` §Sécurité | **PASS** | Audit statique 13/13 RAS (2026-08-03) **et** confirmé dynamiquement par les 8 scénarios réels du Lot 5 (2026-08-04) — aucune trace technique dans les corps de réponse inspectés |
| `STG-ISOL-01` (Staging mutualisé) | **PASS** | Live PASS avant/après (2026-08-03) : 9 conteneurs `loyertracker-staging-*`×8 + `nginx-proxy-manager` intacts, seul `keycloak` recréé, aucune commande Docker globale |
| Thème appliqué et fonctionnel sur les 6 écrans confirmés | **PASS** | Vérifié réel en conditions OIDC/PKCE (login, mot de passe oublié, reset expiré, session expirée, accès refusé, logout) — `security-tests-lot5-ep17-keycloak-theme.md` |
| Locale française | **PASS** | `DD-EP17-13` close (2026-08-03), confirmée sur les 8 scénarios du Lot 5 (`<html lang="fr">`, messages traduits) |
| Absence de fuite d'information | **PASS** | 8 corps de réponse inspectés directement — aucune exception, stack trace, ni détail technique |
| Smoke Staging | **PASS** | 63 PASS / 0 FAIL lors du déploiement `STG-ISOL-01` (2026-08-03) |
| Stratégie de test adaptée à un artefact FreeMarker/CSS (réserve Frontend Architect, Gate 04A §11) | **PASS sous réserve** | Vérification manuelle réelle démontrée à 3 reprises (câblage initial, locale française, Lot 5) ; **`CHECK-FRONTEND-01` de remplacement formel reste à instancier** — dette d'outillage, pas d'absence de preuve |
| Validation Product Owner du **contenu** de `phase-02-user-journeys-ep17-lot4.md` / `phase-02-ui-mockups-ep17-lot4.md` | **Non exécuté** | Distincte de toutes les décisions de Gate déjà rendues (`gate-04A-decision-ep17-lot4.md` §11, extension du Plan §Lot 4) — jamais formellement obtenue à ce jour |
| `DD-EP17-14` (mot de passe oublié cassé, SMTP absent) | **Ouvert, non bloquant** | Suivi séparé depuis le 2026-08-02 ; arbitrage du 2026-08-04 confirme aucun changement de traitement, canal d'énumération identifié sans action distincte requise |

**Conformément au Validation Framework CGPA v6.1.1 (§4-5) : un contrôle applicable sans preuve est
`non exécuté`, jamais `PASS` ni `non applicable`.** La ligne « validation PO du contenu » est donc
classée ainsi, pas ignorée.

## 3. Avis spécialisés proposés

Sur la base de la checklist ci-dessus, mise à jour depuis `gate-04A-decision-ep17-lot4.md` §11 (dont
les réserves alors ouvertes — `DD-EP17-03`, `DD-EP17-13`, `STG-ISOL-01`, audit sécurité — sont
maintenant toutes satisfaites) :

| Agent | Avis proposé | Réserve continue |
|---|---|---|
| Design Architect | GO sous réserve | Validation PO du contenu des parcours/maquettes, seule pièce manquante côté conception |
| Frontend Architect | GO sous réserve | `CHECK-FRONTEND-01` de remplacement toujours à instancier formellement (dette d'outillage, pas de preuve manquante sur le fond) |
| DevSecOps Lead | **GO**, sans réserve | Toutes les réserves de sécurité du Gate 04A (audit statique, `STG-ISOL-01`) sont désormais satisfaites et confirmées dynamiquement par le Lot 5 |
| UX/UI Design Lead | GO sous réserve | Même réserve que Design Architect — validation PO du contenu |

Ces avis sont proposés par Claude Code dans les rôles CGPA désignés
(`agent-designations-loyertracker.md`) — limite d'indépendance déjà tracée pour ce projet. Aucun
n'a valeur de décision : conformément à `CLAUDE.md`, la décision CGPA finale reste au Product Owner
/ Chief Delivery Officer.

## 4. Ce que ce Gate n'autorise pas, même en GO

* Aucune promotion Production — Gate Production distinct requis, hors périmètre.
* Aucune extension à l'Account Console ni à l'acceptation d'invitation (`DD-EP17-12`, hors
  périmètre Keycloak).
* Aucune clôture du Lot 5 dans son ensemble — les items non-Keycloak (a11y, responsive, bundle,
  tests Angular) restent à instruire séparément, sans lien avec ce thème.

## 5. Décision finale

**Instruction explicite reçue** : « instruis le Gate Staging du pilote » (2026-08-04), suivie du
choix explicite « GO sous réserve » sur la checklist §2 et les avis §3 ci-dessus.

**Chief Delivery Officer : GO SOUS RÉSERVE — Gate Staging du pilote Keycloak (Lot 4) validé
(2026-08-04).**

* La promotion Staging du thème Keycloak (6 écrans confirmés du `login/`) est **validée** : tous
  les critères objectifs de la checklist §2 sont **PASS** — aucune modification OIDC/PKCE/realm,
  13 interdictions de sécurité respectées et confirmées dynamiquement, `STG-ISOL-01` PASS,
  fonctionnement réel vérifié sur les 6 écrans, locale française confirmée, aucune fuite
  d'information, smoke 63/0.
* **Deux réserves restent ouvertes, non bloquantes pour ce GO, tracées explicitement** :
  1. Validation Product Owner du **contenu** de `phase-02-user-journeys-ep17-lot4.md` et
     `phase-02-ui-mockups-ep17-lot4.md` — reste à obtenir séparément, sur instruction PO distincte
     lorsque la revue de contenu aura lieu.
  2. `CHECK-FRONTEND-01` de remplacement (artefact FreeMarker/CSS, sans équivalent Angular direct)
     reste à instancier formellement — dette d'outillage, Frontend Architect responsable.
* `DD-EP17-14` (mot de passe oublié cassé, canal d'énumération) reste **hors du périmètre bloquant
  de ce Gate** — suivi propre déjà arbitré le même jour (aucun changement de traitement).

**Ce que ce GO n'autorise pas** : aucune promotion Production (Gate Production distinct requis),
aucune extension à l'Account Console ni à l'acceptation d'invitation, aucune clôture du Lot 5 dans
son ensemble (items non-Keycloak restants : a11y automatisé, responsive formel, tests Angular,
Visual Review, bundle — tous `Non exécuté`, sans lien avec ce thème).

**Prochaine action autorisée** : Gate Production distinct si une promotion Production du pilote
Keycloak est souhaitée (instruction PO explicite requise, hors périmètre CGPA immédiat pour un
pilote sans Account Console) ; sinon, poursuite des items plus larges du Lot 5 ou traitement des
deux réserves ci-dessus, sur instruction PO.
