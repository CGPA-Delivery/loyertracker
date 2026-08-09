#!/usr/bin/env bash
# =============================================================================
# check-release-state.sh — verrou d'état de release (R-V54-2)
#
# Contrôle la cohérence entre l'état de release DÉCLARÉ
# (infra/release/production-state.env) et la réalité, à deux niveaux :
#
#   --ci    Cohérence interne du dépôt. Aucun accès à l'hôte requis.
#           Exécuté en CI comme étape bloquante.
#
#   --host  Cohérence entre le déclaré et l'état RÉEL de l'hôte de production.
#           Exécuté sur l'hôte, en tête de tout Préflight / Gate / hypercare.
#
# STRICTEMENT EN LECTURE SEULE dans les deux modes : aucune écriture, aucun
# redémarrage, aucune commande Docker à portée globale (cf. CLAUDE.md).
#
# Sortie : 0 si tout est cohérent, 1 sinon (avec un message explicite par écart).
# =============================================================================
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
STATE_FILE="$SCRIPT_DIR/production-state.env"

RED=$'\033[31m'; GREEN=$'\033[32m'; BOLD=$'\033[1m'; RESET=$'\033[0m'
FAILURES=0

ok()   { echo "  ${GREEN}OK${RESET}   $*"; }
ko()   { echo "  ${RED}ÉCART${RESET} $*"; FAILURES=$((FAILURES + 1)); }
note() { echo "${BOLD}$*${RESET}"; }

usage() {
  cat >&2 <<EOF
Usage: $(basename "$0") --ci | --host

  --ci    Cohérence interne du dépôt (compteur Flyway, version, format de tag).
  --host  Déclaré vs réel sur l'hôte de production (tag .env, base, digests).
EOF
  exit 2
}

# --- Chargement du fichier d'état ------------------------------------------
[[ -f "$STATE_FILE" ]] || { echo "${RED}FATAL${RESET} fichier d'état introuvable : $STATE_FILE" >&2; exit 1; }
# shellcheck disable=SC1090
source "$STATE_FILE"

for var in RELEASE_VERSION PRODUCTION_TAG PRODUCTION_API_IMAGE_REF PRODUCTION_WEB_IMAGE_REF \
  FLYWAY_EXPECTED_REPO FLYWAY_EXPECTED_PROD PRODUCTION_DEPLOYED_AT; do
  [[ -n "${!var:-}" ]] || { echo "${RED}FATAL${RESET} variable manquante dans $STATE_FILE : $var" >&2; exit 1; }
done

# =============================================================================
# Mode --ci : cohérence interne du dépôt
# =============================================================================
check_ci() {
  note "Verrou d'état de release — mode CI (cohérence du dépôt)"
  echo "  déclaré : release=$RELEASE_VERSION tag=$PRODUCTION_TAG flyway_repo=$FLYWAY_EXPECTED_REPO"

  # 1. FLYWAY_EXPECTED_REPO == nombre de fichiers de migration
  local migration_dir="$REPO_ROOT/backend/src/main/resources/db/migration"
  if [[ -d "$migration_dir" ]]; then
    local count
    count=$(find "$migration_dir" -maxdepth 1 -name 'V*.sql' -type f | wc -l | tr -d ' ')
    if [[ "$count" == "$FLYWAY_EXPECTED_REPO" ]]; then
      ok "FLYWAY_EXPECTED_REPO=$FLYWAY_EXPECTED_REPO == $count fichiers V*.sql"
    else
      ko "FLYWAY_EXPECTED_REPO=$FLYWAY_EXPECTED_REPO mais $count fichiers V*.sql dans db/migration/"
      echo "        → une migration a été ajoutée ou retirée sans mettre à jour"
      echo "          infra/release/production-state.env (incidents PR #77 / #171)"
    fi
  else
    ko "répertoire de migrations introuvable : $migration_dir"
  fi

  # 2. RELEASE_VERSION == version en tête du CHANGELOG (hors [Non publié])
  local changelog="$REPO_ROOT/CHANGELOG.md"
  if [[ -f "$changelog" ]]; then
    local top
    top=$(grep -oE '^## \[[0-9]+\.[0-9]+\.[0-9]+(-[^]]+)?\]' "$changelog" | head -1 | tr -d '#[] ')
    if [[ -z "$top" ]]; then
      ko "aucune version SemVer trouvée dans $changelog"
    elif [[ "$top" == "$RELEASE_VERSION" ]]; then
      ok "RELEASE_VERSION=$RELEASE_VERSION == tête du CHANGELOG"
    else
      ko "RELEASE_VERSION=$RELEASE_VERSION mais le CHANGELOG est en tête à $top"
    fi
  else
    ko "CHANGELOG.md introuvable"
  fi

  # 3. Format du tag immuable
  if [[ "$PRODUCTION_TAG" =~ ^sha-[0-9a-f]{8}$ ]]; then
    ok "PRODUCTION_TAG=$PRODUCTION_TAG respecte le format sha-<8 hex>"
  else
    ko "PRODUCTION_TAG=$PRODUCTION_TAG ne respecte pas le format sha-<8 hex> (jamais 'latest')"
  fi

  # Le tag est conservé pour la lisibilité historique ; les digests font autorité.
  local ref
  for ref in "$PRODUCTION_API_IMAGE_REF" "$PRODUCTION_WEB_IMAGE_REF"; do
    if [[ "$ref" =~ ^ghcr\.io/(jptshilombo|cgpa-delivery)/loyertracker-(api|web)@sha256:[0-9a-f]{64}$ ]]; then
      ok "référence digest Production valide : $ref"
    else
      ko "référence digest Production invalide : $ref"
    fi
  done

  # 4. Horodatage RFC3339 UTC
  if [[ "$PRODUCTION_DEPLOYED_AT" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$ ]]; then
    ok "PRODUCTION_DEPLOYED_AT=$PRODUCTION_DEPLOYED_AT au format RFC3339 UTC"
  else
    ko "PRODUCTION_DEPLOYED_AT=$PRODUCTION_DEPLOYED_AT n'est pas au format RFC3339 UTC"
  fi

  # 5. Aucun compteur Flyway codé en dur résiduel.
  #    Motifs ciblés uniquement (pas de "attendu <n>" générique, qui produisait des faux
  #    positifs sur les codes HTTP et les montants du smoke) :
  #      - Java  : migrationsExecuted).isEqualTo(<littéral entier>)
  #      - Shell : comparaison de $MIG à un littéral entier
  local hardcoded
  hardcoded=$(grep -rnE 'migrationsExecuted\)\.isEqualTo\([0-9]+\)|\$MIG"? *== *"?[0-9]+' \
    "$REPO_ROOT/infra/smoke/smoke-stack.sh" \
    "$REPO_ROOT/backend/src/test/java/com/loyertracker/db/SchemaMigrationTest.java" \
    2>/dev/null || true)
  if [[ -z "$hardcoded" ]]; then
    ok "aucun compteur Flyway codé en dur dans le smoke ni SchemaMigrationTest"
  else
    ko "compteur Flyway codé en dur détecté :"
    echo "$hardcoded" | sed 's/^/        /'
  fi
}

# =============================================================================
# Mode --host : déclaré vs réel sur l'hôte de production
# =============================================================================
check_host() {
  note "Verrou d'état de release — mode HÔTE (déclaré vs réel)"
  echo "  déclaré : release=$RELEASE_VERSION tag=$PRODUCTION_TAG flyway_prod=$FLYWAY_EXPECTED_PROD"

  local env_file="${ENV_FILE:-$REPO_ROOT/.env}"
  local pg="${PG_CONTAINER:-loyertracker-postgres-1}"
  local api="${API_CONTAINER:-loyertracker-api-1}"
  local web="${WEB_CONTAINER:-loyertracker-nginx-1}"

  # 1. Références digest déclarées == références du .env hôte
  if [[ -f "$env_file" ]]; then
    local real_api_ref real_web_ref
    real_api_ref=$(grep -E '^API_IMAGE_REF=' "$env_file" | cut -d= -f2- | tr -d '"'"'"' ')
    real_web_ref=$(grep -E '^WEB_IMAGE_REF=' "$env_file" | cut -d= -f2- | tr -d '"'"'"' ')
    [[ "$real_api_ref" == "$PRODUCTION_API_IMAGE_REF" ]] \
      && ok "digest API hôte conforme" \
      || ko "DÉRIVE : API_IMAGE_REF hôte '$real_api_ref' != déclaré '$PRODUCTION_API_IMAGE_REF'"
    [[ "$real_web_ref" == "$PRODUCTION_WEB_IMAGE_REF" ]] \
      && ok "digest Web hôte conforme" \
      || ko "DÉRIVE : WEB_IMAGE_REF hôte '$real_web_ref' != déclaré '$PRODUCTION_WEB_IMAGE_REF'"
  else
    ko "fichier .env introuvable : $env_file"
  fi

  # 2. Compteur Flyway déclaré == compteur réel en base
  local real_mig
  real_mig=$(docker exec "$pg" psql -U "${POSTGRES_USER:-loyertracker}" \
    -d "${POSTGRES_DB:-loyertracker}" -tAc \
    "SELECT count(*) FROM flyway_schema_history WHERE success" 2>/dev/null | tr -d ' ')
  if [[ -z "$real_mig" ]]; then
    ko "impossible de lire flyway_schema_history (conteneur $pg injoignable ?)"
  elif [[ "$real_mig" == "$FLYWAY_EXPECTED_PROD" ]]; then
    ok "Flyway réel = $real_mig == FLYWAY_EXPECTED_PROD"
  else
    ko "DÉRIVE : Flyway réel = $real_mig mais FLYWAY_EXPECTED_PROD = $FLYWAY_EXPECTED_PROD"
  fi

  # 3. Images actives cohérentes avec les références digest déclarées
  local pair c expected img
  for pair in "$api|$PRODUCTION_API_IMAGE_REF" "$web|$PRODUCTION_WEB_IMAGE_REF"; do
    c="${pair%%|*}"
    expected="${pair#*|}"
    img=$(docker inspect -f '{{.Config.Image}}' "$c" 2>/dev/null || true)
    if [[ -z "$img" ]]; then
      ko "conteneur introuvable : $c"
    elif [[ "$img" == "$expected" ]]; then
      ok "$c exécute $img"
    else
      ko "DÉRIVE : $c exécute '$img', attendu '$expected'"
    fi
  done
}

# =============================================================================
[[ $# -eq 1 ]] || usage
case "$1" in
  --ci)   check_ci ;;
  --host) check_host ;;
  *)      usage ;;
esac

echo
if [[ "$FAILURES" -eq 0 ]]; then
  note "Verrou d'état de release : COHÉRENT"
  exit 0
fi
note "Verrou d'état de release : $FAILURES ÉCART(S) — voir ci-dessus"
exit 1
