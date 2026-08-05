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

## Addendum 2026-08-05 — dérive Production traitée

Après instruction PO (« Avançons »), la correction préalable `R-V54-2` a été exécutée sans promotion
EP-18 : backup `.env`, resynchronisation fast-forward du dépôt hôte Production (`5eb5187` →
`901a861`), alignement de la métadonnée `LOYERTRACKER_TAG=sha-ac374193`, puis recréation ciblée du
seul conteneur `nginx` avec le digest `PRODUCTION_WEB_IMAGE_REF` attendu.

Résultat post-correction :

- `check-release-state.sh --host` : **COHÉRENT** ;
- API inchangée ;
- PostgreSQL inchangé ;
- Keycloak inchangé ;
- Flyway Production toujours `29/29` ;
- `/healthz` public `200` ;
- racine publique `200` ;
- `RESEND_EMAIL_ENABLED` absent, donc Resend reste désactivé par défaut ;
- aucune migration, aucun déploiement EP-18, aucune activation e-mail Production.

Rapport : `docs/cgpa/09-production/correction-derive-production-ep18-rv542-report.md`.

La décision historique **NO GO technique temporaire** reste tracée comme constat initial ; son
bloqueur unique est désormais résolu. Le Gate Production EP-18 peut être réinstruit sur une base
Production cohérente.

## Addendum 2026-08-05 — Réinstruction Gate Production EP-18 après correction `R-V54-2`

Après correction documentée de la dérive Production `R-V54-2`, le Gate Production EP-18 est
réinstruit sans déploiement, sans migration et sans activation Resend.

### Contrôles d'entrée Production réexécutés

| Contrôle | Résultat | Preuve |
|---|---:|---|
| Hôte Production | ✅ accessible | `ip-172-31-22-90`, contrôle UTC `2026-08-05T17:55:17Z` |
| Dépôt hôte Production | ✅ aligné | `901a861`, `main...origin/main` |
| `check-release-state.sh --host` | ✅ **COHÉRENT** | API/Web par digests attendus, Flyway `29 == FLYWAY_EXPECTED_PROD` |
| API Production | ✅ running / healthy | digest `sha256:9603330...` |
| Web/Nginx Production | ✅ running / healthy | digest `sha256:7dbc551...` |
| PostgreSQL / Keycloak | ✅ running / healthy | inchangés depuis correction ciblée |
| `/healthz` public | ✅ `200` | `https://loyertracker.loyerpro.org/healthz` |
| Racine publique | ✅ `200` | `https://loyertracker.loyerpro.org/` |
| Flyway réel Production | ✅ `29` | aucune migration EP-18 exécutée |
| Tables notification EP-18 | ✅ présentes au socle existant | `notification_outbox` / `notification_delivery` détectées ; aucune preuve d'activation Resend Production |
| `RESEND_EMAIL_ENABLED` | ✅ absent | valeur Compose sûre par défaut : `false` |
| `RESEND_FROM_EMAIL` | ✅ absent | aucun expéditeur Resend Production configuré |
| Secrets Resend | ℹ️ présence possible hors dépôt | métadonnée uniquement, valeurs jamais affichées ; inertes tant que `RESEND_EMAIL_ENABLED=false` |

### Contrôles de traçabilité Staging / candidat

| Contrôle | Résultat |
|---|---:|
| Gate Staging EP-18 | ✅ **GO** |
| Envoi/réception EMAIL Resend | ✅ validé par le PO via `onboarding@resend.dev` |
| Provider Message ID | ✅ `fdac0ef4-a19f-4893-9f89-abe55b1f25c8` |
| Webhook Resend/Svix réel | ✅ hors périmètre EP-18, reclassé EP-19 |
| Domaine `staging.loyerpro.org` | ✅ sans objet |
| Kill-switch Staging post-test | ✅ `RESEND_EMAIL_ENABLED=false` |
| Migrations candidat | ✅ V30/V31 strictement additives selon instruction Staging ; non appliquées en Production à ce stade |

### Réserves Production EP-18

| ID | Statut | Traitement |
|---|---|---|
| `RSV-PROD-EP18-01` — dérive Production image Web tag vs digest | ✅ **LEVÉE** | Correction ciblée exécutée, `check-release-state.sh --host` cohérent |
| `RSV-PROD-EP18-02` — repo hôte Production en retard | ✅ **LEVÉE** | Fast-forward `5eb5187` → `901a861` exécuté pendant la correction préalable |
| Webhook Resend/Svix réel | Hors périmètre EP-18 | Reclassé EP-19, non bloquant |
| Activation Resend Production | **Interdite par ce Gate** | Les flags restent sûrs ; toute activation future nécessite décision distincte |
| Backup pré-Production EP-18 | Condition du Préflight | À produire et vérifier avant toute migration V30/V31 |
| Smoke Production EP-18 | Condition post-déploiement | À exécuter uniquement après Préflight + décision de déploiement distincte |

### Avis consolidés

| Rôle | Avis |
|---|---|
| Governance Officer | **GO sous réserve** — le bloqueur `R-V54-2` est levé, historique préservé, aucune Production EP-18 exécutée |
| Enterprise Architect | **GO sous réserve** — V30/V31 sont additives ; webhook avancé correctement séparé en EP-19 |
| DevSecOps Lead | **GO sous réserve** — CI/CodeQL/Registry/CGPA verts sur PR #372, Production live cohérente par digest |
| Release Manager | **GO sous réserve** — autorise uniquement le Préflight Production EP-18, pas le déploiement |
| Product Owner | **GO de réinstruction** — instruction « Allons sur Gate Production EP-18 » après correction dérive |
| Chief Delivery Officer | **GO sous réserve — `PRODUCTION_READY` EP-18 atteint pour Préflight uniquement** |

### Décision CDO actualisée

**GO sous réserve — `PRODUCTION_READY` EP-18 atteint le 2026-08-05 après correction de la dérive
Production `R-V54-2`.**

Cette décision autorise uniquement la prochaine étape CGPA : **Préflight Production EP-18**.

Elle n'autorise pas :

- le déploiement EP-18 ;
- l'application des migrations V30/V31 en Production ;
- l'activation de `RESEND_EMAIL_ENABLED=true` ;
- l'envoi réel d'e-mails Resend en Production ;
- la clôture de release ou `PRODUCTION_DEPLOYED`.

Le Préflight Production EP-18 devra au minimum produire un backup base + globals, vérifier le
rollback vers `1.15.0`/`sha-ac374193`, confirmer les digests candidats API/Web EP-18, confirmer les
flags Resend sûrs, et préparer un smoke Production post-déploiement avant toute décision distincte
de déploiement technique.
