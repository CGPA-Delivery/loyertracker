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

## Annexe d’exécution RC `1.17.0-rc.1`

- **Avis SRE Agent :** PASS ; seuils, rollback, escalade et hypercare définis et confirmés par CDO dans `docs/cgpa/09-production/check-ops-01-v1.17.0-rc.1.md`.
- **Avis Delivery Architect Agent :** PASS ; mêmes digests obligatoires, aucun rebuild.
- **Avis Release Manager Agent :** PASS ; plan dans `docs/cgpa/09-production/release-execution-plan-v1.17.0-rc.1.md`.
- **Avis QA Agent :** PASS ; rapport QA mis à jour.
- **Résultat pré-Production :** PASS sous réserve non bloquante.
- **Réserves avant exécution :** CHECK-OPS-01 final et instruction opérationnelle explicite ; référence documentaire [PR #410](https://github.com/CGPA-Delivery/loyertracker/pull/410).
- **Production :** aucun déploiement exécuté.
