# CHECK-FRONTEND-01 — Architecture Frontend US-125

| Champ | Valeur |
|---|---|
| Périmètre | US-125 — interface préférences et historique notifications |
| Date | 2026-08-06T06:40:53Z |
| Type | Architecture documentaire pré-développement |
| Verdict | **PASS sous réserve non bloquante** |

## 1. Architecture cible

- `NotificationsPreferencesComponent` standalone, réutilisable Bailleur/Gestionnaire.
- `NotificationsHistoriqueComponent` standalone, réutilisable Bailleur/Gestionnaire.
- Intégration Bailleur : extension de `ProfilComponent` pour préférences ; section dashboard pour historique.
- Intégration Gestionnaire : section dashboard pour préférences et historique selon `DDS-LT-002`.
- Service Angular dédié attendu : façade API notifications, sans logique de sécurité côté client autre que l'affichage ; périmètre réel garanti par backend/RLS/ReBAC.

## 2. Contrôles

| Contrôle | Résultat | Réserve |
|---|---|---|
| Réutilisation composants/patrons existants | PASS | — |
| Pas de nouveau niveau de navigation | PASS | — |
| Pas de dépendance PrimeNG nouvelle imposée par US-125 | PASS documentaire | Toute dépendance nouvelle nécessitera justification |
| Sécurité périmètre côté serveur | PASS de cadrage | Tests backend/API à instruire seulement lors du développement, pas dans cette PR doc |
| Gestion état chargement/erreur/succès | PASS documentaire | À prouver par tests Frontend lors implémentation |
| Modal de désinscription | PASS documentaire | À prouver en a11y réelle |
| No secret/no provider activation | PASS | Interdiction maintenue |

## 3. Frontières interdites

Ce contrôle n'autorise aucun backend, aucune migration Flyway, aucune activation Twilio/SMS/WhatsApp, aucun Staging, aucune Production et aucun EP-19.
