# RES-VR-04 — Preuve de correction runtime Keycloak

| Champ | Valeur |
|---|---|
| Date | 2026-08-11 |
| Réserve | `RES-VR-04` — overflow horizontal Keycloak de 10px |
| Portée | Thème login `loyertracker`, uniquement CSS de `.card-pf` |
| Verdict technique local | **PASS** — `overflowX=0` aux viewports 640px et 390px |
| Décision de réserve | À confirmer après fusion et revue humaine ; cette preuve ne clôture pas les autres réserves Gate 04A |

## Cause et correctif

La règle PatternFly héritée `.card-pf { margin: 0 -10px 20px; }` étendait la carte de connexion
au-delà du viewport. Le thème enfant neutralise désormais seulement les marges horizontales de la
carte : `margin-left: 0; margin-right: 0`.

Aucun template FreeMarker, flux OIDC/PKCE, realm, secret ou JavaScript n'est modifié.

## Mesure reproductible

Commande :

```bash
node frontend/e2e/keycloak-overflow-probe.mjs
```

| Viewport | `scrollWidth` | `clientWidth` | `overflowX` | Résultat |
|---:|---:|---:|---:|---|
| 640px | 640 | 640 | 0px | PASS |
| 390px | 390 | 390 | 0px | PASS |

Artefacts versionnés :

- `docs/cgpa/evidence/ep17-reserve-overflow/keycloak-overflow-runtime-current.json`
- `docs/cgpa/evidence/ep17-reserve-overflow/keycloak-overflow-runtime-current-640.png`
- `docs/cgpa/evidence/ep17-reserve-overflow/keycloak-overflow-runtime-current-390.png`

## Limites maintenues

- `RES-BASELINE-01` reste ouverte : aucune baseline US-127 pré-pilote n'existe ; la future baseline
  doit être nommée post-pilote T0.
- `RES-DESIGN-01` reste ouverte : `CHECK-DESIGN-01` spécifique Lot 5 et décision PO/CDO sont requis.
- La levée formelle de `RES-VR-04` nécessite revue/fusion humaine de la PR, puis une vérification
  sur l'artefact livré par le flux applicable.
