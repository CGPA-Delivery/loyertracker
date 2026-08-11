# Gate Staging US-141 — décision et preuves

- **Projet :** LoyerTracker
- **US :** US-141 — Gate Staging du pilote (EP-17 Lot 5)
- **Référentiel :** CGPA v6.1.1
- **Date d'exécution :** 2026-08-11
- **Environnement :** `ai-test-server` — Staging mutualisé
- **Décision :** **GO — STAGING_DEPLOYED**
- **Commit candidat :** `0ed7525fd53637373da42b78a68a214280dd3882`
- **Workflow CI :** [main CI #31483835611](https://github.com/CGPA-Delivery/loyertracker/actions/runs/31483835611)

## Prérequis

- **US-140 (Gate 04A pilote)** : GO sous réserve (2026-08-10), `gate-04A-decision-ep17-lot5.md` §6.
- **US-136 (Accessibilité)** : 6/6 flux Keycloak PASS (PR #437, #438). `RSV-EP17-US136-A11Y-01` levée.
- **US-137 (Responsive)** : GO sous réserve (2026-08-11) — seuls Dashboard Bailleur et Login Keycloak réellement vérifiés PASS ; autres routes pilotées redirigent vers `/bailleur`. Réserves RES-01→RES-04 documentées et rectifiées par preuves US-138.
- **US-138 (Régression visuelle)** : GO sous réserve (2026-08-11) — captures Chromium 640px/390px produites ; Dashboard Bailleur PASS, Login Keycloak `overflowX=10`, baseline US-127 absente et routes Gestionnaire/Profil inaccessibles. `DD-611-04` en traitement.
- **US-139 (Documentation)** : non exécuté — ne bloque pas le Gate Staging.

## Artefact promu

Aucune reconstruction d'image — les PR US-136 (#437, #438, #439) n'ont modifié que le CSS Keycloak (monté en volume), les tests Playwright et la documentation. Les images Docker sont inchangées depuis US-125 :

```text
API: ghcr.io/cgpa-delivery/loyertracker-api@sha256:8e94c002a65bff590c9694b1dd79ca2eb9ab04639f9f59ddb5b735afe001a30d
Web: ghcr.io/cgpa-delivery/loyertracker-web@sha256:18ade4b483955691fedd7d46a2c893ff27facd9d6dcf5249350005080d679d67
Tag de lookup: sha-d19c4fea
```

Publication GHCR, signatures Cosign, provenance GitHub et attestations SBOM : **vérifiées** (run #31280103642, US-125).

## STG-ISOL-01 — PASS

- 9 conteneurs actifs ; 8 conteneurs préfixés `loyertracker-staging-*`.
- NPM mutualisé `nginx-proxy-manager` inchangé, `restart=0`.
- Réseau dédié : `loyertracker-staging_loyertracker-net`.
- Volume PostgreSQL dédié : `loyertracker-staging_postgres-data`.
- Services internes API, Keycloak et PostgreSQL non publiés.
- Ports Web Staging conservés : `18080` / `18443`.
- Aucun `docker down` global, `prune`, suppression de volume/réseau ou commande interprojet.
- Aucun conteneur recréé — fast-forward documentaire uniquement.

## Préflight et sauvegarde

- Instance Staging `i-0156f2672ee800e5a` était **stopped** — démarrée avant exécution.
- Dépôt Staging synchronisé : `d19c4fe` → `0ed7525` (fast-forward).
- Aucune migration Flyway ajoutée depuis US-125 : `32/32` inchangé.
- Production reste à `1.17.0-rc.1` ; aucune promotion Production effectuée.

## Vérifications post-déploiement

- API/Web/Keycloak/PostgreSQL : healthy.
- `/healthz` via HTTPS Staging (`localhost:18443`) : `200`.
- Actuator Prometheus interne : `200`.
- Smoke réel : **63 PASS / 0 FAIL**.
- JWT Keycloak réel et issuer portless : PASS.
- Autorisation Gestionnaire/ReBAC et isolation cross-tenant : PASS.
- RGPD export/effacement et audit : PASS.
- Ports internes non publiés : PASS.
- Échafaudage `directAccessGrants` : révoqué en fin de smoke.

## Décision de suite

Le Gate Staging US-141 confirme que le pilote (Lots 1-4 + validations Lot 5) est opérationnel en conditions Staging réelles. Il **n'autorise pas** la Production. La chaîne suivante reste obligatoire :

```text
recette / smoke complémentaire
→ Release Candidate immutable
→ CHECK-REL-01
→ Gate Production distinct
```

Les réserves restantes du Lot 5 (`CHECK-RESPONSIVE-01`, `CHECK-DESIGN-01`, `DD-EP17-10`, `DD-611-02/03`) doivent être traitées avant clôture du Lot, mais ne bloquent pas ce Gate Staging.
