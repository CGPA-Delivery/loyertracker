# CHECK-OPS-01 - Operations and Observability Checklist

## Objectif

Verifier la readiness operationnelle avant Gate Production, puis cloturer les controles post-release sans confondre les deux decisions.

## Readiness avant Production

* [ ] Logs applicatifs et techniques disponibles.
* [ ] Metriques systeme et applicatives critiques definies.
* [ ] Dashboard disponible selon le risque.
* [ ] Alertes critiques definies et destinataires identifies.
* [ ] Procedure d'escalade et responsables identifies.
* [ ] Smoke tests Production definis.
* [ ] Conditions de rollback observables definies.
* [ ] Avis Site Reliability Engineer trace.

### Resultat pre-Production

* [ ] PASS.
* [ ] PASS sous reserve avec reserves non bloquantes, acceptees, datees et assignees.
* [ ] FAIL.

Un `FAIL` critique bloque Gate Production.

## Verification apres Production

* [ ] Smoke tests executes.
* [ ] Disponibilite, logs et alertes verifies.
* [ ] Erreurs critiques absentes ou traitees.
* [ ] Metriques stables pendant la fenetre convenue.
* [ ] Rollback declenche si les seuils l'exigent.
* [ ] Rapport de release mis a jour.
* [ ] `docs/project-state.md` mis a jour.

### Resultat post-Production

* [ ] PASS et suivi cloture.
* [ ] PASS sous reserve avec suivi assigne et date.
* [ ] FAIL, incident ouvert et decision de rollback ou remediations tracee.

Un `FAIL` critique suspend les promotions suivantes jusqu'a decision tracee.
