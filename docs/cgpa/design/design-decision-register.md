# Registre des Design Decision Specifications

| DDS | Sujet | Statut | Version DSG | User Stories | Responsable | Date | Remplace par |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DDS-LT-001 | Socle UI PrimeNG, Design Tokens LoyerTracker et continuité visuelle Keycloak | Acceptée (socle) — mise en œuvre subordonnée au Plan d'Exécution `plan-execution-ux-ui-primeng-keycloak.md`, non approuvé | DSG-001 v0.1.0 | EP-17 (US-127→142), US-125 | Product Owner (jptshilombo@gmail.com) — décision de socle ; mise en œuvre : Design Architect, Frontend Architect (à désigner) | 2026-07-30 | — |

Les DDS acceptees ne sont pas supprimees. Une evolution cree une nouvelle DDS ou marque l'ancienne comme remplacee.

## Impacts de DDS-LT-001

* **Périmètre** : socle Frontend (PrimeNG, tokens sémantiques `--lt-*`) et continuité visuelle
  Keycloak (thème login, sans dépendance technique à Angular/PrimeNG).
* **Prochaine revue** : à la clôture du Lot 0 du Plan d'Exécution (vérification de compatibilité
  PrimeNG × Angular 22, choix Option A/B pour la source de tokens partagée) — aucune date fixée
  tant que le Plan d'Exécution n'est pas approuvé.
* **Documents liés** : `ADR-UI-001-socle-frontend-primeng-design-tokens-keycloak.md`,
  `DSG-001.md`, `design-debt-register-loyertracker.md`.
