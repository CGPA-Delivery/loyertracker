# Gate Staging US-125 — décision et preuves

- **Projet :** LoyerTracker
- **US :** US-125 Notifications
- **Référentiel :** CGPA v6.1.1
- **Date de décision :** 2026-08-08T22:09:25Z
- **Validateur humain :** CDO / Enterprise Architect — validation explicite reçue dans le canal de livraison
- **Environnement :** `ai-test-server` — Staging mutualisé
- **Décision :** **GO — STAGING_DEPLOYED**
- **Commit candidat :** `d19c4fea850263c5bfbb92fcb288dd7bd2e56e2a`
- **Workflow de production :** [main CI #31280103642](https://github.com/CGPA-Delivery/loyertracker/actions/runs/31280103642)

## Artefact immuable promu

```text
API: ghcr.io/cgpa-delivery/loyertracker-api@sha256:8e94c002a65bff590c9694b1dd79ca2eb9ab04639f9f59ddb5b735afe001a30d
Web: ghcr.io/cgpa-delivery/loyertracker-web@sha256:18ade4b483955691fedd7d46a2c893ff27facd9d6dcf5249350005080d679d67
Tag de lookup: sha-d19c4fea
```

Publication GHCR, signatures Cosign, provenance GitHub et attestations SBOM : **vérifiées**.

## STG-ISOL-01 — PASS

- 9 conteneurs actifs ; 8 conteneurs préfixés `loyertracker-staging-*`.
- NPM mutualisé `nginx-proxy-manager` inchangé, `restart=0`.
- Réseau dédié : `loyertracker-staging_loyertracker-net`.
- Volume PostgreSQL dédié : `loyertracker-staging_postgres-data`.
- Services internes API, Keycloak et PostgreSQL non publiés.
- Ports Web Staging conservés : `18080` / `18443`.
- Aucun `docker down` global, `prune`, suppression de volume/réseau ou commande interprojet.
- Seuls `loyertracker-staging-api-1` et `loyertracker-staging-nginx-1` ont été recréés.

## Préflight et sauvegarde

- Backup PostgreSQL custom : `loyertracker-staging-20260808-220627.dump`
  - SHA-256 : `7445b35bd5f1ccac2530ade5785aba136928eaa9330fac7c23757f60c1c378dc`
- Globals PostgreSQL : `loyertracker-staging-20260808-220627-globals.sql`
  - SHA-256 : `ac79437acbb67a3bbc251f73924290380abd66427e6e0aad88b2d1201c0137da`
- Flyway candidat : `32/32`.
- Production reste déclarée à `31/31` ; aucune promotion Production effectuée.

## Vérifications post-déploiement

- API/Web : healthy.
- `/healthz` via HTTPS Staging : `200`.
- Actuator Prometheus interne : `200`.
- Actuator Prometheus public : `404`.
- Smoke réel : **63 PASS / 0 FAIL**.
- JWT Keycloak réel et issuer portless : PASS.
- Autorisation Gestionnaire/ReBAC et isolation cross-tenant : PASS.
- RGPD export/effacement et audit : PASS.
- Ports internes non publiés : PASS.
- Échafaudage `directAccessGrants` : révoqué en fin de smoke.

## Décision de suite

Le Gate Staging US-125 autorise la préparation de la recette Staging et du Release Candidate immutable. Il **n'autorise pas** la Production. La chaîne suivante reste obligatoire :

```text
recette / smoke complémentaire
→ Release Candidate immutable
→ CHECK-REL-01
→ Gate Production distinct
```
