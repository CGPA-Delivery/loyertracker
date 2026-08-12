# Matrice normative de traçabilité Story / Bug — proposition

**Date :** 2026-08-09  
**Cadre :** CGPA v6.1.1  
**Release protégée :** `v1.17.0-rc.1` sous hypercare  
**Statut :** **VALIDÉE PO/CDO — Jordan Tshilombo, 2026-08-09**

## 1. Clé et règles

La clé normative est `EP-xx/US-yyy` pour les Epics récentes, ou `BUG-CAND-xxx` pour les défauts non rattachés à une User Story. Les IDs non qualifiés `US-135→US-140` restent des alias historiques ambigus. Toute cellule sans preuve porte explicitement `Preuve absente`, `À compléter`, `Non exécuté` ou `N/A justifié`.

Colonnes normatives : `référence`, `alias`, `intention`, `code/PR/commit`, `tests`, `Gate`, `release`, `environnement`, `statut de livraison`, `statut de preuve`, `réserves`, `prochaine action autorisée`.

## 2. Matrice consolidée au niveau des lots prouvés

| Référence normative | Alias / périmètre | Intention | Code / PR / commit | Tests / Gate | Release / environnement | Statut de livraison | Réserves / lacunes |
|---|---|---|---|---|---|---|---|
| `EP-01→EP-08/US-01→72` | IDs historiques | Socle MVP, comptes, biens, paiements, alertes, dashboards, RGPD | Preuves dispersées dans releases/Gates historiques ; mapping story-par-story non consolidé | Gates et smokes historiques ; matrice détaillée absente | Production historique, releases pré-`1.6.0` | Livrées historiquement, traçabilité agrégée | Produire mapping individuel sans déduire les cellules manquantes |
| `EP-09/US-80→85` | Source `US-70→75`, dont anciens `US-73→75` | Patrimoine enrichi et non-régression | Addendum EP-09, commits/release `1.6.0` et preuves patrimoine | Migration V19, tests et Gate historique | Production `1.6.0` | Livrées historiquement | Alias source absorbés ; `US-83` est non-régression |
| `EP-10→12/US-90→98` | — | Patrimoine, tableaux et durcissement | Plans/addenda, releases `1.6.0→1.8.0` | Migrations V19→V21, Gates/smokes historiques | Production | Livrées historiquement | Mapping individuel à compléter |
| `EP-14/US-99→104` | — | Quittances certifiées | Addendum EP-14, release `1.9.0` | Gates et vérification publique | Production `1.9.0` | Livrées | Matrice story-par-story à compléter |
| `EP-15/US-105→114` | — | Gestion des personnes / domaine | Addenda EP-15, releases `1.10.0→1.12.0` | Git/Gates présents | Production | Livrées côté backend/API | UI Angular dédiée Gestionnaire/Locataire absente ou portée à clarifier |
| `EP-13/US-115→118` | — | Périmètre EP-13 | Addendum/PR/Gate historique | Preuves Gate présentes | Production `1.11.0` | Livrées | Régularisation a posteriori à tracer |
| `EP-16/US-119→126` | — | Notifications préférences/historique | PR #398, commit `e27034a2`; RC commit `d19c4f...` | CI verte, Gate Staging/Production, smoke `63/0`, Flyway 32/32 | Production `v1.17.0-rc.1` | Livrées avec réserve hypercare | T+12/T+24 ; mapping individuel à compléter |
| `EP-17/US-127→134` | — | UI Foundation/Keycloak | PRs EP-17 documentées | Preuves ciblées | Production / périmètre restreint | Livrées sur périmètre restreint | Clôture globale EP-17 non acquise |
| `EP-17/US-135` | Bare `US-135` historique | Thème Keycloak restreint | PRs #355→#366 ; preuves `KEYCLOAK_THEME_DEPLOYED` | Tests/Gates ciblés | Production | Livrée avec réserve | Référence qualifiée obligatoire |
| `EP-17/US-136→140` | Bare IDs ambigus | Accessibilité, responsive, visual review, documentation, Gate pilote | Preuves partielles EP-17 | Gate 04A partiel / réserves | Environnements selon story | Partielle / non clôturée globalement | Matrice story-par-story obligatoire |
| `EP-17/US-141→142` | — | Preuve Staging / cadrage restant | Addendum EP-17 | Preuve Staging pour 141 ; aucune preuve de livraison pour 142 | Staging / non livré | Partielle / non livrée | Cadrage futur, aucun développement autorisé par cette matrice |
| `EP-18/US-135→140` | Bare IDs ambigus | EMAIL Resend, provider, invitation, observabilité | PR #368, merge `8c9f1e4`, release `1.16.0` | Tests/Gate EP-18 ; release promue | Production `1.16.0` | Livrées | IDs qualifiés obligatoires ; preuves opérationnelles à relier |
| `EP-18/US-143` | — | Fondation webhook Resend | PR #368 / `8c9f1e4`, contrôleur/vérificateur | Tests présents ; événement réel non exécuté | Fondation mergée ; validation réelle absente | Fondation livrée / opérationnel reclassé | EP-19, ne pas rouvrir EP-18 |
| `EP-19/US-144→147` | — | Backlog futur | Aucun Gate d’exécution | Non exécuté | Aucun environnement | Non livré | Hors autorisation hypercare |
| `BUG-CAND-001` | `DD-EP17-14` | Mot de passe oublié Keycloak | Code/config/preuve exacte à relier dans fiche bug | Test SMTP réel et anti-énumération absents | Défaut Production documenté | Bug candidat ouvert | Qualification P0/P1 PO/CDO requise |
| `BUG-CAND-002` | `DD-EP17-12` | Acceptation invitation | PR #462 (`2b2b82c`) : route Angular `/invitations/:token` et composant d’acceptation ; décision de clôture Lot 2 | CI post-merge ; smoke Staging 63/0 ; recette humaine PASS (PR #464) | Staging `STAGING_DEPLOYED` | **Close** | Fermeture bornée à Staging ; aucune autorisation Production |
| `BUG-CAND-003` | `RSV-EP18-03` | RGPD notifications | `ADR-19:257` | Couverture `notification_*` absente | Réserve documentaire | Réserve candidate ouverte | Gate conformité à fixer |
| `BUG-CAND-004` | `DD-EP15-04` | Archivage Bien avec affectation active | `BienService.java:91-97`, ADR-16 | Test de garde à produire | Code présent, comportement à trancher | Dette candidate ouverte | Décision métier requise |

## 3. Lacunes de preuve transverses

- `US-01→72` et plusieurs lots historiques sont prouvés par release/sprint, mais pas par ligne User Story.
- Les collisions EP-17/EP-18 exigent exclusivement des clés composites.
- Les tests, Gates et environnements existent souvent comme preuves de lot ; ils ne doivent pas être automatiquement recopiés sur chaque US sans correspondance explicite.
- `CHANGELOG.md`, `docs/prod-state.md` et certains plans contiennent des états historiques désormais contredits par les preuves récentes ; préserver l’historique et ajouter une supersession documentaire.
- La matrice ne clôt aucun bug et ne vaut pas validation fonctionnelle.

## 4. Règles de complétude

Une ligne peut être déclarée `Livrée` uniquement si code/docs, test, Gate/release et environnement applicables sont reliés par preuve. Sinon utiliser `Livrée historiquement / traçabilité incomplète`, `Partielle`, `Reclassée`, `Non livrée` ou `Preuve absente`. Une référence non prouvée ne doit jamais être remplie par inférence de lot.

## 5. Décision proposée

> Le PO/CDO valide une matrice normative unique Story/Bug → intention → code/PR/commit → tests → Gate → release → environnement → décision humaine → réserves. La matrice est additive, conserve les historiques et rend obligatoires les identifiants qualifiés EP/US. Elle autorise uniquement la complétude documentaire pendant l’hypercare ; elle n’autorise aucun code, migration, promotion, déploiement, activation fournisseur, EP-19 ou modification d’observabilité critique.
