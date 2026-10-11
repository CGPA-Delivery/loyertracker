#!/usr/bin/env bash
# PROPOSÉ — NON EXÉCUTÉ. Lot L3 : lance infra/smoke/smoke-stack.sh (celui du commit de release, extrait dans
# /srv/loyertracker/repo) contre le Staging Hostinger, SANS modifier ce script :
#   - le smoke vise l'URL publique (Traefik, certificat Let's Encrypt, CA système) ;
#   - la basic-auth `staging-auth` est fournie par un .curlrc éphémère en mémoire (/dev/shm, 0600), que curl
#     lit automatiquement. Un en-tête « Authorization: Bearer » explicite l'emporte sur ce Basic, donc les
#     appels d'API portent bien le JWT ; Traefik retire le Basic (removeHeader) avant Keycloak ;
#   - les appels « docker compose » du smoke ciblent le projet via COMPOSE_FILE / COMPOSE_PROJECT_NAME /
#     COMPOSE_ENV_FILES ; le dépôt extrait fournit .env (lien vers env/.env) et infra/release/.
# Le mot de passe est saisi non affiché, n'est jamais écrit sur disque et le .curlrc est détruit en sortie.
#
# Usage : sudo EXPECTED_HOSTNAME=srv2050514 ./run-smoke.sh
set -euo pipefail

ROOT="/srv/loyertracker"
die() { printf '[smoke] ERREUR: %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "à exécuter en root (sudo)"
[ -n "${EXPECTED_HOSTNAME:-}" ] && [ "$(hostname -s)" = "$EXPECTED_HOSTNAME" ] || die "hôte inattendu : abandon"
[ -f "$ROOT/repo/infra/smoke/smoke-stack.sh" ] && [ -f "$ROOT/env/.env" ] || die "dépôt extrait ou env/.env absent"
command -v jq >/dev/null 2>&1 && command -v curl >/dev/null 2>&1 || die "jq et curl requis"

HOST="$(grep -E '^APP_PUBLIC_HOST=' "$ROOT/env/.env" | cut -d= -f2-)"
[ -n "$HOST" ] || die "APP_PUBLIC_HOST absent de env/.env"
USER_AUTH="${STAGING_AUTH_USER:-staging}"

printf "[smoke] Mot de passe d'accès Staging pour « %s » (non affiché) : " "$USER_AUTH"
read -rs PASS; echo
[ -n "$PASS" ] || die "mot de passe vide"

TMP="$(mktemp -d /dev/shm/smoke.XXXXXX)"
cleanup() { rm -rf "$TMP"; unset PASS; }
trap cleanup EXIT
chmod 700 "$TMP"
# Échappement des « \ » et « " » pour la syntaxe entre guillemets de curl (sed : la substitution ${…//…} de
# Bash 5.2 traite elle-même les barres obliques inverses et ne les double pas).
ESC="$(printf '%s' "$PASS" | sed 's/[\\"]/\\&/g')"
( umask 077; printf 'user = "%s:%s"\n' "$USER_AUTH" "$ESC" >"$TMP/.curlrc" )

cd "$ROOT/repo"
env \
  CURL_HOME="$TMP" \
  COMPOSE_FILE="$ROOT/compose.yml" \
  COMPOSE_PROJECT_NAME="loyertracker-staging" \
  COMPOSE_ENV_FILES="$ROOT/env/.env" \
  DOCKER_CONFIG="$ROOT/.docker" \
  BASE="https://${HOST}" \
  CACERT="/etc/ssl/certs/ca-certificates.crt" \
  bash infra/smoke/smoke-stack.sh
