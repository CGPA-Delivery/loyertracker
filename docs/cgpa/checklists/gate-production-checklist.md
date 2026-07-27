# Checklist — Gate Production

## Contrôle d'entrée — verrou d'état de release (R-V54-2)

**À exécuter en premier, avant tout autre contrôle.** Détecte un déploiement Production réalisé
sans mise à jour de la documentation — écart survenu deux fois (`1.11.0`, `1.14.0`).

- [ ] `bash infra/release/check-release-state.sh --host` exécuté sur l'hôte de production —
      **exit 0**, aucun écart entre l'état déclaré (`infra/release/production-state.env`) et
      l'état réel (tag `.env`, compteur Flyway en base, digests des conteneurs).
- [ ] En cas de **DÉRIVE**, ne pas poursuivre le Gate : régulariser d'abord l'écart de
      traçabilité (rapport de déploiement technique a posteriori), puis reprendre.

## Identification

- [ ] Périmètre Production identifié : Epic, Release ou Hotfix.
- [ ] Version Semantic Versioning identifiée.
- [ ] Artefact, commit ou image identifié.
- [ ] Environnement source identifié.
- [ ] Environnement cible Production identifié.

## Preuves Staging

- [ ] Éléments candidats déployés ou vérifiés en Staging.
- [ ] Statut Staging renseigné.
- [ ] Smoke tests Staging exécutés ou réserves acceptées.
- [ ] Défauts bloquants résolus ou risque accepté.
- [ ] Accumulation Staging analysée.
- [ ] Gate `STG-ISOL-01` du déploiement Staging amont vérifié `PASS` (CGPA v5.4) — un `FAIL` non
  excepté sur le Staging amont bloque le Gate Production.

## Validation fonctionnelle

- [ ] Epic terminé et validé, ou Release fonctionnelle validée, ou Hotfix validé.
- [ ] Validation Product Owner obtenue.
- [ ] Validation Release Manager obtenue.
- [ ] Release notes disponibles.
- [ ] Changelog disponible.

## Contrôles techniques et DevSecOps

- [ ] Build ou artefact Production vérifiable.
- [ ] Tests critiques OK.
- [ ] Contrôles DevSecOps applicables disponibles.
- [ ] SonarQube vérifié si applicable.
- [ ] Migrations Production préparées si applicables.
- [ ] Observabilité minimale définie.
- [ ] Secrets Production non exposés.

## Rollback

- [ ] Stratégie de rollback documentée.
- [ ] Responsable rollback identifié.
- [ ] Conditions de déclenchement du rollback définies.
- [ ] Procédure de restauration testée ou réserve explicitement acceptée.
- [ ] Données et migrations prises en compte.

## Décision

- [ ] Décision GO, GO sous réserve ou NO GO formulée.
- [ ] Réserves documentées, datées et assignées.
- [ ] Statut `PRODUCTION_READY` renseigné si le Gate est validé.
- [ ] Date de déploiement Production renseignée après déploiement.
- [ ] Statut `PRODUCTION_DEPLOYED` renseigné après déploiement effectif.
