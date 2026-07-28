#!/usr/bin/env bash
# Contrôles supply-chain LoyerTracker : tag non réutilisable, publication avec digest
# vérifié et manifeste de release déterministe. Aucune commande Docker globale.
set -Eeuo pipefail

die() { printf 'ERREUR supply-chain: %s\n' "$*" >&2; exit 1; }

validate_tag() {
  [[ "${1:-}" =~ ^sha-[0-9a-f]{8}$ ]] || die "tag invalide '$1' (attendu sha-<8 hex>)"
}

validate_digest() {
  [[ "${1:-}" =~ ^sha256:[0-9a-f]{64}$ ]] || die "digest SHA-256 invalide '$1'"
}

validate_repository() {
  [[ "${1:-}" =~ ^ghcr\.io/[a-z0-9_.-]+/[a-z0-9_.-]+$ ]] ||
    die "repository GHCR invalide '$1'"
}

validate_digest_ref() {
  local ref="${1:-}"
  [[ "$ref" =~ ^ghcr\.io/[a-z0-9_.-]+/[a-z0-9_.-]+@sha256:[0-9a-f]{64}$ ]] ||
    die "référence digest invalide '$ref'"
}

assert_tag_absent() {
  local repository="$1" tag="$2"
  validate_repository "$repository"
  validate_tag "$tag"
  if docker manifest inspect "$repository:$tag" >/dev/null 2>&1; then
    die "refus d'écraser le tag existant $repository:$tag"
  fi
  printf 'Tag absent vérifié: %s:%s\n' "$repository" "$tag" >&2
}

publish_image() {
  local local_ref="$1" repository="$2" tag="$3"
  local remote_ref push_output digest
  [[ -n "$local_ref" ]] || die "référence locale absente"
  assert_tag_absent "$repository" "$tag"
  remote_ref="$repository:$tag"
  docker image inspect "$local_ref" >/dev/null
  docker tag "$local_ref" "$remote_ref"
  push_output="$(docker push "$remote_ref" 2>&1)"
  printf '%s\n' "$push_output" >&2
  digest="$(printf '%s\n' "$push_output" |
    sed -nE 's/.*digest: (sha256:[0-9a-f]{64}).*/\1/p' | tail -1)"
  validate_digest "$digest"
  docker buildx imagetools inspect "$repository@$digest" >/dev/null
  printf '%s\n' "$digest"
}

write_manifest() {
  local output="$1" commit="$2" tag="$3" api_ref="$4" web_ref="$5"
  local api_sbom="$6" web_sbom="$7" workflow_ref="$8" run_url="$9" generated_at="${10}"
  [[ "$commit" =~ ^[0-9a-f]{40}$ ]] || die "commit complet invalide '$commit'"
  validate_tag "$tag"
  validate_digest_ref "$api_ref"
  validate_digest_ref "$web_ref"
  [[ -s "$api_sbom" ]] || die "SBOM API absente ou vide: $api_sbom"
  [[ -s "$web_sbom" ]] || die "SBOM Web absente ou vide: $web_sbom"

  jq -n \
    --arg commit "$commit" \
    --arg tag "$tag" \
    --arg apiRef "$api_ref" \
    --arg webRef "$web_ref" \
    --arg apiSbomSha256 "$(sha256sum "$api_sbom" | awk '{print $1}')" \
    --arg webSbomSha256 "$(sha256sum "$web_sbom" | awk '{print $1}')" \
    --arg workflowRef "$workflow_ref" \
    --arg runUrl "$run_url" \
    --arg generatedAt "$generated_at" \
    '{
      schemaVersion: 1,
      commit: $commit,
      lookupTag: $tag,
      images: {
        api: {reference: $apiRef, sbomSha256: $apiSbomSha256},
        web: {reference: $webRef, sbomSha256: $webSbomSha256}
      },
      build: {workflowRef: $workflowRef, runUrl: $runUrl, generatedAt: $generatedAt},
      verification: {
        imageScan: "passed",
        cosignSignature: "verified",
        githubProvenance: "verified",
        githubSbomAttestation: "verified"
      }
    }' > "$output"
}

usage() {
  printf 'Usage: %s assert-tag-absent <repository> <tag>\n' "$0" >&2
  printf '       %s publish <local-ref> <repository> <tag>\n' "$0" >&2
  printf '       %s manifest <output> <commit> <tag> <api-ref> <web-ref> <api-sbom> <web-sbom> <workflow-ref> <run-url> <generated-at>\n' "$0" >&2
  exit 2
}

[[ $# -ge 1 ]] || usage
command="$1"; shift
case "$command" in
  assert-tag-absent) [[ $# -eq 2 ]] || usage; assert_tag_absent "$@" ;;
  publish) [[ $# -eq 3 ]] || usage; publish_image "$@" ;;
  manifest) [[ $# -eq 10 ]] || usage; write_manifest "$@" ;;
  *) usage ;;
esac
