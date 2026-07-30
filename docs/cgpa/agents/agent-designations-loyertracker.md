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

## Ce que cette désignation n'autorise PAS

* **Aucune décision de Gate** (GO / GO sous réserve / NO GO) — ni pour Gate 02A, ni pour Gate 04A.
  Ces deux rôles ne « proposent » qu'un avis ; la décision reste au **CGPA Chief Delivery Officer**
  (`chief-delivery-officer.md` : « Il ne délègue jamais la décision finale à un sous-agent »),
  c'est-à-dire au Product Owner humain (jptshilombo@gmail.com) dans la pratique de ce dépôt.
* **Aucune validation Product Owner** — un critère explicite du Gate 02A (« validation Product
  Owner obtenue », y compris pour un GO sous réserve) reste distinct de l'avis du UX/UI Design
  Lead et ne peut jamais être rempli par lui, quel que soit son titulaire.
* **Aucune levée de dette de Design** (`DD-611-01→04`, `DD-EP17-01→07`) au-delà de ce que permet
  une preuve documentaire réelle — une dette n'est close que par la preuve attendue effectivement
  produite (Validation Framework CGPA v6.1.1 §5), jamais par la seule qualité d'un titulaire de
  rôle.
* **Ne lève pas la limite d'indépendance** : Claude Code est l'auteur des artefacts qu'il est ici
  appelé à revoir (`DDS-LT-001`, `ADR-UI-001`, `DSG-001`, `phase-02-*.md`, `UXR-001`). Cette
  désignation ne constitue **pas** une revue indépendante au sens habituel du terme — elle reste
  tracée comme telle dans chaque avis produit, et n'exempte pas d'une revue humaine indépendante
  ultérieure si le Product Owner le juge nécessaire.

## Révocation

Cette désignation reste valable jusqu'à révocation explicite du Product Owner, ou jusqu'à
désignation d'un titulaire humain distinct pour l'un ou l'autre rôle — auquel cas cette entrée est
mise à jour de façon additive (nouvelle ligne, statut de l'ancienne passé à `Remplacée`), jamais
supprimée.
