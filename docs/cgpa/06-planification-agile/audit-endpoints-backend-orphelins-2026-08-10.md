# Audit endpoints orphelins — post-EP-15

**Date :** 2026-08-10  
**Cadre :** CGPA v6.1.1  
**Release protégée :** `v1.17.0-rc.1` sous hypercare  
**Mode :** audit statique lecture seule  
**Référence amont :** `audit-backend-frontend-api-2026-08-09.md` (75 endpoints Backend, 44 usages Angular, 27 non trouvés)

## 1. Évolution post-EP-15

L'EP-15 Frontend (PR #423 + #424, mergées le 2026-08-10) a ajouté les services Angular suivants :

| Service | Endpoints couverts | Nombre |
|---|---|---|
| `GestionnaireApiService` | rechercher, verificationDoublon, consulter, modifierProfil, suspendre, reactiver, archiver, restaurer, historique | 9 |
| `S02ApiService` (extension Locataire) | verificationDoublonLocataire, consulterLocataire, modifierLocataire, archiverLocataire, restaurerLocataire, historiqueLocataire | 6 |
| `QuittanceApiService` | annuler | 1 |
| `InvitationApiService` | inviter, accepter | 2 |
| **Total EP-15** | | **18** |

L'US-125 (notifications) a également ajouté 3 endpoints Angular (`NotificationApiService`) :
- `GET /api/notifications/preferences/current`
- `PUT /api/notifications/preferences/current`
- `POST /api/notifications/preferences/current/unsubscribe`
- `GET /api/notifications/history`

## 2. Nouveau décompte

| Contrôle | Avant EP-15 | Après EP-15 |
|---|---|---|
| Endpoints Backend (non-Actuator) | 71 | 71 |
| Usages API Angular uniques | 44 | **64** |
| Endpoints Backend non trouvés dans Angular | 27 | **~9** |

## 3. Surfaces Backend toujours sans couverture Angular directe

Les surfaces suivantes restent sans appel Angular direct, pour des raisons légitimes :

| Surface | Justification |
|---|---|
| `POST /api/batch/notifications` | Exploitation/tests uniquement |
| `POST /api/public/notifications/callback` (Twilio) | Callback fournisseur — non-UI |
| `POST /api/public/resend/callback` (Resend/Svix) | Callback fournisseur — non-UI |
| `GET /api/bailleurs/export` (RGPD) | Contrat conformité — pas d'UI standard |
| `DELETE /api/locataires/{id}/effacement` (RGPD) | Contrat conformité — pas d'UI standard |
| `DELETE /api/locataires/{id}` (suppression) | Backend uniquement — `archivage` utilisé côté UI |
| Actuator (`/actuator/health`, `/actuator/info`, `/actuator/prometheus`) | Contrat Ops |

**Aucun endpoint n'est déclaré orphelin, legacy ou supprimable.**

## 4. Endpoints précédemment listés « non trouvés » désormais couverts

| Surface | Avant EP-15 | Après EP-15 |
|---|---|---|
| Cycle Gestionnaire (9 endpoints) | ❌ Non trouvé | ✅ `GestionnaireApiService` |
| Cycle Locataire avancé (6 endpoints) | ❌ Non trouvé | ✅ `S02ApiService` (extension) |
| Annulation quittance | ❌ Non trouvé | ✅ `QuittanceApiService` |
| Invitations (émettre + accepter) | ❌ Non trouvé | ✅ `InvitationApiService` |
| Clôture/réouverture bail | Listé « non trouvé » | ✅ Déjà dans `S02ApiService` avant EP-15 |
| Création/suppression Patrimoine | Listé « non trouvé » | ✅ Déjà dans `S02ApiService` avant EP-15 |

> **Note :** Les endpoints clôture/réouverture bail et création/suppression patrimoine étaient déjà présents dans `S02ApiService` avant EP-15 (lignes 236-248 et 204-210). L'audit du 2026-08-09 les avait classés « non trouvés » — probablement un faux négatif de l'outil de recherche utilisé. Ils sont confirmés couverts.

## 5. Règle des neuf contrôles (inchangée)

La règle normative de `audit-backend-frontend-api-2026-08-09.md` §3 reste en vigueur : toute suppression future d'un endpoint exige les neuf contrôles documentés et une décision PO/CDO tracée.

## 6. Limite de preuve (inchangée)

Audit statique uniquement. Pas d'interrogation des logs runtime Production ni des métriques de trafic.
