# DDS-LT-004 — Mapping des statuts de livraison Outbox/Delivery vers un vocabulaire d'affichage unique

> Instance projet d'une Design Decision Specification, même convention que `DDS-LT-001→003`.
> Formalise **DDS-cand-3**, candidate identifiée par `UXR-001.md` (2026-07-30) et proposée par
> `phase-02-ui-mockups.md` §0 et `phase-02-design-system.md` §4.

## Métadonnées

| Champ | Valeur |
|---|---|
| Identifiant | DDS-LT-004 |
| Titre | Mapping des statuts de livraison Outbox/Delivery vers un vocabulaire d'affichage unique |
| Statut | **Acceptée** — validation Product Owner explicite obtenue le 2026-07-31 |
| Date | 2026-07-31 |
| Responsable | Design Architect — Claude Code, sous-agent CGPA désigné le 2026-07-30 |
| Version DSG | `DSG-001.md` v0.1.0 |
| Product Owner | jptshilombo@gmail.com — validation requise avant instruction du Gate 04A applicable à US-125 |
| Documents amont | `phase-02-ui-mockups.md` §0, `phase-02-design-system.md` §4, `UXR-001.md` |

## Contexte

Un même événement de notification peut avoir un statut **Outbox** (jamais transmis au fournisseur
ou en file) et, seulement s'il a été réellement transmis, un statut **Delivery** (suivi Twilio).
Ce sont deux modèles de statuts techniques distincts, côté base de données, qu'aucun endpoint de
lecture consolidée ne fusionne aujourd'hui. Aucun badge de statut « succès » cohérent n'existe à ce
jour dans un seul composant central du produit (la famille verte est dupliquée avec des valeurs
légèrement différentes selon paiements/garanties/honoraires/quittance,
`phase-02-design-system.md` §4).

## Problème

Fusionner les deux niveaux de statut technique (Outbox, Delivery) en **un seul statut lisible par
ligne d'historique**, avec un libellé humain et une couleur sémantique cohérente avec le reste du
produit.

## Options étudiées

| Option | Description | Avantages | Inconvénients |
|---|---|---|---|
| **A — Mapping proposé par les maquettes (7 statuts techniques → 5 libellés)** | Reprendre tel quel le mapping documenté en `phase-02-ui-mockups.md` §0 | Déjà réfléchi contre les valeurs réelles de l'énumération `NotificationDelivery`/Outbox ; réutilise les rôles sémantiques (`success`/`info`/`danger`) déjà en place ailleurs dans le produit (paiements, garanties) ; libellés en français, compréhensibles sans jargon technique | Aucun — c'est la seule option réellement instruite par les livrables Phase 02 |
| **B — Exposer les statuts techniques bruts** | Afficher `DELIVERED`/`FAILED`/etc. directement | Aucune traduction à maintenir | Rejeté explicitement par la revue UX (`UXR-001.md` §Lisibilité) : un persona Bailleur peu technique ne comprendrait pas un libellé brut |

Une seule option a réellement été instruite ; ce document formalise le mapping déjà proposé plutôt
que d'arbitrer entre alternatives concurrentes.

## Décision retenue

Le mapping suivant devient la **source de vérité canonique** pour l'affichage du statut d'une
ligne d'historique de notification, à implémenter dans `NotificationsHistoriqueComponent` :

| Statut technique | Niveau | Libellé affiché | Rôle sémantique | Couleur (DSG) |
|---|---|---|---|---|
| `PENDING` / `RETRY` | Outbox | « En attente d'envoi » | info | `#bae6fd` |
| `PROCESSING` | Outbox | « Envoi en cours » | info | `#bae6fd` |
| `DEAD` | Outbox | « Non envoyé — {motif} » (ex. gabarit non approuvé) | danger | `#fecaca` |
| `QUEUED` / `ACCEPTED` / `SENT` | Delivery | « Envoyé, en cours de livraison » | info | `#bae6fd` |
| `DELIVERED` | Delivery | « Livré » | success | `#bbf7d0` |
| `READ` | Delivery | « Lu » | success | `#bbf7d0` |
| `FAILED` / `UNDELIVERED` / `CANCELLED` | Delivery | « Échec de livraison » | danger | `#fecaca` |

**Règle de priorité de niveau** : si un statut Delivery existe (l'événement a été réellement
transmis), il prévaut sur le statut Outbox sous-jacent (qui reste `PROCESSED`/terminal côté
Outbox) — seul le niveau le plus avancé atteint est affiché, jamais les deux simultanément.

## Justification

* Reprend intégralement le travail déjà produit par la revue UX/UI (`phase-02-ui-mockups.md` §0,
  `phase-02-design-system.md` §4), qui a explicitement vérifié la correspondance avec les valeurs
  réelles des énumérations `NotificationDelivery`/Outbox — pas une invention de ce document.
* Les couleurs sémantiques réutilisent des valeurs **déjà en usage** ailleurs dans le produit
  (`#bbf7d0` déjà la variante la plus fréquente de la famille verte ; `#bae6fd` déjà utilisé comme
  badge neutre ; `#fecaca` déjà utilisé pour `LOYER_EN_RETARD` et les erreurs de champ) — aucune
  nouvelle couleur token à introduire.
* Aligné sur l'exigence d'accessibilité déjà tracée (`phase-02-ui-mockups.md` §6) : le libellé
  texte est toujours présent à côté de la couleur, l'information n'est jamais portée par la seule
  couleur.

## Conséquences positives

* Un seul mapping à maintenir, centralisé (fonction ou pipe Angular dédié), au lieu d'une logique
  de statut dispersée dans le template.
* Cohérence visuelle immédiate avec les badges de statut déjà en place (paiements, garanties,
  honoraires).

## Conséquences négatives

* Un statut « réservé » (avertissement de retry, `#fde68a`) est explicitement mentionné comme non
  couvert par ce mapping (`phase-02-design-system.md` §4) — dette à tracer si un tel statut est
  introduit côté backend sans mapping correspondant mis à jour.

## Alternatives rejetées

* **Option B (statuts techniques bruts)** : rejetée pour non-lisibilité par un persona non
  technique (`UXR-001.md` §Lisibilité).

## Compatibilité

* Nécessite un endpoint de lecture consolidée Outbox+Delivery côté backend, **qui n'existe pas
  encore** (`phase-02-ui-mockups.md` §0) — cette DDS fixe le mapping d'affichage, pas
  l'implémentation backend, qui reste un travail distinct du Lot d'implémentation applicable.
* Types d'événement (`QUITTANCE_DISPONIBLE`, `LOYER_EN_RETARD`, etc.) restent **hors périmètre** de
  cette DDS — ils demeurent non traduits dans ce premier jet (`UXR-001.md` §Lisibilité,
  recommandation : lexique d'affichage humain à produire séparément avant les maquettes
  définitives).

## Traçabilité

* **Origine** : `UXR-001.md` (DDS-cand-3), `phase-02-ui-mockups.md` §0, `phase-02-design-system.md` §4.
* **Registre** : `design-decision-register.md`.
* **Gate concerné** : Gate 04A applicable à US-125 (non instruit à ce jour).

## Décision

* **Statut : Acceptée** — décision explicite du Product Owner (jptshilombo@gmail.com), 2026-07-31
  (« valide DDS-LT-002→005 »), formalisant le mapping tel que proposé sans modification.
* Cette acceptation ne vaut ni GO, ni GO sous réserve, ni NO GO du Gate 04A applicable à US-125 —
  elle clôt la réserve non bloquante DDS-cand-3 du Gate 02A
  (`gate-02A-decision-ep16-us125.md` §4).
* Aucune implémentation n'est autorisée par ce document — l'endpoint de lecture consolidée reste à
  concevoir séparément.
