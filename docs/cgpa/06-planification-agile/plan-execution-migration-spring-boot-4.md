# Plan d'Exécution — Migration du backend vers Spring Boot 4

## 1. Identification

- Projet : LoyerTracker.
- Version : sans changement de version applicative (`1.0.0` du module `loyertracker-api`).
- Phase CGPA : Phase 06 — DevSecOps Readiness (maintenance technique, dette de dépendances).
- Type : changement de version majeure du framework backend, sans changement de contrat API ni
  de modèle de données.
- Date : 2026-10-09.
- Responsables proposés : DevSecOps Lead, Delivery Architect et Release Manager.
- Statut : **Validé par le PO/CDO le 2026-10-09** (conversation de pilotage), plan et écart de
  gouvernance. Aucune réserve complémentaire (date, assignation) n'a été précisée à cette
  validation ; le risque correspondant reste ouvert au registre jusqu'au Gate Staging.
  Historique : proposé le 2026-10-09 en régularisation a posteriori.
- Décision : orientation PO « on migre sur Boot 4 » donnée dans la conversation de pilotage le
  2026-10-08. **Aucun Plan d'Exécution n'a été approuvé avant le codage ni avant la fusion.**
  Voir l'écart de gouvernance en §3.

## 2. D'où l'on vient

- Le contrôle de dépendances de l'image API (« Build, scan et SBOM Docker », contrôle requis de
  `main`) échouait sur toute PR depuis des avis publiés après le dernier succès de `main`
  (2026-08-21).
- La PR #540 (surcharges Tomcat et Jackson sur Spring Boot 3.5.16) réduisait le résultat du scan
  à un seul avis restant, sans correctif disponible dans Spring Framework 6.x : le correctif
  n'existe qu'en 7.x, donc avec Spring Boot 4. Cette PR seule ne pouvait pas rétablir le
  contrôle. Le détail de l'avis est consigné hors du dépôt public.
- Les étapes SonarQube de la CI visaient l'ancien serveur `sonar.loyerpro.org`, souvent
  arrêté ; la cible a été changée vers `sonar.tshilo.dev` (PR #541, jetons par projet posés par
  le PO).
- La montée Angular 22.1.0 → 22.2.0 (PR #539) était requise pour le contrôle de dépendances du
  frontend.

## 3. Où l'on est

- La migration a été **codée, vérifiée localement et fusionnée** par la PR #542
  (`e9ea603`, 2026-10-09 13:27 UTC) sur `main`.
- **Écart de gouvernance constaté :** CGPA v6.1.1 interdit tout code applicatif sans Plan
  d'Exécution approuvé. Le code a été produit sur instruction orale du PO en conversation de
  pilotage, puis fusionné avant l'existence de ce plan. Le présent document régularise la
  traçabilité ; il **ne valide pas rétroactivement** l'écart, qui relève de la décision
  PO/CDO (§13).
- Gates : aucun Gate Staging ni Production ouvert pour cette migration. Aucune promotion n'a eu
  lieu ; un push ou un merge ne vaut pas autorisation de promotion.
- Les PR #541, #539 et #540 (et la PR Dependabot #518) portent des changements désormais déjà
  présents sur `main` via #542 ou rendus sans objet : leur sort est décidé par le PO.

## 4. Où l'on va

### Objectifs

1. Retirer le blocage durable du contrôle de dépendances de l'image API en passant sur une
   version de Spring Framework qui corrige l'avis sans correctif en 6.x.
2. Rétablir des contrôles Backend, Frontend, Sécurité et Docker verts sur `main`.
3. Prouver que la migration ne dégrade ni le comportement de l'API ni les données avant toute
   promotion.

### Critères d'acceptation

- `mvn verify` vert (tests, Spotless, seuils JaCoCo) — **atteint** en local et en CI.
- Contrôles requis de la PR verts, dont le scan de l'image API exacte — **atteint** (PR #542).
- Quality Gate SonarQube PASSED sur `loyertracker-backend` et `loyertracker-frontend` —
  **atteint**.
- Répétition de la migration sur une base représentative (Flyway 12, Hibernate 7) —
  **non exécuté**.
- Parité fonctionnelle de l'API après Jackson 3 et Spring Security 7 — **non exécuté** hors
  tests existants.
- Gate Staging puis recette avant toute promotion — **non exécuté**.

## 5. Périmètre

### Inclus (réalisé dans la PR #542)

- Backend : parent Spring Boot 3.5.16 → 4.1.1 ; retrait des surcharges désormais gérées par le
  BOM ; surcharges maintenues pour Tomcat 11.0.25 et Jackson 3.1.7 (le BOM gère des versions
  antérieures aux correctifs requis par le contrôle) ; starters Flyway et tests WebMVC ;
  artefacts Testcontainers 2.x.
- Code : Jackson 3 (`tools.jackson.*`, `JacksonException`) ; packages d'auto-configuration des
  tests et du profil `test`.
- Changements repris d'autres PR pour permettre la CI : Angular 22.2.0 (`package.json`,
  `package-lock.json`) et URL SonarQube (`ci.yml`).

### Exclus

- Toute migration SQL, tout changement de schéma, de contrat API, de flag ou de configuration
  d'infrastructure.
- Le Dockerfile (Java 21, Maven 3.9) ; la PR Dependabot #524 reste à instruire séparément.
- Toute promotion Staging ou Production.

## 6. Fichiers concernés

- À créer : le présent plan.
- Modifiés par la PR #542 (30 fichiers, 121 insertions, 113 suppressions) : `backend/pom.xml` ;
  7 fichiers `main` et 2 fichiers de test utilisant Jackson ; 20 tests d'intégration
  (import `AutoConfigureMockMvc`) ; `backend/src/test/resources/application-test.yml` ;
  `frontend/package.json`, `frontend/package-lock.json` ; `.github/workflows/ci.yml`.
- À ne pas toucher dans ce plan : migrations Flyway `V1`–`V*`, `infra/`, Compose Staging et
  Production.

## 7. Étapes techniques

| # | Étape | État |
|---|---|---|
| 1 | Exploration locale : parent 4.1.1, compilation, mesure de l'ampleur | Fait |
| 2 | Correction Jackson 3, starters, packages de test | Fait |
| 3 | `mvn verify` local : 280 tests, 0 échec ; Spotless ; JaCoCo | Fait |
| 4 | CI de la PR : Sonar, Sécurité, Docker, CodeQL, E2E accessibilité | Fait |
| 5 | Fusion PR #542 | Fait (2026-10-09), sans plan approuvé |
| 6 | Validation de ce plan par le PO/CDO | Fait (2026-10-09) |
| 7 | Répétition Flyway 12 / Hibernate 7 sur copie de données représentatives | **Partiel** : volet synthétique PASS (2026-10-09), voir §7bis ; copie de données **à faire** |
| 8 | Gate Staging (`STG-ISOL-01`) avec l'artefact immuable `sha-<8>` issu de `main` | **À faire** |
| 9 | Comparaison de parité JSON et recette humaine | **À faire** |
| 10 | Gate Production, hypercare | **À faire** |

### 7bis. Répétition Flyway synthétique — résultat (2026-10-09)

Exécutée en local sur un conteneur PostgreSQL 16 jetable (digest du dépôt), isolé, sans donnée
personnelle ni commande Docker globale. L'ancienne application (`d47907f`, Spring Boot 3.5.16,
Flyway 11) migre une base jusqu'à V32 (état de Production supposé d'après `project-state.md`,
non revérifié) ; la nouvelle application (Boot 4, Flyway 12, Hibernate 7, `ddl-auto=validate`)
démarre ensuite sur cette base.

| Contrôle | Résultat |
|---|---|
| Démarrage : `validate` + `migrate` + validation Hibernate | PASS |
| Historique antérieur (version, checksum, succès) inchangé | PASS |
| Aucune migration en échec ; migrations appliquées par la nouvelle appli | PASS ; 4 (V33 à V36) |
| Comptes de lignes des tables existantes inchangés | PASS (tables vides) |
| Schéma identique à une migration complète sur base vierge | PASS |

Limites : aucune donnée réelle (effets des types, contraintes et du ledger de garanties sur
données existantes non couverts) ; version de départ V32 non revérifiée en Production ;
configuration exacte de Production (rôle batch, variables) non reproduite. La répétition sur
**copie de données** reste à faire, avec stockage local chiffré et destruction après revue. Le
script de répétition n'est pas versionné à ce stade.

## 8. Dépendances

- Décision PO/CDO sur le présent plan et sur l'écart de gouvernance.
- Accès à Staging mutualisé `ai-test-server` : `STG-ISOL-01` bloquant avant tout déploiement ;
  aucune commande Docker à portée globale.
- Sauvegarde PostgreSQL vérifiée avant toute répétition ou promotion.

## 9. Risques et mesures

| Risque | Mesure |
|---|---|
| Flyway 12 appliqué sur un historique existant (checksums, ordre) : prouvé seulement sur base vierge de test | Répétition sur copie de données avant Staging ; échec = blocage |
| Hibernate 7 : requêtes natives, dialecte, mapping, comportements implicites | Tests existants verts ; répétition + recette des écrans financiers |
| Jackson 3 : valeurs par défaut de sérialisation/désérialisation, dates | Comparaison de réponses avant/après sur les endpoints principaux |
| Spring Security 7 / resource-server JWT Keycloak | Smoke authentifié (bailleur, gestionnaire) en Staging |
| Propriétés de configuration renommées en Boot 4, éventuellement ignorées sans erreur | Revue de `application.yml` et des variables d'environnement Staging/Production ; actuator et métriques comparés |
| `openhtmltopdf` 1.0.10 non maintenu activement : génération PDF des quittances | Test de génération en Staging ; échec = blocage |
| Surcharges Tomcat/Jackson à retirer plus tard | Suivi : retrait quand le BOM relèvera ses versions |
| Écart de gouvernance (code fusionné avant plan) | Consigné ici et au registre ; décision PO/CDO en §13 |

## 10. Tests prévus

- Déjà exécutés : `mvn verify` local et CI (280 tests, Testcontainers PostgreSQL, RLS) ;
  CodeQL Java/TypeScript ; scan de l'image API ; E2E accessibilité.
- À exécuter : répétition Flyway sur copie de données ; smoke de la stack
  (`infra/smoke/smoke-stack.sh`) ; parcours S01→S04 ; invariant du ledger de garanties ;
  génération des quittances et avis PDF ; métriques et alertes d'observabilité.

## 11. Rollback

- Application : redéployer le tag immuable `sha-<8>` précédent ; la migration n'ajoute aucun
  script SQL, donc aucun retour arrière de données n'est prévu **sous réserve** que la
  répétition Flyway 12 confirme l'absence de modification de l'historique du schéma.
- Code : `git revert -m 1 e9ea603` dans une PR dédiée.
- Données, infrastructure, flags : sans objet à ce stade, à confirmer après la répétition.

## 12. Critères de validation

1. Plan validé par le PO/CDO, avec décision sur l'écart de gouvernance.
2. Répétition Flyway/Hibernate PASS.
3. Gate Staging PASS avec `STG-ISOL-01`.
4. Parité fonctionnelle et recette humaine PASS.
5. Aucun contrôle applicable sans preuve classé « non applicable » : un contrôle sans preuve
   reste « non exécuté ».

## 13. Décision attendue

**Décision rendue le 2026-10-09 (conversation de pilotage) :** plan validé et écart de gouvernance
validé par le PO/CDO. Les points ci-dessous sont conservés pour traçabilité ; le sort des PR
#539, #540, #541 et #518 a été tranché (fermées).

À rendre par le CGPA Chief Delivery Officer :

- Statuer sur l'écart de gouvernance (code fusionné sans Plan d'Exécution approuvé) : accepter
  avec réserve datée et assignée, ou autre traitement.
- Valider ou amender le présent plan.
- Décider du sort des PR #539, #540, #541 et #518.

## 14. Action autorisée à ce stade

Documentation uniquement. **Aucune promotion Staging ou Production, aucun déploiement, aucune
migration de données.** Toute action au-delà exige la décision du §13 puis le Gate concerné.
