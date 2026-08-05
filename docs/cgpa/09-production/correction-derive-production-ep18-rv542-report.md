# Rapport de correction — Dérive Production `R-V54-2` avant Gate EP-18

| Champ | Valeur |
|---|---|
| Date d'exécution | 2026-08-05 |
| Fenêtre technique | `20260805T172914Z` |
| Hôte | `loyertracker-prod-server` / `ip-172-31-22-90` |
| Objet | Correction préalable de dérive Production, sans promotion EP-18 |
| Autorisation | Instruction PO : « Avançons » après présentation du plan de correction ciblée |
| Statut | **PASS — dérive résolue** |

## 1. Contexte

L'instruction Gate Production EP-18 avait détecté un bloqueur d'entrée `R-V54-2` :

```text
loyertracker-nginx-1 exécute 'ghcr.io/jptshilombo/loyertracker-web:sha-27dce09d',
attendu 'ghcr.io/jptshilombo/loyertracker-web@sha256:7dbc551ee722e1da7697d71749b94a731fce0b028b7b7288c88d8346488e8bc8'
```

La Production était saine, mais la référence effective du conteneur Web/Nginx ne respectait pas la
politique de promotion par digest immuable. Cette correction traite uniquement cette dérive
d'exploitation et ne constitue pas une promotion EP-18.

## 2. Garde-fous appliqués

| Garde-fou | Résultat |
|---|---:|
| Backup `.env` avant mutation | ✅ `.env.bak-pre-ep18-drift-fix-20260805T172914Z` |
| Resync dépôt | ✅ `git pull --ff-only origin main`, `5eb5187` → `901a861` |
| Mutation applicative EP-18 | ❌ aucune |
| Migration Flyway | ❌ aucune migration exécutée |
| Conteneur API | ✅ inchangé |
| PostgreSQL | ✅ inchangé |
| Keycloak | ✅ inchangé |
| Resend Production | ✅ non activé |

## 3. Actions exécutées

1. snapshot des conteneurs `api`, `nginx`, `postgres`, `keycloak` avant correction ;
2. sauvegarde permissionnée du `.env` Production ;
3. resynchronisation contrôlée du dépôt hôte Production par fast-forward uniquement ;
4. alignement métadonnée `.env` :

```text
LOYERTRACKER_TAG=sha-ac374193
API_IMAGE_REF=ghcr.io/jptshilombo/loyertracker-api@sha256:9603330ea530d2fe4e90b49a63e648c7a8b7679e8819f026f79e8108ca14557a
WEB_IMAGE_REF=ghcr.io/jptshilombo/loyertracker-web@sha256:7dbc551ee722e1da7697d71749b94a731fce0b028b7b7288c88d8346488e8bc8
```

5. recréation ciblée du seul service `nginx` avec le digest Web attendu :

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps nginx
```

## 4. Invariants vérifiés

| Service | Avant | Après | Changement attendu |
|---|---|---|---:|
| `api` | `6e78fc7e...` | `6e78fc7e...` | ✅ non |
| `postgres` | `893685df...` | `893685df...` | ✅ non |
| `keycloak` | `4e4aa8c...` | `4e4aa8c...` | ✅ non |
| `nginx` | `8a86e52b...` | `7239238b...` | ✅ oui, ciblé |

Le conteneur `nginx` est le seul recréé, conformément au périmètre de correction.

## 5. Vérifications post-correction

| Contrôle | Résultat |
|---|---:|
| Health `nginx` | ✅ `healthy` après 4 itérations |
| `check-release-state.sh --host` | ✅ **COHÉRENT** |
| Digest API hôte | ✅ conforme |
| Digest Web hôte | ✅ conforme |
| Flyway réel Production | ✅ `29 == FLYWAY_EXPECTED_PROD` |
| API exécute le digest attendu | ✅ |
| Nginx/Web exécute le digest attendu | ✅ |
| `/healthz` public | ✅ `200` |
| racine publique | ✅ `200` |
| `RESEND_EMAIL_ENABLED` | ✅ absent, donc valeur sûre par défaut |
| `RESEND_FROM_EMAIL` | ✅ absent |

Sortie probante du verrou :

```text
Verrou d'état de release — mode HÔTE (déclaré vs réel)
  déclaré : release=1.15.0 tag=sha-ac374193 flyway_prod=29
  OK   digest API hôte conforme
  OK   digest Web hôte conforme
  OK   Flyway réel = 29 == FLYWAY_EXPECTED_PROD
  OK   loyertracker-api-1 exécute ghcr.io/jptshilombo/loyertracker-api@sha256:9603330ea530d2fe4e90b49a63e648c7a8b7679e8819f026f79e8108ca14557a
  OK   loyertracker-nginx-1 exécute ghcr.io/jptshilombo/loyertracker-web@sha256:7dbc551ee722e1da7697d71749b94a731fce0b028b7b7288c88d8346488e8bc8

Verrou d'état de release : COHÉRENT
```

## 6. Décision

**Dérive Production `R-V54-2` traitée — PASS.**

Cette correction ferme le bloqueur technique identifié par l'instruction Gate Production EP-18.
Elle ne vaut pas activation EP-18, ne vaut pas déploiement EP-18 et ne modifie pas Flyway
Production. Le Gate Production EP-18 peut maintenant être réinstruit sur une base Production
cohérente.
