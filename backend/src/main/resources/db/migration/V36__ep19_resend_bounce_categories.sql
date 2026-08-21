-- =====================================================================================
-- LoyerTracker — V36 : EP-19 US-145 — Catégorisation de délivrabilité Resend.
--
-- Migration additive : étend uniquement la contrainte de classification des erreurs. Les données
-- historiques TEMPORAIRE/PERMANENT sont conservées sans transformation. Les callbacks Resend restent
-- traités via notification_delivery_appliquer_statut (SECURITY DEFINER, V28) : aucun contournement
-- RLS applicatif n'est introduit.
-- =====================================================================================

ALTER TABLE notification_delivery
    DROP CONSTRAINT IF EXISTS notification_delivery_error_category_check;

ALTER TABLE notification_delivery
    ADD CONSTRAINT notification_delivery_error_category_check
    CHECK (error_category IN (
        'TEMPORAIRE', 'PERMANENT', 'SOFT_BOUNCE', 'HARD_BOUNCE', 'COMPLAINT'
    ));

COMMENT ON CONSTRAINT notification_delivery_error_category_check ON notification_delivery IS
    'EP-19 US-145 : classification des erreurs de livraison. SOFT_BOUNCE=transitoire, HARD_BOUNCE=adresse/domaine invalide, COMPLAINT=plainte spam. Les valeurs historiques TEMPORAIRE/PERMANENT restent valides.';
