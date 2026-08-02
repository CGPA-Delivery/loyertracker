# Décision GO / NO GO CGPA v6.1.1 — Gate 02A, instance EP-17 Lot 3 (applicabilité)

> Instance du gabarit `docs/cgpa/templates/go-no-go.md`, même convention que
> `gate-02A-decision-ep17-lot2.md`. **Différence structurelle avec les instances Lot 1 et Lot 2** :
> celles-ci pouvaient légitimement juger la plupart des 11 critères « sans matière nouvelle »,
> aucun écran métier n'étant livré. Le Lot 3 introduit le **premier écran métier réel** du
> périmètre EP-17 (`plan-execution-ux-ui-primeng-keycloak.md` §3, dashboard Bailleur) : les
> critères concernés doivent être évalués sur leur propre matière, pas reconduits tacitement. **La
> section 6 est volontairement laissée non renseignée par Claude Code** — seul le Product Owner
> peut la compléter, conformément à `CLAUDE.md`.

## 1. Identification

* ID décision : `GATE-02A-EP17-LOT3-2026-08-02`
* Projet : LoyerTracker
* Gate ou jalon évalué : Gate 02A — UX Gate (`docs/cgpa/gates/gate-02A-ux-design-readiness.md`)
* Phase : Phase 02 → Gate 02A → Phase 03, périmètre EP-17 Lot 3 (Pilote Angular :
  `plan-execution-ux-ui-primeng-keycloak.md` §3 ; `US-133`/`US-134`, 13 points)
* Environnement source et cible : Aucun à ce stade — documentaire ; le Lot 3 vise un déploiement
  effectif sur un écran déjà en usage
* Artefact, version, commit ou digest : `DSG-001.md` v0.2.0 ; `phase-02-user-journeys.md` §1.1
  (persona Bailleur) ; `phase-02-information-architecture.md` §1 (arborescence réelle constatée par
  lecture de code, 2026-07-30)
* Date : 2026-08-02
* Décision précédente référencée : `gate-02A-decision-ep17-lot2.md` (GO sous réserve, Lot 2,
  2026-08-01) — annonçait explicitement que le Lot 3 « devra réévaluer sur leur propre matière les
  5 critères ici jugés sans objet »

## 2. Périmètre et applicabilité

* Contrôles applicables : les 11 points de contrôle GO de `gate-02A-ux-design-readiness.md`,
  évalués contre le périmètre **confirmé (2026-08-02)** du Lot 3 : section **Patrimoines/Biens**
  du dashboard Bailleur uniquement (`US-133` restreinte + `US-134`, lecture principalement) —
  explicitement hors périmètre : Affectations, Paiements, Garanties, Honoraires, Alertes, Journal
  d'audit (`addendum-backlog-ep17-ui-foundation-primeng-keycloak.md`, note 2026-08-02).
* Exemptions justifiées : aucune — chaque critère est évalué individuellement ci-dessous.
* Contrôles non exécutés : plusieurs, détaillés au §3 — à la différence du Lot 2, ce n'est **pas**
  un simple constat d'absence de matière : le Lot 3 touche un écran réel et plusieurs livrables UX
  attendus par ce Gate n'existent pas encore pour ce périmètre précis.

## 3. Preuves et résultats — les 11 critères du Gate 02A appliqués au Lot 3

| Critère | Constat pour le périmètre Lot 3 | Preuve |
| --- | --- | --- |
| Personas validés | **Matière réelle et partiellement couverte** — le persona « Bailleur — persona primaire » (`phase-02-user-journeys.md` §1.1) décrit déjà l'usage général du dashboard (fréquence de consultation, objectifs) ; produit pour `US-125`, mais son contenu générique reste valide pour ce pilote | `phase-02-user-journeys.md` §1.1 |
| User journeys documentés | **Non exécuté, périmètre désormais restreint** — les parcours documentés (J1/J2) couvrent la gestion des notifications, pas la consultation Biens/Patrimoines ; aucun parcours n'existe pour ce périmètre précis, mais celui-ci se limite maintenant à un flux de lecture (liste + détail), plus simple à documenter que le CRUD complet initialement envisagé | `phase-02-user-journeys.md` (périmètre US-125 uniquement) |
| Parcours critiques identifiés | **Non exécuté au sens documentaire, périmètre réduit** — la consultation Biens/Patrimoines existe et fonctionne en production, sans action destructive dans ce périmètre ; risque atténué par l'usage réel déjà établi et par le critère GWT `US-134` (non-régression sur l'unicité/l'isolation cross-bailleur) | Code existant (`BailleurDashboardComponent`, section Patrimoines/Biens) ; aucun document dédié |
| Cas nominaux et cas d'erreur documentés | **Préparation en cours** — `lt-empty-state`/`lt-data-table` (Lot 2) fournissent le vocabulaire d'état vide/erreur, mapping restant à faire mais désormais circonscrit à une seule section (liste de biens vide, erreur de chargement) | `CHECK-UX-01-ep17-ui-foundation.md` (note 2026-08-02) |
| Information architecture validée | **Matière réelle et disponible** — arborescence actuelle constatée par lecture directe du code ; le périmètre confirmé (Patrimoines/Biens) est une substitution de composants **à l'intérieur** de cette section, sans toucher aux autres ni à la navigation | `phase-02-information-architecture.md` §1 |
| Navigation globale stabilisée | **Inchangée** — aucune route ni navigation touchée par une migration de présentation | idem |
| Design system validé | Mapping initial documenté et son contenu accepté (`DSG-001.md` §Composants/§Component Mapping) ; 8 composants désormais **implémentés et testés** (Lot 2) ; leur **application réelle** à la section Patrimoines/Biens reste à faire — relève du Gate 04A | `DSG-001.md` §Composants ; `CHECK-UX-01-ep17-ui-foundation.md` |
| Responsive strategy définie | Stratégie documentée (`DSG-001.md` §Responsive Rules, Lot 1) ; jamais testée sur un écran réel | `DSG-001.md` §Responsive Rules |
| Accessibilité minimale définie | **Partiel, risque réduit** — `lt-confirm-dialog` testé (5/6 exigences `DDS-LT-005`) mais **non pertinent pour ce périmètre** (aucune action destructive, pas de dialogue modal prévu) ; la section Patrimoines/Biens elle-même (formulaires, tableau, navigation clavier) n'a fait l'objet d'aucun audit dédié | `CHECK-UX-01-ep17-ui-foundation.md` (note 2026-08-02) |
| Maquettes des écrans critiques disponibles | **Non exécuté, périmètre réduit à une seule section** — aucune maquette « avant/après migration » n'existe pour la section Patrimoines/Biens ; `phase-02-ui-mockups.md` ne couvre que les écrans Notifications (`US-125`). Effort de production désormais restreint à 1 section (liste + détail), pas au dashboard complet | `phase-02-ui-mockups.md` (périmètre US-125 uniquement) |
| Validation Product Owner obtenue | **Objet de cette soumission** — distincte de la confirmation du périmètre exact du pilote, **obtenue le 2026-08-02** (`gate-04A-decision-ep17-lot3.md` §3) | §6 |

**Lecture d'ensemble** : le périmètre confirmé (Patrimoines/Biens, lecture principalement) réduit
matériellement le risque par rapport au dashboard complet initialement évalué. 2 critères
disposent d'une base réelle et directement réutilisable (information architecture, navigation). 1
critère (personas) est partiellement couvert par du contenu existant mais générique. 2 critères
sont documentés en contenu mais non exécutés/testés sur ce périmètre (design system,
accessibilité — renvoi au Gate 04A). 1 critère (responsive) a sa stratégie définie mais jamais
vérifiée. Les réserves propres au dialogue modal (`DD-EP17-05`) et aux données financières
deviennent non pertinentes pour ce périmètre restreint. **Persiste une lacune réelle, désormais
circonscrite à une seule section** : aucune maquette ni parcours écrit n'existe encore pour
Patrimoines/Biens — un effort de production nettement plus restreint que pour le dashboard complet,
mais toujours non produit à ce jour. Le dernier critère (validation Product Owner de cette
applicabilité) est l'objet de cette soumission.

## 4. Bloqueurs et réserves

| ID | Type | Impact | Autorité d'acceptation | Responsable | Échéance | Preuve attendue | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| — (maquettes absentes) | Bloqueur, périmètre réduit | Aucune maquette « avant/après » ne couvre la section Patrimoines/Biens confirmée — risque de découvrir des écarts visuels/fonctionnels seulement en cours de développement | Product Owner | Design Architect | Avant tout développement de cette section | Au moins un support visuel (maquette basse fidélité acceptable) pour Patrimoines/Biens, validé Product Owner | Ouvert |
| — (périmètre exact du pilote non confirmé) | Bloqueur, partagé avec Gate 04A | Sans confirmation, ni maquette ni parcours ne peuvent être produits de façon ciblée | Product Owner | Product Owner | Avant toute instruction complémentaire | Décision Product Owner tracée | **Levé (2026-08-02)** — cf. `gate-04A-decision-ep17-lot3.md` §3 |
| DD-EP17-05 | Réserve, Majeur | Focus-trap/restitution du focus testés (5/6 exigences), mais aucune action destructive réelle n'a encore utilisé `lt-confirm-dialog` | Product Owner | Design Architect | Avant tout dialogue modal en Production | Intégration réelle avec test de non-régression | **Non pertinent pour ce périmètre** — Patrimoines/Biens confirmé en lecture, aucun dialogue modal prévu |

## 5. Avis spécialisés

| Agent | Avis | Réserves |
| --- | --- | --- |
| UX/UI Design Lead (Claude Code, désigné 2026-07-30, limite d'indépendance tracée) | **NO GO en l'état, mais périmètre substantiellement réduit** — le choix du Product Owner (Patrimoines/Biens uniquement, lecture principalement, aucune donnée financière ni action destructive) répond à 2 des 3 conditions posées par cet avis avant instruction complémentaire ; **persiste une lacune réelle unique** : aucune maquette ni parcours écrit pour cette section précise. Contrairement au dashboard complet, cet effort est désormais restreint (1 section, lecture seule) et réalisable rapidement | Recommande de produire, avant tout développement : une maquette basse fidélité (même texte structuré) et un parcours écrit bref pour Patrimoines/Biens (liste → détail). Une fois ces deux éléments produits, un **GO sous réserve** deviendrait directement défendable — le périmètre restreint ne justifie plus, à lui seul, un NO GO |

* Décision spécialisée Release Manager, si applicable : Non applicable à ce stade.

## 6. Décision finale

* Décision du CGPA Chief Delivery Officer :
* Justification :
* Validité :
* Conditions d'invalidation :
* Prochaine action autorisée :

## 7. Traçabilité

* Mise à jour `/docs/project-state.md` : entrée d'instruction ajoutée le 2026-08-02.
* Responsable de la décision : Product Owner (jptshilombo@gmail.com), CGPA Chief Delivery Officer.
* Date de validation humaine : —
