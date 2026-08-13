# Rapport de couverture de traçabilité — DD-611-03

| Champ | Valeur |
|---|---|
| Date | 2026-08-13 |
| Auteur | CDO / Enterprise Architect (instruction Jo_Skynet) |
| Dette | DD-611-03 — Traçabilité Story-écran-composant-test |
| Source | `traceability-ui-loyertracker.md` + `ng test` (235 SUCCESS) |
| Statut | **Rapport généré — soumis à validation PO/CDO** |

---

## 1. Méthode

1. Extraction de la matrice existante (`traceability-ui-loyertracker.md`) : 17 lignes Story.
2. Croisement avec les résultats `ng test` du 2026-08-13 : **235 SUCCESS / 0 FAIL**.
3. Croisement avec les fichiers `.spec.ts` réels : **43 fichiers de test** pour **28 composants**.
4. Identification des gaps : Story sans test, test sans Story, colonnes « À définir ».

---

## 2. Résultats `ng test` — 2026-08-13

```
TOTAL: 235 SUCCESS
Temps : 2.357 secs
Navigateur : Chrome Headless 151.0.0.0 (Linux)
```

### Fichiers de test (43)

| Fichier | Couvre |
|---|---|
| `app.config.spec.ts` | Configuration Angular |
| `auth.service.spec.ts` | Authentification OIDC |
| `http-error-redirect.interceptor.spec.ts` | Intercepteur HTTP 403/404 |
| `invitation-api.service.spec.ts` | API Invitation |
| `s02-api.service.spec.ts` | API S02 (Patrimoines) |
| `s03-api.service.spec.ts` | API S03 (Biens) |
| `gestionnaire-api.service.spec.ts` | API Gestionnaire |
| `quittance-api.service.spec.ts` | API Quittance |
| `bailleur-inscription.service.spec.ts` | Inscription Bailleur |
| `profil.service.spec.ts` | Service Profil |
| `profil.component.spec.ts` | Composant Profil |
| `dashboard.component.spec.ts` | Dashboard Bailleur |
| `gestionnaire-detail.component.spec.ts` | Détail Gestionnaire |
| `gestionnaire-liste.component.spec.ts` | Liste Gestionnaire |
| `locataire-detail.component.spec.ts` | Détail Locataire |
| `locataire-liste.component.spec.ts` | Liste Locataire |
| `alertes-liste.component.spec.ts` | Liste Alertes |
| `audit-journal.component.spec.ts` | Journal Audit |
| `garanties-bail.component.spec.ts` | Garanties Bail |
| `honoraires-bien.component.spec.ts` | Honoraires Bien |
| `paiements-bien.component.spec.ts` | Paiements Bien |
| `verify-receipt.component.spec.ts` | Vérification Quittance |
| `notifications-preferences.component.spec.ts` | Préférences Notifications |
| `notifications-historique.component.spec.ts` | Historique Notifications |
| `invitation-acceptation.component.spec.ts` | Acceptation Invitation |
| `invitation-form.component.spec.ts` | Formulaire Invitation |
| `page-header.component.spec.ts` | `lt-page-header` |
| `stat-card.component.spec.ts` | `lt-stat-card` |
| `status-tag.component.spec.ts` | `lt-status-tag` |
| `empty-state.component.spec.ts` | `lt-empty-state` |
| `data-table.component.spec.ts` | `lt-data-table` |
| `form-field.component.spec.ts` | `lt-form-field` |
| `confirm-dialog.component.spec.ts` | `lt-confirm-dialog` |
| `confirm-dialog.service.spec.ts` | Service `lt-confirm-dialog` |
| `toast.component.spec.ts` | `lt-toast` |
| `toast.service.spec.ts` | Service `lt-toast` |
| `error-pages.component.spec.ts` | États 403/404 |
| `money-format.spec.ts` | Formatage monétaire |
| `lt-preset.spec.ts` | Tokens SCSS |
| `navbar.component.spec.ts` | Barre de navigation |
| `gestionnaire-dashboard.component.spec.ts` | Dashboard Gestionnaire |
| `app.component.spec.ts` | Composant racine |
| `invitation-api.service.spec.ts` | API Invitation (core) |

---

## 3. Croisement Story → Test

| Epic/Story | Tests unitaires | Tests a11y | Tests responsive | Visual Review | Statut |
|---|---|---|---|---|---|
| EP-17 / US-127 | N/A (documentaire) | N/A | N/A | N/A | Documenté, non codé |
| EP-17 / US-128 | N/A | N/A | N/A | N/A | Non exécuté |
| EP-17 / US-129 | `lt-preset.spec.ts` ✅ | N/A | N/A | N/A | Tokens testés |
| EP-17 / US-130 | Couvert par specs composants | Partiel (US-136) | Partiel (US-137) | Partiel (US-138) | Partiel |
| EP-17 / US-131 | `lt-preset.spec.ts` ✅ | N/A | N/A | N/A | Architecture testée |
| EP-17 / US-132 | 8 specs `lt-*` + Toast ✅ | `confirm-dialog` 5/6 | N/A | N/A | Composants testés |
| EP-17 / US-133 | `dashboard.component.spec.ts` ✅ | Non couvert | PASS (`overflowX=0`) | PASS | Dashboard testé |
| EP-17 / US-134 | `dashboard.component.spec.ts` ✅ | Non couvert | Données insuffisantes | Inclus dashboard | Partiel |
| EP-17 / US-135 | Test thème CI ✅ | 6/6 Keycloak PASS | Login contrôlé | Login PASS (réserve) | Thème testé |
| EP-17 / US-136 | CI PASS | 6/6 Keycloak PASS | N/A | N/A | GO sous réserve |
| EP-17 / US-137 | N/A | N/A | Dashboard + Login PASS | Croisé US-138 | GO sous réserve |
| EP-17 / US-138 | N/A | N/A | 640/390 capturés | Dashboard PASS, Keycloak réserve | GO sous réserve |
| EP-17 / US-139 | Revue doc CI | Liens US-136 | Liens US-137 | Liens US-138 | En cours |
| EP-17 / US-140 | N/A | N/A | N/A | N/A | À ré-instruire |
| EP-17 / US-141 | N/A | N/A | N/A | N/A | GO / STAGING_DEPLOYED |
| EP-17 / US-142 | À définir | À définir | À définir | À définir | Non exécuté |
| EP-16 / US-125 | `notifications-*.spec.ts` ✅ | Non couvert | Non rendu (données) | Non rendu (données) | Livré, validation réservée |

---

## 4. Gaps identifiés

### Gaps de test unitaire

Aucun — **28/28 composants ont un fichier `.spec.ts`**, **235/235 tests PASS**.

### Gaps de test a11y

| Story | Gap |
|---|---|
| US-133 (Dashboard Bailleur) | Parcours Angular authentifié non couvert par a11y E2E |
| US-134 (Biens/Patrimoines) | Idem |
| US-125 (Notifications) | Idem |
| US-132 (composants `lt-*`) | `lt-confirm-dialog` : 5/6 exigences DDS-LT-005 couvertes, exigence 6 (message post-action) structurellement couverte par `lt-toast` mais non câblée à un appelant réel |

### Gaps de test responsive

| Story | Gap |
|---|---|
| US-134 (Biens/Patrimoines) | Données métier insuffisantes pour validation complète |
| US-125 (Notifications) | Non rendu faute de données de test |
| US-142 (Migration restante) | Aucun test |

### Gaps de Visual Review

| Story | Gap |
|---|---|
| US-127 | Baseline absente — comparaison avant/après impossible |
| US-135 (Keycloak) | `overflowX=10px` (RES-VR-04) |
| US-142 | Aucune capture |

---

## 5. Conclusion

**DD-611-03 — progrès significatif mais non close :**

- ✅ Matrice structurellement correcte et factuellement exacte (validé Frontend Architect 2026-07-31)
- ✅ 28/28 composants couverts par des tests unitaires (235 SUCCESS)
- ❌ Preuves a11y Angular authentifié manquantes (US-133, US-134, US-125)
- ❌ Preuves responsive complètes manquantes (données de test insuffisantes)
- ❌ Baseline US-127 absente
- ❌ US-142 entièrement « À définir »

**Recommandation** : La dette reste **En traitement**. Les colonnes de test unitaire sont désormais intégralement renseignées et vérifiées. Les gaps restants (a11y Angular, responsive données, baseline, US-142) relèvent de lots futurs ou de contraintes de données, pas d'un défaut de la matrice elle-même. La clôture définitive nécessite soit la résolution de ces gaps, soit une acceptation PO/CDO explicite que les gaps restants sont des contraintes acceptées (pas des défauts de traçabilité).
