#!/usr/bin/env bash
# PROPOSÉ — NON EXÉCUTÉ. Installation et exploitation de l'edge mutualisé (Traefik + socket-proxy).
# Référence : docs/cgpa/07-devsecops/plan-staging-partage-hostinger.md §2, §5.
# À exécuter en root sur l'hôte (sudo), APRÈS `harden-host.sh prepare`, depuis une copie du dossier edge/.
#
#   Toutes les commandes exigent EXPECTED_HOSTNAME=<hôte visé> (garde-fou), ex. srv2050514.
#   ACME_EMAIL=<contact LE> ./edge.sh install      installe /srv/edge et démarre Traefik
#   ./edge.sh add-project <projet>                 crée le réseau edge-<projet> et l'attache à Traefik
#   ./edge.sh verify                               contrôles STG-ISOL-01 de l'edge (lecture seule)
#
# Aucune commande Docker globale : tout est ciblé sur le projet Compose `edge` ou sur un réseau nommé.
# Aucun secret dans le dépôt : le mot de passe d'accès Staging est saisi sur l'hôte (non affiché) et
# n'est stocké que sous forme de hachage dans /srv/edge/secrets/staging.htpasswd.
set -euo pipefail

EDGE_DIR="/srv/edge"
SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TRAEFIK_TAG="${TRAEFIK_TAG:-traefik:v3.7}"
SOCKET_PROXY_TAG="${SOCKET_PROXY_TAG:-tecnativa/docker-socket-proxy:0.3.0}"
TRAEFIK_UID=65532
PROJECT_RE='^[a-z][a-z0-9-]{1,20}$'

log() { printf '[edge] %s\n' "$*"; }
die() { printf '[edge] ERREUR: %s\n' "$*" >&2; exit 1; }
need_root() { [ "$(id -u)" -eq 0 ] || die "à exécuter en root (sudo)"; }

compose() {
  docker compose -p edge --project-directory "$EDGE_DIR" \
    -f "$EDGE_DIR/compose.yml" -f "$EDGE_DIR/networks.yml" "$@"
}

# Instantané des conteneurs HORS projet edge (preuve avant/après STG-ISOL-01).
snapshot() {
  local label="$1" out
  install -d -m 750 "$EDGE_DIR/snapshots"
  out="$EDGE_DIR/snapshots/${label}-$(date -u +%Y%m%dT%H%M%SZ).txt"
  {
    echo "# conteneurs (nom image statut)"
    docker ps -a --format '{{.Names}} {{.Image}} {{.Status}}' | sort
    echo "# réseaux"
    docker network ls --format '{{.Name}}' | sort
    echo "# volumes"
    docker volume ls --format '{{.Name}}' | sort
  } >"$out"
  log "instantané : $out"
}

# Résout la référence par digest d'une image (artefact exact, jamais un tag mouvant).
resolve_digest() {
  local tag="$1" ref
  docker pull -q "$tag" >/dev/null || die "pull impossible : $tag"
  ref="$(docker inspect --format '{{index .RepoDigests 0}}' "$tag")"
  [ -n "$ref" ] || die "aucun digest pour $tag"
  printf '%s' "$ref"
}

# Garde-fou : refuse de tourner sur un autre serveur que celui visé (ex. SonarQube srv2044374).
guard_host() {
  [ -n "${EXPECTED_HOSTNAME:-}" ] || die "EXPECTED_HOSTNAME requis (ex. srv2050514)"
  [ "$(hostname -s)" = "$EXPECTED_HOSTNAME" ] || die "hôte courant « $(hostname -s) » ≠ « ${EXPECTED_HOSTNAME} » : abandon, aucune modification"
}

cmd_install() {
  need_root; guard_host
  command -v docker >/dev/null 2>&1 || die "Docker absent : lancer harden-host.sh prepare"
  # Les ports 80/443 doivent être libres : sinon un autre service les utilise (jamais le déloger).
  # Exception : ré-exécution sur un edge déjà installé (Traefik de ce projet tient lui-même 80/443).
  if ! docker ps --format '{{.Names}}' | grep -qx 'edge-traefik-1'; then
    if ss -H -tln | awk '{print $4}' | grep -Eq '(:|\])(80|443)$'; then
      die "80 ou 443 déjà utilisé sur cet hôte : abandon, aucune modification"
    fi
  fi
  : "${ACME_EMAIL:?ACME_EMAIL requis (adresse de contact pour Let s Encrypt)}"
  [ -f "$SRC_DIR/compose.yml" ] && [ -f "$SRC_DIR/dynamic/middlewares.yml" ] || die "compose.yml ou dynamic/ introuvable à côté du script"

  install -d -m 750 "$EDGE_DIR"
  snapshot avant-installation

  log "Arborescence et droits"
  install -d -m 755 "$EDGE_DIR/dynamic"
  install -d -m 700 -o "$TRAEFIK_UID" -g "$TRAEFIK_UID" "$EDGE_DIR/letsencrypt"
  install -d -m 750 -o root -g "$TRAEFIK_UID" "$EDGE_DIR/secrets"
  # Écriture atomique : « install » crée la destination avec des droits restrictifs avant le chmod ; Traefik
  # surveille /dynamic et relisait le fichier à ce moment-là (permission denied constaté le 2026-10-10).
  install_atomic() {
    local src="$1" dst="$2" tmp
    tmp="${dst}.new.$$"
    install -m 644 "$src" "$tmp"
    mv -f "$tmp" "$dst"
  }
  install_atomic "$SRC_DIR/compose.yml" "$EDGE_DIR/compose.yml"
  install_atomic "$SRC_DIR/dynamic/middlewares.yml" "$EDGE_DIR/dynamic/middlewares.yml"
  [ -f "$EDGE_DIR/networks.yml" ] || printf 'services:\n  traefik: {}\n' >"$EDGE_DIR/networks.yml"
  [ -f "$EDGE_DIR/projects.list" ] || : >"$EDGE_DIR/projects.list"
  if [ ! -f "$EDGE_DIR/letsencrypt/acme.json" ]; then
    install -m 600 -o "$TRAEFIK_UID" -g "$TRAEFIK_UID" /dev/null "$EDGE_DIR/letsencrypt/acme.json"
  fi

  if [ ! -s "$EDGE_DIR/secrets/staging.htpasswd" ]; then
    local user pass pass2
    user="${STAGING_AUTH_USER:-staging}"
    printf "[edge] Mot de passe d'accès Staging pour « %s » (non affiché) : " "$user"; read -rs pass; echo
    printf '[edge] Confirmation : '; read -rs pass2; echo
    [ -n "$pass" ] && [ "$pass" = "$pass2" ] || die "mots de passe vides ou différents"
    [ "${#pass}" -ge 16 ] || die "mot de passe trop court (16 caractères minimum)"
    printf '%s:%s\n' "$user" "$(printf '%s' "$pass" | openssl passwd -apr1 -stdin)" \
      >"$EDGE_DIR/secrets/staging.htpasswd"
    chown "root:$TRAEFIK_UID" "$EDGE_DIR/secrets/staging.htpasswd"
    chmod 640 "$EDGE_DIR/secrets/staging.htpasswd"
    unset pass pass2
    log "hachage écrit dans secrets/staging.htpasswd"
  else
    log "secrets/staging.htpasswd existe déjà : conservé"
  fi

  if [ ! -f "$EDGE_DIR/.env" ]; then
    log "Résolution des digests d'images"
    {
      printf 'ACME_EMAIL=%s\n' "$ACME_EMAIL"
      printf 'TRAEFIK_IMAGE=%s\n' "$(resolve_digest "$TRAEFIK_TAG")"
      printf 'SOCKET_PROXY_IMAGE=%s\n' "$(resolve_digest "$SOCKET_PROXY_TAG")"
    } >"$EDGE_DIR/.env"
    chmod 600 "$EDGE_DIR/.env"
  else
    log ".env existe déjà : conservé (digests inchangés)"
  fi

  log "Validation de la configuration Compose"
  compose config -q || die "configuration Compose invalide"
  log "Démarrage du projet Compose « edge » uniquement"
  compose up -d
  compose ps
  snapshot apres-installation
  log "Terminé. Lancer « ./edge.sh verify » puis conserver les instantanés comme preuve STG-ISOL-01."
}

cmd_add_project() {
  need_root; guard_host
  local projet="${1:-}"
  [[ "$projet" =~ $PROJECT_RE ]] || die "nom de projet invalide (minuscules, chiffres, tirets ; 2 à 21 caractères)"
  [ -f "$EDGE_DIR/compose.yml" ] || die "edge non installé : lancer « install »"
  snapshot "avant-ajout-${projet}"

  if docker network inspect "edge-${projet}" >/dev/null 2>&1; then
    log "réseau edge-${projet} déjà présent"
  else
    docker network create --driver bridge --label "staging.projet=${projet}" "edge-${projet}" >/dev/null
    log "réseau edge-${projet} créé"
  fi
  grep -qx "$projet" "$EDGE_DIR/projects.list" || printf '%s\n' "$projet" >>"$EDGE_DIR/projects.list"

  # Regénère networks.yml depuis projects.list (source de vérité), puis valide avant d'appliquer.
  local tmp
  tmp="$(mktemp)"
  {
    echo "services:"
    echo "  traefik:"
    echo "    networks:"
    while read -r p; do [ -n "$p" ] && echo "      - edge-$p"; done <"$EDGE_DIR/projects.list"
    echo "networks:"
    while read -r p; do
      [ -n "$p" ] && printf '  edge-%s:\n    name: edge-%s\n    external: true\n' "$p" "$p"
    done <"$EDGE_DIR/projects.list"
  } >"$tmp"
  cp "$EDGE_DIR/networks.yml" "$EDGE_DIR/networks.yml.bak"
  install -m 644 "$tmp" "$EDGE_DIR/networks.yml"
  rm -f "$tmp"
  if ! compose config -q; then
    cp "$EDGE_DIR/networks.yml.bak" "$EDGE_DIR/networks.yml"
    die "networks.yml invalide : ancien fichier restauré, rien d'appliqué"
  fi

  log "Recréation ciblée de Traefik (micro-coupure de l'edge, aucun autre service concerné)"
  compose up -d traefik
  snapshot "apres-ajout-${projet}"
  log "Projet « ${projet} » rattaché. Son front doit rejoindre edge-${projet} et porter traefik.docker.network=edge-${projet}."
}

cmd_verify() {
  local ok=0 ko=0
  pass() { printf '[edge] PASS  %s\n' "$*"; ok=$((ok + 1)); }
  fail() { printf '[edge] FAIL  %s\n' "$*"; ko=$((ko + 1)); }

  # 1. Ports en écoute hors boucle locale : 22 (pare-feu), 80, 443 attendus ; tout autre = écart.
  local ports unexpected
  # Adresses exclues : boucle locale et tailnet Tailscale (IPv4 100.x, IPv6 fd7a:115c:a1e0::/48).
  ports="$(ss -H -tln | awk '{print $4}' | grep -Ev '^(127\.|\[::1\]|100\.|\[fd7a:)' | sed 's/.*://' | sort -un | tr '\n' ' ')"
  unexpected="$(printf '%s' "$ports" | tr ' ' '\n' | grep -Ev '^(22|80|443|)$' || true)"
  if [ -z "$unexpected" ]; then pass "ports en écoute : ${ports}"; else fail "ports inattendus : ${unexpected}"; fi

  # 2. Seul Traefik publie des ports sur toutes les interfaces.
  local publishers
  publishers="$(docker ps --format '{{.Names}} {{.Ports}}' | grep -E '(0\.0\.0\.0|\[::\]):' | awk '{print $1}' | sort -u | tr '\n' ' ')"
  if [ "$(printf '%s' "$publishers" | tr -d ' ')" = "edge-traefik-1" ]; then pass "seul edge-traefik-1 publie des ports"; else fail "conteneurs publiant des ports : ${publishers}"; fi

  # 3. Santé des deux services.
  local st
  for svc in traefik socket-proxy; do
    st="$(compose ps --format '{{.Service}} {{.State}} {{.Health}}' | awk -v s="$svc" '$1==s {print $2" "$3}')"
    case "$st" in "running healthy"|"running ") pass "$svc : $st" ;; *) fail "$svc : ${st:-absent}" ;; esac
  done

  # 4. Hôte inconnu : 404 en HTTPS ; HTTP redirigé vers HTTPS.
  local code
  # tls.options.default.sniStrict=true : un nom inconnu est refusé dès la poignée de main TLS (code 000),
  # ce qui est au moins aussi strict qu'un 404. Tout autre code (200, 401, 5xx…) est un écart.
  code="$(curl -ks -o /dev/null -w '%{http_code}' --resolve inconnu.invalid:443:127.0.0.1 https://inconnu.invalid/ || true)"
  case "$code" in
    404) pass "hôte inconnu en HTTPS → 404" ;;
    000) pass "hôte inconnu en HTTPS → refusé par TLS (sniStrict)" ;;
    *)   fail "hôte inconnu en HTTPS → ${code}" ;;
  esac
  code="$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: inconnu.invalid' http://127.0.0.1/ || true)"
  case "$code" in 301|308) pass "HTTP → redirection (${code})" ;; *) fail "HTTP → ${code}" ;; esac

  # 5. Droits des fichiers sensibles.
  [ "$(stat -c %a "$EDGE_DIR/.env")" = "600" ] && pass ".env en 0600" || fail ".env : droits inattendus"
  [ "$(stat -c %a "$EDGE_DIR/letsencrypt/acme.json")" = "600" ] && pass "acme.json en 0600" || fail "acme.json : droits inattendus"

  printf '[edge] Bilan : %s PASS, %s FAIL\n' "$ok" "$ko"
  [ "$ko" -eq 0 ]
}

case "${1:-}" in
  install)     cmd_install ;;
  add-project) shift; cmd_add_project "${1:-}" ;;
  verify)      cmd_verify ;;
  *) die "usage : ACME_EMAIL=<email> $0 install | $0 add-project <projet> | $0 verify" ;;
esac
