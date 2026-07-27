# CGPA v6.1 - Enterprise Delivery Governance

## Positionnement

CGPA v6.1 est une evolution additive de CGPA v6.0. Elle ajoute un Enterprise Delivery Governance Pack pour gouverner la livraison logicielle de bout en bout : CI/CD, environnements, promotion, release, rollback, observabilite et exploitation post-deploiement.

CGPA v6.1 ne rejoue aucun Gate historique et ne remplace pas les packs existants. Il complete DevSecOps, Release Management, Staging Isolation, UX/Design Governance, Frontend Governance et Financial Governance.

## Objectif

Garantir qu'un changement applicatif circule de maniere controlee depuis le poste developpeur jusqu'a la Production :

Idee -> Architecture -> UX/Design -> Backlog -> Delivery Strategy -> CI/CD -> Dev Server -> Gate Staging -> Staging -> Release Candidate -> Gate Production -> Production -> Observability -> Operations.

## Principes directeurs

1. Le pipeline automatise, le Gate autorise, le Release Manager produit la decision specialisee de promotion et le CGPA Chief Delivery Officer conserve la decision CGPA finale.
2. Un push Git n'est jamais une autorisation de deploiement non controle.
3. Le deploiement Dev peut etre automatise apres CI conforme.
4. Staging est une promotion controlee, pas une simple branche Git.
5. Production n'est jamais deployee par simple merge sans Gate Production.
6. Tout artefact promu doit etre identifiable, versionne, tracable et rollbackable.
7. Les preuves CI/CD, Release et Operations alimentent `/docs/project-state.md`.

## Artefacts canoniques v6.1

### Delivery Pack

* `docs/cgpa/delivery/ADR-CICD-001.md` - CI/CD Promotion Architecture.
* `docs/cgpa/delivery/ADR-CICD-002.md` - Environment Promotion Model.
* `docs/cgpa/delivery/DELIVERY-PIPELINE-001.md` - Pipeline Standard.
* `docs/cgpa/delivery/ENV-001.md` - Environment Governance Standard.
* `docs/cgpa/delivery/REL-001.md` - Release Governance Standard.
* `docs/cgpa/delivery/OBS-001.md` - Observability Readiness Standard.
* `docs/cgpa/delivery/DELIVERY-CAPABILITY-MODEL.md` - Delivery Capability Levels.

### Workflows

* `docs/cgpa/workflows/ci-cd-standard-workflow.md`.
* `docs/cgpa/workflows/environment-promotion-workflow.md`.
* `docs/cgpa/workflows/release-candidate-workflow.md`.
* `docs/cgpa/workflows/rollback-workflow.md`.
* `docs/cgpa/workflows/post-release-monitoring-workflow.md`.

### Checklists

* `docs/cgpa/checklists/CHECK-CICD-01.md`.
* `docs/cgpa/checklists/CHECK-REL-01.md`.
* `docs/cgpa/checklists/CHECK-OPS-01.md`.

### Agents

* `docs/cgpa/agents/delivery-architect.md`.
* `docs/cgpa/agents/qa-lead.md`.
* `docs/cgpa/agents/site-reliability-engineer.md`.

## Delivery Governance

Tout projet doit definir, selon son risque :

* Branch Strategy : GitHub Flow, GitFlow, Trunk Based ou variante justifiee.
* Promotion Strategy : Local, Dev, Integration, QA, Staging, Pilot, Production.
* Release Strategy : Hotfix, Patch, Minor, Major, Release Candidate.
* Versioning : SemVer, Calendar Versioning ou convention documentee.
* CI/CD : build, tests, quality gates, packaging, deploiement et preuves.
* Rollback : application, base de donnees, infrastructure et feature flags si applicables.
* Observability : logs, metrics, traces, dashboards, alertes et smoke tests.

## Gates enrichis

CGPA v6.1 ne cree pas de Gate supplementaire obligatoire. Il enrichit les Gates existants :

* Gate 06A - DevSecOps Readiness : inclut strategie CI/CD et pipeline readiness.
* Gate Staging : exige CHECK-CICD-01 et STG-ISOL-01 si applicable.
* Gate 07A - Release Readiness : exige Release Candidate, CHECK-REL-01 et rollback.
* Gate Production : exige CHECK-REL-01, CHECK-OPS-01, observability readiness et rollback.

## Decisions v6.1

| Decision | Regle |
| --- | --- |
| D-CICD-01 | Tout changement significatif suit le workflow CI/CD standard. |
| D-CICD-02 | Aucun deploiement Dev ne doit etre declenche par un push non controle. |
| D-CICD-03 | Un deploiement automatique est autorise uniquement apres CI conforme. |
| D-CICD-04 | Aucune promotion Staging sans CHECK-CICD-01. |
| D-CICD-05 | Production n'est jamais deployee par simple merge sans Gate Production. |
| D-CICD-06 | Toute Release Candidate est identifiable, versionnee et immutable. |
| D-CICD-07 | Tout deploiement Production possede un rollback documente. |
| D-CICD-08 | Les preuves CI/CD et Release sont archivees et exploitables. |
| D-CICD-09 | Le monitoring post-release est obligatoire apres Production. |
| D-CICD-10 | Un incident critique suspend les promotions suivantes jusqu'a decision tracee. |

## Risques v6.1

* RSV-CICD-01 - Push declenchant un deploiement non controle.
* RSV-CICD-02 - Pipeline CI incomplet ou non reproductible.
* RSV-CICD-03 - Promotion Staging sans preuve CHECK-CICD-01.
* RSV-CICD-04 - Production declenchee par simple merge.
* RSV-CICD-05 - Release Candidate mutable ou non identifiable.
* RSV-CICD-06 - Rollback absent ou non teste.
* RSV-CICD-07 - Observabilite insuffisante apres release.
* RSV-CICD-08 - Incident post-release non bloquant pour les promotions suivantes.

## Delivery Capability Levels

| Niveau | Description |
| --- | --- |
| DCL 1 | Deploiements manuels, controles faibles, preuves partielles. |
| DCL 2 | CI automatisee, controles de base, environnements identifies. |
| DCL 3 | Dev/Staging automatises, Gates appliques, rollback documente. |
| DCL 4 | Releases tracables, observabilite complete, rollback eprouve. |
| DCL 5 | Delivery hautement automatisee, audit continu et amelioration continue. |

## Compatibilite

Les projets existants appliquent CGPA v6.1 lors du prochain changement CI/CD significatif, de la prochaine promotion Staging, de la prochaine Release Candidate ou du prochain passage Production. Les exemptions doivent etre tracees dans `/docs/project-state.md`.

## Decision

Toute evaluation CGPA v6.1 produit : GO, GO sous reserve ou NO GO.