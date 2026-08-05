# Rapport Validation Finale Production — EP-18 Notifications EMAIL Resend (`1.16.0`)

| Champ | Valeur |
|---|---|
| Date | 2026-08-05, ~19:21–19:31 UTC |
| Hôte | `loyertracker-prod-server` (`ip-172-31-22-90`) |
| Tag en Production | `sha-8c9f1e4a` |
| API | `ghcr.io/jptshilombo/loyertracker-api@sha256:2522ae210603cb94efc03ce5f8053a0c20b2c10e81ff6c48cde62b3c53232d60` |
| Web | `ghcr.io/jptshilombo/loyertracker-web@sha256:9be1a4cd8b0b27d3b868e69481e7255ecbd1c3c47251875136d1ea897727c359` |
| RUN_ID smoke propre | `1785957904` (`2026-08-05T19:25:04Z`) |
| Verdict | **PASS — `PRODUCTION_DEPLOYED` atteint** |

## 1. Autorisation

Validation finale Production EP-18 autorisée explicitement par le PO le 2026-08-05 après merge de la PR #374 : **GO — exécuter validation finale Production EP-18 maintenant**.

Périmètre autorisé : réactivation temporaire de `bailleur-test@test.local`, activation temporaire de `directAccessGrantsEnabled` par le script smoke, création de données smoke, nettoyage complet, Resend maintenu désactivé.

## 2. Contrôle d'entrée

| Contrôle | Résultat |
|---|---:|
| PR #374 | mergée (`9be44e8`) |
| `main` local | resynchronisé sur `origin/main` |
| Hôte Production | resynchronisé sur `9be44e8` après remplacement du commentaire local obsolète `production-state.env` par la version mergée |
| `check-release-state.sh --ci` | ✅ cohérent |
| `check-release-state.sh --host` | ✅ cohérent |
| API/Web/PostgreSQL/Keycloak | ✅ healthy, `RestartCount=0` |
| `/healthz` / racine publique | ✅ `200 / 200` |
| Flyway | ✅ `31/31` |
| Resend | ✅ `RESEND_EMAIL_ENABLED=false`, `RESEND_FROM_EMAIL` absent |
| `notification_outbox` / `notification_delivery` avant smoke | ✅ `0 / 0` |

## 3. Premier passage avorté — précondition `bailleur-test`

Un premier passage du smoke a démarré avec `bailleur-test@test.local` désactivé. Résultat : arrêt très tôt sur **JWT bailleur KO**.

Ce passage n'a pas validé la release, mais les garde-fous ont fonctionné :

- `directAccessGrantsEnabled=false` après `trap` ;
- `bailleur-test@test.local enabled=false` ;
- `notification_outbox=0`, `notification_delivery=0` ;
- aucune donnée métier smoke créée.

La précondition a ensuite été corrigée sous l'autorisation PO déjà donnée : `bailleur-test@test.local` activé temporairement, puis redésactivé après validation.

## 4. Smoke Production canonique — PASS

Commande exécutée sur l'hôte Production :

```bash
sudo env BASE=https://localhost:18443 \
  CACERT=infra/nginx/certs/localhost.pem \
  COMPOSE_FILE=docker-compose.yml:docker-compose.prod.yml \
  bash infra/smoke/smoke-stack.sh
```

Résultat du passage propre :

| Mesure | Résultat |
|---|---:|
| RUN_ID | `1785957904` |
| Code de sortie | `0` |
| Bilan | **65 PASS / 0 FAIL** |
| `directAccessGrants` | activé temporairement par le script puis révoqué automatiquement |

Couverture prouvée :

- stack healthy, Flyway `31/31`, digests API/Web Production conformes ;
- pool API sous `loyertracker_api`, `NOSUPERUSER`, `NOBYPASSRLS` ;
- JWT réels Keycloak via Nginx TLS ;
- parcours bailleur : inscription, patrimoine, bien, locataire, bail ;
- invitation → acceptation via Admin API réelle → JWT gestionnaire ;
- affectation, échéances, pointage, honoraires ;
- alertes + audit ;
- scoping gestionnaire ;
- isolation cross-tenant live avec 2e bailleur ;
- RGPD : export, effacement locataire, anonymisation et audit ;
- garde-fous AuthN/ports ;
- surface publique de vérification des quittances sans oracle.

## 5. Volet EP-18 / Resend

| Contrôle | Résultat |
|---|---:|
| `RESEND_EMAIL_ENABLED` | ✅ `false` |
| Envoi externe Resend | ❌ aucun |
| `notification_delivery` | ✅ `0` |
| `notification_outbox` pendant smoke | 1 ligne EMAIL `PENDING` créée pour l'invitation smoke, supprimée au nettoyage |
| `notification_template` | `4` templates après EP-18 |

Interprétation : la voie invitation EMAIL est exercée jusqu'à l'Outbox, mais le kill-switch Production empêche toute émission externe. C'est conforme au périmètre validé : **EP-18 techniquement et fonctionnellement stable, Resend non activé**.

## 6. Nettoyage transactionnel

Les résidus du RUN_ID `1785957904` ont été supprimés en transaction PostgreSQL (`BEGIN` … `COMMIT`, `ON_ERROR_STOP`) puis les comptes Keycloak smoke ont été supprimés.

| Entité supprimée | Nombre |
|---|---:|
| `notification_outbox` | 1 |
| `notification_event` | 9 |
| `audit_log` | 4 |
| `alerte` | 6 |
| `honoraire` | 9 |
| `paiement` | 9 |
| `affectation` | 1 |
| `invitation` | 1 |
| `bail` | 1 |
| `locataire` | 1 |
| `bien` | 1 |
| `patrimoine` | 2 |
| `gestionnaire` | 1 |
| `bailleur2 smoke` | 1 |
| **Total DB** | **47 lignes** |

Comptes Keycloak supprimés :

- `gest-smoke-1785957904@test.local` ;
- `bailleur2-smoke-1785957904@test.local`.

## 7. État final vérifié

| Contrôle final | Résultat |
|---|---:|
| `directAccessGrantsEnabled` | ✅ `false` |
| `bailleur-test@test.local` | ✅ `enabled=false` |
| Comptes Keycloak smoke | ✅ `0` |
| Résidus DB RUN_ID | ✅ `0` |
| `notification_event/outbox/delivery/template/preference` | ✅ `34 / 0 / 0 / 4 / 0` |
| Baseline métier | ✅ `3 bailleurs, 2 patrimoines, 8 biens, 8 baux, 8 garanties, 1 gestionnaire, 8 locataires, 7 quittances` |
| `check-release-state.sh --host` | ✅ cohérent |
| `/healthz` / racine publique | ✅ `200 / 200` |

## 8. Note non bloquante

Une ligne applicative `ERROR` connue est apparue pendant le smoke : violation contrôlée de `bailleur_keycloak_id_key` lors du replay de `POST /api/bailleurs/inscription` sur le compte permanent `bailleur-test`. L'API répond `409`, accepté explicitement par le script. C'est le même pattern déjà documenté sur les validations précédentes ; pas de régression fonctionnelle.

## 9. Verdict

**Validation finale PASS — `PRODUCTION_DEPLOYED` confirmé pour EP-18 / release `1.16.0` (`sha-8c9f1e4a`) le 2026-08-05.**

Resend reste désactivé en Production. Prochaine étape CGPA distincte : hypercare T0/T+12/T+24 EP-18, puis clôture CDO.
