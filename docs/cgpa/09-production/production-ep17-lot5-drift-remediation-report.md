# Rapport de remédiation de dérive Production — EP-17 Lot 5

| Champ | Valeur |
|---|---|
| Date | 2026-08-13 |
| Autorisation | PO/CDO : « Approuvé » pour la remédiation contrôlée |
| Périmètre | Réalignement des images API/Web et de l'état versionné après Gate Staging Lot 5 |
| Décision technique | **PASS — Production réalignée** |
| Commit dépôt hôte | `c3bb093f54e53f7de124de4b4bbef7d390a51f37` |
| Artefact applicatif source | PR #470 / commit `f95b68b8629652f3d6e3a83ccbeb49b8759d0c3d` |

## 1. Cause de la dérive constatée

Le contrôle hôte `infra/release/check-release-state.sh --host` a détecté quatre écarts : les références `API_IMAGE_REF` et `WEB_IMAGE_REF` n'étaient pas renseignées dans l'environnement Production, les conteneurs API/Web exécutaient des tags locaux, et `production-state.env` déclarait les digests historiques de la RC antérieure.

Flyway était déjà cohérent : 32 migrations appliquées pour 32 attendues.

## 2. Preuves supply-chain de la cible

Publication CI du commit `f95b68b`, workflow CI `31695769351` : build, scans, SBOM, publication GHCR sans écrasement, signature Cosign, provenance et attestations SBOM vérifiés avec succès.

| Service | Digest promu |
|---|---|
| API | `ghcr.io/cgpa-delivery/loyertracker-api@sha256:a7fec33019bfb488b28ee92c49126354fe7a3b685e108d5d0dbe9680c191edfe` |
| Web | `ghcr.io/cgpa-delivery/loyertracker-web@sha256:e1f589346210724105497b10aca20304850edb30501090a2fddfede9902774dc` |

Les deux pulls GHCR exacts ont été validés depuis le daemon Docker Production avant la recréation.

## 3. Exécution bornée et sauvegarde

Avant toute mutation : sauvegarde logique PostgreSQL, globals et checksum SHA-256 générés, ainsi qu'une copie de `.env`. Les backups sont conservés hors dépôt Git avec permissions restreintes.

Le dépôt hôte a été réaligné de façon non ambiguë sur `origin/main` puis seules les références digest API/Web ont été ajoutées à `.env`. Les profils SMTP Production sont restés désactivés : les valeurs de substitution n'ont existé qu'en mémoire pour l'interpolation Compose et n'ont jamais été écrites dans `.env`.

La portée Docker a été strictement limitée à :

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps api nginx
```

PostgreSQL et Keycloak n'ont pas été recréés.

## 4. Validation post-déploiement

| Contrôle | Résultat |
|---|---|
| API Docker healthcheck | PASS (`healthy`) |
| Nginx Docker healthcheck | PASS (`healthy`) |
| Keycloak / PostgreSQL | PASS, restés `healthy` |
| API `/api/actuator/health` | PASS (`{"status":"UP"}`) |
| Nginx `/healthz` | PASS (`ok`) |
| SPA HTTPS publique | PASS (HTTP 200, titre `LoyerTracker`) |
| Smoke Production canonique | **PASS — 65 PASS / 0 FAIL** |
| Flyway | PASS — 32 migrations |
| Auth scaffolding smoke | Révoqué automatiquement (`directAccessGrants=false`) |

Le smoke a démontré les JWT Keycloak réels, les parcours métier bailleur/gestionnaire, invitation, RLS/ReBAC et isolation inter-tenant, protections AuthN/ports, RGPD et surface publique de vérification de quittance.

## 5. Rollback

En cas de régression : restaurer uniquement les deux anciennes références depuis la copie `.env` pré-déploiement, puis recréer exclusivement `api` et `nginx` avec `--no-deps`. Le backup PostgreSQL n'est requis qu'en cas d'incident de données, aucune migration n'ayant été appliquée dans cette promotion.

## 6. Conditions restantes

Cette remédiation clôt la dérive runtime et fournit les preuves techniques de `CHECK-REL-01` / `CHECK-OPS-01`. Elle ne vaut pas à elle seule approbation d'un changement SMTP Keycloak ni extension de périmètre. La formalisation Gate Production et la mise à jour versionnée du verrou d'état sont proposées dans cette même livraison documentaire.