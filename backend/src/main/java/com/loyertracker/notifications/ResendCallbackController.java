package com.loyertracker.notifications;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.loyertracker.notifications.provider.resend.ResendSignatureVerifier;

/**
 * Callback webhook Resend (US-143, ADR-19 §Sécurité). <strong>Non authentifié</strong> (liste
 * blanche {@code SecurityConfig}, même patron que {@code TwilioCallbackController}) : la seule
 * preuve d'origine est la signature Svix ({@code svix-id}/{@code svix-timestamp}/
 * {@code svix-signature}), vérifiée avant tout traitement, contre le <strong>corps brut</strong>
 * de la requête (jamais un DTO re-sérialisé — condition nécessaire à l'exactitude du HMAC). Déjà
 * couvert par le rate-limit Nginx existant du préfixe {@code /api/public/} (aucune configuration
 * dédiée nécessaire, {@code infra/nginx/nginx.conf}). Réponse toujours indifférenciée (204/403) —
 * aucun détail (email_id inconnu, callback dupliqué, type ignoré) n'est exposé à l'appelant.
 */
@RestController
@RequestMapping("/api/public/notifications")
public class ResendCallbackController {

    private final NotificationDeliveryService deliveries;
    private final ResendSignatureVerifier signature;
    private final ObjectMapper json;

    public ResendCallbackController(NotificationDeliveryService deliveries,
            ResendSignatureVerifier signature, ObjectMapper json) {
        this.deliveries = deliveries;
        this.signature = signature;
        this.json = json;
    }

    @PostMapping(path = "/resend/callback", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> recevoirCallback(
            @RequestHeader(name = "svix-id", required = false) String svixId,
            @RequestHeader(name = "svix-timestamp", required = false) String svixTimestamp,
            @RequestHeader(name = "svix-signature", required = false) String svixSignature,
            @RequestBody String corpsBrut) {
        if (!signature.estValide(svixId, svixTimestamp, svixSignature, corpsBrut)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        ResendWebhookPayload payload;
        try {
            payload = json.readValue(corpsBrut, ResendWebhookPayload.class);
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().build();
        }
        if (payload == null || payload.data() == null || payload.data().emailId() == null
                || payload.type() == null) {
            return ResponseEntity.badRequest().build();
        }
        deliveries.appliquerCallbackResend(payload.data().emailId(), payload.type(),
                payload.data().bounceType());
        return ResponseEntity.noContent().build();
    }
}
