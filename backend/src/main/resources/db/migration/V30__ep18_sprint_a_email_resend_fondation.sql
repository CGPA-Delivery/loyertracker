-- =====================================================================================
-- LoyerTracker — Migration V30 : EP-18 Sprint A (Socle EMAIL/Resend) — ADR-19/D-NOTIF-002.
-- GO explicite du PO reçu le 2026-08-04 pour le Sprint A uniquement (Sprint B/C distincts).
--
-- Migration strictement additive : élargissement de 4 contraintes CHECK existantes (V27)
-- pour admettre 'EMAIL' (aucune donnée modifiée, aucune ligne existante n'utilise cette
-- valeur), et ajout de colonnes nullables / à défaut sûr. Aucune table supprimée, aucune
-- colonne supprimée, aucune colonne existante rendue NOT NULL.
--
-- Aucun envoi EMAIL possible à ce stade : aucune dépendance Resend, RESEND_EMAIL_ENABLED=false
-- par défaut (application.yml), NoopEmailProvider seul fournisseur candidat pour EMAIL.
-- =====================================================================================

-- --- 1. Canal EMAIL : élargissement des contraintes CHECK existantes (V27) -------------
ALTER TABLE notification_outbox DROP CONSTRAINT notification_outbox_channel_check;
ALTER TABLE notification_outbox ADD CONSTRAINT notification_outbox_channel_check
    CHECK (channel IN ('WHATSAPP', 'SMS', 'EMAIL'));

ALTER TABLE notification_delivery DROP CONSTRAINT notification_delivery_channel_check;
ALTER TABLE notification_delivery ADD CONSTRAINT notification_delivery_channel_check
    CHECK (channel IN ('WHATSAPP', 'SMS', 'EMAIL'));

ALTER TABLE notification_template DROP CONSTRAINT notification_template_channel_check;
ALTER TABLE notification_template ADD CONSTRAINT notification_template_channel_check
    CHECK (channel IN ('WHATSAPP', 'SMS', 'EMAIL'));

ALTER TABLE notification_preference DROP CONSTRAINT notification_preference_preferred_channel_check;
ALTER TABLE notification_preference ADD CONSTRAINT notification_preference_preferred_channel_check
    CHECK (preferred_channel IN ('IN_APP', 'WHATSAPP', 'SMS', 'EMAIL'));

-- fallback_channel reste CHECK (fallback_channel IN ('SMS')) : décision K5/ADR-18 non rejouée,
-- aucun fallback automatique n'est introduit depuis EMAIL par cette migration (ADR-19 §7).

-- --- 2. Voie transactionnelle (US-139, Sprint B) : adresse résolue à l'émission --------
-- Nullable : NULL pour toute ligne existante et pour la voie préférence (comportement
-- WhatsApp/SMS strictement inchangé, résolution via notification_preference comme aujourd'hui).
-- Non nulle uniquement pour les événements sans compte destinataire (ex. invitation, Sprint B) :
-- le dispatcher, générique, n'a jamais besoin de connaître l'agrégat d'origine.
ALTER TABLE notification_outbox ADD COLUMN recipient_address VARCHAR(320);

-- --- 3. Préférence EMAIL optionnelle (lots futurs, non exercée par ce sprint) ----------
-- Recueillie par le même formulaire d'opt-in que phone_e164 (K3/ADR-18) : jamais copiée
-- automatiquement depuis un compte existant. email_opt_in complète le triptyque
-- adresse+opt-in déjà en place pour whatsapp_opt_in/sms_opt_in (symétrie requise par
-- NotificationPreference.estEligiblePour, découverte nécessaire à l'implémentation — ADR-19
-- ne la détaillait pas explicitement, addendum documentaire mis à jour en conséquence).
-- Colonnes inertes tant qu'aucun lot optionnel EMAIL (quittance disponible, avis
-- d'échéance...) n'est codé.
ALTER TABLE notification_preference ADD COLUMN email VARCHAR(320);
ALTER TABLE notification_preference ADD COLUMN email_opt_in BOOLEAN NOT NULL DEFAULT false;

-- --- 4. Gabarit EMAIL (US-137) : sujet + corps HTML/texte -----------------------------
-- Nullables : WHATSAPP/SMS continuent d'utiliser le rendu code+variables existant
-- (TwilioNotificationProvider.rendre, inchangé). Utilisées uniquement pour channel = 'EMAIL'.
ALTER TABLE notification_template ADD COLUMN subject   TEXT;
ALTER TABLE notification_template ADD COLUMN html_body TEXT;
ALTER TABLE notification_template ADD COLUMN text_body TEXT;

COMMENT ON COLUMN notification_outbox.recipient_address IS
    'ADR-19 §2 (EP-18) : adresse résolue à l''émission pour la voie transactionnelle (sans NotificationPreference, ex. invitation). NULL = voie préférence standard, inchangée depuis EP-16.';
COMMENT ON COLUMN notification_preference.email IS
    'ADR-19 §2.6 (EP-18) : adresse e-mail optionnelle pour notifications à consentement (lots futurs) — jamais copiée automatiquement depuis un compte existant, même principe que phone_e164 (K3/ADR-18).';
COMMENT ON COLUMN notification_preference.email_opt_in IS
    'ADR-19 §2.6 (EP-18) : opt-in explicite pour le canal EMAIL, symétrique à whatsapp_opt_in/sms_opt_in. Non exercé par le Sprint A (aucun formulaire ne l''écrit encore).';
COMMENT ON COLUMN notification_template.subject IS
    'ADR-19 §5 (EP-18) : sujet du gabarit, utilisé uniquement pour channel = EMAIL.';
COMMENT ON COLUMN notification_template.html_body IS
    'ADR-19 §5 (EP-18) : corps HTML du gabarit, utilisé uniquement pour channel = EMAIL.';
COMMENT ON COLUMN notification_template.text_body IS
    'ADR-19 §5 (EP-18) : alternative texte brut du gabarit, utilisée uniquement pour channel = EMAIL.';
