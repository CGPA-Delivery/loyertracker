#!/usr/bin/env bash
# PROPOSÉ — NON EXÉCUTÉ. Lot L1 : prépare l'hôte pour LoyerTracker (utilisateur, arborescence, archive du
# commit de release vérifiée, certificat interne, wrapper de déploiement). Ne démarre AUCUN conteneur,
# ne touche ni au réseau Docker ni à l'edge, ne crée aucun secret (voir gen-env.sh).
#
# Usage (root, depuis le dossier loyertracker/ copié sur l'hôte) :
#   sudo EXPECTED_HOSTNAME=srv2050514 APP_PUBLIC_HOST=loyertracker.staging.tshilo.dev \
#        ARCHIVE=/home/deploy/loyertracker-d19c4fea-infra.tar.gz ARCHIVE_SHA256=<empreinte> \
#        COMMIT=d19c4fea850263c5bfbb92fcb288dd7bd2e56e2a ./project-prep.sh
set -euo pipefail

PROJET="loyertracker"
ROOT="/srv/${PROJET}"
OWNER="stg-${PROJET}"
SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log() { printf '[prep] %s\n' "$*"; }
die() { printf '[prep] ERREUR: %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "à exécuter en root (sudo)"
[ -n "${EXPECTED_HOSTNAME:-}" ] && [ "$(hostname -s)" = "$EXPECTED_HOSTNAME" ] || die "hôte inattendu : abandon, aucune modification"
HOST="${APP_PUBLIC_HOST:?APP_PUBLIC_HOST requis}"
ARCHIVE="${ARCHIVE:?ARCHIVE requis (tar.gz du commit de release)}"
ARCHIVE_SHA256="${ARCHIVE_SHA256:?ARCHIVE_SHA256 requis}"
COMMIT="${COMMIT:?COMMIT requis (identifiant complet du commit de release)}"
[[ "$HOST" =~ ^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$ ]] || die "APP_PUBLIC_HOST invalide"
[[ "$COMMIT" =~ ^[0-9a-f]{40}$ ]] || die "COMMIT : 40 caractères hexadécimaux exigés"
command -v docker >/dev/null 2>&1 && command -v jq >/dev/null 2>&1 && command -v openssl >/dev/null 2>&1 || die "docker, jq et openssl requis (harden-host.sh prepare)"
[ -f /srv/edge/compose.yml ] || die "edge non installé (/srv/edge/compose.yml absent)"
docker network inspect "edge-${PROJET}" >/dev/null 2>&1 || die "réseau edge-${PROJET} absent : lancer « edge.sh add-project ${PROJET} » d'abord"
for f in compose.yml keycloak-public-host-init.sh stg-deploy.sh; do [ -f "$SRC_DIR/$f" ] || die "$f introuvable à côté du script"; done
[ -f "$ARCHIVE" ] || die "archive introuvable : $ARCHIVE"

log "Vérification de l'empreinte de l'archive"
got="$(sha256sum "$ARCHIVE" | awk '{print $1}')"
[ "$got" = "$ARCHIVE_SHA256" ] || die "empreinte différente (attendue ${ARCHIVE_SHA256}, obtenue ${got}) : abandon"
# Liste capturée d'abord : sous pipefail, « tar | grep -q » échouerait à tort (SIGPIPE quand grep ferme le tube).
LIST="$(tar -tzf "$ARCHIVE")" || die "archive illisible"
if grep -Eq '^/|(^|/)\.\.(/|$)' <<<"$LIST"; then die "archive refusée : chemin absolu ou « .. »"; fi
grep -q '^repo/infra/keycloak/realm-loyertracker.json$' <<<"$LIST" || die "archive inattendue : realm absent"

log "Utilisateur ${OWNER} (système, sans connexion, hors groupe docker)"
id "$OWNER" >/dev/null 2>&1 || useradd --system --home-dir "$ROOT" --no-create-home --shell /usr/sbin/nologin "$OWNER"
install -d -m 700 -o "$OWNER" -g "$OWNER" "$ROOT"
install -d -m 700 -o "$OWNER" -g "$OWNER" "$ROOT/backups"
install -d -m 700 -o root -g root "$ROOT/.docker"           # registre : lisible par root seul (stg-deploy)

if [ -e "$ROOT/repo" ]; then
  [ "${FORCE_REPO:-0}" = "1" ] || die "$ROOT/repo existe déjà : refus d'écraser (FORCE_REPO=1 pour remplacer)"
  rm -rf "$ROOT/repo"
fi
log "Extraction de l'archive (commit ${COMMIT:0:8})"
tar -xzf "$ARCHIVE" --no-same-owner --no-same-permissions -C "$ROOT"
chown -R "$OWNER:$OWNER" "$ROOT/repo"
# Les conteneurs (keycloak uid 1000, nginx uid 101…) lisent ces fichiers via des montages : lecture pour tous.
chmod -R u+rwX,go+rX,go-w "$ROOT/repo"
printf 'commit=%s\narchive_sha256=%s\nextrait=%s\n' "$COMMIT" "$ARCHIVE_SHA256" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" >"$ROOT/repo/.PROVENANCE"
# Le smoke fait « source .env » depuis la racine du dépôt : lien vers l'env-file du projet (créé par gen-env.sh).
ln -sfn ../env/.env "$ROOT/repo/.env"

atomic() { local src="$1" dst="$2" mode="$3" tmp; tmp="${dst}.new.$$"; install -m "$mode" "$src" "$tmp"; mv -f "$tmp" "$dst"; }
log "Gabarit Compose et script keycloak-public-host-init"
atomic "$SRC_DIR/compose.yml" "$ROOT/compose.yml" 644
atomic "$SRC_DIR/keycloak-public-host-init.sh" "$ROOT/keycloak-public-host-init.sh" 755

if [ ! -f "$ROOT/certs/localhost.pem" ]; then
  log "Certificat TLS interne auto-signé (saut Traefik → nginx uniquement)"
  install -d -m 700 -o 101 -g 101 "$ROOT/certs"
  openssl req -x509 -newkey rsa:3072 -nodes -days 825 -subj "/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,DNS:${HOST}" \
    -keyout "$ROOT/certs/localhost-key.pem" -out "$ROOT/certs/localhost.pem" 2>/dev/null
  chown 101:101 "$ROOT/certs/localhost-key.pem" "$ROOT/certs/localhost.pem"
  chmod 600 "$ROOT/certs/localhost-key.pem"; chmod 644 "$ROOT/certs/localhost.pem"
else
  log "Certificat interne déjà présent : conservé"
fi

log "Wrapper /usr/local/sbin/stg-deploy"
atomic "$SRC_DIR/stg-deploy.sh" /usr/local/sbin/stg-deploy 750
chown root:root /usr/local/sbin/stg-deploy

log "Préparation terminée. Aucun conteneur démarré."
log "Suite : gen-env.sh (secrets neufs), puis « docker login ghcr.io » avec DOCKER_CONFIG=${ROOT}/.docker, puis stg-deploy."
