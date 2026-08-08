# CHECK-REL-01 - Release Readiness Checklist

## Objectif

Verifier qu'une Release Candidate est prete pour Gate 07A puis Gate Production.

## Identification release

* [ ] Type et perimetre de release identifies.
* [ ] Version conforme a SemVer, CalVer ou une convention documentee.
* [ ] Release Candidate identifiee par provenance, digest ou identifiant immutable.
* [ ] Artefact strictement identique a celui valide en Staging.
* [ ] Changelog et release notes disponibles.

## Preuves Staging et QA

* [ ] Deploiement Staging trace pour la meme Release Candidate.
* [ ] Tests fonctionnels, techniques et non-regression critiques conformes.
* [ ] Defauts bloquants absents.
* [ ] Rapport QA disponible.
* [ ] Avis QA Lead trace.

## Validations

* [ ] Validation metier tracee si applicable.
* [ ] Validation technique et securite tracees.
* [ ] Validation UX/UI tracee si applicable.
* [ ] Validation financiere tracee si applicable.
* [ ] Avis Delivery Architect trace.
* [ ] Avis Release Manager trace.
* [ ] Decision Gate 07A du CGPA Chief Delivery Officer tracee.

## Rollback

* [ ] Rollback applicatif documente.
* [ ] Rollback donnees et configuration documente si applicable.
* [ ] Conditions, responsable et preuve de test ou demonstration traces.
* [ ] Plan de communication incident defini selon le risque.

## Production readiness

* [ ] Environnement Production, secrets et migrations identifies.
* [ ] Observabilite prete.
* [ ] `CHECK-OPS-01` pre-Production preparee.
* [ ] Gate Production planifie.

## Resultat

* [ ] PASS.
* [ ] PASS sous reserve avec reserves non bloquantes, acceptees, datees et assignees.
* [ ] FAIL.

Un `FAIL` bloque Gate 07A et Gate Production.

## Annexe d’exécution — RC `1.17.0-rc.1` / US-125

- **Projet :** LoyerTracker
- **Périmètre :** EP-16 / US-125 Notifications
- **Release Candidate :** `1.17.0-rc.1`
- **Commit source immutable :** `d19c4fea850263c5bfbb92fcb288dd7bd2e56e2a`
- **API :** `ghcr.io/cgpa-delivery/loyertracker-api@sha256:8e94c002a65bff590c9694b1dd79ca2eb9ab04639f9f59ddb5b735afe001a30d`
- **Web :** `ghcr.io/cgpa-delivery/loyertracker-web@sha256:18ade4b483955691fedd7d46a2c893ff27facd9d6dcf5249350005080d679d67`
- **Artefact identique à Staging :** oui
- **Release notes :** `docs/release-notes-v1.17.0-rc.1.md`
- **Rapport QA :** `docs/cgpa/09-production/qa-report-v1.17.0-rc.1-us125.md`
- **Gate Staging :** `docs/cgpa/07-devsecops/gate-staging-us125-decision.md`
- **Gate 07A :** `docs/cgpa/09-production/gate-07a-v1.17.0-rc.1-decision.md`
- **Avis indépendants :** `docs/cgpa/09-production/independent-reviews-v1.17.0-rc.1-us125.md`
- **CHECK-OPS-01 pré-Production :** `docs/cgpa/09-production/check-ops-01-v1.17.0-rc.1.md`

### Résultat CHECK-REL-01 pour `1.17.0-rc.1`

| Critère | Résultat | Preuve |
|---|---:|---|
| Périmètre et version identifiés | PASS | EP-16 / US-125 / `1.17.0-rc.1` |
| RC immutable et artefact identique Staging | PASS | commit + digests API/Web |
| Changelog et release notes | PASS | release notes + CHANGELOG |
| Staging, smoke et non-régression | PASS | Gate Staging, `STG-ISOL-01`, smoke `63/0`, Flyway `32/32` |
| Défauts bloquants | PASS | Aucun défaut bloquant observé |
| Avis QA Agent | PASS | Rapport QA ; avis non humain accepté par CDO |
| Validation métier PO | PASS | Validation Jordan Tshilombo du `2026-08-08T23:55:00Z` |
| Avis Delivery Architect Agent | PASS | Avis agent accepté par CDO |
| Avis Release Manager Agent | PASS après clôture du plan de release | Plan de release RC |
| Décision Gate 07A | PASS | Décision CDO `GO / PRODUCTION_READY` |
| Rollback applicatif/données | PASS | CHECK-OPS-01 + backup hashé |
| CHECK-OPS-01 pré-Production | PASS sous réserve du plan opérationnel final | `check-ops-01-v1.17.0-rc.1.md` |

### Conclusion CHECK-REL-01

**PASS sous réserve non bloquante**, les réserves opérationnelles étant traitées dans `CHECK-OPS-01` et le plan de release RC. Aucun déploiement Production n’est autorisé par cette checklist seule.
