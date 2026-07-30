# Phase 02 — Maquettes des écrans critiques

| Champ | Valeur |
|-------|--------|
| Livrable CGPA | Gate 02A — UX & Design Readiness (`docs/cgpa/gates/gate-02A-ux-design-readiness.md`) |
| Périmètre couvert | US-125 — Interface de préférences et historique des notifications (EP-16, Sprint N+2 Lot B) |
| Statut | **Proposé — premier jet, non validé** |
| Auteur | Claude Code (rédaction assistée) |
| Date | 2026-07-30 |
| Validateurs requis | Product Owner (jptshilombo@gmail.com), UX/UI Design Lead (à désigner) |
| Documents amont | `phase-02-user-journeys.md`, `phase-02-information-architecture.md`, `phase-02-design-system.md` |

> **Niveau de fidélité.** Ces maquettes sont des wireframes texte (fidélité basse/moyenne), pas des
> maquettes graphiques — cohérent avec le reste du dépôt CGPA (aucun outil graphique externe
> introduit, cf. `designops-governance.md` §Outils, neutre). Elles couvrent les critères GO du Gate
> 02A (« maquettes des écrans critiques disponibles ») ; les spécifications visuelles détaillées
> (`ui-specifications.md`) restent un livrable du Gate 04A. Les libellés de champs et statuts
> reprennent exactement les noms réels du modèle backend existant (`NotificationPreference`,
> `NotificationOutbox`, `NotificationDelivery` — Sprints N/N+1 déjà en Production), pour éviter
> tout écart entre la maquette et l'implémentation.

---

## 0. Rappel du modèle de statuts (traçabilité maquette ↔ code)

Un même événement peut avoir un statut Outbox (jamais transmis au fournisseur ou en file) **et**,
seulement s'il a été réellement transmis, un statut Delivery (suivi Twilio). Les deux niveaux
doivent être fusionnés en **un seul statut lisible par ligne d'historique** — ce mapping est une
proposition UX à confirmer au Gate 04A, aucun endpoint de lecture consolidée n'existe encore :

| Statut technique | Niveau | Libellé proposé à l'écran | Rôle sémantique (design system §4) |
|---|---|---|---|
| `PENDING` / `RETRY` (Outbox) | Outbox | « En attente d'envoi » | info |
| `PROCESSING` (Outbox) | Outbox | « Envoi en cours » | info |
| `DEAD` (Outbox) | Outbox | « Non envoyé — {motif} » (ex. gabarit non approuvé) | danger |
| `QUEUED` / `ACCEPTED` / `SENT` (Delivery) | Delivery | « Envoyé, en cours de livraison » | info |
| `DELIVERED` (Delivery) | Delivery | « Livré » | success |
| `READ` (Delivery) | Delivery | « Lu » | success |
| `FAILED` / `UNDELIVERED` / `CANCELLED` (Delivery) | Delivery | « Échec de livraison » | danger |

---

## 1. Écran « Préférences de notification » — Bailleur (extension de `/bailleur/profil`)

### 1.1 État nominal (préférences déjà définies)

```
┌─ Mon profil ─────────────────────────────────────────── ← Retour au tableau de bord ─┐
│                                                                                        │
│  Nom       Jordan T.                                                                  │
│  Email     jptshilombo@gmail.com                                                      │
│                                                                                        │
│  Adresse postale                                                                      │
│  [ ...................................... ] (existant, inchangé)                     │
│  [ Enregistrer ]                                                                       │
│                                                                                        │
│  ── Préférences de notification ────────────────────────────────────  (NOUVEAU, J1) ─ │
│                                                                                        │
│  Numéro de téléphone            Canal préféré         Canal de secours                │
│  [ +243 999 964 331 ]           (•) WhatsApp          [ ] SMS (case à cocher)          │
│                                 ( ) SMS                                                │
│                                                                                        │
│  Consentement                                                                          │
│  [x] J'accepte de recevoir des messages WhatsApp pour mes notifications               │
│  [ ] J'accepte de recevoir des SMS en secours (si WhatsApp indisponible)               │
│                                                                                        │
│  Recueilli le 2026-07-24 via formulaire LoyerTracker.        [role=status, texte lu]  │
│                                                                                        │
│  [ Enregistrer les préférences ]     [ Se désinscrire des canaux externes ]           │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- Bloc construit avec le patron `.panel` + `label`/`input`/`select` déjà en place
  (`phase-02-design-system.md` §3) — pas de nouveau composant visuel.
- Les alertes in-app existantes ne sont **jamais** mentionnées comme dépendantes de ce bloc : un
  texte de clarification permanent doit rappeler qu'elles restent actives quel que soit ce
  paramétrage (RM-122, cf. J1 cas d'erreur).
- Le canal de secours SMS n'est proposé que si un opt-in SMS existe (K5 : pas de fallback
  automatique) — case grisée/inactive tant que l'opt-in SMS n'est pas coché.

### 1.2 État initial (aucune préférence définie — première visite)

```
│  ── Préférences de notification ──────────────────────────────────────────────────── │
│                                                                                        │
│  Vous ne recevez aujourd'hui que les alertes dans l'application.                      │
│  Renseignez un numéro pour activer WhatsApp ou SMS.               [role=status]      │
│                                                                                        │
│  Numéro de téléphone            Canal préféré                                         │
│  [ ......................... ]  ( ) WhatsApp   ( ) SMS                                │
│                                                                                        │
│  [ ] J'accepte de recevoir des messages WhatsApp                                       │
│  [ ] J'accepte de recevoir des SMS en secours                                          │
│                                                                                        │
│  [ Enregistrer les préférences ]  (bouton désactivé tant qu'aucun opt-in n'est coché) │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Erreur de validation (numéro invalide)

```
│  Numéro de téléphone                                                                  │
│  [ 0999-964-331 ]                                                                      │
│  ⚠ Format attendu : indicatif international, ex. +243999964331   [.field-error]       │
│                                                                                        │
│  [ Enregistrer les préférences ]  (désactivé tant que l'erreur n'est pas corrigée)    │
```

### 1.4 Confirmation d'effet — désinscription (cas d'erreur J1 à lever explicitement)

```
┌─ Confirmer la désinscription ? ───────────────────────────────────────────────────────┐
│                                                                                        │
│  Vous ne recevrez plus aucun message WhatsApp ni SMS dès maintenant.                  │
│  Vos alertes dans l'application restent, elles, actives sans changement.             │
│                                                                                        │
│              [ Annuler ]                    [ Confirmer la désinscription ]           │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

Après confirmation : `role="status" aria-live="polite"` → « Désinscription effective — aucun envoi
externe ne sera plus tenté. » (patron déjà utilisé pour les messages de confirmation, ex.
`ProfilComponent`).

---

## 2. Écran « Historique des notifications » — Bailleur (section du dashboard, J2)

### 2.1 État nominal (liste peuplée)

```
┌─ Historique des notifications ──────────────────────────────────── Rafraîchir ───────┐
│  4 notification(s)                                                     [role=status] │
│                                                                                        │
│  2026-07-30 13:02   QUITTANCE_DISPONIBLE   +243999964331 · WhatsApp   [Livré]  ✅     │
│  2026-07-29 09:14   PAIEMENT_RECU          +243999964331 · WhatsApp   [Non envoyé —   │
│                                                                        gabarit non     │
│                                                                        approuvé] ⛔    │
│  2026-07-24 08:47   LOYER_EN_RETARD        +243812345678 · SMS        [Échec de       │
│                                                                        livraison] ⛔    │
│  2026-07-19 16:06   BAIL_CLOS              +243999964331 · WhatsApp   [Livré]  ✅     │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- Patron `.panel`/`.panel-head`/`.list`/`.row` réutilisé à l'identique
  (`AlertesListeComponent`/`AuditJournalComponent`).
- Badge de statut coloré selon le mapping §0 (`[attr.data-statut]`, même patron que
  `[attr.data-type]` des alertes).
- **Aucun filtre ni tri interactif dans ce premier jet** — liste brute la plus récente d'abord,
  alignée sur le précédent existant (`design-system` §5). Si un filtre s'avère nécessaire, il sera
  ajouté après confirmation du besoin réel, par DDS au Gate 04A.
- Le type d'événement (`QUITTANCE_DISPONIBLE`, `LOYER_EN_RETARD`…) est affiché brut : un
  vocabulaire d'affichage humain (« Quittance disponible », « Loyer en retard »…) reste à trancher
  au Gate 04A — pas décidé par ce wireframe pour ne pas anticiper une DDS de contenu/traduction.

### 2.2 État vide (canaux jamais activés — cas le plus fréquent en 2026-07-30, cf. `project-state.md`)

```
┌─ Historique des notifications ──────────────────────────────────── Rafraîchir ───────┐
│                                                                                        │
│  Aucune notification externe envoyée.                                  [.muted]      │
│  Les canaux WhatsApp/SMS ne sont pas encore activés pour votre compte.               │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

Reprend explicitement le patron `<p class="muted">Aucun…</p>` déjà utilisé par
`AlertesListeComponent` (« Aucune alerte non lue ») et `AuditJournalComponent` (« Aucune entrée »).

### 2.3 Détail d'une ligne « Non envoyé » (cas d'erreur documenté en conditions réelles)

```
┌─ Détail — PAIEMENT_RECU, 2026-07-29 09:14 ────────────────────────────────────────────┐
│                                                                                        │
│  Destinataire   +243999964331 (WhatsApp)                                             │
│  Statut         Non envoyé                                                            │
│  Motif          Aucun gabarit WhatsApp approuvé pour ce type d'événement.             │
│  Tentatives     1                                                                      │
│                                                                                        │
│                                                              [ Fermer ]                │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

Ce cas n'est pas hypothétique : il reproduit exactement le comportement déjà vérifié en conditions
réelles au Gate Staging Sprint N+1 (`PAIEMENT_RECU` → `DEAD`, absence de gabarit approuvé,
`project-state.md` ligne ~1174).

---

## 3. Écran « Historique des notifications » — Gestionnaire (périmètre restreint, J3)

### 3.1 État nominal (périmètre affecté uniquement)

```
┌─ Historique des notifications ──────────────────────────────────── Rafraîchir ───────┐
│  1 notification(s) — limité à vos biens affectés                       [role=status] │
│                                                                                        │
│  2026-07-30 13:02   QUITTANCE_DISPONIBLE   +243999964331 · WhatsApp   [Livré]  ✅     │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

**Annotation** : le sous-titre « limité à vos biens affectés » est un rappel explicite de
périmètre (cf. persona Gestionnaire §1.2 de `phase-02-user-journeys.md` — risque de confusion
multi-bailleur), pas une donnée technique nouvelle : le filtrage réel reste entièrement porté par
le serveur (RLS/ReBAC), ce texte n'est qu'un repère visuel.

### 3.2 État après révocation de l'affectation

```
┌─ Historique des notifications ──────────────────────────────────── Rafraîchir ───────┐
│                                                                                        │
│  Aucune notification visible sur votre périmètre actuel.                [.muted]     │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

Même libellé générique que l'état vide bailleur (§2.2) — un gestionnaire révoqué ne doit recevoir
aucun indice sur l'existence de notifications hors de son périmètre (cohérent avec EF-64, US-62).

---

## 4. Emplacement des préférences côté Gestionnaire — deux variantes (décision ouverte, non tranchée)

Rappel : `phase-02-information-architecture.md` §4 laisse ce point ouvert (candidat DDS). Les deux
wireframes ci-dessous illustrent les options sans en privilégier une dans ce document.

**Option A — nouvelle page `/gestionnaire/profil`** (symétrique au Bailleur) :

```
┌─ Mon profil (Gestionnaire) ────────────────────────────────── ← Retour au tableau de bord ─┐
│  Nom       ...        Email      ...                                                       │
│  ── Préférences de notification ── (identique à §1, mêmes états) ──                        │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Option B — section embarquée dans `GestionnaireDashboardComponent`** (sans nouvelle route) :

```
┌─ Espace gestionnaire ──────────────────────────────────────────────────────────────────┐
│  ... (biens affectés, baux, paiements, garanties, honoraires — existant) ...           │
│                                                                                          │
│  ── Mes préférences de notification ── (identique à §1, mêmes états) ──────────────    │
│  ── Historique des notifications ── (§3) ──────────────────────────────────────────    │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Variante responsive (< 640px, cf. `design-system` §2 — breakpoint déjà en place)

```
┌─ Mon profil ───────────┐
│ ← Retour               │
│                        │
│ Nom     Jordan T.      │
│ Email   ...            │
│                        │
│ Adresse postale        │
│ [ .............. ]     │
│ [ Enregistrer ]        │
│                        │
│ ── Notifications ──    │
│ Numéro                │
│ [ ............. ]      │
│ Canal préféré          │
│ (•) WhatsApp           │
│ ( ) SMS                │
│ [x] Opt-in WhatsApp    │
│ [ ] Opt-in SMS         │
│                        │
│ [ Enregistrer ]        │
│ [ Se désinscrire ]     │
└────────────────────────┘
```

Empilement vertical simple (`flex-direction: column` déjà appliqué globalement sous 640px,
`phase-02-design-system.md` §2) — aucun nouveau patron responsive à inventer.

---

## 6. Accessibilité — annotations transverses à toutes les maquettes

- Chaque bloc de section (« Préférences de notification », « Historique des notifications ») porte
  un titre `<h2>` explicite, repère de navigation pour lecteur d'écran (cf. IA §5).
- Les messages de confirmation/erreur utilisent `role="status" aria-live="polite"` (préférences
  enregistrées, désinscription confirmée) ou `.field-error` visible + associé au champ (numéro
  invalide) — patrons déjà en place, aucun nouveau mécanisme.
- La boîte de confirmation de désinscription (§1.4) doit être focus-trappée et restituer le focus
  au bouton d'origine à la fermeture — **premier dialogue modal du produit** (aucun précédent
  trouvé dans le code existant) : point à couvrir explicitement par `CHECK-ACCESSIBILITY-01` au
  Gate 04A, pas simplement halluciné comme « déjà couvert ».
- Les badges de statut (§0) ne portent pas l'information uniquement par la couleur : le libellé
  texte (« Livré », « Échec de livraison »…) est toujours présent à côté de l'icône/couleur.

---

## 7. Traçabilité

- Personas/journeys : `phase-02-user-journeys.md` (J1 §1, J2 §2, J3 §3).
- Information architecture : `phase-02-information-architecture.md` (emplacements §2, décision
  ouverte §4 reprise ici en §4).
- Design system : `phase-02-design-system.md` (tokens, composants réutilisés, mapping de statuts
  repris et détaillé en §0 de ce document).
- Point nouveau identifié par ce document, à ajouter au registre de dette ou aux décisions
  ouvertes : le **dialogue de confirmation de désinscription est le premier modal du produit** —
  aucun composant modal réutilisable n'existe aujourd'hui dans `frontend/src/app` ; sa création est
  un candidat DDS distinct pour le Gate 04A (au-delà du strict périmètre d'US-125 si un modal
  générique est jugé préférable à une confirmation inline).
