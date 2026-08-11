#!/usr/bin/env bash
# One-shot CI uniquement : configure SMTP Keycloak vers Mailpit après l'import du realm.
# Mailpit écoute sur mailpit:1025 (réseau Docker interne), sans auth ni TLS.
# Profil `ci` uniquement — jamais exécuté en dev local, Staging ou Production.
#
# Idempotent : ré-exécutable sans effet de bord (repositionne simplement les mêmes valeurs).
set -euo pipefail

KCADM=/opt/keycloak/bin/kcadm.sh
SERVER="${KC_INIT_SERVER:-http://keycloak:8080/auth}"
REALM="${KC_REALM:-loyertracker}"

echo "[smtp-init] Connexion à l'API d'admin Keycloak (${SERVER})..."
for i in $(seq 1 30); do
  if "$KCADM" config credentials --server "$SERVER" --realm master \
       --user "$KEYCLOAK_ADMIN" --password "$KEYCLOAK_ADMIN_PASSWORD" >/dev/null 2>&1; then
    break
  fi
  echo "[smtp-init] Keycloak pas encore prêt — nouvelle tentative ($i/30)..."
  sleep 5
done

echo "[smtp-init] Configuration SMTP du realm ${REALM} vers Mailpit (mailpit:1025)..."
"$KCADM" update "realms/${REALM}" \
  -s 'smtpServer.host=mailpit' \
  -s 'smtpServer.port=1025' \
  -s 'smtpServer.from=noreply@loyertracker.test' \
  -s 'smtpServer.fromDisplayName=LoyerTracker CI' \
  -s 'smtpServer.replyTo=noreply@loyertracker.test' \
  -s 'smtpServer.replyToDisplayName=LoyerTracker CI' \
  -s 'smtpServer.auth=false' \
  -s 'smtpServer.ssl=false' \
  -s 'smtpServer.starttls=false'

echo "[smtp-init] SMTP configuré. Terminé."
