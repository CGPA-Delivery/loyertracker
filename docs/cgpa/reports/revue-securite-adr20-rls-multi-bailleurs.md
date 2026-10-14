# Dossier de revue sécurité — ADR-20 (RLS multi-bailleurs)

- **Date** : 2026-10-14
- **Nature** : **préparation de revue.** La revue n'a pas été effectuée. Ce dossier ne vaut ni avis sécurité ni acceptation d'ADR-20.
- **Objet** : ADR-20, `docs/cgpa/05-architecture-conception/adr/ADR-20-patrimoine-multi-bailleurs.md` (décisions D-MB-01 à D-MB-05)
- **Plan lié** : `docs/cgpa/06-planification-agile/plan-execution-cycle-bail.md` (lots 4 et 5)
- **Relecteur humain requis** : oui (CGPA : aucune contribution IA significative sans revue humaine). Nom à désigner par le CDO.
- **Méthode** : lecture du code et des migrations. Aucune base exécutée, aucun test lancé.

## 1. État actuel de l'isolation (vérifié par lecture)

| Élément | Constat | Preuve |
|---|---|---|
| Discriminant | Un seul `bailleur_id` par ligne, comparé au GUC `app.current_bailleur_id` | `V1__init_schema.sql` (policies `bailleur_isolation`, `FORCE ROW LEVEL SECURITY`) |
| Tables sous RLS `bailleur_id` | `bailleur`, `invitation`, `bien`, `bail`, `affectation`, `paiement`, `garantie`, `honoraire`, `alerte`, `audit_log` (V1) ; `patrimoine` (V12) ; `garantie_movement` (V20) ; `quittance`, `quittance_numerotation` (V22) ; `locataire` (V24) ; `notification_*` (V27) | migrations citées |
| Injection du contexte | **Un seul UUID** positionné par transaction (`set_config(..., true)`) | `securite/TenantContext.java` (`positionner`) |
| Contexte d'un gestionnaire | `activerDepuisBien` résout `bien.bailleur_id` (le propriétaire) et agit **sous son identité** | `TenantContext.java` ; `V4__s02_...sql` (`resolve_bien_bailleur`) |
| Fonctions `SECURITY DEFINER` (owner `loyertracker_batch`, BYPASSRLS) | `resolve_bien_bailleur`, `bien_appartient_au_bailleur`, `patrimoine_appartient_au_bailleur`, `gestionnaire_affecte_actif`, `biens_affectes_gestionnaire`, `generer_alertes`, `generer_echeances_loyers`, `calculer_honoraires`, lecture publique des quittances | V4, V10, V12, V13, V14, V15, V18, V22 |
| Autorisation applicative | `peutAccederBien` (bailleur : propriétaire unique ; gestionnaire : affectation active) | `securite/AuthorizationService.java` |
| Tests existants | Prédicats propriété/affectation, accès du bailleur à ses seuls biens, combinaisons patrimoine/inclusion/exclusion | `AuthorizationServiceIntegrationTest.java`, `SecurityIntegrationTest.java`, `RlsTestDataSourceConfig.java` |

## 2. Risques identifiés dans ADR-20

Sévérité : **Critique** = fuite ou blocage probable ; **Majeur** = incohérence métier ou légale ; **À clarifier** = décision manquante.

| ID | Sévérité | Risque | Pourquoi | Action demandée |
|---|---|---|---|---|
| S1 | **Critique** | **Récursion de policy.** ADR-20 prévoit que `patrimoine_bailleur` est « elle-même sous RLS » avec visibilité des co-bailleurs. Une policy qui lit sa propre table provoque `infinite recursion detected in policy`. | La policy sur `patrimoine_bailleur` ne peut pas référencer `patrimoine_bailleur`. | Policy simple `bailleur_id = GUC` sur la table de liaison, et prédicats co-bailleurs par fonction `SECURITY DEFINER` (patron déjà utilisé : V12, V13). Décision à confirmer par le relecteur. |
| S2 | **Critique** | **Le rollback par feature flag décrit dans ADR-20 est inexact.** Les policies sont en base ; un flag applicatif ne les désactive pas. | ADR-20 §Rollback affirme que, flag coupé, « la RLS redevient strictement par `bailleur_id` créateur ». | Corriger ADR-20 : rollback par migration inverse versionnée, ou policy qui lit un GUC `app.multi_bailleur`. |
| S3 | **Critique** | **Un seul GUC, une seule identité.** Le gestionnaire agit sous `bien.bailleur_id` (créateur). Avec plusieurs bailleurs, le créateur peut quitter le patrimoine ; ses gestionnaires perdraient alors l'accès, ou agiraient sous une identité qui n'est plus membre. | `activerDepuisBien` ne connaît pas les co-bailleurs. | Définir quel bailleur est « acteur » pour un gestionnaire (créateur immuable ? premier membre actif ?), et interdire de retirer le dernier membre ou le créateur tant que des affectations `ACTIVE` existent. |
| S4 | Majeur | **Inventaire de tables incomplet.** D-MB-03 cite 5 tables. La RLS actuelle couvre au moins 16 tables (voir §1). | `alerte`, `honoraire`, `affectation`, `garantie_movement`, `quittance_numerotation`, `notification_*`, `audit_log`, `invitation` restent sur `bailleur_id` unique. | Tableau table par table : héritage patrimoine, reste par bailleur, ou hors périmètre. |
| S5 | Majeur | **Les fonctions `SECURITY DEFINER` contournent la RLS** : ADR-20 ne les protège pas. Toutes supposent un propriétaire unique (`bien_appartient_au_bailleur`, `resolve_bien_bailleur`, `patrimoine_appartient_au_bailleur`, `gestionnaire_affecte_actif`). | Un co-bailleur serait refusé (échec fonctionnel, fail-closed), mais `generer_*` et `calculer_honoraires` agissent sur toutes les lignes. | Réaudit de chaque fonction : propriétaire, `search_path`, comportement multi-bailleur. |
| S6 | Majeur | **Alertes et honoraires générés pour le bailleur créateur seulement** (`ON CONFLICT (type, bien_id, periode)`). | Un co-bailleur ne verrait pas l'alerte `FIN_BAIL` ou `LOYER_EN_RETARD` du patrimoine partagé. | Décider : alerte par patrimoine, ou une par co-bailleur. |
| S7 | Majeur | **Numérotation des quittances** : clé primaire `(bailleur_id, annee)`. | Deux co-bailleurs sur un patrimoine partagé : qui émet ? Rupture ou doublon de numérotation = problème légal et Financial Governance. | Décision PO : émetteur unique (créateur ? bailleur choisi par bail ?). |
| S8 | Majeur | **RGPD / ADR-03** : export et effacement sont par bailleur (`RgpdService`). Un locataire visible de plusieurs bailleurs a plusieurs responsables de traitement. | Effacement par le créateur : impact sur l'historique d'un co-bailleur. | Décision DPO/PO : responsable de traitement, durée de visibilité, anonymisation en conservant les pièces financières. |
| S9 | Majeur | **Visibilité de l'historique à l'ajout d'un co-bailleur.** | Un nouveau bailleur verrait tous les baux et locataires passés. | Décision PO : visibilité depuis l'ajout, ou historique complet. Minimisation RGPD. |
| S10 | Majeur | **Asymétrie des affectations** : `affectation.bailleur_id` = bailleur qui l'a créée. Un co-bailleur ne voit pas les gestionnaires de son propre patrimoine, ni ne peut les révoquer. | Contrôle partiel du patrimoine par un seul bailleur. | Décision : affectation portée par le patrimoine, révocable par tout co-bailleur. |
| S11 | Majeur | **Performance** : `EXISTS` évalué par ligne sur `paiement`, `quittance` (grandes tables), avec 2 jointures (`bail → bien → patrimoine`). | Le plan prévoit un index sur `patrimoine_bailleur`, pas de dénormalisation. | Mesurer ; envisager `patrimoine_id` dénormalisé sur les tables filles, avec contrainte de cohérence. |
| S12 | À clarifier | `bien.patrimoine_id NOT NULL` (ADR-11) : non vérifié dans le schéma actuel. | Un bien sans patrimoine serait invisible sous la nouvelle policy. | Vérifier le schéma avant migration. |
| S13 | À clarifier | **Audit des approbations** : `audit_log.bailleur_id` unique. | Une approbation par le co-bailleur B sur une donnée du créateur A doit tracer les deux. | Ajouter `acteur_bailleur_id` distinct du propriétaire. |
| S14 | À clarifier | **Droit d'ajouter/retirer un co-bailleur** : non défini. | Ajout non contrôlé = élévation de privilège. | Règle : ajout par un bailleur membre, retrait par lui-même seulement ou par accord du créateur ? |

## 3. Esquisse de policy à soumettre au relecteur (non exécutée, à valider)

```sql
-- Table de liaison : policy simple, sans récursion (S1).
CREATE POLICY lien_isolation ON patrimoine_bailleur
    USING (bailleur_id = NULLIF(current_setting('app.current_bailleur_id', true), '')::uuid);

-- Prédicat co-bailleurs : SECURITY DEFINER, lecture seule, search_path fixé (patron V12).
CREATE FUNCTION bailleur_est_membre_patrimoine(p_patrimoine uuid, p_bailleur uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT EXISTS (SELECT 1 FROM patrimoine_bailleur
                   WHERE patrimoine_id = p_patrimoine AND bailleur_id = p_bailleur)
$$;

-- Patrimoine et tables filles : accès par appartenance (D-MB-02, D-MB-03).
CREATE POLICY membre_isolation ON patrimoine
    USING (bailleur_est_membre_patrimoine(id, NULLIF(current_setting('app.current_bailleur_id', true), '')::uuid));
```

Points à faire valider : `WITH CHECK` implicite sur `INSERT`/`UPDATE`, propriétaire de la fonction (BYPASSRLS ou non), `GRANT EXECUTE` à `loyertracker_api` seulement, coût du plan avec fonction par ligne.

## 4. Matrice de tests d'autorisation à écrire (avant tout développement des lots 4 et 5)

| # | Cas | Attendu |
|---|---|---|
| T1 | Co-bailleur B lit un bien du patrimoine partagé | Autorisé |
| T2 | Bailleur C (hors patrimoine) lit ce même bien | Refusé (0 ligne) |
| T3 | Gestionnaire affecté au patrimoine par A lit les baux | Autorisé |
| T4 | Gestionnaire affecté par A lit un patrimoine non affecté | Refusé |
| T5 | Co-bailleur B approuve une demande créée par un gestionnaire | Autorisé |
| T6 | Bailleur demandeur approuve sa propre demande | Refusé (Q3) |
| T7 | Co-bailleur B insère un bail sur le patrimoine partagé | `bailleur_id` cohérent, accepté |
| T8 | Bailleur C insère un bail sur ce patrimoine (`WITH CHECK`) | Refusé |
| T9 | Retrait du créateur A du patrimoine, gestionnaires `ACTIVE` | Refusé ou accès conservé (selon S3) |
| T10 | Ajout d'un bailleur D : visibilité de l'historique | Selon S9 |
| T11 | Locataire sans bail, créé par A, lu par B | Refusé (D-MB-04) |
| T12 | Locataire avec bail sur patrimoine partagé, lu par B | Autorisé |
| T13 | Fonctions `SECURITY DEFINER` appelées avec un GUC vide | Fail-closed |
| T14 | Jointure de policy : `EXPLAIN` sur `paiement` à volume réaliste | Plan acceptable (S11) |
| T15 | Rollback : migration inverse sur base de test | Aucun accès cross-bailleur résiduel |

Objectif ENF-02 : **0 accès cross-bailleur non autorisé**.

## 5. Critères pour passer ADR-20 à « Acceptée »

1. S1, S2, S3 traités dans ADR-20 (corrections écrites).
2. S4 : inventaire table par table fourni et validé.
3. S5 : réaudit des fonctions `SECURITY DEFINER` consigné.
4. S7, S8, S9, S10, S14 : décisions PO/CDO écrites (ces points ne sont pas techniques seulement).
5. Matrice §4 écrite et exécutée sur une base de test (preuves jointes).
6. Relecteur humain nommé ; avis écrit signé.

## 6. Limites de ce dossier

- Aucune exécution : pas de base ni de tests lancés.
- Le contenu exact des policies de V27 (`notification_*`) et V20 (`garantie_movement`) n'a pas été relu ligne à ligne.
- `bien.patrimoine_id NOT NULL` (S12) non vérifié.
- Les fonctions `SECURITY DEFINER` de V22 (lecture publique des quittances) n'ont pas été auditées.
