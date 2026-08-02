# Décision GO / NO GO CGPA v6.1.1 — Gate 04A, instance EP-17 Lot 3 (Pilote Angular — dashboard Bailleur)

> Instance du gabarit `docs/cgpa/templates/go-no-go.md`, même principe que
> `gate-04A-decision-ep17-lot2.md`. Le Lot 2 (`US-132`, Composants transverses) est mergé et validé
> Product Owner (GO sous réserve, 2026-08-02). Cette instance statue sur le périmètre **Lot 3**
> (`plan-execution-ux-ui-primeng-keycloak.md` §3 « Lot 3 — Pilote Angular » ;
> `addendum-backlog-ep17-ui-foundation-primeng-keycloak.md`, `US-133`/`US-134`, 13 points). **La
> section 6 est volontairement laissée non renseignée par Claude Code** — seul le Product Owner
> peut la compléter, conformément à `chief-delivery-officer.md` et `CLAUDE.md`.

## 1. Identification

* ID décision : `GATE-04A-EP17-LOT3-2026-08-02`
* Projet : LoyerTracker
* Gate ou jalon évalué : Gate 04A — Design Readiness (`docs/cgpa/gates/gate-04A-design-readiness.md`)
* Phase : Phase 04A, périmètre EP-17 Lot 3 (Pilote Angular), après Lot 2 livré et validé
* Environnement source et cible : Aucun à ce stade — documentaire ; le Lot 3 lui-même vise un
  déploiement effectif (premier écran métier réel touché, `BailleurDashboardComponent`)
* Artefact, version, commit ou digest : `feat/us-132-composants-transverses` `d8c18c8` (US-132
  validée GO sous réserve) ; `CHECK-UX-01-ep17-ui-foundation.md` et
  `CHECK-FRONTEND-01-ep17-ui-foundation.md` (notes de mise à jour 2026-08-02) ;
  `design-debt-register-loyertracker.md` (DD-EP17-04/05 partiellement traités, 2026-08-02)
* Date : 2026-08-02
* Décision précédente référencée : `gate-04A-decision-ep17-lot2.md` (GO sous réserve, Lot 2,
  2026-08-01) — périmètre épuisé par la livraison et la validation du Lot 2 (2026-08-02)

## 2. Périmètre et applicabilité

* Contrôles applicables : les mêmes 16 critères bloquants de `gate-04A-design-readiness.md` (13
  via `CHECK-UX-01`, 8 via `CHECK-FRONTEND-01`), réévalués après livraison du Lot 2. **Différence
  structurelle majeure avec le Lot 2** : le Lot 3 n'est plus un développement isolé — il intègre
  des composants `lt-*` dans un écran métier réel, en production potentielle, affichant des
  données financières réelles (loyers, paiements, garanties, honoraires visibles sur le dashboard
  Bailleur). Le raisonnement « structurellement impossible à satisfaire avant ce Lot » qui
  justifiait le GO sous réserve du Lot 2 s'applique encore aux deux derniers contrôles bloquants
  (Responsive, Cohérence multi-écrans — cf. `CHECK-UX-01-ep17-ui-foundation.md`, note 2026-08-02),
  mais la nature du risque change : une erreur ici touche un écran déjà utilisé, pas un composant
  isolé et hors production.
* Applicabilité `CHECK-FIN-01` (Financial Governance) : le dashboard Bailleur affiche des données
  financières (paiements, garanties, honoraires). `financial-governance-status-loyertracker.md`
  rend `CHECK-FIN-01` obligatoire pour « tout changement significatif touchant des valeurs
  monétaires ». Le périmètre de `US-133`/`US-134`, tel que défini par son critère GWT (« non-
  régression fonctionnelle complète … aucune donnée financière masquée »), est une **migration de
  présentation** (substitution de composants `lt-*` à du HTML/CSS existant), pas un changement de
  calcul, de ledger ni de logique financière backend. **`CHECK-FIN-01` jugé non applicable à ce
  stade, sous cette seule condition** : si le périmètre réel dépasse la présentation (toute
  modification de calcul, d'arrondi, de devise ou de logique de solde), `CHECK-FIN-01` devient
  obligatoire avant merge — condition d'invalidation explicite au §6.
* Contrôles non exécutés (recalculé après notes de mise à jour du 2026-08-02) :
  * `CHECK-UX-01` : Responsive, Cohérence multi-écrans (2 contrôles bloquants restants ;
    Performance UX/perçue, non bloquant, reste également Non exécuté).
  * `CHECK-FRONTEND-01` : 0 contrôle « Non exécuté » — le dernier (tests composant/a11y/responsive)
    est reclassé « Préparation en cours » (volet responsive toujours absent).
  * Les deux contrôles bloquants restants nécessitent un écran réel intégrant les composants —
    exactement l'objet du Lot 3.

## 3. Preuves et résultats

| Contrôle | Résultat | Preuve | Criticité | Validité |
| --- | --- | --- | --- | --- |
| `CHECK-UX-01` (13 contrôles) | 4 PASS, 6 Préparation en cours, 3 Non exécuté (2 bloquants) | Note de mise à jour 2026-08-02 | Bloquant | 2026-08-02 |
| `CHECK-FRONTEND-01` (8 contrôles) | 2 PASS, 6 Préparation en cours, 0 Non exécuté | Note de mise à jour 2026-08-02 | Bloquant | 2026-08-02 |
| Livraison et validation effective du Lot 2 | 8 composants `lt-*` + service Toast, 133/133 tests, `lt-confirm-dialog` testé en navigateur réel (5/6 exigences `DDS-LT-005`) | PR #338 mergée, `docs/project-state.md` (décision GO sous réserve, 2026-08-02) | Bloquant (préalable) | 2026-08-02 |
| Confirmation Product Owner du périmètre exact du pilote | **Obtenue (2026-08-02)** — périmètre limité à la section Patrimoines/Biens du dashboard Bailleur (`US-133` restreinte, `US-134`), hors Affectations/Paiements/Garanties/Honoraires/Alertes/Audit | `addendum-backlog-ep17-ui-foundation-primeng-keycloak.md` (note 2026-08-02), `docs/project-state.md` | Bloquant | 2026-08-02 |
| Validation Product Owner — décision Gate 04A Lot 3 elle-même | **Objet de cette instance** — non obtenue au moment de la rédaction | §6 | Bloquant | — |

## 4. Bloqueurs et réserves

| ID | Type | Impact | Autorité d'acceptation | Responsable | Échéance | Preuve attendue | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| — (périmètre exact du pilote non confirmé) | Bloqueur structurel | Sans ce choix, aucune maquette, parcours ni découpage de migration ne peut être produit pour Lot 3 | Product Owner | Product Owner | Avant tout développement Lot 3 | Décision Product Owner tracée | **Levé (2026-08-02)** — périmètre confirmé : section Patrimoines/Biens uniquement (`US-133` restreinte + `US-134`), hors Affectations/Paiements/Garanties/Honoraires/Alertes/Audit |
| — (composants `lt-*` non intégrés à un écran réel) | Bloqueur structurel | 2 contrôles `CHECK-UX-01` (Responsive, Cohérence multi-écrans) restent « Non exécuté » faute d'écran réel | Product Owner | Design Architect, Frontend Architect | Au fil du Lot 3 | Section Patrimoines/Biens migrée, testée responsive à au moins 2 breakpoints (`DSG-001.md` §Responsive Rules), cohérence vérifiée entre sections migrées et non migrées | Ouvert — objet même du Lot 3, périmètre désormais restreint à Patrimoines/Biens |
| DD-611-02 | Réserve | Dette registre non close (preuve d'implémentation `lt-*` en écran réel requise) | Product Owner | Design Architect | — | Composants adoptés dans un écran métier | Ouvert — composants livrés (Lot 2), adoption reste à faire (Lot 3) |
| DD-611-03 | Réserve | Preuves de test par Story structurellement partielles (tests composant Lot 2 obtenus, tests d'intégration écran manquants) | Product Owner | Frontend Architect | — | Tests unitaires/a11y/responsive par écran migré | Ouvert |
| DD-EP17-04 | Réserve, échéance Lot 2, partiellement traitée | `lt-data-table` livré mais non adopté par les 4 composants dupliqués existants | Product Owner | Frontend Architect | Lot 3 | Adoption réelle dans au moins un composant migré | Ouvert — adoption relève de ce Lot (`lt-data-table` sur la section Biens, `US-134`) |
| DD-EP17-05 | Réserve, Majeur, partiellement traitée | Test dédié exécuté (5/6 exigences `DDS-LT-005`) | Product Owner | Design Architect | Avant tout dialogue modal en Production | Intégration réelle de `lt-confirm-dialog` dans un flux avec test de non-régression | **Non pertinent pour ce Lot 3** — une action destructive existe réellement (« Archiver ce bien », constat corrigeant celui inscrit initialement ici, cf. `phase-02-user-journeys-ep17-lot3.md` §0), mais reste délibérément sur `confirm()` natif, non migrée vers `lt-confirm-dialog` dans ce Lot ; redeviendrait pertinente si cette migration était étendue |
| DD-EP17-06 | Réserve, Mineur | Tokens `--lt-space-*` définis mais non adoptés | Product Owner | Design Architect | — | Adoption réelle dans les sections migrées | Ouvert |
| DD-EP17-10 | Réserve, nouvelle | Absence d'état d'erreur au chargement des listes Biens/Patrimoines, identifiée lors de la production de la maquette (`phase-02-ui-mockups-ep17-lot3.md`) | Product Owner | Frontend Architect | Lot 3 | État `lt-empty-state` (variante erreur) livré et testé | Ouvert |
| — (données financières affichées) | Réserve, Financial Governance | Dashboard Bailleur affiche loyers/paiements/garanties/honoraires — critère GWT `US-133` (« aucune donnée financière masquée ») | Product Owner | Frontend Architect | Chaque section migrée | Diff visuel/fonctionnel démontrant l'absence de perte d'affichage de donnée financière | **Non pertinent pour ce Lot 3** — ni `Bien` ni `Patrimoine` ne portent de champ monétaire (constat vérifié sur le modèle réel, `s02-api.service.ts`) ; le loyer est un attribut du `Bail`, hors périmètre |

## 5. Avis spécialisés

| Agent | Avis | Réserves |
| --- | --- | --- |
| Design Architect (Claude Code, désigné 2026-07-30, limite d'indépendance tracée) | **GO sous réserve stricte, périmètre Patrimoines/Biens uniquement** — les fondations (tokens, thème, architecture SCSS, 8 composants testés) sont solides ; le périmètre confirmé (aucune donnée financière) réduit sensiblement le risque par rapport à un dashboard complet, même si la section porte en réalité un CRUD complet (§3bis de `gate-02A-decision-ep17-lot3.md`) et pas une simple lecture ; les 2 derniers contrôles bloquants (Responsive, Cohérence multi-écrans) restent structurellement liés à l'exécution de ce Lot | Exécution section par section maintenue par prudence (ex. liste avant formulaire) ; Visual Review et test de non-régression avant extension à toute autre section |
| Frontend Architect (Claude Code, désigné 2026-07-31, limite d'indépendance tracée) | **GO sous réserve stricte, périmètre Patrimoines/Biens uniquement** — l'architecture par domaines et le lazy loading existants absorbent le changement sans réécriture ; `lt-data-table`/`lt-form-field` sont testés isolément mais jamais encore exercés contre un flux réel (create/update/archive) | Le mécanisme d'archivage (`confirm()` natif) doit être préservé strictement tel quel dans ce Lot — toute tentation de le migrer vers `lt-confirm-dialog` « en passant » sortirait du périmètre de présentation pure et redeviendrait `DD-EP17-05` |

* Les deux avis ci-dessus ont été révisés le 2026-08-02 après production de
  `phase-02-user-journeys-ep17-lot3.md` et `phase-02-ui-mockups-ep17-lot3.md`, qui ont corrigé la
  caractérisation initiale du périmètre (« lecture principalement » → CRUD complet réel, sans
  donnée financière) et fourni le contenu détaillé (parcours, maquette, correspondance composants
  `lt-*`) qui manquait à cette instance à sa rédaction. Aucun des deux rôles désignés n'a toutefois
  produit un avis complet formellement réinstruit contre ce contenu — avis de principe fondé sur
  l'état factuel désormais disponible. Une ré-instruction complète reste possible si le Product
  Owner le juge nécessaire avant de trancher §6.
* Décision spécialisée Release Manager, si applicable : Non applicable à ce stade — la question se
  posera au premier artefact candidat à une release incluant ce pilote.

## 6. Décision finale

* Décision du CGPA Chief Delivery Officer : **GO sous réserve, périmètre limité à EP-17 Lot 3 —
  section Patrimoines/Biens uniquement** — décision explicite du Product Owner
  (jptshilombo@gmail.com), 2026-08-02, alignée sur les avis Design Architect et Frontend Architect
  (§5, GO sous réserve stricte).
* Justification : les fondations livrées au Lot 2 (8 composants `lt-*` testés, tokens, thème,
  architecture SCSS) réduisent le risque d'implémentation. Le périmètre confirmé (Patrimoines/Biens
  uniquement, aucune donnée financière — vérifié sur le modèle réel) limite l'exposition par
  rapport à un dashboard complet, malgré la correction apportée en cours d'instruction (la section
  porte un CRUD complet, pas une simple lecture). Les deux derniers contrôles bloquants `CHECK-UX-01`
  (Responsive, Cohérence multi-écrans) restent structurellement liés à l'exécution de ce Lot lui-même,
  même raisonnement déjà appliqué aux Lots 1 et 2.
* Validité : limitée strictement au périmètre confirmé — section **Patrimoines/Biens** du dashboard
  Bailleur (`US-133` restreinte + `US-134`), migration de présentation uniquement. Ne couvre pas
  Affectations, Paiements, Garanties, Honoraires, Alertes, Journal d'audit, ni les dashboards
  Gestionnaire — chacun nécessite sa propre instruction de Gate. Ne vaut pas autorisation pour tout
  Lot ultérieur.
* Conditions d'invalidation : toute évolution matérielle des preuves invalide cette décision et
  impose une nouvelle instruction (clause reprise de `gate-04A-decision-ep17-lot2.md` §6).
  S'ajoutent explicitement : toute migration touchant une autre section du dashboard que
  Patrimoines/Biens ; toute migration du mécanisme d'archivage (`confirm()` natif) vers
  `lt-confirm-dialog` sans instruction distincte (réactiverait `DD-EP17-05`) ; toute introduction de
  donnée financière dans le périmètre migré ; réouverture de `DD-611-02`, `DD-611-03`, `DD-EP17-04`,
  `DD-EP17-06` ou `DD-EP17-10`.
* Prochaine action autorisée : ce GO sous réserve **ne vaut pas, à lui seul, autorisation de
  code** — `plan-execution-ux-ui-primeng-keycloak.md` reste « APPROUVÉ SOUS RÉSERVE — PÉRIMÈTRE
  LOT 1 ET LOT 2 » (§12). L'approbation explicite de l'extension du Plan d'Exécution au Lot 3 reste
  une action Product Owner distincte, préalable à tout développement effectif — cohérente avec le
  traitement déjà appliqué au passage Lot 1 → Lot 2. Une fois cette approbation obtenue, le
  développement du Lot 3 peut démarrer, section par section (liste avant formulaire), sous réserve
  continue des preuves de test/implémentation §4.

## 7. Traçabilité

* Mise à jour `/docs/project-state.md` : entrée de décision ajoutée le 2026-08-02.
* Responsable de la décision : Product Owner (jptshilombo@gmail.com), CGPA Chief Delivery Officer.
* Date de validation humaine : 2026-08-02.
