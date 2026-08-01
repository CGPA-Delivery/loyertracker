# Registre des Design Decision Specifications

| DDS | Sujet | Statut | Version DSG | User Stories | Responsable | Date | Remplace par |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DDS-LT-001 | Socle UI PrimeNG, Design Tokens LoyerTracker et continuité visuelle Keycloak | Acceptée (socle) — mise en œuvre subordonnée au Plan d'Exécution `plan-execution-ux-ui-primeng-keycloak.md`, non approuvé | DSG-001 v0.1.0 | EP-17 (US-127→142), US-125 | Product Owner (jptshilombo@gmail.com) — décision de socle ; mise en œuvre : Design Architect (Claude Code, désigné 2026-07-30), Frontend Architect (Claude Code, désigné 2026-07-31) | 2026-07-30 | — |
| DDS-LT-002 | Emplacement des préférences de notification côté Gestionnaire (ex-DDS-cand-1) | **Acceptée** — Option B (section embarquée), validation Product Owner obtenue le 2026-07-31 | DSG-001 v0.1.0 | US-125 (EP-16) | Design Architect (Claude Code, désigné 2026-07-30) ; Product Owner (jptshilombo@gmail.com) | 2026-07-31 | — |
| DDS-LT-003 | Filtre et pagination de l'historique des notifications (ex-DDS-cand-2) | **Acceptée** — aucun filtre pour ce lot (volume réel Production = 0), validation Product Owner obtenue le 2026-07-31 | DSG-001 v0.1.0 | US-125 (EP-16) | Design Architect (Claude Code, désigné 2026-07-30) ; Product Owner (jptshilombo@gmail.com) | 2026-07-31 | — |
| DDS-LT-004 | Mapping des statuts de livraison Outbox/Delivery vers un vocabulaire d'affichage unique (ex-DDS-cand-3) | **Acceptée** — mapping formalisé tel que proposé, validation Product Owner obtenue le 2026-07-31 | DSG-001 v0.1.0 | US-125 (EP-16) | Design Architect (Claude Code, désigné 2026-07-30) ; Product Owner (jptshilombo@gmail.com) | 2026-07-31 | — |
| DDS-LT-005 | Composant modal de confirmation `lt-confirm-dialog` — premier modal du produit (ex-DDS-cand-4) | **Acceptée** — encapsulation PrimeNG ConfirmDialog + 6 exigences a11y non négociables, validation Product Owner obtenue le 2026-07-31 | DSG-001 v0.1.0 | US-125 (EP-16) | Design Architect (Claude Code, désigné 2026-07-30) ; Product Owner (jptshilombo@gmail.com) | 2026-07-31 | — |
| DDS-LT-006 | Validation visuelle et contraste WCAG 2.2 AA des Design Tokens (US-129) | **Acceptée** — 11/13 tokens conformes tels quels, 2 corrections de couleur approuvées sans réserve (`--lt-border-default`→`#64748b`, `--lt-state-danger-strong`→`#dc2626`), 6 nouvelles catégories de tokens acceptées, validation Product Owner obtenue le 2026-08-01 | DSG-001 v0.1.0 | EP-17 (US-129, Lot 1) | Design Architect (Claude Code, désigné 2026-07-30) ; Product Owner (jptshilombo@gmail.com) | 2026-08-01 | — |

Les DDS acceptees ne sont pas supprimees. Une evolution cree une nouvelle DDS ou marque l'ancienne comme remplacee.

## Impacts de DDS-LT-001

* **Périmètre** : socle Frontend (PrimeNG, tokens sémantiques `--lt-*`) et continuité visuelle
  Keycloak (thème login, sans dépendance technique à Angular/PrimeNG).
* **Prochaine revue** : à la clôture du Lot 0 du Plan d'Exécution (vérification de compatibilité
  PrimeNG × Angular 22, choix Option A/B pour la source de tokens partagée) — aucune date fixée
  tant que le Plan d'Exécution n'est pas approuvé.
* **Documents liés** : `ADR-UI-001-socle-frontend-primeng-design-tokens-keycloak.md`,
  `DSG-001.md`, `design-debt-register-loyertracker.md`.
