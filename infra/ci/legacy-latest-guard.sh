#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_POLICY="$SCRIPT_DIR/legacy-latest-policy.json"

usage() {
  printf 'Usage: %s validate <package> <versions.json> [policy.json]\n' "$0" >&2
  printf '       %s scan [repository-root]\n' "$0" >&2
  printf '       %s live [policy.json]\n' "$0" >&2
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    printf 'ERREUR: commande requise absente: %s\n' "$1" >&2
    exit 2
  fi
}

validate_package() {
  local package="$1"
  local versions_file="$2"
  local policy_file="${3:-$DEFAULT_POLICY}"

  require_command jq

  local version_id digest historical_tag matches
  version_id="$(jq -er --arg package "$package" '.packages[$package].version_id' "$policy_file")"
  digest="$(jq -er --arg package "$package" '.packages[$package].digest' "$policy_file")"
  historical_tag="$(jq -er --arg package "$package" '.packages[$package].historical_tag' "$policy_file")"

  # --paginate --slurp produit un tableau de pages ; un fixture local peut être
  # un tableau simple. Cette normalisation accepte les deux formes.
  matches="$(
    jq -ce '
      [.[] | if type == "array" then .[] else . end
       | select((.metadata.container.tags // []) | index("latest"))]
    ' "$versions_file"
  )"

  if ! jq -e \
    --argjson version_id "$version_id" \
    --arg digest "$digest" \
    --arg historical_tag "$historical_tag" '
      length == 1
      and .[0].id == $version_id
      and .[0].name == $digest
      and ((.[0].metadata.container.tags | sort)
           == ([$historical_tag, "latest"] | sort))
    ' <<<"$matches" >/dev/null; then
    printf 'ERREUR: dérive de la quarantaine latest pour %s\n' "$package" >&2
    jq -c '.' <<<"$matches" >&2
    return 1
  fi

  printf 'PASS quarantaine %s: version=%s digest=%s tags=%s,latest\n' \
    "$package" "$version_id" "$digest" "$historical_tag"
}

scan_repository() {
  local repository_root="${1:-$(git rev-parse --show-toplevel)}"
  local pattern='ghcr[.]io/jptshilombo/loyertracker-(api|web):latest'
  local -a targets=()
  local candidate

  require_command grep

  for candidate in \
    "$repository_root/.github" \
    "$repository_root/infra" \
    "$repository_root/backend" \
    "$repository_root/frontend" \
    "$repository_root/docker-compose.yml" \
    "$repository_root/docker-compose.staging.yml" \
    "$repository_root/docker-compose.prod.yml"; do
    if [[ -e "$candidate" ]]; then
      targets+=("$candidate")
    fi
  done

  if ((${#targets[@]} == 0)); then
    printf 'ERREUR: aucune cible active à contrôler sous %s\n' "$repository_root" >&2
    return 1
  fi

  if grep -R -nE \
    --exclude='legacy-latest-guard.sh' \
    --exclude='test-legacy-latest-guard.sh' \
    -- "$pattern" "${targets[@]}"; then
    printf 'ERREUR: consommation ou publication active de latest détectée\n' >&2
    return 1
  fi

  printf 'PASS aucune référence applicative active vers latest\n'
}

check_live_registry() {
  local policy_file="${1:-$DEFAULT_POLICY}"
  local owner package versions_file
  local temporary_directory

  require_command gh
  require_command jq
  owner="$(jq -er '.owner' "$policy_file")"
  temporary_directory="$(mktemp -d)"
  trap 'rm -rf -- "$temporary_directory"' RETURN

  for package in loyertracker-api loyertracker-web; do
    versions_file="$temporary_directory/$package.json"
    gh api --paginate --slurp \
      "/users/$owner/packages/container/$package/versions?per_page=100" \
      >"$versions_file"
    validate_package "$package" "$versions_file" "$policy_file"
  done
}

case "${1:-}" in
  validate)
    if (($# < 3 || $# > 4)); then
      usage
      exit 2
    fi
    validate_package "$2" "$3" "${4:-$DEFAULT_POLICY}"
    ;;
  scan)
    if (($# > 2)); then
      usage
      exit 2
    fi
    scan_repository "${2:-}"
    ;;
  live)
    if (($# > 2)); then
      usage
      exit 2
    fi
    check_live_registry "${2:-$DEFAULT_POLICY}"
    ;;
  *)
    usage
    exit 2
    ;;
esac
