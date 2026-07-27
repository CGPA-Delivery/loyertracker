# Gate 10 - Mise en Production

## Cadre

Gate actif CGPA v6.1.1. Gate 09 / Gate Production autorise la promotion ; Gate 10 atteste son execution controlee et la verification post-release. La procedure detaillee reste dans les workflows, hors du LOT 3.

## Conditions d'entree

* Gate Production valide et decision tracable ;
* statut `PRODUCTION_READY` ;
* fenetre et responsables confirmes ;
* artefact a deployer strictement identique a l'artefact immutable autorise ;
* rollback disponible ;
* section pre-Production de `CHECK-OPS-01` validee.

## Criteres GO

* artefact autorise deploye sans substitution ;
* migrations et configuration appliquees comme approuve ;
* smoke tests Production conformes ;
* logs, metriques et alertes verifies ;
* section post-Production de `CHECK-OPS-01` completee ;
* aucun incident critique ouvert ;
* statut `PRODUCTION_DEPLOYED` et preuves traces.

## Criteres GO sous reserve

* deploiement conforme et service stable ;
* uniquement des anomalies non bloquantes ;
* reserves acceptees, assignees et datees ;
* suivi post-release maintenu jusqu'a cloture.

## Criteres NO GO

* Gate Production absent, expire ou non tracable ;
* artefact different de celui autorise ;
* echec critique de migration, smoke test, securite ou disponibilite ;
* observabilite critique indisponible ;
* rollback requis mais non declenchable ;
* `CHECK-OPS-01` post-Production en `FAIL` critique ;
* `CHECK-FIN-01` en `FAIL` bloquant lorsque applicable.

## Avis et decision

* QA Lead : avis smoke tests et non-regression ;
* Site Reliability Engineer : avis stabilite et observabilite ;
* Release Manager : avis d'execution et de rollback ;
* CGPA Chief Delivery Officer : decision finale `GO`, `GO sous reserve` ou `NO GO`.

La decision est consignee avec le template `../templates/go-no-go.md`.

## Sortie attendue

* statut `PRODUCTION_DEPLOYED` ou rollback trace ;
* resultat post-Production de `CHECK-OPS-01` ;
* incidents, reserves et actions ;
* mise a jour de `docs/project-state.md`.

## CHECK-FIN-01 - Autorisation de mise en Production

Lorsque le perimetre financier est applicable, la checklist `../finance/CHECK-FIN-01.md` doit etre a jour. Le rollback preserve le ledger et l'audit trail. Un `FAIL` bloquant d'integrite financiere impose `NO GO`.
