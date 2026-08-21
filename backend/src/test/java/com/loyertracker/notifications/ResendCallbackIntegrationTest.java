package com.loyertracker.notifications;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.loyertracker.securite.TenantContext;
import com.loyertracker.testsupport.RlsTestDataSourceConfig;

/**
 * Tests d'intégration EP-18 Sprint C — webhook Resend (US-143, ADR-19 §Sécurité). Même méthode
 * que {@code NotificationDispatchIntegrationTest} pour le callback Twilio : calcul de la vraie
 * signature (ici Svix) dans le test, appel du vrai endpoint via {@code MockMvc}, assertions sur le
 * statut HTTP et l'état DB. Classe dédiée (pas une extension du fichier dispatcher déjà
 * volumineux) : préoccupation distincte (schéma de signature Svix, pas HMAC-SHA1 Twilio).
 *
 * <p><strong>RSV-EP18-06</strong> : le schéma Svix est implémenté par recommandation par défaut,
 * jamais vérifié contre un webhook Resend réel — ces tests prouvent la cohérence interne
 * (le vérificateur accepte ce qu'il aurait lui-même signé), pas la conformité au service réel.</p>
 */
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@Import(RlsTestDataSourceConfig.class)
class ResendCallbackIntegrationTest {

    /** {@code whsec_} + base64 arbitraire — jamais un secret réel, purement local aux tests. */
    private static final String WEBHOOK_SECRET_TEST = "whsec_" + Base64.getEncoder()
            .encodeToString("secret-resend-sprint-c-test".getBytes(StandardCharsets.UTF_8));

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    MockMvc mockMvc;
    @Autowired
    @Qualifier("admin")
    JdbcTemplate jdbc;
    @Autowired
    TenantContext tenant;
    @Autowired
    PlatformTransactionManager txManager;
    @Autowired
    NotificationDeliveryService deliveryService;

    @BeforeEach
    void nettoyerBase() {
        jdbc.execute("""
                TRUNCATE notification_outbox, notification_delivery, notification_event,
                         notification_preference, notification_template, bailleur
                RESTART IDENTITY CASCADE
                """);
    }

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.security.oauth2.resourceserver.jwt.issuer-uri",
                () -> "https://localhost/auth/realms/loyertracker");
        registry.add("spring.security.oauth2.resourceserver.jwt.jwk-set-uri",
                () -> "http://localhost:0/realms/loyertracker/protocol/openid-connect/certs");
        registry.add("resend.webhook-secret", () -> WEBHOOK_SECRET_TEST);
    }

    // --- TC-144 : signature invalide, sans effet de bord ------------------------------------

    @Test
    void signatureInvalideEstRejeteeSansEffetDeBord() throws Exception {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId);
        creerDeliveryDirecte(bailleurId, eventId, "RESEND-CB-1");

        String corps = corps("email.delivered", "RESEND-CB-1");
        mockMvc.perform(post("/api/public/notifications/resend/callback")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("svix-id", "msg-1")
                        .header("svix-timestamp", String.valueOf(Instant.now().getEpochSecond()))
                        .header("svix-signature", "v1,signature-totalement-invalide")
                        .content(corps))
                .andExpect(status().isForbidden());

        assertThat(statutDelivery("RESEND-CB-1")).isEqualTo("QUEUED");
    }

    // --- TC-145 : horodatage hors fenêtre de fraîcheur, traité comme signature invalide -----

    @Test
    void horodatageHorsFenetreEstRejeteCommeSignatureInvalide() throws Exception {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId);
        creerDeliveryDirecte(bailleurId, eventId, "RESEND-CB-2");

        String corps = corps("email.delivered", "RESEND-CB-2");
        String svixId = "msg-2";
        String horodatageAncien = String.valueOf(Instant.now().getEpochSecond() - 3600); // -1h
        String signatureValideMaisAncienne = "v1," + signer(svixId, horodatageAncien, corps);

        mockMvc.perform(post("/api/public/notifications/resend/callback")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("svix-id", svixId)
                        .header("svix-timestamp", horodatageAncien)
                        .header("svix-signature", signatureValideMaisAncienne)
                        .content(corps))
                .andExpect(status().isForbidden());

        assertThat(statutDelivery("RESEND-CB-2")).isEqualTo("QUEUED");
    }

    // --- TC-146 : sent → delivered → opened progressent le statut dans l'ordre --------------

    @Test
    void statutsSentDeliveredOpenedProgressentDansLOrdre() throws Exception {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId);
        creerDeliveryDirecte(bailleurId, eventId, "RESEND-CB-3");

        appelerCallbackSigne("email.sent", "RESEND-CB-3").andExpect(status().isNoContent());
        assertThat(statutDelivery("RESEND-CB-3")).isEqualTo("SENT");

        appelerCallbackSigne("email.delivered", "RESEND-CB-3").andExpect(status().isNoContent());
        assertThat(statutDelivery("RESEND-CB-3")).isEqualTo("DELIVERED");

        appelerCallbackSigne("email.opened", "RESEND-CB-3").andExpect(status().isNoContent());
        assertThat(statutDelivery("RESEND-CB-3")).isEqualTo("READ");
    }

    // --- TC-147 : bounce dur → UNDELIVERED / HARD_BOUNCE ------------------------------------

    @Test
    void emailHardBounceMarqueUndeliveredAvecCategorieDediee() throws Exception {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId);
        creerDeliveryDirecte(bailleurId, eventId, "RESEND-CB-4");

        appelerCallbackSigne("email.bounced", "RESEND-CB-4", "HARD").andExpect(status().isNoContent());

        assertThat(statutDelivery("RESEND-CB-4")).isEqualTo("UNDELIVERED");
        assertThat(categorieErreur("RESEND-CB-4")).isEqualTo("HARD_BOUNCE");
    }

    // --- TC-148 : bounce mou → UNDELIVERED / SOFT_BOUNCE ------------------------------------

    @Test
    void emailSoftBounceMarqueUndeliveredAvecCategorieDediee() throws Exception {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId);
        creerDeliveryDirecte(bailleurId, eventId, "RESEND-CB-5");

        appelerCallbackSigne("email.bounced", "RESEND-CB-5", "SOFT").andExpect(status().isNoContent());

        assertThat(statutDelivery("RESEND-CB-5")).isEqualTo("UNDELIVERED");
        assertThat(categorieErreur("RESEND-CB-5")).isEqualTo("SOFT_BOUNCE");
    }

    // --- TC-149 : plainte → FAILED / COMPLAINT ----------------------------------------------

    @Test
    void emailComplainedMarqueFailedAvecCategorieDediee() throws Exception {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId);
        creerDeliveryDirecte(bailleurId, eventId, "RESEND-CB-6");

        appelerCallbackSigne("email.complained", "RESEND-CB-6").andExpect(status().isNoContent());

        assertThat(statutDelivery("RESEND-CB-6")).isEqualTo("FAILED");
        assertThat(categorieErreur("RESEND-CB-6")).isEqualTo("COMPLAINT");
    }

    // --- TC-149 : callback dupliqué, aucune transition supplémentaire (idempotence) --------

    @Test
    void callbackDupliqueNEntraineAucuneTransitionSupplementaire() throws Exception {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId);
        creerDeliveryDirecte(bailleurId, eventId, "RESEND-CB-6");

        appelerCallbackSigne("email.delivered", "RESEND-CB-6").andExpect(status().isNoContent());
        var deliveredAtPremierAppel = jdbc.queryForObject(
                "SELECT delivered_at FROM notification_delivery WHERE provider_message_id = ?",
                java.sql.Timestamp.class, "RESEND-CB-6");

        appelerCallbackSigne("email.delivered", "RESEND-CB-6").andExpect(status().isNoContent());
        var deliveredAtSecondAppel = jdbc.queryForObject(
                "SELECT delivered_at FROM notification_delivery WHERE provider_message_id = ?",
                java.sql.Timestamp.class, "RESEND-CB-6");

        assertThat(deliveredAtSecondAppel).isEqualTo(deliveredAtPremierAppel);
    }

    // --- TC-150a : type inconnu ignoré, aucune mutation -------------------------------------

    @Test
    void typeInconnuEstIgnoreSansMutation() throws Exception {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId);
        creerDeliveryDirecte(bailleurId, eventId, "RESEND-CB-7");

        appelerCallbackSigne("email.clicked", "RESEND-CB-7").andExpect(status().isNoContent());

        assertThat(statutDelivery("RESEND-CB-7")).isEqualTo("QUEUED");
    }

    // --- TC-150b : email_id introuvable, réponse indifférenciée -----------------------------

    @Test
    void emailIdIntrouvableRepondIndifferencieSansException() throws Exception {
        appelerCallbackSigne("email.delivered", "RESEND-INEXISTANT").andExpect(status().isNoContent());
    }

    // --- Helpers -----------------------------------------------------------------------------

    private ResultActions appelerCallbackSigne(String type, String emailId) throws Exception {
        return appelerCallbackSigne(type, emailId, null);
    }

    private ResultActions appelerCallbackSigne(String type, String emailId, String bounceType) throws Exception {
        String corps = corps(type, emailId, bounceType);
        String svixId = "msg-" + UUID.randomUUID();
        String svixTimestamp = String.valueOf(Instant.now().getEpochSecond());
        String svixSignature = "v1," + signer(svixId, svixTimestamp, corps);
        MockHttpServletRequestBuilder requete = post("/api/public/notifications/resend/callback")
                .contentType(MediaType.APPLICATION_JSON)
                .header("svix-id", svixId)
                .header("svix-timestamp", svixTimestamp)
                .header("svix-signature", svixSignature)
                .content(corps);
        return mockMvc.perform(requete);
    }

    private String corps(String type, String emailId) {
        return corps(type, emailId, null);
    }

    private String corps(String type, String emailId, String bounceType) {
        String bounce = bounceType == null ? "" : ",\"bounce_type\":\"" + bounceType + "\"";
        return "{\"type\":\"" + type + "\",\"data\":{\"email_id\":\"" + emailId + "\"" + bounce + "}}";
    }

    /** Reproduit l'algorithme de {@code ResendSignatureVerifier} pour signer côté test. */
    private String signer(String svixId, String svixTimestamp, String corpsBrut)
            throws NoSuchAlgorithmException, InvalidKeyException {
        String sansPrefixe = WEBHOOK_SECRET_TEST.substring("whsec_".length());
        byte[] cle = Base64.getDecoder().decode(sansPrefixe);
        String donnees = svixId + "." + svixTimestamp + "." + corpsBrut;
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(cle, "HmacSHA256"));
        byte[] calcule = mac.doFinal(donnees.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(calcule);
    }

    private String statutDelivery(String providerMessageId) {
        return jdbc.queryForObject(
                "SELECT statut FROM notification_delivery WHERE provider_message_id = ?",
                String.class, providerMessageId);
    }

    private String categorieErreur(String providerMessageId) {
        return jdbc.queryForObject(
                "SELECT error_category FROM notification_delivery WHERE provider_message_id = ?",
                String.class, providerMessageId);
    }

    private UUID seedBailleur() {
        UUID id = UUID.randomUUID();
        jdbc.update("INSERT INTO bailleur (id, keycloak_id, email, nom, prenom) VALUES (?,?,?,?,?)",
                id, "kc-" + id, id + "@test.local", "Nom", "Prenom");
        return id;
    }

    private UUID seedEvent(UUID bailleurId) {
        return UUID.fromString(jdbc.queryForObject("""
                INSERT INTO notification_event (bailleur_id, event_type, aggregate_type, aggregate_id, payload_minimal)
                VALUES (?, 'INVITATION_CREEE', 'INVITATION', gen_random_uuid(), '{}'::jsonb)
                RETURNING id
                """, String.class, bailleurId));
    }

    /** Voie transactionnelle EMAIL (ADR-19) : delivery créée directement, sans dispatcher. */
    private void creerDeliveryDirecte(UUID bailleurId, UUID eventId, String providerMessageId) {
        TransactionTemplate tx = new TransactionTemplate(txManager);
        tx.executeWithoutResult(status -> {
            tenant.positionner(bailleurId);
            deliveryService.creer(bailleurId, eventId, UUID.randomUUID(), CanalNotification.EMAIL,
                    providerMessageId);
        });
    }
}
