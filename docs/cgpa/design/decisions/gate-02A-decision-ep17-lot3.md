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
  évalués contre le périmètre visé du **Lot 3** : `US-133` (Pilote dashboard Bailleur, 8 pts) et
  `US-134` (Pilote Biens/Patrimoines, 5 pts) — sous réserve que le périmètre exact ne soit pas
  encore confirmé par le Product Owner (`gate-04A-decision-ep17-lot3.md` §4).
* Exemptions justifiées : aucune — chaque critère est évalué individuellement ci-dessous.
* Contrôles non exécutés : plusieurs, détaillés au §3 — à la différence du Lot 2, ce n'est **pas**
  un simple constat d'absence de matière : le Lot 3 touche un écran réel et plusieurs livrables UX
  attendus par ce Gate n'existent pas encore pour ce périmètre précis.

## 3. Preuves et résultats — les 11 critères du Gate 02A appliqués au Lot 3

| Critère | Constat pour le périmètre Lot 3 | Preuve |
| --- | --- | --- |
| Personas validés | **Matière réelle et partiellement couverte** — le persona « Bailleur — persona primaire » (`phase-02-user-journeys.md` §1.1) décrit déjà l'usage général du dashboard (fréquence de consultation, objectifs) ; produit pour `US-125`, mais son contenu générique reste valide pour ce pilote | `phase-02-user-journeys.md` §1.1 |
| User journeys documentés | **Non exécuté** — les parcours documentés (J1/J2) couvrent la gestion des notifications, pas les flux CRUD Biens/Patrimoines/Baux visés par `US-133`/`US-134` ; aucun parcours n'existe pour ce périmètre précis | `phase-02-user-journeys.md` (périmètre US-125 uniquement) |
| Parcours critiques identifiés | **Non exécuté au sens documentaire** — les parcours CRUD biens/patrimoines/baux/affectations existent et fonctionnent en production (non nouveaux), mais ne sont formellement documentés nulle part comme parcours UX ; risque atténué par leur usage réel déjà établi et par les tests de non-régression fonctionnelle exigés par le critère GWT `US-133` | Code existant (`BailleurDashboardComponent`, 1177 lignes) ; aucun document dédié |
| Cas nominaux et cas d'erreur documentés | **Préparation en cours** — `lt-empty-state`/`lt-data-table` (Lot 2) fournissent le vocabulaire d'état vide/erreur, mais aucun mapping n'existe encore entre ces états et les données réelles du dashboard Bailleur | `CHECK-UX-01-ep17-ui-foundation.md` (note 2026-08-02) |
| Information architecture validée | **Matière réelle et disponible** — arborescence actuelle constatée par lecture directe du code (`/bailleur` → sections Patrimoines/Biens/Baux/Affectations/Paiements/Garanties/Honoraires/Alertes/Audit) ; le périmètre Lot 3 est une substitution de composants **à l'intérieur** de cette arborescence, sans la modifier | `phase-02-information-architecture.md` §1 |
| Navigation globale stabilisée | **Inchangée** — aucune route ni navigation touchée par une migration de présentation | idem |
| Design system validé | Mapping initial documenté et son contenu accepté (`DSG-001.md` §Composants/§Component Mapping) ; 8 composants désormais **implémentés et testés** (Lot 2, contrairement au Lot 2 lui-même où seul le contenu existait) ; leur **application réelle** dans le dashboard reste à faire — relève du Gate 04A | `DSG-001.md` §Composants ; `CHECK-UX-01-ep17-ui-foundation.md` |
| Responsive strategy définie | Stratégie documentée (`DSG-001.md` §Responsive Rules, Lot 1) ; jamais testée sur un écran réel — le dashboard Bailleur actuel n'a lui-même aucune preuve de comportement responsive documentée | `DSG-001.md` §Responsive Rules |
| Accessibilité minimale définie | **Partiel** — `lt-confirm-dialog` testé (5/6 exigences `DDS-LT-005`) ; le reste du dashboard (formulaires, tableaux, navigation clavier globale) n'a fait l'objet d'aucun audit | `CHECK-UX-01-ep17-ui-foundation.md` (note 2026-08-02) |
| Maquettes des écrans critiques disponibles | **Non exécuté** — aucune maquette « avant/après migration » n'existe pour les sections du dashboard Bailleur visées par `US-133`/`US-134` ; `phase-02-ui-mockups.md` ne couvre que les écrans Notifications (`US-125`) | `phase-02-ui-mockups.md` (périmètre US-125 uniquement) |
| Validation Product Owner obtenue | **Objet de cette soumission**, distincte de la confirmation du périmètre exact du pilote (`gate-04A-decision-ep17-lot3.md` §4, non obtenue) | §6 |

**Lecture d'ensemble** : à la différence des Lots 1 et 2, la majorité des critères portent une
matière réelle pour le Lot 3. 2 critères disposent d'une base réelle et directement réutilisable
(information architecture, navigation — la migration ne touchant que la présentation à l'intérieur
d'une arborescence inchangée). 1 critère (personas) est partiellement couvert par du contenu
existant mais générique. 2 critères sont documentés en contenu mais non exécutés/testés sur ce
périmètre (design system, accessibilité — même logique qu'au Lot 2, renvoi au Gate 04A). 1 critère
(responsive) a sa stratégie définie mais jamais vérifiée. **4 critères sont de véritables lacunes
pour ce périmètre précis** : parcours utilisateurs (CRUD biens/patrimoines/baux), cas nominaux/
erreur mappés au réel, et surtout **maquettes des écrans critiques absentes** — aucun support
visuel n'existe pour valider la migration avant qu'elle ne soit codée. Le dernier critère
(validation Product Owner) est l'objet de cette soumission.

## 4. Bloqueurs et réserves

| ID | Type | Impact | Autorité d'acceptation | Responsable | Échéance | Preuve attendue | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| — (maquettes absentes) | Bloqueur | Aucune maquette « avant/après » ne couvre les sections du dashboard Bailleur visées par `US-133`/`US-134` — risque de découvrir des écarts visuels/fonctionnels seulement en cours de développement | Product Owner | Design Architect | Avant tout développement de section du dashboard | Au moins un support visuel (maquette basse fidélité acceptable) par section migrée, validé Product Owner | Ouvert |
| — (périmètre exact du pilote non confirmé) | Bloqueur, partagé avec Gate 04A | Sans confirmation, ni maquette ni parcours ne peuvent être produits de façon ciblée | Product Owner | Product Owner | Avant toute instruction complémentaire | Décision Product Owner tracée (cf. `gate-04A-decision-ep17-lot3.md` §4) | Ouvert |
| DD-EP17-05 | Réserve, Majeur | Focus-trap/restitution du focus testés (5/6 exigences), mais aucune action destructive réelle n'a encore utilisé `lt-confirm-dialog` | Product Owner | Design Architect | Avant tout dialogue modal en Production | Intégration réelle avec test de non-régression | Ouvert |

## 5. Avis spécialisés

| Agent | Avis | Réserves |
| --- | --- | --- |
| UX/UI Design Lead (Claude Code, désigné 2026-07-30, limite d'indépendance tracée) | **NO GO en l'état** — proposition consultative, à la différence des Lots 1 et 2 : 4 des 11 critères portent une lacune réelle pour ce périmètre précis (parcours utilisateurs, cas nominaux/erreur mappés au réel, et surtout l'absence de toute maquette), pas une simple absence de matière. L'écran cible est déjà en production et affiche des données financières — le risque de migrer sans support visuel validé est disproportionné par rapport au gain de vitesse | Recommande, avant toute instruction complémentaire de ce Gate : (1) confirmation Product Owner du périmètre exact du pilote ; (2) au moins une maquette basse fidélité par section confirmée ; (3) un parcours écrit (même bref) des flux CRUD concernés. Sur cette base, un GO sous réserve stricte deviendrait défendable, avec exécution section par section (cf. avis Design/Frontend Architect, `gate-04A-decision-ep17-lot3.md` §5) |

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
