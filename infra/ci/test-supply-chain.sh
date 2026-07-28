#!/usr/bin/env bash
set -Eeuo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SCRIPT="$REPO_ROOT/infra/ci/supply-chain.sh"
TEST_ROOT="$(mktemp -d)"
trap 'rm -rf "$TEST_ROOT"' EXIT
MOCK_BIN="$TEST_ROOT/bin"
mkdir -p "$MOCK_BIN"

cat > "$MOCK_BIN/docker" <<'MOCK'
#!/usr/bin/env bash
set -Eeuo pipefail
printf '%s\n' "$*" >> "$MOCK_DOCKER_LOG"
if [[ "$1 $2" == "manifest inspect" ]]; then
  [[ "${MOCK_TAG_EXISTS:-false}" == "true" ]]
elif [[ "$1 $2" == "image inspect" ]]; then
  exit 0
elif [[ "$1" == "tag" ]]; then
  exit 0
elif [[ "$1" == "push" ]]; then
  printf 'pushed\ndigest: sha256:%064d size: 1234\n' 1
elif [[ "$1 $2 $3" == "buildx imagetools inspect" ]]; then
  exit 0
else
  exit 1
fi
MOCK
chmod +x "$MOCK_BIN/docker"
export PATH="$MOCK_BIN:$PATH"
export MOCK_DOCKER_LOG="$TEST_ROOT/docker.log"
: > "$MOCK_DOCKER_LOG"

REPOSITORY="ghcr.io/jptshilombo/loyertracker-api"
TAG="sha-1234abcd"
DIGEST="sha256:$(printf '%064d' 1)"

MOCK_TAG_EXISTS=false "$SCRIPT" assert-tag-absent "$REPOSITORY" "$TAG"
if MOCK_TAG_EXISTS=true "$SCRIPT" assert-tag-absent "$REPOSITORY" "$TAG" 2>/dev/null; then
  echo "FAIL: un tag existant doit être refusé" >&2
  exit 1
fi
if "$SCRIPT" assert-tag-absent "$REPOSITORY" latest 2>/dev/null; then
  echo "FAIL: latest doit être refusé" >&2
  exit 1
fi

actual="$(MOCK_TAG_EXISTS=false "$SCRIPT" publish local-api "$REPOSITORY" "$TAG")"
[[ "$actual" == "$DIGEST" ]] || { echo "FAIL: digest publié inattendu: $actual" >&2; exit 1; }
grep -q "tag local-api $REPOSITORY:$TAG" "$MOCK_DOCKER_LOG"
grep -q "buildx imagetools inspect $REPOSITORY@$DIGEST" "$MOCK_DOCKER_LOG"

printf '{"spdxVersion":"SPDX-2.3"}\n' > "$TEST_ROOT/api.spdx.json"
printf '{"spdxVersion":"SPDX-2.3"}\n' > "$TEST_ROOT/web.spdx.json"
API_REF="$REPOSITORY@$DIGEST"
WEB_REF="ghcr.io/jptshilombo/loyertracker-web@$DIGEST"
"$SCRIPT" manifest "$TEST_ROOT/release-manifest.json" \
  "0123456789abcdef0123456789abcdef01234567" "$TAG" "$API_REF" "$WEB_REF" \
  "$TEST_ROOT/api.spdx.json" "$TEST_ROOT/web.spdx.json" \
  "owner/repo/.github/workflows/ci.yml@refs/heads/main" \
  "https://github.com/owner/repo/actions/runs/123" "2026-07-28T00:00:00Z"
jq -e --arg api "$API_REF" --arg web "$WEB_REF" \
  '.schemaVersion == 1 and .images.api.reference == $api and .images.web.reference == $web
   and .verification.cosignSignature == "verified"
   and .build.generatedAt == "2026-07-28T00:00:00Z"' \
  "$TEST_ROOT/release-manifest.json" >/dev/null

echo "Supply-chain tests: PASS"
