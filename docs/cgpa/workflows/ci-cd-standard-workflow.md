# Workflow CI/CD standard

## Cadre

Workflow canonique CGPA v6.1.1. CGPA v6.1 a introduit la chaine Enterprise Delivery ; v6.1.1 en synchronise l'execution sans creer de Gate, de role ou de statut.

References : `../CGPA-v6.1.md`, `../delivery/ADR-CICD-001.md`, `../delivery/ADR-CICD-002.md` et `../delivery/DELIVERY-PIPELINE-001.md`.

## Objectif

Gouverner un changement significatif depuis le developpement local jusqu'au suivi post-release, en separant automatisation technique, avis specialises, decision de Gate et promotion.

Le pipeline automatise les controles. Les agents specialises produisent leurs avis. Le CGPA Chief Delivery Officer prononce la decision finale du Gate.

## Principes

* un push Git ne vaut pas autorisation de promotion ;
* branches et environnements restent deux concepts distincts ;
* la Branch Strategy et la Promotion Strategy du projet determinent la nomenclature ;
* le meme artefact immutable est promu entre environnements ;
* chaque preuve est associee a la version, au commit et au digest ou identifiant non ambigu de l'artefact ;
* aucun Gate historique valide n'est rejoue ; Gate 06A est reevalue seulement lors d'un changement CI/CD significatif.

## Entrees

* Plan d'Execution approuve lorsque requis ;
* Branch Strategy et Promotion Strategy documentees ;
* Gate 06A valide ou reevaluation identifiee avant execution ;
* pipeline, environnements et responsables identifies ;
* niveau de risque et DCL connus.

## Sequence normative

1. Verifier que Gate 06A reste valide ; en cas de changement CI/CD significatif, le reevaluer et arreter le workflow sur `NO GO`.
2. Le developpeur realise le changement sur la branche prevue et execute les controles locaux.
3. Le push declenche la CI : build, tests, qualite, secrets, dependances et vulnerabilites selon le risque.
4. Un echec bloquant arrete le workflow ; aucune promotion n'est autorisee.
5. La CI conforme publie un artefact versionne avec provenance et identifiant immutable.
6. Le deploiement Dev peut etre automatise selon la Promotion Strategy ; ses smoke tests et preuves sont archives.
7. Le DevSecOps Lead consolide `DEVSECOPS-07` et les preuves pipeline.
8. `CHECK-CICD-01` est executee pour la promotion Staging ; `STG-ISOL-01` est executee si le Staging est partage.
9. Le QA Lead, le DevSecOps Lead, le Delivery Architect et le Release Manager rendent leurs avis au Gate Staging.
10. Le CGPA Chief Delivery Officer prononce `GO`, `GO sous reserve` ou `NO GO` au Gate Staging.
11. Sur decision favorable, l'artefact autorise est promu sans reconstruction ; le statut passe a `STAGING_READY`, puis `STAGING_DEPLOYED` apres deploiement et smoke tests conformes.
12. Les validations Staging couvrent metier, technique, securite, non-regression, UX/UI et finance selon applicabilite.
13. Le workflow `release-candidate-workflow.md` fige la Release Candidate et execute `CHECK-REL-01`.
14. Gate 07A consolide les avis QA, Delivery et Release ; le CGPA Chief Delivery Officer autorise ou refuse la Release Candidate.
15. La section pre-Production de `CHECK-OPS-01` est executee avec l'avis du Site Reliability Engineer.
16. Gate 09 / Gate Production autorise ou refuse la promotion de l'artefact exact ; une decision favorable produit `PRODUCTION_READY`.
17. Le deploiement Production controle utilise exclusivement l'artefact autorise et la strategie de rollback approuvee.
18. Gate 10 atteste l'execution, les smoke tests et la section post-Production de `CHECK-OPS-01`.
19. Le workflow `post-release-monitoring-workflow.md` cloture la fenetre de surveillance ou declenche incident et rollback.
20. Les preuves, decisions, statuts, risques et prochaines actions sont traces dans `../../project-state.md`.

## Handoffs et responsabilites

| Role | Responsabilite dans le workflow |
| --- | --- |
| Developpeur / Engineering Lead | changement, controles locaux, correction des echecs |
| DevSecOps Lead | pipeline, DEVSECOPS-07, securite et preuves CI/CD |
| Delivery Architect | Branch Strategy, Promotion Strategy, provenance et immutabilite |
| QA Lead | tests, non-regression et avis Staging/Release |
| Product Owner | validation metier lorsque applicable |
| Site Reliability Engineer | observabilite, seuils, operations readiness et suivi post-release |
| Release Manager | coordination de release, fenetre, avis de promotion et rollback |
| CGPA Chief Delivery Officer | decision finale des Gates et consolidation des reserves |

## Preuves et sorties

* rapport pipeline et `CHECK-CICD-01` ;
* identifiant immutable et historique des promotions ;
* decisions Gate Staging, Gate 07A, Gate Production et Gate 10 ;
* `CHECK-REL-01` et sections pre/post de `CHECK-OPS-01` ;
* release notes, rollback, rapport de release et mise a jour du Project State.

Les decisions `D-CICD-01` a `D-CICD-10` restent definies uniquement dans `../CGPA-v6.1.md` et ne sont pas redefinies ici.
