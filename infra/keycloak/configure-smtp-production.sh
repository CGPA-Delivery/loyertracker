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

json_escape() {
  # Valeurs SMTP converties en chaîne JSON sans journaliser les secrets.
  printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e 's/\r/\\r/g' -e ':a' -e 'N' -e '$!ba' -e 's/\n/\\n/g'
}

SMTP_UPDATE="$(mktemp)"
trap 'rm -f "$SMTP_UPDATE"' EXIT
cat >"$SMTP_UPDATE" <<EOF
{"smtpServer":{"host":"$(json_escape "$KC_SMTP_HOST")","port":"$(json_escape "$KC_SMTP_PORT")","from":"$(json_escape "$KC_SMTP_FROM")","fromDisplayName":"$(json_escape "${KC_SMTP_FROM_DISPLAY:-LoyerTracker}")","replyTo":"$(json_escape "${KC_SMTP_REPLY_TO:-${KC_SMTP_FROM}}")","replyToDisplayName":"$(json_escape "${KC_SMTP_FROM_DISPLAY:-LoyerTracker}")","auth":"true","user":"$(json_escape "$KC_SMTP_USER")","password":"$(json_escape "$KC_SMTP_PASSWORD")","ssl":"false","starttls":"true"}}
EOF

# Le RealmRepresentation doit être envoyé avec smtpServer comme objet atomique : les -s
# imbriqués sont sérialisés de manière non fiable par kcadm/Keycloak 24.
echo '[smtp-production] Application atomique SMTP SES Mail Manager au realm Production...'
"$KCADM" update "realms/${REALM}" -f "$SMTP_UPDATE"

echo '[smtp-production] Vérification runtime (secret filtré)...'
# Keycloak 24 peut masquer smtpServer avec --fields ; lire le realm complet.
SMTP_JSON="$("$KCADM" get "realms/${REALM}")"
for key in host port from auth user ssl starttls; do
  grep -q "\"${key}\"" <<<"$SMTP_JSON" || {
    echo "[smtp-production] ERREUR : smtpServer incomplet : ${key}" >&2
    exit 1
  }
done
printf '[smtp-production] smtpServer configuré ; clés vérifiées=host,port,from,auth,user,ssl,starttls\n'
echo '[smtp-production] Terminé — exécuter les tests fonctionnels et anti-énumération avant de conclure le Gate.'
