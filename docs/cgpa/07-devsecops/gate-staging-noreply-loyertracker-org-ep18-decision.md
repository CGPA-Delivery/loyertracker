# Gate Staging — Déploiement `noreply@loyertracker.org` (RSV-EMAIL-NOREPLY-01-UNIDIR)

| Champ | Valeur |
|---|---|
| Date d'exécution | 2026-08-12 |
| Cadre | CGPA v6.1.1 — Enterprise Delivery Governance |
| Périmètre | EP-18 — Changement d'expéditeur Resend : `notifications@staging.loyerpro.org` → `noreply@loyertracker.org` |
| Instruction de référence | `docs/cgpa/design/decisions/instruction-rsv-dmarc-02-email-noreply-01-ep18.md` (PR #452) |
| Hôte Staging | `ai-test-server` (`172.31.11.102`) |
| Décision | **GO — déploiement `noreply@loyertracker.org` autorisé sur Staging, validé par envoi réel** |

## 1. Objet

Ce Gate Staging distinct autorise le changement de l'expéditeur Resend en Staging, conformément à
l'instruction consolidée EP-18 du 2026-08-12 :

- `RESEND_FROM_EMAIL` : `notifications@staging.loyerpro.org` → `noreply@loyertracker.org`
- `RESEND_FROM_NAME` : `LoyerTracker-Staging` → `LoyerTracker`
- `RESEND_EMAIL_ENABLED` : `false` → `true` (activation de l'envoi réel)
- `RESEND_REPLY_TO` : `support@loyerpro.org` → `""` (pas de reply-to, unidirectionnel par construction)

Ce Gate n'autorise **aucune Production**. Le déploiement Production fera l'objet d'un Gate distinct.

## 2. Préconditions

| Contrôle | Résultat | Preuve |
|---|---|---|
| PR #452 instruction EP-18 | ✅ MERGED | `25d236e` sur `main` |
| CI `main` post-#452 | ✅ SUCCESS | Tous les jobs verts (run `31572728854`) |
| Domaine `loyertracker.org` vérifié Resend | ✅ Verified | DKIM/SPF/DMARC alignés |
| Token Resend présent sur l'hôte Staging | ✅ SET | `re_MNkK6MDs_***` (send-only, conforme) |
| Conteneurs Staging actuels | ✅ Tous healthy | 8 conteneurs `loyertracker-staging-*` |

## 3. STG-ISOL-01 et sauvegarde

| Contrôle | Avant | Après |
|---|---|---|
| Conteneurs totaux hôte | 8 | 8 |
| Conteneurs `loyertracker-staging-*` | 8 | 8 |
| Réseaux Docker | — | — |
| Volumes Docker | — | — |
| Services recréés | — | `api` uniquement |
| Services non ciblés | — | `postgres`, `keycloak`, `nginx`, monitoring non recréés |

Sauvegarde pré-déploiement exécutée : `loyertracker-20260812-noreply.dump`, 572K, vérifiée.

## 4. Déploiement exécuté

```bash
# 1. Sauvegarde DB
docker exec loyertracker-staging-postgres-1 pg_dump -U loyertracker -d loyertracker \
  -Fc -f /tmp/loyertracker-20260812-noreply.dump  # 572K, OK

# 2. Mise à jour .env
cp .env .env.bak-pre-noreply-20260812
sed -i \
  -e 's/^RESEND_EMAIL_ENABLED=.*/RESEND_EMAIL_ENABLED=true/' \
  -e 's/^RESEND_FROM_EMAIL=.*/RESEND_FROM_EMAIL=noreply@loyertracker.org/' \
  -e 's/^RESEND_FROM_NAME=.*/RESEND_FROM_NAME=LoyerTracker/' \
  -e 's/^RESEND_REPLY_TO=.*/RESEND_REPLY_TO=/' \
  .env

# 3. Recréer api uniquement
docker compose --env-file .env -f docker-compose.staging.yml up -d --no-deps --force-recreate api
```

## 5. Vérification post-déploiement

| Contrôle | Résultat | Preuve |
|---|---|---|
| API healthy | ✅ | `Up 33 seconds (healthy)` |
| Actuator health | ✅ | `{"status":"UP"}` |
| Variables propagées | ✅ | `RESEND_FROM_EMAIL=noreply@loyertracker.org`, `RESEND_EMAIL_ENABLED=true`, `RESEND_FROM_NAME=LoyerTracker`, `RESEND_REPLY_TO=""` |
| Envoi e-mail test | ✅ | Resend ID `e7673f9b-a953-419b-90d8-36633ea83a52`, expéditeur `LoyerTracker <noreply@loyertracker.org>`, destinataire `jordan@innovtech-solutions.com` |

## 6. Kill-switch

En cas d'échec :

```bash
# Restaurer .env
cp .env.bak-pre-noreply-20260812 .env
# Recréer api avec l'ancienne config
docker compose --env-file .env -f docker-compose.staging.yml up -d --no-deps --force-recreate api
```

## 7. Décision

**GO** — le déploiement de `noreply@loyertracker.org` comme expéditeur Resend est effectif sur
Staging. L'envoi réel a été validé (Resend ID `e7673f9b`). Aucune promotion Production sans Gate
distinct.
