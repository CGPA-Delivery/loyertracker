package com.loyertracker.notifications;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loyertracker.notifications.provider.ChannelNotificationProvider;
import com.loyertracker.notifications.provider.NotificationProvider;
import com.loyertracker.notifications.provider.NotificationProvider.ResultatEnvoi;
import com.loyertracker.securite.TenantContext;
import com.loyertracker.testsupport.RlsTestDataSourceConfig;

import io.micrometer.core.instrument.simple.SimpleMeterRegistry;

import jakarta.persistence.EntityManager;

/**
 * Tests d'intégration EP-16 Sprint N+1 — WhatsApp P0 (US-122/123, ADR-18). Le {@link
 * NotificationDispatcher} sous test est reconstruit avec un {@link NotificationProvider} de test
 * contrôlable (le bean Spring actif reste {@code NoopNotificationProvider}, {@code
 * TWILIO_WHATSAPP_ENABLED} n'étant jamais activé en test) — mêmes collaborateurs réels
 * (repositories, {@code EntityManager}, {@link TenantContext}) que la production. Couvre les
 * critères GO du sprint : template non approuvé ⇒ {@code DEAD} sans envoi, échec transitoire ⇒
 * retry puis {@code DEAD}, callback signature invalide/dupliqué sans effet de bord.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@Import(RlsTestDataSourceConfig.class)
class NotificationDispatchIntegrationTest {

    private static final String AUTH_TOKEN_TEST = "test-twilio-auth-token";
    /** Plafond volontairement hors d'atteinte pour les tests qui ne portent pas sur le budget. */
    private static final long BUDGET_LARGE = 1_000_000L;
    private static final String CALLBACK_URL = "https://loyertracker.loyerpro.org/api/public/notifications/callback";

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    MockMvc mockMvc;
    @Autowired
    @Qualifier("admin")
    JdbcTemplate jdbc;
    @Autowired
    EntityManager em;
    @Autowired
    TenantContext tenant;
    @Autowired
    PlatformTransactionManager txManager;
    @Autowired
    NotificationOutboxService outboxService;
    @Autowired
    NotificationOutboxRepository outboxRepository;
    @Autowired
    NotificationPreferenceRepository preferenceRepository;
    @Autowired
    NotificationTemplateRepository templateRepository;
    @Autowired
    NotificationDeliveryService deliveryService;
    @Autowired
    NotificationDeliveryRepository deliveryRepository;
    @Autowired
    ObjectMapper json;

    @BeforeEach
    void nettoyerBase() {
        jdbc.execute("""
                TRUNCATE notification_outbox, notification_delivery, notification_event,
                         notification_preference, notification_template, bailleur
                RESTART IDENTITY CASCADE
                """);
        seedTemplatesP0();
    }

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.security.oauth2.resourceserver.jwt.issuer-uri",
                () -> "https://localhost/auth/realms/loyertracker");
        registry.add("spring.security.oauth2.resourceserver.jwt.jwk-set-uri",
                () -> "http://localhost:0/realms/loyertracker/protocol/openid-connect/certs");
        registry.add("twilio.auth-token", () -> AUTH_TOKEN_TEST);
        registry.add("twilio.status-callback-base-url", () -> "https://loyertracker.loyerpro.org");
    }

    // --- NotificationDispatcher : envoi accepté ----------------------------------------------

    @Test
    void envoiAccepteCreeUneLivraisonEtMarqueLaLigneTraitee() {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId, "QUITTANCE_DISPONIBLE");
        UUID recipientId = UUID.randomUUID();
        seedPreference(bailleurId, recipientId);
        UUID outboxId = seedOutboxPending(bailleurId, eventId, recipientId, "QUITTANCE_DISPONIBLE");

        NotificationDispatcher dispatcher = dispatcherAvec(demande -> ResultatEnvoi.accepte("SID123"));
        int traites = dispatcher.traiterLot(50);

        assertThat(traites).isEqualTo(1);
        assertThat(statutOutbox(outboxId)).isEqualTo("PROCESSED");
        assertThat(compter("SELECT count(*) FROM notification_delivery WHERE provider_message_id = 'SID123'"))
                .isEqualTo(1);
    }

    // --- Lien de vérification transmis au fournisseur (critère GO explicite) --------------

    @Test
    void lienDeVerificationDuPayloadEstTransmisAuFournisseur() {
        UUID bailleurId = seedBailleur();
        String lien = "https://loyertracker.loyerpro.org/verify/receipt/"
                + UUID.randomUUID() + "?token=abc&v=1";
        UUID eventId = seedEvent(bailleurId, "QUITTANCE_DISPONIBLE", """
                {"bienId":"b1","periode":"2026-01","numero":"QT-2026-000001","lienVerification":"%s"}
                """.formatted(lien));
        UUID recipientId = UUID.randomUUID();
        seedPreference(bailleurId, recipientId);
        seedOutboxPending(bailleurId, eventId, recipientId, "QUITTANCE_DISPONIBLE");

        List<String> variablesRecues = new ArrayList<>();
        NotificationDispatcher dispatcher = dispatcherAvec(demande -> {
            variablesRecues.add(demande.variables().get("lienVerification"));
            return ResultatEnvoi.accepte("SID-LIEN");
        });
        dispatcher.traiterLot(50);

        assertThat(variablesRecues).containsExactly(lien);
    }

    // --- Template non approuvé : critère GO explicite --------------------------------------

    @Test
    void templateNonApprouveMarqueLaLigneDeadSansAucunEnvoi() {
        jdbc.update("UPDATE notification_template SET approval_status = 'SOUMIS', enabled = false "
                + "WHERE code = 'LOYER_EN_RETARD'");
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId, "LOYER_EN_RETARD");
        UUID recipientId = UUID.randomUUID();
        seedPreference(bailleurId, recipientId);
        UUID outboxId = seedOutboxPending(bailleurId, eventId, recipientId, "LOYER_EN_RETARD");

        NotificationDispatcher dispatcher = dispatcherAvec(
                demande -> { throw new AssertionError("le fournisseur ne doit jamais être appelé"); });
        dispatcher.traiterLot(50);

        assertThat(statutOutbox(outboxId)).isEqualTo("DEAD");
        assertThat(compter("SELECT count(*) FROM notification_delivery")).isZero();
    }

    // --- Échec transitoire : retry puis DEAD au-delà du plafond ----------------------------

    @Test
    void echecTransitoireRepasseEnRetryPuisDeadAuDelaDuPlafond() {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId, "GARANTIE_DEBITEE");
        UUID recipientId = UUID.randomUUID();
        seedPreference(bailleurId, recipientId);
        UUID outboxId = seedOutboxPending(bailleurId, eventId, recipientId, "GARANTIE_DEBITEE");

        NotificationDispatcher dispatcher = dispatcherAvec(
                demande -> ResultatEnvoi.echecTemporaire("ERREUR_TRANSPORT_TWILIO"), 2);

        dispatcher.traiterLot(50);
        assertThat(statutOutbox(outboxId)).isEqualTo("RETRY");
        assertThat(tentatives(outboxId)).isEqualTo(1);

        // Force la ré-éligibilité immédiate (backoff ignoré pour le test).
        jdbc.update("UPDATE notification_outbox SET next_attempt_at = now() WHERE id = ?", outboxId);
        dispatcher.traiterLot(50);

        assertThat(statutOutbox(outboxId)).isEqualTo("DEAD");
        assertThat(tentatives(outboxId)).isEqualTo(2);
        assertThat(compter("SELECT count(*) FROM notification_delivery")).isZero();
    }

    // --- Callback Twilio : signature invalide, sans effet de bord --------------------------

    @Test
    void callbackSignatureInvalideEstRejeteSansEffetDeBord() throws Exception {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId, "QUITTANCE_DISPONIBLE");
        creerDeliveryDirecte(bailleurId, eventId, "SID-CB-1");

        mockMvc.perform(post("/api/public/notifications/callback")
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .header("X-Twilio-Signature", "signature-totalement-invalide")
                        .param("MessageSid", "SID-CB-1")
                        .param("MessageStatus", "delivered"))
                .andExpect(status().isForbidden());

        assertThat(statutDelivery("SID-CB-1")).isEqualTo("QUEUED");
    }

    // --- Callback Twilio : signature valide fait progresser le statut ----------------------

    @Test
    void callbackSignatureValideFaitProgresserLeStatut() throws Exception {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId, "QUITTANCE_DISPONIBLE");
        creerDeliveryDirecte(bailleurId, eventId, "SID-CB-2");

        appelerCallbackSigne("SID-CB-2", "delivered", null).andExpect(status().isNoContent());

        assertThat(statutDelivery("SID-CB-2")).isEqualTo("DELIVERED");
    }

    // --- Callback Twilio : dupliqué, sans transition supplémentaire (idempotence) ----------

    @Test
    void callbackDupliqueNEntraineAucuneTransitionSupplementaire() throws Exception {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId, "QUITTANCE_DISPONIBLE");
        creerDeliveryDirecte(bailleurId, eventId, "SID-CB-3");

        appelerCallbackSigne("SID-CB-3", "delivered", null).andExpect(status().isNoContent());
        String deliveredAtApresPremier = jdbc.queryForObject(
                "SELECT delivered_at::text FROM notification_delivery WHERE provider_message_id = 'SID-CB-3'",
                String.class);

        // Callback dupliqué (même statut) : aucune transition supplémentaire, delivered_at inchangé.
        appelerCallbackSigne("SID-CB-3", "delivered", null).andExpect(status().isNoContent());
        String deliveredAtApresSecond = jdbc.queryForObject(
                "SELECT delivered_at::text FROM notification_delivery WHERE provider_message_id = 'SID-CB-3'",
                String.class);

        assertThat(statutDelivery("SID-CB-3")).isEqualTo("DELIVERED");
        assertThat(deliveredAtApresSecond).isEqualTo(deliveredAtApresPremier);
    }

    // =====================================================================================
    // EP-18 Sprint A — canal EMAIL (ADR-19) : généralisation du contrat fournisseur, voie
    // transactionnelle vs voie préférence (RSV-EP18-02)
    // =====================================================================================

    // --- Canal EMAIL, voie transactionnelle : aucune préférence consultée -----------------

    @Test
    void voieTransactionnelleEmailNeConsultePasNiNExigeAucunePreference() {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId, "BAIL_CREE");
        UUID recipientId = UUID.randomUUID();
        seedTemplateEmail("BAIL_CREE");
        // Volontairement AUCUNE NotificationPreference créée pour ce destinataire : la voie
        // transactionnelle ne doit jamais en avoir besoin (ADR-19 §2).
        UUID outboxId = seedOutboxPendingEmailTransactionnel(bailleurId, eventId, recipientId,
                "BAIL_CREE", "invite@exemple.fr");

        List<String> adressesRecues = new ArrayList<>();
        NotificationDispatcher dispatcher = dispatcherAvecEmail(demande -> {
            adressesRecues.add(demande.destinataire().address());
            return ResultatEnvoi.accepte("RESEND-1");
        });
        int traites = dispatcher.traiterLot(50);

        assertThat(traites).isEqualTo(1);
        assertThat(statutOutbox(outboxId)).isEqualTo("PROCESSED");
        assertThat(adressesRecues).containsExactly("invite@exemple.fr");
        assertThat(compter("SELECT count(*) FROM notification_delivery WHERE provider_message_id = 'RESEND-1'"))
                .isEqualTo(1);
    }

    // --- Canal EMAIL, voie préférence : comportement symétrique à WhatsApp/SMS -----------

    @Test
    void voiePreferenceEmailExigeUnePreferenceEligibleEtUneAdresse() {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId, "QUITTANCE_DISPONIBLE");
        UUID recipientId = UUID.randomUUID();
        seedTemplateEmail("QUITTANCE_DISPONIBLE");
        seedPreferenceEmail(bailleurId, recipientId, "locataire@exemple.fr");
        UUID outboxId = seedOutboxPendingEmailPreference(bailleurId, eventId, recipientId,
                "QUITTANCE_DISPONIBLE");

        List<String> adressesRecues = new ArrayList<>();
        NotificationDispatcher dispatcher = dispatcherAvecEmail(demande -> {
            adressesRecues.add(demande.destinataire().address());
            return ResultatEnvoi.accepte("RESEND-2");
        });
        dispatcher.traiterLot(50);

        assertThat(statutOutbox(outboxId)).isEqualTo("PROCESSED");
        assertThat(adressesRecues).containsExactly("locataire@exemple.fr");
    }

    @Test
    void voiePreferenceEmailSansPreferenceMarqueLaLigneDeadSansAucunEnvoi() {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId, "QUITTANCE_DISPONIBLE");
        UUID recipientId = UUID.randomUUID();
        seedTemplateEmail("QUITTANCE_DISPONIBLE");
        // Aucune préférence EMAIL créée : la voie préférence doit rester fermée par défaut (K3),
        // exactement comme WhatsApp/SMS — jamais un envoi par défaut.
        UUID outboxId = seedOutboxPendingEmailPreference(bailleurId, eventId, recipientId,
                "QUITTANCE_DISPONIBLE");

        NotificationDispatcher dispatcher = dispatcherAvecEmail(
                demande -> { throw new AssertionError("le fournisseur ne doit jamais être appelé"); });
        dispatcher.traiterLot(50);

        assertThat(statutOutbox(outboxId)).isEqualTo("DEAD");
        assertThat(compter("SELECT count(*) FROM notification_delivery")).isZero();
    }

    // --- Canal sans fournisseur enregistré : DEAD, jamais un succès silencieux -------------

    @Test
    void canalSansFournisseurEnregistreMarqueLaLigneDeadSansAucunEnvoi() {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId, "BAIL_CREE");
        UUID recipientId = UUID.randomUUID();
        seedTemplateEmail("BAIL_CREE");
        UUID outboxId = seedOutboxPendingEmailTransactionnel(bailleurId, eventId, recipientId,
                "BAIL_CREE", "invite@exemple.fr");

        NotificationDispatcher dispatcher = dispatcherSansAucunFournisseur();
        dispatcher.traiterLot(50);

        assertThat(statutOutbox(outboxId)).isEqualTo("DEAD");
        assertThat(jdbc.queryForObject("SELECT last_error_code FROM notification_outbox WHERE id = ?",
                String.class, outboxId)).isEqualTo("PROVIDER_INDISPONIBLE");
    }

    // --- Helpers -----------------------------------------------------------------------------

    /** Reconstruit un Dispatcher avec un fournisseur de test contrôlable, mêmes collaborateurs réels. */
    // =====================================================================================
    // EP-16 Sprint N+2 Lot A — US-124 (fallback SMS contrôlé) et US-126 (garde-fous)
    // =====================================================================================

    // --- US-126 : kill switch maître -------------------------------------------------------

    @Test
    void killSwitchFermeSuspendLeDispatchSansPerdreLaLigne() {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId, "QUITTANCE_DISPONIBLE");
        UUID recipientId = UUID.randomUUID();
        seedPreference(bailleurId, recipientId);
        UUID outboxId = seedOutboxPending(bailleurId, eventId, recipientId, "QUITTANCE_DISPONIBLE");

        NotificationDispatcher dispatcher = dispatcherAvec(
                demande -> { throw new AssertionError("le fournisseur ne doit jamais être appelé"); },
                5, false, BUDGET_LARGE, false);
        int traites = dispatcher.traiterLot(50);

        assertThat(traites).isZero();
        // La ligne reste intacte : ni consommée, ni marquée en échec — elle repartira à la
        // réouverture du kill switch.
        assertThat(statutOutbox(outboxId)).isEqualTo("PENDING");
        assertThat(tentatives(outboxId)).isZero();
        assertThat(compter("SELECT count(*) FROM notification_delivery")).isZero();
    }

    // --- US-126 : plafond budgétaire -------------------------------------------------------

    @Test
    void plafondBudgetaireNulInterditToutEnvoi() {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId, "QUITTANCE_DISPONIBLE");
        UUID recipientId = UUID.randomUUID();
        seedPreference(bailleurId, recipientId);
        UUID outboxId = seedOutboxPending(bailleurId, eventId, recipientId, "QUITTANCE_DISPONIBLE");

        // Valeur par défaut de production : aucun envoi externe autorisé tant qu'un plafond n'a
        // pas été décidé (K8/ADR-18).
        NotificationDispatcher dispatcher = dispatcherAvec(
                demande -> { throw new AssertionError("le fournisseur ne doit jamais être appelé"); },
                5, true, 0L, false);

        assertThat(dispatcher.traiterLot(50)).isZero();
        assertThat(statutOutbox(outboxId)).isEqualTo("PENDING");
    }

    @Test
    void depassementDuPlafondSimuleArreteLeDispatchSansPerdreLaLigne() {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId, "QUITTANCE_DISPONIBLE");
        UUID recipientId = UUID.randomUUID();
        seedPreference(bailleurId, recipientId);

        // Premier envoi sous un plafond de 1 : accepté, il consomme tout le budget du mois.
        UUID premier = seedOutboxPending(bailleurId, eventId, recipientId, "QUITTANCE_DISPONIBLE");
        assertThat(dispatcherAvec(demande -> ResultatEnvoi.accepte("SID-BUDGET-1"), 5, true, 1L, false)
                .traiterLot(50)).isEqualTo(1);
        assertThat(statutOutbox(premier)).isEqualTo("PROCESSED");

        // Second envoi, même plafond : la consommation réelle du mois (1) atteint le plafond.
        UUID eventSuivant = seedEvent(bailleurId, "LOYER_EN_RETARD");
        UUID second = seedOutboxPending(bailleurId, eventSuivant, recipientId, "LOYER_EN_RETARD");
        int traites = dispatcherAvec(
                demande -> { throw new AssertionError("le plafond aurait dû arrêter le lot"); },
                5, true, 1L, false).traiterLot(50);

        assertThat(traites).isZero();
        assertThat(statutOutbox(second)).isEqualTo("PENDING");
    }

    // --- US-124 : échec permanent ----------------------------------------------------------

    @Test
    void echecPermanentMarqueDeadImmediatementSansConsommerLesTentatives() {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId, "QUITTANCE_DISPONIBLE");
        UUID recipientId = UUID.randomUUID();
        seedPreference(bailleurId, recipientId);
        UUID outboxId = seedOutboxPending(bailleurId, eventId, recipientId, "QUITTANCE_DISPONIBLE");

        dispatcherAvec(demande -> ResultatEnvoi.echecPermanent("TWILIO_REFUS_400"), 5, true,
                BUDGET_LARGE, false).traiterLot(50);

        // DEAD dès la première tentative : rejouer à l'identique ne peut pas aboutir.
        assertThat(statutOutbox(outboxId)).isEqualTo("DEAD");
        assertThat(compter("SELECT count(*) FROM notification_delivery")).isZero();
    }

    // --- US-124 : le fallback ne se déclenche JAMAIS par défaut ----------------------------

    @Test
    void aucunFallbackSmsQuandLaPolitiqueEstDesactivee() {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId, "QUITTANCE_DISPONIBLE");
        UUID recipientId = UUID.randomUUID();
        // Destinataire pourtant pleinement consentant au SMS : seule la politique manque.
        seedPreferenceAvecFallbackSms(bailleurId, recipientId);
        seedOutboxPending(bailleurId, eventId, recipientId, "QUITTANCE_DISPONIBLE");

        dispatcherAvec(demande -> ResultatEnvoi.echecPermanent("TWILIO_REFUS_400"), 5, true,
                BUDGET_LARGE, false).traiterLot(50);

        assertThat(compterSmsEnFile(eventId)).isZero();
    }

    @Test
    void aucunFallbackSmsSansOptInDuDestinataire() {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId, "QUITTANCE_DISPONIBLE");
        UUID recipientId = UUID.randomUUID();
        // Politique activée, mais sms_opt_in = false et aucun canal de secours désigné (K3).
        seedPreference(bailleurId, recipientId);
        seedOutboxPending(bailleurId, eventId, recipientId, "QUITTANCE_DISPONIBLE");

        dispatcherAvec(demande -> ResultatEnvoi.echecPermanent("TWILIO_REFUS_400"), 5, true,
                BUDGET_LARGE, true).traiterLot(50);

        assertThat(compterSmsEnFile(eventId)).isZero();
    }

    @Test
    void aucunFallbackSmsSurUnEchecSeulementTemporaire() {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId, "QUITTANCE_DISPONIBLE");
        UUID recipientId = UUID.randomUUID();
        seedPreferenceAvecFallbackSms(bailleurId, recipientId);
        seedOutboxPending(bailleurId, eventId, recipientId, "QUITTANCE_DISPONIBLE");

        dispatcherAvec(demande -> ResultatEnvoi.echecTemporaire("ERREUR_TRANSPORT_TWILIO"), 5, true,
                BUDGET_LARGE, true).traiterLot(50);

        // Seul un échec PERMANENT ouvre le fallback : un incident réseau doit être réessayé.
        assertThat(compterSmsEnFile(eventId)).isZero();
    }

    // --- US-124 : un unique SMS quand toutes les conditions sont réunies -------------------

    @Test
    void fallbackSmsDeclencheUnUniqueSmsQuandToutesLesConditionsSontReunies() {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId, "QUITTANCE_DISPONIBLE");
        UUID recipientId = UUID.randomUUID();
        seedPreferenceAvecFallbackSms(bailleurId, recipientId);
        seedOutboxPending(bailleurId, eventId, recipientId, "QUITTANCE_DISPONIBLE");

        dispatcherAvec(demande -> ResultatEnvoi.echecPermanent("TWILIO_REFUS_400"), 5, true,
                BUDGET_LARGE, true).traiterLot(50);

        assertThat(compterSmsEnFile(eventId)).isEqualTo(1);
    }

    @Test
    void unSecondEchecPermanentNeCreeJamaisUnDeuxiemeSms() {
        UUID bailleurId = seedBailleur();
        UUID eventId = seedEvent(bailleurId, "QUITTANCE_DISPONIBLE");
        UUID recipientId = UUID.randomUUID();
        seedPreferenceAvecFallbackSms(bailleurId, recipientId);
        seedOutboxPending(bailleurId, eventId, recipientId, "QUITTANCE_DISPONIBLE");

        NotificationDispatcher dispatcher = dispatcherAvec(
                demande -> ResultatEnvoi.echecPermanent("TWILIO_REFUS_400"), 5, true, BUDGET_LARGE, true);
        dispatcher.traiterLot(50);
        assertThat(compterSmsEnFile(eventId)).isEqualTo(1);

        // Le SMS mis en file échoue à son tour, définitivement : aucun fallback d'un fallback,
        // aucune boucle, et toujours un seul SMS pour cet événement.
        dispatcher.traiterLot(50);

        assertThat(compterSmsEnFile(eventId)).isEqualTo(1);
    }

    private NotificationDispatcher dispatcherAvec(NotificationProvider provider) {
        return dispatcherAvec(provider, 5);
    }

    private NotificationDispatcher dispatcherAvec(NotificationProvider provider, int maxTentatives) {
        return dispatcherAvec(provider, maxTentatives, true, BUDGET_LARGE, false);
    }

    /**
     * Construit un dispatcher entièrement paramétré (US-124/US-126). Les valeurs par défaut de
     * production — kill switch fermé, plafond budgétaire à 0, fallback désactivé — bloquent tout
     * envoi : chaque test doit donc ouvrir explicitement ce dont il a besoin, ce qui rend le
     * caractère « fermé par défaut » du socle vérifiable plutôt que supposé.
     *
     * <p>Le fournisseur de test (lambda {@link NotificationProvider}, canal unique WHATSAPP dans
     * ces tests — {@link #seedOutboxPending} câble toujours {@code channel='WHATSAPP'}) est
     * enveloppé dans un {@link ChannelNotificationProvider} couvrant WHATSAPP+SMS (ADR-19 §3,
     * EP-18) pour rester compatible avec la résolution par canal du dispatcher, sans changer la
     * syntaxe des tests existants.</p>
     */
    private NotificationDispatcher dispatcherAvec(NotificationProvider provider, int maxTentatives,
            boolean externeActive, long plafondMensuel, boolean fallbackActive) {
        NotificationMetrics metrics = new NotificationMetrics(new SimpleMeterRegistry());
        NotificationBudgetService budget =
                new NotificationBudgetService(em, metrics, plafondMensuel, 0.8d);
        NotificationFallbackService fallback = new NotificationFallbackService(outboxRepository,
                preferenceRepository, metrics, fallbackActive);
        ChannelNotificationProvider fournisseur = new ChannelNotificationProvider() {
            @Override
            public Set<CanalNotification> canaux() {
                return EnumSet.of(CanalNotification.WHATSAPP, CanalNotification.SMS);
            }

            @Override
            public ResultatEnvoi envoyer(DemandeEnvoi demande) {
                return provider.envoyer(demande);
            }
        };
        return new NotificationDispatcher(em, tenant, txManager, outboxService, outboxRepository,
                preferenceRepository, templateRepository, deliveryService, List.of(fournisseur), json,
                metrics, budget, fallback, externeActive, maxTentatives);
    }

    /** Dispatcher n'enregistrant qu'un fournisseur EMAIL de test (EP-18, isolation des voies). */
    private NotificationDispatcher dispatcherAvecEmail(NotificationProvider emailProvider) {
        NotificationMetrics metrics = new NotificationMetrics(new SimpleMeterRegistry());
        NotificationBudgetService budget =
                new NotificationBudgetService(em, metrics, BUDGET_LARGE, 0.8d);
        NotificationFallbackService fallback = new NotificationFallbackService(outboxRepository,
                preferenceRepository, metrics, false);
        ChannelNotificationProvider fournisseur = new ChannelNotificationProvider() {
            @Override
            public Set<CanalNotification> canaux() {
                return EnumSet.of(CanalNotification.EMAIL);
            }

            @Override
            public ResultatEnvoi envoyer(DemandeEnvoi demande) {
                return emailProvider.envoyer(demande);
            }
        };
        return new NotificationDispatcher(em, tenant, txManager, outboxService, outboxRepository,
                preferenceRepository, templateRepository, deliveryService, List.of(fournisseur), json,
                metrics, budget, fallback, true, 5);
    }

    /** Dispatcher sans aucun fournisseur enregistré — prouve {@code PROVIDER_INDISPONIBLE}. */
    private NotificationDispatcher dispatcherSansAucunFournisseur() {
        NotificationMetrics metrics = new NotificationMetrics(new SimpleMeterRegistry());
        NotificationBudgetService budget =
                new NotificationBudgetService(em, metrics, BUDGET_LARGE, 0.8d);
        NotificationFallbackService fallback = new NotificationFallbackService(outboxRepository,
                preferenceRepository, metrics, false);
        return new NotificationDispatcher(em, tenant, txManager, outboxService, outboxRepository,
                preferenceRepository, templateRepository, deliveryService, List.of(), json,
                metrics, budget, fallback, true, 5);
    }

    private ResultActions appelerCallbackSigne(String sid, String messageStatus, String errorCode)
            throws Exception {
        Map<String, String> parametres = errorCode == null
                ? Map.of("MessageSid", sid, "MessageStatus", messageStatus)
                : Map.of("MessageSid", sid, "MessageStatus", messageStatus, "ErrorCode", errorCode);
        String signature = signer(parametres);
        MockHttpServletRequestBuilder requete = post("/api/public/notifications/callback")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .header("X-Twilio-Signature", signature)
                .param("MessageSid", sid)
                .param("MessageStatus", messageStatus);
        if (errorCode != null) {
            requete = requete.param("ErrorCode", errorCode);
        }
        return mockMvc.perform(requete);
    }

    private static String signer(Map<String, String> parametres) throws NoSuchAlgorithmException, InvalidKeyException {
        StringBuilder donnees = new StringBuilder(CALLBACK_URL);
        parametres.keySet().stream().sorted().forEach(cle -> donnees.append(cle).append(parametres.get(cle)));
        Mac mac = Mac.getInstance("HmacSHA1");
        mac.init(new SecretKeySpec(AUTH_TOKEN_TEST.getBytes(StandardCharsets.UTF_8), "HmacSHA1"));
        return Base64.getEncoder().encodeToString(mac.doFinal(donnees.toString().getBytes(StandardCharsets.UTF_8)));
    }

    private int compter(String sql) {
        return jdbc.queryForObject(sql, Integer.class);
    }

    private String statutOutbox(UUID id) {
        return jdbc.queryForObject("SELECT statut FROM notification_outbox WHERE id = ?", String.class, id);
    }

    private int tentatives(UUID id) {
        return jdbc.queryForObject("SELECT attempt_count FROM notification_outbox WHERE id = ?", Integer.class, id);
    }

    private String statutDelivery(String sid) {
        return jdbc.queryForObject(
                "SELECT statut FROM notification_delivery WHERE provider_message_id = ?", String.class, sid);
    }

    private void seedTemplatesP0() {
        jdbc.update("""
                INSERT INTO notification_template (code, channel, language, version, approval_status, enabled)
                VALUES ('QUITTANCE_DISPONIBLE', 'WHATSAPP', 'fr', 1, 'APPROUVE', true),
                       ('LOYER_EN_RETARD',      'WHATSAPP', 'fr', 1, 'APPROUVE', true),
                       ('GARANTIE_DEBITEE',     'WHATSAPP', 'fr', 1, 'APPROUVE', true)
                """);
    }

    private UUID seedBailleur() {
        UUID id = UUID.randomUUID();
        jdbc.update("INSERT INTO bailleur (id, keycloak_id, email, nom, prenom) VALUES (?,?,?,?,?)",
                id, "kc-" + id, id + "@test.local", "Nom", "Prenom");
        return id;
    }

    private UUID seedEvent(UUID bailleurId, String eventType) {
        return seedEvent(bailleurId, eventType, "{\"periode\":\"2026-01\"}");
    }

    private UUID seedEvent(UUID bailleurId, String eventType, String payloadJson) {
        return UUID.fromString(jdbc.queryForObject("""
                INSERT INTO notification_event (bailleur_id, event_type, aggregate_type, aggregate_id, payload_minimal)
                VALUES (?, ?, 'BAIL', gen_random_uuid(), CAST(? AS jsonb))
                RETURNING id
                """, String.class, bailleurId, eventType, payloadJson));
    }

    private void seedPreference(UUID bailleurId, UUID recipientId) {
        jdbc.update("""
                INSERT INTO notification_preference
                    (id, bailleur_id, recipient_type, recipient_id, phone_e164, preferred_channel,
                     whatsapp_opt_in, sms_opt_in, consent_at, consent_source, enabled)
                VALUES (gen_random_uuid(), ?, 'LOCATAIRE', ?, '+33600000000', 'WHATSAPP', true, false,
                        now(), 'FORMULAIRE_LOYERTRACKER', true)
                """, bailleurId, recipientId);
    }

    /** Destinataire pleinement consentant au fallback SMS : opt-in SMS + canal de secours SMS. */
    private void seedPreferenceAvecFallbackSms(UUID bailleurId, UUID recipientId) {
        jdbc.update("""
                INSERT INTO notification_preference
                    (id, bailleur_id, recipient_type, recipient_id, phone_e164, preferred_channel,
                     fallback_channel, whatsapp_opt_in, sms_opt_in, consent_at, consent_source, enabled)
                VALUES (gen_random_uuid(), ?, 'LOCATAIRE', ?, '+33600000000', 'WHATSAPP', 'SMS',
                        true, true, now(), 'FORMULAIRE_LOYERTRACKER', true)
                """, bailleurId, recipientId);
    }

    private long compterSmsEnFile(UUID eventId) {
        return jdbc.queryForObject(
                "SELECT count(*) FROM notification_outbox WHERE event_id = ? AND channel = 'SMS'",
                Long.class, eventId);
    }

    private UUID seedOutboxPending(UUID bailleurId, UUID eventId, UUID recipientId, String notificationType) {
        UUID id = UUID.randomUUID();
        jdbc.update("""
                INSERT INTO notification_outbox
                    (id, bailleur_id, event_id, recipient_id, notification_type, channel)
                VALUES (?, ?, ?, ?, ?, 'WHATSAPP')
                """, id, bailleurId, eventId, recipientId, notificationType);
        return id;
    }

    private void seedTemplateEmail(String code) {
        jdbc.update("""
                INSERT INTO notification_template
                    (code, channel, language, version, approval_status, enabled, subject, html_body)
                VALUES (?, 'EMAIL', 'fr', 1, 'APPROUVE', true, 'Sujet de test', '<p>Corps de test</p>')
                """, code);
    }

    /** Préférence EMAIL à consentement (voie préférence, EP-18) — symétrique à {@link #seedPreference}. */
    private void seedPreferenceEmail(UUID bailleurId, UUID recipientId, String email) {
        jdbc.update("""
                INSERT INTO notification_preference
                    (id, bailleur_id, recipient_type, recipient_id, email, preferred_channel,
                     email_opt_in, consent_at, consent_source, enabled)
                VALUES (gen_random_uuid(), ?, 'LOCATAIRE', ?, ?, 'EMAIL', true,
                        now(), 'FORMULAIRE_LOYERTRACKER', true)
                """, bailleurId, recipientId, email);
    }

    /** Voie transactionnelle (ADR-19 §2) : adresse déjà résolue, aucune préférence à consulter. */
    private UUID seedOutboxPendingEmailTransactionnel(UUID bailleurId, UUID eventId, UUID recipientId,
            String notificationType, String recipientAddress) {
        UUID id = UUID.randomUUID();
        jdbc.update("""
                INSERT INTO notification_outbox
                    (id, bailleur_id, event_id, recipient_id, notification_type, channel, recipient_address)
                VALUES (?, ?, ?, ?, ?, 'EMAIL', ?)
                """, id, bailleurId, eventId, recipientId, notificationType, recipientAddress);
        return id;
    }

    /** Voie préférence (ADR-19 §2) : {@code recipient_address} NULL, résolution via préférence. */
    private UUID seedOutboxPendingEmailPreference(UUID bailleurId, UUID eventId, UUID recipientId,
            String notificationType) {
        UUID id = UUID.randomUUID();
        jdbc.update("""
                INSERT INTO notification_outbox
                    (id, bailleur_id, event_id, recipient_id, notification_type, channel)
                VALUES (?, ?, ?, ?, ?, 'EMAIL')
                """, id, bailleurId, eventId, recipientId, notificationType);
        return id;
    }

    private void creerDeliveryDirecte(UUID bailleurId, UUID eventId, String providerMessageId) {
        TransactionTemplate tx = new TransactionTemplate(txManager);
        tx.executeWithoutResult(status -> {
            tenant.positionner(bailleurId);
            deliveryService.creer(bailleurId, eventId, UUID.randomUUID(), CanalNotification.WHATSAPP,
                    providerMessageId);
        });
    }
}
