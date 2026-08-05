-- =====================================================================================
-- LoyerTracker — Migration V31 : EP-18 Sprint B (Invitation gestionnaire par e-mail) —
-- ADR-19 §2/§5/§6, US-139.
--
-- Migration strictement additive : élargissement de 2 contraintes CHECK existantes (V27)
-- pour admettre 'INVITATION_CREEE'/'INVITATION' (aucune donnée modifiée, aucune ligne
-- existante n'utilise ces valeurs), et seed du gabarit EMAIL correspondant. Aucune table
-- supprimée, aucune colonne supprimée, aucune colonne existante rendue NOT NULL.
--
-- Aucun envoi EMAIL réel possible à ce stade : RESEND_EMAIL_ENABLED=false par défaut
-- (application.yml), NoopEmailProvider seul fournisseur candidat pour EMAIL (inchangé
-- depuis le Sprint A).
-- =====================================================================================

-- --- 1. notification_event : élargissement des CHECK existants (V27) -------------------
ALTER TABLE notification_event DROP CONSTRAINT notification_event_event_type_check;
ALTER TABLE notification_event ADD CONSTRAINT notification_event_event_type_check
    CHECK (event_type IN ('QUITTANCE_DISPONIBLE', 'LOYER_EN_RETARD', 'FIN_BAIL', 'PREAVIS',
        'GARANTIE_NON_RESTITUEE', 'GARANTIE_DEBITEE', 'PAIEMENT_RECU', 'BAIL_CREE', 'BAIL_CLOS',
        'INVITATION_CREEE'));

ALTER TABLE notification_event DROP CONSTRAINT notification_event_aggregate_type_check;
ALTER TABLE notification_event ADD CONSTRAINT notification_event_aggregate_type_check
    CHECK (aggregate_type IN ('BAIL', 'GARANTIE', 'QUITTANCE', 'PAIEMENT', 'INVITATION'));

-- --- 2. Gabarit EMAIL INVITATION_CREEE (US-139, ADR-19 §5/§6) --------------------------
-- code = TypeEvenementNotification.INVITATION_CREEE.name() (patron NotificationDispatcher
-- .traiterUneLigne : templates.findByCodeAndChannelAndLanguageOrderByVersionDesc(row
-- .getNotificationType().name(), ...)) — PAS 'INVITATION_CREEE_V1' (chaîne arbitraire d'un
-- test unitaire Sprint A, jamais un précédent de nommage réel). Variables « lien » et
-- « dureeValiditeHeures » (notation dollar-accolade dans le corps du gabarit ci-dessous) —
-- seules deux clés du payload_minimal émis par InvitationService (RGPD, ADR-19 §RGPD :
-- minimisation stricte, « rien d'autre »).
--
-- Note technique : dans le corps du gabarit, les accolades de substitution sont construites
-- via chr(36) (caractère dollar) plutôt qu'écrites en clair, y compris dans les commentaires
-- ci-dessus — Flyway scanne le texte BRUT du fichier entier (commentaires inclus) à la
-- recherche de SES PROPRES placeholders dollar-accolade, indépendamment du contexte SQL ; il
-- ne faut donc jamais faire apparaître cette séquence littéralement nulle part dans ce fichier.
-- Ce ne sont pas des placeholders Flyway mais du contenu de gabarit, résolu uniquement au
-- dispatch par ResendEmailProvider.
INSERT INTO notification_template
    (code, channel, language, version, approval_status, enabled, subject, html_body, text_body)
VALUES (
    'INVITATION_CREEE', 'EMAIL', 'fr', 1, 'APPROUVE', true,
    'Vous êtes invité(e) à rejoindre LoyerTracker',
    '<p>Bonjour,</p>' ||
    '<p>Vous avez été invité(e) à devenir gestionnaire sur LoyerTracker.</p>' ||
    '<p><a href="' || chr(36) || '{lien}">Accepter l''invitation</a></p>' ||
    '<p>Ce lien est valable ' || chr(36) || '{dureeValiditeHeures} heures. Si vous n''êtes pas ' ||
    'à l''origine de cette démarche, vous pouvez ignorer cet e-mail.</p>',
    'Bonjour,' || E'\n\n' ||
    'Vous avez été invité(e) à devenir gestionnaire sur LoyerTracker.' || E'\n' ||
    'Pour accepter : ' || chr(36) || '{lien}' || E'\n\n' ||
    'Ce lien est valable ' || chr(36) || '{dureeValiditeHeures} heures. Si vous n''êtes pas à ' ||
    'l''origine de cette démarche, vous pouvez ignorer cet e-mail.'
);
