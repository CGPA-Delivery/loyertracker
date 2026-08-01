# Décision GO / NO GO CGPA v6.1.1 — Gate 04A, instance EP-17 Lot 0 (re-instruction)

> Nouvelle instance du gabarit `docs/cgpa/templates/go-no-go.md`, requise par la clause
> d'invalidation de `gate-04A-decision-ep17-lot0.md` §6 (« toute évolution matérielle des preuves …
> invalide cette décision et impose une nouvelle instruction du Gate 04A … jamais une simple
> reconduction tacite »). Trois évolutions matérielles cumulées depuis la décision précédente
> (NO GO, 2026-07-31) : acceptation Product Owner de `DD-EP17-08` (close), de la validation
> humaine de `DD-611-02` (sous-bloqueur levé, dette ouverte), de la validation humaine de
> `DD-611-03` (sous-bloqueur levé, dette ouverte). La décision `gate-04A-decision-ep17-lot0.md`
> n'est pas réécrite (préservation des décisions historiques, `CLAUDE.md`) — cette instance la
> complète. **La section 6 est volontairement laissée non renseignée par Claude Code** — seul le
> Product Owner peut la compléter, conformément à `chief-delivery-officer.md` (« Il ne délègue
> jamais la décision finale à un sous-agent ») et `CLAUDE.md` (« Aucun pipeline, score, audit
> automatique ou agent spécialisé ne remplace la validation humaine requise »).

## 1. Identification

* ID décision : `GATE-04A-EP17-LOT0-2026-07-31-02`
* Projet : LoyerTracker
* Gate ou jalon évalué : Gate 04A — Design Readiness (`docs/cgpa/gates/gate-04A-design-readiness.md`)
* Phase : Phase 04A, périmètre EP-17 Lot 0 (Gouvernance et baseline), avant Lot 1
* Environnement source et cible : Aucun — documentaire uniquement, aucun déploiement
* Artefact, version, commit ou digest : `ADR-UI-001` (Acceptée, socle, §Stratégie d'état ajoutée), `DSG-001.md` v0.1.0 (Proposé, avis de validation accepté PO), `traceability-ui-loyertracker.md` (avis de validation accepté PO), `plan-execution-ux-ui-primeng-keycloak.md` (Statut : PROPOSÉ — NON APPROUVÉ — CODE INTERDIT, inchangé)
* Date : 2026-07-31
* Décision précédente référencée : `gate-04A-decision-ep17-lot0.md` (NO GO en l'état, 2026-07-31) — invalidée par les trois évolutions matérielles ci-dessus, non rouverte tacitement ; Gate 02A (`gate-02A-decision-ep16-us125.md`, GO sous réserve, 2026-07-31)

## 2. Périmètre et applicabilité

* Contrôles applicables : les 16 critères bloquants de `gate-04A-design-readiness.md` (13 via `CHECK-UX-01`, 8 via `CHECK-FRONTEND-01`, chevauchement documenté dans chaque instance).
* Exemptions justifiées : aucune (projet avec interface utilisateur, exemption backend/API-only non applicable).
* Contrôles non exécutés : Responsive, Accessibilité, Cohérence multi-écrans, Performance UX/perçue, Composants et variantes, États erreur/vide/chargement (`CHECK-UX-01`, 6 contrôles — inchangé depuis 2026-07-30, nécessitent une implémentation réelle) ; Budgets et performance, Component/accessibility/responsive tests (`CHECK-FRONTEND-01`, 2 contrôles restants après la note de mise à jour du 2026-07-31 — la stratégie d'état, seul contrôle « Non exécuté » levé, est reclassée « Préparation en cours »).

## 3. Preuves et résultats

| Contrôle | Résultat | Preuve | Criticité | Validité |
| --- | --- | --- | --- | --- |
| Navigation, wireframes, responsive, accessibilité, composants, erreur/vide/chargement, dette UX (13 contrôles) | **NO GO en l'état** (agrégat inchangé : 0 PASS, 6 Préparation en cours, 7 Non exécuté) | `docs/cgpa/checklists/CHECK-UX-01-ep17-ui-foundation.md` (+ note de mise à jour 2026-07-31) | Bloquant | 2026-07-30/31 |
| Architecture Frontend (8 contrôles : domaines, routing/lazy loading, état, shared library, tokens, CSS/SCSS, budgets, tests) | **NO GO en l'état** (agrégat mis à jour : 0 PASS, 6 Préparation en cours, 2 Non exécuté — était 5/3 avant acceptation `DD-EP17-08`) | `docs/cgpa/checklists/CHECK-FRONTEND-01-ep17-ui-foundation.md` (note de mise à jour 2026-07-31) | Bloquant | 2026-07-31 |
| Validation Product Owner — sous-bloqueurs documentaires (`DD-611-02`, `DD-611-03`, `DD-EP17-08`) | **Obtenue pour les trois**, sans réserve, 2026-07-31 | §4 ci-dessous ; `design-debt-register-loyertracker.md` | Bloquant | 2026-07-31 |
| Validation Product Owner — décision Gate 04A elle-même (GO/GO sous réserve/NO GO) | **Objet de cette instance** — non obtenue au moment de la rédaction de cette section | §6 | Bloquant | — |

## 4. Bloqueurs et réserves

| ID | Type | Impact | Autorité d'acceptation | Responsable | Échéance | Preuve attendue | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DD-611-02 | Bloqueur (sous-partie) | DSG-001/inventaire non validés humainement | Product Owner | Design Architect | Avant Gate 04A | Validation Design Architect obtenue | **Levé** (2026-07-31, `gate-04A-decision-ep17-lot0.md` §4). La dette `DD-611-02` du registre reste ouverte (preuve d'implémentation requise, Validation Framework §5) — non bloquante pour ce sous-critère, mais toujours un contrôle « Non exécuté »/« Préparation en cours » de fond dans `CHECK-UX-01`/`CHECK-FRONTEND-01` tant qu'aucun composant n'est codé. |
| DD-611-03 | Bloqueur (sous-partie) | Traçabilité Story-écran-composant-test incomplète | Product Owner | Frontend Architect | Avant développement Lot 1 | Matrice approuvée | **Levé** (2026-07-31, `gate-04A-decision-ep17-lot0.md` §4). La dette `DD-611-03` du registre reste ouverte (preuves de test par Story requises) — même logique que `DD-611-02`. |
| DD-EP17-08 | Bloqueur | Aucune stratégie d'état documentée | Product Owner | Frontend Architect | Avant Lot 2 | Stratégie d'état tracée | **Close** (2026-07-31, `gate-04A-decision-ep17-lot0.md` §4 et `design-debt-register-loyertracker.md`) — seul des trois bloqueurs d'origine entièrement clos, sa preuve attendue étant purement documentaire. |
| — (UI Specifications) | Réserve | `ui-specifications.md` non instancié | Product Owner | Design Architect | Avant démarrage Lot 2 si non produit | `ui-specifications.md` instancié | Ouvert, inchangé — non bloquant pour une entrée en Lot 1 (échéance Lot 2). |
| — (validation PO Gate 02A) | Bloqueur | Critère Gate 02A non substituable | Product Owner | Product Owner | Avant Gate 02A puis Gate 04A | Décision Product Owner tracée | **Levé** (2026-07-31, `gate-02A-decision-ep16-us125.md`, GO sous réserve). |
| — (implémentation restante) | Bloqueur structurel | Aucun composant `lt-*`/`Notifications*` codé ; 8 contrôles bloquants de `CHECK-UX-01` et 2 de `CHECK-FRONTEND-01` restent « Non exécuté » faute de preuve d'implémentation | Product Owner | Frontend Architect, Design Architect | Avant tout GO Gate 04A sans réserve | Composants livrés, tests exécutés | Ouvert — aucune voie de clôture documentaire, nécessite du code sous Plan d'Exécution approuvé (actuellement CODE INTERDIT). |
| — (approbation Plan d'Exécution) | Bloqueur distinct (hors Gate 04A) | `plan-execution-ux-ui-primeng-keycloak.md` reste « PROPOSÉ — NON APPROUVÉ » | Product Owner | Product Owner | Avant tout développement, même après un GO Gate 04A | Approbation explicite tracée (§12 du Plan) | Ouvert — action Product Owner distincte de la présente décision de Gate, requise en plus d'un GO. |
| — (clé de licence PrimeNG) | Réserve (Lot 1) | Clé de licence Community PrimeUI non obtenue | Product Owner (ou personne mandatée) | Product Owner | Avant installation effective de PrimeNG | Clé obtenue, gérée comme secret hors code | Ouvert — action externe hors périmètre CLI (`rapport-licence-securite-primeng-lot0.md`). |

## 5. Avis spécialisés

| Agent | Avis | Réserves |
| --- | --- | --- |
| UX/UI Design Lead (Claude Code, désigné 2026-07-30) | GO sous réserve — rendu pour Gate 02A (`UXR-001.md`), non ré-instruit spécifiquement pour Gate 04A | Réserve levée : validation Product Owner Gate 02A obtenue (`gate-02A-decision-ep16-us125.md`) |
| Design Architect (Claude Code, désigné 2026-07-30) | NO GO en l'état pour Gate 04A (`DSG-001.md`) — avis non réécrit | Réserve « validation humaine/PO non obtenue » partiellement levée (PO obtenue, `DD-611-02` §4) ; réserve « aucune preuve d'implémentation » **inchangée**, non levée |
| Frontend Architect (Claude Code, désigné 2026-07-31) | NO GO en l'état pour Gate 04A (`CHECK-FRONTEND-01-ep17-ui-foundation.md`) — avis non réécrit, note de mise à jour ajoutée | Réserve « stratégie d'état absente » **levée** (`DD-EP17-08` close) ; réserve « `DD-611-03` non close » **inchangée au sens dette**, sous-bloqueur Gate levé ; architecture domaines/lazy loading toujours jugée saine |

* Aucun des trois sous-agents désignés n'a été ré-instruit pour produire un nouvel avis complet sur cette instance — seules les évolutions ponctuelles ci-dessus ont été tracées, conformément à la préservation des avis historiques (`CLAUDE.md`). Une ré-instruction complète reste possible si le Product Owner le juge nécessaire avant de trancher §6.
* Decision specialisee Release Manager, si applicable : Non applicable — aucun artefact candidat à une release à ce stade.

## 6. Décision finale

* Décision du CGPA Chief Delivery Officer : **GO sous réserve, périmètre limité à EP-17 Lot 1** — décision explicite du Product Owner (jptshilombo@gmail.com), 2026-07-31, alignée sur les trois avis spécialisés tels que mis à jour §5.
* Justification : les trois évolutions matérielles ayant motivé cette re-instruction sont traitées (`DD-EP17-08` close ; sous-blocages Gate `DD-611-02`/`DD-611-03` levés par validation Product Owner sans réserve). Les contrôles bloquants restants — 6 « Préparation en cours » et 2 « Non exécuté » de `CHECK-FRONTEND-01` (Budgets/performance, tests composant/a11y/responsive), 6 « Préparation en cours » et 7 « Non exécuté » de `CHECK-UX-01` — exigent une implémentation réelle non substituable par de la documentation (§2, §3). Ils ne sont donc pas traités comme un blocage à l'entrée en Lot 1, mais comme des réserves continues devant produire leurs preuves au fil du Lot 1, conformément à la piste envisagée en `project-state.md` (« Prochaine action autorisée », note du 2026-07-31).
* Validité : limitée au périmètre EP-17 Lot 1 tel que défini par `plan-execution-ux-ui-primeng-keycloak.md`. Ne vaut pas autorisation pour Lot 2 et suivants — une nouvelle instruction du Gate 04A (ou un Gate spécifique) reste requise avant tout périmètre au-delà du Lot 1.
* Conditions d'invalidation : toute évolution matérielle des preuves invalide cette décision et impose une nouvelle instruction du Gate 04A — jamais une simple reconduction tacite (clause reprise de `gate-04A-decision-ep17-lot0.md` §6). S'ajoutent explicitement : absence, en cours de Lot 1, des preuves de test/implémentation attendues pour les contrôles listés ci-dessus ; réouverture de `DD-611-02`, `DD-611-03` ou `DD-EP17-08` ; toute extension de périmètre au-delà du Lot 1 sans nouvelle décision de Gate.
* Prochaine action autorisée : ce GO sous réserve **ne vaut pas, à lui seul, autorisation de code** — `plan-execution-ux-ui-primeng-keycloak.md` reste « PROPOSÉ — NON APPROUVÉ — CODE INTERDIT » (verrou `CLAUDE.md`, « Aucun code applicatif sans Plan d'Exécution approuvé »). L'approbation explicite du Plan d'Exécution (§12 du Plan) et l'obtention de la clé de licence PrimeNG Community (`rapport-licence-securite-primeng-lot0.md`) restent des actions Product Owner distinctes, préalables à tout développement Lot 1. Une fois ces deux actions réalisées, le développement Lot 1 peut démarrer sous réserve continue des preuves de test/implémentation §4 et §6 ci-dessus.

## 7. Traçabilité

* Mise à jour `/docs/project-state.md` : entrée de décision ajoutée le 2026-07-31.
* Responsable de la décision : Product Owner (jptshilombo@gmail.com), CGPA Chief Delivery Officer.
* Date de validation humaine : 2026-07-31.

## Note de mise à jour (2026-08-01, postérieure à cette instance)

La ligne §4 « — (validation PO Gate 02A) » indiquait ce sous-bloqueur **« Levé »** par extension
de `gate-02A-decision-ep16-us125.md` (GO sous réserve, périmètre **US-125**) au périmètre EP-17.
`plan-execution-ux-ui-primeng-keycloak.md` §3 Lot 0 précise pourtant explicitement que cette
décision « ne couvre que US-125 (EP-16), pas le socle EP-17 » — une contradiction non résolue à
l'époque, signalée dans `project-state.md` (entrée du 2026-07-31, « applicabilité du Gate 02A …
non résolu, non neutralisé »). Une instance dédiée au périmètre EP-17 Lot 1 a depuis été produite,
`gate-02A-decision-ep17-lot1.md`, pour trancher cette applicabilité sans se fonder sur une
extension tacite de la décision US-125. Contenu de la ligne §4 d'origine non réécrit, conformément
à la préservation des décisions historiques (`CLAUDE.md`).
