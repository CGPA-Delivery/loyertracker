#!/usr/bin/env bash
# PROPOSÉ — NON EXÉCUTÉ. Durcissement de l'hôte Staging mutualisé (srv2050514, Ubuntu 26.04 LTS).
# Référence : docs/cgpa/07-devsecops/plan-staging-partage-hostinger.md §4.1, §4.1b.
# À exécuter en root sur l'hôte, phase par phase, APRÈS relecture par le CDO. Chaque phase est
# idempotente. Aucun secret ni clé n'est écrit par ce script : la clé SSH autorisée est COPIÉE depuis
# /root/.ssh/authorized_keys (déjà enregistrée via hPanel) et Tailscale est rejoint à la main.
#
# Ordre imposé (voir plan §4.1b) :
#   1. prepare           paquets, Docker, utilisateur admin, UFW, fail2ban, répertoires — SSH inchangé
#   2. (vous)            ouvrir une 2e session SSH en tant que $STG_ADMIN_USER et vérifier sudo
#   3. ssh-lockdown      root et mots de passe désactivés (recharge sshd)
#   4. (vous)            joindre Tailscale à la main : sudo tailscale up --ssh=false --hostname=...
#   5. tailscale-check   vérifie le lien tailnet ; refuse si absent
#   6. close-public-ssh  ferme le 22 public dans UFW — PUIS retirer la règle 22 du pare-feu Hostinger
#
# Usage : EXPECTED_HOSTNAME=srv2050514 STG_ADMIN_USER=<login> ./harden-host.sh <phase>
# (EXPECTED_HOSTNAME est un garde-fou obligatoire : le script refuse de tourner sur un autre hôte.)
set -euo pipefail

STG_ADMIN_USER="${STG_ADMIN_USER:-}"
TS_IFACE="tailscale0"

log()  { printf '[harden] %s\n' "$*"; }
die()  { printf '[harden] ERREUR: %s\n' "$*" >&2; exit 1; }
need_root() { [ "$(id -u)" -eq 0 ] || die "à exécuter en root"; }
need_admin() {
  [ -n "$STG_ADMIN_USER" ] || die "STG_ADMIN_USER requis (login nominatif, pas root)"
  # root refusé : 'ssh-lockdown' écrirait PermitRootLogin no + AllowUsers root = verrouillage total.
  [ "$STG_ADMIN_USER" != "root" ] || die "STG_ADMIN_USER ne peut pas être root : choisir un login nominatif (ex. deploy)"
  [[ "$STG_ADMIN_USER" =~ ^[a-z][a-z0-9_-]{1,30}$ ]] || die "STG_ADMIN_USER invalide"
}
# Garde-fou : refuse de tourner sur un autre serveur que celui visé (ex. SonarQube srv2044374).
# Usage : EXPECTED_HOSTNAME=srv2050514 (valeur à saisir consciemment, sans défaut).
guard_host() {
  [ -n "${EXPECTED_HOSTNAME:-}" ] || die "EXPECTED_HOSTNAME requis (ex. srv2050514)"
  [ "$(hostname -s)" = "$EXPECTED_HOSTNAME" ] || die "hôte courant « $(hostname -s) » ≠ « ${EXPECTED_HOSTNAME} » : abandon, aucune modification"
}

phase_prepare() {
  need_root; need_admin; guard_host
  [ -z "$(docker ps -q 2>/dev/null || true)" ] || die "des conteneurs tournent déjà sur cet hôte : 'prepare' est réservé à un hôte neuf et vide"
  . /etc/os-release
  log "OS détecté : ${PRETTY_NAME} (${VERSION_CODENAME:-?})"
  [ "${ID}" = "ubuntu" ] || die "Ubuntu attendu"

  log "Mises à jour et paquets de base"
  export DEBIAN_FRONTEND=noninteractive
  apt-get update
  apt-get -y upgrade
  apt-get -y install unattended-upgrades fail2ban ufw curl ca-certificates gnupg jq
  printf 'APT::Periodic::Update-Package-Lists "1";\nAPT::Periodic::Unattended-Upgrade "1";\n' \
    >/etc/apt/apt.conf.d/20auto-upgrades
  # Pas de redémarrage automatique : un reboot non planifié coupe tous les projets hébergés.
  printf 'Unattended-Upgrade::Automatic-Reboot "false";\n' >/etc/apt/apt.conf.d/52staging-no-reboot

  install_docker

  log "Utilisateur administrateur nominatif : ${STG_ADMIN_USER}"
  id "$STG_ADMIN_USER" >/dev/null 2>&1 || adduser --disabled-password --gecos "" "$STG_ADMIN_USER"
  usermod -aG sudo "$STG_ADMIN_USER"
  # PAS d'appartenance au groupe docker (équivalent root) : l'administrateur passe par sudo.
  install -d -m 700 -o "$STG_ADMIN_USER" -g "$STG_ADMIN_USER" "/home/${STG_ADMIN_USER}/.ssh"
  [ -s /root/.ssh/authorized_keys ] || die "/root/.ssh/authorized_keys vide : aucune clé à copier"
  install -m 600 -o "$STG_ADMIN_USER" -g "$STG_ADMIN_USER" /root/.ssh/authorized_keys \
    "/home/${STG_ADMIN_USER}/.ssh/authorized_keys"
  # sudo sans mot de passe est nécessaire (compte sans mot de passe) : limité à ce compte nominatif.
  printf '%s ALL=(ALL) NOPASSWD:ALL\n' "$STG_ADMIN_USER" >"/etc/sudoers.d/90-${STG_ADMIN_USER}"
  chmod 440 "/etc/sudoers.d/90-${STG_ADMIN_USER}"
  visudo -cf "/etc/sudoers.d/90-${STG_ADMIN_USER}" >/dev/null

  log "UFW : 22 provisoirement ouvert (pas d'IP fixe), 80/443 publics"
  ufw default deny incoming
  ufw default allow outgoing
  ufw allow 22/tcp comment 'SSH provisoire - a fermer apres Tailscale'
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw --force enable
  # Les ports publiés par Docker contournent UFW : seul Traefik publiera 80/443 (contrôle STG-ISOL-01).

  log "fail2ban (sshd, journald)"
  cat >/etc/fail2ban/jail.d/sshd.local <<'EOF'
[sshd]
enabled  = true
backend  = systemd
maxretry = 3
findtime = 10m
bantime  = 1h
EOF
  systemctl enable --now fail2ban
  systemctl restart fail2ban

  log "Noyau : durcissements réseau minimaux"
  cat >/etc/sysctl.d/90-staging.conf <<'EOF'
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.tcp_syncookies = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
kernel.dmesg_restrict = 1
EOF
  sysctl --system >/dev/null

  log "Arborescence /srv"
  install -d -m 755 /srv
  install -d -m 750 /srv/edge

  log "Phase 'prepare' terminée. NE PAS fermer cette session."
  log "Étape suivante : ouvrir une 2e session « ssh ${STG_ADMIN_USER}@<hôte> », vérifier « sudo -n true »,"
  log "puis lancer la phase 'ssh-lockdown'."
}

install_docker() {
  . /etc/os-release
  if command -v docker >/dev/null 2>&1; then
    log "Docker déjà présent : $(docker --version)"
  else
    # Dépôt officiel Docker si la version d'Ubuntu y est publiée ; sinon paquets Ubuntu.
    codename="${VERSION_CODENAME}"
    if curl -fsI "https://download.docker.com/linux/ubuntu/dists/${codename}/Release" >/dev/null 2>&1; then
      log "Dépôt officiel Docker disponible pour ${codename}"
      install -m 0755 -d /etc/apt/keyrings
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
      chmod a+r /etc/apt/keyrings/docker.asc
      printf 'deb [arch=%s signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu %s stable\n' \
        "$(dpkg --print-architecture)" "$codename" >/etc/apt/sources.list.d/docker.list
      apt-get update
      apt-get -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    else
      log "Dépôt Docker indisponible pour ${codename} : repli sur les paquets Ubuntu (docker.io)"
      apt-get -y install docker.io docker-compose-v2
    fi
  fi

  log "Docker : rotation des logs, no-new-privileges, live-restore"
  install -d -m 755 /etc/docker
  if [ -s /etc/docker/daemon.json ]; then
    cp -a /etc/docker/daemon.json "/etc/docker/daemon.json.bak-$(date -u +%Y%m%dT%H%M%SZ)"
    log "daemon.json existant sauvegardé avant remplacement"
  fi
  cat >/etc/docker/daemon.json <<'EOF'
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" },
  "no-new-privileges": true,
  "live-restore": true
}
EOF
  systemctl enable docker
  # Hôte neuf et vide : le redémarrage est sans impact. NE JAMAIS rejouer cette phase sur un hôte
  # qui héberge déjà des projets sans fenêtre de maintenance (live-restore limite mais n'élimine pas le risque).
  if [ -z "$(docker ps -q 2>/dev/null || true)" ]; then
    systemctl restart docker
  else
    log "Des conteneurs tournent : redémarrage de Docker NON effectué ; appliquer daemon.json en fenêtre dédiée"
  fi
  docker --version
  docker compose version
}

phase_ssh_lockdown() {
  need_root; need_admin; guard_host
  id "$STG_ADMIN_USER" >/dev/null 2>&1 || die "utilisateur ${STG_ADMIN_USER} absent : lancer 'prepare' d'abord"
  [ -s "/home/${STG_ADMIN_USER}/.ssh/authorized_keys" ] || die "aucune clé pour ${STG_ADMIN_USER}"
  # Sans sudo fonctionnel pour l'administrateur, fermer root verrouille toute administration.
  runuser -u "$STG_ADMIN_USER" -- sudo -n true 2>/dev/null \
    || die "${STG_ADMIN_USER} n'a pas de sudo sans mot de passe : abandon, aucune modification (voir /etc/sudoers.d)"
  printf '\n[harden] Avez-vous ouvert une 2e session SSH en tant que %s et vérifié « sudo -n true » ? [oui/NON] ' "$STG_ADMIN_USER"
  read -r reponse
  [ "$reponse" = "oui" ] || die "abandon : validez d'abord l'accès de ${STG_ADMIN_USER}"

  # Nom en « 00- » : OpenSSH retient la PREMIÈRE valeur lue ; les 50-cloud-init.conf / 60-cloudimg-settings.conf
  # de Hostinger activent PasswordAuthentication et l'emporteraient sur un nom en « 90- ».
  rm -f /etc/ssh/sshd_config.d/90-staging.conf
  cat >/etc/ssh/sshd_config.d/00-staging.conf <<EOF
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
LoginGraceTime 30
X11Forwarding no
AllowUsers ${STG_ADMIN_USER}
EOF
  # Ubuntu récent : sshd démarre par socket activation, /run/sshd peut manquer et fait échouer « sshd -t ».
  install -d -m 0755 /run/sshd
  if ! sshd -t; then
    rm -f /etc/ssh/sshd_config.d/00-staging.conf   # ne pas laisser une configuration non validée
    die "configuration sshd invalide : fichier retiré, rien rechargé"
  fi
  systemctl reload ssh || systemctl reload sshd \
    || die "rechargement impossible : configuration écrite mais NON appliquée (retirer 00-staging.conf si nécessaire)"
  log "sshd rechargé. GARDEZ l'ancienne session ouverte et testez une NOUVELLE connexion avant de la fermer."
  log "Désactiver aussi la connexion root par clé n'est effectif qu'avec cette configuration."
}

phase_tailscale_check() {
  command -v tailscale >/dev/null 2>&1 || die "tailscale absent : l'installer (https://tailscale.com/download/linux) puis lancer « sudo tailscale up »"
  ip link show "$TS_IFACE" >/dev/null 2>&1 || die "interface ${TS_IFACE} absente : « tailscale up » non effectué"
  tailscale status >/dev/null 2>&1 || die "tailscale non connecté"
  ts_ip="$(tailscale ip -4 | head -n1)"
  [ -n "$ts_ip" ] || die "aucune adresse tailnet"
  log "Tailscale OK : ${ts_ip}. Testez « ssh ${STG_ADMIN_USER:-<admin>}@${ts_ip} » depuis un poste du tailnet AVANT 'close-public-ssh'."
}

phase_close_public_ssh() {
  need_root; guard_host
  phase_tailscale_check
  printf '\n[harden] SSH via le tailnet testé avec succès depuis un poste distinct ? [oui/NON] '
  read -r reponse
  [ "$reponse" = "oui" ] || die "abandon : testez d'abord SSH par ${TS_IFACE}"
  ufw allow in on "$TS_IFACE" to any port 22 proto tcp comment 'SSH via tailnet'
  ufw delete allow 22/tcp || true
  ufw status numbered
  log "22 public fermé dans UFW."
  log "RESTE À FAIRE (hors hôte, avec accord CDO) : retirer la règle TCP 22 du pare-feu Hostinger 375064."
  log "Secours si le tunnel tombe : console navigateur Hostinger (hPanel)."
}

case "${1:-}" in
  prepare)          phase_prepare ;;
  ssh-lockdown)     phase_ssh_lockdown ;;
  tailscale-check)  phase_tailscale_check ;;
  close-public-ssh) phase_close_public_ssh ;;
  *) die "usage : STG_ADMIN_USER=<login> $0 {prepare|ssh-lockdown|tailscale-check|close-public-ssh}" ;;
esac
