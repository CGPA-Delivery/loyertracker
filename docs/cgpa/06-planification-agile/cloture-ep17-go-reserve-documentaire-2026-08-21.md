# Décision PO/CDO — Clôture EP-17 : GO sous réserve documentaire

| Champ | Valeur |
|-------|--------|
| Projet | LoyerTracker |
| Objet | Clôture EP-17 — UI Foundation, PrimeNG, Keycloak Theme |
| Date | 2026-08-21 |
| Décideur | Jordan Tshilombo Kabamba, PO/CDO |
| Référence | `gate-04A-ep17-lot5-us140-reinstruction.md` |
| Décision | **GO sous réserve documentaire** |

---

## 1. Contexte

EP-17 (UI Foundation, PrimeNG, Keycloak Theme) est partiellement livré et exécuté par lots. La clôture globale n'a jamais été prononcée. Cette décision tranche sur l'état final.

## 2. État des livraisons

| Lot | Statut | Référence |
|-----|--------|-----------|
| Lot 1 | Clôturé | DD-611-02 levée |
| Lot 2 | Clôturé | DD-EP17-02, DD-EP17-12 levées |
| Lot 3 | Clôturé | DD-611-03, DD-611-01, DD-EP17-05 levées |
| Lot 4 | Clôturé | DMARC progressif, Gate Production noreply |
| Lot 5 | Livré | US-136→141, Gate 04A réinstruit |

## 3. Réserves explicitement acceptées

| ID | Description | Acceptation |
|----|-------------|-------------|
| **RES-VR-04** | Overflow horizontal Keycloak 10px à 640px/390px | Acceptée comme limitation cosmétique connue du thème Keycloak |
| **RES-BASELINE-01** | Baseline US-127 avant pilote inexistante | Acceptée — non rétrofabriquable, comparaison limitée aux lots post-pilote |
| **RES-DESIGN-01** | CHECK-DESIGN-01 Lot 5 non instancié | Acceptée — revue design effectuée de facto via lots précédents |
| **DD-EP17-10** | États d'erreur explicites | Acceptée — traitée dans EP-18/US-125 |
| **DD-611-02** | DDS/DSG/inventaire composants | Acceptée — comblée par DSG-001 v0.3.0 |
| **DD-611-03** | Traçabilité Story→preuve | Acceptée — couverture rapportée |

## 4. Périmètre de la clôture

Cette clôture prononce **EP-17 comme livré et fermé**, sous réserve documentaire. Elle :

- **Ne rejoue aucun Gate historique** valide
- **N'autorise aucun déploiement** Staging ou Production
- **Ne modifie aucun code** ou migration
- **Préserve intégralement** l'historique documentaire
- **Ne lève pas** les réserves acceptées — elles persistent comme limitations connues

## 5. Dépendances extérieures

- PR #512 (Dependabot `socket.io-parser`) mergée le 2026-08-21
- Alertes Dependabot restantes : 3 High, 4 Moderate (Angular toolchain breaking)
- Traitement des alertes restantes : lot séparé, hors scope EP-17

## 6. Prochaine étape autorisée

| Action | Autorisée ? | Condition |
|--------|-------------|-----------|
| EP-19 cadrage | ✅ Oui | Décision PO/CDO distincte |
| EP-20 clôture | ✅ Oui | Déjà prononcée |
| Nouveau sprint | ✅ Oui | Plan d'exécution approuvé |
| Staging/Production | ❌ Non | Gate distinct requis |

---

## 7. Décision finale

> **Décision : GO sous réserve documentaire**
>
> EP-17 est **clôturé** comme livré. Les réserves listées en §3 sont **explicitement acceptées** comme limitations connues et documentées. Aucune action technique n'est autorisée par cette décision.
>
> **Date** : 2026-08-21
> **Identité** : Jordan Tshilombo Kabamba, Product Owner / CGPA Chief Delivery Officer
> **Signature** : Décision prise via interface conversationnelle Hermes Agent, session du 2026-08-21

---

*Document généré le 2026-08-21. Historique préservé. Aucune réécriture.*
