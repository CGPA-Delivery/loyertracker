#!/usr/bin/env bash
# configure-smtp-staging.sh — Configure SMTP Keycloak vers Amazon SES Mail Manager pour Staging.
#
# Prérequis :
#   - Keycloak healthy (dépendance de service dans docker-compose.staging.yml)
#   - Variables d'environnement : KEYCLOAK_ADMIN, KEYCLOAK_ADMIN_PASSWORD,
#     KC_SMTP_HOST, KC_SMTP_PORT, KC_SMTP_USER, KC_SMTP_PASSWORD,
#     KC_SMTP_FROM, KC_SMTP_FROM_DISPLAY, KC_SMTP_REPLY_TO
#
# Idempotent : ré-exécutable sans effet de bord (repositionne les mêmes valeurs).
# Résout DD-EP17-14 (HTTP 500 + canal d'énumération de comptes).
# Utilise Amazon SES Mail Manager (port 587, STARTTLS) — PAS l'API REST Resend.
# Credentials : fichier local protégé sous /home/ubuntu/INFRASTRUCTURE/SES_MAIL/ (jamais versionné).
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

json_escape() {
  printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e 's/\r/\\r/g' -e ':a' -e 'N' -e '$!ba' -e 's/\n/\\n/g'
}

# Keycloak 24 ne sérialise pas de manière fiable smtpServer.* via les options -s.
# Envoyer l'objet smtpServer atomiquement ; aucun endpoint ni credential n'est journalisé.
SMTP_UPDATE="$(mktemp)"
trap 'rm -f "$SMTP_UPDATE"' EXIT
cat >"$SMTP_UPDATE" <<EOF
{"smtpServer":{"host":"$(json_escape "$KC_SMTP_HOST")","port":"$(json_escape "$KC_SMTP_PORT")","from":"$(json_escape "$KC_SMTP_FROM")","fromDisplayName":"$(json_escape "${KC_SMTP_FROM_DISPLAY:-LoyerTracker}")","replyTo":"$(json_escape "${KC_SMTP_REPLY_TO:-${KC_SMTP_FROM}}")","replyToDisplayName":"$(json_escape "${KC_SMTP_FROM_DISPLAY:-LoyerTracker}")","auth":"true","user":"$(json_escape "$KC_SMTP_USER")","password":"$(json_escape "$KC_SMTP_PASSWORD")","ssl":"false","starttls":"true"}}
EOF

echo "[smtp-staging] Application atomique SMTP au realm ${REALM}..."
"$KCADM" update "realms/${REALM}" -f "$SMTP_UPDATE"

echo "[smtp-staging] Vérification runtime (secret filtré)..."
# Keycloak 24 peut masquer smtpServer avec --fields ; relire le realm complet et filtrer le secret.
SMTP_JSON="$("$KCADM" get "realms/${REALM}")"
for key in host port from auth user ssl starttls; do
  grep -q "\"${key}\"" <<<"$SMTP_JSON" || {
    echo "[smtp-staging] ERREUR : smtpServer incomplet : ${key}" >&2
    exit 1
  }
done
printf '[smtp-staging] smtpServer configuré ; clés vérifiées=host,port,from,auth,user,ssl,starttls\n'

echo "[smtp-staging] Terminé — SMTP SES actif pour le realm ${REALM}."
