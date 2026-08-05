# Gate Production — EP-18 Canal EMAIL via Resend

| Champ | Valeur |
|---|---|
| Date | 2026-08-05 |
| Cadre | CGPA v6.1.1 — Enterprise Delivery Governance |
| Périmètre | EP-18 — Canal EMAIL via Resend, émission/réception validée en Staging ; webhooks avancés reportés EP-19 |
| Branche / source | `origin/main` après merge PR #371 |
| Merge commit documentaire | `901a86174e6c00ef631049d50536ea0534d0bd35` |
| Candidat applicatif Staging | API/Web issus de `sha-8c9f1e4a` par digest GHCR |
| API digest Staging EP-18 | `ghcr.io/jptshilombo/loyertracker-api@sha256:2522ae210603cb94efc03ce5f8053a0c20b2c10e81ff6c48cde62b3c53232d60` |
| Web digest Staging EP-18 | `ghcr.io/jptshilombo/loyertracker-web@sha256:9be1a4cd8b0b27d3b868e69481e7255ecbd1c3c47251875136d1ea897727c359` |
| Production actuelle | `1.15.0`, `sha-ac374193`, API digest `sha256:9603330...`, Web digest attendu `sha256:7dbc551...`, Flyway Production `29/29` |
| Décision | **NO GO technique temporaire — Gate Production EP-18 non franchissable avant correction de dérive d'exploitation Production** |

## 1. Objet

Ce document instruit le Gate Production EP-18 après :

- Gate Staging EP-18 statué **GO** ;
- PR #371 mergée sur `main` ;
- preuves Resend consolidées : API authentifiée, e-mail envoyé, e-mail reçu par le Product Owner,
  Provider Message ID `fdac0ef4-a19f-4893-9f89-abe55b1f25c8` ;
- webhook Resend/Svix reclassé hors périmètre EP-18, dans EP-19.

Ce Gate ne déploie rien, ne modifie pas la Production, ne lit ni n'expose aucun secret, et n'active
pas Resend.

## 2. Contrôles post-merge repository

| Contrôle | Résultat | Preuve |
|---|---:|---|
| PR #371 | ✅ MERGED | `2026-08-05T16:53:13Z` |
| Merge commit `main` | ✅ | `901a86174e6c00ef631049d50536ea0534d0bd35` |
| CI `main` post-merge | ✅ SUCCESS | run `31027405548` |
| CodeQL `main` post-merge | ✅ SUCCESS | run `31027400491` |
| Registry Policy `main` post-merge | ✅ SUCCESS | run `31027400493` |
| CGPA Framework Audit `main` post-merge | ✅ SUCCESS | run `31027400483` |
| Verrou release `--ci` | ✅ COHÉRENT | `FLYWAY_EXPECTED_REPO=31`, `RELEASE_VERSION=1.15.0`, digests Production déclarés valides |
| Migrations dépôt | ✅ | `31` fichiers `V*.sql` |
| Diff applicatif après Gate Staging EP-18 | ✅ maîtrisé | Depuis `8c9f1e4` vers `901a861` : documentation + Compose Resend, pas de nouveau code Java/Angular applicatif |

## 3. Contrôles Production en lecture seule

Contrôle exécuté en lecture seule sur `loyertracker-prod-server` (`172.31.22.90`) :

| Contrôle | Résultat | Preuve |
|---|---:|---|
| Hôte accessible | ✅ | `ip-172-31-22-90` |
| Repo présent | ✅ | `~/loyertracker` |
| API Production | ✅ running / healthy | `loyertracker-api-1` |
| Web/Nginx Production | ✅ running / healthy | `loyertracker-nginx-1` |
| PostgreSQL / Keycloak | ✅ running / healthy | services inchangés |
| `/healthz` public | ✅ 200 | `https://loyertracker.loyerpro.org/healthz` |
| Flyway Production réel | ✅ `29/29` | conforme `FLYWAY_EXPECTED_PROD=29` |
| Digest API réel | ✅ conforme | `sha256:9603330...` |
| Digest Web réel | ⚠️ digest conforme mais référence d'image non conforme | conteneur lancé avec tag `sha-27dce09d` au lieu du digest attendu |
| Verrou release `--host` | ❌ FAIL | 1 écart : `loyertracker-nginx-1` exécute `ghcr.io/.../loyertracker-web:sha-27dce09d`, attendu `ghcr.io/.../loyertracker-web@sha256:7dbc551...` |

## 4. Bloqueur découvert

Le contrôle d'entrée `infra/release/check-release-state.sh --host` échoue en Production.

Le contenu Web semble équivalent au digest attendu, mais la référence d'image effectivement portée
par Docker reste un **tag** :

```text
ghcr.io/jptshilombo/loyertracker-web:sha-27dce09d
```

alors que la politique Production actuelle impose un **digest exact** :

```text
ghcr.io/jptshilombo/loyertracker-web@sha256:7dbc551ee722e1da7697d71749b94a731fce0b028b7b7288c88d8346488e8bc8
```

Cette dérive n'indique pas une panne applicative immédiate — Production est healthy — mais elle
viole le verrou `R-V54-2` et la règle de promotion par digests immuables. Conformément au CGPA, un
Gate Production ne doit pas être franchi avec un contrôle d'entrée `--host` rouge.

## 5. État Resend Production

Lecture non secrète uniquement :

- `RESEND_EMAIL_ENABLED` : absent de `.env` Production, donc valeur Compose par défaut `false` ;
- `RESEND_FROM_EMAIL` : absent ;
- secrets Resend : présence éventuelle non exploitée ici, valeurs jamais affichées ;
- conteneur API courant `1.15.0` n'est pas EP-18 et n'active aucun envoi Resend.

Le Gate confirme donc qu'aucun e-mail Production n'a été activé par cette instruction.

## 6. Réserves / constats

| ID | Statut | Traitement |
|---|---|---|
| `RSV-PROD-EP18-01` — dérive Production image Web tag vs digest | **Bloquante** | Corriger/réaligner la référence effective du conteneur `nginx` avec `PRODUCTION_WEB_IMAGE_REF` par digest, puis rejouer `check-release-state.sh --host` |
| `RSV-PROD-EP18-02` — Production repo hôte en retard sur `origin/main` | Non bloquante pour l'app courante, à traiter au Préflight | Le dépôt hôte est encore sur `5eb5187`; toute promotion EP-18 nécessitera resynchronisation contrôlée avant modification `.env`/Compose |
| Webhook Resend/Svix | Hors périmètre EP-18 | Reclassé EP-19, non bloquant |
| Domaine `staging.loyerpro.org` | Sans objet | Aucun traitement |

## 7. Décision CDO

**NO GO technique temporaire — Gate Production EP-18 non franchissable en l'état.**

Motif unique bloquant : le contrôle d'entrée Production `R-V54-2` (`check-release-state.sh --host`)
est rouge à cause de la référence d'image Web lancée par tag au lieu du digest attendu.

Cette décision :

- ne remet pas en cause le **GO Staging EP-18** ;
- ne remet pas en cause les preuves Resend EP-18 ;
- ne remet pas en cause la santé actuelle de Production `1.15.0` ;
- bloque uniquement le passage à `PRODUCTION_READY` EP-18 tant que la dérive d'exploitation n'est pas corrigée ;
- n'autorise aucun déploiement, aucun Préflight destructif, aucune migration, aucune activation Resend.

## 8. Prochaine étape autorisée

Préparer une correction préalable de dérive Production **sans promotion EP-18** :

1. resynchroniser le dépôt hôte Production de manière contrôlée ;
2. réaligner la référence effective du conteneur Web/Nginx courant sur le digest attendu
   `PRODUCTION_WEB_IMAGE_REF`, sans changer le contenu applicatif ;
3. rejouer `infra/release/check-release-state.sh --host` jusqu'à PASS ;
4. documenter la correction ;
5. seulement ensuite réinstruire le Gate Production EP-18.
