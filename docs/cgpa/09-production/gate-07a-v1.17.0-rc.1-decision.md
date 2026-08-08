# Gate 07A — Release Readiness `1.17.0-rc.1`

- **Projet :** LoyerTracker
- **Périmètre :** EP-16 / US-125 Notifications
- **Candidat immutable :** `d19c4fea850263c5bfbb92fcb288dd7bd2e56e2a`
- **RC :** `1.17.0-rc.1`
- **Artefact Staging identique :** oui, digests API/Web inchangés
- **Décision technique préparatoire :** **GO sous réserve**
- **Avis indépendants :** `docs/cgpa/09-production/independent-reviews-v1.17.0-rc.1-us125.md` — QA RESERVE, SRE RESERVE, RM/DA GO sous réserve bloquante.
- **`PRODUCTION_READY` :** non prononcé tant que les validations humaines ci-dessous ne sont pas signées

## Éléments vérifiés

- Gate Staging US-125 : GO / STAGING_DEPLOYED.
- STG-ISOL-01 : PASS.
- Smoke Staging : 63 PASS / 0 FAIL.
- CI et contrôles DevSecOps : PASS.
- Artefacts API/Web, SBOM, signatures et attestations : vérifiés.
- R-V54-2 Production : cohérent.
- Préflight Production et backup : PASS.
- CHECK-OPS-01 pré-Production : PASS technique sous réserve d’avis SRE/DA/RM.
- Rollback applicatif et rollback données : documentés.

## Validations humaines obligatoires

| Rôle | Statut | Référence/signature |
|---|---|---|
| QA Lead | À VALIDER | — |
| Release Manager | À VALIDER | — |
| Delivery Architect | À VALIDER | — |
| Site Reliability Engineer | À VALIDER | — |
| Product Owner | **PASS** | Jordan Tshilombo — PO — PASS QA RC 1.17.0-rc.1 — 2026-08-08T23:55:00Z — Référence : commentaire GitHub PR / procès-verbal Gate / signature électronique |
| CDO / Enterprise Architect — décision Gate Production | À VALIDER | — |

## Interdictions

Aucun déploiement Production, aucune migration V32 Production, aucun changement de secret/provider/flag tant que la décision Gate Production explicite n’est pas `GO`.

## Suite

Après signatures et décision CDO/Enterprise Architect :

```text
Gate Production GO explicite
→ pré-déploiement final CHECK-OPS-01
→ déploiement ciblé api + nginx avec les mêmes digests
→ CHECK-OPS-01 post-Production
→ smoke Production
→ hypercare / clôture
```
