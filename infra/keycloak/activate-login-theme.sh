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
#
# DD-EP17-13 (2026-08-03) : active aussi la locale française sur le realm — Keycloak 24.0.5
# embarque déjà une traduction française complète des 6 écrans du Lot 4 dans son thème par défaut
# (`messages_fr.properties`, vérifié dans l'image réelle), donc aucun fichier `messages_fr.properties`
# n'est ajouté à `infra/keycloak/themes/loyertracker/` — le vrai défaut était que
# `internationalizationEnabled` n'était jamais activé sur le realm (absent des deux fichiers de
# realm versionnés). Une seule locale supportée (`fr`) plutôt que `["en","fr"]` : le reste du
# produit (Angular) n'a aucun sélecteur de langue, cohérence attendue ; avec une seule locale
# supportée, `template.ftl` du thème hérité n'affiche d'ailleurs aucun sélecteur de langue non plus
# (`locale.supported?size gt 1`, vérifié dans le thème réel).
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

echo "[theme-init] Activation de la locale française (fr, seule locale supportée) sur le realm ${REALM}..."
"$KCADM" update "realms/${REALM}" \
  -s internationalizationEnabled=true \
  -s 'supportedLocales=["fr"]' \
  -s defaultLocale=fr

echo "[theme-init] Thème de login et locale française activés. Terminé."
