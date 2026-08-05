# Rapport Déploiement Technique Production — EP-18 Notifications EMAIL Resend (`1.16.0`)

| Champ | Valeur |
|---|---|
| Date | 2026-08-05, ~18:55 UTC |
| Hôte | `loyertracker-prod-server` (`ip-172-31-22-90`) |
| Candidat | `sha-8c9f1e4a` — merge EP-18 PR #368 (`8c9f1e4aaa2a57946af841bbccd052f38fd471be`) |
| API | `ghcr.io/jptshilombo/loyertracker-api@sha256:2522ae210603cb94efc03ce5f8053a0c20b2c10e81ff6c48cde62b3c53232d60` |
| Web | `ghcr.io/jptshilombo/loyertracker-web@sha256:9be1a4cd8b0b27d3b868e69481e7255ecbd1c3c47251875136d1ea897727c359` |
| Rollback applicatif | `sha-ac374193` / release `1.15.0` |
| Verdict technique | **PASS** |
| État CGPA | **`PRODUCTION_DEPLOYED` non prononcé** — validation finale Production/smoke distinct requis |

## 1. Périmètre

Ce rapport couvre uniquement la **bascule technique Production EP-18** : références d'images, recréation ciblée `api` + `nginx`, application Flyway V30/V31 et contrôles techniques immédiats.

Il ne couvre pas :

- le smoke Production canonique ;
- la validation fonctionnelle finale ;
- l'activation Resend réelle ;
- la clôture release ;
- le statut `PRODUCTION_DEPLOYED`.

## 2. Préconditions vérifiées

| Contrôle d'entrée | Résultat |
|---|---:|
| PR #373 Préflight | mergée sur `main` (`c92fa07`) |
| Hôte Production resynchronisé | `a6c1c16` → `c92fa07` |
| `check-release-state.sh --host` avant bascule | ✅ cohérent (`1.15.0`, `sha-ac374193`, Flyway 29/29) |
| `/healthz` avant bascule | ✅ `200` |
| API/Web/PostgreSQL/Keycloak avant bascule | ✅ healthy, `RestartCount=0` |
| Resend avant bascule | safe flag maintenu ; aucune activation |

## 3. Incident de script sans impact de bascule

Une première tentative de script a échoué avant toute mutation Docker sur une erreur de quoting Python (`Path(.env)`). Effets produits uniquement : backups `.env`/`production-state.env` créés.

- Aucun `docker pull` terminé.
- Aucun `docker compose up` exécuté.
- Aucun conteneur recréé.
- Aucun changement Flyway.

La séquence corrigée a ensuite été relancée et vérifiée.

## 4. Sauvegardes de configuration

| Artefact | Valeur |
|---|---|
| Backup `.env` utile | `.env.bak-pre-ep18-tech-20260805T185514Z` |
| Backup `production-state.env` utile | `infra/release/production-state.env.bak-pre-ep18-tech-20260805T185514Z` |
| Backup base pré-migration | Préflight déjà vérifié : `/home/ubuntu/backups/loyertracker/preflight-ep18-20260805T183406Z/` |
| Dump Préflight SHA-256 | `8f71bd15551a96af69e4328f8857336441fd3f6782f84dd3fa4b154bced9fb83` |

## 5. Bascule exécutée

| Étape | Résultat |
|---|---|
| `.env` | `LOYERTRACKER_TAG=sha-8c9f1e4a`, `API_IMAGE_REF`/`WEB_IMAGE_REF` vers digests EP-18 |
| Kill switch Resend | `RESEND_EMAIL_ENABLED=false` explicitement maintenu |
| `RESEND_FROM_EMAIL` | absent |
| Pull images | `docker compose -f docker-compose.yml -f docker-compose.prod.yml pull api nginx` |
| Recréation ciblée | `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps api nginx` |
| Services recréés | `api=yes`, `nginx=yes` |
| Services non recréés | `postgres=no`, `keycloak=no` |
| Orphelins monitoring | avertissement Compose connu ; **aucun `--remove-orphans` exécuté** |

## 6. État post-bascule

| Contrôle | Résultat |
|---|---:|
| API | ✅ healthy, `RestartCount=0`, image `ghcr.io/jptshilombo/loyertracker-api@sha256:2522ae210603cb94efc03ce5f8053a0c20b2c10e81ff6c48cde62b3c53232d60` |
| Web/Nginx | ✅ healthy, `RestartCount=0`, image `ghcr.io/jptshilombo/loyertracker-web@sha256:9be1a4cd8b0b27d3b868e69481e7255ecbd1c3c47251875136d1ea897727c359` |
| PostgreSQL | ✅ healthy, inchangé |
| Keycloak | ✅ healthy, inchangé |
| `check-release-state.sh --host` | ✅ **COHÉRENT** |
| `/healthz` | ✅ `200` |
| Racine publique | ✅ `200` |
| Flyway | ✅ `31/31` |
| Dernières migrations | V31 `ep18 sprint b invitation email`, V30 `ep18 sprint a email resend fondation` |
| `notification_outbox` / `notification_delivery` | ✅ `0 / 0` |
| Logs API récents | ✅ 0 ligne `ERROR`/`Exception` sur la fenêtre contrôlée |

## 7. Resend — état sécurisé confirmé

| Variable / activité | Statut |
|---|---:|
| `RESEND_EMAIL_ENABLED` | ✅ `false` |
| `RESEND_FROM_EMAIL` | ✅ absent côté `.env`, vide côté conteneur |
| `RESEND_API_KEY` | présent hors dépôt mais longueur effective `0` dans le conteneur contrôlé / non utilisable |
| `RESEND_WEBHOOK_SECRET` | présent hors dépôt mais longueur effective `0` dans le conteneur contrôlé / non utilisable |
| Outbox/delivery | ✅ `0/0` |

Conclusion : EP-18 est techniquement présent en Production, mais **aucun envoi externe Resend n'est activé**.

## 8. Réserve bloquante restante

La validation finale Production reste à instruire explicitement par le PO : smoke Production canonique, preuves fonctionnelles et nettoyage. Tant que cette étape n'est pas exécutée et verte :

- `PRODUCTION_DEPLOYED` n'est pas prononcé ;
- l'hypercare ne démarre pas ;
- la release n'est pas clôturée ;
- Resend reste désactivé.

## 9. Décision

**PASS technique — Production basculée techniquement sur EP-18 / `1.16.0`.**

Prochaine étape CGPA autorisée : **Validation finale Production EP-18**, sous instruction PO distincte.
