-- EP20-US03 : fallback SMS uniquement sur template explicitement approuvé.
-- Aucun fournisseur n'est activé par ce seed.
INSERT INTO notification_template (code, channel, language, version, approval_status, enabled)
VALUES ('GARANTIE_DEBITEE', 'SMS', 'fr', 1, 'APPROUVE', true);
