# Rapport Préflight Production — EP-18 Notifications EMAIL Resend

| Champ | Valeur |
|---|---|
| Date | 2026-08-05 |
| Fenêtre technique | `20260805T183406Z` |
| Hôte | `loyertracker-prod-server` / `ip-172-31-22-90` |
| Cadre | CGPA v6.1.1 — Préflight Production après Gate Production EP-18 `PRODUCTION_READY` |
| Périmètre | Préflight uniquement : backup, vérification baseline Production, rollback, digests candidats, flags sûrs |
| Décision | **PASS — Préflight Production EP-18 validé** |

## 1. Rappel de décision amont

Le Gate Production EP-18 a été réinstruit après correction de la dérive `R-V54-2` et statué :

```text
GO sous réserve — PRODUCTION_READY EP-18 atteint pour Préflight uniquement.
```

Ce Préflight ne déploie rien, n'applique aucune migration V30/V31 et n'active pas Resend en
Production.

## 2. Synchronisation hôte Production

| Contrôle | Résultat |
|---|---:|
| `git fetch --prune origin` | ✅ |
| `git pull --ff-only origin main` | ✅ |
| Hôte Production | `ip-172-31-22-90` |
| HEAD avant | `901a861` |
| HEAD après | `a6c1c16` |
| PR #372 mergée | ✅ incluse |

La resynchronisation hôte est documentaire/exploitation : elle ne change aucun conteneur applicatif
et ne déclenche aucune migration.

## 3. Baseline Production avant toute promotion EP-18

| Contrôle | Résultat | Preuve |
|---|---:|---|
| `check-release-state.sh --host` | ✅ **COHÉRENT** | API/Web par digests Production attendus ; Flyway réel `29` |
| Release courante | ✅ `1.15.0` | `PRODUCTION_TAG=sha-ac374193` |
| API Production | ✅ running / healthy | digest `sha256:9603330...` |
| Web/Nginx Production | ✅ running / healthy | digest `sha256:7dbc551...` |
| PostgreSQL | ✅ healthy | inchangé |
| Keycloak | ✅ healthy | inchangé |
| `/healthz` public | ✅ `200` | `https://loyertracker.loyerpro.org/healthz` |
| Racine publique | ✅ `200` | `https://loyertracker.loyerpro.org/` |
| Flyway réel | ✅ `29` | aucune migration V30/V31 appliquée |

## 4. Flags et secrets Resend — métadonnées non secrètes

| Variable | Statut Production | Interprétation |
|---|---:|---|
| `RESEND_EMAIL_ENABLED` | `ABSENT` | ✅ valeur Compose par défaut `false` |
| `RESEND_FROM_EMAIL` | `ABSENT` | ✅ aucun expéditeur Resend Production configuré |
| `RESEND_API_KEY` | présent hors dépôt, valeur non affichée | ℹ️ inerte tant que le flag reste `false` |
| `RESEND_WEBHOOK_SECRET` | présent hors dépôt, valeur non affichée | ℹ️ inerte tant que le flag reste `false` |

Aucune activation Resend n'a été effectuée. Aucun secret n'a été imprimé.

## 5. Backup Préflight

| Artefact | Valeur |
|---|---|
| Répertoire | `/home/ubuntu/backups/loyertracker/preflight-ep18-20260805T183406Z` |
| Dump base | `loyertracker-preflight-ep18-20260805T183406Z.dump` |
| Taille dump | `846K` |
| SHA-256 dump | `8f71bd15551a96af69e4328f8857336441fd3f6782f84dd3fa4b154bced9fb83` |
| Globals | `loyertracker-preflight-ep18-20260805T183406Z-globals.sql` |
| Taille globals | `1.1K` |
| SHA-256 globals | `f1b986c678383f31f08ba51a91c79a4b917428b99d5ad0cc30c66f005efa4711` |
| Fichier checksums | `SHA256SUMS` |
| Permissions dump/globals | `600` |

### Intégrité backup

L'hôte Production ne dispose pas de `pg_restore`. La vérification a donc été exécutée via le
conteneur PostgreSQL, sans restauration destructive :

```text
pg_restore_list_entries=852
Archive created at 2026-08-05 18:34:08 UTC
TOC Entries: 841
Format: CUSTOM
Dumped from database version: 16.14
```

Résultat : **backup lisible et exploitable**.

## 6. Rollback baseline

| Élément | Valeur |
|---|---|
| Rollback release | `1.15.0` |
| Rollback tag | `sha-ac374193` |
| Rollback API | `ghcr.io/jptshilombo/loyertracker-api@sha256:9603330ea530d2fe4e90b49a63e648c7a8b7679e8819f026f79e8108ca14557a` |
| Rollback Web | `ghcr.io/jptshilombo/loyertracker-web@sha256:7dbc551ee722e1da7697d71749b94a731fce0b028b7b7288c88d8346488e8bc8` |
| Flyway rollback | V30/V31 non encore appliquées ; restauration backup disponible avant migration |

## 7. Candidat EP-18 à promouvoir lors d'une étape distincte

| Artefact candidat EP-18 | Digest |
|---|---|
| API | `ghcr.io/jptshilombo/loyertracker-api@sha256:2522ae210603cb94efc03ce5f8053a0c20b2c10e81ff6c48cde62b3c53232d60` |
| Web | `ghcr.io/jptshilombo/loyertracker-web@sha256:9be1a4cd8b0b27d3b868e69481e7255ecbd1c3c47251875136d1ea897727c359` |

Ces digests proviennent du Gate Staging EP-18 GO. Ils ne sont pas encore appliqués en Production.

## 8. Décision Préflight

**PASS — Préflight Production EP-18 validé.**

Cette décision autorise uniquement l'instruction d'une étape distincte de déploiement technique
EP-18. Elle n'autorise pas automatiquement :

- le déploiement ;
- l'application des migrations V30/V31 ;
- l'activation de `RESEND_EMAIL_ENABLED=true` ;
- l'envoi d'e-mails Resend en Production ;
- le smoke métier post-déploiement ;
- `PRODUCTION_DEPLOYED` ;
- la clôture release.

## 9. Prochaine étape CGPA

Décision distincte requise : **Déploiement technique Production EP-18**.

Périmètre recommandé si le PO confirme :

1. conserver `RESEND_EMAIL_ENABLED=false` ;
2. basculer API/Web vers les digests EP-18 ;
3. laisser Flyway appliquer V30/V31 au démarrage API ;
4. recréer uniquement `api` et `nginx` si nécessaire ;
5. vérifier santé, Flyway `31/31`, digests, absence d'activation Resend ;
6. exécuter ensuite un smoke Production distinct ;
7. ne marquer `PRODUCTION_DEPLOYED` qu'après validation finale et nettoyage éventuel.
