#!/usr/bin/env bash
# PROPOSÉ — NON EXÉCUTÉ, NON VERSIONNÉ DANS infra/keycloak/. One-shot après import du realm : restreint le
# client public `loyertracker-spa` au SEUL hôte public de cet environnement (redirect URIs, web origins,
# rootUrl). Le realm versionné ne connaît que localhost et les domaines loyerpro.org ; sur
# *.staging.tshilo.dev la connexion OIDC serait refusée.
# Même principe que activate-login-theme.sh : API Admin (kcadm.sh) exclusivement, jamais d'édition du JSON
# de realm versionné (DD-EP17-01). Idempotent. Remplace volontairement les listes (pas de fusion) :
# un Staging n'accepte que son propre hôte.
set -euo pipefail

KCADM=/opt/keycloak/bin/kcadm.sh
SERVER="${KC_INIT_SERVER:-http://keycloak:8080/auth}"
REALM="${KC_REALM:-loyertracker}"
CLIENT_ID="${KC_SPA_CLIENT_ID:-loyertracker-spa}"
HOST="${APP_PUBLIC_HOST:?APP_PUBLIC_HOST requis}"

# Garde-fou : un nom d'hôte DNS valide, sans schéma, chemin ni caractère de contrôle.
[[ "$HOST" =~ ^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$ ]] \
  || { echo "[host-init] APP_PUBLIC_HOST invalide" >&2; exit 1; }

echo "[host-init] Connexion à l'API d'admin Keycloak (${SERVER})..."
for i in $(seq 1 30); do
  if "$KCADM" config credentials --server "$SERVER" --realm master \
       --user "$KEYCLOAK_ADMIN" --password "$KEYCLOAK_ADMIN_PASSWORD" >/dev/null 2>&1; then
    break
  fi
  echo "[host-init] Keycloak pas encore prêt — nouvelle tentative ($i/30)..."
  sleep 5
done

ID="$("$KCADM" get clients -r "$REALM" -q "clientId=${CLIENT_ID}" --fields id --format csv --noquotes | head -n1)"
[ -n "$ID" ] || { echo "[host-init] client ${CLIENT_ID} introuvable" >&2; exit 1; }

echo "[host-init] Restriction de ${CLIENT_ID} à https://${HOST}..."
"$KCADM" update "clients/${ID}" -r "$REALM" \
  -s "rootUrl=https://${HOST}" \
  -s "baseUrl=/" \
  -s "redirectUris=[\"https://${HOST}/*\"]" \
  -s "webOrigins=[\"https://${HOST}\"]"

echo "[host-init] Redirect URIs et web origins limités à https://${HOST}. Terminé."
