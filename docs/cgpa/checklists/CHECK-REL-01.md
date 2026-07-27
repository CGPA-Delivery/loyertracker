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
