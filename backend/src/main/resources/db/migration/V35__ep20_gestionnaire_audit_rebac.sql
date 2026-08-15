-- EP20-US06 : lecture audit Gestionnaire strictement ReBAC, fail-closed.
-- Seuls les événements paiement dont le bien est actuellement visible via la résolution
-- d'affectation canonique sont exposés. Aucun événement non dérivable n'est retourné.
CREATE FUNCTION audit_paiements_biens_affectes_gestionnaire(p_keycloak_id text)
    RETURNS TABLE(
        id uuid,
        acteur_id uuid,
        acteur_role varchar,
        action varchar,
        entity_type varchar,
        entity_id uuid,
        horodatage timestamptz
    )
    LANGUAGE sql
    STABLE
    SECURITY DEFINER
    SET search_path = public
AS $$
    SELECT al.id, al.acteur_id, al.acteur_role, al.action, al.entity_type, al.entity_id, al.horodatage
    FROM audit_log al
    JOIN paiement p ON p.id = al.entity_id
    JOIN biens_affectes_gestionnaire(p_keycloak_id) b ON b.id = p.bien_id
    WHERE al.entity_type = 'paiement'
    ORDER BY al.horodatage DESC
$$;

COMMENT ON FUNCTION audit_paiements_biens_affectes_gestionnaire(text) IS
    'EP20-US06 : journal audit paiement visible par Gestionnaire uniquement pour ses biens '
    'affectés actifs, via la résolution ReBAC canonique ; fail-closed pour tout autre événement.';

ALTER FUNCTION audit_paiements_biens_affectes_gestionnaire(text) OWNER TO loyertracker_batch;
