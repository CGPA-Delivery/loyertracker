# Décision GO / NO GO CGPA v6.1.1 — Gate 02A, instance EP-17 Lot 4 (applicabilité, Pilote Keycloak)

> Instance du gabarit `docs/cgpa/templates/go-no-go.md`, même convention que
> `gate-02A-decision-ep17-lot3.md`. **Différence structurelle avec l'instance Lot 3** : celle-ci
> disposait déjà d'un dashboard Angular existant à migrer (présentation seulement, logique
> inchangée). Le Lot 4 vise des écrans qui, pour la plupart, **n'existent aujourd'hui que sous la
> forme du thème par défaut de Keycloak** — aucun parcours écrit ni aucune maquette ciblée n'a
> encore été produit pour ce périmètre précis. Cette instance est donc évaluée dans un état plus
> proche de l'instance Lot 0 initiale (NO GO en l'état, lacunes de contenu réelles) que des
> instances Lot 2/Lot 3 (où l'essentiel de la matière existait déjà). **La section 6 est
> volontairement laissée non renseignée par Claude Code** — seul le Product Owner peut la
> compléter, conformément à `CLAUDE.md`.

## 1. Identification

* ID décision : `GATE-02A-EP17-LOT4-2026-08-02`
* Projet : LoyerTracker
* Gate ou jalon évalué : Gate 02A — UX Gate (`docs/cgpa/gates/gate-02A-ux-design-readiness.md`)
* Phase : Phase 02 → Gate 02A → Phase 03, périmètre EP-17 Lot 4 (Pilote Keycloak :
  `plan-execution-ux-ui-primeng-keycloak.md` §3 « Lot 4 »)
* Environnement source et cible : Aucun à ce stade — documentaire ; le Lot 4 vise, s'il est
  approuvé, un déploiement de thème sur une surface d'authentification déjà utilisée en Production
* Artefact, version, commit ou digest : `ADR-UI-001-socle-frontend-primeng-design-tokens-keycloak.md`
  §Stratégie de thème Keycloak ; `screen-inventory-loyertracker.md` (ligne « Compte Keycloak
  personnalisé », « Non constaté ») ; `infra/keycloak/realm-loyertracker.json`,
  `infra/keycloak/realm-loyertracker-production.json` (lus intégralement, 2026-08-02)
* Date : 2026-08-02
* Décision précédente référencée : `gate-02A-decision-ep17-lot3.md` (GO sous réserve, Lot 3
  restreint, 2026-08-02) — périmètre épuisé par la livraison et la validation du Lot 3 ; n'annonçait
  aucune matière préparée pour le Lot 4

## 2. Périmètre et applicabilité

* Contrôles applicables : les 11 points de contrôle GO de `gate-02A-ux-design-readiness.md`,
  évalués contre le périmètre du Lot 4 tel que décrit par le Plan d'Exécution §3 : écrans login,
  mot de passe oublié, reset password, invitation, invitation expirée, session expirée, accès
  refusé, logout, et profil **uniquement si l'Account Console est réellement utilisée** (non
  constaté à ce jour, cf. §4).
* Différence de nature avec le Lot 3 : ces écrans ne sont **pas** des composants Angular existants
  à migrer en présentation — ce sont des pages Keycloak server-rendues (FreeMarker), aujourd'hui au
  thème par défaut, jamais personnalisées. Le point de départ UX est donc un thème générique, pas
  un écran métier déjà conçu pour LoyerTracker.
* Exemptions justifiées : aucune posée par cette instance.

## 3. Preuves et résultats — les 11 critères du Gate 02A appliqués au Lot 4

| Critère | Constat pour le périmètre Lot 4 | Preuve |
| --- | --- | --- |
| Personas validés | **Matière partielle** — `UXR-001.md` couvre les personas Bailleur/Gestionnaire en tant qu'utilisateurs du produit, mais aucun persona ni irritant n'a été documenté spécifiquement pour l'expérience de connexion/récupération de mot de passe/invitation | `UXR-001.md` |
| User journeys documentés | **Non exécuté** — aucun `phase-02-user-journeys-ep17-lot4.md` n'existe | — |
| Parcours critiques identifiés | **Non exécuté** — dépend du point précédent | — |
| Cas nominaux et cas d'erreur documentés | **Non exécuté** — aucun inventaire des messages d'erreur Keycloak réels (identifiants invalides, compte désactivé, lien de reset expiré, invitation expirée, session expirée) n'a été produit pour ce périmètre | — |
| Information architecture validée | **Hors périmètre du document existant** — `phase-02-information-architecture.md` §1 documente l'arborescence Angular ; les pages Keycloak vivent hors du routing Angular (domaine/realm distinct), non couvertes | `phase-02-information-architecture.md` §1 (silence sur Keycloak) |
| Navigation globale stabilisée | **Sans objet au sens Angular, non formellement statué** — la « navigation » ici est le parcours Keycloak natif (redirections OIDC) ; `ADR-UI-001` interdit explicitement toute modification des URLs de redirection sans ADR dédiée, ce qui contraint fortement ce critère sans le documenter comme validé | `ADR-UI-001` §Sécurité |
| Design system validé | **Partiel** — `DSG-001.md` documente des tokens et composants Angular ; la source de tokens *partagée* avec Keycloak (Option A/B) reste non tranchée (`DD-EP17-03`), ce qui bloque toute déclinaison réelle du Design System sur ce périmètre | `ADR-UI-001` §Isolation entre Angular et Keycloak ; `DD-EP17-03` |
| Responsive strategy définie | **Stratégie générique documentée, jamais appliquée à une page Keycloak** — `DSG-001.md` §Responsive Rules couvre les composants Angular ; aucune vérification sur le rendu réel d'une page de login Keycloak (dont le HTML/CSS est structurellement différent d'Angular) | `DSG-001.md` §Responsive Rules |
| Accessibilité minimale définie | **Cible générique documentée, jamais auditée sur Keycloak** — WCAG 2.2 AA visé par `DSG-001.md`, aucun audit spécifique aux formulaires Keycloak (structure FreeMarker, attributs ARIA du thème par défaut non vérifiés) | `DSG-001.md` §Accessibilité |
| Maquettes des écrans critiques disponibles | **Non exécuté** — aucune maquette pour login/mot de passe oublié/reset/invitation/session expirée/accès refusé/logout n'a été produite | — |
| Validation Product Owner obtenue | **Objet de cette soumission** — non obtenue au moment de la rédaction | §6 |

## 4. Bloqueurs et réserves

| ID | Type | Impact | Autorité d'acceptation | Responsable | Échéance | Preuve attendue | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| — (parcours utilisateurs absents) | Bloqueur | Aucun parcours écrit ne couvre les flux d'authentification Keycloak concernés | Product Owner | UX/UI Design Lead | Avant tout développement de thème | Parcours écrit par flux (login, mot de passe oublié, reset, invitation, invitation expirée, session expirée, accès refusé, logout) | Ouvert |
| — (maquettes absentes) | Bloqueur | Aucune maquette « avant/après » ne couvre ces écrans | Product Owner | Design Architect | Avant tout développement de thème | Au moins un support visuel par écran critique, validé Product Owner | Ouvert |
| — (périmètre Account Console non confirmé) | Bloqueur | Détermine si le thème `account/` (`ADR-UI-001`) fait partie du périmètre réel de ce Lot | Product Owner | Product Owner | Avant tout développement | Confirmation Product Owner tracée (usage réel constaté ou non) | **Levé (2026-08-02)** — Account Console exclue du périmètre du Lot 4 (`gate-04A-decision-ep17-lot4.md` §8) ; le périmètre se limite au thème `login/` |
| DD-EP17-03 | Bloqueur, réserve existante, partagée avec Gate 04A | Le Design System ne peut être « validé » pour ce périmètre tant que la source de tokens partagée n'est pas tranchée | Product Owner | Design Architect | Avant tout code de thème | Décision Option A vs B tracée | **Levé (2026-08-02)** — Option B confirmée (`gate-04A-decision-ep17-lot4.md` §8) ; dette non close, implémentation restant à produire |
| — (contraintes de sécurité sur la navigation/redirections) | Réserve, Financial/Security Governance | `ADR-UI-001` interdit toute modification d'URL de redirection sans ADR dédiée — toute maquette proposant un parcours différent du parcours OIDC natif devra être vérifiée contre cette interdiction avant validation | Product Owner | DevSecOps Lead | Au moment de la production des maquettes | Vérification croisée maquette/interdictions de sécurité | Ouvert, préventif |

## 5. Avis spécialisés

| Agent | Avis | Réserves |
| --- | --- | --- |
| UX/UI Design Lead (Claude Code, désigné 2026-07-30, limite d'indépendance tracée) | **NO GO en l'état** — sur les 11 critères, 2 sont structurellement absents (user journeys, maquettes), même lacune que l'instance Lot 3 à sa rédaction initiale ; contrairement au Lot 3, ce périmètre ne bénéficie pas d'un « point de départ » Angular déjà connu — chaque écran Keycloak part d'un thème par défaut jamais audité pour ce produit. Recommande la production d'un `phase-02-user-journeys-ep17-lot4.md` et d'un `phase-02-ui-mockups-ep17-lot4.md`, sur le même modèle que le Lot 3, **après** que les bloqueurs structurels du Gate 04A Lot 4 (source de tokens, rôle de sécurité, périmètre Account Console) soient résolus — produire des maquettes avant ces décisions risquerait un travail à refaire | Le périmètre exact (Account Console incluse ou non) doit être confirmé avant toute production de maquette, pour éviter un travail hors périmètre |

* Décision spécialisée Release Manager, si applicable : Non applicable à ce stade.

## 6. Décision finale

*(Section volontairement laissée non renseignée par Claude Code — décision réservée au Product
Owner / CGPA Chief Delivery Officer, conformément à `CLAUDE.md`.)*

## 7. Traçabilité

* Mise à jour `/docs/project-state.md` : entrée d'instruction à ajouter lors de la soumission.
* Rédacteur : Claude Code, en tant que UX/UI Design Lead désigné
  (`agent-designations-loyertracker.md`), limite d'indépendance tracée.
* Décision et validation humaine : en attente (§6).

## 8. Note de mise à jour (2026-08-02, postérieure à cette instance) — périmètre restreint à `login/`

**Instruction explicite reçue** : « je valide ta recommandation » (détail complet en
`gate-04A-decision-ep17-lot4.md` §8). Pour ce Gate 02A, l'effet est double :

* **Account Console exclue du périmètre** — le thème `account/` documenté par `ADR-UI-001` ne fait
  pas partie du Lot 4. Le périmètre UX de ce Gate se limite désormais aux écrans `login/` : login,
  mot de passe oublié, reset password, invitation, invitation expirée, session expirée, accès
  refusé, logout.
* **`DD-EP17-03` tranchée (Option B)** — le critère « Design system validé » (§3) reste toutefois
  **non exécuté** en pratique tant qu'aucune implémentation de `tokens.css` commun n'existe.

**Ce que cette note ne lève pas** : les 2 bloqueurs structurels de ce Gate (parcours utilisateurs
absents, maquettes absentes, §4) restent entiers — aucun travail de conception UX n'a été produit
par cette note, seulement des décisions de périmètre et de gouvernance. L'avis **NO GO en l'état**
du §5 n'est pas reconduit en GO.

**Prochaine action autorisée** : production de `phase-02-user-journeys-ep17-lot4.md` et
`phase-02-ui-mockups-ep17-lot4.md`, scopés aux 8 écrans `login/` listés ci-dessus, après
vérification factuelle de la compatibilité de version Keycloak et de l'état SMTP
(`gate-04A-decision-ep17-lot4.md` §8) — même enchaînement que le Lot 3.

## 9. Correction de périmètre (2026-08-02, postérieure à la note §8) — 6 écrans, pas 8

Les vérifications factuelles menées en parallèle sur le Gate 04A (`gate-04A-decision-ep17-lot4.md`
§9) établissent que **« invitation » et « invitation expirée » ne sont pas des écrans Keycloak** :
aucune occurrence dans les 2 fichiers de realm, mécanisme entièrement applicatif
(`InvitationService.java`), jamais exposé via une page web (ni Angular ni Keycloak) — seulement en
appel API direct, testé par `infra/smoke/smoke-stack.sh`. Le périmètre UX réel de ce Gate se réduit
donc à **6 écrans** : login, mot de passe oublié, reset password, session expirée, accès refusé,
logout. Le §8 ci-dessus (« 8 écrans ») n'est pas réécrit (préservation des décisions historiques,
`CLAUDE.md`) — cette note corrige le compte, pas le contenu déjà produit. L'absence de toute
interface pour l'acceptation d'invitation est tracée séparément (`DD-EP17-12`), hors périmètre d'un
Gate portant sur un thème Keycloak. Les 2 bloqueurs structurels (parcours, maquettes) restent
ouverts, désormais scopés à 6 écrans plutôt que 8.
