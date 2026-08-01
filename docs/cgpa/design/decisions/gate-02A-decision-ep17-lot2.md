# Décision GO / NO GO CGPA v6.1.1 — Gate 02A, instance EP-17 Lot 2 (applicabilité)

> Instance du gabarit `docs/cgpa/templates/go-no-go.md`, même convention que
> `gate-02A-decision-ep17-lot1.md`. Requise par le principe déjà établi pour ce périmètre : chaque
> lot du Plan d'Exécution est un point de contrôle Gate distinct, aucune décision de Gate 02A
> antérieure (US-125, ni Lot 1) ne s'étend tacitement au Lot 2. **La section 6 est volontairement
> laissée non renseignée par Claude Code** — seul le Product Owner peut la compléter, conformément
> à `CLAUDE.md`.

## 1. Identification

* ID décision : `GATE-02A-EP17-LOT2-2026-08-01`
* Projet : LoyerTracker
* Gate ou jalon évalué : Gate 02A — UX Gate (`docs/cgpa/gates/gate-02A-ux-design-readiness.md`)
* Phase : Phase 02 → Gate 02A → Phase 03, périmètre EP-17 Lot 2 (Composants transverses :
  `plan-execution-ux-ui-primeng-keycloak.md` §3)
* Environnement source et cible : Aucun — documentaire, aucun déploiement
* Artefact, version, commit ou digest : `DSG-001.md` v0.2.0 (§Composants, §Component Mapping) ;
  `DDS-LT-005-composant-modal-confirmation.md` (Acceptée, 2026-07-31) ; `DDS-LT-006` (Acceptée,
  2026-08-01)
* Date : 2026-08-01
* Décision précédente référencée : `gate-02A-decision-ep17-lot1.md` (GO sous réserve, Lot 1,
  2026-08-01) — périmètre distinct, non étendu tacitement au Lot 2 (même principe que celui
  clarifié pour Lot 1 vis-à-vis de US-125)

## 2. Périmètre et applicabilité

* Contrôles applicables : les 11 points de contrôle GO de `gate-02A-ux-design-readiness.md`,
  évalués contre le périmètre exact du **Lot 2** : `lt-page-header`, `lt-stat-card`,
  `lt-status-tag`, `lt-empty-state`, `lt-data-table`, `lt-confirm-dialog`, `lt-form-field`, service
  Toast — « développés et testés isolément, **sans intégration dans un écran métier existant** »
  (`plan-execution-ux-ui-primeng-keycloak.md` §3 Lot 2).
* Exemptions justifiées : aucune exemption de Gate — chaque critère individuel est évalué
  ci-dessous, conformément à `CLAUDE.md` (« un contrôle applicable sans preuve est non exécuté,
  jamais non applicable »).
* Contrôles non exécutés : validation Product Owner de cette applicabilité — objet de cette
  soumission (§6).

## 3. Preuves et résultats — les 11 critères du Gate 02A appliqués au Lot 2

| Critère | Constat pour le périmètre Lot 2 | Preuve |
| --- | --- | --- |
| Personas validés | Sans matière nouvelle — les composants sont testés isolément, sans écran métier ni utilisateur final concerné à ce stade | Plan d'Exécution §3 Lot 2 |
| User journeys documentés | Sans matière nouvelle, même constat | idem |
| Parcours critiques identifiés | Sans matière nouvelle, même constat | idem |
| Cas nominaux et cas d'erreur documentés | Les **états transverses du composant** (vide, chargement, erreur — `lt-empty-state` notamment) relèvent du critère GWT propre de `US-132` et de `CHECK-UX-01` (« États erreur/vide/chargement »), pas d'un parcours utilisateur au sens de ce Gate — sans matière nouvelle ici | `addendum-backlog-ep17-ui-foundation-primeng-keycloak.md` (US-132) |
| Information architecture validée | Inchangée — aucune navigation ni arborescence modifiée | idem |
| Navigation globale stabilisée | Inchangée | idem |
| Design system validé | **Matière réelle** — `DSG-001.md` v0.2.0 §Composants/§Component Mapping fixe le mapping initial des 8 composants ; contenu déjà validé (tokens, `DDS-LT-006`) mais **implémentation renvoyée au Gate 04A** (`CHECK-UX-01`/`CHECK-FRONTEND-01`), pas à ce Gate | `DSG-001.md` §Composants |
| Responsive strategy définie | Stratégie déjà définie (`DSG-001.md` §Responsive Rules, Lot 1) ; l'exécution par composant relève du Gate 04A | idem |
| Accessibilité minimale définie | **Matière réelle et critique** — `lt-confirm-dialog` est le premier modal du produit ; ses 6 exigences d'accessibilité non négociables (focus-trap, restitution du focus, `Échap`, rôle ARIA, libellés explicites, message post-action) sont déjà fixées et acceptées (`DDS-LT-005`). Contenu défini ; exécution (`CHECK-ACCESSIBILITY-01`) renvoyée au Gate 04A | `DDS-LT-005-composant-modal-confirmation.md` |
| Maquettes des écrans critiques disponibles | Sans objet pour Lot 2 — aucun écran, seulement des composants isolés | Plan d'Exécution §3 Lot 2 |
| Validation Product Owner obtenue | **Objet de cette soumission** | §6 |

**Lecture d'ensemble** : sur les 11 critères, 5 sont sans matière nouvelle (personas, journeys,
parcours, cas d'erreur au sens parcours, maquettes — Lot 2 ne livre aucun écran). 2 sont inchangés
(navigation, information architecture). 2 portent une matière réelle propre au Lot 2 (design
system, accessibilité) dont le **contenu** est déjà documenté et accepté (`DSG-001.md`,
`DDS-LT-005`), l'**implémentation/exécution** relevant du Gate 04A. Le dernier (responsive) a sa
stratégie déjà définie en Lot 1. Le critère restant (validation Product Owner) est l'objet de
cette soumission.

## 4. Bloqueurs et réserves

| ID | Type | Impact | Autorité d'acceptation | Responsable | Échéance | Preuve attendue | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| — (validation PO applicabilité Lot 2) | Bloqueur | Seul critère non satisfait des 11 pour ce périmètre | Product Owner | Product Owner | Avant instruction du Gate 02A pour EP-17 Lot 2 | Décision Product Owner tracée | **Objet de cette soumission** |
| DD-EP17-05 | Réserve, Majeur | Focus-trap/restitution du focus de `lt-confirm-dialog` à exécuter contre les 6 exigences déjà fixées | Product Owner | Design Architect | Avant tout dialogue modal en Production | `CHECK-ACCESSIBILITY-01` exécuté | Ouvert — contenu défini, exécution renvoyée au Gate 04A |

## 5. Avis spécialisés

| Agent | Avis | Réserves |
| --- | --- | --- |
| UX/UI Design Lead (Claude Code, désigné 2026-07-30, limite d'indépendance tracée) | **GO sous réserve** — proposition consultative : les 11 critères sont soit sans objet pour ce périmètre, soit déjà couverts par du contenu accepté (`DSG-001.md`, `DDS-LT-005`) dont l'implémentation relève du Gate 04A | Réserve unique : validation explicite du Product Owner sur cette lecture d'applicabilité, cohérente avec celle déjà validée pour le Lot 1 |

* Decision specialisee Release Manager, si applicable : Non applicable.

## 6. Décision finale

* Décision du CGPA Chief Delivery Officer :
* Justification :
* Validité :
* Conditions d'invalidation :
* Prochaine action autorisée :

## 7. Traçabilité

* Mise à jour `/docs/project-state.md` : à ajouter après décision §6.
* Responsable de la décision : Product Owner (jptshilombo@gmail.com), CGPA Chief Delivery Officer.
* Date de validation humaine : —
