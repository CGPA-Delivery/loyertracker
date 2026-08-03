# Décision GO / NO GO CGPA v6.1.1 — Gate 04A, instance EP-17 Lot 4 (Pilote Keycloak)

> Instance du gabarit `docs/cgpa/templates/go-no-go.md`, même principe que
> `gate-04A-decision-ep17-lot3.md`. Le Lot 3 (`US-133`/`US-134`, Pilote Angular — dashboard
> Bailleur, périmètre Patrimoines/Biens) est mergé et validé Product Owner (« je valide »,
> 2026-08-02, cf. `gate-04A-decision-ep17-lot3.md` §8). Cette instance statue sur le périmètre
> **Lot 4** (`plan-execution-ux-ui-primeng-keycloak.md` §3 « Lot 4 — Pilote Keycloak »). **La
> section 6 est volontairement laissée non renseignée par Claude Code** — seul le Product Owner
> peut la compléter, conformément à `chief-delivery-officer.md` et `CLAUDE.md`.

> **Différence structurelle majeure avec les Lots 1 à 3** : ceux-ci portaient exclusivement sur le
> Frontend Angular. Le Lot 4 porte sur un **thème Keycloak** (FreeMarker + CSS statique, packagé
> dans l'image `quay.io/keycloak/keycloak:24.0` par montage de volume) — une surface
> **d'authentification réelle, déjà en Production**, distincte de la stack Angular par
> construction (`ADR-UI-001` §Isolation entre Angular et Keycloak : « aucune dépendance de build ou
> d'exécution entre les deux surfaces »). Les gabarits `CHECK-UX-01`/`CHECK-FRONTEND-01`, conçus
> pour des composants Angular, ne couvrent qu'imparfaitement cette surface — signalé explicitement
> ci-dessous plutôt que forcé dans un cadre inadapté.

## 1. Identification

* ID décision : `GATE-04A-EP17-LOT4-2026-08-02`
* Projet : LoyerTracker
* Gate ou jalon évalué : Gate 04A — Design Readiness (`docs/cgpa/gates/gate-04A-design-readiness.md`)
* Phase : Phase 04A, périmètre EP-17 Lot 4 (Pilote Keycloak), après Lot 3 restreint livré et validé
* Environnement source et cible : Aucun à ce stade — documentaire ; le Lot 4 vise, s'il est
  approuvé, un déploiement de thème sur le realm Keycloak `loyertracker`, **déjà utilisé en
  Production** par l'authentification réelle des utilisateurs Bailleur/Gestionnaire
* Artefact, version, commit ou digest : `infra/keycloak/realm-loyertracker.json`,
  `infra/keycloak/realm-loyertracker-production.json` (lus intégralement, 2026-08-02 — aucune clé
  `theme`/`loginTheme` présente dans l'un ou l'autre, confirmé par recherche textuelle exhaustive) ;
  `ADR-UI-001-socle-frontend-primeng-design-tokens-keycloak.md` §Stratégie de thème Keycloak,
  §Isolation entre Angular et Keycloak, §Sécurité ; `CHECK-DEVSECOPS-01-ep17-lot1-readiness.md`
  (ligne `STG-ISOL-01`, ligne Images conteneurs)
* Date : 2026-08-02
* Décision précédente référencée : `gate-04A-decision-ep17-lot3.md` (GO sous réserve stricte, Lot 3
  restreint, 2026-08-02, bloqueur CHECK-UX-01 levé le même jour par validation Product Owner) —
  périmètre épuisé par la livraison et la validation du Lot 3

## 2. Périmètre et applicabilité

* Contrôles applicables : les 16 critères de `gate-04A-design-readiness.md`. Applicabilité
  réévaluée un par un pour ce Lot, pas reconduite tacitement (même discipline que l'instance Lot 3
  vis-à-vis du Lot 2) :
  * `CHECK-UX-01` (Responsive, Accessibilité) : **applicable**, mais son contenu (13 contrôles
    Angular-centrés — bundle, composants `lt-*`, tokens SCSS) ne couvre pas nativement un thème
    FreeMarker. Aucune instance `CHECK-UX-01` dédiée au Lot 4 n'existe à ce jour — **gap
    structurel**, cf. §4.
  * `CHECK-FRONTEND-01` (Architecture Frontend) : **applicabilité douteuse** — ce gabarit évalue
    une architecture Angular (routing, lazy loading, state management, shared library). Un thème
    Keycloak n'a ni routing ni state management Angular. Statuer « non applicable » sans
    instruction serait contraire à `CLAUDE.md` (« un contrôle applicable sans preuve est non
    exécuté, jamais non applicable ») si le contrôle est jugé applicable ; à l'inverse, l'appliquer
    tel quel produirait des lignes structurellement sans objet. **Décision Product Owner requise**
    pour trancher : ce Gate 04A Lot 4 doit-il être évalué par une instance adaptée de
    `CHECK-FRONTEND-01`, ou par un gabarit distinct non encore instancié (le Plan d'Exécution n'en
    prévoit aucun spécifique au thème Keycloak) ?
  * `CHECK-DEVSECOPS-01` : **applicable et déterminant** — le Lot 4 touche une surface
    d'authentification réelle. Une instance Lot 1 existe (`CHECK-DEVSECOPS-01-ep17-lot1-readiness.md`)
    mais son périmètre est « avant Lot 1 », pas Lot 4 spécifiquement ; elle anticipe correctement
    `STG-ISOL-01` comme jalon futur du Lot 4, mais aucune instance dédiée aux 13 interdictions de
    sécurité Keycloak (`ADR-UI-001` §Sécurité, reprises de la mission §17) n'a été produite.
  * `CHECK-ACCESSIBILITY-01`, `CHECK-RESPONSIVE-01`, `CHECK-DESIGN-01`, `CHECK-DESIGN-TOKENS-01` :
    non instanciés à ce jour pour aucun Lot du périmètre EP-17 (constat déjà valable pour les Lots
    1 à 3, non spécifique au Lot 4) — **Non exécuté**, comme pour les Lots précédents.
* Exemptions justifiées : aucune posée par cette instance — chaque non-applicabilité potentielle
  (`CHECK-FRONTEND-01`) est explicitement soumise à décision Product Owner plutôt que tranchée
  unilatéralement par Claude Code, conformément à la limite d'indépendance déjà tracée.

## 3. Preuves et résultats

| Contrôle | Résultat | Preuve | Criticité | Validité |
| --- | --- | --- | --- | --- |
| Aucun thème Keycloak personnalisé n'existe | Confirmé — `infra/keycloak/themes/` n'existe pas sur le disque ; aucune clé `theme`/`loginTheme` dans les 2 fichiers de realm | Lecture directe du dépôt, 2026-08-02 | Bloquant (nature du Lot) | 2026-08-02 |
| Source de tokens partagée Angular/Keycloak non tranchée (`DD-EP17-03`) | Confirmé — Option B (CSS commun) recommandée par `ADR-UI-001` mais « non tranchée définitivement » (`project-state.md`, 2026-07-30) ; dette toujours **Ouverte** au registre | `ADR-UI-001` §Isolation entre Angular et Keycloak ; `design-debt-register-loyertracker.md` DD-EP17-03 | Bloquant (le thème a besoin d'une source de couleurs/typographie stable) | 2026-08-02 |
| Rôle « Security Architect Keycloak » non désigné | Confirmé — `agent-designations-loyertracker.md` ne liste que 4 rôles actifs (UX/UI Design Lead, Design Architect, Frontend Architect, DevSecOps Lead) ; `design-debt-register-loyertracker.md` DD-EP17-01 nomme pourtant « Design Architect, Security Architect Keycloak » comme responsables conjoints | `agent-designations-loyertracker.md` ; `design-debt-register-loyertracker.md` DD-EP17-01 | Bloquant | 2026-08-02 |
| Configuration SMTP absente des deux fichiers de realm | Confirmé par recherche textuelle (`smtp`, 0 occurrence dans les 2 fichiers) — les flux « mot de passe oublié » et « invitation », que ce Lot doit théoriquement thémer, dépendent d'un envoi d'e-mail dont la configuration réelle n'est pas visible dans ce dépôt (peut exister hors dépôt, en configuration d'environnement — **non vérifiable depuis ce contexte**, signalé comme question ouverte, pas comme certitude de panne) | `infra/keycloak/realm-loyertracker.json`, `infra/keycloak/realm-loyertracker-production.json` (recherche exhaustive, 2026-08-02) | Réserve (dépendance opérationnelle) | 2026-08-02 |
| Usage réel de l'Account Console non constaté | Confirmé — `screen-inventory-loyertracker.md` : « Aucune preuve d'usage réel de l'Account Console Keycloak dans le produit » | `screen-inventory-loyertracker.md` | Bloquant (détermine si le thème `account/` fait partie du périmètre) | 2026-08-02 |
| Compatibilité de version Keycloak par environnement non vérifiée pour le thème | Non exécuté — `ADR-UI-001` RSV-UI-08 l'inscrit explicitement comme preuve attendue au Lot 4, jamais produite | `ADR-UI-001` §Risques et mitigations | Bloquant | 2026-08-02 |
| `STG-ISOL-01` (Staging mutualisé `ai-test-server`) | Non exécuté — jalon futur déjà anticipé, pertinent seulement à la promotion Staging du thème | `CHECK-DEVSECOPS-01-ep17-lot1-readiness.md` ligne 4 | Bloquant (avant toute promotion Staging) | Confirmé non exécuté, 2026-08-02 |
| Interdictions de sécurité Keycloak (13 points, mission §17) | Documentées mais aucune preuve d'audit dédié — aucun code de thème n'existe encore à auditer | `ADR-UI-001` §Sécurité | Bloquant | 2026-08-02 |
| Plan d'Exécution — approbation du Lot 4 | **Non obtenue** — `plan-execution-ux-ui-primeng-keycloak.md` §12 reste « APPROUVÉ SOUS RÉSERVE — PÉRIMÈTRE LOT 1, LOT 2 ET LOT 3 (RESTREINT) », n'inclut pas le Lot 4 | `plan-execution-ux-ui-primeng-keycloak.md` §12 | Bloquant | 2026-08-02 |

## 4. Bloqueurs et réserves

| ID | Type | Impact | Autorité d'acceptation | Responsable | Échéance | Preuve attendue | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DD-EP17-03 | Bloqueur, réserve existante | Le thème ne peut consommer une source de tokens qui n'existe pas encore ; construire le thème avant ce choix risquerait une divergence visuelle avec Angular dès le premier jour | Product Owner | Design Architect | Avant tout code de thème | Décision Option A vs B tracée (DDS dédiée ou tranchée directement en Gate) | **Levé (2026-08-02)** — Option B (CSS commun) confirmée par le Product Owner (§8) ; dette non close (implémentation restant à faire) |
| — (rôle Security Architect Keycloak non désigné) | Bloqueur structurel | `DD-EP17-01` (thème Keycloak, Majeur) nomme un responsable qui n'existe pas comme rôle CGPA actif sur ce dépôt ; la revue sécurité d'un thème touchant un flux d'authentification réel ne peut reposer sur une désignation implicite | Product Owner | Product Owner | Avant instruction complète de ce Gate | Désignation explicite (ex. extension du périmètre DevSecOps Lead, ou nouveau rôle dédié) tracée dans `agent-designations-loyertracker.md` | **Levé (2026-08-02)** — périmètre du DevSecOps Lead étendu explicitement à la revue sécurité Keycloak (§8, `agent-designations-loyertracker.md`) |
| — (gabarit `CHECK-FRONTEND-01` inadapté à un thème non-Angular) | Bloqueur structurel, méthodologique | Sans décision, ce Gate ne peut ni cocher ni écarter légitimement ce contrôle bloquant | Product Owner | Product Owner | Avant instruction complète de ce Gate | Décision tracée : instance adaptée, ou gabarit distinct | **Levé (2026-08-02)** — déclaré non applicable tel quel ; remplacé par une checklist allégée dédiée au thème Keycloak, à instancier au moment des preuves (§8) |
| — (Account Console : périmètre `account/` à confirmer) | Bloqueur | Sans confirmation, le thème `account/` documenté par `ADR-UI-001` ne peut être ni inclus ni écarté du périmètre réel du Lot 4 | Product Owner | Product Owner | Avant tout développement de thème | Confirmation Product Owner : Account Console utilisée ou non | **Levé (2026-08-02)** — Account Console exclue du périmètre du Lot 4 (§8), aucun usage réel constaté |
| — (compatibilité de version Keycloak, RSV-UI-08) | Bloqueur, réserve existante | Un thème incompatible avec la version Keycloak effective de chaque environnement casserait l'authentification réelle | Product Owner | DevSecOps Lead | Avant tout déploiement, même Staging | Version Keycloak vérifiée par environnement (Dev/Staging/Production), compatibilité du thème confirmée | Ouvert |
| — (SMTP non visible dans le realm versionné) | Réserve, opérationnelle | Si l'e-mail n'est effectivement pas configuré, thémer « mot de passe oublié »/« invitation » habillerait un flux non fonctionnel — priorité de scope à clarifier | Product Owner | DevSecOps Lead | Avant de scoper ces deux écrans dans le Lot 4 | Confirmation opérationnelle (hors dépôt si nécessaire) de l'état SMTP réel par environnement | Ouvert — question posée, pas une panne confirmée |
| — (Plan d'Exécution non étendu au Lot 4) | Bloqueur | Verrou `CLAUDE.md` (« aucun code applicatif sans Plan d'Exécution approuvé ») | Product Owner | Product Owner | Avant tout développement | Extension explicite du Plan d'Exécution au Lot 4 | Ouvert |
| DD-EP17-01 | Réserve existante, Majeur | Absence de thème Keycloak — objet même de ce Lot | Product Owner | Design Architect, Security Architect Keycloak (non désigné, cf. ci-dessus) | Avant Lot 4 | Thème livré en Staging isolé + Gate Staging dédié | Ouvert — objet de ce Lot |
| DD-611-02 / DD-611-03 | Réserves existantes | Portent sur DSG/traçabilité Angular ; leur applicabilité à un thème non-Angular n'a jamais été évaluée | Product Owner | Design Architect / Frontend Architect | — | Évaluation explicite de l'applicabilité au Lot 4 | Ouvert — non réévalué par cette instance |

## 5. Avis spécialisés

| Agent | Avis | Réserves |
| --- | --- | --- |
| Design Architect (Claude Code, désigné 2026-07-30, limite d'indépendance tracée) | **NO GO en l'état** — contrairement aux Lots 2 et 3, où les fondations (composants, tokens, thème PrimeNG) étaient déjà solides avant l'instruction du Gate, le Lot 4 part d'une page blanche technique (aucun fichier de thème, source de tokens partagée non tranchée) **et** d'un vide de gouvernance (rôle de revue sécurité non désigné, gabarit de contrôle Frontend inadapté). Le risque n'est pas seulement de présentation : une erreur de thème peut casser un flux d'authentification réellement utilisé en Production. Une instruction complète de ce Gate ne peut être envisagée avant que les 4 bloqueurs structurels du §4 (source de tokens, rôle de sécurité, gabarit de contrôle, périmètre Account Console) soient résolus par le Product Owner | Aucune réserve de contenu au-delà des bloqueurs eux-mêmes — cet avis ne porte pas sur la qualité d'un travail déjà produit, mais sur l'absence de préalables |
| Frontend Architect (Claude Code, désigné 2026-07-31, limite d'indépendance tracée) | **NO GO en l'état** — l'architecture Angular par domaines n'est pas concernée par ce Lot (`ADR-UI-001` §Isolation), ce qui limite le risque côté Angular ; en revanche, aucune stratégie de test n'existe pour un thème FreeMarker (les tests Karma/ChromeHeadless de ce dépôt ne s'appliquent pas à ce type d'artefact) — un vide méthodologique distinct de celui du Design Architect, à combler avant tout code | Recommande que la future instruction inclue explicitement une stratégie de test adaptée (revue manuelle en environnement Keycloak réel a minima, cf. les tests de sécurité déjà prévus au Lot 5 par le Plan) |
| DevSecOps Lead (Claude Code, désigné 2026-07-31, limite d'indépendance tracée) | **NO GO en l'état** — le Lot 4 touche l'authentification réelle d'un realm déjà en Production ; les 13 interdictions de sécurité de `ADR-UI-001` §Sécurité sont documentées mais aucune preuve d'audit ne peut exister tant qu'aucun code de thème n'a été écrit. Point le plus critique : l'absence de rôle « Security Architect Keycloak » désigné, alors même que `DD-EP17-01` l'identifie comme responsable conjoint — une revue sécurité de ce Lot ne peut reposer sur le seul DevSecOps Lead sans décision explicite du Product Owner sur ce point | `STG-ISOL-01` reste un jalon futur correctement anticipé, pas un bloqueur à ce stade de simple instruction ; deviendra bloquant à la première promotion Staging |

* Décision spécialisée Release Manager, si applicable : Non applicable à ce stade — aucun artefact
  candidat à une release.

## 6. Décision finale

**Décision** : **GO sous réserve**.

**Instruction reçue (2026-08-03)** : « statue en §6 des deux gates, GO sous réserve », du Product
Owner / CGPA Chief Delivery Officer.

**Portée de la décision** : ce GO sous réserve couvre le périmètre de ce Gate 04A tel qu'instruit
(§1-§11) — la résolution des 4 bloqueurs structurels initiaux (§8), la vérification factuelle de
version Keycloak et l'état SMTP (§9), la production des parcours et maquettes (§10), et le
découplage de `DD-EP17-14` (§11) sur lequel les avis Design Architect, Frontend Architect et
DevSecOps Lead ont été révisés de NO GO en l'état à GO sous réserve.

**Réserves qui subsistent après ce GO** (reprises de §11, non levées par cette décision) :
* `DD-EP17-03` non close — Option B tranchée, implémentation `tokens.css` restant à produire.
* `DD-EP17-13` (absence de traduction française des écrans Keycloak) non traitée.
* Checklist de remplacement de `CHECK-FRONTEND-01` non instanciée.
* Audit des 13 interdictions de sécurité `ADR-UI-001` §Sécurité contre le code de thème réel — sans
  objet tant qu'aucun code de thème n'existe.
* `STG-ISOL-01` (Staging mutualisé) reste un jalon futur, à couvrir avant toute promotion Staging.
* `DD-EP17-14` (flux « mot de passe oublié » cassé, Production) reste ouverte, suivie séparément
  (§11) — non levée par ce GO, simplement découplée du calendrier du Lot 4.

**Ce que ce GO n'autorise pas** : conformément à `CLAUDE.md` (« aucun code applicatif sans Plan
d'Exécution approuvé », « un push ou merge ne vaut jamais autorisation de promotion »), ce GO sous
réserve de Gate 04A ne vaut à lui seul ni extension du Plan d'Exécution au Lot 4
(`plan-execution-ux-ui-primeng-keycloak.md` §12, toujours limité aux Lots 1-3), ni autorisation de
développement de thème Keycloak. L'extension du Plan d'Exécution reste une action Product Owner
distincte, préalable à tout code.

## 7. Traçabilité

* Mise à jour `/docs/project-state.md` : entrée d'instruction à ajouter lors de la soumission.
* Rédacteur : Claude Code, en tant que Design Architect / Frontend Architect / DevSecOps Lead
  désignés (`agent-designations-loyertracker.md`), limite d'indépendance tracée (Claude Code est
  co-auteur de `ADR-UI-001`, `plan-execution-ux-ui-primeng-keycloak.md`, qu'il est ici appelé à
  évaluer).
* Décision et validation humaine : en attente (§6).

## 8. Note de mise à jour (2026-08-02, postérieure à cette instance) — 4 des 7 bloqueurs levés

**Instruction explicite reçue** : après présentation d'une recommandation en 4 points (réponse à
« qu'elle la meilleur proposition que tu me fait pour trancher ? »), le Product Owner a répondu
« je valide ta recommandation ». Décisions actées :

1. **`DD-EP17-03` (source de tokens)** : Option B (CSS commun) confirmée — conforme à la
   recommandation déjà documentée par `ADR-UI-001` §Isolation entre Angular et Keycloak. Registre
   de dette mis à jour (`design-debt-register-loyertracker.md`) ; dette non close, implémentation
   restant à produire.
2. **Rôle de revue sécurité Keycloak** : pas de nouveau rôle CGPA créé — périmètre du DevSecOps
   Lead déjà désigné **étendu explicitement** à la revue sécurité du thème Keycloak
   (`agent-designations-loyertracker.md`, note du 2026-08-02).
3. **`CHECK-FRONTEND-01`** : déclaré non applicable tel quel à un thème FreeMarker/CSS non-Angular.
   Remplacé par une checklist allégée dédiée, **à instancier au moment où les preuves seront
   produites** (pas à cette étape d'instruction).
4. **Account Console** : exclue explicitement du périmètre du Lot 4 — `screen-inventory-loyertracker.md`
   ne constate aucun usage réel ; réduit le périmètre du thème à `login/` uniquement (login, mot de
   passe oublié, reset, invitation, invitation expirée, session expirée, accès refusé, logout).

**Ce que cette instruction ne lève pas** : les 3 bloqueurs restants du §4 (compatibilité de version
Keycloak par environnement, configuration SMTP à vérifier, approbation du Plan d'Exécution pour le
Lot 4) ainsi que l'absence de parcours utilisateurs et de maquettes (`gate-02A-decision-ep17-lot4.md`
§4) restent ouverts. Les avis **NO GO en l'état** du §5 ne sont pas reconduits automatiquement en
GO — nouvelle évaluation nécessaire une fois le travail de vérification et de conception produit.
Aucun code de thème, aucune modification de realm, aucune dépendance ajoutée par cette note —
strictement documentaire.

**Prochaine action autorisée** : vérification factuelle de la compatibilité de version Keycloak par
environnement et de l'état réel de la configuration SMTP, puis production des parcours utilisateurs
et maquettes (`phase-02-user-journeys-ep17-lot4.md`, `phase-02-ui-mockups-ep17-lot4.md`), sur le
même modèle que le Lot 3 — préalable à toute nouvelle instruction complète de ce Gate.

## 9. Vérifications factuelles (2026-08-02, postérieures à la note §8)

**Compatibilité de version Keycloak (RSV-UI-08)** — **Bloqueur levé, sans réserve.** Les 3
environnements (`docker-compose.yml` — Dev/local, `docker-compose.staging.yml` — Staging,
`docker-compose.prod.yml` — Production, ce dernier un override sans image propre, héritant de
`docker-compose.yml`) référencent tous **le même digest exact** :
`quay.io/keycloak/keycloak:24.0@sha256:f8ade94c1d0ad2f2fa7734a455fee5392764f402c43ca35e9af6bf63a2541dc9`.
Aucun risque de divergence de version — un seul artefact Keycloak, identique partout, contrairement
à l'hypothèse initiale de `ADR-UI-001` RSV-UI-08.

**Configuration SMTP** — **Confirmée absente de toute configuration versionnée**, pas seulement des
2 fichiers de realm (constat §3) : recherche exhaustive (`smtp`/`mail`) sur `docker-compose.yml`,
`docker-compose.staging.yml`, `docker-compose.prod.yml` et `.env.example` — 0 occurrence partout.
**Nuance méthodologique** : le realm est importé une fois au démarrage du conteneur
(`/opt/keycloak/data/import/...:ro`) ; une configuration SMTP faite ultérieurement via la console
d'administration Keycloak en environnement réel ne serait pas nécessairement reflétée dans ce
fichier versionné sans export manuel. Ce constat porte donc sur la configuration **versionnée**,
pas sur l'état de l'instance vivante — vérification directe recommandée avant de considérer ce
point clos.

**Correction du périmètre — écrans « invitation »/« invitation expirée »** : ces deux écrans,
listés par le Plan d'Exécution §3 comme faisant partie du thème Keycloak à produire, **ne sont pas
des écrans Keycloak**. Constat établi par triple vérification convergente :
1. Recherche exhaustive de « invitation » dans les 2 fichiers de realm — **0 occurrence**.
2. Le mécanisme d'invitation est entièrement **applicatif** (`backend/.../comptes/InvitationService.java`),
   générant un lien `{baseUrl}/invitations/{token}` distinct de tout flux Keycloak natif.
3. Ce lien ne correspond à **aucune route Angular existante** (`app.routes.ts`, recherche
   exhaustive « invitation » — 0 occurrence) : l'acceptation d'invitation, bien que fonctionnelle et
   testée en Production (`infra/smoke/smoke-stack.sh`, `POST /api/invitations/{token}/acceptation`),
   n'est exercée **qu'en appel API direct** (smoke tests), jamais via une page web, ni Angular ni
   Keycloak.

**Conséquence** : le périmètre réel du thème Keycloak (Lot 4) se réduit à **6 écrans** confirmés
(login, mot de passe oublié, reset password, session expirée, accès refusé, logout) — pas 8. Le
constat initial de `plan-execution-ux-ui-primeng-keycloak.md` §3 (qui incluait « invitation »,
« invitation expirée ») est corrigé, pas réécrit (préservation des décisions historiques,
`CLAUDE.md`), signalé ici plutôt que silencieusement ajusté. L'absence de toute UI (Angular ou
Keycloak) pour l'acceptation d'invitation est une lacune **distincte** du Lot 4, tracée séparément
(nouvelle dette `DD-EP17-12`, `design-debt-register-loyertracker.md`) — hors périmètre d'un thème
Keycloak puisqu'aucun écran Keycloak n'est concerné.

**Bloqueurs restants après ces vérifications** : configuration SMTP à confirmer sur l'instance
vivante (nuance ci-dessus) ; approbation du Plan d'Exécution pour le Lot 4 ; absence de parcours
utilisateurs et de maquettes pour les 6 écrans désormais confirmés (`gate-02A-decision-ep17-lot4.md`
§4). Les avis **NO GO en l'état** du §5 restent en vigueur.

## 10. Parcours et maquettes produits — la question SMTP devient une certitude vérifiée (2026-08-02)

`phase-02-user-journeys-ep17-lot4.md`/`phase-02-ui-mockups-ep17-lot4.md` produits en exécutant
réellement le realm `loyertracker` (Keycloak 24.0.5 isolé, même image que Production ; détail
complet en `gate-02A-decision-ep17-lot4.md` §10). Effet direct sur ce Gate 04A :

* **La nuance SMTP du §9 (« question ouverte, pas une certitude ») est levée par la preuve** — la
  soumission réelle du formulaire de réinitialisation, pour un utilisateur de test existant, produit
  `HTTP 500` / « Failed to send email, please try again later. ». Ce n'est plus une hypothèse sur la
  configuration versionnée : c'est un échec fonctionnel reproduit sur l'image exacte utilisée par
  Dev/Staging/Production. Nouvelle dette `DD-EP17-14` (Majeur, DevSecOps Lead).
* **Nouvelle dette non anticipée** : absence de traduction française sur l'ensemble des écrans
  Keycloak (`DD-EP17-13`, Majeur, UX/UI Design Lead) — incohérence linguistique avec le reste du
  produit, entièrement en français.
* **Avis DevSecOps Lead renforcé** : le NO GO en l'état du §5 n'était fondé, pour ce rôle, que sur
  l'absence de préalables (rôle non désigné, interdictions non auditées faute de code). Il repose
  désormais **aussi** sur un défaut fonctionnel réel et vérifié (`DD-EP17-14`) — thémer le sous-écran
  « mot de passe oublié » sans traiter ce défaut livrerait une expérience visuellement soignée sur un
  flux qui ne fonctionne pas.

**Prochaine action autorisée** : validation Product Owner de `phase-02-user-journeys-ep17-lot4.md`
et `phase-02-ui-mockups-ep17-lot4.md`, décision explicite sur le traitement de `DD-EP17-14` (SMTP
comme préalable bloquant, ou thème livré en assumant ce sous-écran incomplet) — préalable à toute
nouvelle instruction complète de ce Gate.

## 11. Décision sur `DD-EP17-14` — avis révisés de NO GO en l'état à GO sous réserve (2026-08-02)

**Instruction explicite reçue** : « j'approuve ta recommandation », en réponse à la proposition de
découpler `DD-EP17-14` du calendrier du Lot 4 plutôt que de le traiter comme un préalable bloquant.
**Décision actée** : `DD-EP17-14` reste ouverte mais suit désormais un **suivi propre**, indépendant
du Lot 4 — c'est un défaut de Production pré-existant (le flux est déjà cassé aujourd'hui, avec ou
sans thème), pas quelque chose que le thème crée ou aggrave. Le Lot 4 est autorisé à couvrir l'écran
de saisie « mot de passe oublié » et son état d'erreur honnête déjà maquettés
(`phase-02-ui-mockups-ep17-lot4.md` §2bis/§4bis), sans attendre la résolution SMTP.

**Réévaluation des avis du §5**, tous les 4 structurellement fondés sur des bloqueurs désormais
résolus (§8-§10) :

| Agent | Avis révisé | Réserves continues |
| --- | --- | --- |
| Design Architect | **GO sous réserve** — les 2 bloqueurs qui fondaient le NO GO en l'état (page blanche technique, vide de gouvernance) sont résolus : source de tokens tranchée (`DD-EP17-03`), rôle de sécurité désigné, périmètre clarifié (6 écrans confirmés, Account Console exclue), parcours et maquettes produits et vérifiés en conditions réelles | `DD-EP17-03` non close (implémentation `tokens.css` à produire) ; `DD-EP17-13` (langue) à traiter avec le thème lui-même |
| Frontend Architect | **GO sous réserve** — la réserve initiale (aucune stratégie de test pour un artefact FreeMarker) reste partiellement ouverte | Recommande toujours une stratégie de test adaptée (revue manuelle en environnement Keycloak réel, méthode déjà démontrée par les vérifications de `phase-02-user-journeys-ep17-lot4.md`) avant Production ; `CHECK-FRONTEND-01` de remplacement toujours à instancier |
| DevSecOps Lead | **GO sous réserve** — le rôle est désigné (extension du DevSecOps Lead), la compatibilité de version est confirmée sans risque ; `DD-EP17-14` ne bloque plus ce Gate (suivi propre, ci-dessus) | Interdictions de sécurité `ADR-UI-001` §Sécurité toujours à auditer sur le code de thème réel, une fois écrit ; `STG-ISOL-01` reste un jalon futur avant toute promotion Staging |
| UX/UI Design Lead (Gate 02A, pour cohérence) | Voir `gate-02A-decision-ep17-lot4.md` §11 | — |

**Ce que cette révision ne couvre pas** : l'approbation de l'extension du Plan d'Exécution au Lot 4
(`plan-execution-ux-ui-primeng-keycloak.md` §12, toujours limité aux Lots 1-3) reste une action
Product Owner distincte, préalable à tout développement effectif — même principe déjà appliqué à
chaque transition de Lot précédente. La validation Product Owner du **contenu** de
`phase-02-user-journeys-ep17-lot4.md`/`phase-02-ui-mockups-ep17-lot4.md` reste elle aussi distincte
de la décision de Gate elle-même.

**Prochaine action autorisée** : le Product Owner statue en §6 (ce document) et en §6 de
`gate-02A-decision-ep17-lot4.md`. Un GO ou GO sous réserve à ce niveau ne vaudrait toujours pas, à
lui seul, autorisation de code — l'extension du Plan d'Exécution au Lot 4 reste une action distincte
requise avant tout développement de thème.
