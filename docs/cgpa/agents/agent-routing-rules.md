# Agent Routing Rules CGPA v6.1.1

## 1. Principe

Le routage des agents doit rester simple, proportionne, explicable et fonde sur le perimetre reel de la demande.

Le CGPA Chief Delivery Officer selectionne les agents requis, consolide leurs avis et conserve la responsabilite de la decision finale.

## 2. Routage standard

| Type de demande | Agent principal | Agents contributeurs possibles |
| --- | --- | --- |
| Gouvernance, phase, Gate, conformite, livrables, decisions, proportionnalite | Governance Officer | Chief Delivery Officer |
| Vision produit, valeur, roadmap, priorisation | Product Manager | Business Analyst, Governance Officer |
| Besoins, processus, exigences, regles metier, criteres d'acceptation | Business Analyst | Product Manager, Enterprise Architect |
| Architecture metier, logicielle, technique, NFR, ADR, coherence globale | Enterprise Architect | Engineering Lead, Delivery Architect, Site Reliability Engineer |
| UX/UI, personas, journeys, information architecture, accessibilite, Gate 02A | UX/UI Design Lead | UX Reviewer, Design Architect |
| Recherche utilisateur, utilisabilite, UXR-001, UX Metrics | UX Reviewer | UX/UI Design Lead, Product Manager |
| DDS, DSG, tokens, composants, specifications UI, responsive, Gate 04A | Design Architect | Design QA, Frontend Architect |
| Regression visuelle, conformite DSG, accessibilite, responsive | Design QA | Design Architect, QA Lead |
| Architecture Frontend, routing, state, styles, performance, tests Frontend | Frontend Architect | Engineering Lead, Design Architect |
| Cadence, dependances, risques de delivery, execution des Sprints | Agile Delivery Manager | Product Manager, Engineering Lead |
| Execution technique, qualite d'implementation, dette, capacite d'equipe | Engineering Lead | Enterprise Architect, QA Lead |
| Branch Strategy, Promotion Strategy, pipeline cible, environnements, DCL | Delivery Architect | DevSecOps Lead, Enterprise Architect, Release Manager |
| Implementation CI/CD, SAST, SCA, secrets, images, quality gates, DEVSECOPS-07 | DevSecOps Lead | Delivery Architect, Engineering Lead |
| Strategie de tests, campagnes QA, non-regression, preuves qualite | QA Lead | Engineering Lead, Design QA, DevSecOps Lead |
| Observabilite, fiabilite, dashboards, alertes, incidents, rollback operationnel | Site Reliability Engineer | Enterprise Architect, DevSecOps Lead, Release Manager |
| Release Candidate, versioning, dossier de promotion, rollback documentaire | Release Manager | Delivery Architect, QA Lead, DevSecOps Lead, Site Reliability Engineer |

## 3. Routage par Gate

| Gate ou controle | Agents obligatoires ou minimaux |
| --- | --- |
| Gate 02A | UX/UI Design Lead ; UX Reviewer selon le risque |
| Gate 04A | Design Architect ; Frontend Architect et Design QA selon le perimetre |
| Gate 06A | DevSecOps Lead et Delivery Architect ; QA Lead si preuves de tests structurantes |
| `DEVSECOPS-07` | DevSecOps Lead ; Engineering Lead selon les corrections requises |
| `CHECK-CICD-01` | DevSecOps Lead et Delivery Architect ; Release Manager pour la promotion |
| `STG-ISOL-01` | DevSecOps Lead et Release Manager ; Delivery Architect si architecture d'environnement modifiee |
| Gate Staging | Release Manager, DevSecOps Lead et QA Lead |
| Gate 07A / Release Candidate | Release Manager, QA Lead et Delivery Architect |
| `CHECK-REL-01` | Release Manager et QA Lead ; Delivery Architect pour l'integrite de la strategie de release |
| `CHECK-OPS-01` | Site Reliability Engineer et Release Manager ; DevSecOps Lead pour les mecanismes techniques |
| Gate Production | Release Manager, QA Lead, Site Reliability Engineer et DevSecOps Lead |
| Rollback Production | Site Reliability Engineer, Release Manager et DevSecOps Lead |
| `CHECK-FIN-01` | Agent metier ou Business Analyst, Enterprise Architect et agents du Gate concerne |

## 4. Regles d'escalade

Le Chief Delivery Officer ajoute un agent lorsque :

- une reserve depasse le domaine de l'agent initial ;
- une decision influence plusieurs architectures ;
- un Gate requiert plusieurs preuves independantes ;
- un risque securite, financier, operationnel ou de conformite devient significatif ;
- deux agents formulent des avis incompatibles.

## 5. Gestion des conflits

En cas d'avis divergents :

1. le conflit est trace ;
2. les faits et preuves sont distingues des hypotheses ;
3. les reserves bloquantes priment sur les reserves non bloquantes ;
4. l'agent responsable du domaine formule l'avis principal, sans disposer seul du pouvoir de decision ;
5. le Chief Delivery Officer prononce une decision conservatrice si une preuve critique manque.

## 6. Frontieres de routage Enterprise Delivery

- **Delivery Architect** : gouvernance et conception de la chaine de livraison.
- **DevSecOps Lead** : implementation, securisation et preuves techniques de la chaine de livraison.
- **QA Lead** : strategie, execution et attestation des validations qualite.
- **Release Manager** : preparation, coordination et proposition de promotion de la release.
- **Site Reliability Engineer** : readiness operationnelle, observabilite, fiabilite et suivi post-release.
- **Chief Delivery Officer** : autorisation CGPA finale.

## 7. Decision finale

Tout avis de sous-agent est consultatif.

La decision finale revient toujours au CGPA Chief Delivery Officer et prend la forme :

- `GO` ;
- `GO sous reserve` ;
- `NO GO`.

Aucun passage de Gate n'est autorise lorsque les preuves minimales, validations requises ou plans de remediation sont absents.