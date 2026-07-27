# Checklist migration CGPA v5.2 vers v5.3

## Compatibilite

* [ ] Version courante identifiee dans `/docs/project-state.md`.
* [ ] `current_version` et `migrated_from` renseignes.
* [ ] Phase courante conservee.
* [ ] Gates deja valides conserves.
* [ ] Historique des decisions conserve.
* [ ] Aucun mecanisme v5.2, v5.2.1 ou anterieur supprime.

## UX/UI Governance

* [ ] Gate 02A applique si le projet comporte une interface utilisateur.
* [ ] Exemption backend/API-only documentee si applicable.
* [ ] Livrables UX-01 a UX-04 verifies ou planifies.

## Release Management Policy

* [ ] D-RM-01 tracee : tout Sprint valide doit etre deploye en Staging.
* [ ] D-RM-02 tracee : Gate Production obligatoire avant Production.
* [ ] D-RM-03 tracee : Production pilotee par Epic, Release ou Hotfix.
* [ ] D-RM-04 tracee : rollback Production documente obligatoire.

## Etats projet

* [ ] `STAGING_READY` ajoute aux statuts possibles.
* [ ] `STAGING_DEPLOYED` ajoute aux statuts possibles.
* [ ] `PRODUCTION_READY` ajoute aux statuts possibles.
* [ ] `PRODUCTION_DEPLOYED` ajoute aux statuts possibles.
* [ ] Bloc Release Management ajoute a `/docs/project-state.md`.

## Gates et workflows

* [ ] Workflow Sprint vers Staging reference.
* [ ] Workflow Staging vers Production reference.
* [ ] Checklist Gate Staging referencee.
* [ ] Checklist Gate Production referencee.
* [ ] Gate 07A articule avec Gate Production.
* [ ] Gate Staging conserve et enrichi.

## Rapport Sprint

* [ ] Statut Staging ajoute.
* [ ] Date de deploiement Staging ajoutee.
* [ ] Validation Product Owner ajoutee.
* [ ] Validation Release Manager ajoutee.
* [ ] Eligibilite Production ajoutee.
* [ ] Decision Gate Production ajoutee.

## Risques

* [ ] RSV-RM-01 evalue : accumulation excessive d'elements en Staging.
* [ ] RSV-RM-02 evalue : derive entre Staging et Production.
* [ ] RSV-RM-03 evalue : rollback non teste.
* [ ] RSV-RM-04 evalue : release contenant plusieurs Epics non valides.

## Validation finale

* [ ] README mis a jour.
* [ ] CHANGELOG mis a jour.
* [ ] AGENTS.md mis a jour.
* [ ] CLAUDE.md mis a jour.
* [ ] `docs/cgpa/README.md` mis a jour.
* [ ] `/docs/project-state.md` mis a jour.
* [ ] Verification documentaire effectuee.
* [ ] Validation pilote planifiee sur un projet consommateur.