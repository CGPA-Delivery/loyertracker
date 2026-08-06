-- =====================================================================================
-- LoyerTracker — Migration V32 : US-125 Backend, préférences Gestionnaire et historique ReBAC.
-- Addendum Gate 05 option S1 approuvé le 2026-08-06.
-- Strictement additive : aucun provider, secret, flag d'activation ou environnement n'est modifié.
-- =====================================================================================

-- Préférence globale du Gestionnaire multi-bailleur : elle ne porte jamais un bailleur_id artificiel.
CREATE TABLE gestionnaire_notification_preference (
    id                 UUID PRIMARY KEY,
    gestionnaire_id    UUID NOT NULL UNIQUE REFERENCES gestionnaire (id),
    phone_e164         VARCHAR(20),
    preferred_channel  VARCHAR(20) NOT NULL DEFAULT 'IN_APP'
                       CHECK (preferred_channel IN ('IN_APP', 'WHATSAPP', 'SMS', 'EMAIL')),
    fallback_channel   VARCHAR(20) CHECK (fallback_channel IN ('SMS')),
    whatsapp_opt_in    BOOLEAN NOT NULL DEFAULT false,
    sms_opt_in         BOOLEAN NOT NULL DEFAULT false,
    consent_at         TIMESTAMPTZ,
    consent_source     VARCHAR(50),
    language           VARCHAR(5) NOT NULL DEFAULT 'fr',
    enabled            BOOLEAN NOT NULL DEFAULT true,
    date_creation      TIMESTAMPTZ NOT NULL DEFAULT now(),
    date_desactivation TIMESTAMPTZ
);

ALTER TABLE gestionnaire_notification_preference ENABLE ROW LEVEL SECURITY;
ALTER TABLE gestionnaire_notification_preference FORCE ROW LEVEL SECURITY;
CREATE POLICY gestionnaire_isolation ON gestionnaire_notification_preference
    USING (gestionnaire_id = NULLIF(current_setting('app.current_gestionnaire_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON gestionnaire_notification_preference TO loyertracker_api;
GRANT SELECT, INSERT, UPDATE, DELETE ON gestionnaire_notification_preference TO loyertracker_batch;

-- Provenance explicite et fail-closed : sans bien_id, aucun événement n'est visible à un Gestionnaire.
ALTER TABLE notification_event ADD COLUMN bien_id UUID REFERENCES bien (id);
CREATE INDEX idx_notification_event_bien ON notification_event (bien_id)
    WHERE bien_id IS NOT NULL;

-- Historique borné au périmètre actif du Gestionnaire. La fonction est le seul chemin SQL prévu
-- pour cette lecture multi-tenant ; aucune donnée hors affectation active n'est retournée.
CREATE OR REPLACE FUNCTION notifications_gestionnaire(p_gestionnaire_id uuid)
    RETURNS TABLE (
        id uuid,
        date_creation timestamptz,
        event_type varchar,
        channel varchar,
        statut varchar,
        motif varchar
    )
    LANGUAGE sql
    SECURITY DEFINER
    SET search_path = public
AS $$
    SELECT d.id,
           d.date_creation,
           e.event_type,
           d.channel,
           d.statut,
           d.error_code AS motif
      FROM notification_delivery d
      JOIN notification_event e ON e.id = d.event_id
      JOIN bien b ON b.id = e.bien_id
     WHERE e.bien_id IS NOT NULL
       AND EXISTS (
            SELECT 1
              FROM affectation a
             WHERE a.gestionnaire_id = p_gestionnaire_id
               AND a.statut = 'ACTIVE'
               AND (a.bien_id = e.bien_id OR a.patrimoine_id = b.patrimoine_id)
       )
     ORDER BY d.date_creation DESC;
$$;

REVOKE ALL ON FUNCTION notifications_gestionnaire(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION notifications_gestionnaire(uuid) TO loyertracker_api;
ALTER FUNCTION notifications_gestionnaire(uuid) OWNER TO loyertracker_batch;

COMMENT ON TABLE gestionnaire_notification_preference IS
    'US-125 : préférence globale du Gestionnaire multi-bailleur, isolée par app.current_gestionnaire_id.';
COMMENT ON COLUMN notification_event.bien_id IS
    'US-125 : provenance métier explicite pour historique Gestionnaire ReBAC ; NULL est exclu fail-closed.';
COMMENT ON FUNCTION notifications_gestionnaire(uuid) IS
    'US-125 : historique de notifications strictement limité aux affectations Gestionnaire ACTIVE sur bien ou patrimoine.';
