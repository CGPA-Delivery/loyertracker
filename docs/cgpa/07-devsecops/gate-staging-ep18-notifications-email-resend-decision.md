# Gate Staging EP-18 — Canal EMAIL via Resend

| Champ | Valeur |
|---|---|
| Date d'exécution | 2026-08-05 |
| Cadre | CGPA v6.1.1 — Enterprise Delivery Governance |
| Périmètre | EP-18 — Canal EMAIL via Resend, invitation gestionnaire par e-mail, émission transactionnelle et preuve de réception PO |
| Hôte Staging | `ai-test-server` (`172.31.11.102`) |
| Candidat dépôt | `dbded12c00065bf757da68e59aff35710f952a1b` — PR #370 incluse |
| Candidat applicatif déployé | API/Web issus de `sha-8c9f1e4a` par digest GHCR |
| API digest | `ghcr.io/jptshilombo/loyertracker-api@sha256:2522ae210603cb94efc03ce5f8053a0c20b2c10e81ff6c48cde62b3c53232d60` |
| Web digest | `ghcr.io/jptshilombo/loyertracker-web@sha256:9be1a4cd8b0b27d3b868e69481e7255ecbd1c3c47251875136d1ea897727c359` |
| Décision | **GO — envoi/réception EMAIL validé par le Product Owner** |

## 1. Objet

Ce document statue le Gate Staging EP-18 après fusion de l'intégration repository EP-18 (#368),
clôture de gouvernance (#369), puis correction du câblage Compose Resend (#370).

Le Gate vérifie si EP-18 peut être considéré validé en Staging avec envoi EMAIL Resend réel,
Provider Message ID persistant et preuve de réception Product Owner. Le suivi asynchrone de
délivrabilité par webhooks Resend/Svix est explicitement hors périmètre du verdict EP-18 et reporté
à EP-19. Ce Gate n'autorise aucune Production.

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

Une première tentative avec la clé initialement présente sur l'hôte Staging avait échoué en
`HTTP 401`. Après indication PO, le token Resend a été retrouvé dans `INFRASTRUCTURE/resend/` et
injecté sans exposition de valeur secrète (`RESEND_API_KEY=SET len=36`).

Résultat après ré-instruction :

| Élément | Résultat |
|---|---:|
| Token Resend Staging | ✅ trouvé et injecté sans fuite de secret |
| Test API Resend direct avec `onboarding@resend.dev` | ✅ `HTTP 200`, message accepté |
| Invitation applicative avec domaine test Resend | ✅ Outbox `PROCESSED`, Delivery `QUEUED`, `provider_message_id` reçu |
| Réception utilisateur sur `jptshilombo373@gmail.com` | ✅ confirmée par le PO après envoi applicatif |
| Statut applicatif après réception | ℹ️ Delivery restée `QUEUED` en base ; suivi asynchrone hors périmètre EP-18 |
| Webhook Resend/Svix réel | ➡️ Non bloquant ; reclassé amélioration future EP-19 |

Le résultat distingue donc deux sujets :

1. **la clé Resend est valide pour l'envoi** ;
2. **la réception e-mail via `onboarding@resend.dev` est confirmée par le PO** ;
3. **l'hypothèse de domaine `staging.loyerpro.org` est sans objet (Not Applicable)**, conformément à l'arbitrage PO ;
4. **le webhook réel est hors périmètre bloquant EP-18 et reclassé en EP-19**.

Après les tests, la configuration Staging a été remise en état sûr/intentionnel :

```text
RESEND_EMAIL_ENABLED=false
RESEND_FROM_EMAIL=onboarding@resend.dev
```

Le conteneur `api` a été recréé seul et est revenu `healthy`.

## 7. Webhook Resend/Svix — réserve clôturée et reclassée EP-19

Décision Product Owner du 2026-08-05 : le webhook Resend/Svix n'est plus une condition de GO pour
EP-18. Le périmètre EP-18 couvre l'émission transactionnelle, l'intégration API Resend, le Provider
Message ID, la gestion des erreurs immédiates, les retries, l'idempotence et l'Outbox.

Constat conservé pour historique : après acceptation d'un e-mail par Resend via le domaine de test
`onboarding@resend.dev` et confirmation de réception par le PO sur `jptshilombo373@gmail.com`, la
livraison applicative est restée `QUEUED` en base et aucun callback réel n'a fait progresser
`notification_delivery.statut`. Ce constat ne bloque plus EP-18 ; il alimente l'Epic séparé
**EP-19 — Suivi avancé de délivrabilité des e-mails via Webhooks Resend**.

Contrôle négatif de surface conservé : `POST /api/public/notifications/resend/callback` sans signature
renvoie `403`, ce qui confirme que l'endpoint public n'accepte pas de callback non signé.

## 8. Décision CDO

**GO — Gate Staging EP-18 validé pour l'envoi/réception EMAIL.**

Les éléments techniques Staging sont corrects : artefacts immutables, déploiement ciblé, migrations
V30/V31, healthchecks et smoke complet sont verts. L'envoi/réception EMAIL réel est validé par le PO
via `onboarding@resend.dev`, avec Provider Message ID enregistré. Le callback réel Resend/Svix est
reclassé hors périmètre EP-18 et reporté à EP-19.

Cette décision :

- maintient EP-18 déployé techniquement en Staging avec EMAIL désactivé (`RESEND_EMAIL_ENABLED=false`) après test ;
- reconnaît que l'envoi/réception EMAIL via `onboarding@resend.dev` est prouvé et accepté par le PO ;
- classe l'hypothèse de domaine `staging.loyerpro.org` comme **sans objet (Not Applicable)** pour ce Gate ;
- clôture `RSV-EP18-06` comme réserve EP-18 et la reclasse en amélioration future EP-19 ;
- interdit toute promotion Production automatique : Gate Production distinct requis.

## 9. Éléments reportés — EP-19

Les actions ci-dessous ne sont plus requises pour le GO EP-18. Elles sont reportées dans le backlog
EP-19 :

1. Valider les signatures Svix contre un webhook Resend réel.
2. Configurer les callbacks Resend pour `DELIVERED` / `BOUNCED` / `FAILED` / `COMPLAINED`.
3. Mettre à jour automatiquement `NotificationDelivery` depuis les callbacks.
4. Ajouter les métriques de délivrabilité, la gestion des bounces et un tableau de bord de suivi.
