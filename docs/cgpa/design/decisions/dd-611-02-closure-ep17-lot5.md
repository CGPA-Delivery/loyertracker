# Levée bornée DD-611-02 — EP-17 Lot 5

| Champ | Valeur |
|---|---|
| Date | 2026-08-12 |
| Décision | Levée documentaire bornée de `DD-611-02` |
| Auteur | CDO / Enterprise Architect (consolidation des avis indépendants Design Architect, Frontend Architect, Governance Officer) |
| Validation | PO/CDO — Jordan Tshilombo Kabamba |

## Contexte

`DD-611-02` est enregistrée dans le *Design Debt Register* comme dette **Majeure** :

> « DDS-001/DSG-001 et inventaire composants non instanciés »  
> — `docs/cgpa/design/design-debt-register-loyertracker.md`, ligne 6.

Elle a été partiellement traitée par :
- validation Design Architect du 2026-07-31 (contenu `DSG-001.md` vérifié, une inexactitude corrigée, `DD-EP17-09` créée) ;
- acceptation PO du même jour (levée du sous-bloqueur Gate 04A « non validé humainement ») ;
- mais **non close** car le Validation Framework CGPA v6.1.1 §5 exige une preuve d’implémentation, et le CODE INTERDIT en vigueur interdisait tout codage `lt-*` à cette date.

## Preuves exactes examinées

| Preuve | Fichier / artefact | Résultat |
|---|---|---|
| Design System Guide | `docs/cgpa/design/DSG-001.md` v0.3.0 | ✅ PASS — 34 tokens, 8 composants transverses, 4 layouts, responsive/a11y rules |
| Inventaire composants | `docs/cgpa/design/component-inventory-loyertracker.md` | ✅ PASS — 26 composants Angular réellement présents (18 applicatifs, 8 transverses `lt-*` + Toast) |
| Sources transverses | `frontend/src/app/shared/components/lt-*` + `lt-toast` | ✅ 8 composants existent réellement dans les sources |
| Tests ciblés | `frontend/src/app/shared/components/lt-*/*.spec.ts` | ✅ **75 SUCCESS** — présence, binding, events, accessibilité, responsive |
| Design QA Lot 5 | `docs/cgpa/checklists/check-design-01-ep17-lot5.md` | ✅ PASS sous réserve — tokens et composants réutilisables validés |
| Preuve TLS Keycloak | `RES-VR-04` (`a59f031`) | ✅ PASS technique — probe PKCE strict 390/640, `overflowX=0` |
| Baseline visuelle | `docs/cgpa/evidence/ep17-us138/baseline-post-pilote-t0-manifest.md` | ✅ Candidate — acceptation PO/CDO requise, US-127 historiquement absente conservée |
| Avis indépendant Design Architect | Revue `DD-611-02` (2026-08-12) | ✅ Recommande levée bornée |
| Avis indépendant Frontend Architect | Revue `DD-611-02` (2026-08-12) | ✅ PASS avec réserve — source/tests OK, documentation à corriger |
| Avis indépendant Governance Officer | Revue `DD-611-02` (2026-08-12) | ✅ Formulation additive conforme CGPA |

## Décision

`DD-611-02` est levée **uniquement comme dette documentaire** portant sur :

- `DSG-001.md` (Design System Guide) ;
- `DDS-001.md` et registre des décisions design ;
- `component-inventory-loyertracker.md` (inventaire à 26 composants) ;
- preuves de test des 8 composants transverses.

### Limite explicite de la levée

> Les composants et leurs tests sont réels et vérifiés ; leur **généralisation de réutilisation runtime** (adoption systématique dans tous les écrans, suppression des patrons dupliqués restants) reste **hors périmètre** et n’est pas déclarée achevée.

En conséquence, cette levée **ne ferme pas** :

| Élément | Statut maintenu | Justification |
|---|---|---|
| `DD-611-03` | **Ouvert** | Traçabilité Story→écran→composant→test — preuves de test structurelles inexistantes pour les lots futurs |
| `DD-EP17-10` | **Ouvert** | États d’erreur explicites — traitement séparé Lot B |
| `DD-611-04` | **En traitement** | Régression visuelle — `RES-VR-04` levée, mais industrialisation pixel-diff non atteinte |
| Gate 04A global | **Non clos** | `CHECK-DESIGN-01` Lot 5 est un avis documentaire ; la clôture globale du Gate requiert `DD-611-03` et `DD-EP17-10` |
| Staging / Production / migration | **Interdits** | Aucune autorisation de promotion issue de cette levée |

## Ce qui change

- `DD-611-02` passe de **En traitement** à **Close (2026-08-12)** dans le *Design Debt Register*.
- Le sous-bloqueur Gate 04A « DSG/DDS/inventaire non instanciés » est définitivement levé.

## Ce qui ne change pas

- Aucun code applicatif supplémentaire n’est autorisé.
- Aucun déploiement, Staging, Production, realm, secret, provider ou activation de canal externe.
- Les dettes restantes (`DD-611-03`, `DD-EP17-10`, etc.) conservent leur échéance et leur responsable.

## Références

- `docs/cgpa/design/design-debt-register-loyertracker.md`
- `docs/cgpa/design/DSG-001.md`
- `docs/cgpa/design/component-inventory-loyertracker.md`
- `docs/cgpa/checklists/check-design-01-ep17-lot5.md`
- `docs/cgpa/evidence/ep17-us138/baseline-post-pilote-t0-manifest.md`
- `docs/cgpa/checklists/res-vr-04-keycloak-overflow-runtime-evidence.md`
- `docs/cgpa/design/decisions/gate-04A-decision-ep17-lot0.md`
- `docs/cgpa/design/decisions/gate-04A-ep17-lot5-us140-reinstruction.md`
