# Gate Staging — EP-17 Lot 5 : uniformisation visuelle

| Champ | Valeur |
|---|---|
| Date d'exécution | 2026-08-13 |
| Décision | **GO / STAGING_DEPLOYED** |
| Périmètre | PR #470 — DD-EP17-04, DD-EP17-06, DD-EP17-07, DD-EP17-09, DD-EP17-11 |
| Commit `main` candidat | `f95b68b8629652f3d6e3a83ccbeb49b8759d0c3d` |
| Merge PR #470 | `f95b68b8629652f3d6e3a83ccbeb49b8759d0c3d` |
| Environnement | `ai-test-server` / Staging LoyerTracker |
| Autorisation | Product Owner / CDO : « Approuvé » |

## 1. Artefacts immuables promus

Aucune reconstruction n'a été faite sur Staging. Les images GHCR publiées, signées et attestées par la CI du commit `f95b68b` ont été tirées par digest exact puis affectées à `API_IMAGE_REF` et `WEB_IMAGE_REF` sur l'hôte Staging.

| Service | Référence immutable |
|---|---|
| API | `ghcr.io/cgpa-delivery/loyertracker-api@sha256:a7fec33019bfb488b28ee92c49126354fe7a3b685e108d5d0dbe9680c191edfe` |
| Web | `ghcr.io/cgpa-delivery/loyertracker-web@sha256:e1f589346210724105497b10aca20304850edb30501090a2fddfede9902774dc` |

La CI `main` de cette RC a produit les contrôles SUCCESS : CI, CodeQL Java/Kotlin et JavaScript/TypeScript, Gitleaks/SCA/Trivy, Accessibilité E2E (Playwright + axe), Registry Policy et CGPA Framework Audit. Les signatures Cosign, attestations de provenance et SBOM ont été vérifiées dans le job de publication.

## 2. STG-ISOL-01 et déploiement ciblé

### Préflight

- Hôte Staging joint via réseau privé ; dépôt synchronisé de `f59971d` vers `f95b68b` par fast-forward uniquement.
- Variables `API_IMAGE_REF` et `WEB_IMAGE_REF` présentes, remplacées exclusivement par les digests candidats.
- `docker compose -f docker-compose.staging.yml config --quiet` : PASS.
- Sauvegarde pré-déploiement créée avant toute recréation :
  - `loyertracker-staging-pre-lot5-20260813T120507Z.dump`
  - `loyertracker-staging-pre-lot5-20260813T120507Z-globals.sql`
  - checksum SHA-256 versionné localement sur l'hôte dans `loyertracker-staging-pre-lot5-20260813T120507Z.sha256`.

### Exécution bornée

Commande appliquée :

```bash
docker compose -f docker-compose.staging.yml pull api nginx
docker compose -f docker-compose.staging.yml up -d --no-deps api nginx
```

Seuls `loyertracker-staging-api-1` et `loyertracker-staging-nginx-1` ont été recréés. PostgreSQL, Keycloak et les services de monitoring sont restés actifs. Des conteneurs monitoring signalés comme orphelins par le Compose sans overlay n'ont été ni supprimés ni modifiés.

## 3. Preuves d'exécution

| Contrôle | Résultat |
|---|---|
| API Docker healthcheck | `healthy` |
| Nginx Docker healthcheck | `healthy` |
| API interne | `GET /api/actuator/health` → `{"status":"UP"}` |
| Nginx interne | `GET /healthz` → `ok` |
| SPA HTTPS Staging | HTTP `200`, `text/html`, titre `LoyerTracker` |
| Smoke canonique | **63 PASS / 0 FAIL** |
| Auth scaffolding smoke | révoqué en fin de script (`directAccessGrants=false`) |
| Tests frontend locaux associés au merge | **234/234 SUCCESS** |

Le smoke a couvert l'émission JWT Keycloak réelle, les parcours bailleur/gestionnaire, invitation et acceptation publique, isolation cross-tenant, RLS/ReBAC, paiements/honoraires, RGPD, audit et vérification publique de quittance.

## 4. Validation fonctionnelle du périmètre Lot 5

Le déploiement contient les changements intégrés par PR #470 :

- `lt-data-table` adopté sur les listes Alertes, Audit et Dashboard Gestionnaire ;
- tokens de spacing utilisés par les composants concernés ;
- convention et sélecteurs `data-testid` introduits ;
- breakpoint/radius de `VerifyReceiptComponent` harmonisés ;
- intégration Lot 3 `lt-confirm-dialog` et `lt-toast` préservée lors du merge.

La CI incluait le test Accessibilité E2E Playwright + axe. La vérification navigateur externe directe n'a pas été réalisée depuis l'agent : l'URL publique a retourné `ERR_INVALID_AUTH_CREDENTIALS` et l'IP avec certificat Staging a retourné `ERR_CERT_AUTHORITY_INVALID`, ce qui ne remet pas en cause la preuve HTTPS interne validée avec le certificat de l'environnement. Une revue humaine UI des trois tables est maintenue comme étape de recette, non comme condition bloquante du présent Gate technique.

## 5. Décision et limites

**GO / STAGING_DEPLOYED** est accordé pour l'artefact immutable listé, dans le seul environnement Staging.

Ce GO :

- ne constitue pas une autorisation Production ;
- ne modifie ni DNS, ni politique DMARC, ni données métier hors données éphémères du smoke ;
- conserve le rollback : restaurer les précédents `API_IMAGE_REF`/`WEB_IMAGE_REF` depuis `.env.bak-pre-lot5-20260813T120507Z`, puis recréer seulement `api` et `nginx` avec `--no-deps` ;
- requiert, avant toute promotion Production, une Release Candidate explicitement approuvée, les contrôles `CHECK-REL-01` et `CHECK-OPS-01`, un Gate Production distinct, et une validation humaine finale.
