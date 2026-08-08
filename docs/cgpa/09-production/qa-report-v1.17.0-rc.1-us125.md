# Rapport QA — `1.17.0-rc.1` / US-125

- **Candidat :** `d19c4fea850263c5bfbb92fcb288dd7bd2e56e2a`
- **Périmètre :** EP-16 / US-125 Notifications
- **Environnement de validation :** Staging `ai-test-server`
- **Statut technique :** PASS
- **Avis QA Lead humain :** à renseigner avant Gate 07A

## Preuves automatisées

| Contrôle | Résultat |
|---|---:|
| Backend build/tests/couverture | PASS |
| Frontend lint/build/tests | PASS |
| CodeQL Java/Kotlin | PASS |
| CodeQL JavaScript/TypeScript | PASS |
| SonarQube | PASS |
| Gitleaks | PASS |
| OWASP Dependency-Check | PASS |
| Trivy | PASS |
| Registry Policy | PASS |
| Audit CGPA | PASS |
| Docker build/scan | PASS |
| SBOM API/Web | PASS |
| Signatures/provenance/attestations | PASS |

## Recette Staging

- Gate Staging US-125 : `GO — STAGING_DEPLOYED`.
- `STG-ISOL-01` avant/après : PASS.
- Smoke canonique réel : **63 PASS / 0 FAIL**.
- Flyway : `32/32`.
- API/Web healthy.
- HTTPS health : `200`.
- Actuator interne : `200` ; Actuator public : `404`.
- JWT Keycloak, AuthZ, ReBAC et isolation cross-tenant : PASS.
- RGPD export/effacement et audit : PASS.
- Ports internes non publiés : PASS.
- Échafaudage d’accès direct révoqué en fin de test.

## Défauts bloquants

Aucun défaut bloquant observé dans la recette Staging exécutée.

## Réserves

- La validation humaine QA Lead n’est pas encore signée.
- La recette métier explicite PO doit être tracée séparément.
- La Production reste inchangée et non autorisée par le présent rapport.

## Avis

- **QA Lead :** `À VALIDER`
- **Release Manager :** `À VALIDER`
- **Product Owner :** `À VALIDER`
