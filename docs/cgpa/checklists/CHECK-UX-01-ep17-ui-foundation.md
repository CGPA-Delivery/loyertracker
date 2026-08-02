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
| DSG-001 | Instancié en version 0.1.0 — **Proposé**, avis rendu par le Design Architect désigné (Claude Code, 2026-07-30 — limite d'indépendance tracée, `agent-designations-loyertracker.md`) ; validation humaine indépendante et validation Product Owner non obtenues | **Préparation en cours** | Oui |
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

## Note de mise à jour (2026-07-31, postérieure à cette instance)

La ligne « DSG-001 » notait « validation humaine indépendante et validation Product Owner non
obtenues ». La **validation Product Owner** a depuis été obtenue (`DD-611-02`, acceptation
Product Owner du 2026-07-31 de l'avis de validation Design Architect, `DSG-001.md` §Avis de
validation) — la validation humaine **indépendante** (un Design Architect humain distinct de
Claude Code) reste, elle, non obtenue. Le contrôle reste classé **Préparation en cours** (statut
inchangé, la validation Product Owner n'était qu'une partie de la preuve attendue de cette ligne) ;
l'agrégat de cette instance (0 PASS, 6 Préparation en cours, 7 Non exécuté) n'est pas modifié par
cette précision. Contenu de la ligne d'origine non réécrit, conformément à la préservation des
décisions historiques (`CLAUDE.md`).

## Note de mise à jour (2026-08-01, postérieure à cette instance) — Lot 1 livré

Le Lot 1 (`US-129` Design Tokens, `US-130` Thème PrimeNG, `US-131` Architecture SCSS) est
désormais mergé sur `main` (PR #331-334), avec de l'implémentation réelle, pas seulement
documentaire — deux lignes évoluent :

* **« Tokens »** (notait « candidates … non validées visuellement ») : les 13 tokens de couleur
  ont été revus par contraste WCAG 2.2 (`DDS-LT-006`, Acceptée par le Product Owner le
  2026-08-01), 2 corrections appliquées, 6 nouvelles catégories ajoutées, un fichier de tokens
  versionné produit (`frontend/src/styles/tokens/_lt-tokens.scss`) et **partiellement adopté**
  dans le CSS global (`--lt-surface-page`, `--lt-text-primary`, `--lt-focus-ring*`,
  `--lt-radius-default`, `--lt-font-size-base` réellement utilisés par `styles/theme/`,
  `styles/components/`). Reclassée **PASS** — validation et implémentation réelle obtenues,
  distinct d'une simple documentation d'intention. Ne couvre pas l'adoption dans les composants
  applicatifs existants (hors périmètre Lot 1, cf. `DD-EP17-06` ci-dessous).
* **« Dark mode ou décision d'exemption »** (notait « formalisé comme cible, mode clair hors
  périmètre — décision tracée ») : implémenté réellement en Lot 1 (`index.html`
  `class="p-dark"`, `styles.scss`/`theme/_dark.scss` `color-scheme: dark`, corrigeant
  l'incohérence `light dark` déjà signalée). Reclassée **PASS**.

**Décompte recalculé** : sur 13 contrôles, **2 PASS** (Tokens, Dark mode), **5 « Préparation en
cours »**, **6 « Non exécuté »**, **0 FAIL**. Les contrôles bloquants encore non exécutés
(Responsive, Accessibilité, Cohérence multi-écrans, Composants et variantes, États erreur/vide/
chargement) nécessitent tous une implémentation de composants `lt-*` réels — précisément l'objet
du Lot 2 (`US-132`, Composants transverses). Conformément à la règle d'agrégation 2, le résultat
agrégé reste **NO GO (en l'état)** pour un Gate 04A global du périmètre EP-17 complet — sans
préjuger d'un GO sous réserve limité au seul Lot 2, objet d'une nouvelle instruction distincte
(`gate-04A-decision-ep17-lot2.md`). Contenu des lignes d'origine non réécrit, conformément à la
préservation des décisions historiques (`CLAUDE.md`).

## Note de mise à jour (2026-08-02, postérieure à cette instance) — Lot 2 livré

Le Lot 2 (`US-132`, Composants transverses) est désormais mergé — 8 composants `lt-*` + service
Toast implémentés et testés (133/133 tests, 33 nouveaux), validés par le Product Owner (GO sous
réserve, 2026-08-02). Trois lignes évoluent :

* **« Composants et variantes »** (notait « mapping documenté, aucun composant implémenté ») : les
  8 composants sont désormais codés, testés unitairement et documentés dans `DSG-001.md`
  §Component Mapping. Reclassée **PASS** — implémentation réelle obtenue. Ne couvre pas leur
  adoption dans un écran métier (aucun composant intégré à ce jour, objet du Lot 3).
* **« États erreur, vide et chargement »** (notait « aucun composant `lt-error-state`/
  `lt-empty-state`/`lt-loading-state` livré ») : `lt-empty-state` livré et testé ; `lt-data-table`
  gère nativement ses propres états vide/erreur (sans tri/filtre/pagination — aucun besoin ≥ 2
  écrans confirmé à ce stade). Reclassée **PASS** pour le périmètre transverse ; l'usage réel par
  écran reste à vérifier au fil du Lot 3.
* **« Accessibilité »** (notait « aucun audit exécuté ») : `lt-confirm-dialog` (premier modal du
  produit) a fait l'objet d'un test dédié en navigateur réel (Chrome Headless, pas une simulation)
  couvrant 5 des 6 exigences non négociables de `DDS-LT-005` (focus-trap, restitution du focus,
  fermeture `Échap`, rôle ARIA/`aria-modal`/`aria-labelledby`, libellés explicites) — un écart réel
  détecté et corrigé (restitution du focus non native chez PrimeNG). L'exigence 6 (message
  post-action) est couverte structurellement par `lt-toast`/PrimeNG `p-toast`
  (`role="alert"`/`aria-live="assertive"` natifs), non encore câblée à un appelant réel. Reclassée
  **Préparation en cours** — audit réel mais circonscrit à un seul composant, non un audit WCAG 2.2
  AA global du produit ; reste bloquant tant qu'aucun écran métier n'est couvert.

**Décompte recalculé** : sur 13 contrôles, **4 PASS** (Tokens, Dark mode, Composants et variantes,
États erreur/vide/chargement), **6 « Préparation en cours »** (dont Accessibilité, reclassée),
**3 « Non exécuté »** (Responsive, Cohérence multi-écrans, Performance UX/perçue — non bloquant
pour ce dernier). Conformément à la règle d'agrégation 2, le résultat agrégé reste **NO GO
(en l'état)** pour un Gate 04A global EP-17 complet — motif réduit à 2 contrôles bloquants restants
(Responsive, Cohérence multi-écrans), tous deux structurellement impossibles à satisfaire sans au
moins un écran métier réel intégrant les composants `lt-*` — précisément l'objet du Lot 3
(`gate-04A-decision-ep17-lot3.md`). Contenu des lignes d'origine non réécrit, conformément à la
préservation des décisions historiques (`CLAUDE.md`).
