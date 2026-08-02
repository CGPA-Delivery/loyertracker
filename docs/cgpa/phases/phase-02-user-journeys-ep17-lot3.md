# Phase 02 — Parcours écrit, EP-17 Lot 3 (Pilote Angular — Patrimoines/Biens)

| Champ | Valeur |
|-------|--------|
| Livrable CGPA | Gate 02A — UX & Design Readiness (`docs/cgpa/gates/gate-02A-ux-design-readiness.md`) |
| Périmètre couvert | EP-17 Lot 3 — section **Patrimoines/Biens** du dashboard Bailleur uniquement (`US-133` restreinte + `US-134`), confirmé Product Owner le 2026-08-02 (`docs/project-state.md`). Hors périmètre : Affectations, Paiements, Garanties, Honoraires, Alertes, Journal d'audit. |
| Statut | **Proposé — premier jet, non validé** |
| Auteur | Claude Code (rédaction assistée) |
| Date | 2026-08-02 |
| Validateurs requis | Product Owner (jptshilombo@gmail.com), UX/UI Design Lead (à désigner) |
| Documents amont | `phase-02-user-journeys.md` §1.1 (persona Bailleur, réutilisé tel quel), `phase-02-information-architecture.md` §1 (arborescence réelle) |
| Comble le blocage | `gate-02A-decision-ep17-lot3.md` §4 (« maquettes absentes »), avis UX/UI Design Lead §5 |

> **Note de périmètre.** Ce document ne documente pas rétroactivement l'ensemble du dashboard
> Bailleur (biens, patrimoines, baux, affectations, paiements, garanties, honoraires, alertes,
> audit — cf. `phase-02-user-journeys.md` note de périmètre équivalente pour US-125). Il couvre
> strictement les deux parcours déclenchés par le périmètre confirmé du Lot 3 : gérer ses biens et
> gérer ses patrimoines. Les parcours Baux/Paiements/Garanties/Honoraires, visibles une fois un bien
> sélectionné dans le code actuel, restent hors périmètre — ils ne sont ni migrés ni redocumentés
> ici.

> **Constat corrigeant `gate-04A-decision-ep17-lot3.md`/`gate-02A-decision-ep17-lot3.md` (rédigés
> avant lecture directe du code de cette section)** : ces deux instances indiquaient que le
> périmètre confirmé était « lecture principalement » et « aucune action destructive ». Lecture
> directe de `dashboard.component.ts` (Bailleur) : la section Biens porte en réalité un formulaire
> de création/modification (`bienForm`) **et** une action destructive (« Archiver ce bien »,
> confirmée par `globalThis.confirm()` natif, pas par `lt-confirm-dialog`) ; la section Patrimoines
> porte un formulaire de modification (`patrimoineForm`, pas de création ni d'archivage exposé côté
> UI à ce jour). **Le parcours J-Lot3-1 ci-dessous est donc un CRUD complet (create/read/update/
> archive pour un bien), pas une simple consultation** — écart réel, signalé plutôt que corrigé
> silencieusement dans les instances de Gate, conformément à la pratique déjà suivie pour
> `DDS-LT-005` (`docs/project-state.md`, US-132). Voir §3 pour l'effet sur le périmètre de
> migration retenu.

---

## 1. Persona

Réutilise sans modification le persona « Bailleur — persona primaire »
(`phase-02-user-journeys.md` §1.1) : rôle `BAILLEUR`, accès complet à son tenant (RLS
`bailleur_isolation`), niveau technique variable. Le Gestionnaire (§1.2 du même document) dispose
d'un accès équivalent mais restreint à ses biens/baux affectés — la section Patrimoines/Biens du
dashboard Gestionnaire (biens affectés uniquement, pas de création de patrimoine) suit la même
structure sans être détaillée séparément ici : différence de périmètre de données, pas de parcours.

---

## 2. User journeys

### J-Lot3-1 — Gérer mes biens (créer, modifier, archiver)

**Déclencheur** : le Bailleur veut consulter la liste de ses biens, en ajouter un nouveau, corriger
les informations d'un bien existant, ou en retirer un de la gestion active.

**Parcours nominal**

1. Le Bailleur ouvre la section « Biens » de son dashboard.
2. Il consulte la liste des biens existants : adresse, type, statut (`LIBRE`/`LOUE`/
   `EN_TRAVAUX`/`ARCHIVE`), patrimoine de rattachement.
3. Il sélectionne un bien dans la liste → le formulaire se pré-remplit (« Modifier le bien »).
4. Il modifie un champ (ex. statut) et enregistre → confirmation explicite (« Bien modifié »),
   liste rafraîchie.
5. Alternative : il clique « Nouveau » → formulaire vide (« Nouveau bien »), saisit adresse/type/
   patrimoine/statut, crée → confirmation (« Bien créé »), le bien apparaît dans la liste.
6. Alternative : un bien sélectionné peut être archivé (« Archiver ce bien ») → confirmation
   requise avant l'action (aujourd'hui `confirm()` natif du navigateur — hors périmètre de
   migration de ce Lot, cf. §3) → confirmation du résultat (« Bien archivé »), statut mis à jour
   dans la liste et le formulaire.

**Cas d'erreur / limites**

- Formulaire invalide (champ requis manquant) → soumission bloquée, `[disabled]` sur le bouton,
  cohérent avec le patron déjà utilisé sur les autres formulaires du produit.
- Liste vide (aucun bien créé) → état vide explicite (« Aucun bien »), déjà présent dans le code
  actuel (`<p class="muted">Aucun bien.</p>`) ; la migration doit reprendre ce message via
  `lt-empty-state`, pas un nouveau texte.
- Erreur réseau/serveur au chargement de la liste → aucun état d'erreur dédié dans le code actuel
  (dette, cf. §3) ; la migration vers `lt-data-table` devra introduire un état d'erreur explicite
  (`lt-empty-state` variante erreur, déjà livrée en Lot 2) là où il n'existait pas.
- Tentative de sélection/modification d'un bien hors de son propre tenant (appel API direct) →
  403, comme pour toute autre entité RLS-scopée du produit (non nouveau, non testé par ce Lot —
  déjà couvert par les tests backend existants).

**Parcours critique ?** Oui — bloquant pour Gate 04A : c'est le point d'entrée de toute la gestion
locative (un bien doit exister avant qu'un bail, un paiement, une garantie ou un honoraire ne
puisse lui être rattaché).

---

### J-Lot3-2 — Gérer mes patrimoines (modifier)

**Déclencheur** : le Bailleur veut corriger ou compléter les informations d'un patrimoine existant
(adresse, ville, référence interne, description).

**Parcours nominal**

1. Le Bailleur ouvre la section « Patrimoines » de son dashboard.
2. Il consulte la liste des patrimoines existants : nom, adresse/ville/pays, référence interne (si
   renseignée), statut.
3. Il sélectionne un patrimoine dans le menu déroulant dédié → le formulaire de modification
   apparaît, pré-rempli.
4. Il modifie un ou plusieurs champs et enregistre → confirmation, liste rafraîchie.

**Cas d'erreur / limites**

- Formulaire invalide → soumission bloquée, même patron que J-Lot3-1.
- Aucun patrimoine encore créé → état vide explicite (« Aucun patrimoine. »), déjà présent dans le
  code actuel, à reprendre via `lt-empty-state`.
- **Aucune création ni suppression de patrimoine exposée par l'interface actuelle** — seule la
  modification existe (constat de code, pas une limite introduite par ce Lot). Hors périmètre de
  ce Lot 3 : la migration ne doit ni ajouter ni retirer de fonctionnalité, seulement substituer la
  présentation.

**Parcours critique ?** Oui, dans une moindre mesure que J-Lot3-1 (fréquence de modification plus
faible — le patrimoine est en général renseigné une fois puis stable) ; retenu comme bloquant Gate
04A par cohérence de périmètre avec la section elle-même.

---

## 3. Effet du constat §0 sur le périmètre de migration retenu

Le périmètre confirmé par le Product Owner (« Patrimoines/Biens », lecture principalement) reste
**inchangé dans son étendue fonctionnelle** — aucune section supplémentaire n'est ajoutée ou
retirée. Ce que ce document corrige, c'est la **caractérisation du risque**, pas le périmètre :

* La migration porte sur la **présentation** des deux parcours ci-dessus (liste → `lt-data-table`,
  formulaire → `lt-form-field`, statut → `lt-status-tag`), pas sur leur logique. Le mécanisme
  d'archivage (`confirm()` natif) est **explicitement préservé tel quel** dans ce Lot — remplacer
  ce `confirm()` par `lt-confirm-dialog` est une amélioration possible, mais hors périmètre : elle
  ferait redevenir `DD-EP17-05` pertinente (premier dialogue modal en Production) et devrait être
  instruite comme une extension de périmètre distincte, pas glissée dans cette migration.
* La réserve « données financières affichées » (`gate-04A-decision-ep17-lot3.md` §4) reste non
  pertinente : ni `Bien` ni `Patrimoine` ne portent de champ monétaire (le loyer est un attribut du
  `Bail`, hors périmètre).
* Une dette réelle, non identifiée avant ce document, est ajoutée à `design-debt-register-loyertracker.md`
  (§4 de ce document) : absence d'état d'erreur explicite au chargement des listes Biens/
  Patrimoines dans le code actuel — l'introduction d'un état d'erreur par la migration `lt-empty-state`
  est donc une amélioration réelle, pas une simple reformulation visuelle, à signaler comme telle
  dans la revue de la Story plutôt que passée sous silence.

---

## 4. Synthèse — parcours retenus pour le Gate 02A, Lot 3

| Parcours | Persona | Criticité | Bloquant Gate 04A ? |
|---|---|---|---|
| J-Lot3-1 — Gérer mes biens (create/read/update/archive) | Bailleur (Gestionnaire : périmètre affecté) | Élevée (point d'entrée de la gestion locative) | Oui |
| J-Lot3-2 — Gérer mes patrimoines (modifier) | Bailleur | Moyenne | Oui |

Aucun parcours de création/suppression de patrimoine n'existe dans l'interface actuelle — non
introduit par ce document ni par ce Lot.
