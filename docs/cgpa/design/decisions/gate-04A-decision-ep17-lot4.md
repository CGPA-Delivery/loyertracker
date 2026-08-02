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
| DD-EP17-03 | Bloqueur, réserve existante | Le thème ne peut consommer une source de tokens qui n'existe pas encore ; construire le thème avant ce choix risquerait une divergence visuelle avec Angular dès le premier jour | Product Owner | Design Architect | Avant tout code de thème | Décision Option A vs B tracée (DDS dédiée ou tranchée directement en Gate) | Ouvert |
| — (rôle Security Architect Keycloak non désigné) | Bloqueur structurel | `DD-EP17-01` (thème Keycloak, Majeur) nomme un responsable qui n'existe pas comme rôle CGPA actif sur ce dépôt ; la revue sécurité d'un thème touchant un flux d'authentification réel ne peut reposer sur une désignation implicite | Product Owner | Product Owner | Avant instruction complète de ce Gate | Désignation explicite (ex. extension du périmètre DevSecOps Lead, ou nouveau rôle dédié) tracée dans `agent-designations-loyertracker.md` | Ouvert |
| — (gabarit `CHECK-FRONTEND-01` inadapté à un thème non-Angular) | Bloqueur structurel, méthodologique | Sans décision, ce Gate ne peut ni cocher ni écarter légitimement ce contrôle bloquant | Product Owner | Product Owner | Avant instruction complète de ce Gate | Décision tracée : instance adaptée, ou gabarit distinct | Ouvert |
| — (Account Console : périmètre `account/` à confirmer) | Bloqueur | Sans confirmation, le thème `account/` documenté par `ADR-UI-001` ne peut être ni inclus ni écarté du périmètre réel du Lot 4 | Product Owner | Product Owner | Avant tout développement de thème | Confirmation Product Owner : Account Console utilisée ou non | Ouvert |
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

*(Section volontairement laissée non renseignée par Claude Code — décision réservée au Product
Owner / CGPA Chief Delivery Officer, conformément à `CLAUDE.md` et `chief-delivery-officer.md`.)*

## 7. Traçabilité

* Mise à jour `/docs/project-state.md` : entrée d'instruction à ajouter lors de la soumission.
* Rédacteur : Claude Code, en tant que Design Architect / Frontend Architect / DevSecOps Lead
  désignés (`agent-designations-loyertracker.md`), limite d'indépendance tracée (Claude Code est
  co-auteur de `ADR-UI-001`, `plan-execution-ux-ui-primeng-keycloak.md`, qu'il est ici appelé à
  évaluer).
* Décision et validation humaine : en attente (§6).
