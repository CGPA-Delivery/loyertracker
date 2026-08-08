# Rapport QA — `1.17.0-rc.1` / US-125

- **Candidat :** `d19c4fea850263c5bfbb92fcb288dd7bd2e56e2a`
- **Périmètre :** EP-16 / US-125 Notifications
- **Environnement de validation :** Staging `ai-test-server`
- **Statut technique :** PASS
- **Avis QA Lead Agent :** **PASS** — avis produit par un sous-agent QA non humain, fondé sur les preuves CI/Staging/DevSecOps disponibles et accepté par la décision CDO / Enterprise Architect du `2026-08-08T23:21:44Z`.
- **Limite de portée :** cet avis ne constitue pas une signature humaine QA Lead ; la validation humaine distincte est portée par la décision CDO / Enterprise Architect et par la validation Product Owner tracée séparément.

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

- Aucune réserve technique bloquante QA n’est identifiée sur la RC `1.17.0-rc.1`.
- L’avis QA ci-dessus est un avis de sous-agent QA non humain ; il ne doit pas être présenté comme une signature humaine QA Lead.
- La validation Product Owner est tracée séparément : Jordan Tshilombo — Product Owner — `PASS QA RC 1.17.0-rc.1` — `2026-08-08T23:55:00Z`.
- La décision CDO / Enterprise Architect accepte les avis des sous-agents QA, SRE, Delivery Architect et Release Manager : Jordan Tshilombo — CDO / Enterprise Architect — `GO / PRODUCTION_READY` — `2026-08-08T23:21:44Z`.
- La Production reste inchangée et non déployée ; tout déploiement exige CHECK-OPS-01 final et instruction opérationnelle explicite.

## Avis

| Rôle / avis | Statut | Référence |
|---|---|---|
| QA Lead Agent — non humain | **PASS** | Preuves CI/Staging/DevSecOps listées dans ce rapport ; avis accepté par décision CDO / Enterprise Architect du `2026-08-08T23:21:44Z` |
| Product Owner | **PASS** | Jordan Tshilombo — PO — `PASS QA RC 1.17.0-rc.1` — `2026-08-08T23:55:00Z` |
| CDO / Enterprise Architect | **GO / PRODUCTION_READY** | Jordan Tshilombo — `2026-08-08T23:21:44Z` |
| Release Manager Agent | Avis accepté par CDO | Voir `independent-reviews-v1.17.0-rc.1-us125.md` et Gate 07A |
| Delivery Architect Agent / SRE Agent | Avis acceptés par CDO | Voir `independent-reviews-v1.17.0-rc.1-us125.md` et CHECK-OPS-01 |

**Conclusion QA Lead Agent : PASS défendable sur la RC `1.17.0-rc.1`, sans défaut bloquant observé, sous réserve de ne pas présenter cet avis comme une signature humaine.**
