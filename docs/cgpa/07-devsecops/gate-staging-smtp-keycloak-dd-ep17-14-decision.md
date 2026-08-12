# Gate Staging — Correctif SMTP Keycloak (DD-EP17-14)

| Champ | Valeur |
|---|---|
| Date | 2026-08-12 |
| Auteur | CDO / Enterprise Architect |
| Référence | `fix/smtp-keycloak-dd-ep17-14`, PR #455 |
| Dette | DD-EP17-14 — HTTP 500 mot de passe oublié + canal d'énumération |
| Criticité | **P0** — défaut de Production actif |
| Statut | **En attente de merge PR #455 + déploiement Staging** |

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
| Script SMTP | `infra/keycloak/configure-smtp-staging.sh` | Configure SMTP Keycloak vers Resend (STARTTLS, port 587, auth API key) |
| Service Compose | `docker-compose.staging.yml` → `keycloak-smtp-init` | One-shot idempotent, exécuté après `keycloak` healthy |
| Variables | `.env.example` → section `KC_SMTP_*` | Documentées, `CHANGE_ME`, jamais versionnées |

**Fournisseur SMTP** : Resend (`smtp.resend.com:587`, STARTTLS, auth = clé API Resend).

**Expéditeur** : `noreply@loyertracker.org` (domaine déjà vérifié DKIM/SPF/DMARC).

---

## 3. Prérequis Staging

| # | Condition | Statut |
|---|---|---|
| P1 | PR #455 mergée sur `main` | ⬜ En attente |
| P2 | `KC_SMTP_PASSWORD` renseigné dans `.env` Staging (clé API Resend) | ⬜ À faire (hors dépôt) |
| P3 | `STG-ISOL-01` exécuté avant/après | ⬜ À exécuter |
| P4 | Backup DB Staging pré-déploiement | ⬜ À exécuter |
| P5 | `docker compose config` confirme propagation `KC_SMTP_*` | ⬜ À vérifier |

---

## 4. Plan de test Staging

| # | Test | Critère PASS |
|---|---|---|
| T1 | `keycloak-smtp-init` exit 0 | Service one-shot terminé sans erreur |
| T2 | Vérification config SMTP | `kcadm.sh get realms/loyertracker --fields smtpServer` retourne host/port/from (sans password) |
| T3 | Mot de passe oublié — compte existant | HTTP 200, message générique « Vous devriez recevoir un email… » |
| T4 | Mot de passe oublié — compte inexistant | HTTP 200, **même message générique** (anti-énumération) |
| T5 | Réception email réelle | Email reçu dans Mailpit (Dev) ou boîte de test (Staging) avec lien action-token valide |
| T6 | Smoke stack complet | `smoke-stack.sh` 63/0 PASS |

---

## 5. Décision

**GO proposé sous réserve** — conditionné à :
1. Merge PR #455 + CI verte
2. `KC_SMTP_PASSWORD` renseigné sur l'hôte Staging
3. STG-ISOL-01 PASS
4. Tests T1-T6 PASS
5. Aucune régression smoke

**Note** : ce Gate Staging est un prérequis au Gate Production. Aucune promotion Production sans Gate distinct.
