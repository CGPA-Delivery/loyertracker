# Plan d'Exécution proposé — Staging mutualisé multi-projets sur Hostinger (Francfort)

> **Statut : PROPOSÉ — aucune ressource créée.** Ce document ne vaut ni Plan d'Exécution approuvé, ni
> autorisation d'achat, de changement DNS, de modification de pare-feu ou de promotion.
> Décision CGPA finale : CGPA Chief Delivery Officer (CDO). Cadre : CGPA v6.1.1 Enterprise.
> Prompt d'origine : `docs/prompts/prompt-staging-partage-hostinger.md`.
> Date : 2026-10-10 — branche `docs/staging-partage-hostinger`.

## 0. Constats préalables (lecture seule, 2026-10-10)

### 0.1 Compte Hostinger (API `hostinger-vps`)

| Constat | Détail |
|---|---|
| Datacenter Francfort | **Disponible** : `fra` (id 19, DE). Alternative allemande : `dus` Düsseldorf (id 25). |
| VPS existant A | `srv2011505` — KVM 1 (1 vCPU / 4 Go / 50 Go), **Francfort**, `31.97.39.232`, Ubuntu 24.04 + Docker, créé le 2026-09-26. |
| VPS existant B | `srv2044374` — KVM 2 (2 vCPU / 8 Go / 100 Go), `data_center_id: 15` **absent de la liste des datacenters**, Ubuntu 26.04 **LTS**, créé le 2026-10-08. **Il n'est pas vide : le DNS `sonar.tshilo.dev` pointe sur `92.112.194.1` et le pare-feu s'appelle `sonar-baseline`** — c'est le serveur SonarQube utilisé par la CI (`ci.yml`). Docker Manager indisponible sur cet OS (pas d'inventaire des conteneurs). Emplacement **non vérifié**. Pare-feu `is_synced: false`, SSH ouvert à `any`. *(Correction du 2026-10-10 : une version antérieure de ce plan le disait vide et non LTS.)* |
| Prix et plans | **L'API MCP n'expose aucune opération de catalogue ou de prix.** Les prix sont donc `non vérifiés` : à relever dans hPanel avant tout achat. Les tailles de plan cités en §1 sont à confirmer au même endroit. |

### 0.2 Contenu du VPS A (Francfort)

Un Traefik v3.7 (80/443, Let's Encrypt HTTP-01), un Keycloak 26 « IAM partagé » (`auth.tshilo.dev`),
et LoyerTracker (api, nginx, postgres) aux **digests du Gate Staging US-125 du 2026-08-08**.
Domaine `*.tshilo.dev`. Aucune trace de ce serveur dans `project-state.md`, `staging-state.md` ni
dans un ADR : il est **hors gouvernance**.

Écarts constatés (voir R-HOST-01 à R-HOST-06, §7) :
- pare-feu Hostinger : `22`, `80`, `443` ouverts à `any` ;
- un seul réseau `traefik_web` partagé ; `docker.sock` monté dans Traefik ;
- `.env` LoyerTracker avec `NOTIFICATIONS_EXTERNAL_ENABLED=true`, `NOTIFICATION_DRY_RUN=false`,
  `RESEND_EMAIL_ENABLED=true` et `KC_HOSTNAME=loyertracker.loyerpro.org` (domaine de la **Production**) ;
- fichier Compose lu = stack de développement (`build:`, `start-dev`), différent des 3 conteneurs
  réellement actifs : invocation réelle non établie sans accès SSH ;
- sauvegarde automatique : 1 point (2026-10-03) ; aucun snapshot.
- **Incident de secrets** : l'API a renvoyé en clair les `.env` de ce serveur dans la session de
  travail du 2026-10-10. Rotation recommandée (voir R-HOST-02). Aucune valeur n'est consignée ici.

### 0.2b DNS (lecture seule, `hostinger-dns` / `hostinger-domains`)

`tshilo.dev` est **actif chez Hostinger** (expire le 2027-09-26) : la zone est gérable par API, donc
Let's Encrypt HTTP-01 par hôte suffit (aucune dépendance à Route 53). Enregistrements utiles, TTL 300 s :
`loyertracker`, `traefik`, `auth` → `31.97.39.232` (VPS A) ; `sonar` → `92.112.194.1` (VPS B). Aucun
enregistrement `staging` n'existe : `*.staging.tshilo.dev` ne collisionne avec rien. Deux « free
domains » sont `pending_setup` (non utilisés ici).

### 0.3 Faits du dépôt retenus

Production AWS `eu-central-1a`, EIP `18.158.70.88`, `loyertracker.loyerpro.org` ; Staging actuel
`ai-test-server` (`172.31.11.102`), nginx-proxy-manager, projet `loyertracker-staging` (8 à 9
conteneurs), `loyertracker.staging.loyerpro.org`, Access List basic-auth `staging`. Écarts NPM
historiques à ne pas reproduire : la basic-auth interceptait les JWT Bearer sur `/api/` (écart 5,
2026-06-30) et la page publique `/verify/` (écart 6, 2026-07-24).

## 1. Hôte cible et dimensionnement

**Hôte retenu le 2026-10-10 (décision CDO) : `srv2050514`, KVM 4 (4 vCPU / 16 Go / 200 Go), datacenter
Düsseldorf (`dus`, id 25), `187.7.72.186`, Ubuntu 26.04 LTS.** C'est un écart assumé par rapport à
l'achat décidé (KVM 2, Francfort, Ubuntu 24.04 avec Docker) : voir §1.1. Le VPS A est trop petit et
hors gouvernance ; il n'est ni réutilisé ni migré en place.

| Poste | Hypothèse | Valeur |
|---|---|---|
| RAM par projet type (api + postgres + front [+ Keycloak]) | LoyerTracker mesuré à ~1,7 Go pour Traefik + Keycloak + 3 conteneurs ; plafond retenu | 2 Go |
| RAM 5 projets | 5 × 2 Go | 10 Go |
| Hôte + edge + monitoring | | 2 Go |
| Marge 30 % | (10 + 2) × 1,3 | **≈ 15,6 Go → 16 Go** |
| vCPU | CPU mesuré ~3,6 % d'1 vCPU au repos ; pics de déploiement/migration | **4 vCPU** |
| Disque | OS+Docker 20 Go + 5 × 12 Go (images, volumes) + sauvegardes locales 30 Go = 110 Go, ×1,3 | **≈ 145 Go → 200 Go** |

**Alternatives** : KVM 2 (8 Go) — suffisant pour 2 à 3 projets seulement, non conforme à ≥ 5 + 30 % ;
KVM 8 (32 Go) — à n'envisager qu'au-delà de 8 projets. **Prix : non vérifiés** (voir §0.1).

Sauvegardes et reprise : sauvegarde automatique Hostinger **activée** ; snapshot avant chaque
changement structurant (un seul snapshot conservé, **le suivant écrase le précédent**) ; en plus,
`pg_dump -Fc` par projet vers `/srv/<projet>/backups` avec copie hors hôte (cible à décider, D6),
conformément au mode opératoire `infra/backup/`.

### 1.1 Décisions CDO reçues le 2026-10-10 et leurs conséquences

| Décision | Conséquence |
|---|---|
| **D1/D2 : « KVM 2 »** | Précisé le 2026-10-10 (D2 bis) : achat d'un nouveau KVM 2 à Francfort ; `srv2044374` (SonarQube) n'est pas réutilisé. Le sort du VPS A (D1) reste à confirmer (§6.4). |
| **D2 ter : KVM 4 à Düsseldorf conservé** | **Décision CDO du 2026-10-10**, après constat que `srv2050514` livré diffère de la décision : KVM 4 au lieu de KVM 2, `dus` (Düsseldorf) au lieu de `fra`, Ubuntu 26.04 LTS sans Docker au lieu de 24.04 avec Docker. Conséquences : (a) l'exigence « ≥ 5 projets + 30 % » est tenue (§1) ; (b) la **région n'est plus Francfort** : même pays (Allemagne), pas le même datacenter que la Production AWS — **écart au §1 du prompt, accepté par décision CDO**, le trafic Staging ↔ Production restant sans réseau privé commun (§6.1) ; (c) Docker est à installer et à durcir (§4.1) ; (d) prix et période de facturation de ce plan à relever en hPanel (l'API ne les expose pas) ; (e) l'impact ci-dessous relatif à KVM 2 est **sans objet** et conservé pour mémoire. |
| **D5 bis : Tailscale** | **Accepté** le 2026-10-10 : option 1 de §4.1b. Voir « Prérequis Tailscale » ci-dessous. |
| **D3 : `staging.tshilo.dev`** | Hôtes `<projet>.staging.tshilo.dev` ; un seul enregistrement `A *.staging` vers le nouvel hôte (TTL 300 s), HTTP-01 par hôte. `loyertracker.tshilo.dev` (VPS A) reste inchangé. |
| **D5 : pas d'IP publique fixe** | Une restriction SSH par IP est inapplicable (ni pour l'administrateur ni pour les runners GitHub Actions). Alternative proposée en §4.1b. |

**État constaté de `srv2050514` à la livraison (lecture seule, 2026-10-10)** : aucun pare-feu Hostinger
(`firewall_group_id: null`), aucune sauvegarde ni snapshot, une clé SSH ed25519 `tshil@Dell-XPS-159530`
enregistrée pour root. Ces trois points sont des **prérequis bloquants** avant tout déploiement (R-HOST-15).

**Impact de KVM 2 (8 Go) sur le dimensionnement — sans objet depuis D2 ter, conservé pour mémoire.** Avec 2 Go par projet, 2 Go d'hôte et 30 % de marge :
(2 × 2 + 2) × 1,3 ≈ 7,8 Go. Un KVM 2 couvre donc **2 projets avec marge**, pas 5 : l'exigence « ≥ 5
projets + 30 % » n'est **pas tenue**. Options : accepter 2 à 3 projets (3 projets = 10,4 Go, sans marge
de 30 %) en limitant les services (un Keycloak mutualisé par projet n'est pas viable, un seul
Postgres par projet) ; ou KVM 4 dès qu'un 3e projet est prévu (migration par snapshot/reconstruction).
Le disque de 100 Go suffit pour 3 projets (3 × 12 + 20 + 30 = 86 Go, sans marge).

## 2. Schéma cible

```
Internet ──► Pare-feu Hostinger (22 = IP admin/CI ; 80/443 = any)
              └► UFW + fail2ban (défense en profondeur)
                  └► Traefik (seul processus publiant 80/443)
                       ├─ réseau `socket` (internal) ── docker-socket-proxy (lecture conteneurs)
                       ├─ réseau `edge-loyertracker` ──► <front> du projet loyertracker
                       ├─ réseau `edge-<projet2>`    ──► <front> du projet 2
                       └─ …
Par projet : name: <projet>-staging
   réseau `<projet>-staging_internal` (internal: true) : api, db, keycloak éventuel
   volumes `<projet>-staging_*` · /srv/<projet>/ · utilisateur Linux `stg-<projet>`
```

Choix structurants (à acter dans l'ADR) :

1. **Un réseau `edge-<projet>` par projet, et non un `edge` unique.** Sur un bridge unique tous les
   conteneurs attachés se joignent entre eux ; `icc=false` n'est pas utilisable car il couperait aussi
   Traefik → front. Coût : ajouter un projet modifie la liste des réseaux de Traefik (changement
   contrôlé, `up -d traefik` ciblé, micro-coupure). L'alternative `edge` unique reste possible si le CDO
   accepte le risque de mouvement latéral entre fronts (R-HOST-07).
2. **`docker-socket-proxy` devant `docker.sock`** : Traefik ne monte pas le socket (équivalent root
   sur l'hôte) ; le proxy n'autorise que la lecture des conteneurs.
3. **Traefik** (configuration en code, versionnée) plutôt que nginx-proxy-manager : pas d'état SQLite à
   sauvegarder, routage par labels, revue par PR. NPM reste possible (continuité) mais ses écarts 5/6
   montrent le coût des exceptions faites à la main (Q2, D4).
4. **Pas d'IAM partagé entre projets** en Staging : un Keycloak par projet, dans son réseau interne
   (limite le rayon d'impact). Le Keycloak partagé du VPS A n'est pas reproduit.
5. **Accès par défaut fermé** : middleware `staging-auth` (file provider) **obligatoire sur chaque
   routeur**, vérifié par un contrôle d'onboarding ; exceptions explicites par chemin (`/api/`,
   `/verify/`, callbacks Twilio/Resend) sous forme de routeurs dédiés de priorité supérieure, **sans**
   réintroduire l'interception des en-têtes `Authorization: Bearer`. Un routeur « catch-all » de
   priorité minimale répond 404 aux hôtes inconnus.
6. **TLS** : Let's Encrypt **HTTP-01 par hôte** (les certificats joker exigent DNS-01, donc une API
   DNS du fournisseur de la zone). Compte ACME et `acme.json` (droits 600) sauvegardés.

## 3. Arborescence et conventions

```
/srv/
  edge/                     # propriétaire : stg-edge (Traefik, socket-proxy, middlewares)
    compose.yml  dynamic/   letsencrypt/(600)
  <projet>/                 # propriétaire : stg-<projet>, mode 0700
    compose.yml             # versionné (copie du dépôt du projet, tag/digest figé)
    env/.env                # 0600, hors dépôt, généré sur l'hôte
    data/  backups/  logs/
/usr/local/sbin/stg-deploy  # wrapper sudo (voir §4)
```

Nommage : projet Compose `<projet>-staging` ; réseaux `<projet>-staging_internal` et
`edge-<projet>` ; volumes `<projet>-staging_<nom>` ; utilisateur `stg-<projet>` ; hôte
`<projet>.staging.<domaine>` ; clé de déploiement `stg-<projet>-deploy` (une par projet).

## 4. Durcissement hôte et gabarit Compose (proposés, non exécutés)

### 4.1 Durcissement (script `harden-host.sh`, idempotent, à relire avant exécution)

> **Version de référence : [`staging-hostinger/harden-host.sh`](staging-hostinger/harden-host.sh)**
> (4 phases : `prepare`, `ssh-lockdown`, `tailscale-check`, `close-public-ssh`, adaptées à Ubuntu 26.04
> sans Docker préinstallé et à l'absence d'IP fixe). Le bloc ci-dessous est l'ébauche initiale, conservée
> pour mémoire ; elle suppose `ADMIN_IPS` et n'est **plus** la version à exécuter.

```bash
#!/usr/bin/env bash
# PROPOSÉ — NON EXÉCUTÉ. Variables à fournir : ADMIN_IPS (liste CIDR), STG_ADMIN_USER.
set -euo pipefail
: "${ADMIN_IPS:?}" "${STG_ADMIN_USER:?}"

# 1. Mises à jour de sécurité automatiques
apt-get update && apt-get install -y unattended-upgrades fail2ban ufw
dpkg-reconfigure -f noninteractive unattended-upgrades

# 2. Administrateur nominatif, root SSH désactivé, clés seules
id "$STG_ADMIN_USER" >/dev/null 2>&1 || adduser --disabled-password --gecos "" "$STG_ADMIN_USER"
usermod -aG sudo "$STG_ADMIN_USER"
install -d -m 700 -o "$STG_ADMIN_USER" "/home/$STG_ADMIN_USER/.ssh"   # clé publique fournie hors dépôt
cat >/etc/ssh/sshd_config.d/90-staging.conf <<'EOF'
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
MaxAuthTries 3
AllowUsers STG_ADMIN_USER_PLACEHOLDER
EOF
sed -i "s/STG_ADMIN_USER_PLACEHOLDER/$STG_ADMIN_USER/" /etc/ssh/sshd_config.d/90-staging.conf
sshd -t   # NE PAS recharger avant d'avoir validé une 2e session SSH ouverte

# 3. UFW : 22 restreint, 80/443 publics
ufw default deny incoming; ufw default allow outgoing
for ip in $ADMIN_IPS; do ufw allow from "$ip" to any port 22 proto tcp; done
ufw allow 80/tcp; ufw allow 443/tcp
ufw --force enable
# NB : les ports publiés par Docker contournent UFW. Garde-fou : seul Traefik publie des ports
# (contrôle STG-ISOL-01) ; le pare-feu Hostinger reste la barrière principale.

# 4. Docker : rotation des logs, pas de userland-proxy superflu
cat >/etc/docker/daemon.json <<'EOF'
{ "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" },
  "no-new-privileges": true, "live-restore": true }
EOF
systemctl restart docker   # sans conteneur tiers sur l'hôte neuf ; à ne JAMAIS faire sur un hôte occupé sans fenêtre

# 5. fail2ban sshd
printf '[sshd]\nenabled = true\nmaxretry = 3\nbantime = 1h\n' >/etc/fail2ban/jail.d/sshd.local
systemctl enable --now fail2ban
```

### 4.1b Accès SSH sans adresse IP fixe (D5) — proposition à valider

Le script §4.1 suppose `ADMIN_IPS`. Sans IP fixe, deux options :

1. **Recommandée : réseau privé Tailscale** (ou WireGuard auto-hébergé). Le port 22 est fermé à
   Internet (pare-feu Hostinger **et** UFW) ; SSH n'écoute que sur l'interface `tailscale0`.
   Les déploiements CI utilisent un nœud **éphémère** (action GitHub officielle) avec une étiquette
   ACL qui n'ouvre que le port 22 de cet hôte et seulement le compte `stg-<projet>-deploy`.
   Coût : un compte Tailscale (offre gratuite suffisante a priori, à confirmer) et un agent sur l'hôte.
   Secours : console navigateur/VNC Hostinger (accès hPanel) si le tunnel tombe.
2. **Repli : SSH ouvert** à Internet en **clé seule** (Ed25519), `PasswordAuthentication no`,
   `AllowUsers` nominatif, fail2ban, port inchangé. Le risque d'exposition persiste (R-HOST-05) et
   devient le choix par défaut si l'option 1 est refusée ; il doit alors être accepté par le CDO.

Dans les deux cas, aucune clé SSH ne figure dans le dépôt et la clé de chaque projet est distincte.

**Prérequis Tailscale (à la charge du CDO, hors dépôt et hors chat)** : compte/tailnet ; étiquettes ACL
`tag:stg-host` et `tag:ci-deploy` avec une règle n'ouvrant que `tag:ci-deploy` → `tag:stg-host:22` ;
clé d'authentification **à usage unique, expirante**, saisie directement sur l'hôte par le
CDO (jamais dans le chat, le dépôt ni les logs) ; secret OAuth du nœud éphémère CI enregistré
dans les secrets GitHub du dépôt concerné. Ordre sûr : joindre le tailnet **avant** de fermer le port
22 public, valider une 2e session par `tailscale0`, puis fermer 22 (pare-feu Hostinger et UFW).

### 4.2 Déploiement sans accès libre au socket Docker

L'appartenance au groupe `docker` équivaut à root. Retenu : clé SSH par projet avec
`command="sudo /usr/local/sbin/stg-deploy <projet>"`, `no-pty,no-port-forwarding`. Le wrapper
`stg-deploy` n'exécute que `docker compose -p <projet>-staging -f /srv/<projet>/compose.yml
up -d <services>` (et `pull`, `ps`, `logs`) sur ce projet, valide le fichier (pas de `privileged`,
pas de `ports:`, pas de `network_mode: host`, pas de montage hors `/srv/<projet>/`), et refuse tout
autre argument. Alternative à instruire en ADR : Docker rootless par projet (isolation plus forte,
routage par Traefik plus complexe).

### 4.3 Gabarit Compose « projet type »

```yaml
name: ${PROJET}-staging          # unique ; jamais changé après l'onboarding
services:
  front:
    image: ${FRONT_IMAGE_REF}    # digest exact, jamais latest
    networks: [internal, edge]
    deploy: { resources: { limits: { cpus: "0.50", memory: 256M } } }
    logging: { driver: json-file, options: { max-size: "10m", max-file: "3" } }
    security_opt: ["no-new-privileges:true"]
    read_only: true
    labels:
      - traefik.enable=true
      - traefik.docker.network=edge-${PROJET}
      - traefik.http.routers.${PROJET}.rule=Host(`${PROJET}.staging.${STAGING_DOMAIN}`)
      - traefik.http.routers.${PROJET}.entrypoints=websecure
      - traefik.http.routers.${PROJET}.tls.certresolver=le
      - traefik.http.routers.${PROJET}.middlewares=staging-auth@file,staging-headers@file
      - traefik.http.services.${PROJET}.loadbalancer.server.port=8080
  api:
    image: ${API_IMAGE_REF}
    networks: [internal]         # jamais edge, jamais de ports:
    env_file: [/srv/${PROJET}/env/.env]
    deploy: { resources: { limits: { cpus: "1.00", memory: 768M } } }
  db:
    image: postgres:16-alpine@sha256:<digest>
    networks: [internal]
    volumes: [db-data:/var/lib/postgresql/data]
    deploy: { resources: { limits: { cpus: "0.50", memory: 512M } } }
networks:
  internal: { internal: true }
  edge: { name: "edge-${PROJET}", external: true }
volumes:
  db-data: {}
```

Quotas disque : volumes sur partition dédiée avec quota (XFS `prjquota`) ou, à défaut, contrôle
d'usage par projet dans la supervision (seuil d'alerte 80 %). Choix à confirmer (D7).

## 5. Onboarding d'un projet et STG-ISOL-01 adapté

### 5.1 Procédure (par un administrateur, jamais par le pipeline du projet)

1. Ouvrir une demande tracée : projet, propriétaire, hôte demandé, ports internes, volume attendu.
2. Créer `stg-<projet>`, `/srv/<projet>/` (0700), la clé de déploiement dédiée et sa ligne
   `authorized_keys` forcée (§4.2).
3. Créer `edge-<projet>` ; ajouter ce réseau à Traefik (PR + `up -d traefik` ciblé) ;
   enregistrer le hôte DNS (TTL court) ; valider `staging-auth`.
4. Déployer par digest ; exécuter la checklist ci-dessous **avant et après** ; archiver les sorties.
5. Mettre à jour le registre des ressources partagées (§5.3) et `docs/staging-state.md`.

### 5.2 Checklist STG-ISOL-01 — extensions hôte mutualisé neuf

À ajouter à `docs/cgpa/checklists/stg-isol-01-checklist.md` (reprend les 6 sections existantes) :

- [ ] Inventaire avant/après : `docker ps -a --format` filtré par projet **et** liste des conteneurs
  tiers (identiques avant/après, `restart=0`), noms Compose, `docker network ls`, `docker volume ls`.
- [ ] Aucun conteneur d'un projet ne figure sur le réseau `edge-<autre>` ; seul le front du projet est
  attaché à `edge-<projet>`.
- [ ] `ss -tlnp` : seuls Traefik (80/443) et sshd écoutent sur l'extérieur ; aucun `ports:` projet.
- [ ] Clé de déploiement unique au projet ; utilisateur `stg-<projet>` hors groupe `docker`.
- [ ] `/srv/<projet>` en 0700, `.env` en 0600, aucun secret dans le dépôt ni dans les logs.
- [ ] Routage : hôte inconnu → 404 ; hôte du projet sans identifiants → 401 ; chemins d'exception
  documentés → 200 ; JWT Bearer non intercepté (non-régression écart 5).
- [ ] Limites CPU/mémoire et rotation de logs présentes sur chaque service.
- [ ] Preuve de restauration d'un `pg_dump` du projet (dernier trimestre).

Un contrôle applicable sans preuve est consigné `non exécuté`, jamais `non applicable`.

### 5.3 Registre des ressources partagées (à créer à l'approbation)

| Ressource | Propriétaire proposé | Conditions d'usage |
|---|---|---|
| VPS Hostinger Staging | CDO / DevSecOps Lead | Aucun projet ne publie de port hôte ; pas d'accès root projet |
| Traefik + socket-proxy | DevSecOps Lead | Modifié par PR + changement contrôlé uniquement |
| Compte ACME / `acme.json` | DevSecOps Lead | Sauvegardé, droits 600 |
| Zone DNS `staging.<domaine>` | CDO | TTL ≤ 300 s avant bascule |
| Pare-feu Hostinger | DevSecOps Lead | Toute règle datée et justifiée |
| Sauvegardes hors hôte | À désigner (D6) | Chiffrées, restauration éprouvée |

## 6. Flux inter-fournisseurs, migration et rollback

### 6.1 Conséquences « même région, pas même zone » (liste, sans modification)

- Plus de réseau privé commun : la règle « IP privée prioritaire » (`environment-promotion-model.md`,
  runbook §0.1) **ne s'applique pas** au nouvel hôte ; tout accès passe par IP publique.
- **Principe retenu : aucun flux Staging → Production.** L'hôte Staging ne reçoit aucune clé ni
  allow-list vers la Production ; sinon il faudrait ouvrir `loyertracker-prod-sg`.
- À mettre à jour, **seulement après accord CDO** : (a) pare-feu Hostinger : SSH 22 restreint à l'IP
  admin `52.29.80.119/32` (valeur du dépôt, à confirmer) et à l'EIP du serveur CI/dev, qui accédait
  jusqu'ici par IP privée ; (b) secrets et cibles de déploiement des workflows GitHub (cible
  `ai-test-server` → nouvel hôte) — l'inventaire exact des workflows de déploiement reste à établir
  (`ci.yml` ne mentionne que SonarQube `sonar.tshilo.dev`) ; (c) `docs/cgpa/environment-promotion-model.md`
  et le runbook ; (d) aucune modification de `loyertracker-prod-sg` ni de `innovtech-ai-lab-sg`.

### 6.2 Plan de migration depuis `ai-test-server` — jalon séparé (M0 à M6)

| Étape | Contenu | Condition de sortie |
|---|---|---|
| M0 Inventaire | Lister projets, volumes, secrets, hôtes NPM, certificats, Access List, crons de sauvegarde de `ai-test-server` (**lecture seule**, aucune commande Docker globale). Pour LoyerTracker : projet `loyertracker-staging`, volume PostgreSQL, `.env` (24 clés + `QUITTANCE_HMAC_SECRET`, variables Twilio/Resend), NPM Proxy Host #18 (blocs `/api/` et `/verify/`), Access List `staging`, monitoring. Autres projets (loyerpro, outils labo) : inventaire + propriétaires, **sans migration tant que non décidée**. | Inventaire signé |
| M1 Hôte prêt | Hôte durci, Traefik, `STG-ISOL-01` à vide PASS. | Preuves archivées |
| M2 Copie | Déployer LoyerTracker par digest sous un hôte provisoire ; `pg_dump -Fc` + globals depuis la source, restauration, comparaison (comptages, SHA-256) ; **secrets régénérés** (pas copiés) vu l'incident §0.2 ; canaux externes à `false`. | Flyway N/N, smoke 63/0 |
| M3 Preuves | `STG-ISOL-01` avant/après, auth par défaut fermée, `/api/` et `/verify/` conformes. | PASS |
| M4 Décision | Gate Staging instruit ; décision CDO distincte. | GO explicite |
| M5 Bascule | TTL DNS 300 s la veille ; bascule de l'enregistrement ; vérification ; `ai-test-server` **non arrêté, non modifié**. | Smoke 63/0 sur le nom final |
| M6 Retrait | Après période d'observation fixée par le CDO ; décommissionnement ou conservation = décision séparée. | Décision CDO |

### 6.3 Rollback

- Avant M5 : suppression des projets sur le nouvel hôte (ciblée par `-p <projet>-staging`), aucun impact
  sur `ai-test-server`.
- Après M5 : remettre l'enregistrement DNS sur `ai-test-server` (inchangé) ; reprise des données
  écrites depuis la bascule documentée au cas par cas (Staging : données de test).
- Par projet : redéploiement du digest précédent ; restauration du `pg_dump` ; flags remis à `false`.
- Hôte : restauration de la sauvegarde ou du snapshot Hostinger (délai observé : 1800 s sur le VPS A) ;
  procédure à éprouver une fois avant M4.
- Rappel : toute opération sur un volume ou un réseau reste ciblée par nom de projet ; `docker system
  prune`, `docker compose down` non ciblé et toute commande Docker globale sont interdits.

### 6.4 Régularisation du VPS A `srv2011505`

Proposition : le **geler** (aucun nouveau déploiement), consigner son existence dans le registre,
**faire tourner ses secrets**, remettre les canaux externes à `false`, corriger `KC_HOSTNAME`, puis le
décommissionner après M5 sur décision CDO. Il n'est pas supprimé ni modifié dans cette passe.

## 7. Risques, réserves, questions ouvertes

### 7.1 Risques

| ID | Risque | Gravité | Traitement proposé |
|---|---|---|---|
| R-HOST-01 | VPS A hors gouvernance, hébergeant LoyerTracker | Élevée | Régularisation §6.4 |
| R-HOST-02 | Secrets exposés en clair (API et session) : DB, Keycloak, HMAC, webhook Discord, SMTP, dashboard Traefik | Élevée | Rotation avant toute réutilisation ; décision du propriétaire |
| R-HOST-03 | Canaux externes actifs (email/WhatsApp, `DRY_RUN=false`) sur un hôte Staging ; **K8/ADR-18** | Élevée | Remettre à `false` ; GO explicite requis |
| R-HOST-04 | `KC_HOSTNAME` = domaine de la Production sur le VPS A | Élevée | Corriger ; ne jamais réutiliser le domaine Production |
| R-HOST-05 | SSH ouvert à `any` (VPS A) | Moyenne | Restriction IP (§4) |
| R-HOST-06 | `docker.sock` monté dans Traefik (VPS A) | Moyenne | `docker-socket-proxy` |
| R-HOST-07 | Mouvement latéral entre projets via un réseau partagé | Moyenne | `edge-<projet>` ; sinon acceptation CDO |
| R-HOST-08 | Un seul snapshot, écrasé par le suivant ; restauration non éprouvée | Moyenne | Sauvegardes `pg_dump` + test de restauration |
| R-HOST-09 | Prix et plans non vérifiables par l'API | Faible | Relevé hPanel avant achat |
| R-HOST-10 | VPS B (SonarQube, utilisé par la CI) : datacenter 15 inconnu, pare-feu non synchronisé, SSH ouvert à `any`. Y ajouter le Staging mêlerait outillage CI et Staging | Moyenne | Ne pas y héberger le Staging sans décision D2 bis ; vérifier l'emplacement ; synchroniser et restreindre son pare-feu |
| R-HOST-13 | ~~KVM 2 (8 Go) : capacité de 2 projets~~ **Levé le 2026-10-10** : KVM 4 retenu (D2 ter) | — | — |
| R-HOST-15 | `srv2050514` livré sans pare-feu Hostinger, sans sauvegarde ni snapshot ; SSH root par clé ouvert | Élevée | Créer et activer un pare-feu (22, 80, 443) ; activer la sauvegarde (hPanel) ; durcir ; Tailscale puis fermer le 22 |
| R-HOST-16 | Datacenter Düsseldorf ≠ Francfort (écart au prompt, accepté par le CDO) ; latence et résidence des données restent en Allemagne | Faible | Écart consigné (D2 ter) ; à rappeler dans l'ADR région |
| R-HOST-14 | Sans IP fixe, SSH restreint par IP impossible | Moyenne | Réseau privé Tailscale (§4.1b) ou acceptation CDO du SSH ouvert en clé seule |
| R-HOST-11 | Hôte unique = point de défaillance pour tous les Staging | Moyenne | Acceptable en Staging ; snapshot + reprise documentée |
| R-HOST-12 | Dérive entre le Compose du dépôt et l'hôte (déjà constatée sur `ai-test-server`) | Moyenne | Compose copié du dépôt par `stg-deploy`, contrôle de dérive à chaque déploiement |

Une réserve ne neutralise pas un bloqueur : R-HOST-02 à R-HOST-04 sont **bloquantes pour toute
promotion** vers le VPS A et restent ouvertes tant que leur preuve de traitement n'existe pas.

### 7.2 Décisions requises du CDO

| # | Question | Proposition |
|---|---|---|
| D1 | Statut du VPS A (geler/décommissionner, ou conserver) | §6.4 — **à confirmer** (réponse reçue « KVM 2 » ambiguë) |
| D2 | Taille de l'hôte | KVM 2 reçu, **remplacé par D2 ter : KVM 4** |
| D2 bis | Nouveau KVM 2 à acheter à Francfort, ou réutilisation de `srv2044374` (SonarQube) | Nouvel achat décidé ; réalisé en KVM 4 à Düsseldorf (D2 ter) |
| D2 ter | Conserver `srv2050514` (KVM 4, Düsseldorf, Ubuntu 26.04) | **Décidé : conservé** (2026-10-10) |
| D3 | Domaine Staging | **`*.staging.tshilo.dev` — décidé** ; zone chez Hostinger, HTTP-01 par hôte |
| D4 | Reverse proxy | Traefik (Q2) |
| D5 | Accès SSH sans IP fixe | **IP fixe indisponible ; Tailscale accepté** (§4.1b) |
| D6 | Cible des sauvegardes hors hôte | à désigner |
| D7 | Quotas disque par projet | XFS `prjquota` ou supervision seule |
| D8 | VPS B : usage et emplacement | à confirmer |
| D9 | Propriétaire de l'hôte et astreinte | à désigner |
| D10 | Calendrier de M0 à M6 et autres projets d'`ai-test-server` | jalon distinct (Q5) |

## 8. Gouvernance et prochaines étapes

### 8.0a Journal des actions exécutées (2026-10-10)

| Heure (UTC) | Action | Résultat |
|---|---|---|
| ~09:50 | Achat de `srv2050514` par le CDO dans hPanel (KVM 4, Düsseldorf, Ubuntu 26.04 LTS) | Écart à la décision, accepté (D2 ter) |
| 10:02 | `vps_firewall_create` `srv2050514-baseline` (id `375064`) + 3 règles TCP 22/80/443 `any` | Créées, avec « oui » explicite du CDO |
| 10:02 | `vps_firewall_activate` sur la VM `2050514` | `ct_firewall` = `success` ; `firewall_group_id` = 375064 |

| 10:09 | `vps_firewall_delete-rule` règle TCP 22 (id 1395269) du pare-feu 375064, puis `vps_firewall_sync-to-all-assigned-v-ms` | `ct_firewall` = `success`, `is_synced: true` ; restent 80 et 443. Demandé explicitement par le CDO ; **ordre du plan §4.1b (Tailscale testé avant fermeture) non vérifié par l'assistant**. Retour arrière : recréer TCP 22 `any` puis resynchroniser. |
| 10:12 | `vps_firewall_create-rule` TCP 22 `any` (id 1395290) puis synchronisation | `success` ; réouverture **temporaire** demandée par le CDO, Tailscale déclaré en place, pour tester SSH |
| 10:13 | `vps_firewall_delete-rule` règle 1395290 puis synchronisation | `ct_firewall` = `success`, `is_synced: true` ; restent 80 et 443. **Test SSH par Tailscale déclaré concluant par le CDO** : la réserve de l'entrée de 10:09 est levée sur déclaration du CDO (l'assistant n'a pas accès à l'hôte et n'a pas vérifié le test) |
| 10:2x–11:xx (correction) | **Erratum du 2026-10-10** : le journal Bitvise du CDO montre que le profil `HostingerStaging.tlp` visait `92.112.194.1` (`srv2044374`, SonarQube), pas `srv2050514` (`187.7.72.186`). Le « test SSH concluant » de 10:13 portait donc sur le SSH public de SonarQube : **R-HOST-14 n'est pas validé pour `srv2050514`**, dont le 22 est fermé depuis 10:13 UTC (tentative de 12:18 locale : délai dépassé, attendu). `edge.sh install` a été lancé sur `srv2044374` : Traefik n'a pas démarré (80 tenu par `sonarqube-caddy-1`), projet Compose `edge` et `/srv/edge` créés par erreur. **Relevé du CDO** : `harden-host.sh prepare` avait aussi tourné sur `srv2044374` (UFW actif 22/80/443, fail2ban `sshd.local`, `/etc/docker/daemon.json` écrasé sans sauvegarde) ; `ssh-lockdown` non lancé ; Docker non redémarré depuis 09:57 UTC (`LiveRestoreEnabled=false`, aucune `SecurityOpt` sur SonarQube) : le `daemon.json` n'est donc **pas appliqué** et l'état `unhealthy` de SonarQube ne lui est pas imputable (cause non établie ; l'analyse CI de 11:10 UTC a abouti). Garde-fous ajoutés (`8d07860`). | Projet `edge` retiré par le CDO (`docker compose -p edge … down` : 2 conteneurs, 2 réseaux ; `/srv/edge` supprimé). Reste : `daemon.json`, UFW, fail2ban, sysctl, sudoers, images Traefik/socket-proxy, à décider |
| 11:20 | `vps_firewall_create-rule` TCP 22 `any` (id 1395435) sur le pare-feu 375064 de `srv2050514`, puis synchronisation | Règle créée, `is_synced: true` ; action `ct_firewall` encore `started` à la dernière lecture. **Réouverture temporaire** demandée par le CDO pour exécuter `prepare` sur le bon hôte ; à retirer après validation de Tailscale **sur `srv2050514`** |
| 12:2x–13:xx (hôte, CDO) | `harden-host.sh prepare` sur `srv2050514` (Docker 29.9 via dépôt officiel `resolute`, UFW, fail2ban, utilisateur `deploy`) ; `ssh-lockdown` : `permitrootlogin no`, `allowusers deploy`, mais `passwordauthentication` restait à `yes` (les `50-cloud-init.conf`/`60-cloudimg-settings.conf` de Hostinger l'emportent sur `90-staging.conf` : OpenSSH retient la première valeur) ; corrigé par renommage en `00-staging.conf` (`c8ad3c4`) → `passwordauthentication no` constaté par `sshd -T` | Garde-fous et corrections de script poussés (`8d07860`, `8855fa7`, `c8ad3c4`) |
| ~13:0x–14:15 (CDO) | Tailscale installé sur `srv2050514` (`100.107.177.98`) et sur le poste du CDO (`100.126.201.58`) ; `tailscale ping` OK ; connexion Bitvise à `100.107.177.98:22` par clé, empreinte de clé d'hôte identique à celle de `187.7.72.186` | **R-HOST-14 levé pour `srv2050514`** (SSH par le tailnet validé) |
| 13:16 | `vps_firewall_delete-rule` TCP 22 (id 1395435) du pare-feu 375064, puis synchronisation | `ct_firewall` = `success` (13:16:56 → 13:17:03), `is_synced: true` ; restent 80 et 443. Demandé explicitement par le CDO. **R-HOST-15 : pare-feu et SSH durcis ; sauvegarde automatique toujours non activée (hPanel)** |
| heure non relevée (après 10:13) | `dns_records_update` zone `tshilo.dev`, `overwrite: false` : ajout de `*.staging` A `187.7.72.186` TTL 300 | Accepté ; liste relue : seul ajout, les autres enregistrements sont inchangés. Demandé explicitement par le CDO |

Aucune autre action n'a été exécutée. Sauvegarde automatique Hostinger : **non activée** (à faire dans hPanel).
`harden-host.sh` est **proposé, non exécuté**.

### 8.0 Étape initiale proposée : achat du nouvel hôte (réalisée par le CDO, voir 8.0a)

| Champ | Valeur |
|---|---|
| Opération | Achat d'un VPS Hostinger (`vps_virtual-machines_purchase`) |
| Plan / emplacement | KVM 2, datacenter `fra` (id 19, Francfort) |
| OS | Ubuntu 24.04 with Docker (template 1121) ; alternative LTS plus récente : 26.04 (Docker Manager indisponible sur cet OS) |
| Coût | **Non établi** : l'API n'expose pas le catalogue ; à relever en hPanel, période de facturation à choisir |
| Impact | Nouvel abonnement payant et renouvelable ; aucun effet sur `ai-test-server`, la Production AWS, le VPS A ni `srv2044374` |
| Limite technique | `purchase` exige un `item_id` de catalogue que l'API ne permet pas d'obtenir : **achat à faire par le CDO dans hPanel**, puis lecture seule de ma part |
| Après achat | Relever l'identifiant du VPS ; pare-feu Hostinger (22 provisoirement, 80, 443) ; sauvegarde automatique ; durcissement §4.1 ; Tailscale §4.1b ; Traefik ; `*.staging` en DNS |

- Contrôles applicables : STG-ISOL-01 (bloquant), CHECK-CICD-01, CHECK-REL-01, CHECK-OPS-01,
  CHECK-VAL-01. Aucun n'est encore exécuté : tous sont `non exécuté`.
- Livrables à produire **après** approbation : ADR (hébergeur, région, modèle d'isolation, option
  Docker rootless ou wrapper), mise à jour de `docs/staging-state.md` et `docs/project-state.md`,
  runbook d'onboarding, extension de la checklist STG-ISOL-01, registre des ressources partagées.
  Ils ne sont pas rédigés ici pour ne pas préjuger des décisions D1 à D10.
- Action autorisée à ce stade : **relecture et décision**. Toute action payante ou irréversible
  (achat, rebuild, suppression, DNS, ports, pare-feu) exige un « oui » explicite dans le chat,
  précédé de l'opération, des paramètres, du coût et de l'impact.
- Hors périmètre : `ai-test-server` et la Production AWS ne sont ni touchés ni lus au-delà du dépôt.
