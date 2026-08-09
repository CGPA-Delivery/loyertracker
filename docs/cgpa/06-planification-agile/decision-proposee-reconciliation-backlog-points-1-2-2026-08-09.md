# Décision proposée — réconciliation backlog, points 1 et 2

**Date :** 2026-08-09  
**Statut :** **VALIDÉE PO/CDO — Jordan Tshilombo, 2026-08-09**
**Cadre :** CGPA v6.1.1  
**Release protégée :** `v1.17.0-rc.1` sous hypercare

## 1. Avis spécialisés consolidés

Trois sous-agents ont examiné chacun des deux points avec des rôles distincts :

- audit historique/cahier des charges et numérotation ;
- audit technique, Git, PR, releases, Gates et environnements ;
- revue gouvernance/PO/CDO et options de décision.

Les avis d’agents sont des avis techniques indépendants. Ils ne constituent pas une signature humaine ni une décision CDO.

## 2. Point 1 — plages US-73→79 et US-86→89

### Faits réconciliés

| Plage/ID | Constat | Statut proposé |
|---|---|---|
| `US-73` | Ancien ID source Patrimoine, devenu `US-83` | Reclassée vers `US-83` |
| `US-74` | Ancien ID source Patrimoine, devenu `US-84` | Reclassée vers `US-84` |
| `US-75` | Ancien ID source Patrimoine, devenu `US-85` | Reclassée vers `US-85` |
| `US-76→79` | Aucun cahier des charges, addendum, commit, PR, test ou release dédié retrouvé | Non attribuées / réservées ou annulées avant attribution |
| `US-80→85` | EP-09 Patrimoine, renumérotation documentée de la source US-70→75 | Occupées et tracées |
| `US-86→89` | Aucun cahier des charges, addendum, commit, PR, test ou release dédié retrouvé | Non attribuées / réservées ou annulées avant attribution |
| `US-90→98` | EP-10→12, démarrage documenté après EP-09 | Occupées et tracées |

### Décision PO/CDO — P1 — VALIDÉE

> Les anciens identifiants source `US-73`, `US-74` et `US-75` du périmètre Patrimoine sont déclarés absorbés respectivement par les identifiants canoniques `US-83`, `US-84` et `US-85`. Les plages `US-76→79` et `US-86→89` sont déclarées non attribuées/réservées ou annulées avant attribution, sous réserve d’une source externe contraire apportée par le Product Owner. Aucune nouvelle User Story ne doit être inventée ou implémentée dans ces plages sans nouvelle décision de cadrage.

### Action documentaire proposée

- ajouter une table de namespace/renumérotation au backlog consolidé ;
- qualifier la mention isolée `US-73` dans la DoD de `product-backlog.md` comme dérive historique ;
- ne pas réécrire les addenda ou releases historiques.

## 3. Point 2 — collision EP-17 / EP-18 US-135→US-140

### Faits réconciliés

| ID qualifié | EP-17 | EP-18 |
|---|---|---|
| `US-135` | Thème Keycloak restreint, livré avec réserves | Canal/provider EMAIL Resend, livré dans `1.16.0` |
| `US-136` | Accessibilité, partielle/non clôturée globalement | Fondation EMAIL/V30, livrée dans `1.16.0` |
| `US-137` | Responsive, partielle/non clôturée globalement | Provider Resend, livré dans `1.16.0` |
| `US-138` | Régression visuelle, partielle/incertaine | Configuration/kill-switch Resend, livrée dans `1.16.0` |
| `US-139` | Documentation du pilote, partielle | Invitation gestionnaire e-mail, livrée dans `1.16.0` |
| `US-140` | Gate 04A pilote, partielle/GO sous réserve | Observabilité/runbook EMAIL, livrés fonctionnellement dans `1.16.0` |

Le code webhook US-143 est également présent dans PR #368/merge `8c9f1e4`. Sa **fondation technique est mergée**, mais sa validation opérationnelle par événement réel Resend/Svix est reclassée vers EP-19.

### Décision PO/CDO — P2 — VALIDÉE

> Les identifiants non qualifiés `US-135` à `US-140` sont déclarés ambigus et interdits comme référence unique. Les preuves historiques, commits, PR, Gates, releases et documents existants ne doivent pas être réécrits ni renumérotés. À compter de la validation de cette décision, toute référence normative doit utiliser `EP-17/US-xxx` ou `EP-18/US-xxx`. Une migration documentaire additive maintiendra les alias historiques et la matrice de preuves.

### Option retenue dans cette proposition

**Option D : migration additive avec alias historiques**, imposant immédiatement la clé qualifiée de l’option C.

Options rejetées :

- renuméroter EP-18 après sa promotion `1.16.0` : risque de casser les preuves immuables ;
- renuméroter immédiatement EP-17 : certaines stories EP-17 sont déjà livrées ou partielles ;
- résoudre silencieusement par la récence : non conforme à la préservation CGPA de l’historique.

### Registre d’alias minimal proposé

| Référence normative future | Alias historique conservé | Sujet |
|---|---|---|
| `EP-17/US-135` | `US-135` non qualifiée | Thème Keycloak |
| `EP-18/US-135` | `US-135` non qualifiée | Canal EMAIL Resend |
| `EP-17/US-136→140` | `US-136→140` non qualifiées | Accessibilité/responsive/visual review/documentation/Gate pilote |
| `EP-18/US-136→140` | `US-136→140` non qualifiées | EMAIL Resend/provider/invitation/observabilité |

La même structure doit être complétée avec commits, PR, tests, Gates, versions, environnements et réserves.

## 4. Conditions et interdictions

Jusqu’à validation PO/CDO et clôture ou dérogation explicite de l’hypercare :

- aucun nouveau code fonctionnel sur ces IDs ;
- aucune renumérotation destructive ;
- aucune réécriture de Gate, release, commit ou preuve historique ;
- aucune migration Flyway, modification Production/Staging, secret, provider, Docker ou observabilité critique ;
- aucun lancement EP-19/webhook réel par cette décision documentaire seule.

## 5. Décision humaine enregistrée

Validation reçue de Jordan Tshilombo :

1. validation de la requalification du point 1 (`US-73→75` vers `US-83→85`, plages restantes non attribuées/réservées) ;
2. validation de l’Option D du point 2 (alias historiques + IDs qualifiés obligatoires).

Cette validation ne constitue pas un GO de développement. Elle autorise uniquement la synchronisation documentaire additive et l’usage des identifiants qualifiés. Toute implémentation future exige un cadrage et un Gate distincts.