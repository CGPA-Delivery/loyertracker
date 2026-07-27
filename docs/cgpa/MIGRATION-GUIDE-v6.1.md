# MIGRATION GUIDE - CGPA v6.1

## Objectif

Migrer un projet CGPA v6.0 ou anterieur vers CGPA v6.1 de maniere additive, sans rejouer les Gates historiques et sans interrompre inutilement les developpements en cours.

## Regles de migration

1. Conserver l'historique des decisions, Gates, risques et releases.
2. Ne pas modifier le code applicatif sans Plan d'Execution approuve.
3. Appliquer les controles v6.1 uniquement aux prochains changements significatifs, prochaines promotions et prochaines releases.
4. Documenter toute exemption.
5. Mettre a jour `/docs/project-state.md` avant toute decision GO.

## Etapes

### 1. Audit Delivery initial

Verifier :

* strategie de branches ;
* workflows CI/CD ;
* Dev Server ;
* Staging ;
* Production ;
* release candidates ;
* tags ;
* rollback ;
* observabilite ;
* historique des deploiements.

Sortie : `docs/cgpa/migration/delivery-audit-v6.1.md`.

### 2. Ajout du Delivery Pack

Verifier ou creer :

* `docs/cgpa/delivery/ADR-CICD-001.md` ;
* `docs/cgpa/delivery/ADR-CICD-002.md` ;
* `docs/cgpa/delivery/DELIVERY-PIPELINE-001.md` ;
* `docs/cgpa/delivery/ENV-001.md` ;
* `docs/cgpa/delivery/REL-001.md` ;
* `docs/cgpa/delivery/OBS-001.md` ;
* `docs/cgpa/delivery/DELIVERY-CAPABILITY-MODEL.md`.

### 3. Ajout des workflows

Verifier ou creer :

* `docs/cgpa/workflows/ci-cd-standard-workflow.md` ;
* `docs/cgpa/workflows/environment-promotion-workflow.md` ;
* `docs/cgpa/workflows/release-candidate-workflow.md` ;
* `docs/cgpa/workflows/rollback-workflow.md` ;
* `docs/cgpa/workflows/post-release-monitoring-workflow.md`.

### 4. Ajout des checklists

Verifier ou creer :

* `docs/cgpa/checklists/CHECK-CICD-01.md` ;
* `docs/cgpa/checklists/CHECK-REL-01.md` ;
* `docs/cgpa/checklists/CHECK-OPS-01.md`.

### 5. Mise a jour du Project State

Ajouter les blocs :

* Delivery Strategy ;
* Pipeline ;
* Environment Promotion ;
* Release Candidate ;
* Rollback ;
* Observability ;
* Operations ;
* Delivery Capability Level.

### 6. Mise a jour des Gates

Enrichir sans remplacer :

* Gate 06A avec pipeline readiness ;
* Gate Staging avec CHECK-CICD-01 ;
* Gate 07A avec CHECK-REL-01 ;
* Gate Production avec CHECK-REL-01 et CHECK-OPS-01.

### 7. Rapport final

Produire `docs/cgpa/migration/migration-report-v6.1.md` avec :

* fichiers crees ;
* fichiers modifies ;
* compatibilite ascendante ;
* exemptions ;
* Delivery Capability Level ;
* reserves ;
* decision finale.

## Critere de succes

La migration est acceptable si le projet peut prouver comment un changement est developpe, teste, promu, release, rollbacke et observe en Production.

## Decision

GO, GO sous reserve ou NO GO.