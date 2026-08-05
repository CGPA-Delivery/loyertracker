# Gate Staging EP-18 — Canal EMAIL via Resend

| Champ | Valeur |
|---|---|
| Date d'exécution | 2026-08-05 |
| Cadre | CGPA v6.1.1 — Enterprise Delivery Governance |
| Périmètre | EP-18 — Canal EMAIL via Resend, invitation gestionnaire par e-mail, webhook Resend/Svix |
| Hôte Staging | `ai-test-server` (`172.31.11.102`) |
| Candidat dépôt | `dbded12c00065bf757da68e59aff35710f952a1b` — PR #370 incluse |
| Candidat applicatif déployé | API/Web issus de `sha-8c9f1e4a` par digest GHCR |
| API digest | `ghcr.io/jptshilombo/loyertracker-api@sha256:2522ae210603cb94efc03ce5f8053a0c20b2c10e81ff6c48cde62b3c53232d60` |
| Web digest | `ghcr.io/jptshilombo/loyertracker-web@sha256:9be1a4cd8b0b27d3b868e69481e7255ecbd1c3c47251875136d1ea897727c359` |
| Décision | **NO GO — validation Resend réelle refusée par le fournisseur (`HTTP 401`)** |

## 1. Objet

Ce document statue le Gate Staging EP-18 après fusion de l'intégration repository EP-18 (#368),
clôture de gouvernance (#369), puis correction du câblage Compose Resend (#370).

Le Gate vérifie si EP-18 peut être considéré validé en Staging avec envoi EMAIL Resend réel et
webhook Resend/Svix réel. Il n'autorise aucune Production.

## 2. Préconditions CI/CD

| Contrôle | Résultat | Preuve |
|---|---:|---|
| PR #368 intégration EP-18 | ✅ MERGED | `8c9f1e4aaa2a57946af841bbccd052f38fd471be` |
| PR #369 clôture d'intégration | ✅ MERGED | `a3f43e7b3a4ef67b81ac9294bef8b0d9e02c102e` |
| PR #370 câblage Compose Resend | ✅ MERGED | `dbded12c00065bf757da68e59aff35710f952a1b` |
| CI `main` post-#370 | ✅ SUCCESS | run `31018163221` |
| CodeQL `main` post-#370 | ✅ SUCCESS | run `31018163142` |
| Registry Policy `main` post-#370 | ✅ SUCCESS | run `31018169546` |
| CGPA Framework Audit `main` post-#370 | ✅ SUCCESS | run `31018163292` |
| Artefacts GHCR EP-18 | ✅ Disponibles | tag `sha-8c9f1e4a`, digests ci-dessus |

## 3. Correction préalable obligatoire exécutée

Pendant la pré-instruction du Gate, un bloqueur a été découvert : les variables Resend étaient lues
par l'application mais non transmises au conteneur `api` par Compose.

Correction : PR #370 — `fix(devops): transmettre la configuration Resend aux conteneurs`.

Résultat : `docker compose config` confirme la propagation de `RESEND_EMAIL_ENABLED`,
`RESEND_API_KEY`, `RESEND_FROM_EMAIL` et `RESEND_WEBHOOK_SECRET` au service `api`. Les secrets n'ont
jamais été imprimés ni committés ; seuls présence/longueur et statut `SET` ont été contrôlés.

## 4. STG-ISOL-01 et sauvegarde

| Contrôle | Avant | Après |
|---|---:|---:|
| Conteneurs totaux hôte | 9 | 9 |
| Conteneurs `loyertracker-staging-*` | 8 | 8 |
| Réseaux Docker | 5 | 5 |
| Volumes Docker | 28 | 28 |
| `nginx-proxy-manager` | ✅ Up | ✅ Up |
| Services recréés | — | `api`, `nginx`, puis `api` seul pour kill-switch sécurité |
| Services non ciblés | — | `postgres`, `keycloak`, monitoring, NPM non recréés |

Sauvegarde pré-déploiement exécutée : `loyertracker-20260805-161025.dump`, vérifiée par
`pg_restore --list`, taille 548K, heartbeat Pushgateway poussé.

## 5. Déploiement Staging EP-18

Déploiement ciblé exécuté sur `ai-test-server` :

```bash
docker compose --env-file .env -f docker-compose.staging.yml pull api nginx
docker compose --env-file .env -f docker-compose.staging.yml up -d api nginx
```

Résultat technique :

| Contrôle | Résultat |
|---|---:|
| API | ✅ healthy |
| Nginx/Web | ✅ healthy |
| Actuator | ✅ `200`, `{"status":"UP"}` |
| `/healthz` | ✅ `200` |
| Flyway | ✅ `31/31` |
| V30 | ✅ `ep18 sprint a email resend fondation` |
| V31 | ✅ `ep18 sprint b invitation email` |
| Smoke complet | ✅ `63 PASS / 0 FAIL` |

## 6. Validation Resend réelle

Un test contrôlé d'invitation EMAIL a été exécuté en Staging avec destinataire de test fournisseur
`delivered@resend.dev`.

Résultat :

| Élément | Résultat |
|---|---:|
| Création invitation | ✅ `201` |
| Création Outbox EMAIL | ✅ présente |
| Tentative fournisseur Resend | ❌ refusée |
| Code fournisseur | `HTTP 401` |
| Statut Outbox EMAIL | `DEAD` |
| `last_error_code` | `RESEND_REFUS_401` |
| Logs API | `Envoi EMAIL refusé définitivement par Resend (HTTP 401)` |

Après ce refus fournisseur, le kill-switch EMAIL a été remis à l'état sûr :

```text
RESEND_EMAIL_ENABLED=false
```

Le conteneur `api` a été recréé seul et est revenu `healthy`.

## 7. Webhook Resend/Svix — réserve maintenue

Le webhook Resend/Svix n'a pas pu être validé contre trafic réel car aucun e-mail Resend n'a été
accepté par le fournisseur. La réserve `RSV-EP18-06` reste donc ouverte.

Contrôle négatif de surface : `POST /api/public/notifications/resend/callback` sans signature
renvoie `403`, ce qui confirme que l'endpoint public n'accepte pas de callback non signé.

## 8. Décision CDO

**NO GO — Gate Staging EP-18 non validé.**

Les éléments techniques Staging sont corrects : artefacts immutables, déploiement ciblé, migrations
V30/V31, healthchecks et smoke complet sont verts. Cependant, le critère central du Gate — envoi
EMAIL réel Resend + webhook réel Resend/Svix — échoue au niveau fournisseur avec `HTTP 401`.

Cette décision :

- maintient EP-18 déployé techniquement en Staging avec EMAIL désactivé (`RESEND_EMAIL_ENABLED=false`) ;
- interdit toute promotion Production EP-18 ;
- interdit de considérer `RSV-EP18-06` comme levée ;
- exige rotation/correction de la clé Resend Staging et re-test fournisseur avant nouvelle instruction Gate.

## 9. Actions requises avant nouvelle tentative

1. Provisionner ou corriger une clé Resend **Staging** valide, distincte de toute clé Production.
2. Vérifier le domaine d'envoi Staging côté Resend.
3. Réactiver temporairement `RESEND_EMAIL_ENABLED=true` uniquement pendant le re-test.
4. Rejouer une invitation contrôlée vers une adresse de test fournisseur.
5. Vérifier que Resend accepte l'e-mail et retourne un `provider_message_id`.
6. Vérifier le webhook Resend/Svix réel (`email.sent`/`email.delivered` ou équivalent) et la progression de `notification_delivery.statut`.
7. Remettre le kill-switch EMAIL à l'état approprié selon décision CDO.
8. Produire une décision Gate Staging EP-18 ré-instruite : `GO`, `GO sous réserve` ou `NO GO`.
