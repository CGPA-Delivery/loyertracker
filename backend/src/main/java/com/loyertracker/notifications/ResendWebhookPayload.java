package com.loyertracker.notifications;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Forme minimale du corps JSON d'un événement webhook Resend (US-143, ADR-19 §Sécurité) — seuls
 * les deux champs nécessaires à la corrélation/au routage sont mappés, tout le reste du payload
 * Resend (destinataires, sujet, détail de bounce/plainte...) est ignoré (RGPD, minimisation :
 * aucune donnée personnelle du webhook n'est jamais persistée par ce contrôleur).
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record ResendWebhookPayload(String type, Data data) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Data(@JsonProperty("email_id") String emailId,
            @JsonProperty("bounce_type") String bounceType) {
    }
}
