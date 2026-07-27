# Audit initial — migration CGPA v5.4.1 vers v6.1.1 Enterprise

## 1. Identification

- Projet : LoyerTracker.
- Date d'audit : 2026-07-27.
- Branche d'audit puis de migration : `migration/cgpa-v6.1.1-enterprise`.
- Base stable : `origin/main` au commit `1fae0edbf5fa05646d814f3c7e5f4d33d0bfd324`.
- Référentiel canonique : `jptshilombo/setup-cgpa`, commit
  `64a4330897d4b7c1c9e1c6301e4520b3bf4b0a57`.
- Version source démontrée : CGPA v5.4.1 (`docs/project-state.md`,
  `AGENTS.md`, `CLAUDE.md`, `docs/cgpa/README.md`).
- Version cible : CGPA v6.1.1 Enterprise.

Cet audit est strictement documentaire et en lecture seule. Il ne valide aucun Gate applicatif,
aucune qualité applicative, aucune promotion et aucune release.

## 2. Historique et Gates

La lignée existante est conservée :

`3.0.1 -> 5.0.1 -> 5.2 -> 5.3 -> 5.4 -> 5.4.1`.

Tous les Gates, décisions, réserves, risques, preuves et releases historiques restent valides dans
leur périmètre et ne sont pas rejoués. Cela inclut les Gates initiaux, Gate 06A, Gate 07A,
Gate 09, Gate 10, les Gates Staging et Production par release, les décisions `NO GO` et
`GO sous réserve`, ainsi que `STG-ISOL-01`.

Les contrôles v5.5, v5.6, v6.0, v6.1 et v6.1.1 sont applicables au prochain changement ou Gate
concerné. Leur introduction documentaire ne constitue pas une preuve de leur exécution passée.

## 3. État courant et limite de concurrence

Le cycle Production `1.14.0` est distinct de la migration. Les preuves disponibles indiquent
`PRODUCTION_DEPLOYED` et un checkpoint hypercare T0 PASS, mais les checkpoints T+12/T+24 et la
clôture CDO restent à instruire sur la base stable auditée. La migration ne les exécute ni ne les
clôture.

Le PR #276 (`feat/rv542-verrou-etat-release`, commit `9f8268a`) est ouvert au démarrage de la
migration. Il contient des évolutions documentaires et CI non présentes dans la base stable
`origin/main`. Avant validation finale de la migration, la branche devra être resynchronisée après
le traitement humain de ce PR, sans écraser son historique ni ses décisions.

La protection GitHub de `main` a été vérifiée le 2026-07-27 : checks requis stricts, administrateurs
inclus, force-push et suppression interdits, résolution des conversations exigée. Le nombre
d'approbations obligatoires est toutefois configuré à zéro ; la validation humaine finale de cette
migration reste donc un verrou CGPA explicite indépendant.

## 4. Quatre architectures

### Architecture Métier

Les éléments existent dans la fiche idée, l'expression de besoin, le cahier des charges et leurs
addenda. Ils couvrent vision, bénéficiaires, processus, règles, responsabilités, contraintes et
indicateurs, mais restent dispersés. Un index d'architecture Métier doit les relier sans dupliquer
les concepts existants.

### Architecture Logicielle

Le dossier d'architecture, les ADR, les migrations et les tests constituent un socle réel. Le
dossier principal est toutefois désynchronisé des évolutions récentes, notamment EP-16,
notifications/Twilio et V27/V28. L'inventaire ADR et la situation OpenAPI doivent être clarifiés
additivement.

### Architecture Technique

Docker Compose, CI, sécurité, sauvegarde, rollback, observabilité et promotion d'environnement sont
documentés et éprouvés. Ils doivent être mappés vers les artefacts Enterprise Delivery canoniques
sans créer de stratégie concurrente.

### Architecture UX/UI

L'interface Angular rend cette architecture applicable. Des preuves d'accessibilité, responsive et
revues visuelles existent, mais UXR-001, DDS-001, DSG-001, l'inventaire de composants, la dette
Design et la traçabilité Story-écran-composant-test ne sont pas formalisés. Les Gates historiques
02A/04A ne sont pas rejoués ; les contrôles s'appliquent aux prochains lots Frontend significatifs.

## 5. Financial Governance

Financial Governance est applicable : loyers, paiements, garanties, honoraires, soldes, devises et
quittances sont au cœur du produit. ADR-13 et ADR-14 fournissent un socle, mais les artefacts
canoniques `ADR-FIN-001`, `CHECK-FIN-01`, `FIN-ARCH-001` et `FIN-DOMAIN-GUIDE` sont absents.

Écarts à traiter avant le prochain changement ou Gate financier :

- immutabilité du ledger non imposée en base, `UPDATE` et `DELETE` restant accordés ;
- écriture compensatoire non démontrée comme mécanisme exclusif de correction ;
- concurrence sur le solde de garantie non démontrée ;
- politique de précision et d'arrondi insuffisamment formalisée.

Ces constats n'invalident aucune release historique. Un écart critique non traité imposera
`NO GO` au prochain Gate financier applicable.

## 6. Enterprise Delivery Governance

Capacités existantes :

- CI automatisée avec build, tests, couverture, lint, SonarQube, CodeQL, Gitleaks, SCA et Trivy ;
- images GHCR identifiées par tag `sha-<8>` et digests tracés aux promotions ;
- promotions Staging/Production manuelles et distinctes des merges ;
- isolation Staging mutualisée documentée et éprouvée ;
- sauvegardes, rollback, drill historique, smoke tests et observabilité opérationnelle.

Écarts v6.1.1 :

- artefacts Delivery canoniques et CHECK-CICD-01/CHECK-REL-01/CHECK-OPS-01 absents ;
- images scannées puis reconstruites pour publication, donc absence de preuve « build once » ;
- immutabilité du registre non démontrée par une politique empêchant l'écrasement des tags ;
- SBOM, signature et provenance non démontrées ;
- rollback données/infrastructure/flags non agrégé sous CHECK-OPS-01 ;
- observabilité discontinue lorsque l'hôte Production est volontairement éteint ;
- risque historique de publication GHCR interrompue par `cancel-in-progress`.

Les capacités observées sont proches du DCL 3, mais aucun DCL n'est déclaré par cet audit. Une
évaluation formelle et humaine est requise. DCL 4 n'est pas démontré.

## 7. Staging Isolation

`ai-test-server` est mutualisé. ADR-STG-001, STG-ISOL-01, les noms Compose, réseaux, volumes,
ports et déploiements ciblés constituent des preuves historiques recevables. `STG-ISOL-01` n'est
pas rejoué par la migration et demeure bloquant pour chaque prochaine promotion Staging.

## 8. Modèle des agents

Le registre v5.4.1 local ne couvre que cinq rôles. Il doit être synchronisé avec le modèle v6.1.1 :
modèle opératoire, registre, routage et rôles spécialisés Delivery, QA, SRE, Product, Business,
UX/Design et Frontend. Les avis spécialisés ne remplacent ni les preuves, ni les validateurs
humains, ni la décision finale du CDO.

## 9. Incohérences du Project State

Les divergences suivantes doivent être clarifiées additivement sans supprimer les formulations
historiques :

- bloc courant indiquant encore Production `1.13.0` alors que des preuves ultérieures concernent
  `1.14.0` ;
- mentions historiques de `RSV-STG-01` maintenue alors que son registre la clôture ;
- état courant et entrées historiques de `R-V54-2` à réconcilier après traitement du PR #276 ;
- absence des blocs quatre architectures, Financial Governance, Enterprise Delivery, Operations
  Readiness, Release Candidate et DCL v6.1.1.

## 10. Avis des agents

| Agent | Sujet | Avis | Réserves principales |
| --- | --- | --- | --- |
| Governance Officer | Gates, historique, validation | GO pour exécuter la migration ; NO GO pour la déclarer achevée | branche dédiée, Project State, CHECK-VAL-01, audit et validation humaine |
| Enterprise Architect | quatre architectures, UX, finance | GO sous réserve documentaire | dérive DAT, chaîne UX absente, intégrité/concurrence financière |
| DevSecOps Lead / Delivery Architect | CI/CD, promotion, artefact, DCL | GO sous réserve documentaire | build-once, immutabilité, supply chain, DCL non prouvé |
| Release Manager / SRE | release, rollback, opérations | GO sous réserve documentaire | cycle 1.14.0 séparé, télémétrie discontinue, drill courant à qualifier |

## 11. Décision d'audit

**GO sous réserve pour exécuter le Plan d'Exécution documentaire sur une branche dédiée.**

Réserves :

- `RSV-MIG-611-01` — resynchroniser la branche après traitement du PR #276 ; responsable :
  Release Manager ; échéance : avant validation finale ; preuve : diff et historique Git.
- `RSV-MIG-611-02` — exécuter CHECK-VAL-01 et l'auditeur canonique adapté au projet ;
  responsable : Governance Officer ; échéance : avant validation finale ; preuve : rapports.
- `RSV-MIG-611-03` — validation humaine finale obligatoire ; responsable : CDO humain ;
  échéance : avant fusion ; preuve : approbation PR explicite.

**NO GO pour déclarer la migration achevée ou fusionner à ce stade.**
