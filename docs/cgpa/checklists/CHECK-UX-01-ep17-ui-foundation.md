# CHECK-UX-01 — Instance EP-17 (Fondation UI PrimeNG/Design Tokens/Keycloak)

> Instance projet du gabarit `docs/cgpa/checklists/check-ux-01.md` (non modifié), sur le même
> principe que `docs/cgpa/reports/CHECK-VAL-01-loyertracker-v6.1.1.md` pour `CHECK-VAL-01`.

| Champ | Valeur |
|---|---|
| Lot | EP-17 — Fondation UX/UI et continuité d'identité Angular–Keycloak |
| Date | 2026-07-30 |
| Résultat global | **NON EXÉCUTÉ** |
| Gate concerné | Gate 04A (`gate-04A-design-readiness.md`) |

Résultat : PASS / PASS sous réserve / FAIL / **NON EXÉCUTÉ**. Un FAIL ou un NON EXÉCUTÉ sur un
contrôle bloquant impose NO GO au Gate 04A. Conformément au Validation Framework CGPA v6.1.1
(§4-5), un contrôle applicable sans preuve est classé **non exécuté**, jamais `PASS` et jamais
`non applicable`.

| Contrôle | Preuve | Résultat | Bloquant |
|---|---|---|---|
| Navigation et user flows | `phase-02-user-journeys.md`, `phase-02-information-architecture.md` (scope US-125 uniquement ; EP-17 hors US-125 non couvert) | **Préparation en cours** | Oui |
| Wireframes critiques | `phase-02-ui-mockups.md` (scope US-125 uniquement) | **Préparation en cours** | Oui |
| Responsive | Stratégie documentée (`DSG-001.md` §Responsive Rules), aucun test exécuté | **Non exécuté** | Oui |
| Accessibilité | Cible WCAG 2.2 AA documentée (`DSG-001.md` §Accessibilité), aucun audit exécuté | **Non exécuté** | Oui |
| DSG-001 | Instancié en version 0.1.0 — **Proposé**, non validé par un Design Architect désigné | **Préparation en cours** | Oui |
| Cohérence multi-écrans | Mapping composants proposé (`DSG-001.md` §Composants), aucune implémentation | **Non exécuté** | Oui |
| Performance UX/perçue | Non mesurée | **Non exécuté** | Non |
| Tokens | Valeurs candidates reconstituées par comptage réel (`DSG-001.md` §Palette), non validées visuellement | **Préparation en cours** | Oui |
| Composants et variantes | Mapping initial documenté (`DSG-001.md` §Composants), aucun composant implémenté | **Non exécuté** | Oui |
| États erreur, vide et chargement | Dette identifiée (`design-debt-register-loyertracker.md`, `DD-EP17-02`), aucun composant `lt-error-state`/`lt-empty-state`/`lt-loading-state` livré | **Non exécuté** | Oui |
| Dark mode ou décision d'exemption | Mode sombre formalisé comme cible initiale (`DSG-001.md` §Dark Mode) ; mode clair explicitement hors périmètre du premier lot — décision tracée | **Préparation en cours** | Non |
| Documentation et traçabilité | `component-inventory-loyertracker.md`, `screen-inventory-loyertracker.md`, `traceability-ui-loyertracker.md` produits | **Préparation en cours** | Oui |
| Dette UX acceptable | `design-debt-register-loyertracker.md` mis à jour (DD-611-01→04, DD-EP17-01→07), aucune dette bloquante non tracée | **Préparation en cours** | Oui |

## Lecture du résultat

Sur 13 contrôles : **0 PASS**, **6 « Préparation en cours »**, **7 « Non exécuté »**, **0 FAIL**.
Conformément au Validation Framework CGPA v6.1.1 (§8, règle d'agrégation 2 : « tout contrôle
bloquant non exécuté impose NO GO »), le résultat agrégé de cette instance est :

**Résultat agrégé : NO GO (en l'état) — préparatoire, non soumis à décision.**

Cette checklist n'est **pas** soumise au Gate 04A par ce document : elle documente l'état de
préparation avant soumission, conformément à la mission (« Ne pas marquer PASS sur la seule base
de documents préparatoires »). La soumission effective au Gate 04A reste une action distincte,
postérieure à l'approbation du Plan d'Exécution et à la réalisation des Lots 0 à 5.
