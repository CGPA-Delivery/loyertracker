# AGENTS.md — Règles agents CGPA v6.1.1 Enterprise

Ce dépôt est gouverné par le **CGPA v6.1.1 — Enterprise Delivery Governance**. Le référentiel
normatif de fond est `docs/cgpa/CGPA-v6.1.md` et la migration depuis v5.4.1 est additive.

## Règle fondamentale

Toujours lire `docs/project-state.md`, identifier la phase courante, les Gates applicables, les
preuves, l'action autorisée, les réserves, les environnements et le Delivery Capability Level avant
toute action. Préserver l'historique documentaire.

## Autorité

Le **CGPA Chief Delivery Officer v6.1.1** orchestre les agents, consolide leurs avis et porte seul
la décision CGPA finale `GO`, `GO sous réserve` ou `NO GO`.

Agents standards mobilisables selon le besoin :

- Governance Officer ;
- Product Manager ;
- Business Analyst ;
- UX/UI Design Lead ;
- UX Reviewer ;
- Design Architect ;
- Design QA ;
- Frontend Architect ;
- Enterprise Architect ;
- Engineering Lead ;
- Agile Delivery Manager ;
- DevSecOps Lead ;
- Delivery Architect ;
- QA Lead ;
- Site Reliability Engineer ;
- Release Manager.

Les avis spécialisés ne remplacent ni les preuves, ni les validateurs humains, ni les Gates. Pour
chaque avis significatif, tracer l'agent, le sujet, les éléments examinés, l'avis, les réserves,
les preuves et l'impact.

## Règles absolues

- Ne jamais supprimer ou réécrire une décision, un risque, une réserve, une preuve, une release,
  une migration ou un Gate historique.
- Ne jamais rejouer artificiellement un Gate historique valide.
- Ajouter les migrations documentaires de manière additive, idempotente et réversible.
- Ne jamais produire de code applicatif sans Plan d'Exécution approuvé.
- Ne jamais écrire directement sur `main` ; utiliser une branche dédiée et une Pull Request.
- Ne jamais confondre push, merge, clôture Sprint, Gate Staging et autorisation Production.
- Ne jamais déployer en Production sans Gate Production valide et décision explicite distincte.
- Ne jamais reconstruire l'artefact entre Staging et Production.
- Toute Release Candidate doit être versionnée, traçable et immutable.
- Tout changement significatif met à jour `docs/project-state.md`.
- Toute contribution IA significative est identifiée, relue et soumise aux mêmes Gates.
- Toute fusion structurante exige une validation humaine finale.

## Enterprise Delivery Governance

Chaîne canonique :

`Plan approuvé -> développement contrôlé -> CI -> artefact immutable -> Gate 06A ->
CHECK-CICD-01 -> STG-ISOL-01 si applicable -> Gate Staging -> Staging -> recette ->
Release Candidate -> CHECK-REL-01 -> Gate 07A -> CHECK-OPS-01 pré-Production ->
Gate 09 / Gate Production -> même artefact en Production -> CHECK-OPS-01 post-Production ->
Gate 10 -> monitoring, clôture ou rollback`.

Un incident critique suspend les promotions suivantes jusqu'à décision tracée.

## UX, Design et Frontend

LoyerTracker comporte une interface Angular : la gouvernance UX/Design/Frontend est applicable aux
prochains changements Frontend significatifs. Gate 02A, Phase 04A, Gate 04A, UXR-001, DDS-001,
DSG-001, accessibilité, responsive, inventaire des composants, dette Design et Visual Review sont
instruits selon le risque. Les Gates historiques ne sont pas rejoués.

## Financial Governance

LoyerTracker manipule loyers, paiements, garanties, honoraires, soldes, devises et quittances.
`ADR-FIN-001`, `CHECK-FIN-01`, `FIN-ARCH-001` et `FIN-DOMAIN-GUIDE` sont applicables. Un écart
critique d'intégrité financière impose `NO GO`. Une correction de ledger utilise une écriture
compensatoire ; aucune mutation ou suppression silencieuse n'est admise.

## Staging mutualisé

L'environnement Staging `ai-test-server` est mutualisé. `STG-ISOL-01` est obligatoire avant chaque
promotion. Ne jamais exécuter de commande Docker à portée globale, notamment :

- `docker stop $(docker ps -q)` ;
- `docker compose down` sans cible maîtrisée ;
- `docker system prune -a` ;
- une suppression globale de réseaux, volumes ou conteneurs.

Les noms Compose, réseaux, volumes, secrets, variables, ports, pipeline et routage doivent rester
dédiés à LoyerTracker. Vérifier l'absence d'impact interprojet avant et après promotion.

## Références actives

- `docs/project-state.md`
- `docs/cgpa/README.md`
- `docs/cgpa/CGPA-v6.1.md`
- `docs/cgpa/VALIDATION-FRAMEWORK-v6.1.1.md`
- `docs/cgpa/delivery/`
- `docs/cgpa/agents/agent-operating-model.md`
- `docs/cgpa/agents/agent-routing-rules.md`
- `docs/cgpa/checklists/CHECK-CICD-01.md`
- `docs/cgpa/checklists/CHECK-REL-01.md`
- `docs/cgpa/checklists/CHECK-OPS-01.md`
- `docs/cgpa/checklists/CHECK-VAL-01.md`
- `docs/cgpa/checklists/stg-isol-01-checklist.md`
