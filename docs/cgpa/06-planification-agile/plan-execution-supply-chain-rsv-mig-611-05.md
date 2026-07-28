# Plan d'Exécution — capacités supply-chain résiduelles de RSV-MIG-611-05

## 1. Identification et statut

| Champ | Valeur |
|---|---|
| Référence | `PE-SC-RSV-MIG-611-05` |
| Version | 1.0 |
| Date de proposition | 2026-07-28 |
| Réserve traitée | `RSV-MIG-611-05` |
| Nature | DevSecOps / Enterprise Delivery Governance |
| Statut | **PROPOSÉ — approbation humaine requise** |
| Autorité finale | CGPA Chief Delivery Officer v6.1.1 |
| Validation requise | Revue et approbation humaines explicites avant toute implémentation |

Ce document est un Plan d'Exécution. Il ne constitue ni une preuve d'implémentation, ni un
CHECK-CICD-01 PASS, ni un Gate 06A, ni une autorisation de promotion Staging ou Production.

## 2. Contexte et preuves disponibles

La migration CGPA v6.1.1 et le lot Delivery précédent ont livré :

- le déclenchement sélectif du Packaging Docker ;
- l'absence de reconstruction et de publication sur un changement documentaire ;
- la suppression de la publication de l'alias mutable `latest` ;
- la publication des images API et Web sous un tag dérivé du commit, `sha-<8>`.

Les preuves correspondantes sont enregistrées dans `docs/project-state.md`, notamment les PR
#281 et #282 et leurs contrôles post-fusion. Elles ne sont pas rejouées.

L'audit en lecture seule du 2026-07-28 constate encore :

- deux constructions distinctes d'une même image : une dans le contrôle Sécurité, une dans le
  Packaging ; le build-once n'est donc pas démontré ;
- aucune SBOM publiée pour les images livrées ;
- aucune signature cryptographique des images ;
- aucune attestation de provenance SLSA ;
- aucune preuve de refus d'écrasement d'un tag déjà publié ;
- des promotions Staging et Production exprimées par tag partagé, et non par références digest
  exactes.

L'absence de ces preuves ne démontre pas une compromission. Elle maintient ouverte la réserve
`RSV-MIG-611-05`.

## 3. Objectif

Produire une chaîne supply-chain contrôlée dans laquelle chaque image API ou Web affectée est :

1. construite une seule fois ;
2. analysée avant publication ;
3. accompagnée d'une SBOM ;
4. publiée sans écraser un tag existant ;
5. identifiée par son digest ;
6. signée sans clé statique ;
7. accompagnée d'attestations signées de provenance et de SBOM ;
8. vérifiée après publication ;
9. promouvable uniquement par la référence digest exacte enregistrée dans un manifeste de release.

Le niveau revendiqué à l'issue du lot sera limité à **SLSA v1 Build Level 2**, et seulement si les
attestations GitHub sont générées et vérifiées. Le niveau 3, qui requiert notamment une
architecture de workflow réutilisable et renforcée, est hors périmètre de ce lot.

## 4. Décisions d'architecture proposées

L'approbation humaine de ce Plan vaut acceptation des décisions suivantes pour l'implémentation :

1. **Build-once** : le job Sécurité conserve SAST, SCA, secret scan et scan filesystem ; la
   construction des images, leur scan, leur SBOM, leur publication et leurs preuves sont réunis
   dans une chaîne unique par image.
2. **Publication tardive** : sur Pull Request, les images sont construites, scannées et
   documentées sans publication. Sur `main`, l'authentification au registry et la publication
   n'interviennent qu'après les contrôles bloquants.
3. **Digest canonique** : les références `API_IMAGE_REF` et `WEB_IMAGE_REF`, sous la forme
   `ghcr.io/...@sha256:...`, deviennent l'identité canonique de promotion. Le tag `sha-<8>` reste
   un index lisible, non une autorité de promotion.
4. **Défense contre l'écrasement** : avant publication, la chaîne refuse un tag déjà présent.
   Après publication, le digest distant est résolu et utilisé pour toutes les preuves.
5. **Signature keyless** : Cosign utilise l'identité OIDC du workflow GitHub, sans secret de clé
   privée persistant.
6. **Attestations GitHub** : provenance de build et SBOM sont attestées pour le digest publié.
   Les nouvelles actions GitHub sont épinglées à un commit complet après vérification de leur
   source et de leur version.
7. **Immutabilité compensatoire** : l'inventaire documentaire ne prouve pas un verrou natif de
   tag immuable dans GHCR. Le refus d'écrasement, la promotion par digest, la signature et les
   attestations constituent les contrôles compensatoires. Toute capacité administrative de
   suppression du registry reste un risque de disponibilité à documenter, distinct de
   l'intégrité cryptographique.
8. **Non-rétroactivité** : aucun ancien artefact, tag, Gate ou historique n'est supprimé, réécrit,
   resigné ou attesté artificiellement.

## 5. Périmètre

### Inclus

- adaptation de `.github/workflows/ci.yml` ;
- suppression des builds Docker dupliqués dans le job Sécurité ;
- build, scan exact de l'image locale, génération SBOM SPDX JSON, push et résolution digest ;
- contrôle de non-écrasement des tags ;
- signature Cosign keyless et vérification avec identité/issuer attendus ;
- attestations signées de provenance et de SBOM, puis vérification ;
- génération et conservation d'un `release-manifest.json` ;
- passage des contrats Staging/Production du tag vers les deux références digest ;
- adaptation des scripts de contrôle release et smoke tests concernés ;
- mise à jour additive de la documentation Delivery et du Project State ;
- tests automatisés des scripts et rendu `docker compose config`.

### Exclus

- tout changement de code métier Backend ou Frontend ;
- toute migration de données ;
- tout déploiement ou promotion Staging/Production ;
- toute suppression ou mutation d'artefacts historiques ;
- tout renouvellement artificiel d'un Gate historique ;
- la migration immédiate vers SLSA Build Level 3 ;
- la fermeture de `RSV-MIG-611-05` sans preuves distantes et validation humaine finale.

## 6. Fichiers pressentis

L'implémentation pourra modifier, selon les résultats de l'inventaire détaillé :

- `.github/workflows/ci.yml` ;
- `docker-compose.staging.yml` ;
- `docker-compose.prod.yml` ;
- `infra/release/check-release-state.sh` ;
- `infra/smoke/smoke-stack.sh` ;
- de nouveaux scripts ciblés sous `infra/ci/` et leurs tests ;
- `docs/cgpa/environment-promotion-model.md` et les artefacts Delivery directement concernés ;
- `docs/project-state.md`.

La liste exacte sera enregistrée dans le rapport d'exécution. Les documents canoniques génériques
ne seront modifiés que si une incohérence normative est prouvée ; les preuves propres au projet
seront privilégiées.

## 7. Séquence d'exécution

1. Créer une branche dédiée depuis un `main` vert et synchronisé.
2. Inventorier les permissions GitHub Actions, packages et attestations réellement disponibles.
3. Définir les identités OIDC exactes autorisées pour signature et vérification.
4. Extraire ou ajouter des scripts testables pour le refus d'écrasement, le manifeste et les
   vérifications.
5. Restructurer le workflow afin de construire chaque image affectée une seule fois.
6. Scanner l'image locale exacte et générer sa SBOM avant toute publication.
7. Sur `main` uniquement, vérifier l'absence du tag, publier l'image exacte et résoudre son digest.
8. Signer le digest, produire les attestations de provenance et de SBOM, puis vérifier toutes les
   preuves.
9. Générer le manifeste de release avec commit complet, tag, références digest, empreintes des
   SBOM, workflow, run et résultats de vérification.
10. Adapter les contrats Compose et scripts pour consommer les références digest distinctes.
11. Exécuter les validations locales, ouvrir une PR Delivery et recueillir les preuves CI.
12. Mettre à jour CHECK-CICD-01 et le Project State sans déclarer de Gate non instruit.
13. Soumettre le résultat et les preuves à la validation humaine finale avant fusion.

## 8. Permissions et sécurité

Le workflow appliquera le moindre privilège. Les permissions élevées nécessaires à la publication
ou aux attestations (`packages`, `id-token`, `attestations`) seront portées uniquement par les jobs
et événements autorisés sur `main`. Les exécutions de Pull Request provenant d'un fork ne pourront
ni publier, ni signer, ni attester.

Les vérifications Cosign devront contraindre au minimum :

- l'issuer OIDC GitHub Actions attendu ;
- l'identité exacte du workflow du dépôt ;
- le digest attendu du manifeste.

Aucun secret de signature statique ne sera ajouté. Les logs et artefacts ne devront exposer ni
token ni secret.

## 9. Manifeste de release

Le manifeste versionné comme preuve de run comprendra au minimum :

- le SHA Git complet et le tag lisible ;
- les références digest complètes API et Web ;
- les empreintes et formats des SBOM ;
- l'identité du dépôt, du workflow et du run ;
- le statut des scans, signatures et attestations ;
- les commandes ou résultats de vérification reproductibles ;
- la date technique issue du run, sans date inventée.

Un manifeste incomplet ou incohérent bloque la déclaration de conformité et toute promotion.

## 10. Critères de validation

### Contrôles locaux et de Pull Request

- tests unitaires des scripts supply-chain : PASS ;
- syntaxe Bash et YAML : PASS ;
- `docker compose config` Staging et Production avec références digest de test : PASS ;
- construction unique démontrée par le graphe et les logs ;
- scan des images locales exactes : PASS ;
- SBOM SPDX JSON produites et lisibles ;
- absence de publication, signature et attestation sur les Pull Requests ;
- tests de refus d'un tag déjà existant : PASS ;
- `git diff --check` : PASS ;
- tests de l'auditeur CGPA et audit structurel : PASS.

### Preuves distantes sur `main`, après fusion autorisée

- images publiées sous tag non préexistant ;
- digests API et Web résolus et enregistrés ;
- signatures keyless vérifiées avec les contraintes d'identité ;
- attestations de provenance et de SBOM vérifiées ;
- manifeste de release complet et conservé ;
- absence de `latest` et absence de seconde construction de l'image ;
- preuve que les contrats de promotion utilisent les digests exacts.

Une PR ne peut pas fournir à elle seule la preuve de publication `main`. La fermeture finale de la
réserve nécessitera donc le run post-fusion, puis une clôture documentaire additive séparée si
nécessaire.

## 11. Gates et CHECK-CICD-01

Ce lot prépare les preuves du Gate 06A et de CHECK-CICD-01 sans les présumer. Les Gates historiques
valides ne sont pas rejoués. Aucun Gate Staging, Gate 07A, Gate Production ou Gate 10 n'est instruit
par ce Plan.

Tout échec de scan critique, de non-écrasement, de signature, d'attestation, de vérification ou de
cohérence digest est bloquant et impose `NO GO` pour la publication ou la promotion concernée.

## 12. Risques et mesures

| Risque | Niveau | Mesure prévue |
|---|---|---|
| Écart entre l'image scannée et l'image publiée | Bloquant | Build-once, digest et vérification post-push |
| Écrasement d'un tag existant | Bloquant | Contrôle pré-push et promotion par digest |
| Permissions OIDC trop larges | Majeur | Permissions par job et identité exacte à la vérification |
| Action tierce compromise ou flottante | Majeur | Épinglage par SHA complet et revue de provenance |
| SBOM incomplète ou non liée au digest | Majeur | Attestation et vérification du sujet digest |
| Rupture du contrat de déploiement | Majeur | Tests Compose et scripts sans promotion réelle |
| Indisponibilité/suppression administrative GHCR | Majeur | Conservation des manifestes et politique de restauration à documenter |
| Sur-déclaration SLSA ou DCL | Majeur | Limite explicite au niveau prouvé |
| Contribution IA non relue | Majeur | Traçabilité Project State et revue humaine obligatoire |

## 13. Rollback non destructif

Le rollback du changement consiste à :

1. suspendre toute promotion ;
2. ouvrir une PR de `git revert` du commit de fusion de l'implémentation ;
3. restaurer le contrat de workflow et de déploiement antérieur ;
4. conserver tous les artefacts, digests, signatures, attestations, SBOM et manifestes produits ;
5. documenter l'incident, la décision et les preuves dans le Project State.

Aucune suppression de package ou réécriture d'historique n'est prévue. Pour une release
applicative, le rollback pointera vers les références digest antérieures déjà validées ; il ne
reconstruira pas l'image.

## 14. Livrables attendus

- workflow supply-chain build-once ;
- scripts et tests automatisés ;
- SBOM API et Web ;
- signatures et attestations vérifiables ;
- manifeste de release par run publiant ;
- contrats de promotion par digest ;
- rapport d'exécution et CHECK-CICD-01 mis à jour ;
- Project State additif avec preuves, réserves et décision humaine.

## 15. Conditions d'approbation et action autorisée

Avant approbation, seule la revue de ce Plan est autorisée. Après approbation humaine explicite,
l'action autorisée sera l'implémentation sur une nouvelle branche et une nouvelle PR Delivery,
sans promotion d'environnement. Toute divergence substantielle — technologie de signature,
identité de promotion, niveau SLSA cible ou permissions — impose une mise à jour du Plan et une
nouvelle validation humaine.

La fusion de l'implémentation restera soumise aux contrôles requis, à la consolidation CGPA et à
une validation humaine finale distincte.
