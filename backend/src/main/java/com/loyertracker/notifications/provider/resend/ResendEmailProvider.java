package com.loyertracker.notifications.provider.resend;

import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.HtmlUtils;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.loyertracker.notifications.CanalNotification;
import com.loyertracker.notifications.provider.ChannelNotificationProvider;

/**
 * Implémentation réelle de {@link com.loyertracker.notifications.provider.NotificationProvider}
 * pour Resend (ADR-19, EP-18) — API HTTPS officielle, jamais SMTP (décision PO explicite). Appelle
 * directement l'API REST de Resend (authentification {@code Bearer}) via {@link RestClient} — même
 * choix que {@link com.loyertracker.notifications.provider.TwilioNotificationProvider} : un appel
 * HTTP simple suffit, aucun SDK Resend n'est introduit.
 *
 * <p>Aucun contenu métier codé en dur ici : sujet, corps HTML et corps texte proviennent du
 * {@code NotificationTemplate} résolu par le dispatcher (ADR-19 §5), avec substitution des
 * variables et échappement HTML systématique (protection injection). Bean actif uniquement si
 * {@code app.notifications.email.enabled=true} — en exclusion mutuelle avec {@link NoopEmailProvider}
 * (même flag, conditions opposées), indépendante du flag WhatsApp/SMS.</p>
 */
@Component
@ConditionalOnProperty(prefix = "app.notifications", name = "email.enabled", havingValue = "true")
public class ResendEmailProvider implements ChannelNotificationProvider {

    private static final Logger log = LoggerFactory.getLogger(ResendEmailProvider.class);
    private static final String EMAILS_PATH = "/emails";
    // Validation grossière (format), pas d'existence réelle : suffisante pour rejeter localement
    // une adresse manifestement invalide avant tout appel réseau (ADR-19 §Sécurité).
    private static final Pattern ADRESSE_VALIDE = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    // Quantificateur possessif : le nom d'une variable n'a jamais besoin de backtracking avant
    // l'accolade fermante ; évite un coût polynomial sur un gabarit hostile ou mal formé.
    private static final Pattern PLACEHOLDER = Pattern.compile("\\$\\{(\\w++)\\}");

    private final RestClient restClient;
    private final String fromEmail;
    private final String fromName;
    private final String replyTo;

    @Autowired
    public ResendEmailProvider(
            @Value("${resend.api-key:}") String apiKey,
            @Value("${resend.from-email:}") String fromEmail,
            @Value("${resend.from-name:LoyerTracker}") String fromName,
            @Value("${resend.reply-to:}") String replyTo,
            @Value("${resend.base-url:https://api.resend.com}") String baseUrl,
            @Value("${resend.connect-timeout-ms:3000}") int connectTimeoutMs,
            @Value("${resend.read-timeout-ms:10000}") int readTimeoutMs) {
        this(construireRestClient(apiKey, baseUrl, connectTimeoutMs, readTimeoutMs), fromEmail,
                fromName, replyTo);
    }

    /** Seam de test (serveur HTTP simulé, {@code MockRestServiceServer}) — jamais utilisé en production. */
    ResendEmailProvider(RestClient restClient, String fromEmail, String fromName, String replyTo) {
        this.restClient = restClient;
        this.fromEmail = fromEmail;
        this.fromName = fromName;
        this.replyTo = replyTo;
    }

    private static RestClient construireRestClient(String apiKey, String baseUrl,
            int connectTimeoutMs, int readTimeoutMs) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(connectTimeoutMs);
        factory.setReadTimeout(readTimeoutMs);
        return RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(factory)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .build();
    }

    @Override
    public Set<CanalNotification> canaux() {
        return EnumSet.of(CanalNotification.EMAIL);
    }

    @Override
    public ResultatEnvoi envoyer(DemandeEnvoi demande) {
        String erreurValidation = valider(demande);
        if (erreurValidation != null) {
            return ResultatEnvoi.echecPermanent(erreurValidation);
        }

        Map<String, String> variables = demande.variables() == null ? Map.of() : demande.variables();
        Optional<String> manquante = premiereVariableManquante(demande, variables);
        if (manquante.isPresent()) {
            log.warn("Variable de template manquante ({}) pour l'envoi EMAIL — aucun envoi tenté.",
                    manquante.get());
            return ResultatEnvoi.echecPermanent("VARIABLE_MANQUANTE");
        }

        return appelerResend(construireCorps(demande, variables));
    }

    private static String valider(DemandeEnvoi demande) {
        String adresse = demande.destinataire().address();
        if (adresse == null || contientCaractereDeControle(adresse) || !ADRESSE_VALIDE.matcher(adresse).matches()) {
            return "ADRESSE_INVALIDE";
        }
        String sujet = demande.subject();
        String html = demande.htmlBody();
        if (sujet == null || sujet.isBlank() || html == null || html.isBlank()) {
            // Ne devrait jamais arriver (NotificationTemplate.utilisablePourEnvoi() filtre déjà ce
            // cas côté dispatcher) — filet de sécurité si ce fournisseur est appelé autrement.
            return "GABARIT_VIDE";
        }
        if (contientCaractereDeControle(sujet)) {
            return "SUJET_INVALIDE";
        }
        return null;
    }

    private static Optional<String> premiereVariableManquante(DemandeEnvoi demande,
            Map<String, String> variables) {
        return variableManquante(demande.subject(), variables)
                .or(() -> variableManquante(demande.htmlBody(), variables))
                .or(() -> demande.textBody() == null ? Optional.empty()
                        : variableManquante(demande.textBody(), variables));
    }

    private ResendEmailRequest construireCorps(DemandeEnvoi demande, Map<String, String> variables) {
        String corpsHtml = substituer(demande.htmlBody(), variables);
        String corpsTexte = demande.textBody() != null ? substituer(demande.textBody(), variables) : null;
        String sujetRendu = substituer(demande.subject(), variables);

        return new ResendEmailRequest(
                (fromName == null || fromName.isBlank()) ? fromEmail : fromName + " <" + fromEmail + ">",
                List.of(demande.destinataire().address()), sujetRendu, corpsHtml, corpsTexte,
                (replyTo == null || replyTo.isBlank()) ? null : List.of(replyTo));
    }

    private ResultatEnvoi appelerResend(ResendEmailRequest corps) {
        try {
            ResendEmailResponse reponse = restClient.post()
                    .uri(EMAILS_PATH)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(corps)
                    .retrieve()
                    .body(ResendEmailResponse.class);
            if (reponse == null || reponse.id() == null) {
                return ResultatEnvoi.echecTemporaire("REPONSE_RESEND_VIDE");
            }
            return ResultatEnvoi.accepte(reponse.id());
        } catch (HttpClientErrorException e) {
            // 4xx : requête refusée par Resend (adresse rejetée, domaine non vérifié, payload
            // invalide). Rejouer à l'identique donnerait le même résultat — sauf 429 (quota
            // momentané), qui reste temporaire par nature.
            if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                log.warn("Envoi EMAIL throttlé par Resend (temporaire).");
                return ResultatEnvoi.echecTemporaire("RESEND_THROTTLE");
            }
            log.warn("Envoi EMAIL refusé définitivement par Resend (HTTP {}).",
                    e.getStatusCode().value());
            return ResultatEnvoi.echecPermanent("RESEND_REFUS_" + e.getStatusCode().value());
        } catch (RestClientException e) {
            log.warn("Échec d'envoi EMAIL via Resend (transitoire) : {}", e.getMessage());
            return ResultatEnvoi.echecTemporaire("ERREUR_TRANSPORT_RESEND");
        }
    }

    private static boolean contientCaractereDeControle(String valeur) {
        return valeur.indexOf('\r') >= 0 || valeur.indexOf('\n') >= 0;
    }

    private static Optional<String> variableManquante(String gabarit, Map<String, String> variables) {
        Matcher m = PLACEHOLDER.matcher(gabarit);
        while (m.find()) {
            if (!variables.containsKey(m.group(1))) {
                return Optional.of(m.group(1));
            }
        }
        return Optional.empty();
    }

    /** Substitution {@code ${variable}} avec échappement HTML systématique (protection injection). */
    private static String substituer(String gabarit, Map<String, String> variables) {
        Matcher m = PLACEHOLDER.matcher(gabarit);
        StringBuilder resultat = new StringBuilder();
        while (m.find()) {
            String valeur = variables.get(m.group(1));
            String remplacement = valeur == null ? "" : HtmlUtils.htmlEscape(valeur);
            m.appendReplacement(resultat, Matcher.quoteReplacement(remplacement));
        }
        m.appendTail(resultat);
        return resultat.toString();
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private record ResendEmailRequest(String from, List<String> to, String subject, String html,
            String text, @JsonProperty("reply_to") List<String> replyTo) {
    }

    private record ResendEmailResponse(String id) {
    }
}
