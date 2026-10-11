#!/usr/bin/env bash
# PROPOSÉ — NON EXÉCUTÉ. Wrapper de déploiement d'UN projet sur le Staging mutualisé (srv2050514).
# Installé par project-prep.sh dans /usr/local/sbin/stg-deploy (root:root, 0750).
#
# Il remplace l'accès libre au socket Docker : il ne lance que « docker compose » sur LE projet
# nommé, avec son fichier, son env-file et sa configuration de registre, après avoir refusé tout
# fichier Compose qui sortirait du cadre (ports publiés, privileged, réseau hôte, montage hors du
# répertoire du projet, réseaux inattendus, image applicative sans digest).
# Aucune commande Docker globale, aucun `-v` : les volumes ne sont jamais supprimés.
#
# Usage : sudo stg-deploy <projet> {validate|pull|up [service…]|ps|logs <service>|stop|down}
set -euo pipefail

die() { printf '[stg-deploy] ERREUR: %s\n' "$*" >&2; exit 1; }
[ "$(id -u)" -eq 0 ] || die "à exécuter en root (sudo)"

PROJET="${1:-}"; ACTION="${2:-}"
[[ "$PROJET" =~ ^[a-z][a-z0-9-]{1,20}$ ]] || die "nom de projet invalide"
shift 2 || die "usage : stg-deploy <projet> {validate|pull|up|ps|logs|stop|down}"
ROOT="/srv/${PROJET}"
NAME="${PROJET}-staging"
[ -f "$ROOT/compose.yml" ] && [ -f "$ROOT/env/.env" ] || die "compose.yml ou env/.env absent sous $ROOT"
command -v jq >/dev/null 2>&1 || die "jq requis"

export DOCKER_CONFIG="$ROOT/.docker"
DC=(docker compose -p "$NAME" --project-directory "$ROOT" --env-file "$ROOT/env/.env" -f "$ROOT/compose.yml")

validate() {
  local json bad nets
  json="$("${DC[@]}" config --format json)" || die "configuration Compose invalide"

  bad="$(jq -r --arg root "$ROOT" '
    .services | to_entries[] | select(
         ((.value.ports // []) | length) > 0
      or (.value.privileged // false)
      or ((.value.network_mode // "") == "host")
      or ((.value.pid // "") == "host")
      or ((.value.cap_add // []) | length) > 0
      or ((.value.devices // []) | length) > 0
      or ((.value.volumes // []) | any(.type == "bind" and (
            ((.source | startswith($root + "/")) | not)
            or (.source | contains("/../")) or (.source | endswith("/.."))
          )))
    ) | .key' <<<"$json")"
  [ -z "$bad" ] || die "services non conformes (ports, privileged, hôte, cap_add, devices ou montage hors $ROOT) : $(echo "$bad" | tr '\n' ' ')"

  nets="$(jq -r --arg edge "edge-${PROJET}" '
    ([.services[].networks // {} | keys[]] | unique) as $n
    | ($n - ["internal","edge"]) | join(",")' <<<"$json")"
  [ -z "$nets" ] || die "réseaux inattendus : $nets"
  jq -e --arg edge "edge-${PROJET}" '.networks.edge.name == $edge and (.networks.edge.external // false)' <<<"$json" >/dev/null \
    || die "le réseau « edge » doit être externe et nommé edge-${PROJET}"

  jq -e '(.services.api.image | contains("@sha256:")) and (.services.nginx.image | contains("@sha256:"))' <<<"$json" >/dev/null \
    || die "images api/nginx : référence par digest (@sha256) exigée, jamais un tag"
  echo "[stg-deploy] configuration conforme : $(jq -r '.services | keys | join(" ")' <<<"$json")"
}

case "$ACTION" in
  validate) validate ;;
  pull)     validate; "${DC[@]}" pull api nginx ;;
  up)
    validate
    for s in "$@"; do [[ "$s" =~ ^[a-z0-9-]+$ ]] || die "nom de service invalide : $s"; done
    "${DC[@]}" up -d "$@"
    ;;
  ps)       "${DC[@]}" ps -a ;;
  logs)
    [[ "${1:-}" =~ ^[a-z0-9-]+$ ]] || die "usage : stg-deploy $PROJET logs <service>"
    "${DC[@]}" logs --no-color --tail 100 "$1"
    ;;
  stop)     "${DC[@]}" stop ;;
  down)     "${DC[@]}" down --remove-orphans ;;   # jamais -v : les volumes sont conservés
  *)        die "action inconnue : $ACTION" ;;
esac
