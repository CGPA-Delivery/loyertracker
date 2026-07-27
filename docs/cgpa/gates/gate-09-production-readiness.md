# Gate 09 - Gate Production / Production Readiness

## Cadre

Ce document est le Gate Production canonique de CGPA v6.1.1. Il autorise ou refuse la mise en Production. Gate 10 controle ensuite l'execution de la promotion autorisee.

## Objectif

Verifier que la Release Candidate exacte validee en Staging peut etre promue en Production avec rollback, observabilite et operations readiness.

## Conditions d'entree

* Gate 07A valide ;
* Release Candidate versionnee, provenancee et immutable ;
* meme artefact valide en Staging, identifie par digest ou identifiant equivalent non ambigu ;
* preuves QA et non-regression disponibles ;
* `CHECK-REL-01` executee ;
* section pre-Production de `CHECK-OPS-01` executee ;
* strategie de rollback et conditions de declenchement documentees ;
* fenetre, responsables et environnement Production identifies.

## Criteres GO

* `CHECK-REL-01` est `PASS` ;
* readiness pre-Production de `CHECK-OPS-01` est `PASS` ;
* Release Candidate immutable et identique a celle validee en Staging ;
* tests critiques, non-regression et validations metier conformes ;
* migrations, secrets et dependances Production controles ;
* rollback realiste, responsable et teste ou demontre selon le risque ;
* logs, metriques, dashboards, alertes, smoke tests et escalade prets ;
* aucun risque bloquant non traite.

## Criteres GO sous reserve

* checklists en `PASS sous reserve` sans echec critique ;
* identite de l'artefact, rollback et observabilite critique conformes ;
* uniquement des reserves non bloquantes, acceptees, assignees et datees.

## Criteres NO GO

* Gate 07A non valide ;
* `CHECK-REL-01` absente ou `FAIL` ;
* readiness pre-Production de `CHECK-OPS-01` absente ou `FAIL` critique ;
* Release Candidate mutable, non tracable ou differente de celle validee en Staging ;
* test critique ou non-regression bloquante en echec ;
* rollback absent, inexecutable ou sans responsable ;
* observabilite ou escalade critique absente ;
* risque securite, conformite, exploitation ou finance bloquant ;
* `CHECK-FIN-01` en `FAIL` bloquant lorsque applicable.

## Avis et decision

* Product Owner : validation metier lorsque applicable ;
* QA Lead : avis qualite et non-regression ;
* Site Reliability Engineer : avis observabilite et operations readiness ;
* Release Manager : avis release, fenetre et rollback ;
* CGPA Chief Delivery Officer : decision finale `GO`, `GO sous reserve` ou `NO GO`.

La decision est consignee avec le template `../templates/go-no-go.md`. Les avis ne remplacent pas la decision du CDO.

## Sortie attendue

* decision Gate Production ;
* statut `PRODUCTION_READY` si le Gate est valide ;
* identite exacte de l'artefact autorise ;
* fenetre et responsables ;
* reserves et actions correctives ;
* mise a jour de `docs/project-state.md`.

## CHECK-FIN-01 - Production Readiness financiere

Lorsque le perimetre financier est applicable, la checklist `../finance/CHECK-FIN-01.md` executee sur le candidat Production est obligatoire. Les preuves couvrent recalcul du ledger, rapprochement, migrations, rollback, concurrence et idempotence. Toute anomalie bloquante d'integrite financiere impose `NO GO`.
