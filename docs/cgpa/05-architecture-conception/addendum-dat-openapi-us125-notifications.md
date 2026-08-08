# Addendum DAT / OpenAPI — US-125 Notifications

## 1. Identification

- Projet : LoyerTracker
- Périmètre : EP-16 Sprint N+2 Lot B / US-125
- Framework : CGPA v6.1.1 Enterprise
- Réserve traitée : `RSV-MIG-611-04`
- Nature : addendum documentaire, sans nouvelle migration, sans déploiement
- Date : 2026-08-08
- Sources d'implémentation : `NotificationController`, `NotificationApiService`, `V32__us125_preferences_gestionnaire_historique_rebac.sql`, service Angular `notifications.service.ts`

## 2. Décision d'architecture

US-125 expose exclusivement des ressources du **sujet authentifié courant**. Aucun identifiant de
bailleur, gestionnaire ou destinataire n'est accepté par l'URL ou le payload pour élargir le
périmètre. L'identité est résolue depuis le JWT (`sub`) et le périmètre est appliqué côté serveur
par RLS/ReBAC.

- `BAILLEUR` : préférence et historique limités au tenant du bailleur courant.
- `GESTIONNAIRE` : préférence globale du compte courant et historique limité aux affectations
  actives, via `notifications_gestionnaire(...)` fail-closed.
- Les adresses exposées dans l'historique sont masquées.
- Les réponses 401/403 restent produites par la chaîne Spring Security et les contrôles serveur.

## 3. Contrat HTTP figé

Base URL : `/api/notifications`  
Authentification : `Authorization: Bearer <JWT>`  
Rôles : `BAILLEUR` ou `GESTIONNAIRE`.

### 3.1 Lire la préférence courante

`GET /api/notifications/preferences/current`

Réponse `200` :

```json
{
  "enabled": true,
  "phoneE164": "+243****4331",
  "preferredChannel": "WHATSAPP",
  "fallbackChannel": "SMS",
  "whatsappOptIn": true,
  "smsOptIn": true,
  "consentAt": "2026-08-08T19:49:52Z",
  "consentSource": "FORMULAIRE_LOYERTRACKER",
  "language": "fr"
}
```

Valeurs `preferredChannel` / `fallbackChannel` : `IN_APP`, `WHATSAPP`, `SMS`, `EMAIL`.
Une préférence inexistante retourne une préférence par défaut désactivée, sans donnée tierce.

### 3.2 Enregistrer la préférence courante

`PUT /api/notifications/preferences/current`

Requête :

```json
{
  "phoneE164": "+243812345678",
  "preferredChannel": "WHATSAPP",
  "fallbackChannel": "SMS",
  "whatsappOptIn": true,
  "smsOptIn": true,
  "consentSource": "FORMULAIRE_LOYERTRACKER",
  "language": "fr"
}
```

Réponse : `200` avec le schéma `PreferenceResponse` ci-dessus.

Règles :

- `phoneE164` doit respecter le format international E.164 côté service métier ;
- le canal préféré externe exige l'opt-in correspondant ;
- l'écriture est idempotente pour le sujet authentifié ;
- aucune adresse ou préférence d'un autre sujet n'est acceptée depuis le client.

### 3.3 Désinscription

`POST /api/notifications/preferences/current/unsubscribe`

Requête : `{}`

Réponse : `200` avec `enabled: false`. L'historique est conservé et les alertes in-app restent
actives.

### 3.4 Historique

`GET /api/notifications/history`

Réponse `200` :

```json
[
  {
    "id": "00000000-0000-0000-0000-000000000001",
    "dateCreation": "2026-08-08T19:49:52Z",
    "notificationType": "LOYER_EN_RETARD",
    "channel": "SMS",
    "recipientAddressMasked": "+243******78",
    "statut": "SENT",
    "motif": null
  }
]
```

Aucune adresse complète, aucun identifiant de tenant et aucune donnée hors périmètre ne sont
sérialisés.

## 4. Matrice de sécurité et preuves

| Contrôle | Implémentation | Preuve attendue / disponible |
|---|---|---|
| JWT obligatoire | Spring Security resource server | `SecurityConfig`, tests 401 |
| Rôles autorisés | `@PreAuthorize` sur les quatre opérations | tests BAILLEUR/GESTIONNAIRE/403 |
| Sujet courant | résolution JWT `sub` côté service | `NotificationApiService` |
| Isolation Bailleur | `TenantContext` + RLS | tests cross-tenant |
| Périmètre Gestionnaire | ReBAC et `notifications_gestionnaire(...)` fail-closed | V32 + tests d'intégration |
| Masquage PII | `masquer(...)` et valeur masquée Gestionnaire | contrat `HistoriqueItem` |
| Migration | V32 additive déjà intégrée | `FLYWAY_EXPECTED_REPO=32`, Production reste 31 |

## 5. Compatibilité et limites

Cet addendum complète le DAT historique de manière additive. Il ne rejoue aucun Gate historique,
ne modifie pas les contrats antérieurs et ne crée aucune nouvelle autorisation d'environnement.

Sont exclus :

- Staging et Production ;
- nouvelle migration Flyway ;
- secrets et providers ;
- activation de canaux externes ;
- EP-19 ;
- rétroactivité sur les releases déjà clôturées.

## 6. Décision de réserve

Sur la base du contrat ci-dessus et de l'intégration Backend déjà fusionnée par PR #389, la réserve
`RSV-MIG-611-04` est proposée à la **levée documentaire**, sous réserve de la validation humaine
Enterprise Architect / CDO et de la vérification CI de cette PR.

La levée n'autorise pas à elle seule la promotion Staging : les preuves a11y, responsive,
sécurité d'intégration et `STG-ISOL-01` restent obligatoires.
