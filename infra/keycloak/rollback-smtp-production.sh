#!/usr/bin/env bash
# rollback-smtp-production.sh — rollback ciblé SMTP Keycloak Production (DD-EP17-14).
# Exécuter seulement sur instruction CDO/Release Manager : efface smtpServer du realm.
# Ne touche ni aux images, ni aux services, ni aux volumes, ni aux données PostgreSQL.
set -euo pipefail

: "${KC_PRODUCTION_CHANGE_ID:?Définir identifiant changement Production a annuler}"
: "${KEYCLOAK_ADMIN:?KEYCLOAK_ADMIN requis}"
: "${KEYCLOAK_ADMIN_PASSWORD:?KEYCLOAK_ADMIN_PASSWORD requis}"

KCADM=/opt/keycloak/bin/kcadm.sh
SERVER="${KC_INIT_SERVER:-http://keycloak:8080/auth}"
REALM="${KC_REALM:-loyertracker}"

printf '[smtp-production-rollback] Change=%s; connexion Admin Keycloak (%s)...\n' \
  "$KC_PRODUCTION_CHANGE_ID" "$SERVER"
"$KCADM" config credentials --server "$SERVER" --realm master \
  --user "$KEYCLOAK_ADMIN" --password "$KEYCLOAK_ADMIN_PASSWORD" >/dev/null

# Keycloak 24 ne sérialise pas de manière fiable les clés smtpServer.* avec -s.
# L'objet SMTP est donc remplacé atomiquement par un objet vide.
echo '[smtp-production-rollback] Effacement atomique de smtpServer...'
ROLLBACK_UPDATE="$(mktemp)"
trap 'rm -f "$ROLLBACK_UPDATE"' EXIT
printf '%s\n' '{"smtpServer":{}}' > "$ROLLBACK_UPDATE"
"$KCADM" update "realms/${REALM}" -f "$ROLLBACK_UPDATE"

# Lire le realm complet : --fields smtpServer peut masquer ce sous-objet avec KC 24.
# Vérifier uniquement le sous-objet smtpServer, pas des champs homonymes du realm entier.
SMTP_JSON="$("$KCADM" get "realms/${REALM}")"
SMTP_KEYS="$(printf '%s' "$SMTP_JSON" | jq -r '.smtpServer // {} | keys[]?')"
if [[ -n "$SMTP_KEYS" ]]; then
  echo '[smtp-production-rollback] ERREUR : smtpServer contient encore des champs.' >&2
  exit 1
fi
printf '[smtp-production-rollback] Rollback confirmé : smtpServer={}\n'
