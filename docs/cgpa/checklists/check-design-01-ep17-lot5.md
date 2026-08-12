# CHECK-DESIGN-01 — EP-17 Lot 5

| Champ | Valeur |
|---|---|
| Date | 2026-08-12 |
| Portée | Validation Design des preuves EP-17/US-136 à US-138 et clôture technique US-137 |
| Décision | Avis Design QA proposé — décision finale réservée au PO/CDO |

## Matrice de contrôle

| Contrôle | Preuves examinées | Résultat | Réserve / action |
|---|---|---|---|
| Vision, hiérarchie et lisibilité | `DSG-001.md` v0.3.0, inventaire composants | PASS sous réserve | Couverture visuelle limitée à la baseline T0 disponible. |
| Tokens et composants réutilisables | Inventaire : 8 composants `lt-*`/Toast, sources et specs associées | PASS | Clôture DD-611-02 soumise à décision Gate. |
| Responsive et reflow | `CHECK-RESPONSIVE-01` addendum, 20/20 TLS strict | PASS | Périmètre testé explicitement borné. |
| Accessibilité | US-136 Keycloak 6/6 ; US-137 Angular authentifié/matrice humaine | PASS sous réserve | Réserve non liée : dette de traçabilité globale DD-611-03. |
| Régression visuelle Keycloak | `RES-VR-04` probe PKCE strict 390/640, `overflowX=0` | PASS technique | Levée formelle après revue/fusion de la preuve. |
| Baseline visuelle | `baseline-post-pilote-t0-manifest.md` | CANDIDAT | Acceptation PO/CDO requise ; US-127 reste historiquement absente. |
| États d’erreur | `DD-EP17-10` | NON CLOS | Traitement séparé Lot B requis. |
| Traçabilité Story→preuve | `traceability-ui-loyertracker.md`, DD-611-03 | NON CLOS | Lot C requis ; ne pas déclarer Gate global clos. |

## Avis Design QA

Les critères design sont suffisamment instruits pour une décision **GO sous réserve documentaire** du Gate 04A Lot 5, à condition que le PO/CDO :

1. accepte la baseline post-pilote T0 comme référence future sans réécrire US-127 ;
2. accepte la levée de `RES-VR-04` après intégration de sa preuve stricte ;
3. maintienne explicitement `DD-EP17-10` et `DD-611-03` comme lots séparés avant toute clôture globale.

Cette checklist n’autorise aucun développement applicatif, Staging, Production, migration ou promotion.