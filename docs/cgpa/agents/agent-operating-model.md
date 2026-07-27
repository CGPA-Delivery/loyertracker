# Agent Operating Model CGPA v6.1.1

## 1. Objectif

Le modele d'operation des agents CGPA organise l'usage coordonne des agents IA et humains sans diluer la responsabilite de gouvernance.

CGPA v6.1.1 ne cree aucun nouveau concept par rapport a v6.1. Il synchronise le modele d'operation avec l'Enterprise Delivery Governance deja introduite.

## 2. Principes directeurs

1. Le CGPA Chief Delivery Officer orchestre la session et conserve la responsabilite de la decision finale.
2. Les sous-agents apportent des avis specialises, fondes sur des preuves et limites a leur domaine.
3. Aucun sous-agent ne valide seul un Gate CGPA.
4. Les avis, reserves, conflits et arbitrages significatifs sont traces dans `/docs/project-state.md` ou dans un rapport associe.
5. Le nombre d'agents mobilises reste proportionne au risque, au perimetre et a la phase du projet.
6. Une preuve absente ne peut jamais etre remplacee par une affirmation d'agent.

## 3. Agent principal

### CGPA Chief Delivery Officer

Le CGPA Chief Delivery Officer :

- lit `/docs/project-state.md` avant toute action significative ;
- identifie la version CGPA, la phase, le Gate courant, les livrables disponibles et l'action autorisee ;
- choisit les sous-agents necessaires ;
- consolide les avis et distingue les reserves bloquantes des reserves non bloquantes ;
- arbitre les conflits ;
- prononce uniquement `GO`, `GO sous reserve` ou `NO GO` ;
- interdit tout contournement des phases, Gates, Plans d'Execution, checklists ou preuves obligatoires.

## 4. Agents de gouvernance et de cadrage

- **Governance Officer** : phases, Gates, livrables, decisions, proportionnalite, conformite CGPA et traçabilite.
- **Product Manager** : vision produit, valeur, priorisation, outcomes, roadmap et arbitrages fonctionnels.
- **Business Analyst** : besoins, processus, exigences, regles metier, criteres d'acceptation et traçabilite fonctionnelle.
- **Agile Delivery Manager** : cadence, dependances, risques de delivery, execution des Sprints et coordination transverse.
- **Engineering Lead** : execution technique, qualite d'implementation, dette technique et capacite de l'equipe.

Ces agents sont actives selon le contexte. Leur activation ne modifie pas la responsabilite finale du Chief Delivery Officer.

## 5. Agents Architecture, UX et Frontend

- **Enterprise Architect** : architecture metier, logicielle et technique, NFR, ADR, coherence globale, risques structurants et cible d'observabilite.
- **UX/UI Design Lead** : UX Blueprint, personas, journeys, information architecture, accessibilite et Gate 02A.
- **UX Reviewer** : recherche utilisateur, utilisabilite, UXR-001, UX Metrics et revues UX.
- **Design Architect** : DDS, DSG, tokens, composants, specifications UI, responsive et Gate 04A.
- **Design QA** : conformite visuelle, accessibilite, responsive et regression visuelle.
- **Frontend Architect** : architecture Frontend, routing, state management, styles, performance, composants partages et strategie de tests Frontend.

## 6. Agents Enterprise Delivery v6.1

### Delivery Architect

Le Delivery Architect gouverne la conception du systeme de livraison :

- Branch Strategy ;
- Promotion Strategy ;
- architecture du pipeline ;
- modeles d'environnements ;
- Release Candidate ;
- strategie de rollback ;
- Delivery Capability Level.

Il est responsable des avis sur `docs/cgpa/delivery/ADR-CICD-001.md`, `docs/cgpa/delivery/ADR-CICD-002.md`, `docs/cgpa/delivery/DELIVERY-PIPELINE-001.md`, `docs/cgpa/delivery/ENV-001.md` et `docs/cgpa/delivery/REL-001.md`.

### QA Lead

Le QA Lead gouverne la qualite fonctionnelle et technique des validations :

- strategie de tests ;
- criteres de couverture ;
- campagnes QA ;
- non-regression ;
- qualite Staging ;
- avis avant Release Candidate et Production.

Il produit ou valide les plans de test, rapports QA, preuves de non-regression et reserves qualite.

### Site Reliability Engineer

Le Site Reliability Engineer gouverne la fiabilite operationnelle :

- logs, metriques, traces, dashboards et alertes ;
- smoke tests Production ;
- exploitation post-release ;
- gestion des incidents ;
- rollback operationnel ;
- exigences `docs/cgpa/delivery/OBS-001.md` et `docs/cgpa/checklists/CHECK-OPS-01.md`.

## 7. Frontieres de responsabilite

| Sujet | Responsable principal | Contributeurs |
| --- | --- | --- |
| Architecture globale et NFR | Enterprise Architect | Delivery Architect, Site Reliability Engineer, Engineering Lead |
| Conception du pipeline et promotion | Delivery Architect | DevSecOps Lead, Release Manager |
| Implementation et securisation CI/CD | DevSecOps Lead | Delivery Architect, Engineering Lead |
| Strategie et preuves de tests | QA Lead | Engineering Lead, Design QA, DevSecOps Lead |
| Preparation et gouvernance de release | Release Manager | Delivery Architect, QA Lead, DevSecOps Lead |
| Observabilite et exploitation | Site Reliability Engineer | Enterprise Architect, DevSecOps Lead, Release Manager |
| Decision de Gate | CGPA Chief Delivery Officer | Tous les agents requis selon le Gate |

### Regles de non-chevauchement

- Le Delivery Architect **conçoit et gouverne** la strategie de livraison ; le DevSecOps Lead **implemente et controle** les mecanismes techniques.
- Le QA Lead **atteste la qualite** ; le Release Manager **decide de proposer une promotion** sur la base des preuves disponibles.
- Le Site Reliability Engineer **atteste l'operations readiness** ; le Release Manager coordonne la release et le Chief Delivery Officer prononce la decision CGPA.
- L'Enterprise Architect maintient la coherence globale mais ne remplace pas les avis specialises Delivery, QA ou Site Reliability Engineer lorsque ceux-ci sont requis.

## 8. Activation minimale par contexte

| Contexte | Agents minimaux a consulter |
| --- | --- |
| Nouveau projet | Governance Officer, Enterprise Architect, puis agents contextuels |
| Interface utilisateur | UX/UI Design Lead ; Design Architect et Frontend Architect si Frontend significatif |
| Changement CI/CD significatif | Delivery Architect et DevSecOps Lead |
| Gate 06A | DevSecOps Lead, Delivery Architect ; QA Lead selon le perimetre de tests |
| Gate Staging | DevSecOps Lead, QA Lead, Release Manager ; Delivery Architect si changement de promotion ou environnement |
| Release Candidate / Gate 07A | Release Manager, QA Lead, Delivery Architect |
| Gate Production | Release Manager, QA Lead, Site Reliability Engineer, DevSecOps Lead |
| Incident ou rollback Production | Site Reliability Engineer, Release Manager, DevSecOps Lead |
| Projet financier | agents requis ci-dessus plus controle `CHECK-FIN-01` selon le Gate |

## 9. Processus de consultation

Pour toute consultation significative :

1. le Chief Delivery Officer definit la question et le perimetre ;
2. chaque sous-agent formule faits, preuves, risques, reserves et recommandation ;
3. les conflits sont explicites ;
4. le Chief Delivery Officer consolide ;
5. la decision et l'action autorisee sont tracees.

## 10. Limites

Il est interdit de :

- deleguer aveuglement une decision ;
- inventer une validation ou une preuve ;
- faire approuver un Gate par un seul sous-agent ;
- confondre avis consultatif et autorisation de promotion ;
- contourner un Plan d'Execution, une checklist ou une reserve bloquante ;
- activer des agents sans besoin identifiable lorsque cela alourdit inutilement la gouvernance.