# ADR-CICD-001 - CI/CD Promotion Architecture

## Statut

Acceptee.

## Contexte

Les projets CGPA doivent eviter les deploiements implicites, les promotions non tracees et les mises en Production declenchees par simple merge.

## Decision

Le modele officiel de promotion est :

Developpeur -> Feature Branch -> CI -> Dev Server -> Pull Request -> Gate Staging -> Staging -> Release Candidate -> Gate Production -> Production -> Monitoring post-release.

## Regles

* Un push sur `feature/*` declenche la CI, pas une promotion non controlee.
* Le Dev Server peut etre deploye automatiquement si la CI est conforme.
* Staging exige CHECK-CICD-01 et Gate Staging.
* Production exige Release Candidate, CHECK-REL-01, CHECK-OPS-01 et Gate Production.
* Les artefacts promus doivent etre identifiables, versionnes et rollbackables.

## Consequences

* Le pipeline reste automatisable.
* Les promotions restent gouvernees.
* Les preuves deviennent auditables.