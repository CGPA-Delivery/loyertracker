-- =====================================================================================
-- LoyerTracker — Migration V29 : EP-16 Sprint N+2 Lot A (US-126) — Plafond budgétaire
-- des envois externes. GO explicite du PO reçu le 2026-07-28, distinct de ceux des
-- Sprints N et N+1.
--
-- Migration strictement additive : une seule fonction SECURITY DEFINER en lecture seule.
-- Aucune table créée ou modifiée, aucune colonne ajoutée, aucune donnée écrite —
-- rollback applicatif trivial (la fonction devient simplement inutilisée).
--
-- Reste hors périmètre : toute activation de canal externe (K8, ADR-18) — le plafond
-- est un garde-fou de coût, jamais un déclencheur d'envoi.
-- =====================================================================================

-- --- Consommation budgétaire du mois courant (US-126) ---------------------------------
-- Le plafond budgétaire est une donnée d'EXPLOITATION GLOBALE : un seul compte Twilio est
-- facturé pour l'ensemble des bailleurs. Or NotificationDispatcher (Java, rôle
-- loyertracker_api, RLS FORCE) ne voit jamais que le tenant courant — il ne peut donc pas
-- constater la consommation réelle du mois sans franchir la frontière RLS. Même besoin et
-- même patron que notification_bailleurs_en_attente() (V28) : une fonction SECURITY DEFINER
-- dédiée, strictement bornée à un count(*), jamais un contournement RLS générique.
--
-- La fonction n'expose AUCUNE donnée métier ni personnelle : uniquement un entier agrégé.
-- Elle ne révèle ni destinataire, ni numéro, ni bailleur, ni contenu.
CREATE FUNCTION notification_envois_du_mois()
    RETURNS bigint
    LANGUAGE sql
    SECURITY DEFINER
    SET search_path = public
    STABLE
AS $$
    SELECT count(*)
    FROM notification_delivery
    WHERE date_creation >= date_trunc('month', now());
$$;

COMMENT ON FUNCTION notification_envois_du_mois() IS
    'US-126, EP-16 Sprint N+2 : nombre d''envois externes effectivement remis au fournisseur depuis le début du mois courant, tous bailleurs confondus. SECURITY DEFINER (owner BYPASSRLS loyertracker_batch) car le plafond budgétaire est une donnée d''exploitation globale, hors périmètre d''un tenant. Retour strictement agrégé : aucune donnée métier ni personnelle exposée.';

ALTER FUNCTION notification_envois_du_mois() OWNER TO loyertracker_batch;
GRANT EXECUTE ON FUNCTION notification_envois_du_mois() TO loyertracker_api;
