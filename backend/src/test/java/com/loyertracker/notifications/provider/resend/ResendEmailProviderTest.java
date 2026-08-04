package com.loyertracker.notifications.provider.resend;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import com.loyertracker.notifications.CanalNotification;
import com.loyertracker.notifications.provider.NotificationProvider.DemandeEnvoi;
import com.loyertracker.notifications.provider.NotificationProvider.NotificationRecipient;
import com.loyertracker.notifications.provider.NotificationProvider.ResultatEnvoi;

/**
 * Tests unitaires EP-18 Sprint A (ADR-19 §4/§6) — serveur HTTP simulé ({@link MockRestServiceServer}),
 * jamais de dépendance réseau réelle vers Resend. Utilise le constructeur package-private
 * (seam de test) : aucun code de production n'invoque jamais ce constructeur.
 */
class ResendEmailProviderTest {

    private static final NotificationRecipient DESTINATAIRE =
            new NotificationRecipient(CanalNotification.EMAIL, "destinataire@exemple.fr");

    private RestClient.Builder builder() {
        return RestClient.builder().defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer test-key");
    }

    @Test
    void envoiAccepteRetourneLIdentifiantFournisseur() {
        RestClient.Builder builder = builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        ResendEmailProvider provider =
                new ResendEmailProvider(builder.build(), "from@loyertracker.test", "LoyerTracker", "");

        server.expect(requestTo("/emails"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer test-key"))
                .andRespond(withSuccess("{\"id\":\"resend-123\"}", MediaType.APPLICATION_JSON));

        DemandeEnvoi demande = new DemandeEnvoi(DESTINATAIRE, "INVITATION_CREEE_V1",
                Map.of("nom", "Alice"), "Sujet", "<p>Bonjour ${nom}</p>", "Bonjour ${nom}");
        ResultatEnvoi resultat = provider.envoyer(demande);

        assertThat(resultat.accepte()).isTrue();
        assertThat(resultat.providerMessageId()).isEqualTo("resend-123");
        server.verify();
    }

    @Test
    void adresseInvalideRejeteeSansAucunAppelReseau() {
        RestClient.Builder builder = builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        // Aucune expectation enregistrée : tout appel réseau ferait échouer le test.
        ResendEmailProvider provider =
                new ResendEmailProvider(builder.build(), "from@loyertracker.test", "LoyerTracker", "");

        NotificationRecipient adresseInvalide =
                new NotificationRecipient(CanalNotification.EMAIL, "pas-une-adresse");
        DemandeEnvoi demande = new DemandeEnvoi(adresseInvalide, "CODE", Map.of(), "Sujet", "<p>Corps</p>", null);
        ResultatEnvoi resultat = provider.envoyer(demande);

        assertThat(resultat.accepte()).isFalse();
        assertThat(resultat.errorCode()).isEqualTo("ADRESSE_INVALIDE");
        server.verify();
    }

    @Test
    void sujetOuCorpsHtmlVideRejeteSansAucunAppelReseau() {
        RestClient.Builder builder = builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        ResendEmailProvider provider =
                new ResendEmailProvider(builder.build(), "from@loyertracker.test", "LoyerTracker", "");

        DemandeEnvoi demande = new DemandeEnvoi(DESTINATAIRE, "CODE", Map.of(), "", "<p>Corps</p>", null);
        ResultatEnvoi resultat = provider.envoyer(demande);

        assertThat(resultat.accepte()).isFalse();
        assertThat(resultat.errorCode()).isEqualTo("GABARIT_VIDE");
        server.verify();
    }

    @Test
    void variableManquanteRejeteeSansAucunAppelReseau() {
        RestClient.Builder builder = builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        ResendEmailProvider provider =
                new ResendEmailProvider(builder.build(), "from@loyertracker.test", "LoyerTracker", "");

        DemandeEnvoi demande = new DemandeEnvoi(DESTINATAIRE, "CODE", Map.of(),
                "Sujet", "<p>Bonjour ${prenom}</p>", null);
        ResultatEnvoi resultat = provider.envoyer(demande);

        assertThat(resultat.accepte()).isFalse();
        assertThat(resultat.errorCode()).isEqualTo("VARIABLE_MANQUANTE");
        server.verify();
    }

    @Test
    void variableSubstitueeEstEchappeeContreInjectionHtml() {
        RestClient.Builder builder = builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        ResendEmailProvider provider =
                new ResendEmailProvider(builder.build(), "from@loyertracker.test", "LoyerTracker", "");

        server.expect(requestTo("/emails"))
                .andExpect(content().string(containsString("&lt;script&gt;")))
                .andRespond(withSuccess("{\"id\":\"resend-esc\"}", MediaType.APPLICATION_JSON));

        DemandeEnvoi demande = new DemandeEnvoi(DESTINATAIRE, "CODE",
                Map.of("nom", "<script>alert(1)</script>"), "Sujet", "<p>Bonjour ${nom}</p>", null);
        ResultatEnvoi resultat = provider.envoyer(demande);

        assertThat(resultat.accepte()).isTrue();
        server.verify();
    }

    @Test
    void throttle429RetourneUnEchecTemporaire() {
        RestClient.Builder builder = builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        ResendEmailProvider provider =
                new ResendEmailProvider(builder.build(), "from@loyertracker.test", "LoyerTracker", "");

        server.expect(requestTo("/emails")).andRespond(withStatus(HttpStatus.TOO_MANY_REQUESTS));

        DemandeEnvoi demande = new DemandeEnvoi(DESTINATAIRE, "CODE", Map.of(), "Sujet", "<p>Corps</p>", null);
        ResultatEnvoi resultat = provider.envoyer(demande);

        assertThat(resultat.accepte()).isFalse();
        assertThat(resultat.errorCode()).isEqualTo("RESEND_THROTTLE");
    }

    @Test
    void refus401RetourneUnEchecPermanent() {
        RestClient.Builder builder = builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        ResendEmailProvider provider =
                new ResendEmailProvider(builder.build(), "from@loyertracker.test", "LoyerTracker", "");

        server.expect(requestTo("/emails")).andRespond(withStatus(HttpStatus.UNAUTHORIZED));

        DemandeEnvoi demande = new DemandeEnvoi(DESTINATAIRE, "CODE", Map.of(), "Sujet", "<p>Corps</p>", null);
        ResultatEnvoi resultat = provider.envoyer(demande);

        assertThat(resultat.accepte()).isFalse();
        assertThat(resultat.estEchecPermanent()).isTrue();
        assertThat(resultat.errorCode()).isEqualTo("RESEND_REFUS_401");
    }

    @Test
    void erreurServeurRetourneUnEchecTemporaire() {
        RestClient.Builder builder = builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        ResendEmailProvider provider =
                new ResendEmailProvider(builder.build(), "from@loyertracker.test", "LoyerTracker", "");

        server.expect(requestTo("/emails")).andRespond(withStatus(HttpStatus.INTERNAL_SERVER_ERROR));

        DemandeEnvoi demande = new DemandeEnvoi(DESTINATAIRE, "CODE", Map.of(), "Sujet", "<p>Corps</p>", null);
        ResultatEnvoi resultat = provider.envoyer(demande);

        assertThat(resultat.accepte()).isFalse();
        assertThat(resultat.errorCode()).isEqualTo("ERREUR_TRANSPORT_RESEND");
    }

    @Test
    void canauxCouvreUniquementEmail() {
        ResendEmailProvider provider = new ResendEmailProvider(builder().build(), "from@x.test", "LT", "");
        assertThat(provider.canaux()).containsExactly(CanalNotification.EMAIL);
    }
}
