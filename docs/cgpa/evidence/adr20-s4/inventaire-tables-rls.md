# ADR-20 — Traitement de S4 : inventaire des tables et traitement RLS

- **Date** : 2026-10-14
- **Point traité** : S4 du dossier de revue sécurité (`docs/cgpa/reports/revue-securite-adr20-rls-multi-bailleurs.md`)
- **Nature** : inventaire par lecture des migrations `V1` à `V36` (`backend/src/main/resources/db/migration/`). **Aucune base interrogée.**
- **Statut** : inventaire complet pour le schéma des migrations ; 5 questions nouvelles ouvertes (§5) ; à faire valider par le relecteur sécurité.

## 1. Résumé

- **24 tables** dans les migrations. **20 sont sous RLS** (19 par `bailleur_id` ou `id`, 1 par gestionnaire), **4 n'ont pas de RLS**.
- Correction du dossier de revue : S4 parlait d'« au moins 16 tables » ; le décompte exact est 20 tables sous RLS.
- ADR-20 (D-MB-03) ne citait que 5 tables filles. Le traitement ci-dessous couvre les 24 tables existantes : 10 qui héritent du patrimoine (dont `patrimoine` elle-même), 1 dérivée (`locataire`), 8 qui restent par bailleur ou sont à trancher, et 5 inchangées (globales). S'y ajoutent 2 tables nouvelles (`patrimoine_bailleur`, `demande_modification_locataire`), soit 26 lignes au tableau.

Légende des classes :

- **P** : hérite de la visibilité du patrimoine (appartenance par `bailleur_est_membre_patrimoine`, ADR-20 D-MB-02/03).
- **B** : reste isolée par bailleur (donnée personnelle ou de configuration).
- **G** : globale, sans RLS bailleur ; inchangée.
- **?** : question ouverte (§5).
- **N** : nouvelle table.

## 2. Inventaire table par table

| # | Table | RLS actuelle | Lien vers le patrimoine | Classe | Traitement ADR-20 | Décision liée |
|---|---|---|---|---|---|---|
| 1 | `patrimoine` | `bailleur_id = GUC` (V12) | lui-même | P | Policy par appartenance (fonction `SECURITY DEFINER`). `bailleur_id` devient le créateur. | D-MB-02 |
| 2 | `patrimoine_bailleur` | — (nouvelle) | `patrimoine_id` | N | Policy simple `bailleur_id = GUC` (évite la récursion, S1). Index `(bailleur_id, patrimoine_id)`. | D-MB-01, S1 |
| 3 | `bien` | `bailleur_id = GUC` (V1) | `patrimoine_id` direct (NOT NULL, S12) | P | Appartenance via `patrimoine_id`. | D-MB-03 |
| 4 | `bail` | `bailleur_id = GUC` (V1) | `bien_id` → `bien.patrimoine_id` (1 jointure) | P | Appartenance via le bien. Ajout `emetteur_bailleur_id` (quittances). | D-MB-03, D-MB-07 |
| 5 | `paiement` | `bailleur_id = GUC` (V1) | `bien_id` → `bien.patrimoine_id` (1 jointure) | P | Appartenance via le bien. | D-MB-03 |
| 6 | `garantie` | `bailleur_id = GUC` (V1) | `bail_id` → `bien` (2 jointures) | P | Appartenance via le bail. | D-MB-03 |
| 7 | `garantie_movement` | `bailleur_id = GUC` (V20) | `garantie_id` → `bail` → `bien` (3 jointures) | P | Appartenance via la garantie. **La plus profonde** : candidate à dénormalisation (S11). | D-MB-03 |
| 8 | `quittance` | `bailleur_id = GUC` (V22) | `paiement_id` → `bien` (2 jointures) | P | Visible de tous les membres ; `bailleur_id` = **émetteur**. Contrainte `UNIQUE (bailleur_id, numero, version)` inchangée. | D-MB-03, D-MB-07 |
| 9 | `locataire` | `bailleur_id = GUC` (V24) | indirect : `bail.locataire_id` → `bail` → `bien` | P (dérivée) | `bailleur_id = GUC` **OU** locataire d'un bail d'un patrimoine dont le bailleur est membre. Locataire sans bail : créateur seul. | D-MB-04 |
| 10 | `affectation` | `bailleur_id = GUC` (V1) | `bien_id` ou `patrimoine_id` (V13 : exactement un des deux) | P | Isolation par patrimoine (affectation bien → son patrimoine). Tout co-bailleur voit, crée, révoque. | D-MB-10 |
| 11 | `honoraire` | `bailleur_id = GUC` (V1) | `affectation_id` → patrimoine | P | Suit l'affectation. **Question ouverte** : qui est redevable ? (O5) | D-MB-10, O5 |
| 12 | `alerte` | `bailleur_id = GUC` (V1) | `bien_id` ou `bail_id` (les deux nullables) | P | Une alerte par bien et période, visible de tous les membres. **Questions ouvertes** : lecture par destinataire (O3). | D-MB-06, O3 |
| 13 | `demande_modification_locataire` | — (lot 5) | via le locataire / le bail | N | Visible de tous les membres du patrimoine ; approbateur ≠ demandeur. | D-MB-05 |
| 14 | `bailleur` | `id = GUC` (V1) | — | B | Inchangée (identité personnelle). L'écran « membres » lit les co-bailleurs par fonction `SECURITY DEFINER`, pas par policy. | S1 |
| 15 | `invitation` | `bailleur_id = GUC` (V1) | — | B ? | Reste par bailleur émetteur. D-MB-12 ajoute des invitations de co-bailleurs : colonne de type et patrimoine cible (O4). | D-MB-12, O4 |
| 16 | `quittance_numerotation` | `bailleur_id = GUC` (V22) ; PK `(bailleur_id, annee)` | — | B | Inchangée : numérotation continue **par émetteur** et par année. | D-MB-07 |
| 17 | `audit_log` | `bailleur_id = GUC` (V1), `bailleur_id` nullable ; `acteur_id` polymorphe | `entity_id` polymorphe | B ? | Ajout `acteur_bailleur_id`. Visibilité par patrimoine à trancher (O2). | D-MB-11, O2 |
| 18 | `notification_preference` | `bailleur_id = GUC` (V27) ; `UNIQUE (bailleur_id, recipient_type, recipient_id)` | — | B | Inchangée : préférences personnelles par bailleur. | — |
| 19 | `notification_event` | `bailleur_id = GUC` (V27) | `aggregate_id` (BAIL, GARANTIE, QUITTANCE, PAIEMENT) | ? | À trancher : fan-out vers les co-bailleurs (O1). | O1 |
| 20 | `notification_outbox` | `bailleur_id = GUC` (V27) | via l'événement | ? | Idem (O1). | O1 |
| 21 | `notification_delivery` | `bailleur_id = GUC` (V27) | via l'événement | ? | Idem (O1). | O1 |
| 22 | `gestionnaire_notification_preference` | `gestionnaire_isolation` (V32) | — | G | Inchangée (portée par le gestionnaire). | — |
| 23 | `gestionnaire` | aucune (global, ADR-16 D1) | — | G | Inchangée. | — |
| 24 | `type_bien` | aucune (référentiel) | — | G | Inchangée. | — |
| 25 | `notification_template` | aucune (pas de `bailleur_id`) | — | G | Inchangée. | — |
| 26 | `quittance_verification_log` | aucune (vérification publique) | `quittance_id` | G | Inchangée ; les fonctions publiques associées relèvent de S5. | S5 |

Le tableau compte 26 lignes : 24 tables existantes + 2 nouvelles (lignes 2 et 13).

## 3. Chemins de jointure et coût (lien avec S11)

| Profondeur jusqu'au patrimoine | Tables |
|---|---|
| 0 | `patrimoine` |
| 1 (colonne directe `patrimoine_id`) | `bien`, `affectation` (patrimoine) |
| 1 jointure | `bail`, `paiement`, `affectation` (bien), `alerte` |
| 2 jointures | `garantie`, `quittance`, `honoraire`, `locataire` (via bail) |
| 3 jointures | `garantie_movement` |

`paiement`, `quittance` et `garantie_movement` sont les tables à plus fort volume et les plus profondes. Pour S11, trois approches sont à mesurer : fonction d'appartenance par ligne (état proposé), `patrimoine_id` dénormalisé sur ces tables avec contrainte de cohérence, ou vue matérialisée des biens accessibles par bailleur.

## 4. Impacts de migration par table

| Table | Changement de schéma | Reprise des données |
|---|---|---|
| `patrimoine_bailleur` | création | 1 ligne par patrimoine existant (créateur) |
| `bail` | `emetteur_bailleur_id` | = `bailleur_id` pour les baux existants |
| `audit_log` | `acteur_bailleur_id` | = `bailleur_id` quand l'acteur est le bailleur, sinon NULL |
| `invitation` | type et patrimoine cible (O4) | `type = GESTIONNAIRE` pour l'existant |
| `alerte` | table de lecture par destinataire (O3) | statut existant recopié pour le destinataire actuel |
| `demande_modification_locataire` | création (lot 5) | aucune |
| autres tables de classe P | remplacement de la policy | aucune donnée à reprendre |

La production n'ayant aucun co-bailleur (déclaré par le PO), chaque reprise ci-dessus est un copier-coller du `bailleur_id` existant : aucun accès ne change au moment de la migration.

## 5. Questions nouvelles ouvertes (à trancher avant acceptation d'ADR-20)

- **O1 — Notifications** : `notification_event` (et `outbox`, `delivery`) sont isolés par `bailleur_id`. Un événement sur un patrimoine partagé (loyer payé, fin de bail) doit-il notifier **chaque co-bailleur** (une ligne par destinataire) ou seulement l'acteur ? Recommandation à soumettre : une notification par co-bailleur membre, avec leurs préférences respectives.
- **O2 — Audit** : un co-bailleur doit-il voir le journal d'audit des actions sur ses patrimoines (ajout d'un `patrimoine_id` à `audit_log`), ou seulement ses propres actions ? La traçabilité d'un co-bailleur sur les données d'un autre dépend de cette réponse (D-MB-11).
- **O3 — Alertes et lecture** : une alerte partagée a un seul `destinataire_id` et un seul statut `NON_LUE`/`LUE`. Si l'alerte est unique par bien (D-MB-06), un co-bailleur qui la lit la marquerait lue pour tous. Faut-il une **lecture par destinataire** (table de lecture) ? Constat vérifié : `alerte.destinataire_id` est polymorphe (bailleur ou gestionnaire), sans clé étrangère (`V1`).
- **O4 — Invitations** : D-MB-12 impose des invitations de co-bailleurs. La table `invitation` n'a aujourd'hui ni type ni patrimoine cible ; faut-il l'étendre ou créer une table dédiée ? Qui peut inviter : un membre (D-MB-12).
- **O5 — Honoraires** : `honoraire` est calculé sur les loyers encaissés d'une affectation. Pour un patrimoine à plusieurs bailleurs, qui est redevable (répartition entre co-bailleurs, ou un seul) ? Question de Financial Governance.

## 6. Contrôles complémentaires pour la revue

- **Alertes orphelines** : `alerte.bien_id` et `bail_id` sont tous deux nullables ; une alerte sans l'un ni l'autre ne pourrait hériter d'aucun patrimoine. À détecter en lecture seule avant la migration :
  `SELECT count(*) FROM alerte WHERE bien_id IS NULL AND bail_id IS NULL;` (attendu : 0).
- **Locataires sans bail** : restent visibles du créateur seul (D-MB-04) ; à compter avant la migration.
- **Cohérence du propriétaire** : voir `docs/cgpa/evidence/adr20-s12/controle-coherence-bien-patrimoine.md`.

## 7. Limites

- Lecture des migrations uniquement ; le schéma réellement déployé en production n'a pas été comparé (`flyway_schema_history` non consulté).
- Les entités Java n'ont pas été recoupées avec chaque table (par exemple, requêtes natives ou vues non listées dans les migrations).
- Les fonctions `SECURITY DEFINER` (S5) ne sont pas couvertes ici : elles contournent la RLS et relèvent d'un réaudit séparé.
- Les tables créées par des outils extérieurs (Keycloak, Flyway) ne sont pas incluses.
