package com.loyertracker.notifications.provider;

import java.util.Base64;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.loyertracker.notifications.CanalNotification;

/**
 * Implémentation réelle de {@link NotificationProvider} pour Twilio WhatsApp (US-122), en
 * environnement <strong>Sandbox exclusivement</strong> (ADR-18, K4 : réutilisation d'un numéro
 * existant, aucun compte Twilio de Production ce sprint). Appelle directement l'API REST Messages
 * de Twilio (authentification HTTP Basic {@code accountSid:authToken}) via {@link RestClient} — un
 * appel HTTP simple suffit et évite la dépendance au SDK officiel, plus lourde, pour ce seul
 * besoin d'émission.
 *
 * <p>Depuis le Sprint N+2 (US-124), le canal {@link CanalNotification#SMS} est également pris en
 * charge, à la seule différence du préfixe {@code whatsapp:} et du numéro expéditeur. Tant que
 * {@code twilio.sms-from} n'est pas provisionné, un envoi SMS est refusé en
 * {@link com.loyertracker.notifications.CategorieErreurNotification#PERMANENT} plutôt que tenté —
 * jamais d'envoi silencieux sur un autre canal.</p>
 *
 * <p>Bean actif uniquement si {@code app.notifications.whatsapp.enabled=true} — en exclusion
 * mutuelle avec {@link NoopNotificationProvider} (même flag, conditions opposées).</p>
 */
@Component
@ConditionalOnProperty(prefix = "app.notifications", name = "whatsapp.enabled", havingValue = "true")
public class TwilioNotificationProvider implements ChannelNotificationProvider {

    private static final Logger log = LoggerFactory.getLogger(TwilioNotificationProvider.class);
    private static final String MESSAGES_URL_TEMPLATE =
            "https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json";

    private final RestClient restClient;
    private final String accountSid;
    private final String whatsappFrom;
    private final String smsFrom;
    private final String statusCallbackUrl;

    public TwilioNotificationProvider(
            @Value("${twilio.account-sid:}") String accountSid,
            @Value("${twilio.auth-token:}") String authToken,
            @Value("${twilio.whatsapp-from:}") String whatsappFrom,
            @Value("${twilio.sms-from:}") String smsFrom,
            @Value("${twilio.status-callback-base-url:https://loyertracker.loyerpro.org}") String statusCallbackBaseUrl) {
        this.accountSid = accountSid;
        this.whatsappFrom = whatsappFrom;
        this.smsFrom = smsFrom;
        this.statusCallbackUrl = statusCallbackBaseUrl + "/api/public/notifications/callback";
        String basic = Base64.getEncoder()
                .encodeToString((accountSid + ":" + authToken).getBytes());
        this.restClient = RestClient.builder()
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Basic " + basic)
                .build();
    }

    @Override
    public Set<CanalNotification> canaux() {
        return EnumSet.of(CanalNotification.WHATSAPP, CanalNotification.SMS);
    }

    @Override
    public ResultatEnvoi envoyer(DemandeEnvoi demande) {
        String expediteur = switch (demande.canal()) {
            case WHATSAPP -> whatsappFrom;
            case SMS -> smsFrom;
            case EMAIL, IN_APP -> null;
        };
        if (expediteur == null || expediteur.isBlank()) {
            // Canal non provisionné (IN_APP ne transite jamais par un fournisseur ; SMS sans numéro
            // expéditeur configuré). Permanent : réessayer à l'identique ne peut pas aboutir, et un
            // envoi silencieux sur un autre canal serait une violation du consentement (K3).
            return ResultatEnvoi.echecPermanent("CANAL_NON_PROVISIONNE");
        }
        String prefixe = demande.canal() == CanalNotification.WHATSAPP ? "whatsapp:" : "";
        MultiValueMap<String, String> corps = new LinkedMultiValueMap<>();
        corps.add("To", prefixe + demande.destinataire().address());
        corps.add("From", prefixe + expediteur);
        corps.add("Body", rendre(demande.templateCode(), demande.variables()));
        corps.add("StatusCallback", statusCallbackUrl);
        try {
            TwilioMessageResponse reponse = restClient.post()
                    .uri(MESSAGES_URL_TEMPLATE.formatted(accountSid))
                    .body(corps)
                    .retrieve()
                    .body(TwilioMessageResponse.class);
            if (reponse == null || reponse.sid() == null) {
                return ResultatEnvoi.echecTemporaire("REPONSE_TWILIO_VIDE");
            }
            return ResultatEnvoi.accepte(reponse.sid());
        } catch (HttpClientErrorException e) {
            // 4xx : requête refusée par Twilio (numéro invalide, destinataire hors Sandbox, opt-out,
            // template rejeté). Rejouer à l'identique donnerait le même résultat — sauf 429
            // (quota momentané), qui reste temporaire par nature.
            if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                log.warn("Envoi {} throttlé par Twilio (temporaire).", demande.canal());
                return ResultatEnvoi.echecTemporaire("TWILIO_THROTTLE");
            }
            log.warn("Envoi {} refusé définitivement par Twilio (HTTP {}).", demande.canal(),
                    e.getStatusCode().value());
            return ResultatEnvoi.echecPermanent("TWILIO_REFUS_" + e.getStatusCode().value());
        } catch (RestClientException e) {
            log.warn("Échec d'envoi {} via Twilio (transitoire) : {}", demande.canal(), e.getMessage());
            return ResultatEnvoi.echecTemporaire("ERREUR_TRANSPORT_TWILIO");
        }
    }

    /**
     * Rendu minimal des variables dans le corps du message (US-122). Le contenu réel du template
     * P0 est administré via {@code NotificationTemplate} ({@code providerTemplateId}) ; en
     * l'absence d'intégration Content API réelle (hors périmètre), le corps est reconstruit ici à
     * partir du code du template et des variables résolues par l'événement d'origine. La variable
     * {@code lienVerification} (réutilisation sans modification du lien HMAC des quittances,
     * EP-14), quand présente, est isolée sur sa propre ligne pour rester cliquable dans WhatsApp.
     */
    private String rendre(String templateCode, Map<String, String> variables) {
        String lien = variables.get("lienVerification");
        String corpsVariables = variables.entrySet().stream()
                .filter(e -> !"lienVerification".equals(e.getKey()))
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.joining(", "));
        String entete = "[" + templateCode + "] " + corpsVariables;
        return lien == null ? entete : entete + "\n" + lien;
    }

    private record TwilioMessageResponse(String sid, String status) {
    }
}
