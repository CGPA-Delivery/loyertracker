# Gate Staging — Correctif SMTP Keycloak (DD-EP17-14)

| Champ | Valeur |
|---|---|
| Date | 2026-08-12 |
| Auteur | CDO / Enterprise Architect |
| Référence | PR #456 (`fix/smtp-keycloak-ses-dd-ep17-14`) — remplace PR #455 (configuration Resend SMTP erronée) |
| Dette | DD-EP17-14 — HTTP 500 mot de passe oublié + canal d'énumération |
| Criticité | **P0** — défaut de Production actif |
| Statut | **GO Staging — validation fonctionnelle PO/CDO (2026-08-12)** |

---

## 1. Contexte

Le flux « mot de passe oublié » Keycloak est en échec fonctionnel sur tous les environnements (Dev, Staging, Production) car aucune configuration SMTP n'est présente. Le constat est double :

1. **HTTP 500** : soumission du formulaire pour un utilisateur existant → `Failed to send email`
2. **Canal d'énumération** : e-mail inexistant → HTTP 200 (message générique), e-mail existant → HTTP 500 (le code de statut révèle l'existence du compte)

La résolution SMTP ferme les deux problèmes simultanément.

---

## 2. Solution déployée

| Composant | Fichier | Rôle |
|---|---|---|
| Script SMTP | `infra/keycloak/configure-smtp-staging.sh` | Configure SMTP Keycloak vers **Amazon SES Mail Manager** (STARTTLS, port 587, auth SMTP) |
| Service Compose | `docker-compose.staging.yml` → `keycloak-smtp-init` | One-shot idempotent, exécuté après `keycloak` healthy |
| Variables | `.env.example` → section `KC_SMTP_*` | Documentées, `CHANGE_ME`, jamais versionnées |

**Fournisseur SMTP** : **Amazon SES Mail Manager** (endpoint SMTP dédié, port `587`, STARTTLS, authentification SMTP).

**Expéditeur** : `noreply@loyertracker.org` (domaine déjà vérifié DKIM/SPF/DMARC).

---

## 3. Prérequis Staging

| # | Condition | Statut |
|---|---|---|
| P1 | PR #456 mergée sur `main` | ✅ |
| P2 | `KC_SMTP_PASSWORD` renseigné dans `.env` Staging (secret SMTP SES) | ✅ (hors dépôt) |
| P3 | Isolation ciblée Staging : exécution one-shot sans arrêt/recréation des autres services | ✅ |
| P4 | `docker compose config` / exécution contrôlée | ✅ `keycloak-smtp-init` exit 0 |
| P5 | Configuration runtime realm confirmée via API Admin | ✅ host/port/from/auth/STARTTLS présents, secret non exposé |

---

## 4. Exécution et preuve Staging

| # | Test | Résultat |
|---|---|---|
| T1 | `keycloak-smtp-init` | ✅ Exit 0, configuration appliquée de façon ciblée |
| T2 | Vérification runtime realm | ✅ `smtpServer` contient hôte SES Mail Manager, port 587, expéditeur, authentification et STARTTLS ; secret non exposé |
| T3 | Mot de passe oublié — parcours réel Staging | ✅ **PASS**, validé manuellement par Jordan Tshilombo (PO/CDO) sur Staging, 2026-08-12 |
| T4 | Anti-énumération compte existant / inexistant | ⏳ À confirmer par test comparatif dédié (non déclaré dans la validation manuelle) |
| T5 | Réception e-mail et action-token | ✅ Incluse dans la validation fonctionnelle déclarée « test de mot de passe oublié OK » par le PO/CDO |
| T6 | Santé applicative post-configuration | ✅ Keycloak healthy ; aucun arrêt ni recréation des services Staging non ciblés |

> **Portée de la validation humaine :** le PO/CDO confirme l'exécution réussie du parcours réel « Mot de passe oublié » en Staging. Cette preuve fonctionnelle couvre le parcours déclaré et la réception/action de l'e-mail ; les secrets SMTP et le contenu de l'e-mail ne sont pas consignés dans le dépôt. Le test différentiel anti-énumération reste une preuve de sécurité distincte à consigner avant le Gate Production.

---

## 5. Décision

**GO Staging sous réserve de sécurité — flux DD-EP17-14 fonctionnellement validé en Staging.** Le défaut SMTP est corrigé et le flux est validé par le PO/CDO. Le déploiement ne touche que la configuration du realm Keycloak Staging et son `.env` local ; les images applicatives, la base de données et les autres services mutualisés restent inchangés.

### Étape suivante obligatoire

Avant tout Gate Production : exécuter et consigner le test comparatif **compte existant / inexistant** (code HTTP et message identiques) afin de prouver la fermeture du canal d'énumération, puis préparer un **Gate Production distinct**. Celui-ci devra vérifier la configuration SMTP Production, appliquer la même configuration via un déploiement ciblé, exécuter le test fonctionnel avec un compte Production de test autorisé, puis obtenir une décision GO Production explicite. **Aucune promotion automatique.**
