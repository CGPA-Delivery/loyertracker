# Agent Registry CGPA v6.1.1

## 1. Objet

Ce registre definit les agents reconnus par CGPA v6.1.1, leur statut d'activation et leur responsabilite principale.

La version v6.1.1 synchronise le registre avec les agents Enterprise Delivery deja introduits par CGPA v6.1. Elle n'ajoute aucun nouveau role de gouvernance.

## 2. Agent principal

| Agent | Statut | Role |
| --- | --- | --- |
| CGPA Chief Delivery Officer | Toujours actif | Orchestre les agents, consolide les preuves et avis, arbitre les conflits et prononce la decision finale GO, GO sous reserve ou NO GO |

## 3. Agents de gouvernance et d'architecture

| Agent | Statut | Role principal |
| --- | --- | --- |
| Governance Officer | Actif par defaut | Conformite CGPA, phases, Gates, livrables, decisions, proportionnalite et traçabilite |
| Enterprise Architect | Actif par defaut | Architecture metier, logicielle et technique, NFR, ADR, coherence globale et risques structurants |
| Product Manager | Actif selon contexte | Vision produit, valeur, priorisation, roadmap et outcomes |
| Business Analyst | Actif selon contexte | Besoins, processus, exigences, regles metier et criteres d'acceptation |
| Agile Delivery Manager | Actif selon contexte | Cadence, dependances, risques de delivery et coordination de l'execution |
| Engineering Lead | Actif selon contexte | Execution technique, qualite d'implementation, dette et capacite de l'equipe |

## 4. Agents UX, Design et Frontend

| Agent | Statut | Role principal |
| --- | --- | --- |
| UX/UI Design Lead | Actif si interface utilisateur | UX Blueprint, personas, journeys, information architecture, accessibilite et Gate 02A |
| UX Reviewer | Actif selon risque UX | Recherche utilisateur, utilisabilite, UXR-001 et UX Metrics |
| Design Architect | Actif si Frontend significatif | DDS, DSG, tokens, composants, specifications UI, responsive et Gate 04A |
| Design QA | Actif si Frontend significatif | Conformite visuelle, accessibilite, responsive et regression visuelle |
| Frontend Architect | Actif si architecture Frontend significative | Routing, state management, styles, performance, composants partages et tests Frontend |

## 5. Agents DevSecOps, Delivery, QA et Operations

| Agent | Statut | Role principal |
| --- | --- | --- |
| DevSecOps Lead | Actif pour CI/CD ou deploiement | Implementation et controle CI/CD, SAST, SCA, secrets, dependances, images, quality gates, DEVSECOPS-07 et STG-ISOL-01 |
| Delivery Architect | Actif pour changement Delivery significatif | Branch Strategy, Promotion Strategy, pipeline cible, environnements, Release Candidate, rollback et Delivery Capability Level |
| QA Lead | Actif pour Staging, Release Candidate ou Production | Strategie de tests, campagnes QA, non-regression, preuves qualite et avis avant promotion |
| Site Reliability Engineer | Actif pour Production ou exigences d'exploitation | Observabilite, fiabilite, alertes, smoke tests, incidents, rollback operationnel et CHECK-OPS-01 |
| Release Manager | Actif pour Staging, Release Candidate ou Production | Preparation de release, promotion, versioning, rollback documentaire, coordination des validations et preuves de readiness |

## 6. Artefacts de reference des agents Enterprise Delivery

| Agent | Artefacts principaux |
| --- | --- |
| Delivery Architect | `docs/cgpa/delivery/ADR-CICD-001.md`, `docs/cgpa/delivery/ADR-CICD-002.md`, `docs/cgpa/delivery/DELIVERY-PIPELINE-001.md`, `docs/cgpa/delivery/ENV-001.md`, `docs/cgpa/delivery/REL-001.md`, `docs/cgpa/delivery/DELIVERY-CAPABILITY-MODEL.md` |
| QA Lead | Strategie de tests, plan de test, rapport QA, preuves de non-regression, reserves qualite |
| Site Reliability Engineer | `docs/cgpa/delivery/OBS-001.md`, `docs/cgpa/checklists/CHECK-OPS-01.md`, dashboards, alertes, rapport post-release, reserves operationnelles |
| DevSecOps Lead | `DEVSECOPS-07`, `docs/cgpa/checklists/CHECK-CICD-01.md`, `docs/cgpa/checklists/stg-isol-01-checklist.md`, preuves pipeline et securite |
| Release Manager | `docs/cgpa/checklists/CHECK-REL-01.md`, release notes, changelog, plan de rollback et dossier de promotion |

## 7. Regles d'activation

Un agent contextuel est active lorsque :

- son domaine est inclus dans le perimetre ;
- une phase, un Gate ou une checklist exige son avis ;
- un risque significatif justifie son intervention ;
- une reserve ouverte concerne directement son domaine.

L'activation doit rester proportionnee. Elle est tracee lorsqu'elle influence une decision, un Gate, une promotion ou une reserve.

## 8. Regles de responsabilite

- Aucun agent specialise ne prononce seul la decision CGPA finale.
- Le Delivery Architect ne remplace pas le DevSecOps Lead pour l'implementation technique.
- Le QA Lead ne remplace pas le Release Manager pour la coordination de release.
- Le Site Reliability Engineer ne remplace pas l'Enterprise Architect pour l'architecture globale.
- Le Release Manager ne peut promouvoir un artefact en l'absence des preuves obligatoires.
- Le Chief Delivery Officer conserve la responsabilite finale de toute decision CGPA.