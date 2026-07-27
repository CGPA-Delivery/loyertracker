> Statut : support historique CGPA v5.2.1, non canonique pour v6.1.1. Utiliser `release-candidate-workflow.md`, `environment-promotion-workflow.md` et `post-release-monitoring-workflow.md`.

# Workflow - Preparation Production

1. Finaliser QA et recette.
2. Identifier la release selon Semantic Versioning.
3. Produire changelog, release notes et historique des decisions.
4. Verifier les preuves DEVSECOPS-07 lorsque la release provient d'une promotion Staging ou d'un artefact candidat.
5. Executer Gate 07A - Release Readiness.
6. Executer production readiness review.
7. Valider runbooks, rollback, supervision, logs, metriques et alertes critiques.
8. Tenir Gate 09 puis Gate 10.
9. Tracer la promotion vers Production dans `/docs/project-state.md`.

## Livrable final

Decision documentee, release tracee, score mis a jour et actions suivies.
