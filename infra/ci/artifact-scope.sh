#!/usr/bin/env bash
set -Eeuo pipefail

# Lit une liste de chemins (un par ligne) et produit une sortie directement
# compatible avec GITHUB_OUTPUT. La liste positive correspond aux contextes
# Docker de l'API et du Web, plus aux fichiers qui pilotent leur construction.
images_changed=false

while IFS= read -r path; do
  path="${path#./}"

  case "$path" in
    backend/* | frontend/* | infra/nginx/nginx.conf | infra/ci/supply-chain.sh | \
      infra/ci/test-supply-chain.sh | .dockerignore | .github/workflows/ci.yml)
      images_changed=true
      break
      ;;
  esac
done

printf 'images_changed=%s\n' "$images_changed"
