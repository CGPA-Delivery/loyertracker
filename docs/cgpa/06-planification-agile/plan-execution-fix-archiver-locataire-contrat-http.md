# Plan d'Exécution — Correction contrat HTTP archiverLocataire

**Date :** 2026-08-10  
**Cadre :** CGPA v6.1.1  
**Release protégée :** `v1.17.0-rc.1` sous hypercare  
**Origine :** `analyse-endpoints-backend-sans-angular-direct-2026-08-10.md` §6 — écart de contrat détecté par agent secondaire  
**Statut :** **PROPOSÉ — en attente d'approbation PO/CDO**

---

## 1. Constat

L'agent secondaire a identifié un écart de contrat HTTP entre le Frontend Angular et le Backend Spring Boot pour l'archivage d'un Locataire :

| Couche | Méthode HTTP | Chemin | Source |
|---|---|---|---|
| **Backend** (réel) | `DELETE` | `/api/locataires/{id}` | `LocataireController.java:70-73` |
| **Frontend Angular** (actuel) | `POST` | `/api/locataires/{id}/archivage` | `s02-api.service.ts:306-308` |
| **Test Angular** (actuel) | `POST` | `/api/locataires/loc-1/archivage` | `s02-api.service.spec.ts:216-220` |

**Conséquence :** le bouton « Archiver » dans `LocataireDetailComponent` (`locataire-detail.component.ts:205-213`) émet une requête `POST /api/locataires/{id}/archivage` qui **n'existe pas** côté backend → **HTTP 404 en Production**. Le test unitaire passe uniquement parce que `HttpTestingController` ne valide pas l'existence réelle du endpoint.

**Note :** `restaurerLocataire` (ligne 310-311) est correct — le backend expose bien `POST /api/locataires/{id}/restauration` (`LocataireController.java:75-78`).

---

## 2. Périmètre

### 2.1 Inclus

| Fichier | Modification |
|---|---|
| `frontend/src/app/core/s02/s02-api.service.ts:306-308` | Remplacer `POST /api/locataires/{id}/archivage` par `DELETE /api/locataires/{id}` |
| `frontend/src/app/core/s02/s02-api.service.spec.ts:216-220` | Adapter le test : `POST` → `DELETE`, `/archivage` → rien, corps `null` → pas de corps |

### 2.2 Exclus

- Aucune modification backend
- Aucune migration Flyway
- Aucun changement Docker/infrastructure
- Aucun déploiement Staging ou Production
- Aucune modification du composant `locataire-detail.component.ts` (il appelle déjà `this.api.archiverLocataire(this.id)` — seule la méthode du service change)

---

## 3. Analyse d'impact

| Axe | Impact |
|---|---|
| **Fonctionnel** | Le bouton « Archiver » devient fonctionnel au lieu de retourner une 404 silencieuse |
| **Backend** | Aucun — le backend expose déjà `DELETE /api/locataires/{id}` et l'implémentation est correcte (`LocataireService.archiver()`, archivage logique avec audit) |
| **Frontend** | 1 ligne de code + 1 test modifiés. Aucun composant, template ou route impacté |
| **RGPD** | Aucun — l'archivage est une opération métier (pas l'effacement RGPD qui est sur `DELETE /api/locataires/{id}/effacement`) |
| **Sécurité** | Aucun changement — `@PreAuthorize("hasRole('BAILLEUR')")` + RLS inchangés |
| **Régression** | Risque nul — le endpoint `POST /api/locataires/{id}/archivage` n'a jamais fonctionné |

---

## 4. Modification précise

### 4.1 Service Angular

**Fichier :** `frontend/src/app/core/s02/s02-api.service.ts`

```diff
-  archiverLocataire(id: string): Observable<LocataireDetail> {
-    return this.http.post<LocataireDetail>(`${API_BASE_URL}/locataires/${id}/archivage`, null);
-  }
+  archiverLocataire(id: string): Observable<LocataireDetail> {
+    return this.http.delete<LocataireDetail>(`${API_BASE_URL}/locataires/${id}`);
+  }
```

### 4.2 Test unitaire

**Fichier :** `frontend/src/app/core/s02/s02-api.service.spec.ts`

```diff
   it('archiverLocataire', () => {
     service.archiverLocataire('loc-1').subscribe();
-    const req = http.expectOne('/api/locataires/loc-1/archivage');
-    expect(req.request.method).toBe('POST');
+    const req = http.expectOne('/api/locataires/loc-1');
+    expect(req.request.method).toBe('DELETE');
     req.flush({ id: 'loc-1', statut: 'ARCHIVE' });
   });
```

---

## 5. Tests

| Niveau | Commande | Attendu |
|---|---|---|
| Unitaire — S02ApiService | `npx ng test --watch=false --include='**/s02-api.service.spec.ts'` | 14/14 SUCCESS |
| Unitaire — LocataireDetailComponent | `npx ng test --watch=false --include='**/locataire-detail.component.spec.ts'` | 5/5 SUCCESS |
| Complet | `npx ng test --watch=false --browsers=ChromeHeadless` | 223/223 SUCCESS |
| Build production | `npm run build -- --configuration production` | SUCCESS |

---

## 6. Gates applicables

| Gate | Applicable ? | Justification |
|---|---|---|
| Gate 02A (UX Research) | ❌ Non | Correction de contrat HTTP, pas de nouvelle UI |
| Gate 04A (Design System) | ❌ Non | Aucun changement visuel |
| Gate 05 (Planification) | ✅ Oui | Le présent document |
| Gate 06A (CI) | ✅ Oui | CI verte obligatoire avant merge |
| Gate Staging | ❌ Non | Correction Frontend seule, pas de déploiement Staging requis |
| Gate Production | ❌ Non | Hypercare — merge sur main uniquement, déploiement sur décision PO distincte |

---

## 7. Risques

| ID | Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|---|
| RSV-ARCH-01 | Le test `locataire-detail.component.spec.ts` pourrait casser si le mock HTTP est couplé au chemin | Faible | Mineur | Le test du composant ne mock pas `archiverLocataire` directement — il utilise `HttpTestingController` et vérifie les requêtes par URL. À vérifier après correction. |

---

## 8. Checklist de validation CGPA

- [x] `docs/project-state.md` lu — phase hypercare `v1.17.0-rc.1`, aucun code/migration/déploiement non autorisé
- [x] Aucune suppression de décision, risque, réserve ou Gate historique
- [x] Modification additive : correction de contrat, pas de nouvelle fonctionnalité
- [x] Impact Staging/Production analysé — aucun déploiement
- [x] Backend non modifié — `DELETE /api/locataires/{id}` déjà existant et testé
- [x] Plan d'Exécution formalisé (ce document)
- [ ] Approbation PO/CDO requise avant tout codage
- [ ] PR dédiée depuis branche `fix/archiver-locataire-contrat-http`
- [ ] CI verte sur le head SHA de la PR
- [ ] Merge sur main après approbation humaine

---

## 9. Décision proposée

> **GO technique** pour corriger le contrat HTTP `archiverLocataire` (2 fichiers, 2 lignes modifiées).  
> **NO GO** pour tout déploiement Staging ou Production.  
> **Soumis à approbation PO/CDO** avant tout codage.

---

*Plan d'Exécution CGPA v6.1.1 — Phase 06 (Planification Agile). Prochaine étape : approbation PO/CDO → codage → PR → CI → merge.*
