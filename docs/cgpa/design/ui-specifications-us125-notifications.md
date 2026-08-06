# UI Specifications — US-125 Préférences et historique notifications

| Champ | Valeur |
|---|---|
| Périmètre | EP-16 Sprint N+2 Lot B — US-125 |
| Date | 2026-08-06T06:40:53Z |
| Nature | Spécifications UI documentaires Gate 04A — aucun code |
| Sources | `phase-02-user-journeys.md`, `phase-02-information-architecture.md`, `phase-02-ui-mockups.md`, `DSG-001.md`, `DDS-LT-002→005` |
| Verdict d'exploitabilité | **PASS documentaire** — exploitable pour développement Frontend après décision Gate 04A |

## 1. Écrans couverts

### 1.1 Préférences de notification — Bailleur

- Emplacement : extension de `/bailleur/profil`, section « Préférences de notification » après les informations d'identité/adresse existantes.
- Composant cible : `NotificationsPreferencesComponent` réutilisable, intégré à `ProfilComponent`.
- Champs visibles :
  - numéro téléphone au format E.164 ;
  - canal préféré : WhatsApp ou SMS ;
  - canal de secours : SMS uniquement si opt-in SMS actif ;
  - opt-in WhatsApp ;
  - opt-in SMS ;
  - statut `enabled` via action de désinscription.
- Messages obligatoires :
  - état initial : « Vous ne recevez aujourd'hui que les alertes dans l'application. » ;
  - succès : confirmation `role="status" aria-live="polite"` ;
  - erreur numéro : message bloquant sous le champ ;
  - désinscription : préciser que les alertes in-app restent actives.

### 1.2 Préférences de notification — Gestionnaire

- Décision applicable : `DDS-LT-002` acceptée — **Option B**, section embarquée dans `GestionnaireDashboardComponent`, sans nouvelle route `/gestionnaire/profil` pour cette itération.
- Même composant cible que Bailleur, mais intégré au dashboard Gestionnaire.
- Repère de périmètre obligatoire : libellé expliquant que les préférences portent sur l'utilisateur Gestionnaire connecté, pas sur un Bailleur tiers.

### 1.3 Historique des notifications — Bailleur

- Emplacement : section transverse du `BailleurDashboardComponent`, proche des sections Alertes/Audit.
- Composant cible : `NotificationsHistoriqueComponent` réutilisable.
- Données affichées par ligne : date/heure, type événement, destinataire masqué, canal, statut lisible, motif synthétique si échec.
- Ordre : plus récent d'abord.
- Filtre/pagination : **absents en première itération** selon `DDS-LT-003` acceptée ; réévaluation uniquement sur volume réel post-activation.

### 1.4 Historique des notifications — Gestionnaire

- Emplacement : section transverse du `GestionnaireDashboardComponent`, après les alertes.
- Périmètre : données filtrées côté serveur/RLS/ReBAC ; l'UI ne doit jamais simuler le périmètre par simple filtre client.
- Repère visible : « limité à vos biens affectés » ou équivalent.

## 2. États obligatoires

| État | Préférences | Historique |
|---|---|---|
| Chargement | texte court `Chargement…` ou squelette léger, sans spinner bloquant | idem |
| Vide | aucune préférence définie ; CTA d'enregistrement inactif tant qu'aucun opt-in n'est choisi | « Aucune notification externe envoyée » |
| Erreur validation | message champ, `aria-describedby`, blocage soumission | n/a |
| Erreur serveur | message global non technique, pas de secret/provider detail | message global non technique |
| Succès | `role="status"`, confirmation explicite de l'effet | rafraîchissement + compteur visible |
| Désinscription | modal de confirmation `DDS-LT-005` | n/a |

## 3. Mapping statuts d'historique

Décision applicable : `DDS-LT-004` acceptée.

| Source technique | Libellé UI | Rôle DSG |
|---|---|---|
| `PENDING`, `RETRY` | En attente d'envoi | info |
| `PROCESSING` | Envoi en cours | info |
| `DEAD` | Non envoyé — motif lisible | danger |
| `QUEUED`, `ACCEPTED`, `SENT` | Envoyé, en cours de livraison | info |
| `DELIVERED` | Livré | success |
| `READ` | Lu | success |
| `FAILED`, `UNDELIVERED`, `CANCELLED` | Échec de livraison | danger |

## 4. Contraintes UI non négociables

- Aucun secret, SID Twilio, provider response brut ou PII non nécessaire dans l'interface.
- Numéro affiché masqué dans l'historique (`+243****4331`), complet uniquement dans le formulaire de l'utilisateur connecté.
- Aucun wording ne doit laisser croire que les alertes in-app sont désactivées par `enabled=false` externe.
- Aucun lien ou activation Twilio/SMS/WhatsApp n'est autorisé par ces specs.
- Tout développement devra rester sur branche dédiée et conserver les garde-fous `NOTIFICATIONS_EXTERNAL_ENABLED`/kill-switch existants.

## 5. Verdict

**PASS documentaire Gate 04A** : les écrans, états, mapping, contraintes d'accessibilité et limites de sécurité sont suffisamment spécifiés pour autoriser une décision Gate 04A **GO sous réserve**.
