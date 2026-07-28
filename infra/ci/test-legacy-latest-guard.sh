#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
GUARD="$SCRIPT_DIR/legacy-latest-guard.sh"
POLICY="$SCRIPT_DIR/legacy-latest-policy.json"
TEMPORARY_DIRECTORY="$(mktemp -d)"
trap 'rm -rf -- "$TEMPORARY_DIRECTORY"' EXIT
tests_run=0

expect_pass() {
  local label="$1"
  shift
  if ! "$@" >/dev/null; then
    printf 'FAIL %s: succès attendu\n' "$label" >&2
    exit 1
  fi
  tests_run=$((tests_run + 1))
  printf 'PASS %s\n' "$label"
}

expect_fail() {
  local label="$1"
  shift
  if "$@" >/dev/null 2>&1; then
    printf 'FAIL %s: échec attendu\n' "$label" >&2
    exit 1
  fi
  tests_run=$((tests_run + 1))
  printf 'PASS %s\n' "$label"
}

write_versions() {
  local path="$1"
  local version_id="$2"
  local digest="$3"
  local tags_json="$4"
  printf '[{"id":%s,"name":"%s","metadata":{"container":{"tags":%s}}}]\n' \
    "$version_id" "$digest" "$tags_json" >"$path"
}

api_digest='sha256:5dcd38449045a19ff866edd65572ce49773d6e9e57a494bab96e9601fe67e0fd'
write_versions "$TEMPORARY_DIRECTORY/valid.json" 1073590800 "$api_digest" \
  '["sha-19d0d0a4","latest"]'
expect_pass "état historique exact" \
  "$GUARD" validate loyertracker-api "$TEMPORARY_DIRECTORY/valid.json" "$POLICY"

write_versions "$TEMPORARY_DIRECTORY/drift.json" 1073590800 \
  'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' \
  '["sha-19d0d0a4","latest"]'
expect_fail "dérive du digest" \
  "$GUARD" validate loyertracker-api "$TEMPORARY_DIRECTORY/drift.json" "$POLICY"

write_versions "$TEMPORARY_DIRECTORY/missing.json" 1073590800 "$api_digest" \
  '["sha-19d0d0a4"]'
expect_fail "disparition non instruite de latest" \
  "$GUARD" validate loyertracker-api "$TEMPORARY_DIRECTORY/missing.json" "$POLICY"

write_versions "$TEMPORARY_DIRECTORY/tags.json" 1073590800 "$api_digest" \
  '["latest","stable"]'
expect_fail "co-étiquette inattendue" \
  "$GUARD" validate loyertracker-api "$TEMPORARY_DIRECTORY/tags.json" "$POLICY"

printf '[%s,%s]\n' \
  '{"id":1073590800,"name":"sha256:5dcd38449045a19ff866edd65572ce49773d6e9e57a494bab96e9601fe67e0fd","metadata":{"container":{"tags":["sha-19d0d0a4","latest"]}}}' \
  '{"id":42,"name":"sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","metadata":{"container":{"tags":["latest"]}}}' \
  >"$TEMPORARY_DIRECTORY/duplicate.json"
expect_fail "plusieurs alias latest" \
  "$GUARD" validate loyertracker-api "$TEMPORARY_DIRECTORY/duplicate.json" "$POLICY"

mkdir -p "$TEMPORARY_DIRECTORY/clean/.github"
printf 'name: harmless\n' >"$TEMPORARY_DIRECTORY/clean/.github/workflow.yml"
expect_pass "dépôt actif sans latest" "$GUARD" scan "$TEMPORARY_DIRECTORY/clean"

mkdir -p "$TEMPORARY_DIRECTORY/violation/infra"
printf 'image: ghcr.io/jptshilombo/loyertracker-api:latest\n' \
  >"$TEMPORARY_DIRECTORY/violation/infra/compose.yml"
expect_fail "consommation active latest" "$GUARD" scan "$TEMPORARY_DIRECTORY/violation"

printf '%d tests legacy-latest PASS\n' "$tests_run"
