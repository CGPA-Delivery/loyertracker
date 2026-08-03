#!/usr/bin/env bash
# One-shot, après import du realm : active le thème `loyertracker` sur le realm, sans jamais
# modifier les fichiers de realm versionnés (realm-loyertracker.json,
# realm-loyertracker-production.json). Le Plan d'Exécution (§3 « Lot 4 ») pose comme prérequis
# bloquant « aucune modification des flux OIDC/PKCE ni des fichiers de realm » — cette activation
# passe donc exclusivement par l'API Admin (kcadm.sh), même mécanisme que
# bootstrap-test-account.sh pour les secrets, jamais par une édition du JSON versionné.
#
# Décorrélé de bootstrap-test-account.sh (qui gère un compte de test absent en Production) :
# ce script ne dépend d'aucun utilisateur ni secret applicatif, seulement du realm lui-même —
# utilisable identiquement en Dev, Staging et Production.
#
# Idempotent : ré-exécutable sans effet de bord (repositionne simplement la même valeur).
set -euo pipefail

KCADM=/opt/keycloak/bin/kcadm.sh
SERVER="${KC_INIT_SERVER:-http://keycloak:8080/auth}"
REALM="${KC_REALM:-loyertracker}"
THEME=loyertracker

echo "[theme-init] Connexion à l'API d'admin Keycloak (${SERVER})..."
for i in $(seq 1 30); do
  if "$KCADM" config credentials --server "$SERVER" --realm master \
       --user "$KEYCLOAK_ADMIN" --password "$KEYCLOAK_ADMIN_PASSWORD" >/dev/null 2>&1; then
    break
  fi
  echo "[theme-init] Keycloak pas encore prêt — nouvelle tentative ($i/30)..."
  sleep 5
done

echo "[theme-init] Activation du thème '${THEME}' (loginTheme) sur le realm ${REALM}..."
"$KCADM" update "realms/${REALM}" -s "loginTheme=${THEME}"

echo "[theme-init] Thème de login activé. Terminé."
