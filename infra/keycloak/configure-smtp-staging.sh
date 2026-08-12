#!/usr/bin/env bash
# configure-smtp-staging.sh — Configure SMTP Keycloak vers Resend pour l'environnement Staging.
#
# Prérequis :
#   - Keycloak healthy (dépendance de service dans docker-compose.staging.yml)
#   - Variables d'environnement : KEYCLOAK_ADMIN, KEYCLOAK_ADMIN_PASSWORD,
#     KC_SMTP_HOST, KC_SMTP_PORT, KC_SMTP_USER, KC_SMTP_PASSWORD,
#     KC_SMTP_FROM, KC_SMTP_FROM_DISPLAY, KC_SMTP_REPLY_TO
#
# Idempotent : ré-exécutable sans effet de bord (repositionne les mêmes valeurs).
# Résout DD-EP17-14 (HTTP 500 + canal d'énumération de comptes).
set -euo pipefail

KCADM=/opt/keycloak/bin/kcadm.sh
SERVER="${KC_INIT_SERVER:-http://keycloak:8080/auth}"
REALM="${KC_REALM:-loyertracker}"

echo "[smtp-staging] Connexion à l'API d'admin Keycloak (${SERVER})..."
for i in $(seq 1 30); do
  if "$KCADM" config credentials --server "$SERVER" --realm master \
       --user "$KEYCLOAK_ADMIN" --password "$KEYCLOAK_ADMIN_PASSWORD" >/dev/null 2>&1; then
    break
  fi
  echo "[smtp-staging] Keycloak pas encore prêt — nouvelle tentative ($i/30)..."
  sleep 5
done

echo "[smtp-staging] Configuration SMTP du realm ${REALM} vers Resend (${KC_SMTP_HOST}:${KC_SMTP_PORT})..."
"$KCADM" update "realms/${REALM}" \
  -s "smtpServer.host=${KC_SMTP_HOST}" \
  -s "smtpServer.port=${KC_SMTP_PORT}" \
  -s "smtpServer.from=${KC_SMTP_FROM}" \
  -s "smtpServer.fromDisplayName=${KC_SMTP_FROM_DISPLAY:-LoyerTracker}" \
  -s "smtpServer.replyTo=${KC_SMTP_REPLY_TO:-${KC_SMTP_FROM}}" \
  -s "smtpServer.replyToDisplayName=${KC_SMTP_FROM_DISPLAY:-LoyerTracker}" \
  -s "smtpServer.auth=true" \
  -s "smtpServer.user=${KC_SMTP_USER}" \
  -s "smtpServer.password=${KC_SMTP_PASSWORD}" \
  -s "smtpServer.ssl=false" \
  -s "smtpServer.starttls=true"

echo "[smtp-staging] SMTP Resend configuré. Vérification..."
# Vérification : relire la config pour confirmer (sans exposer le mot de passe)
"$KCADM" get "realms/${REALM}" --fields smtpServer | grep -v '"password"'

echo "[smtp-staging] Terminé — SMTP Resend actif pour le realm ${REALM}."
