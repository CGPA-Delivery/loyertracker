# Checklist DevSecOps

- [ ] CI configuree.
- [ ] Build reproductible.
- [ ] Tests automatises executables.
- [ ] SAST prevu ou execute selon le risque.
- [ ] SCA prevu ou execute selon le risque.
- [ ] Analyse statique de qualite du code executee avant promotion Staging.
- [ ] Analyse automatisee des vulnerabilites executee avant promotion Staging.
- [ ] Quality gates du projet definis et satisfaits avant promotion Staging.
- [ ] Rapport DEVSECOPS-07 disponible, tracable et archivable.
- [ ] Secrets geres hors code.
- [ ] Images de conteneurs analysees si le projet utilise des conteneurs.
- [ ] Dependances critiques surveillees.
- [ ] Environnements Dev/Test/Staging/Production definis.
- [ ] Staging et Production distincts.
- [ ] Release et rollback documentes.
- [ ] Gate 06A - DevSecOps Readiness renseigne si applicable.

## Decision

- Resultat: Conforme / Conforme sous reserve / Non conforme.
- Reserves:
- Actions correctives:

## Isolation des environnements mutualises

- [ ] Stack et nom Docker Compose propres au projet.
- [ ] Reseau et volumes isoles.
- [ ] Secrets et variables isoles.
- [ ] Reverse proxy configure si le serveur Staging est partage.
- [ ] Pipeline CI/CD limite aux ressources du projet.
- [ ] Aucune commande Docker globale dangereuse.
- [ ] STG-ISOL-01 executable et tracable.
