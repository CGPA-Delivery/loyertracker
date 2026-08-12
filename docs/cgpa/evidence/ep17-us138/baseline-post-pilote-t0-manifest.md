# Baseline visuelle post-pilote T0 — EP-17 Lot 5

| Champ | Valeur |
|---|---|
| Date de décision | 2026-08-12 |
| Statut | Proposition de baseline T0, soumise à acceptation PO/CDO |
| Objet | Référence de comparaison future après pilote |
| Limite historique | US-127 n’a pas produit de baseline pré-pilote ; cette baseline ne reconstitue ni ne remplace rétroactivement US-127. |

## Artefacts immuables disponibles

| Écran / viewport | Fichier | SHA-256 |
|---|---|---|
| Dashboard Bailleur 390 | `dashboard-bailleur-390.png` | `b699f04aa865089bbacce877b3f40833fa5635eefcc2e91adc3f0e58a569d268` |
| Dashboard Bailleur 640 | `dashboard-bailleur-640.png` | `8f8a97073f6cd8550eb721c55b42c3d0e506210cc7a0f104578cf6639566388d` |
| Login Keycloak 390 | `keycloak-login-390.png` | `954469ff34499f4f88ad40fa573e65f8e99bfe92138e6b7a03222a62906789f7` |
| Login Keycloak 640 | `keycloak-login-640.png` | `1f82a1c8df68e166743da68da3f88dcb9c1050f2c4afee7280c1dac889e5db5a` |

## Portée et limites

- Référence applicable seulement aux écrans et viewports listés ci-dessus.
- Les captures historiques étiquetées Gestionnaire/Profil ont des hashes identiques au Dashboard Bailleur : elles ne sont pas retenues comme preuve indépendante de ces écrans.
- La correction Keycloak postérieure est suivie séparément par `RES-VR-04` et sa preuve runtime TLS stricte.
- Toute comparaison future doit conserver le viewport, l’URL finale rendue, le runtime et le hash de référence.

## Décision demandée au PO/CDO

Accepter cette baseline post-pilote T0 comme point de comparaison futur et lever `RES-BASELINE-01`, tout en conservant l’absence historique de baseline US-127 comme fait documentaire.
