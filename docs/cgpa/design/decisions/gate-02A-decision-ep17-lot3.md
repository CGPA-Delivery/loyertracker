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
| User journeys documentés | **PASS (2026-08-02)** — `phase-02-user-journeys-ep17-lot3.md` produit : J-Lot3-1 (Gérer mes biens, CRUD complet — create/read/update/archive, correction du constat initial « lecture seule », cf. §0 de ce document) et J-Lot3-2 (Gérer mes patrimoines, modification) | `phase-02-user-journeys-ep17-lot3.md` |
| Parcours critiques identifiés | **PASS (2026-08-02)** — les deux parcours sont retenus comme bloquants Gate 04A dans le document ci-dessus, avec cas d'erreur/limites documentés | `phase-02-user-journeys-ep17-lot3.md` §4 |
| Cas nominaux et cas d'erreur documentés | **PASS (2026-08-02)** — états nominal/vide/erreur documentés par écran (`phase-02-ui-mockups-ep17-lot3.md` §1.1-1.4, §2.1-2.4) ; l'état d'erreur de chargement est **nouveau** (absent du code actuel, `DD-EP17-10` ajoutée), pas une simple reformulation | `phase-02-ui-mockups-ep17-lot3.md` |
| Information architecture validée | **Matière réelle et disponible** — arborescence actuelle constatée par lecture directe du code ; le périmètre confirmé (Patrimoines/Biens) est une substitution de composants **à l'intérieur** de cette section, sans toucher aux autres ni à la navigation | `phase-02-information-architecture.md` §1 |
| Navigation globale stabilisée | **Inchangée** — aucune route ni navigation touchée par une migration de présentation | idem |
| Design system validé | Mapping initial documenté et son contenu accepté (`DSG-001.md` §Composants/§Component Mapping) ; 8 composants désormais **implémentés et testés** (Lot 2) ; correspondance élément-par-élément désormais établie (`phase-02-ui-mockups-ep17-lot3.md` §0) ; leur **application réelle** reste à faire — relève du Gate 04A | `DSG-001.md` §Composants ; `phase-02-ui-mockups-ep17-lot3.md` §0 |
| Responsive strategy définie | Stratégie documentée (`DSG-001.md` §Responsive Rules, Lot 1) et désormais illustrée pour ce périmètre (`phase-02-ui-mockups-ep17-lot3.md` §3) ; jamais testée sur un écran réel — exécution renvoyée au Gate 04A | `phase-02-ui-mockups-ep17-lot3.md` §3 |
| Accessibilité minimale définie | **Partiel** — `lt-confirm-dialog`/`DDS-LT-005` **non pertinent pour ce périmètre** : l'action « Archiver ce bien » existe réellement dans le code (constat corrigeant celui de cette instance à sa rédaction initiale, cf. §0), mais reste sur `confirm()` natif du navigateur, délibérément non migré vers `lt-confirm-dialog` dans ce Lot (`phase-02-ui-mockups-ep17-lot3.md` §1.2, §4) ; le reste de la section (formulaires, tableau, navigation clavier) n'a fait l'objet d'aucun audit dédié | `phase-02-ui-mockups-ep17-lot3.md` §4 |
| Maquettes des écrans critiques disponibles | **PASS (2026-08-02)** — `phase-02-ui-mockups-ep17-lot3.md` produit : Biens (nominal, sélection, vide, erreur), Patrimoines (nominal, sélection, vide, erreur), variante responsive | `phase-02-ui-mockups-ep17-lot3.md` |
| Validation Product Owner obtenue | **Objet de cette soumission** — distincte de la confirmation du périmètre exact du pilote, **obtenue le 2026-08-02** (`gate-04A-decision-ep17-lot3.md` §3) | §6 |

## 3bis. Correction du constat initial de cette instance (2026-08-02, postérieure à sa rédaction)

Cette instance indiquait initialement que le périmètre confirmé était « lecture principalement »,
« aucune donnée financière ni action destructive ». La production de `phase-02-user-journeys-ep17-lot3.md`
et `phase-02-ui-mockups-ep17-lot3.md`, fondée sur une lecture directe de `dashboard.component.ts`,
corrige ce constat : la section Biens porte un **CRUD complet** (création, modification, et une
action d'archivage réelle, confirmée par `globalThis.confirm()` natif — pas `lt-confirm-dialog`).
Le périmètre fonctionnel migré reste inchangé (Patrimoines/Biens uniquement, aucune donnée
monétaire — ni `Bien` ni `Patrimoine` ne portent de champ financier). L'écart ne porte que sur la
caractérisation initiale du risque, pas sur le périmètre lui-même — signalé plutôt que corrigé
silencieusement, conformément à la pratique déjà suivie pour `DDS-LT-005` (US-132).

**Lecture d'ensemble mise à jour** : sur les 11 critères, **6 sont désormais PASS ou disposent
d'une matière réelle et suffisante** (personas, information architecture, navigation, user
journeys, parcours critiques, cas nominaux/erreur, maquettes — 7 en réalité). 2 critères restent
documentés en contenu mais non exécutés/testés sur ce périmètre réel (design system, accessibilité —
renvoi au Gate 04A, nature normale de ce Gate). 1 critère (responsive) a sa stratégie illustrée mais
non vérifiée. Le dernier critère (validation Product Owner de cette applicabilité) est l'objet de
cette soumission. **Les deux lacunes qui motivaient l'avis NO GO en l'état de cette instance
(parcours et maquettes absents) sont comblées.**

## 4. Bloqueurs et réserves

| ID | Type | Impact | Autorité d'acceptation | Responsable | Échéance | Preuve attendue | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| — (maquettes absentes) | Bloqueur | Aucune maquette « avant/après » ne couvrait la section Patrimoines/Biens confirmée | Product Owner | Design Architect | Avant tout développement de cette section | Au moins un support visuel (maquette basse fidélité acceptable) pour Patrimoines/Biens, validé Product Owner | **Levé (2026-08-02)** — `phase-02-ui-mockups-ep17-lot3.md` produit, validation Product Owner formelle restant à obtenir en parallèle de la décision §6 |
| — (parcours utilisateurs absents) | Bloqueur | Aucun parcours écrit ne couvrait les flux Biens/Patrimoines | Product Owner | UX/UI Design Lead | Avant tout développement de cette section | Parcours écrit par flux | **Levé (2026-08-02)** — `phase-02-user-journeys-ep17-lot3.md` produit |
| — (périmètre exact du pilote non confirmé) | Bloqueur, partagé avec Gate 04A | Sans confirmation, ni maquette ni parcours ne peuvent être produits de façon ciblée | Product Owner | Product Owner | Avant toute instruction complémentaire | Décision Product Owner tracée | **Levé (2026-08-02)** — cf. `gate-04A-decision-ep17-lot3.md` §3 |
| DD-EP17-05 | Réserve, Majeur | Focus-trap/restitution du focus testés (5/6 exigences), mais aucune action destructive réelle n'a encore utilisé `lt-confirm-dialog` | Product Owner | Design Architect | Avant tout dialogue modal en Production | Intégration réelle avec test de non-régression | **Non pertinent pour ce périmètre** — l'action destructive existante (« Archiver ce bien ») reste délibérément sur `confirm()` natif, non migrée vers `lt-confirm-dialog` dans ce Lot (§3bis) |
| DD-EP17-10 | Réserve, nouvelle | Absence d'état d'erreur au chargement des listes Biens/Patrimoines dans le code actuel, identifiée lors de la production de la maquette | Product Owner | Frontend Architect | Lot 3 | État `lt-empty-state` (variante erreur) livré et testé | Ouvert — ajoutée au registre (`design-debt-register-loyertracker.md`) |

## 5. Avis spécialisés

| Agent | Avis | Réserves |
| --- | --- | --- |
| UX/UI Design Lead (Claude Code, désigné 2026-07-30, limite d'indépendance tracée) | **GO sous réserve (2026-08-02, avis révisé)** — les deux lacunes qui motivaient le NO GO en l'état (parcours et maquettes absents) sont comblées par `phase-02-user-journeys-ep17-lot3.md` et `phase-02-ui-mockups-ep17-lot3.md`. Le périmètre reste Patrimoines/Biens uniquement, sans donnée financière ; l'action « Archiver ce bien » existe réellement mais reste sur son mécanisme natif actuel, non touchée par la migration | Réserve : validation Product Owner explicite des deux documents produits (maquette + parcours), au même titre que toute autre preuve de ce Gate — une production par Claude Code ne vaut pas, à elle seule, validation humaine indépendante. `DD-EP17-10` (nouvelle) et `DD-EP17-05` (non pertinente pour ce périmètre) à confirmer |

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
