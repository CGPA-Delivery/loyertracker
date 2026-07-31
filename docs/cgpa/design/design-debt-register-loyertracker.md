# Design Debt Register — LoyerTracker

| ID | Constat | Criticité | Responsable | Échéance | Preuve attendue | Statut |
| --- | --- | --- | --- | --- | --- | --- |
| DD-611-01 | UXR-001 projet non renseigné | Majeur | UX/UI Design Lead | Prochain lot Frontend significatif | UXR-001 revu et lié au lot | **Préparé** — instancié pour US-125 (2026-07-30) puis étendu en base de recherche produit (socle EP-17, 2026-07-30) ; revue humaine par un UX/UI Design Lead désigné toujours requise avant clôture |
| DD-611-02 | DDS-001/DSG-001 et inventaire composants non instanciés | Majeur | Design Architect | Avant Gate 04A du prochain lot UI | DDS, DSG, inventaire et décision Gate | **En traitement** — `DSG-001.md` instancié en version 0.1.0 Proposé, `component-inventory-loyertracker.md`/`screen-inventory-loyertracker.md` créés ; **non clos** : aucun composant implémenté, validation Design Architect non obtenue |
| DD-611-03 | Traçabilité Story-écran-composant-test incomplète | Majeur | Frontend Architect | Avant développement du prochain lot UI | matrice de traçabilité approuvée | **En traitement** — `traceability-ui-loyertracker.md` créée (2026-07-30) ; **non close** : approbation Frontend Architect non obtenue, cases majoritairement « À définir » |
| DD-611-04 | Régression visuelle non industrialisée | Mineur | Design QA | Avant prochain Gate Staging UI selon risque | rapport Visual Review ou exemption approuvée | Ouvert — inchangé |

## Nouvelles dettes identifiées (cadrage socle UI PrimeNG/Keycloak, 2026-07-30)

| ID | Constat | Criticité | Responsable | Échéance | Preuve attendue | Statut |
| --- | --- | --- | --- | --- | --- | --- |
| DD-EP17-01 | Aucun thème Keycloak personnalisé : continuité visuelle Angular/IdP inexistante (login/mot de passe oublié/erreurs au thème par défaut) | Majeur | Design Architect, Security Architect Keycloak | Avant Lot 4 du Plan d'Exécution | Thème livré en Staging isolé + Gate Staging dédié | Ouvert |
| DD-EP17-02 | Aucun état « accès refusé »/404 uniforme côté client (403 serveur non traduit, fallback `**` silencieux vers `/bailleur`) | Majeur | Frontend Architect | Avant migration des écrans concernés | `lt-error-state` implémenté et testé | Ouvert |
| DD-EP17-03 | Aucune source de tokens partagée entre Angular et Keycloak ; choix Option A (JSON) vs Option B (CSS commun) non tranché formellement | Majeur | Design Architect | Avant Lot 4 du Plan d'Exécution | Décision tracée (DDS dédiée si nécessaire) + implémentation | Ouvert |
| DD-EP17-04 | Hétérogénéité de composants : le patron `.panel`/`.panel-head`/`.toolbar`/`.list`/`.row` est dupliqué à l'identique dans au moins 4 composants (`AlertesListeComponent`, `AuditJournalComponent`, deux dashboards) | Mineur | Frontend Architect | Lot 2 du Plan d'Exécution | `lt-data-table`/`lt-section-card` livrés et adoptés | Ouvert |
| DD-EP17-05 | Premier composant modal du produit (`lt-confirm-dialog`, requis par US-125) sans aucun précédent de focus-trap/restitution du focus dans le code existant | Majeur | Design Architect | Avant tout dialogue modal en Production | Test d'accessibilité dédié (`CHECK-ACCESSIBILITY-01`) | Ouvert |
| DD-EP17-06 | Valeurs de spacing non normalisées (échelle observée `0.35rem`→`1.5rem`, aucune convention de tokens) | Mineur | Design Architect | Lot 1 du Plan d'Exécution | Tokens `--lt-space-*` définis et adoptés | Ouvert |
| DD-EP17-07 | Aucun sélecteur de test (`data-testid` ou équivalent) dans les composants existants | Mineur | Frontend Architect | Si des tests end-to-end sont introduits (non planifiés à ce jour) | Convention de nommage définie et appliquée | Ouvert |
| DD-EP17-08 | Aucune stratégie d'état documentée : les services (`profil.service.ts`, `s02/s03/s04-api.service.ts`, etc.) exposent des `Observable` consommés directement par des champs de composant, sans signal ni store, jamais formalisée ni justifiée (`frontend-architecture.md` §State Management non instancié) ; `ADR-UI-001` ne couvre pas ce sujet | Majeur | Frontend Architect | Avant Lot 2 du Plan d'Exécution (composants transverses `lt-data-table`/`lt-form-field` devant gérer un état propre) | Stratégie d'état documentée (local/partagé/serveur, cache, invalidation, erreurs, concurrence) dans `ADR-UI-001` ou une DDS dédiée | Ouvert — identifié par l'avis Frontend Architect (2026-07-31, `CHECK-FRONTEND-01-ep17-ui-foundation.md`) |

Ce registre ne rejoue pas les Gates historiques. Une exemption n'est recevable que pour un lot
strictement sans impact UI, avec justification dans le Project State. Aucune dette ci-dessus n'est
close par ce cadrage documentaire — seules les preuves déjà produites sont créditées, conformément
au Validation Framework CGPA v6.1.1 (§5, une preuve non produite est `non exécutée`, jamais
supposée).
