> Statut : support historique non canonique. Utiliser `gate-staging-checklist.md` pour tout nouveau passage Gate Staging.

# Checklist Staging Readiness

## Conditions sprint

* [ ] Sprint cloture
* [ ] Plan d'Execution respecte
* [ ] Rapport d'execution present
* [ ] Stories terminees ou explicitement reportees

## Qualite technique

* [ ] Build stable
* [ ] Tests unitaires OK
* [ ] Tests d'integration critiques OK
* [ ] Analyse statique de qualite du code executee
* [ ] Analyse automatisee des vulnerabilites executee
* [ ] Quality gates definis par le projet satisfaits
* [ ] Resultats DevSecOps disponibles pour audit
* [ ] Migrations DB verifiees
* [ ] Dette technique documentee

## Securite et exploitation

* [ ] Secrets non exposes
* [ ] Variables d'environnement controlees
* [ ] Rollback identifie
* [ ] Logs disponibles
* [ ] Monitoring actif
* [ ] Alertes critiques definies
* [ ] Environnement staging disponible

## Validation staging

* [ ] Smoke tests definis
* [ ] Validateur fonctionnel identifie
* [ ] Risques residuels documentes
* [ ] `../templates/staging-state.md` pret a etre renseigne
* [ ] `../../project-state.md` pret a etre mis a jour

## Isolation Staging partage

* [ ] Nom Compose unique.
* [ ] Reseau et volumes propres au projet.
* [ ] Secrets et variables propres au projet.
* [ ] Reverse proxy et nom DNS verifies.
* [ ] Pipeline limite aux ressources du projet.
* [ ] STG-ISOL-01 : PASS.
