# Documentation CGPA — LoyerTracker

Ce dossier contient les livrables de gouvernance LoyerTracker alignés sur **CGPA v6.1.1
Enterprise**. La migration depuis v5.4.1 est additive : aucun Gate, décision, risque, réserve,
preuve, release ou rapport historique n'est rejoué ou supprimé.

## Référentiel actif

- Référentiel normatif : `CGPA-v6.1.md`.
- Correctif de synchronisation : `MIGRATION-GUIDE-v6.1.1.md`.
- Validation : `VALIDATION-FRAMEWORK-v6.1.1.md`.
- Audit automatique : `AUTOMATED-AUDIT-v6.1.1.md`.
- État projet vivant : `../project-state.md`.
- État Staging : `../staging-state.md`.
- État Production : `../prod-state.md`.

Les références v5.x conservées dans les rapports historiques décrivent leur contexte d'origine et
ne sont pas des déclarations actives concurrentes.

## Quatre architectures

- Métier : `01-idee-opportunite/`, `02-expression-besoin/`, `04-cahier-des-charges/` et
  `architecture/architecture-metier.md`.
- Logicielle : `05-architecture-conception/dossier-architecture.md`, ADR et
  `architecture/architecture-logicielle.md`.
- Technique : `architecture/architecture-technique.md`, `delivery/`, runbook et observabilité.
- UX/UI : `architecture/architecture-ux-ui.md`, `design/` et `frontend/`.

## Gouvernances spécialisées

- Financial Governance : `finance/ADR-FIN-001.md`, `finance/CHECK-FIN-01.md`,
  `finance/FIN-ARCH-001.md`, `finance/FIN-DOMAIN-GUIDE.md`.
- UX/Design/Frontend : `design/`, `frontend/`, Gate 02A et Gate 04A.
- Staging mutualisé : `adr/ADR-STG-001-staging-isolation.md`,
  `checklists/stg-isol-01-checklist.md` et les preuves projet historiques.
- Agents : `agents/agent-operating-model.md`, `agents/agent-registry.md`,
  `agents/agent-routing-rules.md`.

## Enterprise Delivery Governance

Artefacts canoniques :

- `delivery/ADR-CICD-001.md`
- `delivery/ADR-CICD-002.md`
- `delivery/DELIVERY-PIPELINE-001.md`
- `delivery/ENV-001.md`
- `delivery/REL-001.md`
- `delivery/OBS-001.md`
- `delivery/DELIVERY-CAPABILITY-MODEL.md`

Contrôles permanents :

- `checklists/CHECK-CICD-01.md`
- `checklists/CHECK-REL-01.md`
- `checklists/CHECK-OPS-01.md`
- `checklists/CHECK-VAL-01.md`

Workflows canoniques :

- `workflows/ci-cd-standard-workflow.md`
- `workflows/environment-promotion-workflow.md`
- `workflows/release-candidate-workflow.md`
- `workflows/rollback-workflow.md`
- `workflows/post-release-monitoring-workflow.md`

## Règle de promotion

`Plan approuvé -> CI conforme -> artefact immutable -> Gate 06A -> CHECK-CICD-01 ->
STG-ISOL-01 -> Gate Staging -> Staging -> RC exacte -> CHECK-REL-01 -> Gate 07A ->
CHECK-OPS-01 pré-Production -> Gate 09 / Gate Production -> même artefact en Production ->
CHECK-OPS-01 post-Production -> Gate 10`.

Un push ou un merge n'est jamais une autorisation de déploiement. L'environnement Staging
`ai-test-server` est mutualisé ; `STG-ISOL-01` est bloquant à chaque promotion.

## Migration v6.1.1

- Audit initial : `migration/audit-initial-v6.1.1.md`.
- Plan d'Exécution :
  `06-planification-agile/plan-execution-migration-cgpa-v6.1.1.md`.
- Rapport de migration : `migration/migration-report-v6.1.1.md`.
- Rapport CHECK-VAL-01 : `reports/CHECK-VAL-01-loyertracker-v6.1.1.md`.
- Rapport d'audit automatique : `reports/AUTOMATED-AUDIT-REPORT-loyertracker-v6.1.1.md`.

La migration documentaire ne valide pas automatiquement l'application, Staging, Production, une
Release Candidate ou un Gate. La fusion exige une validation humaine finale.
