# Plan d'Exécution — Lot 3 : Traçabilité, UXR et Modal (DD-611-03, DD-611-01, DD-EP17-05)

| Champ | Valeur |
|---|---|
| Date | 2026-08-12 |
| Auteur | CDO / Enterprise Architect |
| Dettes | DD-611-03 (traçabilité Story-écran-composant-test), DD-611-01 (UXR-001 non renseigné), DD-EP17-05 (focus-trap modal) |
| Criticité | P1 |
| Statut | **Plan proposé — en attente de validation PO/CDO** |

---

## 1. Contexte

### DD-611-03 — Traçabilité Story-écran-composant-test incomplète

La matrice de traçabilité est approuvée mais les preuves de test automatisées sont inexistantes. Le constat : on sait quels composants couvrent quels écrans, mais on ne peut pas prouver que chaque écran est testé.

### DD-611-01 — UXR-001 non renseigné

Le document `UXR-001` existe et est préparé, mais aucune revue UX/UI humaine finale n'a été réalisée. Bloquant uniquement si le prochain lot UI démarre sans recherche validée.

### DD-EP17-05 — Focus-trap modal sans précédent

5 des 6 exigences `DDS-LT-005` sont couvertes (focus-trap, restitution du focus, Échap, rôle ARIA, libellés). L'exigence 6 (message post-action) est couverte structurellement par `lt-toast` mais non câblée à un appelant réel. Aucun dialogue modal n'est encore en Production.

---

## 2. Solution proposée

### 2.1 DD-611-03 — Génération automatisée des preuves de test

**Approche** : script de génération de rapport qui croise la matrice de traçabilité existante avec les résultats `ng test` et Playwright.

| Étape | Action | Outil |
|---|---|---|
| 1 | Extraire la matrice (Story → écran → composant) | Script Node.js lisant la matrice |
| 2 | Croiser avec `ng test` (tests unitaires par composant) | Parsing du rapport Karma/Jasmine |
| 3 | Croiser avec Playwright (tests E2E par écran) | Parsing du rapport Playwright |
| 4 | Générer un rapport de couverture par Story | Markdown + JSON |
| 5 | Identifier les trous (Story sans test) | Tableau des gaps |

**Livrable** : `docs/cgpa/design/traceability-coverage-report.md` + script `infra/scripts/generate-traceability-report.sh`.

### 2.2 DD-611-01 — Revue UX/UI de UXR-001

**Approche** : revue légère, pas une refonte.

| Étape | Action |
|---|---|
| 1 | Désigner un reviewer (UX/UI Design Lead ou avis agent documenté) |
| 2 | Revue des personas, parcours, hypothèses |
| 3 | Ajouter un avis daté + rattachement au prochain lot UI |
| 4 | Si aucun lot UI à venir, exemption PO/CDO documentée |

**Livrable** : `UXR-001` mis à jour avec avis daté.

### 2.3 DD-EP17-05 — Finalisation du modal

**Approche** : câbler `lt-toast` au premier appelant réel de `lt-confirm-dialog`.

| Étape | Action |
|---|---|
| 1 | Identifier le premier écran métier utilisant `lt-confirm-dialog` (Lot 3+) |
| 2 | Câbler `lt-toast` en message post-action (exigence 6) |
| 3 | Test d'accessibilité complet (6/6) en navigateur réel |
| 4 | Mettre à jour `CHECK-ACCESSIBILITY-01` |

**Livrable** : `CHECK-ACCESSIBILITY-01` mis à jour avec 6/6 PASS.

---

## 3. Tâches

| # | Tâche | Effort |
|---|---|---|
| 1 | Script de génération du rapport de traçabilité | 0,5 j |
| 2 | Exécution + rapport initial + identification des gaps | 0,3 j |
| 3 | Revue UX/UI de UXR-001 (ou exemption documentée) | 0,3 j |
| 4 | Câblage `lt-toast` au premier appelant modal | 0,3 j |
| 5 | Test accessibilité 6/6 + mise à jour CHECK-ACCESSIBILITY-01 | 0,3 j |
| 6 | Mise à jour Design Debt Register + project-state.md | 0,2 j |

**Total estimé** : 2-3 jours.

---

## 4. Décision

**GO proposé** — sous réserve de validation PO/CDO.
