# Désignations d'agents CGPA — LoyerTracker

> Instance projet, distincte du gabarit `agent-registry.md` (générique, non modifié). Ce document
> trace **qui** occupe un rôle de sous-agent CGPA pour LoyerTracker, à un instant donné, et les
> limites explicites de cette désignation. Il ne crée aucun nouveau rôle et ne modifie aucune
> règle du modèle d'agents (`agent-operating-model.md`, `agent-routing-rules.md`).

## Désignation en cours

| Rôle | Titulaire | Désigné par | Date | Portée | Statut |
|---|---|---|---|---|---|
| UX/UI Design Lead | Claude Code (agent IA, `docs/cgpa/agents/ux-ui-design-lead.md`) | Product Owner (jptshilombo@gmail.com), instruction explicite « désigne-toi UX/UI Design Lead et Design Architect » | 2026-07-30 | EP-16/US-125 (Gate 02A) et EP-17 (socle UI PrimeNG/Keycloak) | Actif |
| Design Architect | Claude Code (agent IA, `docs/cgpa/agents/design-architect.md`) | Idem | 2026-07-30 | EP-17 (DSG-001, inventaire, dette, Gate 04A) | Actif |
| Frontend Architect | Claude Code (agent IA, `docs/cgpa/agents/frontend-architect.md`) | Product Owner (jptshilombo@gmail.com), instruction explicite « désigne un Frontend Architect et un DevSecOps Lead », périmètre confirmé par le Product Owner (EP-17 / Gate 04A) | 2026-07-31 | EP-17 — structure applicative, composants, routing, lazy loading, state management, CSS/SCSS, shared library, mapping tokens, performance et stratégie de tests (Gate 04A) | Actif |
| DevSecOps Lead | Claude Code (agent IA, `docs/cgpa/agents/devsecops-lead.md`) | Idem | 2026-07-31 | Avant Lot 1 EP-17 — CI/CD, sécurité technique, environnements, Gate 06A DevSecOps Readiness, DEVSECOPS-07 avant promotion Staging | Actif |

## Ce que cette désignation autorise

Conformément à `agent-operating-model.md` §2 (« Le modèle d'opération des agents CGPA organise
l'usage coordonné des agents IA **et humains** ») et §5 (rôles UX/UI Design Lead et Design
Architect explicitement définis comme sous-agents activables) :

* Claude Code peut produire, **en tant que** UX/UI Design Lead, l'avis attendu par
  `ux-ui-design-lead.md` §Sortie attendue (avis UX/UI, réserves bloquantes/non bloquantes,
  **décision proposée** pour Gate 02A, actions correctives datées).
* Claude Code peut produire, **en tant que** Design Architect, l'avis attendu par
  `design-architect.md` (maintien de `DSG-001`, cohérence UX/UI/responsive/accessibilité,
  inventaire et mapping des composants, réduction et traçabilité de la dette de Design, avis pour
  le Gate 04A et la Revue Design).
* Claude Code peut produire, **en tant que** Frontend Architect, l'avis attendu par
  `frontend-architect.md` (structure applicative, composants, routing, lazy loading, state
  management, CSS/SCSS, shared library, mapping tokens, performance et stratégie de tests) pour
  EP-17 et le Gate 04A.
* Claude Code peut produire, **en tant que** DevSecOps Lead, l'avis attendu par
  `devsecops-lead.md` (CI/CD, SAST/SCA, secrets, dépendances, images, environnements, Gate 06A —
  DevSecOps Readiness, DEVSECOPS-07 avant promotion Staging) pour le périmètre EP-17 avant le
  Lot 1.

## Ce que cette désignation n'autorise PAS

* **Aucune décision de Gate** (GO / GO sous réserve / NO GO) — ni pour Gate 02A, ni pour Gate 04A,
  ni pour Gate 06A. Ces quatre rôles ne « proposent » qu'un avis ; la décision reste au **CGPA
  Chief Delivery Officer** (`chief-delivery-officer.md` : « Il ne délègue jamais la décision finale
  à un sous-agent »), c'est-à-dire au Product Owner humain (jptshilombo@gmail.com) dans la pratique
  de ce dépôt.
* **Aucune validation Product Owner** — un critère explicite du Gate 02A (« validation Product
  Owner obtenue », y compris pour un GO sous réserve) reste distinct de l'avis du UX/UI Design
  Lead et ne peut jamais être rempli par lui, quel que soit son titulaire.
* **Aucune levée de dette de Design** (`DD-611-01→04`, `DD-EP17-01→07`) au-delà de ce que permet
  une preuve documentaire réelle — une dette n'est close que par la preuve attendue effectivement
  produite (Validation Framework CGPA v6.1.1 §5), jamais par la seule qualité d'un titulaire de
  rôle.
* **Aucune levée du contrôle DEVSECOPS-07** ni du résultat agrégé de `CHECK-UX-01-ep17-ui-foundation.md`
  par la seule désignation d'un DevSecOps Lead ou d'un Frontend Architect — un contrôle bloquant
  reste `non exécuté` tant qu'aucune preuve technique réelle (pipeline exécuté, SAST/SCA effectifs,
  build reproductible) n'est produite, conformément au verrou CGPA correspondant
  (`CLAUDE.md` : « Un contrôle applicable sans preuve est non exécuté, jamais non applicable »).
* **Ne lève pas la limite d'indépendance** : Claude Code est l'auteur des artefacts qu'il serait ici
  appelé à revoir (`DDS-LT-001`, `ADR-UI-001`, `DSG-001`, `phase-02-*.md`, `UXR-001`,
  `plan-execution-ux-ui-primeng-keycloak.md`). Cette désignation ne constitue **pas** une revue
  indépendante au sens habituel du terme — elle reste tracée comme telle dans chaque avis produit,
  et n'exempte pas d'une revue humaine indépendante ultérieure si le Product Owner le juge
  nécessaire.
* **Aucun avis Frontend Architect ou DevSecOps Lead n'est produit par cette désignation elle-même**
  — seul le rôle est attribué. La production d'un avis (structure applicative, CI/CD, Gate 04A,
  Gate 06A) reste une action distincte, non demandée ici.

## Révocation

Cette désignation reste valable jusqu'à révocation explicite du Product Owner, ou jusqu'à
désignation d'un titulaire humain distinct pour l'un ou l'autre rôle — auquel cas cette entrée est
mise à jour de façon additive (nouvelle ligne, statut de l'ancienne passé à `Remplacée`), jamais
supprimée.
