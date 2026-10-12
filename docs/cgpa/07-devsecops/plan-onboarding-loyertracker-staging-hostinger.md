# Plan d'Exécution proposé — Onboarding de LoyerTracker sur le Staging mutualisé Hostinger

> **Statut : lots L1 à L3 APPROUVÉS par le CDO le 2026-10-12 ; lots L4 et L5 PROPOSÉS (décisions distinctes).**
> Aucun code applicatif modifié, aucun déploiement de LoyerTracker exécuté à ce jour. L'approbation ne vaut
> pas autorisation de promotion (voir `approbation-plan-execution-staging-hostinger.md`). Décision CGPA finale : CGPA Chief
> Delivery Officer (CDO). Cadre : CGPA v6.1.1 Enterprise. Date : 2026-10-11.
> Plan parent : [`plan-staging-partage-hostinger.md`](plan-staging-partage-hostinger.md) (PR #555, fusionnée).
> Artefacts proposés : [`staging-hostinger/loyertracker/`](staging-hostinger/loyertracker/).
>
> **Erratum du 2026-10-11 — sauvegarde.** Ce plan exigeait l'activation de la sauvegarde automatique Hostinger
> avant L3. Le CDO a décidé d'une **sauvegarde manuelle hebdomadaire dans hPanel**. Le snapshot de
> `srv2050514` (id `395915`, recréé le 2026-10-11 à 13:50:17 UTC) **expire 24 h après sa création** : le
> prérequis de L3 devient « **un snapshot de moins de 24 h au moment du lancement**, plus un `pg_dump -Fc` avec
> copie hors hôte (D6) ». Les mentions d'activation automatique (§0, §8, §9, R-ONB-09, §12) sont remplacées
> en conséquence ; le prérequis reste **bloquant**.

## 0. Périmètre et préconditions

**Objet** : faire de LoyerTracker le premier locataire de l'hôte `srv2050514` (Düsseldorf, KVM 4,
`187.7.72.186`), derrière l'edge Traefik, à `https://loyertracker.staging.tshilo.dev`. Il correspond aux
jalons M2 à M4 du plan parent ; la bascule DNS finale et le retrait d'`ai-test-server` (M5, M6) restent des
jalons distincts. **Hors périmètre** : `ai-test-server` (ni modifié ni arrêté), la Production AWS, le VPS
Francfort `srv2011505`, `srv2044374` (SonarQube).

| Précondition | État au 2026-10-11 |
|---|---|
| Hôte durci, SSH par clé et Tailscale, 22 fermé côté Hostinger | Fait (journal du plan parent) |
| Edge Traefik + socket-proxy, `edge.sh verify` | 8 PASS / 0 FAIL |
| DNS `*.staging.tshilo.dev` → `187.7.72.186` | Fait |
| Sauvegarde Hostinger | Décision du CDO du 2026-10-11 : **manuelle hebdomadaire** ; snapshot `395915` recréé le 2026-10-11 à 13:50 UTC, **expire 24 h après sa création** : un snapshot valide au moment du lancement reste **bloquant** avant tout déploiement (§9) |
| Nettoyage de `srv2044374` | À finir (non bloquant pour ce plan) |
| Décisions D-ONB-1 à D-ONB-10 (§11) | **Ouvertes** |

## 1. Constats tirés du dépôt (faits vérifiés)

1. **Le Nginx de l'image web n'écoute en clair que pour rediriger** (`listen 8080` : `/healthz` puis `301`
   vers HTTPS) ; le contenu est servi en `8443 ssl` avec un certificat `localhost` monté depuis
   `infra/nginx/certs` (non versionné). Traefik doit donc viser `8443` en TLS avec un transport qui
   n'exige pas un certificat valide pour ce saut interne (§4). Viser `8080` provoquerait une boucle de
   redirection.
2. **Le realm Keycloak versionné ne connaît que `localhost` et les domaines `loyerpro.org`**
   (`redirectUris`, `webOrigins` du client `loyertracker-spa`). Sur `*.staging.tshilo.dev`, la connexion
   OIDC serait refusée. Correctif proposé sans toucher au JSON de realm (DD-EP17-01) : un one-shot par API
   Admin (§5), calqué sur `activate-login-theme.sh`.
3. **L'URL Keycloak de la SPA est dérivée de `window.location.origin`** (aucune URL en dur trouvée dans
   `frontend/src`) : l'image web reste **immuable**, seule la configuration d'environnement change.
4. **Les fichiers `infra/` (realm, thème, scripts d'init) sont montés depuis le dépôt, pas depuis l'image.**
   Le principe « même artefact immuable » ne couvre donc que les deux images ; le checkout du dépôt sur
   l'hôte doit être **le commit de la release candidate** et son empreinte consignée (R-ONB-08).
5. **`infra/smoke/smoke-stack.sh` suppose `BASE=https://localhost…` et `CACERT=infra/nginx/certs/localhost.pem`**,
   appelle `docker compose` sans `-p`/`-f` explicites (via `COMPOSE_FILE`) et vérifie qu'`api` ne publie pas
   de port. Il devra être adapté (§7).
6. **Le quota de limitation de débit de Nginx est indexé sur `$binary_remote_addr`** : derrière Traefik, tous
   les clients partagent l'adresse du conteneur proxy (comme déjà derrière nginx-proxy-manager). Limite
   préexistante, non aggravée (R-ONB-04).
7. **Les images sont publiées sous `ghcr.io/cgpa-delivery/…`** (digests du Gate Staging US-125 : API
   `sha256:8e94c002a65bff590c9694b1dd79ca2eb9ab04639f9f59ddb5b735afe001a30d`, Web
   `sha256:18ade4b483955691fedd7d46a2c893ff27facd9d6dcf5249350005080d679d67`, commit `d19c4fea…`).
   Le choix du candidat reste à confirmer (D-ONB-2).

## 2. Architecture cible

```
Internet ─► pare-feu Hostinger 375064 (80/443) ─► Traefik (edge) ─► réseau edge-loyertracker
                                                    │                    └─► nginx :8443 (TLS interne)
   staging-auth@file (basic-auth)  sur  SPA, /auth/                                   │
   exceptions sans basic-auth      sur  /api/ , /verify/        réseau loyertracker-staging_internal
                                                                     ├─ api  ├─ keycloak ├─ postgres
                                                                     └─ one-shots : keycloak-init, theme-init,
                                                                        public-host-init  (smtp-init : profil `smtp`)
```

- Projet Compose `loyertracker-staging` ; réseaux `loyertracker-staging_internal` (sortie Internet autorisée,
  voir R-ONB-03) et `edge-loyertracker` (partagé avec Traefik seul) ; volume `loyertracker-staging_postgres-data`.
- **Aucun port publié** par le projet ; seul `nginx` rejoint l'edge.
- Limites CPU/mémoire reprises de `docker-compose.staging.yml` (≈ 2,7 Go cumulés : 512 Mo + 1 Go + 1 Go + 128 Mo ;
  one-shots transitoires hors total) : compatible avec la marge 30 % du KVM 4.

## 3. Isolation système du projet

| Élément | Valeur |
|---|---|
| Utilisateur / groupe | `stg-loyertracker` (hors groupe `docker`) |
| Racine | `/srv/loyertracker/` (0700) : `compose.yml`, `repo/` (checkout du commit de release, lecture seule), `env/.env` (0600), `certs/`, `backups/`, `.docker/` |
| Registre | `docker login ghcr.io` avec un jeton **lecture seule** `read:packages`, saisi sur l'hôte, stocké sous `DOCKER_CONFIG=/srv/loyertracker/.docker` (jamais le compte root partagé) |
| Déploiement | Clé SSH dédiée `stg-loyertracker-deploy`, `command="sudo /usr/local/sbin/stg-deploy loyertracker"`, `no-pty,no-port-forwarding` ; `stg-deploy` n'exécute que `docker compose -p loyertracker-staging … {pull,up -d,ps,logs}` sur ce projet et refuse `privileged`, `ports:`, `network_mode: host` et tout montage hors `/srv/loyertracker/` |
| Certificat interne | `localhost.pem` / `localhost-key.pem` auto-signé (SAN `localhost`), généré sur l'hôte (`openssl`), lisible par l'uid 101, jamais versionné |
| Secrets | `gen-env.sh` : secrets **neufs** (`openssl rand`), jamais affichés ; **aucun** secret repris d'`ai-test-server` ni de `srv2011505` |

`stg-deploy` et le wrapper `sudoers` sont à écrire au lot L1 (non rédigés ici pour ne pas préjuger de D-ONB-8).

## 4. Routage Traefik

Gabarit : [`loyertracker/compose.yml`](staging-hostinger/loyertracker/compose.yml) (labels sur `nginx`).

| Routeur | Règle | Priorité | Middlewares | Rôle |
|---|---|---|---|---|
| `loyertracker` | `Host(<hôte>)` | 10 | `staging-auth`, `staging-headers` | SPA et `/auth/` (Keycloak) : tout est protégé par défaut |
| `loyertracker-open` | `Host(<hôte>) && (PathPrefix(/api/) \|\| PathPrefix(/verify/))` | 100 | `staging-headers` | Exceptions **explicites** : JWT Bearer (écart NPM 5) et page publique (écart NPM 6) |

- Service : `server.port=8443`, `scheme=https`, `serverstransport=skipverify-internal@file`
  ([`transports.yml`](staging-hostinger/loyertracker/transports.yml), changement contrôlé de l'edge : `edge.sh`
  doit alors copier **tous** les `dynamic/*.yml`).
- `/api/actuator/prometheus` reste bloqué en 404 par Nginx (comportement hérité, vérifié au smoke).
- Les en-têtes de sécurité sont posés à la fois par Nginx et par `staging-headers` : doublons de
  `Strict-Transport-Security` sans conséquence fonctionnelle, à dédupliquer plus tard.

## 5. Keycloak sur le domaine Staging

- `KC_HOSTNAME=<hôte>`, `KEYCLOAK_ISSUER_URI=https://<hôte>/auth/realms/loyertracker`, JWKS et Admin API
  restent **internes** (`http://keycloak:8080/auth…`). L'émetteur ne porte aucun port.
- **`keycloak-public-host-init`** ([script](staging-hostinger/loyertracker/keycloak-public-host-init.sh)) :
  après l'import, remplace `redirectUris`, `webOrigins`, `rootUrl`, `baseUrl` du client `loyertracker-spa`
  par le **seul** hôte du Staging (validation DNS stricte de `APP_PUBLIC_HOST`). Idempotent.
- `keycloak-smtp-init` passe sous profil `smtp`, **inactif** : le flux « mot de passe oublié » reste
  indisponible tant que de nouveaux identifiants SMTP ne sont pas fournis (D-ONB-6). Les anciens sont à
  considérer exposés (plan parent, R-HOST-02).
- Le compte `bailleur-test@test.local` du bootstrap est créé avec un mot de passe neuf ; le smoke crée ses
  propres comptes suffixés par un identifiant d'exécution.

## 6. Données et secrets

- **Recommandation (D-ONB-1) : démarrage à vide.** Flyway crée le schéma (32 migrations au Gate US-125),
  les données de test sont recréées par le smoke. Cela évite de transférer des rôles PostgreSQL et leurs
  hachages (`pg_dumpall --globals-only` embarque les mots de passe des rôles `loyertracker_api` et
  `loyertracker_batch`), donc de **réintroduire d'anciens secrets**.
- Si la migration de données est exigée : restauration d'un `pg_dump -Fc` **sans** les globals, sur un schéma
  déjà créé par Flyway, avec comparaison des comptages et SHA-256 ; procédure à instruire séparément.
- `QUITTANCE_HMAC_SECRET` neuf : les QR émis sur `ai-test-server` ne sont pas vérifiables ici (sans objet en
  démarrage à vide).
- **Canaux externes fermés** (`NOTIFICATIONS_EXTERNAL_ENABLED=false`, Twilio et Resend vides, `DRY_RUN=true`,
  budget 0) : K8 et ADR-18 respectés. Toute ouverture est un Gate distinct.

## 7. Adaptations de code et d'exploitation (à porter par PR, après approbation)

| # | Changement | Fichier(s) | Nature |
|---|---|---|---|
| C1 | `keycloak-public-host-init.sh` | `infra/keycloak/` | Nouveau one-shot |
| C2 | Gabarit Compose Hostinger versionné | `infra/staging-hostinger/` (ou équivalent) | Nouveau fichier |
| C3 | `smoke-stack.sh` : variable d'arguments `curl` supplémentaires (identifiants `staging-auth`, `--resolve`), `CACERT` système, nom de projet et fichiers Compose explicites | `infra/smoke/smoke-stack.sh` | Modification mineure, comportement par défaut inchangé |
| C4 | `edge.sh` : copie de tous les `dynamic/*.yml` ; `transports.yml` | `…/staging-hostinger/edge/` | Documentaire/infra |
| C5 | Mise à jour des documents CGPA | `docs/staging-state.md`, `docs/project-state.md`, runbook §0.1/§2, `environment-promotion-model.md` | Après Gate |

Tout changement de code suit le parcours gouverné : PR, CI complète, revue humaine. **Aucun n'est engagé par
ce plan.**

## 8. Déploiement par digest et preuves (STG-ISOL-01 et smoke)

1. Préflight : snapshot Hostinger **valide à cet instant** (créé depuis moins de 24 h) ; `edge.sh verify` PASS ; instantané `STG-ISOL-01` **avant**.
2. `edge.sh add-project loyertracker` (réseau `edge-loyertracker`, recréation ciblée de Traefik).
3. Checkout du commit de release et empreinte consignée ; certificat interne ; `gen-env.sh` ; `docker login`.
4. Déploiement : `pull` puis `up -d` des services, par `stg-deploy`, avec les deux références digest.
5. Contrôles : services `healthy`, Flyway N/N, `keycloak-public-host-init` exit 0, issuer attendu.
6. Smoke (cible **63 PASS / 0 FAIL**), puis instantané `STG-ISOL-01` **après**.

| Contrôle | Attendu |
|---|---|
| `edge.sh verify` | 8 PASS ; seul `edge-traefik-1` publie des ports |
| Conteneurs `loyertracker-staging-*` | Tous `healthy` ; aucun port publié |
| `GET /` sans identifiants | 401 (`staging-auth`) |
| `GET /api/actuator/health` | 200 ; `GET /api/actuator/prometheus` public → 404 |
| `GET /verify/receipt/<id>` sans identifiants | 200 |
| `GET /api/patrimoines` sans jeton / avec jeton | 401 Spring / 200 |
| Issuer | `https://<hôte>/auth/realms/loyertracker`, sans port |
| Redirect URIs du client SPA | `https://<hôte>/*` uniquement |
| Isolation cross-tenant (smoke) | 0 fuite |
| Autres projets | Aucun autre projet sur l'hôte : `STG-ISOL-01` « tiers inchangés » sans objet à ce stade, preuve des conteneurs de l'edge inchangés hors Traefik recréé |

## 9. Sauvegarde, restauration, rollback

- **Sauvegarde Hostinger manuelle hebdomadaire (décision du CDO du 2026-10-11) : un snapshot valide au moment du
  lancement est un prérequis bloquant** (R-HOST-15) ; expirant 24 h après sa création, il ne remplace pas la
  sauvegarde applicative ; plus `infra/backup/backup-postgres.sh`
  en cron avec `BACKUP_DIR=/srv/loyertracker/backups` et un projet Compose explicite ; copie hors hôte
  (D6 du plan parent, à désigner). La restauration est éprouvée **une fois** avant le Gate.
- **Rollback applicatif** : redéployer le jeu de digests précédent. **Rollback complet** : `docker compose -p
  loyertracker-staging … down` ciblé (jamais global), puis suppression de `edge-loyertracker` et du routage ;
  `ai-test-server` reste intact pendant tout le plan.
- **Monitoring** (Prometheus, Alertmanager, Pushgateway `127.0.0.1:9091`) : **hors de ce lot** (lot dédié,
  D-ONB-7). Le heartbeat de sauvegarde et le webhook d'alerte sont à régénérer.

## 10. Lots, critères et gouvernance

| Lot | Contenu | Sortie / approbation |
|---|---|---|
| L0 | Décisions D-ONB-1 à 10 ; approbation du présent plan | CDO |
| L1 | Hôte : utilisateur, clé de déploiement, `stg-deploy`, `transports.yml`, `add-project`, checkout, certificat, `gen-env.sh`, GHCR | Preuves §8 (1-3) |
| L2 | PR C1 à C4 (CI complète, revue humaine) | PR mergée |
| L3 | Déploiement par digest, smoke, `STG-ISOL-01` avant/après | Smoke 63/0 |
| L4 | Gate Staging et mise à jour des documents (C5) | Décision CDO |
| L5 | Sauvegarde éprouvée, puis monitoring, puis bascule DNS/décommissionnement (M5, M6) | Jalons distincts |

- Contrôles applicables, **tous `non exécuté` à ce jour** : STG-ISOL-01 (bloquant), CHECK-CICD-01,
  CHECK-REL-01, CHECK-OPS-01, CHECK-VAL-01. Un contrôle applicable sans preuve n'est jamais `non applicable`.
- Gouvernances : DevSecOps et Enterprise Delivery (infra, secret, pipeline, environnement) ; UX/Frontend et
  Financial Governance **non touchées** (aucun changement de code ou de flux financier ; données de test).
- Aucun déploiement ni changement de pare-feu, de DNS ou de compte sans « oui » explicite, précédé de
  l'opération, des paramètres, du coût et de l'impact.

## 11. Risques, réserves et décisions

### 11.1 Risques

| ID | Risque | Gravité | Traitement |
|---|---|---|---|
| R-ONB-01 | Realm sans le domaine Staging : connexion impossible | Élevée | C1 (§5), vérifié au smoke |
| R-ONB-02 | Smoke conçu pour `localhost` : faux échecs ou faux succès | Moyenne | C3, essai à blanc |
| R-ONB-03 | Réseau `internal` avec sortie Internet (API, Keycloak) | Moyenne | Canaux externes fermés ; filtrage de sortie à instruire |
| R-ONB-04 | `/api/` joignable sans basic-auth (JWT seul), quota de débit partagé par l'IP du proxy | Moyenne | Comportement hérité (écarts 5, 6) ; `X-Real-IP` à instruire |
| R-ONB-05 | Mauvais serveur ou mauvais projet visé | Élevée | `EXPECTED_HOSTNAME` ; `stg-deploy` ; revue du nom d'hôte |
| R-ONB-06 | Saut TLS interne sans vérification de certificat | Faible | Réseau dédié ; CA privée en option (ADR) |
| R-ONB-07 | Limites Let's Encrypt (émissions par domaine enregistré, `tshilo.dev`) | Faible | Un certificat par hôte, essais en `staging` ACME avant le réel |
| R-ONB-08 | Dérive entre digests d'images et fichiers `infra/` du checkout | Moyenne | Commit de release fixé, empreinte consignée, contrôle avant `up` |
| R-ONB-09 | Sauvegarde Hostinger manuelle hebdomadaire ; snapshot valide 24 h seulement ; restauration non éprouvée | Élevée | Prérequis bloquant §0 et §9 : snapshot de moins de 24 h au lancement + `pg_dump` hors hôte |
| R-ONB-10 | Cible de déploiement des workflows CI non établie (non trouvée dans `ci.yml`) | Moyenne | Inventaire au lot L1 ; aucun secret ni accès Production touché |

Une réserve ne neutralise jamais un bloqueur : R-ONB-05 et R-ONB-09 sont **bloquants** pour L3.

### 11.2 Décisions requises du CDO

| # | Question | Proposition |
|---|---|---|
| D-ONB-1 | Données : démarrage à vide ou migration | À vide (§6) |
| D-ONB-2 | Candidat : digests du Gate US-125 ou dernier `main` | Digests du Gate US-125 (§1.7), puis Gate dédié — **décidé le 2026-10-11** (fiche de décision) |
| D-ONB-3 | Hôte applicatif | `loyertracker.staging.tshilo.dev` — **décidé le 2026-10-11** (fiche de décision) |
| D-ONB-4 | Exceptions sans basic-auth sur `/api/` et `/verify/` | Reconduites (§4) — **décidé le 2026-10-11** (fiche de décision) |
| D-ONB-5 | Saut TLS interne | `insecureSkipVerify` sur réseau dédié, CA privée plus tard — **décidé le 2026-10-11** (fiche de décision) |
| D-ONB-6 | SMTP Keycloak | Différé (profil `smtp`) — **décidé le 2026-10-11** (fiche de décision) |
| D-ONB-7 | Monitoring | Lot séparé après la sauvegarde — **décidé le 2026-10-11** (fiche de décision) |
| D-ONB-8 | Provenance du dépôt sur l'hôte | Archive du commit de release (empreinte consignée) plutôt qu'un `git clone` authentifié — **décidé le 2026-10-11** (fiche de décision) |
| D-ONB-9 | Jeton GHCR lecture seule : propriétaire et rotation | À désigner — **décidé le 2026-10-11** (fiche de décision) |
| D-ONB-10 | Premier calendrier de L1 à L4 | À fixer — **décidé le 2026-10-11** (fiche de décision) |

## 12. Prochaines étapes

1. Relecture et décisions D-ONB-1 à 10 par le CDO.
2. Sauvegarde valide au moment du lancement (snapshot de moins de 24 h, plus `pg_dump` hors hôte) : prérequis de L3.
3. Sur « oui » explicite, L1 puis L2 : chaque action (compte, clé, réseau, changement de l'edge, PR) est
   annoncée avec ses paramètres et son impact avant exécution.
