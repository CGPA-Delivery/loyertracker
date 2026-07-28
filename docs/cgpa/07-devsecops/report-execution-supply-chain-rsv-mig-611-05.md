# Rapport d'Exécution — supply-chain RSV-MIG-611-05

## Identification

| Champ | Valeur |
|---|---|
| Plan approuvé | `PE-SC-RSV-MIG-611-05` |
| Branche | `agent/supply-chain-rsv-mig-611-05` |
| Pull Request | #284 |
| Base | `main` — `4c39aa8ea6ba4abccabbc80a2a2731f15053cdbd` |
| Date | 2026-07-28 |
| Statut | Validation humaine finale reçue — preuves post-fusion requises |

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
| Tests `infra/ci/test-artifact-scope.sh` | PASS — 11/11 |
| Tests `infra/ci/test-supply-chain.sh` | PASS |
| Syntaxe Bash des quatre scripts concernés | PASS |
| `check-release-state.sh --ci` | PASS |
| YAML du workflow | PASS |
| `docker compose config --no-interpolate` Staging | PASS |
| `docker compose config --no-interpolate` Production | PASS |
| Tests de l'auditeur CGPA | PASS — 9/9 |
| Audit structurel local | PASS — 97/97 |
| `git diff --check` | PASS |

## Preuves distantes de la PR

Les preuves suivantes sont acquises au commit
`9f7b19153cf39eed4bd536a9fb4431e828fae970` :

| Contrôle | Preuve | Résultat |
|---|---|---|
| CI | run `30349568577` | PASS |
| Backend, Frontend et Sécurité | jobs du run `30349568577` | PASS |
| Détection changements images | job `90243607922` | PASS |
| Build unique, scans et SBOM API/Web | job `90244351038` | PASS |
| Publication, signatures et attestations | job `90245031177` | SKIPPED attendu sur Pull Request |
| CodeQL | run `30349568482` | PASS Java/Kotlin et JavaScript/TypeScript |
| Audit CGPA | run `30349568388` | PASS |

Le job `Build, scan et SBOM Docker` a construit chaque image une fois, scanné l'image exacte,
produit son SBOM SPDX, exporté les deux images et transféré l'ensemble sans reconstruction. Le job
à permissions élevées n'a pas été exécuté sur l'événement Pull Request. La CI signale une
observation non bloquante préexistante : l'action Gitleaks épinglée cible Node.js 20 et est forcée
par GitHub Actions à s'exécuter avec Node.js 24.

Les signatures, attestations, digests publiés et le manifeste ne peuvent être prouvés que sur le
run post-fusion `main`.

## CHECK-CICD-01 et Gates

CHECK-CICD-01 est **PASS au jalon Test CI de la PR**. La publication immuable, les signatures,
attestations et le manifeste restent non exécutés et ne pourront être évalués qu'au jalon
post-fusion `main`. Le Gate 06A historique n'est pas rejoué. Aucun Gate Staging, Gate 07A, Gate
Production ou Gate 10 n'est ouvert par cette implémentation.

## Rollback

Une PR de `git revert` du commit de fusion restaurera le workflow et les contrats précédents.
Les images, SBOM, signatures, attestations et manifestes déjà produits seront conservés. Aucun
rollback ne supprime un package et aucun historique n'est réécrit.

## Décision humaine finale

Le 2026-07-28, après mise à disposition de la PR prête pour revue et de ses preuves, le validateur
humain a déclaré dans la conversation de pilotage : « tu peux fusionner ». Cette décision vaut
**GO humain final pour la fusion de #284** sur le commit
`9f7b19153cf39eed4bd536a9fb4431e828fae970`. Le commit documentaire qui enregistre cette
décision doit conserver tous les contrôles requis au vert avant la fusion protégée.

Après fusion, le run `main` devra prouver publication, signatures, attestations, manifeste et
absence de reconstruction. `RSV-MIG-611-05` reste ouverte jusque-là.
