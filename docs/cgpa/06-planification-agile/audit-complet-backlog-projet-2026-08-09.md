# Audit complet du backlog projet — LoyerTracker

**Date de l’audit :** 2026-08-09  
**Référence Git auditée :** `main` après PR #414, branche d’audit `audit/complete-backlog-reconciliation`  
**Cadre :** CGPA v6.1.1  
**Release Production active :** `v1.17.0-rc.1`, US-125, sous hypercare  
**Objectif :** détecter les User Stories oubliées, non tracées, dupliquées, seulement partiellement livrées ou encore non promues.

> Une User Story n’est classée **livrée** que si une preuve de code/PR existe et si une preuve de validation, d’intégration ou de promotion existe. Une formulation historique dans `project-state.md` ne constitue pas seule une preuve de clôture.

---

## 1. Sources contrôlées

### Sources de backlog

- `docs/cgpa/06-planification-agile/product-backlog.md`
- `docs/cgpa/06-planification-agile/addendum-backlog-ep10-ep12.md`
- `docs/cgpa/06-planification-agile/addendum-patrimoine-backlog.md`
- `docs/cgpa/06-planification-agile/addendum-backlog-ep13-fin-de-bail.md`
- `docs/cgpa/06-planification-agile/addendum-backlog-ep14.md`
- `docs/cgpa/06-planification-agile/addendum-backlog-ep15-personnes.md`
- `docs/cgpa/06-planification-agile/addendum-backlog-ep16-notifications.md`
- `docs/cgpa/06-planification-agile/addendum-backlog-ep17-ui-foundation-primeng-keycloak.md`
- `docs/cgpa/06-planification-agile/addendum-backlog-ep18-notifications-email-resend.md`
- `docs/cgpa/06-planification-agile/addendum-backlog-ep19-delivrabilite-email-webhooks-resend.md`

### Sources de preuve

- `docs/project-state.md`
- `CHANGELOG.md`
- `docs/prod-state.md`
- plans d’exécution, Gates 02A/04A/05/07A, checklists SRE et rapports de release
- historique Git et merges des PR
- références de migrations Flyway, tests, smoke tests et images immuables

---

## 2. Résultat exécutif

### Conclusion

L’audit ne trouve pas une seule liste fiable permettant de dire « tout le backlog est clôturé ». Il révèle cependant les écarts suivants :

1. **US-73 à US-89 sont absentes de toutes les sources de backlog identifiées.** Le backlog canonique s’arrête à US-72 et la documentation reprend à US-90. Il peut s’agir d’une plage volontairement réservée, d’un ancien Epic supprimé ou de User Stories oubliées ; aucune décision de classement n’est tracée.
2. **US-135 à US-140 sont en collision d’identifiants** entre EP-17 et EP-18. Cette collision rend impossible une traçabilité fiable par ID seul.
3. **EP-17 est seulement partiellement livré.** Les Lots 1 à 3 sont couverts, mais les Lots 4 à 6 et plusieurs sections métier restent explicitement hors périmètre ou sous réserves. La correspondance exacte entre `US-135→US-142` et ces Lots n’est pas maintenue.
4. **EP-18 A+B est intégré et promu**, mais la preuve de livraison de Sprint C/US-143 dans `main` et en Production n’est pas établie par l’historique Git actuel. Le code webhook observé dans la branche dédiée ne suffit pas à déclarer US-143 livrée.
5. **EP-19 est bien identifié comme futur**, mais ses US-144→147 n’ont ni implémentation ni Gate de livraison. Elles ne sont pas oubliées ; elles sont non livrées et doivent rester dans le backlog actif.
6. Plusieurs documents de référence sont contradictoires avec l’état réel : `CHANGELOG.md` indique encore que `1.17.0-rc.1` n’est pas déployée, et `docs/prod-state.md` conserve un état historique `1.16.0`/EP-18.
7. Les dettes de conception et réserves ouvertes ne sont pas toutes reliées à une User Story. Certaines peuvent masquer des travaux oubliés : `DD-EP17-04`, `DD-EP17-06`, `DD-EP17-10`, `DD-EP17-11`, `DD-EP17-14`, `DD-611-02`, `DD-611-03`, budget Resend et validation réelle webhook.

**Verdict global : BACKLOG NON RÉCONCILIÉ — aucune nouvelle implémentation ne doit être lancée sur la base des seuls IDs actuels.**

---

## 3. Matrice de couverture par domaine

### 3.1 Backlog produit canonique initial — 23 stories / 108 points

Le fichier canonique contient les stories `US-01→04`, `US-10→13`, `US-20→24`, `US-30→32`, `US-40`, `US-50→52`, `US-60→62`, `US-70→72`.

| Domaine | Stories | Audit de couverture | Décision |
|---|---:|---|---|
| Socle & infrastructure | US-01→04 | Couvert par la stack Compose, Keycloak, Flyway et CI historiques ; preuves réparties dans les premiers lots | Livré historiquement, matrice de clôture formelle à consolider |
| Comptes/auth/délégation | US-10→13 | Couvert par les implémentations comptes, invitations, acceptation et RBAC/RLS | Livré historiquement, preuves dispersées |
| Biens/baux/affectation | US-20→24 | Fonctionnellement présent dans le socle métier et les sprints Patrimoine/Personnes/Fin de bail | Livré historiquement, preuve par story à consolider |
| Paiements/garanties | US-30→32 | Présents dans les tests et états métier ; aucune omission confirmée dans les sources consultées | Livré historiquement, preuve par story à consolider |
| Honoraires | US-40 | Présent dans le dashboard et les tests métier historiques | Livré historiquement, preuve de DoD à consolider |
| Alertes/batch | US-50→52 | Présents dans le socle alertes et les contrôles de périmètre | Livré historiquement, preuve de DoD à consolider |
| Dashboards/audit | US-60→62 | Dashboard Bailleur/Gestionnaire et journal d’audit présents ; les migrations UI EP-17 ne couvrent pas tous les écrans | Livré fonctionnellement ; dette UI/migration encore ouverte |
| RGPD/sécurité/durcissement | US-70→72 | Tests d’autorisation, scans CI, headers et contrôles RGPD présents dans les Gates/reports | Livré historiquement ; revalidation par story à consolider |

**Observation :** aucune US canonique n’est déclarée « oubliée » avec certitude, mais aucune matrice actuelle ne relie systématiquement chaque story à commit, PR, test, version et preuve de déploiement. Elles doivent donc être classées provisoirement **livrées à confirmer**, et non définitivement clôturées par simple héritage documentaire.

### 3.2 Plage absente — US-73 à US-89

| Constat | Risque | Classification | Action obligatoire |
|---|---|---|---|
| Aucun fichier de backlog, Epic ou addendum identifié pour US-73→US-89 ; EP-10/12 démarre à US-90 | Stories historiques supprimées ou oubliées ; rupture de séquence | **À requalifier — priorité haute** | Décider explicitement : plage réservée, stories annulées, ou reconstituer les stories à partir du CDC/PR/issues |

Aucune implémentation ne doit être attribuée à cette plage avant décision Product Owner/CDO.

### 3.3 EP-10/EP-12 — US-90 à US-98

Les addenda EP-10/EP-12 documentent `US-90→US-98` autour des extensions patrimoine, gestion et exploitation. Les preuves de code et de tests sont présentes dans l’historique projet, mais aucun tableau de clôture story par story n’est maintenu dans le backlog actuel.

**Classement :** probablement livré historiquement ; **preuve de DoD à réconcilier**, sans oubli confirmé.

### 3.4 EP-14 — US-99 à US-104

Les stories sont couvertes par les lots quittances, sécurité de surface et durcissement historiques. `US-104` est notamment visible dans l’historique Git via le rate-limit Nginx/public smoke.

**Classement :** livré historiquement ; preuve par story à consolider.

### 3.5 EP-15 — US-105 à US-114

Les preuves Git identifiées couvrent :

- US-105→108 : cycle de vie Gestionnaire ;
- US-109→112 : entité Locataire persistante ;
- US-113→114 : bascule Bail → Locataire.

**Classement :** livré et intégré, sous réserve de construire la matrice de preuves définitive.

### 3.6 EP-13 — US-115 à US-118

La clôture/réouverture de bail est visible dans l’historique Git et les documents EP-13. Les références US-115/US-118 présentes dans EP-16 sont des dépendances ou références historiques, pas de nouvelles stories EP-16.

**Classement :** livré historiquement ; à rattacher explicitement à la release et aux tests de clôture.

### 3.7 EP-16 — US-119 à US-126

| Story | État vérifié | Classification |
|---|---|---|
| US-119→US-123 | Fondation Outbox transactionnelle et notifications initiales présentes dans Git/tests | Livré historiquement |
| US-124 | Fallback SMS contrôlé, intégré dans le Lot A et couvert par les preuves de release | Livré |
| US-125 | Préférences, désinscription, historique et sécurité backend livrés ; `v1.17.0-rc.1` déployée en Production ; hypercare active | Livré en Production, clôture finale conditionnée T+12/T+24 |
| US-126 | Observabilité/sécurité/exploitation du Lot A documentées et intégrées | Livré historiquement, preuve story à consolider |

**Classification EP-16 :** pas de reliquat fonctionnel prouvé après US-125. Les anciens plans EP-16 qui indiquent encore un Backend non livré sont obsolètes.

### 3.8 EP-17 — US-127 à US-142

| Périmètre | État vérifié | Classification |
|---|---|---|
| US-127→US-131, Lot 1 | Design tokens, thème PrimeNG et architecture SCSS implémentés ; US-129 close ; US-130/131 validées sous réserve historique | Livré/validé sous réserves documentaires résiduelles |
| US-132, Lot 2 | 8 composants transverses + service Toast ; 133/133 puis CI verte ; GO sous réserve PO | Livré et validé sous réserve |
| US-133/US-134, Lot 3 restreint | 4 écrans Biens/Patrimoines migrés ; PR #338→#341 ; preuves responsive/cohérence produites ; validation PO du périmètre | Livré pour le périmètre restreint |
| US-135→US-142 | IDs déclarés par EP-17 mais aucune matrice fiable ne rattache chaque ID aux Lots 4→6 ; certaines activités Lot 4 existent, mais elles ne prouvent pas automatiquement la clôture de toutes ces US | **Non réconcilié / potentiellement oublié** |

Périmètres explicitement différés dans EP-17 et donc à ne pas considérer comme livrés : affectations, paiements, garanties, honoraires, alertes, journal d’audit, reste du dashboard Bailleur, dashboard Gestionnaire, et extensions Lots 5/6.

### 3.9 EP-18 — notifications e-mail / Resend

| Story/périmètre | État vérifié | Classification |
|---|---|---|
| US-135→US-138 | Sprint A Resend intégré dans PR #368 et promu via `1.16.0` | Livré, mais IDs en collision avec EP-17 |
| US-139 | Invitation Gestionnaire par e-mail, Sprint B, intégré et promu | Livré, mais ID en collision |
| US-140 | Socle/complément de voie transactionnelle e-mail, intégré et promu | Livré, mais ID en collision |
| US-143 | Webhook Resend/Svix documenté et présent sur la branche dédiée ; l’historique `main` audité ne contient pas le commit de webhook Sprint C comme preuve d’intégration finale incontestable | **Non livré / preuve de merge à rétablir** |

**Point critique :** `project-state.md` affirme à un endroit que Sprint C est intégré dans PR #368, alors que l’historique Git de `main` montre le merge `8c9f1e4` correspondant au socle A+B. Cette contradiction doit être résolue par lecture de la PR et du diff final avant toute déclaration de US-143.

### 3.10 EP-19 — US-144 à US-147

EP-19 est créé comme futur Epic de suivi avancé de délivrabilité : statuts `DELIVERED`, `BOUNCED`, `FAILED`, `COMPLAINED`, gouvernance webhook, déduplication, observabilité et exploitation.

**Classement :** backlog futur explicite, non livré, non oublié. Aucun Gate de développement ou de promotion ne doit être déduit de sa seule documentation.

---

## 4. Anomalies de numérotation et de gouvernance

### A. Collision critique US-135→US-140

- EP-17 réserve `US-127→US-142`.
- EP-18 réutilise `US-135→US-140`.
- EP-19 poursuit avec `US-144→US-147`.

**Décision requise :** choisir une stratégie unique : renumérotation additive d’EP-18/EP-19, namespace Epic obligatoire, ou annulation formelle des anciens IDs EP-17 non utilisés. Tant que ce point n’est pas décidé, un ID seul ne peut pas servir de référence CGPA.

### B. Rupture US-73→US-89

Aucune source actuelle ne définit ces IDs. Le projet doit conserver une décision écrite, même si la conclusion est « plage réservée/non utilisée ».

### C. Absence de matrice de clôture unifiée

Il manque un tableau unique avec, pour chaque US : Epic, titre, propriétaire, dépendances, commit, PR, tests, version, environnement, Gate, statut humain et réserves ouvertes.

### D. Contradictions d’état

À corriger avant de considérer l’audit terminé :

- `CHANGELOG.md` : section `1.17.0-rc.1` indique encore « Aucun déploiement Production » alors que la RC est déployée et documentée.
- `docs/prod-state.md` : état historique EP-18/`1.16.0` non réconcilié avec `1.17.0-rc.1`.
- `project-state.md` : statut de Sprint C EP-18/US-143 contradictoire avec le contenu vérifiable de `main`.
- plusieurs addenda EP-16/EP-17 conservent des états « non démarré » ou « bloqué » devenus historiques.

---

## 5. Items réellement susceptibles d’avoir été oubliés

### Priorité P0 — requalification avant nouveau code

1. **US-73→US-89** : déterminer si elles ont existé, ont été annulées ou n’ont jamais été attribuées.
2. **US-135→US-140** : résoudre la collision EP-17/EP-18.
3. **US-135→US-142 EP-17** : produire le mapping exact Story → Lot 4/5/6 et marquer explicitement les stories non commencées.
4. **US-143** : vérifier le diff final de PR #368 et décider livré/non livré ; ne pas se fier à la seule entrée `project-state.md`.

### Priorité P1 — couverture fonctionnelle à confirmer

1. migrations UI restantes du dashboard Bailleur : affectations, paiements, garanties, honoraires, alertes, audit ;
2. dashboard Gestionnaire et parcours métier associés ;
3. Lot 5 : exécution réelle des scénarios de sécurité Keycloak en Staging ;
4. Lot 6 : si prévu, définir ses stories au lieu de le laisser comme simple section de plan ;
5. `DD-EP17-14` : flux mot de passe oublié/SMTP, à maintenir comme item explicitement assigné ;
6. `DD-EP17-11` : touch target bouton global ;
7. `DD-EP17-04`, `DD-EP17-06`, `DD-EP17-10`, `DD-611-02`, `DD-611-03` : décider si dettes techniques autonomes ou critères d’acceptation d’US existantes.

### Priorité P2 — EP-19

US-144→147 doivent rester dans le backlog futur avec un plan, des critères d’acceptation, des Gates et une stratégie de vérification webhook réelle. Elles ne doivent pas être traitées pendant l’hypercare de `v1.17.0-rc.1`.

---

## 6. Décision recommandée

**NO GO pour toute nouvelle implémentation fonctionnelle basée sur le backlog actuel.**

Autorisé immédiatement sur Dev, branche dédiée :

1. corriger les collisions d’IDs et la plage US-73→89 par décision PO/CDO ;
2. produire la matrice de preuve story par story ;
3. vérifier PR #368 et statuer US-143 ;
4. transformer les Lots 4→6 d’EP-17 en stories explicites ou les clôturer comme non retenus ;
5. réconcilier `CHANGELOG.md`, `docs/prod-state.md`, `project-state.md` et les addenda historiques.

Interdit jusqu’à la clôture T+24 et aux Gates applicables : merge applicatif, nouvelle release, migration, modification Production/Staging, activation EP-19, modification sécurité/observabilité critique.

### Conclusion finale

Le projet n’a pas seulement un risque de « story oubliée » ; il a un risque plus grave de **story existante mais rendue invisible par une numérotation et une documentation incohérentes**. Les candidats les plus sérieux sont `US-73→US-89`, `US-135→US-142` EP-17 non mappées, et `US-143` dont la preuve de merge doit être rétablie. Aucune de ces zones ne doit être codée avant décision de requalification.
