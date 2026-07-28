# Enterprise Delivery Strategy — LoyerTracker

## Branch Strategy

GitHub Flow adapté : branche dédiée par lot, Pull Request vers `main`, checks requis stricts et
résolution des conversations. Écriture directe sur `main` interdite. Validation humaine finale
requise pour les changements structurants.

## Promotion Strategy

Local/Dev -> Test CI -> Staging mutualisé -> Production dédiée. Un merge publie un candidat mais
n'autorise aucune promotion. Gate 06A, CHECK-CICD-01, STG-ISOL-01 et Gate Staging précèdent
Staging. La RC exacte, CHECK-REL-01, Gate 07A, CHECK-OPS-01 pré-Production et Gate 09 précèdent
Production.

## Release Strategy

SemVer. Release Candidate identifiée par commit, tag de recherche et références digest. Même artefact entre Staging
et Production. Le pipeline classe le delta par rapport aux contextes Docker avant le Packaging :
un changement sans impact image ne construit ni ne publie de nouvel artefact GHCR. Les images
publiées portent exclusivement le tag de recherche non réutilisable `sha-<8>` ; l'alias mutable
`latest` est interdit. Les promotions utilisent les références digest exactes API/Web du manifeste
de release, accompagnées de SBOM, signatures keyless et attestations. Les tags `latest`
historiques ne sont ni supprimés ni réécrits par cette évolution.

Les deux alias historiques encore présents dans GHCR sont placés en **quarantaine** : `latest`
reste figé sur les versions, digests et tags SHA inventoriés dans
`infra/ci/legacy-latest-policy.json`, sans autorité de promotion. Un workflow en lecture seule
contrôle quotidiennement leur absence de dérive et refuse toute référence applicative active.
La suppression physique est différée : l'API GitHub Packages documente la suppression d'une
version, pas le détachement d'un tag individuel, alors que chaque version concernée porte aussi
le tag historique légitime `sha-19d0d0a4`. Aucun alias de remplacement n'est créé.

## Rollback Strategy

Références digest applicatives précédentes, sauvegarde/restauration données,
configuration/infrastructure et feature flags selon applicabilité. Conditions et preuves sont
propres à chaque RC ; aucun rollback ne reconstruit l'artefact.

## Observability Strategy

Logs, métriques, dashboards, alertes, smoke et hypercare. CHECK-OPS-01 sépare readiness
pré-Production et contrôle post-Production/Gate 10.

## Operations Readiness

Capacité réelle mais contrôle futur obligatoire par CHECK-OPS-01. L'arrêt volontaire de l'hôte
Production limite la continuité de télémétrie et doit être qualifié à chaque décision.

## Delivery Capability Level

- Delivery Capability Level actuel : **non déclaré — évaluation formelle en attente**.
- Hypothèse d'audit : capacités proches de DCL 3, sans décision.
- Delivery Capability Level cible : **DCL 4**, après preuve build-once, immutabilité registry,
  rollback courant, observabilité qualifiée et contrôles v6.1.1 exécutés.
