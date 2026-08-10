#!/usr/bin/env bash
# Contrat minimal WCAG du thème login Keycloak (EP-17 / US-136).
# S'exécute depuis la racine du dépôt : bash infra/keycloak/themes/loyertracker/login/test-theme-accessibility.sh
set -euo pipefail

THEME_DIR="infra/keycloak/themes/loyertracker/login"
TEMPLATE="$THEME_DIR/template.ftl"
CSS="$THEME_DIR/resources/css/login.css"

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

[[ -f "$TEMPLATE" ]] || fail "template.ftl must provide the Keycloak main landmark"
[[ -f "$CSS" ]] || fail "login.css is missing"

grep -Fq '<main id="kc-content" role="main" aria-labelledby="kc-page-title">' "$TEMPLATE" \
  || fail "#kc-content must be the labelled main landmark"
grep -Fq '</main>' "$TEMPLATE" \
  || fail "main landmark must be closed"
grep -A2 -F 'p.instruction {' "$CSS" | grep -Fq 'color: var(--lt-text-muted);' \
  || fail ".instruction must use the compliant existing muted token"

if grep -R --include='*.js' -q . "$THEME_DIR/resources/js" 2>/dev/null; then
  fail "theme must not add JavaScript landmark manipulation"
fi

printf 'PASS: Keycloak login theme satisfies the US-136 accessibility contract\n'
