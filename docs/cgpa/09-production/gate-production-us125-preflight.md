# Gate Production US-125 — préflight et décision d'entrée

- **Projet :** LoyerTracker
- **US :** US-125 Notifications
- **Référentiel :** CGPA v6.1.1
- **Date du préflight :** 2026-08-08
- **Environnement cible :** `loyertracker-prod-server` (`172.31.22.90`)
- **Artefact candidat Staging :** commit `d19c4fea850263c5bfbb92fcb288dd7bd2e56e2a`
- **Décision actuelle :** **NO GO d'entrée — `PRODUCTION_READY` non atteint**
- **Déploiement Production :** **NON exécuté**

## Synthèse

Le préflight technique Production est PASS et l'artefact candidat est identique à celui validé en Staging. Le Gate Production n'est pas encore validable formellement, car les exigences Release Candidate et les avis humains/roles du circuit Production ne sont pas toutes tracées.

## Contrôles techniques exécutés

### R-V54-2 — verrou d'état de release

`bash infra/release/check-release-state.sh --host` exécuté sur l'hôte privé Production : **COHÉRENT**.

- Release déclarée : `1.16.0`
- Tag Production actuel : `sha-8c9f1e4a`
- Flyway Production : `31/31`
- Digest API/Web actuels conformes à `infra/release/production-state.env`
- Aucun écart de traçabilité détecté

### Santé et observabilité

- API/Web/PostgreSQL/Keycloak : healthy.
- HTTPS `/healthz` : `200`.
- Racine publique : `200`.
- Actuator Prometheus interne : `200`.
- Actuator Prometheus public : `404`.
- Prometheus, Alertmanager, Pushgateway et Blackbox présents.
- API, PostgreSQL et Keycloak non publiés directement.

### Sauvegarde pré-Gate

- Répertoire : `/home/ubuntu/backups/loyertracker/gate-us125-20260808-222432/`
- Dump custom : `loyertracker-prod-20260808-222432.dump`
  - SHA-256 : `43e08fce11e0ab877c28575df6f7c6b977029ee72947b8580692a5c2b77d3915`
- Globals : `loyertracker-prod-20260808-222432-globals.sql`
  - SHA-256 : `537c67925d7712a424aa112f98de7168b85a93048accf8999e220a7d1958a512`
- `pg_restore --list` : `858` entrées.
- Permissions des fichiers : `600`.

## Artefact candidat Staging vérifié

```text
API: ghcr.io/cgpa-delivery/loyertracker-api@sha256:8e94c002a65bff590c9694b1dd79ca2eb9ab04639f9f59ddb5b735afe001a30d
Web: ghcr.io/cgpa-delivery/loyertracker-web@sha256:18ade4b483955691fedd7d46a2c893ff27facd9d6dcf5249350005080d679d67
Commit: d19c4fea850263c5bfbb92fcb288dd7bd2e56e2a
Tag lookup: sha-d19c4fea
```

Staging correspondant : `STG-ISOL-01 PASS`, smoke `63 PASS / 0 FAIL`, Flyway `32/32`. La preuve fusionnée est `docs/cgpa/07-devsecops/gate-staging-us125-decision.md`.

## Bloqueurs formels avant Gate Production GO

`CHECK-REL-01` reste incomplet sur les points suivants :

1. Release Candidate immutable identifiée par une version RC SemVer, et non uniquement par un tag SHA de build.
2. Release notes et changelog promus pour la RC.
3. Rapport QA et avis QA Lead tracés.
4. Avis Release Manager et Delivery Architect tracés.
5. Décision Gate 07A tracée.
6. `CHECK-OPS-01` pré-Production complétée avec avis SRE, escalade, alertes et conditions de rollback formellement assignés.
7. Validation métier/Product Owner de la release Production tracée séparément du GO Staging.

## Interdictions maintenues

- Aucun déploiement Production.
- Aucun changement de `.env` Production.
- Aucune migration Production V32 exécutée.
- Aucun provider, secret, flag ou kill-switch modifié.
- Aucun artefact reconstruit : la RC devra pointer vers les mêmes digests validés en Staging.

## Prochaine séquence autorisée

```text
préparer Release Candidate immutable 1.17.0-rc.1
→ compléter CHECK-REL-01
→ compléter CHECK-OPS-01 pré-Production
→ obtenir avis QA / RM / Delivery Architect / PO
→ instruire Gate 07A
→ réinstruire Gate Production
→ décision explicite distincte avant tout déploiement
```
