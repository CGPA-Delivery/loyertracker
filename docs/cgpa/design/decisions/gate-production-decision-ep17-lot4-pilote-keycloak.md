# Décision Gate Production — EP-17 Lot 4 (Pilote Keycloak)

| Champ | Valeur |
|---|---|
| Date d'instruction | 2026-08-04 |
| Périmètre | Thème Keycloak `login/` — 6 écrans confirmés (login, mot de passe oublié, reset password, session expirée, accès refusé, logout) |
| Gate Staging préalable | `gate-staging-decision-ep17-lot4-pilote-keycloak.md` — **GO sous réserve (2026-08-04)** |
| Artefact | `infra/keycloak/themes/loyertracker/`, `infra/keycloak/activate-login-theme.sh`, montage `docker-compose.prod.yml` (déjà mergé sur `main`, jamais déployé) |
| Nature du changement | Configuration/thème CSS + un attribut de realm (`loginTheme`) via API Admin — **aucun code applicatif, aucune migration Flyway, aucun changement de schéma, aucune image Docker modifiée** |
| État Production constaté | Relevé live 2026-08-04 16:39 UTC : 8/8 conteneurs `Up`/`healthy`, repo hôte à `162154e` (très en retard sur `main`, `793be85`), **thème non monté** dans le conteneur `keycloak` en cours d'exécution, `loginTheme` par défaut, `internationalizationEnabled=false` — Production n'a reçu aucun des changements Lot 4 à ce jour |
| Contexte | Ce Plan d'Exécution déclare explicitement le Gate Production « hors périmètre... phase ultérieure » (§10) — cette instance construit les critères, absents du Plan, spécifiques à un artefact thème/config plutôt que de réutiliser tel quel le gabarit des releases applicatives (Flyway, tag SemVer, image GHCR) |

## 1. Ce que ce Gate couvre — et ne couvre pas

Ce Gate évalue si la promotion **Production** du thème Keycloak est prête à être instruite. **Il
n'autorise ni Préflight, ni backup, ni déploiement technique** — ces étapes restent, conformément
au patron déjà appliqué à chaque release de ce projet, des actions distinctes sur instruction PO
explicite postérieure à ce Gate.

## 2. Checklist

| Critère | Statut | Preuve |
|---|---|---|
| Même artefact immutable entre Staging et Production (`CLAUDE.md`) | **PASS** | `git diff` vide entre le commit de validation Staging (`3ef7d06`) et `main` (`793be85`) sur les fichiers de thème, le script d'activation et les 3 `docker-compose*.yml` |
| Câblage Docker Production déjà préparé | **PASS** | `docker-compose.prod.yml` monte déjà `./infra/keycloak/themes/loyertracker` (lecture seule) ; `keycloak-theme-init` hérité du fichier de base ; fusion vérifiée par `docker compose ... config` le 2026-08-03 (`docs/project-state.md`, entrée du même jour) |
| Aucune modification des flux OIDC/PKCE ni des fichiers de realm | **PASS** | Vérifié à chaque étape (câblage, locale, Lot 5) ; `realm-loyertracker-production.json` absent de tout diff |
| 13 interdictions de sécurité `ADR-UI-001` §Sécurité | **PASS** | Audit statique 13/13 RAS (2026-08-03) + confirmé dynamiquement par 8 scénarios réels contre le même artefact en Staging (Lot 5, 2026-08-04) |
| Absence de fuite d'information | **PASS** | 8 corps de réponse inspectés en Staging, aucune trace technique — comportement Keycloak identique en Production (même image, même digest) |
| Gate Staging du pilote | **PASS sous réserve** | `gate-staging-decision-ep17-lot4-pilote-keycloak.md` — GO sous réserve, deux réserves ouvertes ci-dessous |
| Plan de rollback documenté (`CLAUDE.md`) | **PASS** | Revenir `loginTheme=keycloak` (défaut) via le même mécanisme API Admin, idempotent et déjà démontré ; aucune donnée ni schéma concerné ; retrait du montage de volume si nécessaire (changement de fichier Compose, pas de perte de données) |
| Sauvegarde préalable | **Non exécuté** | Aucune sauvegarde Production n'a encore été prise pour ce changement — à produire au Préflight (étape distincte), même si le risque de perte de données est nul (aucune écriture en base) |
| Synchronisation du dépôt hôte Production | **Non exécuté** | Hôte à `162154e`, très en retard sur `main` (`793be85`) — `git pull --ff-only` requis avant tout déploiement technique, étape distincte |
| Validation Product Owner du **contenu** de `phase-02-user-journeys-ep17-lot4.md` / `phase-02-ui-mockups-ep17-lot4.md` | **Non exécuté** | Toujours pas obtenue — plus consequente pour une promotion **Production** (utilisateurs réels) que pour Staging seul |
| `CHECK-FRONTEND-01` de remplacement | **Non exécuté** | Toujours à instancier formellement (réserve déjà portée au Gate Staging) |
| `DD-EP17-14` (mot de passe oublié cassé, canal d'énumération) | **Ouvert, non bloquant** | Défaut de Production **préexistant**, indépendant du thème — le thème ne l'aggrave ni ne le masque (état d'erreur honnête déjà maquetté) ; arbitrage du 2026-08-04 confirme aucun changement de traitement |

## 3. Avis spécialisés proposés

| Agent | Avis proposé | Réserve continue |
|---|---|---|
| Design Architect | GO sous réserve | Validation PO du contenu — plus sensible en Production que sur Staging |
| Frontend Architect | GO sous réserve | `CHECK-FRONTEND-01` de remplacement toujours à instancier ; recommande la vérification manuelle réelle post-déploiement (même méthode qu'en Staging), pas seulement une lecture de code |
| DevSecOps Lead | **GO sous réserve** | Sécurité du thème lui-même sans réserve (13/13 RAS, confirmé dynamiquement) ; réserve porte uniquement sur l'hygiène opérationnelle du déploiement lui-même — sauvegarde et synchronisation du dépôt hôte à produire au Préflight, pas encore faites |
| UX/UI Design Lead | GO sous réserve | Même réserve que Design Architect — contenu |

Ces avis sont proposés par Claude Code dans les rôles CGPA désignés
(`agent-designations-loyertracker.md`) — limite d'indépendance déjà tracée. Aucun n'a valeur de
décision : conformément à `CLAUDE.md`, la décision CGPA finale reste au Product Owner / Chief
Delivery Officer, et « aucun pipeline, score, audit automatique ou agent spécialisé ne remplace la
validation humaine requise ».

## 4. Différence avec le gabarit Gate Production des releases applicatives

Ce Gate ne reprend pas le gabarit habituel (compteur Flyway, tag SemVer, digests GHCR, verrou
`R-V54-2`) : cet artefact ne modifie ni le schéma, ni le code applicatif, ni aucune image Docker —
`infra/release/production-state.env` et `check-release-state.sh` **ne sont pas concernés** par ce
changement et resteront inchangés par tout déploiement de ce thème.

## 5. Ce que ce Gate n'autorise pas, même en GO

* Aucun déploiement technique — Préflight (sauvegarde, synchronisation du dépôt hôte) puis
  déploiement technique restent des actions distinctes, sur instruction PO explicite.
* Aucune extension à l'Account Console ni à l'acceptation d'invitation (`DD-EP17-12`).
* Aucune résolution de `DD-EP17-14` — reste hors du périmètre bloquant, suivi séparé.

## 6. Décision finale

**Instruction explicite reçue** : « instruis le Gate Production du pilote Keycloak » (2026-08-04),
suivie du choix explicite « GO sous réserve » sur la checklist §2 et les avis §3 ci-dessus.

**Chief Delivery Officer : GO SOUS RÉSERVE — Gate Production du pilote Keycloak (Lot 4) validé
(2026-08-04).**

* La promotion **Production** du thème Keycloak (6 écrans confirmés) est **validée sur le plan
  technique et sécurité** : même artefact qu'en Staging (aucun diff), 13 interdictions de sécurité
  respectées et confirmées dynamiquement, câblage Docker Production déjà mergé et vérifié, plan de
  rollback simple et sans impact de données.
* **Réserves opérationnelles, à lever au Préflight (étape distincte, non autorisée par ce GO)** :
  sauvegarde préalable, synchronisation du dépôt hôte Production (`git pull --ff-only`, très en
  retard sur `main`).
* **Deux réserves héritées du Gate Staging restent ouvertes, non bloquantes pour ce GO, tracées
  explicitement** :
  1. Validation Product Owner du **contenu** de `phase-02-user-journeys-ep17-lot4.md` /
     `phase-02-ui-mockups-ep17-lot4.md` — reste à obtenir séparément, sur instruction PO distincte.
  2. `CHECK-FRONTEND-01` de remplacement — reste à instancier formellement, Frontend Architect
     responsable.
* `DD-EP17-14` (mot de passe oublié cassé, canal d'énumération) reste **hors du périmètre bloquant
  de ce Gate** — défaut préexistant, indépendant du thème, suivi propre déjà arbitré.

**Ce que ce GO n'autorise pas** : aucun Préflight, aucune sauvegarde, aucun déploiement technique —
ces étapes restent des actions PO distinctes, postérieures à ce Gate. Aucune extension à l'Account
Console ni à l'acceptation d'invitation. Aucune résolution de `DD-EP17-14` par cette décision.

**Prochaine action autorisée** : instruction PO explicite et distincte pour le Préflight (sauvegarde
+ synchronisation du dépôt hôte), préalable à tout déploiement technique du thème en Production.
