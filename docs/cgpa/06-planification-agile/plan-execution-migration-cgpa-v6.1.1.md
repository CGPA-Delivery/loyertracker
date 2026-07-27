# Plan d'Exécution — migration CGPA v6.1.1 Enterprise

## 1. Décision et périmètre

- Identifiant : `PLAN-MIG-CGPA-611-01`.
- Date : 2026-07-27.
- Nature : migration documentaire et outillage de validation ; aucun changement fonctionnel,
  aucune migration SQL, aucun déploiement.
- Source : CGPA v5.4.1.
- Cible : CGPA v6.1.1 Enterprise.
- Branche : `migration/cgpa-v6.1.1-enterprise`, créée depuis
  `origin/main@1fae0edbf5fa05646d814f3c7e5f4d33d0bfd324`.
- Référentiel canonique figé :
  `setup-cgpa@64a4330897d4b7c1c9e1c6301e4520b3bf4b0a57`.

Le plan applique additivement les acquis v5.5 Financial Governance, v5.6 UX/Design, v6.0 quatre
architectures et Frontend Governance, v6.1 Enterprise Delivery Governance, puis la synchronisation
corrective v6.1.1. Aucun Gate historique n'est rejoué.

## 2. Objectifs

1. Synchroniser les déclarations actives vers v6.1.1 en conservant la lignée complète.
2. Installer les références et contrôles canoniques sans créer de concept concurrent.
3. Ajouter au Project State les blocs manquants et les exemptions futures.
4. Formaliser les quatre architectures en référençant les preuves existantes.
5. Activer les packs UX/Design/Frontend, Financial, Delivery, Operations et validation pour les
   prochains changements ou Gates concernés.
6. Fournir un audit reproductible et un rollback Git non destructif.
7. Soumettre le résultat à une validation humaine avant toute fusion.

## 3. Hors périmètre

- rejeu ou réévaluation artificielle d'un Gate historique ;
- clôture du cycle Production `1.14.0` ;
- correction applicative des risques financiers, UX, CI/CD ou architecture ;
- déploiement Staging ou Production ;
- changement de modèle métier, API, base, infrastructure ou configuration runtime ;
- déclaration automatique d'un DCL, d'une RC ou d'un Gate.

## 4. Transformations prévues

### Lot A — socle actif

- synchroniser `AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/cgpa/README.md` ;
- ajouter `CGPA-v6.1.md`, les guides de migration applicables, le Validation Framework et le
  contrat d'audit ;
- conserver les références historiques v5.x dans leur contexte.

### Lot B — Project State et architectures

- mettre à jour le bloc `framework` de façon additive et idempotente ;
- ajouter un bloc de migration v6.1.1 avec historique, décisions, risques, réserves et exemptions ;
- ajouter une vue des quatre architectures reliée aux artefacts existants ;
- clarifier les incohérences courantes sans supprimer les textes historiques.

### Lot C — agents et gouvernances spécialisées

- synchroniser le modèle opératoire, le registre, le routage et les rôles v6.1.1 ;
- ajouter les références UX/Design/Frontend applicables ;
- ajouter Financial Governance et rendre CHECK-FIN-01 obligatoire au prochain changement/Gate
  financier ;
- préserver l'exemption de non-rejeu UX historique et interdire son extension implicite.

### Lot D — Enterprise Delivery Governance

- ajouter ADR-CICD-001/002, DELIVERY-PIPELINE-001, ENV-001, REL-001, OBS-001 et le modèle DCL ;
- ajouter CHECK-CICD-01, CHECK-REL-01, CHECK-OPS-01 ;
- ajouter les workflows CI/CD, promotion, RC, rollback et post-release ;
- mapper ces artefacts vers les mécanismes LoyerTracker existants.

### Lot E — Gates et validation

- ajouter les Gates canoniques actifs sans modifier les décisions historiques ;
- marquer les anciennes checklists locales Staging/Production comme supports projet compatibles,
  sans les supprimer ;
- ajouter CHECK-VAL-01 et l'auditeur canonique configuré pour LoyerTracker ;
- exécuter tests de l'auditeur, audit structurel, vérification des liens, versions et invariants ;
- produire rapports de migration, d'audit et de validation.

## 5. Contrôles

- `git status`, `git diff --stat`, `git diff --check` ;
- absence de suppression de décision, preuve, réserve, risque, release ou migration historique ;
- recherche des déclarations actives v5.4.1 résiduelles ;
- existence et casse exacte des chemins canoniques ;
- résolution des liens Markdown relatifs ;
- absence de chemins locaux absolus dans les documents actifs ;
- CHECK-VAL-01 instruit avec preuves ;
- tests unitaires de l'auditeur et audit automatique PASS ou écarts documentés ;
- revue spécifique Financial, UX/Frontend, Delivery et STG-ISOL-01 ;
- comparaison avec le PR #276 après son traitement ;
- validation humaine finale sur Pull Request.

Un PASS automatique ne valide ni l'application, ni une promotion, ni un Gate.

## 6. Critères de succès

- version active v6.1.1 et `migrated_from: "5.4.1"` correctement tracés ;
- lignée historique intacte ;
- quatre architectures présentes et reliées aux preuves existantes ;
- packs Financial, UX/Design/Frontend et Delivery présents avec applicabilité future explicite ;
- Gates historiques inchangés et nouveaux contrôles non déclarés rétroactivement PASS ;
- DCL actuel non surévalué et cible documentée ;
- exemptions justifiées, approuvables et inscrites ;
- aucun changement applicatif ou déploiement ;
- audit structurel reproductible ;
- rollback documenté ;
- approbation humaine finale explicite.

## 7. Risques

| Identifiant | Criticité | Risque | Traitement |
| --- | --- | --- | --- |
| `R-MIG-611-01` | Bloquant | perte ou réécriture d'historique | transformations additives, diff et revue Governance |
| `R-MIG-611-02` | Majeur | collision avec le PR #276 | resynchronisation explicite avant validation finale |
| `R-MIG-611-03` | Majeur | nouveaux contrôles présentés comme preuves historiques | applicabilité future et non-rejeu inscrits partout |
| `R-MIG-611-04` | Majeur | concepts Delivery concurrents | mapping vers artefacts LoyerTracker existants |
| `R-MIG-611-05` | Bloquant futur | écart d'intégrité financière masqué | CHECK-FIN-01 obligatoire au prochain Gate concerné |
| `R-MIG-611-06` | Majeur | dette UX assimilée à une exemption globale | exemption seulement par lot strictement non-UI |
| `R-MIG-611-07` | Majeur | DCL surévalué sans preuve | évaluation séparée et validation humaine |
| `R-MIG-611-08` | Majeur | audit automatique confondu avec décision | séparation PASS/FAIL technique et décision CDO |

## 8. Rollback

Rollback non destructif uniquement :

1. ne jamais utiliser `git reset --hard`, `git clean` ou force-push ;
2. avant fusion, produire un commit inverse sur la branche si nécessaire ;
3. après partage ou fusion, utiliser `git revert <commit-de-migration>` ;
4. vérifier ensuite le Project State, les liens et la restitution des fichiers actifs ;
5. conserver le rapport d'incident et la décision de rollback.

## 9. Autorisations

Ce plan autorise exclusivement la migration documentaire et l'installation de l'outillage
structurel de validation sur la branche dédiée. Il n'autorise aucun code applicatif, aucune
promotion, aucun déploiement et aucune fusion.

La fusion reste soumise à CHECK-VAL-01, à l'audit, à la levée ou l'acceptation formelle des
réserves non bloquantes et à une validation humaine finale.
