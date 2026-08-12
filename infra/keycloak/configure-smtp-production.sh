#!/usr/bin/env bash
# configure-smtp-production.sh — Configure de manière ciblée le SMTP du realm
# Keycloak Production vers Amazon SES Mail Manager (DD-EP17-14).
#
# Ce script est un one-shot manuel derrière le profil Compose `production-smtp`.
# Il ne redémarre ni API, ni Nginx, ni PostgreSQL et ne crée aucune image.
# Les secrets sont injectés uniquement par l'environnement de l'hôte Production.
set -euo pipefail

: "${KC_PRODUCTION_CHANGE_ID:?Définir un identifiant de changement approuvé pour Production}"
: "${KEYCLOAK_ADMIN:?KEYCLOAK_ADMIN requis}"
: "${KEYCLOAK_ADMIN_PASSWORD:?KEYCLOAK_ADMIN_PASSWORD requis}"
: "${KC_SMTP_HOST:?KC_SMTP_HOST requis}"
: "${KC_SMTP_PORT:?KC_SMTP_PORT requis}"
: "${KC_SMTP_USER:?KC_SMTP_USER requis}"
: "${KC_SMTP_PASSWORD:?KC_SMTP_PASSWORD requis}"
: "${KC_SMTP_FROM:?KC_SMTP_FROM requis}"

KCADM=/opt/keycloak/bin/kcadm.sh
SERVER="${KC_INIT_SERVER:-http://keycloak:8080/auth}"
REALM="${KC_REALM:-loyertracker}"

printf '[smtp-production] Change=%s; connexion Admin Keycloak (%s)...\n' \
  "$KC_PRODUCTION_CHANGE_ID" "$SERVER"
for i in $(seq 1 30); do
  if "$KCADM" config credentials --server "$SERVER" --realm master \
      --user "$KEYCLOAK_ADMIN" --password "$KEYCLOAK_ADMIN_PASSWORD" >/dev/null 2>&1; then
    break
  fi
  if [[ "$i" == 30 ]]; then
    echo '[smtp-production] ERREUR : authentification Admin Keycloak indisponible.' >&2
    exit 1
  fi
  sleep 5
done

echo '[smtp-production] Application SMTP SES Mail Manager au realm Production...'
"$KCADM" update "realms/${REALM}" \
  -s "smtpServer.host=${KC_SMTP_HOST}" \
  -s "smtpServer.port=${KC_SMTP_PORT}" \
  -s "smtpServer.from=${KC_SMTP_FROM}" \
  -s "smtpServer.fromDisplayName=${KC_SMTP_FROM_DISPLAY:-LoyerTracker}" \
  -s "smtpServer.replyTo=${KC_SMTP_REPLY_TO:-${KC_SMTP_FROM}}" \
  -s "smtpServer.replyToDisplayName=${KC_SMTP_FROM_DISPLAY:-LoyerTracker}" \
  -s 'smtpServer.auth=true' \
  -s "smtpServer.user=${KC_SMTP_USER}" \
  -s "smtpServer.password=${KC_SMTP_PASSWORD}" \
  -s 'smtpServer.ssl=false' \
  -s 'smtpServer.starttls=true'

echo '[smtp-production] Vérification runtime (secret filtré)...'
"$KCADM" get "realms/${REALM}" --fields smtpServer | grep -v '"password"'
echo '[smtp-production] Terminé — exécuter les tests fonctionnels et anti-énumération avant de conclure le Gate.'
