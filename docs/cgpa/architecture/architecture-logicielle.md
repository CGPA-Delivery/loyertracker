# Architecture Logicielle — LoyerTracker

## Statut

Vue additive CGPA v6.1.1. Source détaillée :
`../05-architecture-conception/dossier-architecture.md` et ADR-01 à ADR-18.

## Composants et domaines

- Frontend Angular.
- API Spring Boot, monolithe modulaire.
- PostgreSQL avec Flyway, RLS et fonctions `SECURITY DEFINER`.
- Keycloak OIDC/PKCE.
- Nginx, génération PDF/QR et intégrations de notification gouvernées.

Domaines : identité/tenant, patrimoine, baux/personnes, paiements/honoraires, garanties, quittances,
fin de bail, alertes/audit et notifications/outbox.

## Contrats, données et erreurs

Les contrôleurs, DTO, migrations V1 à V28, tests d'intégration et ADR constituent les preuves
actuelles. L'isolation cross-tenant, l'idempotence, les erreurs sans oracle et les contraintes
d'intégrité sont contrôlées selon le risque.

## Stratégie de tests

Tests unitaires, intégration Testcontainers, sécurité/RLS, Frontend Karma, smoke stack complète et
validations live Staging/Production. Les résultats historiques restent rattachés à leur commit.

## Écarts actifs

- le dossier d'architecture principal doit recevoir un addendum EP-16/V27/V28 ;
- l'inventaire ADR annoncé dans ce dossier est périmé ;
- aucun contrat OpenAPI figé n'a été trouvé ;
- concurrence et immutabilité du ledger Garantie nécessitent un Plan d'Exécution avant correction.

Ces écarts sont documentaires ou futurs ; ils ne rejouent aucun Gate historique.
