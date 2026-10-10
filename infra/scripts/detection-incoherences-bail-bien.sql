-- =====================================================================================
-- LoyerTracker — Détection LECTURE SEULE des incohérences bail / bien / échéances
-- Plan  : docs/cgpa/06-planification-agile/plan-execution-cycle-bail.md (§6, lot 1)
-- Audit : docs/cgpa/reports/audit-cycle-bail-phase1-2026-10-09.md
--
-- GARANTIES
--   * Transaction READ ONLY : toute écriture échoue (SQLSTATE 25006). Un seul SELECT, aucun
--     DDL, aucune fonction à effet de bord, aucune table temporaire.
--   * Ne sort que des identifiants, statuts, dates et montants. Aucune donnée personnelle
--     (nom, email, téléphone, adresse).
--
-- EXÉCUTION
--   * Rôle : lecture sur bien, bail, paiement, locataire ET contournement de la RLS
--     (propriétaire / BYPASSRLS). Avec le rôle applicatif, la RLS filtre par bailleur et le
--     résultat est PARTIEL SANS ERREUR : ne pas l'utiliser.
--   * Production : uniquement avec l'autorisation du CDO. Staging mutualisé : cibler
--     explicitement la base loyertracker (STG-ISOL-01).
--   * psql -v ON_ERROR_STOP=1 -d <base> -f detection-incoherences-bail-bien.sql
--
-- ÉTAT : écrit le 2026-10-09 — NON EXÉCUTÉ, syntaxe non vérifiée contre PostgreSQL.
--
-- RÉSULTAT : 2 jeux. 1) une ligne par anomalie (code, gravite, bien_id, bail_id, detail). Aucune
-- correction n'est proposée : chaque cas est tranché par le PO avant tout UPDATE.
--   A1  BLOQUANT bien LOUE sans bail ACTIF (cause C1/C2 : bien jamais libéré)
--   A2  BLOQUANT bien LIBRE avec un bail ACTIF
--   A3  MAJEUR   bien ARCHIVE avec un bail ACTIF
--   A4  INFO     bien EN_TRAVAUX avec un bail ACTIF (légitime ou non : décision PO)
--   A5  MAJEUR   bail ACTIF dont date_fin est dépassée (terme passé sans clôture)
--   A6  MAJEUR   bail CLOS sans date_cloture_effective
--   A7  MAJEUR   bail dont date_fin < date_debut ou date_cloture_effective < date_debut
--   A8  MAJEUR   baux d'un même bien dont les périodes se chevauchent (ACTIF ou CLOS)
--   A9  MAJEUR   bail CLOS avec échéances A_VENIR restantes (purge non appliquée)
--   A10 MAJEUR   bail CLOS avec créances ouvertes (IMPAYE, EN_RETARD, PARTIEL)
--   A11 MAJEUR   bail ACTIF dont le locataire est ARCHIVE
--   A12 BLOQUANT bailleur_id incohérent entre bail, bien, locataire ou paiement (RLS)
-- =====================================================================================

BEGIN READ ONLY;

WITH
-- Période d'occupation d'un bail : fin = clôture effective, sinon date_fin.
-- ACTIF sans date_fin = ouvert (borne NULL = illimité). CLOS sans aucune fin : on retient
-- date_debut pour ne pas produire de faux chevauchements illimités.
periode_bail AS (
    SELECT b.id AS bail_id, b.bien_id, b.statut,
           daterange(
               b.date_debut,
               -- GREATEST : une borne haute < date_debut (cas A7) ferait échouer daterange().
               GREATEST(
                   CASE WHEN b.statut = 'ACTIF'
                        THEN COALESCE(b.date_cloture_effective, b.date_fin)
                        ELSE COALESCE(b.date_cloture_effective, b.date_fin, b.date_debut)
                   END,
                   b.date_debut),
               '[]') AS periode
    FROM bail b
),
anomalies AS (
    -- A1
    SELECT 'A1' AS code, 'BLOQUANT' AS gravite, bi.id AS bien_id, NULL::uuid AS bail_id,
           'bien LOUE sans bail ACTIF' AS detail
    FROM bien bi
    WHERE bi.statut = 'LOUE'
      AND NOT EXISTS (SELECT 1 FROM bail b WHERE b.bien_id = bi.id AND b.statut = 'ACTIF')

    UNION ALL -- A2
    SELECT 'A2', 'BLOQUANT', bi.id, b.id, 'bien LIBRE avec un bail ACTIF'
    FROM bien bi JOIN bail b ON b.bien_id = bi.id AND b.statut = 'ACTIF'
    WHERE bi.statut = 'LIBRE'

    UNION ALL -- A3
    SELECT 'A3', 'MAJEUR', bi.id, b.id, 'bien ARCHIVE avec un bail ACTIF'
    FROM bien bi JOIN bail b ON b.bien_id = bi.id AND b.statut = 'ACTIF'
    WHERE bi.statut = 'ARCHIVE'

    UNION ALL -- A4
    SELECT 'A4', 'INFO', bi.id, b.id, 'bien EN_TRAVAUX avec un bail ACTIF'
    FROM bien bi JOIN bail b ON b.bien_id = bi.id AND b.statut = 'ACTIF'
    WHERE bi.statut = 'EN_TRAVAUX'

    UNION ALL -- A5
    SELECT 'A5', 'MAJEUR', b.bien_id, b.id,
           'bail ACTIF, date_fin ' || b.date_fin || ' dépassée de '
               || (current_date - b.date_fin) || ' j'
    FROM bail b
    WHERE b.statut = 'ACTIF' AND b.date_fin IS NOT NULL AND b.date_fin < current_date

    UNION ALL -- A6
    SELECT 'A6', 'MAJEUR', b.bien_id, b.id, 'bail CLOS sans date_cloture_effective'
    FROM bail b
    WHERE b.statut = 'CLOS' AND b.date_cloture_effective IS NULL

    UNION ALL -- A7
    SELECT 'A7', 'MAJEUR', b.bien_id, b.id,
           'dates incohérentes : début ' || b.date_debut
               || ', fin ' || COALESCE(b.date_fin::text, 'NULL')
               || ', clôture ' || COALESCE(b.date_cloture_effective::text, 'NULL')
    FROM bail b
    WHERE b.date_fin < b.date_debut OR b.date_cloture_effective < b.date_debut

    UNION ALL -- A8 (une ligne par couple de baux, a < b pour éviter les doublons)
    SELECT 'A8', 'MAJEUR', p1.bien_id, p1.bail_id,
           'chevauche le bail ' || p2.bail_id || ' (' || p1.periode || ' / ' || p2.periode || ')'
    FROM periode_bail p1
    JOIN periode_bail p2 ON p2.bien_id = p1.bien_id AND p2.bail_id > p1.bail_id
    WHERE p1.periode && p2.periode

    UNION ALL -- A9
    SELECT 'A9', 'MAJEUR', b.bien_id, b.id,
           count(*) || ' échéance(s) A_VENIR sur bail CLOS, de ' || min(p.periode)
               || ' à ' || max(p.periode)
    FROM bail b JOIN paiement p ON p.bail_id = b.id AND p.statut = 'A_VENIR'
    WHERE b.statut = 'CLOS'
      -- Même critère que la purge (BailService.cloturer) : périodes strictement postérieures
      -- au mois de clôture. Sans date de clôture (A6), toutes les A_VENIR sont signalées.
      AND (b.date_cloture_effective IS NULL
           OR p.periode > to_char(b.date_cloture_effective, 'YYYY-MM'))
    GROUP BY b.bien_id, b.id

    UNION ALL -- A10
    SELECT 'A10', 'MAJEUR', b.bien_id, b.id,
           count(*) || ' créance(s) ouverte(s), reste dû '
               || sum(p.montant_attendu - p.montant_recu)
    FROM bail b JOIN paiement p ON p.bail_id = b.id
         AND p.statut IN ('IMPAYE', 'EN_RETARD', 'PARTIEL')
    WHERE b.statut = 'CLOS'
    GROUP BY b.bien_id, b.id

    UNION ALL -- A11
    SELECT 'A11', 'MAJEUR', b.bien_id, b.id, 'bail ACTIF, locataire ARCHIVE'
    FROM bail b JOIN locataire l ON l.id = b.locataire_id
    WHERE b.statut = 'ACTIF' AND l.statut = 'ARCHIVE'

    UNION ALL -- A12 : bail <> bien
    SELECT 'A12', 'BLOQUANT', b.bien_id, b.id, 'bail.bailleur_id <> bien.bailleur_id'
    FROM bail b JOIN bien bi ON bi.id = b.bien_id
    WHERE b.bailleur_id <> bi.bailleur_id

    UNION ALL -- A12 : bail <> locataire
    SELECT 'A12', 'BLOQUANT', b.bien_id, b.id, 'bail.bailleur_id <> locataire.bailleur_id'
    FROM bail b JOIN locataire l ON l.id = b.locataire_id
    WHERE b.bailleur_id <> l.bailleur_id

    UNION ALL -- A12 : paiement <> bail
    SELECT 'A12', 'BLOQUANT', p.bien_id, p.bail_id,
           'paiement ' || p.periode || ' : bailleur_id ou bien_id différent du bail'
    FROM paiement p JOIN bail b ON b.id = p.bail_id
    WHERE p.bailleur_id <> b.bailleur_id OR p.bien_id <> b.bien_id
)
SELECT code, gravite, bien_id, bail_id, detail
FROM anomalies
ORDER BY CASE gravite WHEN 'BLOQUANT' THEN 1 WHEN 'MAJEUR' THEN 2 WHEN 'MINEUR' THEN 3 ELSE 4 END,
         code, bien_id, bail_id;

-- Volumétrie de référence pour situer les anomalies (READ COMMITTED : instantané non
-- garanti entre les deux requêtes ; relancer en cas de doute).
SELECT 'biens' AS objet, count(*) AS total FROM bien
UNION ALL SELECT 'baux ACTIF', count(*) FROM bail WHERE statut = 'ACTIF'
UNION ALL SELECT 'baux CLOS',  count(*) FROM bail WHERE statut = 'CLOS'
UNION ALL SELECT 'paiements',  count(*) FROM paiement;

ROLLBACK;
