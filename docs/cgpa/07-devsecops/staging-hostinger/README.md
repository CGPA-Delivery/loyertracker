# Staging mutualisé Hostinger — artefacts proposés

> **Statut : PROPOSÉ, NON EXÉCUTÉ.** Aucun de ces fichiers n'a été lancé sur `srv2050514`. Leur
> exécution reste soumise à la relecture et au « oui » explicite du CDO. Plan parent :
> [`../plan-staging-partage-hostinger.md`](../plan-staging-partage-hostinger.md).

| Fichier | Rôle |
|---|---|
| `harden-host.sh` | Durcissement de l'hôte en 4 phases : `prepare`, `ssh-lockdown`, `tailscale-check`, `close-public-ssh` |
| `edge/edge.sh` | Edge mutualisé : `install`, `add-project <projet>`, `verify` (à lancer après `harden-host.sh prepare`) |
| `edge/compose.yml` | Traefik v3.7 + `docker-socket-proxy`, seul projet publiant 80/443 ; réseaux `public`, `socket` (internal) et `edge-<projet>` |
| `edge/dynamic/middlewares.yml` | `staging-auth` (basic-auth, `removeHeader`), `staging-headers`, TLS ≥ 1.2 |

### Edge — déroulé (à faire par le CDO, sur l'hôte, en root)

1. Copier le dossier `edge/` sur l'hôte (LF, vérifier la somme de contrôle).
2. `EXPECTED_HOSTNAME=srv2050514 ACME_EMAIL=<contact> ./edge.sh install` : saisie **sur l'hôte** du mot de passe d'accès Staging
   (16 caractères minimum, jamais dans le chat ni le dépôt) ; digests d'images résolus et figés dans `/srv/edge/.env`.
3. `./edge.sh verify` : ports, publication, santé, 404 sur hôte inconnu, redirection HTTP, droits (0600).
4. Par projet : `./edge.sh add-project <projet>` (recrée Traefik de façon ciblée, micro-coupure).
5. Archiver les instantanés `/srv/edge/snapshots/` comme preuve avant/après `STG-ISOL-01`.

Limites : la fusion Compose (réseaux `edge-<projet>`) est validée avec `docker compose config` ; le démarrage
réel, Let's Encrypt et `verify` ne sont **pas testés**. Un routeur de projet sans `staging-auth@file` n'est pas
détecté par ces scripts (contrôle d'onboarding). Les chemins publics (`/api/`, `/verify/`, callbacks) sont des
routeurs dédiés de priorité supérieure, sans `staging-auth`, pour ne pas intercepter les JWT Bearer (écart 5).

## Hôte visé

`srv2050514` — KVM 4, Düsseldorf, `187.7.72.186`, Ubuntu 26.04 LTS sans Docker, pare-feu Hostinger
`375064` (22/80/443 ouverts à tous, 22 provisoire).

## Déroulé (à faire par le CDO, en root puis en administrateur nominatif)

1. Se connecter à l'hôte, déposer le script, vérifier sa somme de contrôle contre le dépôt.
2. `EXPECTED_HOSTNAME=srv2050514 STG_ADMIN_USER=<login> ./harden-host.sh prepare` — SSH reste inchangé, la session actuelle reste valable.
3. Ouvrir une **2e session** en tant que `<login>` ; vérifier `sudo -n true`.
4. `EXPECTED_HOSTNAME=srv2050514 STG_ADMIN_USER=<login> ./harden-host.sh ssh-lockdown` ; **tester une nouvelle connexion** avant de
   fermer les sessions existantes.
5. Installer Tailscale et rejoindre le tailnet **à la main** (clé d'authentification saisie sur l'hôte
   uniquement, jamais dans le chat ni le dépôt) ; puis `./harden-host.sh tailscale-check`.
6. Tester SSH par l'adresse tailnet depuis un poste distinct, puis `./harden-host.sh close-public-ssh`.
7. Demander à l'assistant de retirer la règle 22 du pare-feu Hostinger (action distincte, accord requis).
8. Activer la sauvegarde automatique dans hPanel (non exposée par l'API).

## Points d'attention

- Aucune clé, aucun mot de passe, aucun jeton dans ce dépôt. La clé SSH autorisée est copiée depuis
  `/root/.ssh/authorized_keys` (clé ed25519 déjà enregistrée dans hPanel).
- Le dépôt Docker officiel n'est utilisé que s'il publie la version d'Ubuntu ; sinon repli sur
  `docker.io` d'Ubuntu (à signaler dans l'ADR).
- `NOPASSWD` sudo est limité au compte nominatif, faute de mot de passe sur ce compte.
- Ne pas rejouer `prepare` sur un hôte qui héberge des projets sans fenêtre de maintenance.
- Les ports publiés par Docker contournent UFW : seul Traefik publiera 80/443 (STG-ISOL-01).
- Le script ne crée ni Traefik, ni réseau, ni projet : ce sont des étapes distinctes du plan.

## Garde-fou « mauvais serveur »

Le 2026-10-10, `edge.sh install` a été lancé par erreur sur `srv2044374` (SonarQube) au lieu de
`srv2050514`. Les scripts exigent désormais `EXPECTED_HOSTNAME=<hôte visé>` (sans valeur par défaut) et
s'arrêtent si `hostname -s` diffère. `prepare` refuse en plus de tourner si des conteneurs existent déjà,
et `install` refuse si les ports 80/443 sont occupés. Vérifier `hostname` avant toute commande.
