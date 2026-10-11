#!/usr/bin/env bash
# PROPOSÉ — NON EXÉCUTÉ. Génère /srv/loyertracker/env/.env avec des secrets NEUFS, sur l'hôte.
# Aucun secret n'est affiché, journalisé ni versionné ; aucune valeur n'est reprise d'un autre hôte
# (ai-test-server, srv2011505 : secrets à considérer exposés). Les canaux externes restent FERMÉS (K8, ADR-18).
#
# Usage : sudo EXPECTED_HOSTNAME=srv2050514 APP_PUBLIC_HOST=loyertracker.staging.tshilo.dev \
#         API_IMAGE_REF=ghcr.io/...@sha256:... WEB_IMAGE_REF=ghcr.io/...@sha256:... ./gen-env.sh
set -euo pipefail

ENV_DIR="/srv/loyertracker/env"
OWNER="stg-loyertracker"

die() { printf '[gen-env] ERREUR: %s\n' "$*" >&2; exit 1; }
[ "$(id -u)" -eq 0 ] || die "à exécuter en root (sudo)"
[ -n "${EXPECTED_HOSTNAME:-}" ] && [ "$(hostname -s)" = "$EXPECTED_HOSTNAME" ] || die "hôte inattendu : abandon"
HOST="${APP_PUBLIC_HOST:?APP_PUBLIC_HOST requis}"
API="${API_IMAGE_REF:?API_IMAGE_REF requis (digest)}"
WEB="${WEB_IMAGE_REF:?WEB_IMAGE_REF requis (digest)}"
[[ "$HOST" =~ ^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$ ]] || die "APP_PUBLIC_HOST invalide"
[[ "$API" == *@sha256:* && "$WEB" == *@sha256:* ]] || die "références d'image : digest sha256 exigé (jamais de tag)"
id "$OWNER" >/dev/null 2>&1 || die "utilisateur $OWNER absent (onboarding §3)"
[ ! -e "$ENV_DIR/.env" ] || die "$ENV_DIR/.env existe déjà : refus d'écraser (rotation = procédure dédiée)"

install -d -m 700 -o "$OWNER" -g "$OWNER" "$ENV_DIR"
umask 077
sec() { openssl rand -hex 24; }
tmp="$(mktemp "$ENV_DIR/.env.XXXXXX")"
{
  echo "# Généré le $(date -u +%Y-%m-%dT%H:%M:%SZ) sur $(hostname -s). NE PAS COMMITER. Rotation : procédure dédiée."
  echo "APP_PUBLIC_HOST=$HOST"
  echo "POSTGRES_DB=loyertracker"
  echo "POSTGRES_USER=loyertracker"
  echo "POSTGRES_PASSWORD=$(sec)"
  echo "DB_APP_USER=loyertracker_api"
  echo "DB_APP_PASSWORD=$(sec)"
  echo "DB_BATCH_USER=loyertracker_batch"
  echo "DB_BATCH_PASSWORD=$(sec)"
  echo "KEYCLOAK_ISSUER_URI=https://$HOST/auth/realms/loyertracker"
  echo "KEYCLOAK_JWK_SET_URI=http://keycloak:8080/auth/realms/loyertracker/protocol/openid-connect/certs"
  echo "KEYCLOAK_ADMIN_BASE_URL=http://keycloak:8080/auth"
  echo "KEYCLOAK_REALM=loyertracker"
  echo "KEYCLOAK_API_CLIENT_ID=loyertracker-admin"
  echo "KEYCLOAK_ADMIN=admin"
  echo "KEYCLOAK_ADMIN_PASSWORD=$(sec)"
  echo "KEYCLOAK_API_CLIENT_SECRET=$(sec)"
  echo "KEYCLOAK_TEST_BAILLEUR_PASSWORD=$(sec)"
  echo "KC_HOSTNAME=$HOST"
  echo "APP_CORS_ALLOWED_ORIGIN=https://$HOST"
  echo "APP_INVITATION_BASE_URL=https://$HOST"
  echo "QUITTANCE_HMAC_SECRET=$(openssl rand -hex 32)"
  echo "QUITTANCE_TOKEN_KID=1"
  echo "QUITTANCE_VERIFY_BASE_URL=https://$HOST"
  echo "TWILIO_STATUS_CALLBACK_BASE_URL=https://$HOST"
  echo "# Canaux externes FERMÉS (K8, ADR-18) : toute ouverture exige un Gate explicite."
  echo "NOTIFICATIONS_EXTERNAL_ENABLED=false"
  echo "TWILIO_WHATSAPP_ENABLED=false"
  echo "TWILIO_SMS_ENABLED=false"
  echo "NOTIFICATION_DRY_RUN=true"
  echo "NOTIFICATION_FALLBACK_ENABLED=false"
  echo "NOTIFICATION_BUDGET_MENSUEL_MAX=0"
  echo "RESEND_EMAIL_ENABLED=false"
  echo "API_IMAGE_REF=$API"
  echo "WEB_IMAGE_REF=$WEB"
} >"$tmp"
chown "$OWNER:$OWNER" "$tmp"
chmod 600 "$tmp"
mv "$tmp" "$ENV_DIR/.env"
printf '[gen-env] %s créé (0600, %s) : %s lignes, aucun secret affiché.\n' "$ENV_DIR/.env" "$OWNER" "$(wc -l <"$ENV_DIR/.env")"
