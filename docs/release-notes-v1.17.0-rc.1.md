# LoyerTracker `1.17.0-rc.1`

- **Statut :** Release Candidate — non déployée en Production
- **Périmètre :** EP-16 / US-125 Notifications
- **Source applicative :** `d19c4fea850263c5bfbb92fcb288dd7bd2e56e2a`
- **Artefact CI :** [main CI #31280103642](https://github.com/CGPA-Delivery/loyertracker/actions/runs/31280103642)
- **Validation Staging :** Gate Staging US-125 GO, `STG-ISOL-01` PASS, smoke `63 PASS / 0 FAIL`
- **Production :** non déployée ; Gate Production distinct requis

## Artefacts immuables

```text
API: ghcr.io/cgpa-delivery/loyertracker-api@sha256:8e94c002a65bff590c9694b1dd79ca2eb9ab04639f9f59ddb5b735afe001a30d
Web: ghcr.io/cgpa-delivery/loyertracker-web@sha256:18ade4b483955691fedd7d46a2c893ff27facd9d6dcf5249350005080d679d67
Lookup tag: sha-d19c4fea
RC tag: v1.17.0-rc.1
```

L’image RC doit pointer vers ces mêmes digests ; aucune reconstruction ni retag mutable n’est autorisé.

## Fonctionnalités

- Préférences de notifications authentifiées pour Bailleur et Gestionnaire.
- Désinscription contrôlée côté API.
- Historique des notifications avec masquage des destinataires.
- Résolution du sujet exclusivement depuis le JWT.
- Isolation tenant par RLS pour les préférences Bailleur.
- Accès Gestionnaire limité par ReBAC et fonction PostgreSQL fail-closed.
- Migration Flyway V32 additive : provenance `bien_id` et historique ReBAC.
- Dialogue Frontend accessible : focus initial, focus trap, `Escape`, restitution du focus et touch targets.

## Vérifications

- CI Backend/Frontend : PASS.
- CodeQL Java/Kotlin et JavaScript/TypeScript : PASS.
- Gitleaks, OWASP Dependency-Check, Trivy : PASS.
- SonarQube et audit CGPA : PASS.
- Build, scan Trivy, SBOM, publication GHCR, signatures Cosign, provenance et attestations : PASS.
- Staging : Flyway `32/32`, santé `200`, Actuator interne `200`, public `404`.
- Smoke Staging : `63 PASS / 0 FAIL`.
- Rollback applicatif : références Production `1.16.0` conservées ; rollback données couvert par backup pré-Gate.

## Limites et décisions

- Aucun provider, secret, flag externe ou kill-switch n’est activé par cette RC.
- Aucun déploiement Production n’est autorisé par ces release notes seules.
- Avis QA Lead, Release Manager, Delivery Architect, SRE et Product Owner requis avant `PRODUCTION_READY`.
