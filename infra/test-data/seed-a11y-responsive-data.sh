#!/usr/bin/env bash
# Seed minimal non-sensitive data for Angular a11y/responsive proof.
#
# Scope: Invitation, Notifications, and finance widgets (bien, bail, paiements,
# honoraires) on an isolated local/staging stack. The script uses @test.local
# identities and generated passwords only. It does not touch Production unless the
# operator explicitly points BASE/COMPOSE_FILE to it; do not do that for CGPA proof.
#
# Prerequisites:
#   - docker compose stack healthy, with .env at repo root
#   - curl, jq, openssl
#   - KEYCLOAK_TEST_BAILLEUR_PASSWORD available in .env
#   - trusted TLS cert readable at CACERT (default infra/nginx/certs/localhost.pem)
#
# Output: writes .env.a11y-responsive.local (gitignored) containing
# RESPONSIVE_GESTIONNAIRE_EMAIL/PASSWORD for Playwright. This file is ignored.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"
# shellcheck disable=SC1091
source .env

BASE="${BASE:-https://localhost}"
CACERT="${CACERT:-infra/nginx/certs/localhost.pem}"
# Ce seed crée des identités et modifie temporairement le client OIDC. Hors localhost, une
# approbation explicite est obligatoire afin d'empêcher toute exécution accidentelle sur Staging/Prod.
if [[ "$BASE" != "https://localhost" && "${ALLOW_NON_LOCAL_SEED:-}" != "1" ]]; then
  echo "Refus : BASE=$BASE. Utiliser https://localhost ou définir explicitement ALLOW_NON_LOCAL_SEED=1 sur un environnement isolé." >&2
  exit 2
fi
RUN_ID="${RUN_ID:-a11yresp-$(date +%Y%m%d%H%M%S)}"
REALM="loyertracker"
KCADM="/opt/keycloak/bin/kcadm.sh"
CURL=(curl -sS --cacert "$CACERT")
OUT_ENV=".env.a11y-responsive.local"
PASS=0
FAIL=0
BODY=""
SPA_ID=""
DIRECT_ACCESS_GRANTS_INITIAL=""

note() { printf '\n== %s ==\n' "$*"; }
ok() { PASS=$((PASS + 1)); printf 'PASS %s\n' "$*"; }
ko() { FAIL=$((FAIL + 1)); printf 'FAIL %s\n' "$*"; }

expect_status() {
  local want="$1" desc="$2"; shift 2
  local code
  code=$("${CURL[@]}" -o /tmp/seed-a11y-responsive-body.$$ -w '%{http_code}' "$@") || code="000"
  BODY=$(cat /tmp/seed-a11y-responsive-body.$$ 2>/dev/null || true)
  rm -f /tmp/seed-a11y-responsive-body.$$
  if [[ "$code" == "$want" ]]; then
    ok "$desc ($code)"
  else
    ko "$desc (attendu $want, obtenu $code) : $(printf '%s' "$BODY" | head -c 300)"
  fi
}

kc() { docker compose exec -T keycloak bash -c "$*"; }

scaffold_on() {
  note "Enable temporary direct access grant for repository-local test seeding"
  kc "$KCADM config credentials --server http://localhost:8080/auth --realm master --user \$KEYCLOAK_ADMIN --password \$KEYCLOAK_ADMIN_PASSWORD" >/dev/null
  SPA_ID=$(kc "$KCADM get clients -r $REALM -q clientId=loyertracker-spa --fields id --format csv --noquotes" | tr -d '\r')
  DIRECT_ACCESS_GRANTS_INITIAL=$(kc "$KCADM get clients/$SPA_ID -r $REALM --fields directAccessGrantsEnabled --format csv --noquotes" | tr -d '\r')
  [[ "$DIRECT_ACCESS_GRANTS_INITIAL" == "true" || "$DIRECT_ACCESS_GRANTS_INITIAL" == "false" ]] || {
    echo "État initial directAccessGrantsEnabled illisible ; abandon sans modification." >&2
    exit 1
  }
  kc "$KCADM update clients/$SPA_ID -r $REALM -s directAccessGrantsEnabled=true"
  ok "directAccessGrants temporaire activé (état initial=$DIRECT_ACCESS_GRANTS_INITIAL)"
}

scaffold_off() {
  if [[ -n "$SPA_ID" && ( "$DIRECT_ACCESS_GRANTS_INITIAL" == "true" || "$DIRECT_ACCESS_GRANTS_INITIAL" == "false" ) ]]; then
    kc "$KCADM update clients/$SPA_ID -r $REALM -s directAccessGrantsEnabled=$DIRECT_ACCESS_GRANTS_INITIAL" >/dev/null || true
    printf 'directAccessGrants restauré à %s\n' "$DIRECT_ACCESS_GRANTS_INITIAL"
  fi
}
trap scaffold_off EXIT

token() {
  "${CURL[@]}" "$BASE/auth/realms/$REALM/protocol/openid-connect/token" \
    -d grant_type=password -d client_id=loyertracker-spa \
    -d username="$1" -d password="$2" | jq -r .access_token
}

note "0. Preflight"
command -v jq >/dev/null || { echo "jq requis" >&2; exit 2; }
command -v openssl >/dev/null || { echo "openssl requis" >&2; exit 2; }
expect_status 200 "API health via TLS" "$BASE/api/actuator/health"
if [[ "$FAIL" != "0" ]]; then
  echo "Stack non prête; abandon avant création de données." >&2
  exit 1
fi

scaffold_on

note "1. Bailleur, patrimoine, bien, locataire, bail"
T_BAILLEUR=$(token "${RESPONSIVE_BAILLEUR_EMAIL:-bailleur-test@test.local}" "$KEYCLOAK_TEST_BAILLEUR_PASSWORD")
[[ -n "$T_BAILLEUR" && "$T_BAILLEUR" != "null" ]] || { echo "JWT bailleur KO" >&2; exit 1; }
AUTH_B=(-H "Authorization: Bearer $T_BAILLEUR")
expect_status 201 "POST /api/patrimoines" -X POST "${AUTH_B[@]}" -H 'Content-Type: application/json' \
  -d "{\"nom\":\"Patrimoine A11Y $RUN_ID\",\"adresse\":\"11 rue Test A11Y\",\"ville\":\"Paris\",\"pays\":\"FR\"}" \
  "$BASE/api/patrimoines"
PATRIMOINE_ID=$(jq -r .id <<<"$BODY")
expect_status 201 "POST /api/biens" -X POST "${AUTH_B[@]}" -H 'Content-Type: application/json' \
  -d "{\"adresse\":\"21 avenue Responsive $RUN_ID\",\"type\":\"APPARTEMENT\",\"statut\":\"LIBRE\",\"patrimoineId\":\"$PATRIMOINE_ID\"}" \
  "$BASE/api/biens"
BIEN_ID=$(jq -r .id <<<"$BODY")
expect_status 201 "POST /api/locataires" -X POST "${AUTH_B[@]}" -H 'Content-Type: application/json' \
  -d "{\"nom\":\"Locataire A11Y\",\"prenom\":\"Test\",\"email\":\"locataire-$RUN_ID@test.local\"}" \
  "$BASE/api/locataires"
LOCATAIRE_ID=$(jq -r .id <<<"$BODY")
DEBUT=$(date -d "-3 months" +%Y-%m-01)
FIN=$(date -d "+90 days" +%Y-%m-%d)
expect_status 201 "POST /api/biens/{id}/baux" -X POST "${AUTH_B[@]}" -H 'Content-Type: application/json' \
  -d "{\"locataireId\":\"$LOCATAIRE_ID\",\"loyerHc\":1250.00,\"provisionCharges\":150.00,\"depotGarantie\":1400.00,\"dateDebut\":\"$DEBUT\",\"dateFin\":\"$FIN\",\"devise\":\"EUR\"}" \
  "$BASE/api/biens/$BIEN_ID/baux"
BAIL_ID=$(jq -r .id <<<"$BODY")
expect_status 201 "POST /api/biens/{id}/baux/{id}/garanties" -X POST "${AUTH_B[@]}" -H 'Content-Type: application/json' \
  -d "{\"montant\":1400.00,\"typeGarantie\":\"CAUTION\",\"dateDepot\":\"$DEBUT\"}" \
  "$BASE/api/biens/$BIEN_ID/baux/$BAIL_ID/garanties"

note "2. Invitation gestionnaire and affectation"
GEST_EMAIL="gestionnaire-$RUN_ID@test.local"
GEST_PWD="A11Y-$(openssl rand -hex 8)-Aa1"
expect_status 201 "POST /api/invitations" -X POST "${AUTH_B[@]}" -H 'Content-Type: application/json' \
  -d "{\"email\":\"$GEST_EMAIL\"}" "$BASE/api/invitations"
INVITATION_TOKEN=$(jq -r .token <<<"$BODY")
expect_status 201 "POST /api/invitations/{token}/acceptation" -X POST -H 'Content-Type: application/json' \
  -d "{\"nom\":\"Gestionnaire\",\"prenom\":\"A11Y\",\"motDePasse\":\"$GEST_PWD\"}" \
  "$BASE/api/invitations/$INVITATION_TOKEN/acceptation"
GESTIONNAIRE_ID=$(jq -r .gestionnaireId <<<"$BODY")
expect_status 201 "POST /api/affectations" -X POST "${AUTH_B[@]}" -H 'Content-Type: application/json' \
  -d "{\"bienId\":\"$BIEN_ID\",\"gestionnaireId\":\"$GESTIONNAIRE_ID\",\"typeHonoraires\":\"POURCENTAGE\",\"montantHonoraires\":8.00,\"dateDebut\":\"$DEBUT\"}" \
  "$BASE/api/affectations"

note "3. Finance and notifications"
expect_status 200 "POST /api/batch/echeances" -X POST "${AUTH_B[@]}" "$BASE/api/batch/echeances"
expect_status 200 "GET /api/biens/{id}/paiements" "${AUTH_B[@]}" "$BASE/api/biens/$BIEN_ID/paiements"
PERIODE=$(jq -r 'sort_by(.periode) | .[0].periode' <<<"$BODY")
expect_status 200 "PATCH paiement RECU" -X PATCH "${AUTH_B[@]}" -H 'Content-Type: application/json' \
  -d '{"montantRecu":1400.00,"statut":"RECU"}' "$BASE/api/biens/$BIEN_ID/paiements/$PERIODE/pointage"
expect_status 200 "PUT notification preferences" -X PUT "${AUTH_B[@]}" -H 'Content-Type: application/json' \
  -d '{"phoneE164":"+33600000000","preferredChannel":"IN_APP","fallbackChannel":"SMS","smsOptIn":true,"whatsappOptIn":true,"consentSource":"A11Y_RESPONSIVE_SEED","language":"fr"}' \
  "$BASE/api/notifications/preferences/current"
expect_status 200 "GET notification history" "${AUTH_B[@]}" "$BASE/api/notifications/history"

cat >"$OUT_ENV" <<EOF
# Generated by infra/test-data/seed-a11y-responsive-data.sh for Playwright responsive proof.
# Do not commit: contains an ephemeral generated password.
RESPONSIVE_BAILLEUR_EMAIL=${RESPONSIVE_BAILLEUR_EMAIL:-bailleur-test@test.local}
KEYCLOAK_TEST_BAILLEUR_PASSWORD=${KEYCLOAK_TEST_BAILLEUR_PASSWORD}
RESPONSIVE_GESTIONNAIRE_EMAIL=${GEST_EMAIL}
RESPONSIVE_GESTIONNAIRE_PASSWORD=${GEST_PWD}
RESPONSIVE_SEED_RUN_ID=${RUN_ID}
EOF
chmod 600 "$OUT_ENV"

printf '\n== Bilan seed: %d PASS, %d FAIL ==\n' "$PASS" "$FAIL"
printf 'Playwright env written to %s\n' "$OUT_ENV"
printf 'Run: set -a; source %q; set +a; cd frontend; npm run responsive:e2e\n' "$OUT_ENV"
[[ "$FAIL" == "0" ]]
