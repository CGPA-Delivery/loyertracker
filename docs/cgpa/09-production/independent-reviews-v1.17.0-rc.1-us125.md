# Avis indépendants — RC `1.17.0-rc.1` / US-125

- **Date :** 2026-08-08
- **Candidat :** commit source `d19c4fea850263c5bfbb92fcb288dd7bd2e56e2a`
- **RC :** `v1.17.0-rc.1`
- **API digest :** `sha256:8e94c002a65bff590c9694b1dd79ca2eb9ab04639f9f59ddb5b735afe001a30d`
- **Web digest :** `sha256:18ade4b483955691fedd7d46a2c893ff27facd9d6dcf5249350005080d679d67`
- **Périmètre :** revue indépendante avant Gate Production
- **Méthode :** trois analyses parallèles, strictement documentaires et sans modification d’environnement

## 1. Avis QA indépendant

- **Verdict :** **RESERVE**.
- **Constat :** aucun défaut technique bloquant identifié dans les preuves CI/Staging examinées.
- **Preuves :** Gate Staging GO, `STG-ISOL-01 PASS`, smoke `63 PASS / 0 FAIL`, Flyway `32/32`, CI/DevSecOps PASS, artefacts immuables cohérents.
- **Réserves :** l’avis QA Lead humain et la validation métier PO ne sont pas signés ; l’analyse est fondée sur les documents disponibles et non sur une nouvelle exécution GitHub indépendante.
- **Signature proposée :** `QA Lead — À VALIDER`.

## 2. Avis SRE / Operations indépendant

- **Verdict :** **RESERVE**.
- **Constat :** readiness technique favorable : Production cohérente, santé et observabilité disponibles, backup custom + globals vérifiés, rollback applicatif documenté, V32 additive.
- **Preuves :** `check-release-state.sh --host` COHÉRENT, `/healthz 200`, racine publique 200, Actuator interne 200/public 404, backup `pg_restore --list` 858 entrées.
- **Réserves :** escalade nominative, seuils d’incident quantifiés et responsabilité SRE doivent être explicitement assignés ; les preuves post-déploiement US-125 ne peuvent pas être inventées avant un déploiement autorisé.
- **Signature proposée :** `SRE — À VALIDER`.

## 3. Avis Release Manager / Delivery Architect indépendant

- **Verdict :** **GO sous réserve bloquante / NO GO Production**.
- **Constat :** RC pre-release existante, artefacts immuables cohérents entre Staging et dossier RC, séparation Gate Staging/Gate Production respectée, rollback documenté.
- **Réserves bloquantes :** `CHECK-REL-01` et `CHECK-OPS-01` ne comportent pas encore les signatures QA/RM/DA/SRE/PO ; la décision CDO/Enterprise Architect finale de Gate Production reste à signer.
- **Signatures proposées :** `Release Manager — À VALIDER`, `Delivery Architect — À VALIDER`.

## Consensus indépendant

| Avis | Verdict | Déploiement Production autorisé ? |
|---|---|---:|
| QA | RESERVE | Non |
| SRE / Operations | RESERVE | Non |
| Release Manager / Delivery Architect | GO sous réserve bloquante | Non |

**Consensus : `NO GO` de déploiement Production tant que les validations humaines manquantes ne sont pas explicitement signées.**

## Validations encore requises

- QA Lead : avis formel.
- Product Owner : validation fonctionnelle métier de la RC.
- SRE : acceptation opérationnelle, seuils et escalade.
- Delivery Architect : avis architecture/promotion.
- Release Manager : avis release et rollback.
- CDO / Enterprise Architect : décision finale `GO`, `GO sous réserve` ou `NO GO`.

Ces avis indépendants ne remplacent pas les signatures humaines ; ils rendent le dossier décisionnel explicite et traçable.
