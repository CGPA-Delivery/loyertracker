# DDS-LT-002 — Emplacement des préférences de notification côté Gestionnaire

> Instance projet d'une Design Decision Specification (gabarit `docs/cgpa/design/DDS-001.md`, non
> modifié), même convention `DDS-LT-NNN` que `DDS-LT-001`. Formalise **DDS-cand-1**, candidate
> identifiée par `UXR-001.md` (2026-07-30) et laissée ouverte par
> `phase-02-information-architecture.md` §4 et `phase-02-ui-mockups.md` §4.

## Métadonnées

| Champ | Valeur |
|---|---|
| Identifiant | DDS-LT-002 |
| Titre | Emplacement des préférences de notification côté Gestionnaire |
| Statut | **Acceptée** — validation Product Owner explicite obtenue le 2026-07-31 |
| Date | 2026-07-31 |
| Responsable | Design Architect — Claude Code, sous-agent CGPA désigné le 2026-07-30 (`agent-designations-loyertracker.md`) |
| Version DSG | `DSG-001.md` v0.1.0 |
| Product Owner | jptshilombo@gmail.com — validation requise avant instruction du Gate 04A applicable à US-125 |
| Documents amont | `phase-02-information-architecture.md` §4, `phase-02-ui-mockups.md` §4, `UXR-001.md` (Gate 02A, GO sous réserve le 2026-07-31) |

## Contexte

Le produit n'a aujourd'hui **qu'une seule page « profil » routée** (`/bailleur/profil`), réservée
au Bailleur (constat de code, `app.routes.ts`). Il n'existe **aucune page équivalente côté
Gestionnaire**. US-125 introduit un bloc « Préférences de notification » qui doit être exposé aux
deux rôles.

## Problème

Où placer ce bloc côté Gestionnaire, sachant qu'aucune route `/gestionnaire/profil` n'existe à ce
jour et que ce choix engage potentiellement une extension future (autres réglages personnels
Gestionnaire).

## Options étudiées

| Option | Description | Avantages | Inconvénients |
|---|---|---|---|
| **A — Nouvelle route `/gestionnaire/profil`** | Page symétrique au Bailleur | Cohérence de navigation entre rôles ; extensible à d'autres réglages personnels futurs | Premier écran entièrement nouveau côté Gestionnaire ; périmètre plus large que le seul besoin d'US-125 (8 points, priorité *Should*) |
| **B — Section embarquée dans `GestionnaireDashboardComponent`** | Ajout direct au dashboard existant, sans nouvelle route | Aligné sur le patron déjà utilisé pour Alertes (composant standalone embarqué, pas de route dédiée) ; footprint minimal ; aucune nouvelle route à documenter, tester, ni couvrir en accessibilité | Asymétrie durable de navigation entre Bailleur (page dédiée) et Gestionnaire (section de dashboard) |

## Décision retenue

**Option B — section embarquée dans `GestionnaireDashboardComponent`**, au même niveau
hiérarchique que le bloc Historique des notifications (`phase-02-ui-mockups.md` §4, variante B).

## Justification

* Le patron déjà éprouvé pour une donnée « transverse au tenant, pas liée à un bien précis »
  (Alertes, `AlertesListeComponent`) est exactement le patron applicable aux préférences de
  notification côté Gestionnaire — pas de raison de s'en écarter pour ce premier lot.
* US-125 est priorisée *Should*, 8 points (`phase-02-user-journeys.md`) : créer une route entière
  et une page « profil » Gestionnaire dépasserait le périmètre strictement nécessaire pour livrer
  le besoin.
* Le composant `NotificationsPreferencesComponent` (patron `ProfilComponent`) reste, par
  construction, réutilisable qu'il soit intégré à une page dédiée ou à une section de dashboard
  (`phase-02-information-architecture.md` §2) — l'Option B ne ferme donc pas la porte à un futur
  passage vers l'Option A.
* L'asymétrie Bailleur/Gestionnaire est un inconvénient réel mais non structurant : elle existe
  déjà aujourd'hui de fait (seul `/bailleur/profil` existe) et n'est pas aggravée par cette
  décision, seulement reconduite sur un nouveau bloc.

## Conséquences positives

* Aucune nouvelle route, aucun nouveau guard, aucun nouveau test de navigation à écrire.
* Cohérence stricte avec le patron Alertes déjà validé et en Production.
* Réversible : un passage ultérieur à l'Option A n'implique aucune migration de données, seul un
  déplacement de composant.

## Conséquences négatives

* Asymétrie durable de navigation entre Bailleur et Gestionnaire, à réévaluer si d'autres réglages
  personnels Gestionnaire apparaissent (auquel cas l'Option A redeviendrait pertinente — nouvelle
  DDS à cet horizon, pas une réouverture de celle-ci).

## Alternatives rejetées

* **Option A (nouvelle route `/gestionnaire/profil`)** : rejetée pour ce lot — périmètre
  disproportionné par rapport à la priorité *Should* et aux 8 points d'US-125 ; reste une option
  valable si un besoin futur élargit le périmètre des réglages personnels Gestionnaire.

## Compatibilité

* Aucun impact sur le routing existant (`app.routes.ts` inchangé).
* Aucun impact backend : le composant consomme les mêmes endpoints
  (`/api/notifications/preferences/...`) indépendamment de son emplacement dans l'arbre de
  composants.
* Responsive : aucun nouveau patron, l'empilement vertical existant (`< 640px`) s'applique
  identiquement à une section de dashboard qu'à une page dédiée.

## Traçabilité

* **Origine** : `UXR-001.md` (DDS-cand-1), `phase-02-information-architecture.md` §4,
  `phase-02-ui-mockups.md` §4.
* **Registre** : `design-decision-register.md`.
* **Gate concerné** : Gate 04A applicable à US-125 (non instruit à ce jour).

## Décision

* **Statut : Acceptée** — décision explicite du Product Owner (jptshilombo@gmail.com), 2026-07-31
  (« valide DDS-LT-002→005 »), sur la recommandation Option B du Design Architect.
* Cette acceptation ne vaut ni GO, ni GO sous réserve, ni NO GO du Gate 04A applicable à US-125 —
  elle clôt la seule réserve non bloquante DDS-cand-1 du Gate 02A (`gate-02A-decision-ep16-us125.md`
  §4), la décision de Gate 04A restant distincte et non instruite à ce jour.
* Aucune implémentation n'est autorisée par ce document — l'implémentation reste subordonnée au
  Plan d'Exécution applicable à US-125 et au Gate 04A.
