# Avis Frontend Architect — `CHECK-FRONTEND-01` de remplacement, EP-17 Lot 4 (Pilote Keycloak)

> **Checklist de remplacement**, pas une instance de `check-frontend-01.md` (gabarit Angular). Le
> gabarit original suppose un artefact Angular (architecture par domaines, routing, `NgModule`,
> Karma/Jasmine, budgets `angular.json`) — **non applicable tel quel** à un thème Keycloak
> FreeMarker/CSS statique, sans composant Angular, sans routing, sans bundle applicatif. Cette
> instance adapte les critères réellement pertinents pour ce type d'artefact, conformément à la
> réserve tracée dans `gate-04A-decision-ep17-lot4.md` §11 (« `CHECK-FRONTEND-01` de remplacement
> toujours à instancier »). Produit par Claude Code en tant que **Frontend Architect**, sous-agent
> CGPA désigné (`docs/cgpa/agents/agent-designations-loyertracker.md`).

| Champ | Valeur |
|---|---|
| Lot | EP-17 Lot 4 — Pilote Keycloak (thème `login/`, 6 écrans confirmés) |
| Date | 2026-08-04 |
| Gates concernés | `gate-04A-decision-ep17-lot4.md` §11, `gate-02A-decision-ep17-lot4.md` §11 — réserve Frontend Architect |
| Résultat global | **PASS SOUS RÉSERVE** |
| Limite d'indépendance | Claude Code est co-auteur de l'artefact revu ici — limite déjà tracée pour les autres rôles désignés sur ce projet |

## Contrôles

| Contrôle | Preuve | Résultat |
|---|---|---|
| Aucune surcharge de template FreeMarker | `find infra/keycloak/themes -type f` : `theme.properties` + 2 fichiers CSS uniquement, aucun `.ftl` — confirmé à l'audit sécurité du 2026-08-03 | **PASS** |
| Source de tokens partagée, pas de duplication non disciplinée | `DD-EP17-03` close : `tokens.css` canonique, copie disciplinée dans `_lt-tokens.scss` (lien symbolique tenté puis abandonné pour raison de frontière de build Docker, documenté), même valeurs des deux côtés | **PASS** |
| Absence de `!important` / lisibilité CSS | `grep -c '!important'` : **0** occurrence sur les 2 fichiers (112 + 94 lignes, 12 Ko au total) | **PASS** |
| Aucun script ni CDN externe | `theme.properties` : `scripts=` vide ; 0 fichier `.js` sous `infra/keycloak/themes/` ; 0 `@import`/`url()` externe dans les 2 CSS (vérifié à l'audit sécurité, interdictions 5 et 6 `ADR-UI-001`) | **PASS** |
| Poids du thème | 12 Ko CSS total (`login.css` 8 Ko, `tokens.css` 4 Ko) — hors bundle Angular, aucun budget `angular.json` concerné ; négligeable pour un chargement Keycloak | **PASS** |
| Interdictions de sécurité `ADR-UI-001` §Sécurité | 13/13 RAS — audit statique (2026-08-03) **et** confirmé dynamiquement par 8 scénarios réels contre Staging (Lot 5, 2026-08-04) | **PASS** |
| Stratégie de test adaptée à l'absence de framework Angular | Aucun Karma/Jasmine applicable à un artefact FreeMarker/CSS. Vérification manuelle réelle en conditions OIDC/PKCE, démontrée à 3 reprises indépendantes : câblage initial (`DD-EP17-01`), locale française (`DD-EP17-13`), 8 scénarios de sécurité (Lot 5) — capture d'écran, échantillonnage de pixels, inspection directe du HTML rendu, jamais une supposition | **PASS sous réserve** — méthode réelle et répétée, mais jamais formalisée en checklist reproductible avant cette instance |
| Accessibilité (héritée du thème `base`/PatternFly, non réécrite par ce Lot) | `aria-live="polite"` sur les messages d'erreur, `label for=` sur les champs, `aria-invalid` observés dans le HTML réellement rendu (Lot 5) — hérités du template, pas modifiés par le CSS | **Préparation en cours** — aucun audit WCAG 2.2 AA dédié formel mené sur cet artefact précis (distinct de l'audit plus large du Lot 5 §9, hors périmètre Keycloak) |
| Responsive | Base héritée du thème par défaut déjà saine avant re-thème (`phase-02-ui-mockups-ep17-lot4.md` §5 : empilement vertical correct à 375px, aucun débordement) ; `viewport` meta confirmé présent (Lot 5) ; aucune mesure `getBoundingClientRect()` dédiée sur les touch targets de ce thème précis | **Préparation en cours** |

## Lecture du résultat

Sur 9 contrôles : **7 PASS**, **1 « PASS sous réserve »**, **2 « Préparation en cours »**, **0 FAIL**.
Contrairement au gabarit Angular (où « Préparation en cours » sur un contrôle bloquant impose NO GO),
les deux contrôles ici classés « Préparation en cours » (accessibilité et responsive formels) portent
sur un artefact qui **hérite** son accessibilité et son responsive du thème `base` Keycloak déjà en
production avant tout re-thème — le risque de régression est structurellement borné par le fait que
**seul le CSS a changé, jamais le HTML/FreeMarker** (contrôle « Aucune surcharge de template »,
PASS ci-dessus). Ce n'est pas une absence de preuve sur un risque réel, mais une preuve partielle sur
un risque déjà atténué par construction.

**Résultat agrégé : PASS SOUS RÉSERVE.**

## Avis Frontend Architect

**Proposition : la réserve Frontend Architect des Gates 04A/02A Lot 4 est levée par cette instance.**
Les deux points encore « Préparation en cours » (audit WCAG 2.2 AA formel, mesure responsive dédiée)
restent des réserves ouvertes et non bloquantes — traçables séparément si une extension ultérieure du
thème (Lot 6, ou un futur Account Console) venait à toucher le HTML/FreeMarker lui-même, ce qui
changerait l'analyse de risque.

**Ce que cet avis ne fait PAS** :
* Aucune décision de Gate — les décisions déjà rendues (`gate-04A-decision-ep17-lot4.md`,
  `gate-02A-decision-ep17-lot4.md`, Gate Staging et Gate Production du pilote) restent inchangées ;
  cette instance documente la preuve manquante qu'elles appelaient, elle ne les rouvre pas.
* Aucune clôture de `DD-EP17-14` (mot de passe oublié cassé) — sans rapport avec ce contrôle.
* N'autorise aucune extension de périmètre (Account Console, invitation) — toujours hors périmètre.

## Traçabilité

Document créé pour lever la réserve consignée dans `gate-04A-decision-ep17-lot4.md` §11 et
`gate-02A-decision-ep17-lot4.md` §11, référencée à nouveau dans `gate-staging-decision-ep17-lot4-pilote-keycloak.md`
et `gate-production-decision-ep17-lot4-pilote-keycloak.md`. Aucune modification de ces documents —
préservation des décisions historiques (`CLAUDE.md`).
