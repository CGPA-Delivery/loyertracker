# Audit phase 1 — Cycle de vie du bail, statut du bien, historique, échéancier

- **Date** : 2026-10-09
- **Périmètre** : `loyertracker` (backend Spring Boot, frontend Angular), référence `LoyerPro` (`C:\devtools\workspaces\LoyerPro`)
- **Nature** : audit en lecture seule. Aucun code modifié, aucun test exécuté.
- **Statut** : rapport d'audit, à valider par le PO/CDO. Aucune promotion.

## 1. Décisions du PO intégrées

| # | Question | Décision |
|---|---|---|
| D1 | Effet d'une interruption de bail | **Prospectif.** Pas de rétroactivité. |
| D2 | Modèle patrimoine | Un patrimoine contient **un ou plusieurs biens** (appartement, boutique, bureau, etc.). Un patrimoine peut appartenir à **un ou plusieurs bailleurs**. Un ou plusieurs gestionnaires peuvent être assignés à un ou plusieurs patrimoines. |
| D3 | Modification de locataire par le gestionnaire | **Approuvée par l'un des bailleurs** du patrimoine concerné. Un seul approbateur suffit. |
| D4 | Échéancier restant à l'interruption | **Clôturé** (les échéances futures ne sont pas supprimées, elles passent à un statut clôturé). |
| D5 | Bien en préavis | **Reste loué** jusqu'à la date d'effet de fin. |

## 2. Constats

Sévérité : **Bloquant** = empêche un usage métier correct. **Majeur** = règle métier fausse ou risque financier. **Mineur** = dette ou cohérence.

| ID | Sévérité | Constat | Preuve | Lien problème PO |
|---|---|---|---|---|
| C1 | Bloquant | Un bien ne repasse jamais à `LIBRE` par le code. `Bien` ne sait que passer à `LOUE` et `ARCHIVE`. La clôture d'un bail ne touche pas au bien. | `backend/src/main/java/com/loyertracker/biens/Bien.java:58-64` ; `backend/src/main/java/com/loyertracker/baux/BailService.java:147-186` | P2 |
| C2 | Bloquant | Un bien resté `LOUE` après clôture bloque la création d'un nouveau bail (`creer` exige `LIBRE`). Le seul moyen de le libérer est une saisie manuelle du statut. | `BailService.java:75-77` ; `backend/src/main/java/com/loyertracker/biens/BienService.java:71` (statut saisi librement) | P2 |
| C3 | Majeur | La contrainte d'unicité ne porte que sur « un seul bail ACTIF par bien ». Elle ne lie pas le statut du bien au bail : un bien peut être `LIBRE` avec un bail `CLOS`, ou être reloué à la main. | `backend/src/main/resources/db/migration/V1__init_schema.sql:159` | P2 |
| C4 | Majeur | Pas d'état « interrompu ». `StatutBail` ne contient que `ACTIF` et `CLOS`. Une résiliation n'a donc pas de traçabilité propre. | `backend/src/main/java/com/loyertracker/baux/StatutBail.java` | P1 |
| C5 | Majeur | Pas de motif de fin, pas de date d'effet distincte. La clôture saisit une seule date (`dateClotureEffective`), sans motif. | `backend/src/main/java/com/loyertracker/baux/ClotureRequest.java` | P1 |
| C6 | Majeur | Les impayés ne bloquent pas la clôture : seulement un avertissement. Les échéances impayées restent sans règle de sortie. | `BailService.java:170-180` | P1 |
| C7 | Majeur | Les échéances futures sont **supprimées physiquement** à la clôture (`deleteBy...`). Cela efface la trace financière, contraire à la Financial Governance et à la décision D4. | `BailService.java:176` ; `backend/src/main/java/com/loyertracker/paiements/PaiementRepository.java:31` | P1, P6 |
| C8 | Majeur | Modification de locataire appliquée immédiatement, sans approbation du bailleur. Seule une entrée d'audit est écrite. | `backend/src/main/java/com/loyertracker/locataires/LocataireService.java:90-96` | P4 |
| C9 | **Majeur (nouveau)** | Le locataire est lié à **un seul bailleur** (`bailleur_id`, RLS, ADR-01). Ce modèle est incompatible avec D2 (patrimoine multi-bailleurs) et avec D3 (approbation par l'un des bailleurs). Un ADR est requis avant tout développement. | `backend/src/main/java/com/loyertracker/locataires/Locataire.java:19-35` | P3, D2, D3 |
| C10 | Partiel | Un historique existe côté API : `BailService.historique`, `AffectationService.historique`, `LocataireService.historique`. Son affichage sur la fiche bien n'est pas confirmé. | `BailService.java:120` | P5 |
| C11 | Partiel | L'échéancier est rattaché à la vue bien (`frontend/src/app/paiements/paiements-bien.component.ts`). Une page autonome n'est pas confirmée. | fichier cité | P6 |
| C12 | Positif | Le multi-baux par locataire est déjà permis : l'unicité ne porte que sur le bien. | `V1__init_schema.sql:159` | P3 |
| C13 | Mineur | Les contrôles d'accès existent (`@PreAuthorize`, `peutAccederBien`). Leur couverture bout en bout n'est pas auditée. | `backend/src/main/java/com/loyertracker/locataires/LocataireController.java:29` | — |

### Cause racine

L'état du bien (`Bien.statut`) est une donnée stockée, mise à jour à la main ou au mauvais moment. Elle n'est pas dérivée du bail. Elle peut donc diverger de la réalité juridique (C1, C2, C3).

## 3. Référence LoyerPro (à reprendre en concept)

Référence : `C:\devtools\workspaces\LoyerPro\repo-backend\src\main\java\cd\ceni\loyerpro\repobackend\service\impl\LeaseServiceImpl.java`. Aucun fichier LICENSE trouvé à la racine de LoyerPro (vérifié) : licence **non confirmée** par le PO. Aucun code copié ; concepts reformulés uniquement (voir §6).

- **Chevauchement par dates** (`checkForOverlappingLeases`, lignes 118-160) : contrôle par période, pas par statut stocké.
- **Blocage de clôture** (`enforceNoOpenChargesForLease`) : interdit de suspendre ou annuler un bail tant que des échéances sont dues ou partiellement payées.
- **Statut explicite** (`LeaseStatus` : `DRAFT`, `ACTIVE`, `EXPIRED`, `TERMINATED`, `RENEWED`) : distingue fin naturelle et résiliation.
- **Occupation de l'unité** : pas de mise à jour de statut dans `LeaseServiceImpl`. À confirmer dans `UnitServiceImpl` (non audité).

## 4. Non vérifié

- Navigation complète de la fiche bien et des routes enfants lazy (`frontend/src/app/app.routes.ts`).
- Tests : `mvn verify` et tests frontend non exécutés.
- Données réelles : biens `LOUE` sans bail actif, ou `LIBRE` avec bail actif. Requête en lecture seule à faire.
- LoyerPro : `UnitServiceImpl`, `lease-schedule` et tests non audités.

## 5. Gouvernance

- `docs/project-state.md` signale une réserve : la migration Spring Boot 4 a été fusionnée avant approbation de son plan. Non traité ici, mais à garder ouvert.
- Ce rapport ne vaut pas autorisation de code. Le plan d'exécution (`docs/cgpa/06-planification-agile/plan-execution-cycle-bail.md`) doit être approuvé avant toute écriture applicative.

## 6. Révision de l'audit après vérification du code (2026-10-09, seconde passe)

Constats revérifiés dans le code. Les corrections ci-dessous **remplacent** les lignes correspondantes du tableau §2.

| ID | Statut | Correction | Preuve |
|---|---|---|---|
| C1 | **Confirmé** | `cloturer` ne touche jamais le bien. Le test d'intégration l'admet : « aucun endpoint applicatif ne remet Bien.statut à LIBRE après clôture » et force `UPDATE bien SET statut='LIBRE'` en SQL. | `BailService.java:147-186` ; `BailClotureIntegrationTest.java:139-141` |
| C2 | **Confirmé + aggravé** | Le seul moyen de libérer est `PUT /api/biens/{id}` (rôle BAILLEUR seul). Le Gestionnaire ne peut donc pas libérer un bien. `BienRequest.statut` accepte `LOUE` ou `LIBRE` sans lien avec un bail : un bien peut être marqué `LOUE` sans bail, ou `LIBRE` avec bail ACTIF. | `BienController.java:46-47` ; `Bien.java:modifier` ; `BienService.java:modifier` |
| C3 | **Reformulé** | La garantie base « un seul bail ACTIF par bien » **existe** : `uq_bail_actif` (index unique partiel). Le défaut n'est pas l'unicité mais l'absence de lien bail ↔ `bien.statut` (état stocké, non dérivé). Contrôle applicatif double dans `creer` et `rouvrir`. | `V1__init_schema.sql:159` ; `BailService.java:75-82` |
| C7 | **Confirmé** | Purge physique des `A_VENIR` postérieurs au mois de clôture (ADR-17 K6 / US-117). Les paiements `RECU`, `PARTIEL`, `EN_RETARD`, `IMPAYE` ne sont pas supprimés. Le risque financier porte donc sur les seules échéances futures, et c'est une décision d'ADR antérieure à reconsidérer (D4). | `BailService.java:176` |
| C8 | **Corrigé** | Aujourd'hui `LocataireController` est réservé au rôle **BAILLEUR** (classe entière). Un Gestionnaire **ne peut pas** modifier un locataire : P4 est une capacité nouvelle, pas la mise sous approbation d'un flux existant. Journal d'audit sans avant/après : `AuditService.enregistrer` n'écrit que acteur, action, type, id. | `LocataireController.java:29` ; `AuditService.java:76-84` |
| C10 | **Précisé** | `GET /api/biens/{id}/baux` renvoie l'historique des baux d'un bien avec locataire et garantie. Absence de motif de fin et d'auteur de clôture dans la donnée. Aucun écran de fiche bien n'est routé. | `BailService.java:historique` ; `BailController.java:36-37` |
| C11 | **Confirmé** | Aucune route `echeancier` ni fiche bien dans `app.routes.ts`. `PaiementsBienComponent` est un composant réutilisable embarqué dans les tableaux de bord bailleur et gestionnaire. Page dédiée = nouvelle route + filtres + API listant les paiements hors périmètre d'un seul bien (l'API actuelle est `/api/biens/{bienId}/paiements`). | `app.routes.ts` ; `paiements-bien.component.ts:10-15,183` ; `PaiementController.java:22` |
| C14 | **Nouveau, mineur** | Réouverture d'un bail clos ne remet pas le bien à `LOUE`. Il reste dans l'état saisi à la main. | `BailService.java:rouvrir` |
| C15 | **Nouveau, majeur** | Les alertes `FIN_BAIL` et `PREAVIS` se calculent sur `bail.date_fin` (contractuelle) pour les seuls baux ACTIF. Aucune notion de préavis donné par le bailleur ou le locataire : D5 n'a pas de support en base. | `V25__ep13_fin_de_bail.sql` (`generer_alertes`) |

### Écarts avec le modèle cible demandé

- Le prompt propose `BROUILLON, ACTIF, RESILIE, TERMINE, INTERROMPU` ; le plan v1 propose `ACTIF, INTERROMPU, CLOS`. **Décision PO requise** : distinguer `RESILIE` (initiative) de `TERMINE` (terme naturel) ou garder `CLOS` + `motifFin`. Le bail existant n'a que `ACTIF` / `CLOS` (`StatutBail.java`).
- `bail.date_fin` (contractuelle) et `date_cloture_effective` (réelle) existent déjà (`V25`). `dateEffetFin` du modèle cible recouvre `date_cloture_effective` : réutiliser plutôt que dupliquer.

### Toujours non vérifié (non exécuté, pas « non applicable »)

- `mvn verify` et tests frontend : **non exécutés** (Testcontainers/Docker requis).
- Données réelles : requête de détection lecture seule non écrite ni exécutée.
- Autorisations : seuls les `@PreAuthorize` de Bail, Bien, Locataire et Paiement ont été lus. Les autres contrôleurs et la configuration Keycloak ne sont pas audités.
- Template de plan `docs/cgpa/templates/` non confronté au plan v1.
- Financial Governance, DevSecOps et UX/Frontend : analyse non faite au-delà de C7.
- LoyerPro : `UnitServiceImpl` (statut d'occupation), `lease-schedule`, tests non audités. Constat ajouté : le chevauchement de LoyerPro porte sur des **périodes de dates** (`LeaseServiceImpl.checkForOverlappingLeases`), pas sur un statut ; loyertracker n'a que l'unicité du bail ACTIF, sans contrôle de période.

### Traçabilité IA

Premier audit rédigé par Claude Haiku 5.5 (commit `462530a`) ; seconde passe par Claude Sonnet 5.5. Revue humaine requise sur C2, C7, C8 et sur le choix des statuts.
