#!/usr/bin/env bash
# rollback-smtp-production.sh — rollback ciblé SMTP Keycloak Production (DD-EP17-14).
# Exécuter seulement sur instruction CDO/Release Manager : il efface la configuration
# smtpServer du realm et rétablit le comportement pré-changement. Ne touche pas aux images,
# services, volumes ou données PostgreSQL.
set -euo pipefail

: "${KC_PRODUCTION_CHANGE_ID:?Définir l'identifiant de changement Production à annuler}"
: "${KEYCLOAK_ADMIN:?KEYCLOAK_ADMIN requis}"
: "${KEYCLOAK_ADMIN_PASSWORD:?KEYCLOAK_ADMIN_PASSWORD requis}"

KCADM=/opt/keycloak/bin/kcadm.sh
SERVER="${KC_INIT_SERVER:-http://keycloak:8080/auth}"
REALM="${KC_REALM:-loyertracker}"

printf '[smtp-production-rollback] Change=%s; connexion Admin Keycloak (%s)...\n' \
  "$KC_PRODUCTION_CHANGE_ID" "$SERVER"
"$KCADM" config credentials --server "$SERVER" --realm master \
  --user "$KEYCLOAK_ADMIN" --password "$KEYCLOAK_ADMIN_PASSWORD"

# Keycloak Admin API : un objet vide efface la configuration SMTP du realm.
echo '[smtp-production-rollback] Effacement ciblé de smtpServer...'
"$KCADM" update "realms/${REALM}" -s 'smtpServer={}'

SMTP_JSON="$("$KCADM" get "realms/${REALM}" --fields smtpServer)"
if grep -qE '"host"|"password"|"user"' <<<"$SMTP_JSON"; then
  echo '[smtp-production-rollback] ERREUR : smtpServer contient encore des champs.' >&2
  exit 1
fi
printf '[smtp-production-rollback] Rollback confirmé : %s\n' "$SMTP_JSON"
