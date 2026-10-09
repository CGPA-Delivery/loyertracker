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

Référence : `C:\devtools\workspaces\LoyerPro\repo-backend\src\main\java\cd\ceni\loyerpro\repobackend\service\impl\LeaseServiceImpl.java`. Projet appartenant au PO : reprise autorisée en concept ; réécriture dans l'architecture loyertracker.

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
