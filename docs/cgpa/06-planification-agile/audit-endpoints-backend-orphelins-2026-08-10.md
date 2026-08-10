# Audit des endpoints backend sans appel Angular direct
## LoyerTracker — PR#422 post-merge — 2026-08-10

**Méthodologie :** Extraction exhaustive des 70 endpoints backend (24 contrôleurs Spring) et des 46 appels HTTP Angular (hors `.spec.ts`), normalisation des chemins avec variables uniformisées `{var}`, comparaison.

**Résultat : 25 endpoints backend sans appel Angular direct identifié.**

---

## Tableau d'analyse

| # | Endpoint | Contrôleur | Statut | Recommandation |
|---|---|---|---|---|
| 1 | `GET /api/bailleurs/export` | RgpdController | **Conserver** | Export RGPD (obligation légale). Intégration UI optionnelle (backlog). |
| 2 | `POST /api/batch/notifications` | BatchController | **Conserver** | Déclenchement manuel batch. UI admin optionnelle (backlog). |
| 3 | `GET /api/biens/{id}/paiements/{p}/avis-echeance` | DocumentController | ✅ **Déjà intégré** | Appelé via `S03ApiService.telechargerAvisEcheance()` → `telechargerDocument(bienId, periode, 'avis-echeance')`. |
| 4 | `GET /api/biens/{id}/paiements/{p}/quittance` | DocumentController | ✅ **Déjà intégré** | Appelé via `S03ApiService.telechargerQuittance()` → `telechargerDocument(bienId, periode, 'quittance')`. |
| 5 | `GET /api/gestionnaires` | GestionnaireController | 🔴 **À intégrer** | Liste des gestionnaires. Aucun composant Angular. EP-15 backlog. |
| 6 | `GET /api/gestionnaires/verification-doublon` | GestionnaireController | 🔴 **À intégrer** | Détection doublons. EP-15 backlog. |
| 7 | `GET /api/gestionnaires/{id}` | GestionnaireController | 🔴 **À intégrer** | Détail gestionnaire. EP-15 backlog. |
| 8 | `PUT /api/gestionnaires/{id}` | GestionnaireController | 🔴 **À intégrer** | Modification profil. EP-15 backlog. |
| 9 | `POST /api/gestionnaires/{id}/archivage` | GestionnaireController | 🔴 **À intégrer** | Archivage. EP-15 backlog. |
| 10 | `GET /api/gestionnaires/{id}/historique` | GestionnaireController | 🔴 **À intégrer** | Historique. EP-15 backlog. |
| 11 | `POST /api/gestionnaires/{id}/reactivation` | GestionnaireController | 🔴 **À intégrer** | Réactivation. EP-15 backlog. |
| 12 | `POST /api/gestionnaires/{id}/restauration` | GestionnaireController | 🔴 **À intégrer** | Restauration. EP-15 backlog. |
| 13 | `POST /api/gestionnaires/{id}/suspension` | GestionnaireController | 🔴 **À intégrer** | Suspension. EP-15 backlog. |
| 14 | `POST /api/invitations` | InvitationController | 🔴 **À intégrer** | Émission invitation. UI bailleur nécessaire (backlog). |
| 15 | `POST /api/invitations/{token}/acceptation` | InvitationController | **Conserver** | Flux email (non authentifié). Pas d'UI Angular. |
| 16 | `GET /api/locataires/verification-doublon` | LocataireController | 🟡 **À intégrer** | Détection doublons. Backlog locataires. |
| 17 | `GET /api/locataires/{id}` | LocataireController | 🟡 **À intégrer** | Détail locataire. Backlog. |
| 18 | `PUT /api/locataires/{id}` | LocataireController | 🟡 **À intégrer** | Modification locataire. Backlog. |
| 19 | `DELETE /api/locataires/{id}` | LocataireController | 🟡 **À intégrer** | Archivage locataire. Backlog. |
| 20 | `DELETE /api/locataires/{id}/effacement` | RgpdController | **Conserver** | Anonymisation RGPD (obligation légale). UI optionnelle. |
| 21 | `GET /api/locataires/{id}/historique` | LocataireController | 🟡 **À intégrer** | Historique locataire. Backlog. |
| 22 | `POST /api/locataires/{id}/restauration` | LocataireController | 🟡 **À intégrer** | Restauration. Backlog. |
| 23 | `POST /api/public/notifications` | ResendCallbackController | **Conserver** | Webhook Resend (infrastructure). Appelé par Resend, pas par Angular. |
| 24 | `GET /api/public/receipts/{id}/download` | PublicQuittanceController | ✅ **Déjà intégré** | Appelé via `VerifyReceiptService.urlTelechargement()` (href, pas http.get). |
| 25 | `POST /api/quittances/{id}/annulation` | QuittanceController | 🟡 **À intégrer** | Annulation quittance. Backlog. |

---

## Synthèse

| Catégorie | Nombre | Endpoints |
|---|---|---|
| ✅ **Déjà intégrés indirectement** | 3 | #3, #4, #24 |
| 🔒 **Conserver (infra/legal, pas d'UI)** | 4 | #1, #2, #15, #23 |
| 🔴 **Gestionnaires — à intégrer (EP-15)** | 9 | #5→#13 |
| 🟡 **Locataires — à intégrer (backlog)** | 7 | #16→#19, #21, #22 |
| 🟡 **Quittance — à intégrer (backlog)** | 1 | #25 |
| 🟡 **Invitations — à intégrer (backlog)** | 1 | #14 |

---

## Recommandations

### 1. Aucune suppression immédiate
Les 25 endpoints sont tous légitimes et couvrent des fonctionnalités documentées (EP-15 Gestionnaires, EP-14 Quittances, RGPD, US-70, US-123). **Aucun endpoint n'est orphelin par obsolescence.**

### 2. Priorité d'intégration Angular
- **Priorité HAUTE** : Module Gestionnaires (9 endpoints) — EP-15 déjà spécifié, backend complet, UI absente
- **Priorité MOYENNE** : Module Locataires (7 endpoints) — CRUD partiellement intégré (liste/création OK), manque détail/modification/archivage/historique
- **Priorité BASSE** : Quittance (1 endpoint), Invitations (1 endpoint), Export RGPD (1 endpoint)

### 3. Endpoints infrastructure
`POST /api/public/notifications` (Resend callback) et `POST /api/invitations/{token}/acceptation` (flux email) sont des endpoints système appelés par des services externes, pas par l'UI. Ils doivent rester tels quels.

### 4. Faux orphelins (déjà intégrés)
Les endpoints `avis-echeance`, `quittance` et `download` sont déjà appelés par Angular via des patterns indirects (template variable `{document}`, `href` au lieu de `http.get`). Notre normalisation les a classés orphelins à tort — ils sont fonctionnellement couverts.

---

**Conclusion :** Les 25 endpoints sont tous légitimes. 3 sont déjà intégrés indirectement, 4 sont infrastructure/légal, et 18 attendent leur UI Angular dans les sprints à venir (EP-15 Gestionnaires + backlog Locataires/Quittances). **Aucune suppression recommandée.** Le cahier des charges existant (EP-15, ADR-16) couvre déjà la plupart de ces endpoints ; l'effort restant est purement Frontend.
