# Phase 02 — Personas & User Journeys

| Champ | Valeur |
|-------|--------|
| Livrable CGPA | Gate 02A — UX & Design Readiness (`docs/cgpa/gates/gate-02A-ux-design-readiness.md`) |
| Périmètre couvert | US-125 — Interface de préférences et historique des notifications (EP-16, Sprint N+2 Lot B) |
| Statut | **Proposé — premier jet, non validé** |
| Auteur | Claude Code (rédaction assistée) |
| Date | 2026-07-30 |
| Validateurs requis | UX/UI Design Lead (à désigner), Product Owner (jptshilombo@gmail.com) |
| Traçabilité amont | US-119 (préférences), US-123 (callbacks/livraison), K1/K6 (`ADR-18-notifications-multicanales-twilio.md`), EF-121/EF-122, BF-107/BF-111 |
| Registre de dette lié | `DD-611-01` (UXR-001 non renseigné) — ce document en constitue une entrée |

> **Note de périmètre.** Ce document ne rejoue pas rétroactivement l'ensemble de l'expérience
> LoyerTracker (le Gate 02A n'a jamais été instruit historiquement — écart accepté et tracé en
> `docs/project-state.md` §16/§17). Il couvre strictement le lot Frontend qui déclenche
> l'obligation : la consultation/modification des préférences de notification et de leur
> historique (US-125). Les personas et parcours des écrans déjà en Production (biens, baux,
> paiements, garanties, alertes, audit) sont cités uniquement comme points de continuité
> d'expérience, sans être eux-mêmes rouverts par ce Gate.

---

## 1. Personas

### 1.1 Bailleur — persona primaire

| Attribut | Détail |
|---|---|
| Nom de travail | « Le Bailleur gestionnaire de son propre patrimoine » |
| Rôle applicatif | `BAILLEUR` — accès complet à son tenant (RLS `bailleur_isolation`) |
| Objectif vis-à-vis des notifications | Être informé de manière fiable des événements financiers et locatifs (loyer reçu, retard, garantie débitée, quittance disponible) sans devoir se connecter au dashboard à chaque fois ; garder la maîtrise du canal utilisé (WhatsApp/SMS) et pouvoir se désinscrire à tout moment sans perte de traçabilité côté application (les alertes in-app restent, elles, toujours actives). |
| Contexte d'usage | Consulte le dashboard de façon irrégulière (quotidienne à hebdomadaire selon le nombre de biens) ; les notifications externes sont pour lui un filet de sécurité, pas un canal exclusif. |
| Niveau technique | Variable — de peu à très à l'aise avec une interface web ; le persona ne doit pas supposer d'expertise. |
| Douleur actuelle | Aucun canal externe n'existe aujourd'hui (constat ADR-18) : toute information passe par une connexion active au dashboard ou par un contact hors application (téléphone, message personnel). |
| Attentes vis-à-vis de l'écran US-125 | Voir/modifier son numéro et ses préférences en un minimum d'étapes ; comprendre immédiatement l'effet d'une désinscription (« plus aucun message WhatsApp/SMS, mes alertes in-app restent ») ; retrouver l'historique de ce qui a été réellement envoyé et son statut de livraison, pour arbitrer un litige avec un locataire ou un gestionnaire (« il prétend ne pas avoir reçu la quittance »). |
| Permissions sur cet écran | Lecture/écriture de ses propres préférences ; lecture de l'historique de tout son périmètre (K6). |

### 1.2 Gestionnaire — persona secondaire

| Attribut | Détail |
|---|---|
| Nom de travail | « Le Gestionnaire délégué sur un périmètre restreint » |
| Rôle applicatif | `GESTIONNAIRE` — accès limité aux biens/baux qui lui sont affectés activement (ReBAC déjà en place ailleurs dans l'app : biens, baux, honoraires, alertes) |
| Objectif vis-à-vis des notifications | Les mêmes besoins de fiabilité que le Bailleur, mais strictement cantonnés à son périmètre affecté ; ne doit jamais avoir la perception qu'il pourrait voir ou modifier des préférences ou un historique hors de ce périmètre. |
| Contexte d'usage | Peut gérer plusieurs bailleurs en parallèle (multi-tenant côté gestionnaire) — l'écran doit rester sans ambiguïté sur le tenant courant. |
| Douleur actuelle | Comme le Bailleur : aucun canal externe existant. Risque spécifique : confusion multi-bailleur si l'IA de l'écran n'affiche pas clairement le contexte. |
| Attentes vis-à-vis de l'écran US-125 | Voir/modifier ses propres préférences de destinataire ; consulter l'historique des notifications liées aux biens/baux qui lui sont affectés (K6), jamais celui d'un autre gestionnaire ni d'un autre bailleur — cohérent avec l'accès déjà restreint au journal d'audit (US-62, réservé au Bailleur) et aux alertes (US-52). |
| Permissions sur cet écran | Lecture/écriture de ses propres préférences ; lecture de l'historique restreinte aux biens/baux affectés actifs. Un gestionnaire révoqué ne doit plus rien voir (patron déjà appliqué aux alertes, EF-64). |

### 1.3 Locataire — persona hors scope UI (rappel de cadrage)

Le Locataire est destinataire *passif* des notifications externes (WhatsApp/SMS, K1) mais **ne
dispose d'aucun compte applicatif** et ne se connecte jamais au dashboard — seul un accès public
non authentifié de vérification de quittance existe (EP-14). Il n'a donc **aucun écran** dans le
périmètre d'US-125 ; ses préférences (`phone_e164`, opt-in) sont saisies *pour* lui par le Bailleur
ou le Gestionnaire via le formulaire natif (K3), pas par lui-même. Ce point reste un candidat de
DDS si le PO souhaitait un jour ouvrir un accès locataire — hors périmètre ici.

---

## 2. User journeys

### J1 — Gérer mes préférences de notification (Bailleur ou Gestionnaire)

**Déclencheur** : l'utilisateur veut recevoir (ou cesser de recevoir) des notifications externes,
ou corriger un numéro de téléphone.

**Parcours nominal**

1. L'utilisateur ouvre la section « Notifications » de son dashboard (Bailleur ou Gestionnaire).
2. Il consulte l'état actuel de ses préférences : numéro (`phone_e164`), canal préféré
   (WhatsApp/SMS), canal de secours, statut d'opt-in par canal, `enabled`.
3. Il modifie un ou plusieurs champs (ex. saisit son numéro, coche l'opt-in WhatsApp).
4. Il confirme — l'application persiste `consent_at`/`consent_source = 'FORMULAIRE_LOYERTRACKER'`
   (K3) et affiche une confirmation explicite de l'effet (« Vous recevrez désormais vos
   notifications par WhatsApp au +XXX »).
5. Fin du parcours : les préférences sont actives dès le prochain événement de notification.

**Cas d'erreur / limites**

- Numéro invalide (format non E.164) → message d'erreur bloquant avant soumission, aucune
  persistance.
- Désinscription (`enabled=false`) → confirmation explicite de l'effet immédiat : **aucun envoi
  externe n'est tenté dès cette action**, sans fenêtre de tolérance (EF-121) ; les alertes in-app
  restent, elles, inchangées et pleinement actives — l'écran doit lever toute ambiguïté sur ce
  point (RM-122), sans quoi le persona Bailleur pourrait croire à tort qu'il « coupe toutes ses
  alertes ».
- Tentative de modification hors de son propre périmètre (appel API direct sur un autre
  destinataire) → 403, comme pour toute autre entité RLS-scopée du produit.
- Canal WhatsApp choisi sans opt-in explicite valide → l'interface empêche l'enregistrement d'un
  canal préféré sans son opt-in correspondant actif (cohérent avec RM-117).

**Parcours critique ?** Oui — bloquant pour Gate 04A (premier point de contact utilisateur avec le
consentement, exigence réglementaire WhatsApp Business/RGPD, RSV-EP16-04).

---

### J2 — Consulter l'historique de mes notifications (Bailleur)

**Déclencheur** : le Bailleur veut vérifier si une notification a bien été envoyée et livrée (ex.
litige avec un locataire, doute sur un incident Twilio).

**Parcours nominal**

1. Le Bailleur ouvre l'historique de notifications depuis son dashboard.
2. Il voit la liste des notifications de tout son périmètre (K6) : type d'événement (quittance
   disponible, garantie débitée, loyer en retard…), destinataire, canal, statut de livraison
   (`PROCESSED`/`DELIVERED`/`DEAD`/…), horodatage.
3. Il peut filtrer par bien, par destinataire, par statut ou par période.
4. Il consulte le détail d'une notification (ex. pourquoi `DEAD` — absence de template approuvé,
   échec permanent) pour comprendre sans devoir contacter le support.

**Cas d'erreur / limites**

- Aucune notification encore envoyée (Twilio jamais activé, canaux désactivés par défaut K8) →
  état vide explicite (« Aucune notification externe envoyée — les canaux externes ne sont pas
  encore activés »), pas une page cassée ni une erreur.
- Notification `DEAD` sans template approuvé → l'historique doit exposer cette cause sans jargon
  technique brut, cohérent avec le constat déjà vérifié en conditions réelles au Gate Staging
  Sprint N+1 (`PAIEMENT_RECU` → `DEAD`, absence de template).
- Aucune donnée d'un autre tenant visible, y compris par manipulation d'URL/paramètre (RM-123,
  TC-127).

**Parcours critique ?** Oui — bloquant pour Gate 04A, car c'est le seul moyen pour l'utilisateur de
vérifier une livraison sans passer par une requête support ou un accès technique direct à la base.

---

### J3 — Consulter l'historique de mes notifications (Gestionnaire, périmètre restreint)

**Déclencheur** : identique à J2, mais pour un Gestionnaire.

**Parcours nominal** : identique à J2, à la différence que la liste est **filtrée côté serveur**
aux biens/baux affectés actifs du Gestionnaire (K6) — aucun filtre visuel à contourner côté client,
le filtrage est une garantie RLS/ReBAC, pas une simple préférence d'affichage.

**Cas d'erreur / limites**

- Gestionnaire révoqué depuis l'affectation → l'historique ne doit plus remonter aucune ligne liée
  au bien concerné, patron déjà appliqué aux alertes (EF-64) et à l'audit (US-62).
- Gestionnaire actif sur plusieurs bailleurs → aucune ambiguïté visuelle possible entre les tenants
  (risque spécifique identifié au persona §1.2).

**Parcours critique ?** Oui, pour les mêmes raisons que J2, avec un risque cross-tenant plus élevé
(persona multi-bailleur) à couvrir explicitement dans les maquettes et les tests (TC-127).

---

## 3. Synthèse — parcours critiques retenus pour le Gate 02A

| Parcours | Persona | Criticité | Bloquant Gate 04A ? |
|---|---|---|---|
| J1 — Gérer mes préférences | Bailleur, Gestionnaire | Élevée (consentement réglementaire) | Oui |
| J2 — Consulter l'historique (périmètre complet) | Bailleur | Élevée (preuve de livraison) | Oui |
| J3 — Consulter l'historique (périmètre restreint) | Gestionnaire | Élevée (risque cross-tenant) | Oui |

Aucun parcours secondaire (nice-to-have) n'a été identifié à ce stade pour US-125 — le périmètre
reste volontairement minimal (8 points, priorité *Should*), sans tableau de bord de notifications
avancé (statistiques, export, etc.) qui excéderait le périmètre approuvé par le PO.

---

## 4. Points ouverts avant validation

- Aucun UX/UI Design Lead désigné à ce jour pour valider formellement ce document (condition
  d'entrée du Gate 02A).
- Ce document ne couvre pas encore l'information architecture (emplacement exact dans la
  navigation existante), le design system minimal, ni les maquettes — livrables Gate 02A restants.
- `UXR-001.md` reste à renseigner à partir de ces parcours avant instruction formelle du Gate.
