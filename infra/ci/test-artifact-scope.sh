#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SCOPE_SCRIPT="$SCRIPT_DIR/artifact-scope.sh"
tests_run=0

assert_scope() {
  local expected="$1"
  local label="$2"
  shift 2

  local actual
  actual="$(printf '%s\n' "$@" | "$SCOPE_SCRIPT")"
  if [[ "$actual" != "images_changed=$expected" ]]; then
    printf 'FAIL %s: attendu images_changed=%s, obtenu %s\n' \
      "$label" "$expected" "$actual" >&2
    exit 1
  fi

  tests_run=$((tests_run + 1))
  printf 'PASS %s\n' "$label"
}

assert_scope false "entrée vide"
assert_scope false "documentation pure" \
  "docs/project-state.md" "docs/cgpa/README.md"
assert_scope false "fichiers sans impact image" \
  "README.md" ".github/workflows/codeql.yml" "infra/release/check-release-state.sh"
assert_scope true "backend" "backend/src/main/java/App.java"
assert_scope true "frontend" "frontend/src/app/app.ts"
assert_scope true "configuration Nginx" "infra/nginx/nginx.conf"
assert_scope true "contexte Docker global" ".dockerignore"
assert_scope true "workflow de packaging" ".github/workflows/ci.yml"
assert_scope true "contrôles supply-chain" \
  "infra/ci/supply-chain.sh" "infra/ci/test-supply-chain.sh"
assert_scope true "lot mixte" \
  "docs/project-state.md" "backend/pom.xml" "README.md"
assert_scope true "chemin préfixé" "./frontend/Dockerfile"

printf '%d tests artifact-scope PASS\n' "$tests_run"
