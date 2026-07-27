# Architecture Technique — LoyerTracker

## Runtime et infrastructure

Java 21/Spring Boot, Angular, PostgreSQL, Keycloak, Nginx et Docker Compose. Dev/Test, Staging et
Production sont distincts. Staging est mutualisé sur `ai-test-server`, Production sur un hôte
dédié.

## Sécurité et secrets

RLS/FORCE RLS, OIDC/PKCE, CSP, Gitleaks, CodeQL, SonarQube, Trivy et secrets hors dépôt.
`STG-ISOL-01` est bloquant sur Staging mutualisé.

## CI/CD et promotion

La stratégie projet existante `../environment-promotion-model.md` est conservée. Les artefacts
v6.1.1 `../delivery/` la normalisent sans créer une seconde chaîne. Les images sont identifiées
par tag `sha-<8>` et digests aux Gates ; le prochain changement CI/CD doit démontrer
CHECK-CICD-01 et traiter le risque build-once.

## Données, sauvegarde et rollback

Flyway, sauvegardes vérifiées, restauration et rollback par tag précédent sont documentés.
L'applicabilité application/données/infrastructure/flags est instruite dans CHECK-REL-01 et
CHECK-OPS-01 pour chaque future RC.

## Observabilité et continuité

Logs JSON, Actuator, Prometheus, Alertmanager, Blackbox et Pushgateway sont exploités. Les fenêtres
où l'hôte est volontairement éteint rendent la télémétrie discontinue ; cette limite interdit de
déclarer DCL 4 sans qualification et preuves complémentaires.
