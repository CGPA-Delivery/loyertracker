#!/usr/bin/env bash
# Static contract tests for the Production Keycloak SMTP one-shot (DD-EP17-14).
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PROD_SCRIPT="$ROOT/infra/keycloak/configure-smtp-production.sh"
ROLLBACK_SCRIPT="$ROOT/infra/keycloak/rollback-smtp-production.sh"
PROD_COMPOSE="$ROOT/docker-compose.prod.yml"

fail() { echo "FAIL: $*" >&2; exit 1; }
pass() { echo "PASS: $*"; }
require_file() { [[ -f "$1" ]] || fail "missing $1"; }
require_pattern() { grep -Fq -- "$2" "$1" || fail "missing pattern '$2' in $1"; }
reject_pattern() { ! grep -Fq -- "$2" "$1" || fail "forbidden pattern '$2' in $1"; }

require_file "$PROD_SCRIPT"
require_file "$ROLLBACK_SCRIPT"
require_file "$PROD_COMPOSE"

require_pattern "$PROD_SCRIPT" 'KC_PRODUCTION_CHANGE_ID'
require_pattern "$PROD_SCRIPT" 'KC_SMTP_PASSWORD'
require_pattern "$PROD_SCRIPT" '"smtpServer"'
require_pattern "$PROD_SCRIPT" '"password"'
require_pattern "$PROD_SCRIPT" 'update "realms/${REALM}" -f "$SMTP_UPDATE"'
require_pattern "$PROD_SCRIPT" 'smtpServer incomplet'
reject_pattern "$PROD_SCRIPT" 'smtpServer.password=${KC_SMTP_PASSWORD}'

require_pattern "$ROLLBACK_SCRIPT" 'KC_PRODUCTION_CHANGE_ID'
require_pattern "$ROLLBACK_SCRIPT" 'smtpServer={}'
require_pattern "$ROLLBACK_SCRIPT" 'update "realms/${REALM}" -f "$ROLLBACK_UPDATE"'
require_pattern "$ROLLBACK_SCRIPT" 'Rollback confirmé : smtpServer={}'

require_pattern "$PROD_COMPOSE" 'keycloak-smtp-production-init:'
require_pattern "$PROD_COMPOSE" 'profiles: [production-smtp]'
require_pattern "$PROD_COMPOSE" 'configure-smtp-production.sh'
require_pattern "$PROD_COMPOSE" 'KC_SMTP_PASSWORD:'
require_pattern "$PROD_COMPOSE" 'KC_PRODUCTION_CHANGE_ID:'
require_pattern "$PROD_COMPOSE" 'keycloak-smtp-production-rollback:'
require_pattern "$PROD_COMPOSE" 'rollback-smtp-production.sh'

pass "Production SMTP contract is complete"
