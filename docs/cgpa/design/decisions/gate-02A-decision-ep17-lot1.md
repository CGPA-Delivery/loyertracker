# Décision GO / NO GO CGPA v6.1.1 — Gate 02A, instance EP-17 Lot 1 (applicabilité)

> Instance du gabarit `docs/cgpa/templates/go-no-go.md`, produite à la demande explicite du
> Product Owner (« clarifier Gate 02A d'abord », 2026-08-01), pour trancher un point resté non
> résolu depuis l'approbation du Plan d'Exécution (`project-state.md`, entrée du 2026-07-31 :
> « l'applicabilité du Gate 02A au socle EP-17 … n'a pas été tranchée … à clarifier avant, ou
> tenue comme réserve pendant, l'exécution du Lot 1 »). **La section 6 est volontairement laissée
> non renseignée par Claude Code** — seul le Product Owner peut la compléter, conformément à
> `CLAUDE.md` (« Aucun pipeline, score, audit automatique ou agent spécialisé ne remplace la
> validation humaine requise »).

## 0. Incohérence documentaire à trancher explicitement

Deux documents existants portent des lectures différentes de la couverture de
`gate-02A-decision-ep16-us125.md` (US-125, GO sous réserve, 2026-07-31) sur le socle EP-17 :

* `plan-execution-ux-ui-primeng-keycloak.md` §3 Lot 0 : « Gate 02A : statué pour US-125 …
  **Ne couvre que US-125 (EP-16), pas le socle EP-17** traité par ce Plan. »
* `gate-04A-decision-ep17-lot0-v2.md` §4, ligne « — (validation PO Gate 02A) » : traite ce
  bloqueur comme **« Levé (2026-07-31, `gate-02A-decision-ep16-us125.md`, GO sous réserve) »**,
  sans distinguer le périmètre US-125 du périmètre EP-17.

Cette instance ne réécrit ni l'un ni l'autre document (préservation des décisions historiques,
`CLAUDE.md`) mais **signale explicitement la contradiction** : la ligne §4 de
`gate-04A-decision-ep17-lot0-v2.md` a traité comme résolu, pour EP-17, un bloqueur que le Plan
lui-même qualifie de non couvrant pour EP-17. Cette instance a pour objet de résoudre cette
contradiction par une décision propre au périmètre EP-17 Lot 1, plutôt que par inférence à partir
d'une décision rendue pour un périmètre distinct (US-125).

## 1. Identification

* ID décision : `GATE-02A-EP17-LOT1-2026-08-01`
* Projet : LoyerTracker
* Gate ou jalon évalué : Gate 02A — UX Gate (`docs/cgpa/gates/gate-02A-ux-design-readiness.md`)
* Phase : Phase 02 → Gate 02A → Phase 03, périmètre EP-17 Lot 1 (Fondation technique :
  `plan-execution-ux-ui-primeng-keycloak.md` §3)
* Environnement source et cible : Aucun — documentaire, aucun déploiement
* Artefact, version, commit ou digest : `DSG-001.md` v0.1.0 (Proposé, avis de validation Design
  Architect accepté PO le 2026-07-31), `plan-execution-ux-ui-primeng-keycloak.md` §3 Lot 1
* Date : 2026-08-01
* Décision précédente référencée : `gate-02A-decision-ep16-us125.md` (GO sous réserve, US-125,
  2026-07-31) — périmètre distinct, non étendu tacitement à EP-17 (cf. §0) ; `gate-04A-decision-ep17-lot0-v2.md`
  (GO sous réserve, Lot 1, 2026-07-31) — dont la ligne §4 Gate 02A est clarifiée par cette instance

## 2. Périmètre et applicabilité

* Contrôles applicables : les 11 points de contrôle GO de `gate-02A-ux-design-readiness.md`,
  évalués spécifiquement contre le périmètre du **Lot 1** tel que défini par
  `plan-execution-ux-ui-primeng-keycloak.md` §3 : installer PrimeNG, configurer le thème à partir
  des tokens `--lt-*`, créer les fichiers de tokens, poser les conventions de nommage — **« ne
  migrer aucun écran métier complet à ce stade »**.
* Exemptions justifiées : aucune exemption *de Gate* n'est retenue (le projet comporte une
  interface utilisateur, l'exemption backend/API-only ne s'applique pas). En revanche, plusieurs
  critères individuels du Gate n'ont **pas de matière nouvelle à évaluer** pour ce périmètre
  précis, faute de tout écran, parcours ou persona nouveau livré en Lot 1 — distinction détaillée
  §3, conformément à `CLAUDE.md` (« un contrôle applicable sans preuve est non exécuté, jamais non
  applicable ») : aucun critère n'est ici déclaré non applicable sans preuve, chacun est documenté
  individuellement.
* Contrôles non exécutés : validation Product Owner de cette applicabilité elle-même — objet de
  cette soumission (§6).

## 3. Preuves et résultats — les 11 critères du Gate 02A appliqués au Lot 1

| Critère `gate-02A-ux-design-readiness.md` | Constat pour le périmètre Lot 1 | Preuve |
| --- | --- | --- |
| Personas validés | Sans matière nouvelle — Lot 1 ne livre aucun écran métier (« ne migrer aucun écran métier complet à ce stade »), donc aucun nouveau persona n'est concerné. Personas existants inchangés (`phase-02-user-journeys.md` §1, périmètre US-125) | `plan-execution-ux-ui-primeng-keycloak.md` §3 Lot 1 |
| User journeys documentés | Sans matière nouvelle — aucun parcours utilisateur nouveau ou modifié en Lot 1 | idem |
| Parcours critiques identifiés | Sans matière nouvelle, même constat | idem |
| Cas nominaux et cas d'erreur documentés | Sans matière nouvelle — pas d'écran nouveau exposant de nouveaux cas | idem |
| Information architecture validée | Inchangée — Lot 1 ne touche ni navigation ni arborescence (`phase-02-information-architecture.md`, périmètre US-125, non affecté par Lot 1) | idem |
| Navigation globale stabilisée | Inchangée par construction du Lot 1 | idem |
| Design system validé | **Matière réelle et applicable** — `DSG-001.md` v0.1.0, contenu validé par le Product Owner via l'avis Design Architect (2026-07-31), mais **statut « Proposé », non implémenté** — c'est précisément l'objet technique du Lot 1 | `DSG-001.md` §Gouvernance ; avis de validation DD-611-02 |
| Responsive strategy définie | Définie dans `DSG-001.md` §Responsive Rules — contenu, non encore vérifié en implémentation (objet du Lot 1 puis de `CHECK-FRONTEND-01`) | `DSG-001.md` §Responsive Rules |
| Accessibilité minimale définie | Définie dans `DSG-001.md` §Accessibilité — contenu, non encore vérifié en implémentation | `DSG-001.md` §Accessibilité |
| Maquettes des écrans critiques disponibles | Sans objet pour Lot 1 — aucun écran migré ; les maquettes de `phase-02-ui-mockups.md` restent scopées à US-125 | `plan-execution-ux-ui-primeng-keycloak.md` §3 Lot 1 |
| Validation Product Owner obtenue | **Objet de cette soumission** — non obtenue pour ce périmètre précis au moment de la rédaction | §6 |

**Lecture d'ensemble** : sur les 11 critères, 5 portent sur une matière que le Lot 1 ne produit
pas (personas, journeys, parcours, cas d'erreur, maquettes d'écrans) — ils ne sont ni satisfaits ni
en échec, ils sont **sans objet pour ce périmètre précis**, une distinction différente d'une
exemption de Gate. 2 sont inchangés et déjà couverts par les décisions US-125 (navigation,
information architecture). 3 portent une matière réelle propre au Lot 1 (design system,
responsive, accessibilité) — leur **contenu** est déjà documenté et validé par le Product Owner
(`DSG-001.md`, DD-611-02), mais leur **implémentation** reste à produire par le Lot 1 lui-même et
relève du Gate 04A (`CHECK-UX-01`/`CHECK-FRONTEND-01`), pas du Gate 02A qui porte sur le cadrage
en amont de l'architecture détaillée. Le dernier critère (validation Product Owner) est l'objet de
cette soumission.

## 4. Bloqueurs et réserves

| ID | Type | Impact | Autorité d'acceptation | Responsable | Échéance | Preuve attendue | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| — (validation PO applicabilité) | Bloqueur | Seul critère non satisfait des 11 pour ce périmètre ; non substituable par aucun avis de sous-agent | Product Owner | Product Owner | Avant instruction du Gate 02A pour EP-17 Lot 1 | Décision Product Owner tracée | **Objet de cette soumission** |
| — (incohérence documentaire §0) | Réserve | `gate-04A-decision-ep17-lot0-v2.md` §4 avait traité ce bloqueur comme levé par extension de `gate-02A-decision-ep16-us125.md` (US-125) à EP-17 | Product Owner | Product Owner | Avec cette décision | Clarification tracée ici | **Objet de cette soumission** — ni l'un ni l'autre document n'est réécrit, cette instance fait autorité pour EP-17 Lot 1 à compter de sa décision §6 |
| — (implémentation Design System/Responsive/A11y) | Réserve non bloquante pour ce Gate | Contenu validé mais non implémenté | Product Owner | Frontend/Design Architect | Au fil du Lot 1 | Preuves d'implémentation (`CHECK-UX-01`/`CHECK-FRONTEND-01`) | Ouvert — relève du Gate 04A, pas de ce Gate 02A |

## 5. Avis spécialisés

| Agent | Avis | Réserves |
| --- | --- | --- |
| UX/UI Design Lead (Claude Code, désigné 2026-07-30, limite d'indépendance tracée : auteur des documents revus) | **GO sous réserve** — proposition consultative uniquement (`agent-routing-rules.md` §7) : les 11 critères sont documentés au sens de « sans objet pour ce périmètre » ou « contenu disponible, implémentation renvoyée au Gate 04A » ; aucun critère n'est en échec | Réserve unique : validation explicite du Product Owner sur cette lecture d'applicabilité, précisément parce qu'une lecture différente (extension tacite de la décision US-125) a déjà été appliquée une fois par erreur d'inférence dans `gate-04A-decision-ep17-lot0-v2.md` §4 |

* Decision specialisee Release Manager, si applicable : Non applicable.

## 6. Décision finale

* Décision du CGPA Chief Delivery Officer : **GO sous réserve, périmètre limité à EP-17 Lot 1** —
  décision explicite du Product Owner (jptshilombo@gmail.com), 2026-08-01, alignée sur l'avis
  UX/UI Design Lead (§5).
* Justification : sur les 11 critères du Gate 02A, 5 sont sans matière nouvelle pour ce périmètre
  (aucun écran/persona/parcours livré en Lot 1), 2 restent inchangés et déjà couverts par les
  décisions US-125 (navigation, information architecture), 3 ont une matière réelle dont le
  contenu est déjà validé (`DSG-001.md`, `DD-611-02`) mais dont l'implémentation est renvoyée au
  Gate 04A. Le seul critère non satisfait — validation Product Owner de cette lecture
  d'applicabilité — est levé par cette décision elle-même, qui tranche explicitement
  l'incohérence documentaire signalée en §0 (l'extension tacite de `gate-02A-decision-ep16-us125.md`,
  périmètre US-125, au périmètre EP-17 n'est plus la base retenue : cette instance fait désormais
  autorité pour EP-17 Lot 1).
* Validité : limitée au périmètre EP-17 Lot 1 tel que défini par
  `plan-execution-ux-ui-primeng-keycloak.md` §3. Ne vaut pas autorisation pour Lot 2 et suivants —
  ceux-ci introduiront des écrans métier réels et devront réévaluer les 5 critères ici jugés
  « sans objet » (personas, journeys, parcours, cas d'erreur, maquettes) sur leur propre matière,
  via une nouvelle instruction du Gate 02A ou une instance dédiée.
* Conditions d'invalidation : toute évolution matérielle du périmètre Lot 1 tel que défini au
  moment de cette décision (notamment toute migration d'écran métier avant Lot 3, contrairement à
  « ne migrer aucun écran métier complet à ce stade ») invalide cette décision et impose une
  nouvelle instruction — jamais une simple reconduction tacite.
* Prochaine action autorisée : ce GO sous réserve **ne vaut pas, à lui seul, autorisation de
  code** — il lève spécifiquement le point Gate 02A resté ouvert depuis l'approbation du Plan
  d'Exécution. Les réserves déjà tracées ailleurs restent intégralement en vigueur : les réserves
  continues du Gate 04A v2 (`gate-04A-decision-ep17-lot0-v2.md` §4, 8 contrôles
  `CHECK-UX-01`/`CHECK-FRONTEND-01` « Non exécuté », preuves à produire au fil du Lot 1) et le
  rappel de renouvellement annuel de la clé de licence PrimeNG (avant 2027-08-01,
  `rapport-licence-securite-primeng-lot0.md` §9). Sous réserve de ces points, le développement
  technique du Lot 1 (installation PrimeNG, tokens, thème) peut démarrer.

## 7. Traçabilité

* Mise à jour `/docs/project-state.md` : entrée de décision ajoutée le 2026-08-01.
* Responsable de la décision : Product Owner (jptshilombo@gmail.com), CGPA Chief Delivery Officer.
* Date de validation humaine : 2026-08-01.
