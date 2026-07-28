# Rapport d'Exécution — supply-chain RSV-MIG-611-05

## Identification

| Champ | Valeur |
|---|---|
| Plan approuvé | `PE-SC-RSV-MIG-611-05` |
| Branche | `agent/supply-chain-rsv-mig-611-05` |
| Base | `main` — `4c39aa8ea6ba4abccabbc80a2a2731f15053cdbd` |
| Date | 2026-07-28 |
| Statut | Implémentation locale — preuves PR et post-fusion requises |

## Périmètre exécuté

- séparation du scan source et du build d'images ;
- construction unique de chaque image API/Web ;
- scan Trivy et SBOM SPDX sur l'image exacte ;
- transfert de cette image exacte vers un job de publication distinct, sans reconstruction ;
- permissions `packages`, `id-token`, `attestations` et `artifact-metadata` limitées au job
  `main` de publication ;
- refus de publication si le tag `sha-<8>` existe déjà ;
- résolution et vérification des digests distants ;
- signature Cosign keyless et vérification de l'identité OIDC du workflow ;
- attestations GitHub de provenance et de SBOM, puis vérification ;
- manifeste de release avec commit, digests, empreintes SBOM et statuts de vérification ;
- contrats Staging et Production convertis vers `API_IMAGE_REF` et `WEB_IMAGE_REF` ;
- verrou d'état de release et smoke Production alignés sur les digests ;
- documentation Delivery et runbook actifs alignés.

## État Production historique préservé

Le tag historique `sha-27dce09d` n'est ni modifié ni supprimé. Ses références ont été résolues en
lecture seule depuis GHCR et enregistrées pour assurer la transition du modèle d'état :

- API : `ghcr.io/jptshilombo/loyertracker-api@sha256:089028b45a93afd4f12d5aa22cfc63a38f5687bb1d0f7204bc1965154ce8d7ff` ;
- Web : `ghcr.io/jptshilombo/loyertracker-web@sha256:7dbc551ee722e1da7697d71749b94a731fce0b028b7b7288c88d8346488e8bc8`.

Cette inscription documentaire ne constitue pas un redéploiement.

## Contrôles locaux

| Contrôle | Résultat |
|---|---|
| Tests `infra/ci/test-supply-chain.sh` | PASS |
| Syntaxe Bash des quatre scripts concernés | PASS |
| `check-release-state.sh --ci` | PASS |
| YAML du workflow | PASS |
| `docker compose config --no-interpolate` Staging | PASS |
| `docker compose config --no-interpolate` Production | PASS |
| `git diff --check` | PASS |

Les tests applicatifs, scans distants, SBOM réelles et contrôles GitHub restent à acquérir sur la
PR. Les signatures, attestations et le manifeste publiant ne peuvent être prouvés que sur le run
post-fusion `main`.

## CHECK-CICD-01 et Gates

CHECK-CICD-01 n'est pas encore déclaré PASS pour le lot : les preuves PR et post-fusion manquent.
Le Gate 06A historique n'est pas rejoué. Aucun Gate Staging, Gate 07A, Gate Production ou Gate 10
n'est ouvert par cette implémentation.

## Rollback

Une PR de `git revert` du commit de fusion restaurera le workflow et les contrats précédents.
Les images, SBOM, signatures, attestations et manifestes déjà produits seront conservés. Aucun
rollback ne supprime un package et aucun historique n'est réécrit.

## Décision requise

Après CI PR conforme, une validation humaine finale distincte est obligatoire avant fusion. Après
fusion, le run `main` devra prouver publication, signatures, attestations, manifeste et absence de
reconstruction. `RSV-MIG-611-05` reste ouverte jusque-là.
