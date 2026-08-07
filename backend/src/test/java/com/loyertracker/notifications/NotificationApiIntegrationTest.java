package com.loyertracker.notifications;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.not;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.loyertracker.testsupport.RlsTestDataSourceConfig;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@Import(RlsTestDataSourceConfig.class)
class NotificationApiIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    MockMvc mockMvc;

    @Autowired
    @Qualifier("admin")
    JdbcTemplate jdbc;

    @BeforeEach
    void nettoyerBase() {
        jdbc.execute("""
                TRUNCATE gestionnaire_notification_preference, notification_delivery, notification_outbox,
                         notification_event, notification_preference, notification_template, quittance,
                         quittance_numerotation, quittance_verification_log, audit_log, alerte,
                         garantie, paiement, affectation, bail, locataire, bien, patrimoine,
                         invitation, bailleur, gestionnaire
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
        registry.add("quittances.hmac-secret", () -> "secret-hmac-de-test");
    }

    @Test
    void preferencesCurrentSansJwtRenvoie401() throws Exception {
        mockMvc.perform(get("/api/notifications/preferences/current"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void preferencesCurrentJwtSansRoleMetierRenvoie403() throws Exception {
        mockMvc.perform(get("/api/notifications/preferences/current").with(jwt()))
                .andExpect(status().isForbidden());
    }

    @Test
    void bailleurPeutConsulterModifierEtDesinscrireSaPreferenceTenantScopee() throws Exception {
        String keycloakId = "bailleur-" + UUID.randomUUID();
        UUID bailleurId = seedBailleur(keycloakId);

        mockMvc.perform(get("/api/notifications/preferences/current").with(bailleurJwt(keycloakId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enabled").value(false))
                .andExpect(jsonPath("$.preferredChannel").value("IN_APP"))
                .andExpect(jsonPath("$.language").value("fr"));

        mockMvc.perform(put("/api/notifications/preferences/current")
                        .with(bailleurJwt(keycloakId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"phoneE164":"+33612345678","preferredChannel":"WHATSAPP",
                                 "fallbackChannel":"SMS","whatsappOptIn":true,"smsOptIn":true,
                                 "consentSource":"FORMULAIRE_LOYERTRACKER","language":"fr"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enabled").value(true))
                .andExpect(jsonPath("$.phoneE164").value("+33612345678"))
                .andExpect(jsonPath("$.preferredChannel").value("WHATSAPP"))
                .andExpect(jsonPath("$.fallbackChannel").value("SMS"))
                .andExpect(jsonPath("$.whatsappOptIn").value(true))
                .andExpect(jsonPath("$.smsOptIn").value(true))
                .andExpect(jsonPath("$.consentAt").exists());

        assertThat(compter("""
                SELECT count(*) FROM notification_preference
                WHERE bailleur_id = ? AND recipient_type = 'BAILLEUR' AND recipient_id = ?
                """, bailleurId, bailleurId)).isEqualTo(1);
        assertThat(compter("SELECT count(*) FROM gestionnaire_notification_preference")).isZero();

        mockMvc.perform(post("/api/notifications/preferences/current/unsubscribe")
                        .with(bailleurJwt(keycloakId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enabled").value(false))
                .andExpect(jsonPath("$.phoneE164").value("+33612345678"));
    }

    @Test
    void gestionnairePeutModifierPreferenceGlobaleSansCreerPreferenceTenantBailleur() throws Exception {
        String keycloakId = "gestionnaire-" + UUID.randomUUID();
        UUID gestionnaireId = seedGestionnaire(keycloakId);

        mockMvc.perform(put("/api/notifications/preferences/current")
                        .with(gestionnaireJwt(keycloakId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"phoneE164":"+33711112222","preferredChannel":"SMS",
                                 "fallbackChannel":null,"whatsappOptIn":false,"smsOptIn":true,
                                 "consentSource":"FORMULAIRE_LOYERTRACKER","language":"fr"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enabled").value(true))
                .andExpect(jsonPath("$.phoneE164").value("+33711112222"))
                .andExpect(jsonPath("$.preferredChannel").value("SMS"));

        assertThat(compter("""
                SELECT count(*) FROM gestionnaire_notification_preference
                WHERE gestionnaire_id = ? AND preferred_channel = 'SMS'
                """, gestionnaireId)).isEqualTo(1);
        assertThat(compter("SELECT count(*) FROM notification_preference")).isZero();
    }

    @Test
    void historiqueBailleurEstTenantScopeEtMasqueAdresseDestinataire() throws Exception {
        String bailleurKc = "bailleur-history-" + UUID.randomUUID();
        UUID bailleurId = seedBailleur(bailleurKc);
        UUID eventId = seedNotificationEvent(bailleurId, null, "LOYER_EN_RETARD");
        seedDelivery(bailleurId, eventId, bailleurId, "WHATSAPP", "+33612345678", "ERREUR_TEST");
        UUID autreBailleur = seedBailleur("autre-" + UUID.randomUUID());
        UUID autreEvent = seedNotificationEvent(autreBailleur, null, "PAIEMENT_RECU");
        seedDelivery(autreBailleur, autreEvent, autreBailleur, "SMS", "+33700000000", null);

        mockMvc.perform(get("/api/notifications/history").with(bailleurJwt(bailleurKc)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].notificationType").value("LOYER_EN_RETARD"))
                .andExpect(jsonPath("$[0].channel").value("WHATSAPP"))
                .andExpect(jsonPath("$[0].statut").value("QUEUED"))
                .andExpect(jsonPath("$[0].motif").value("ERREUR_TEST"))
                .andExpect(jsonPath("$[0].recipientAddressMasked").value("+336******78"))
                .andExpect(jsonPath("$[0].recipientAddressMasked").value(not("+33612345678")))
                .andExpect(jsonPath("$[1]").doesNotExist());
    }

    @Test
    void historiqueGestionnaireUtiliseLePerimetreNotificationsGestionnaireEtMasqueAdresse() throws Exception {
        String gestionnaireKc = "gestionnaire-history-" + UUID.randomUUID();
        UUID gestionnaireId = seedGestionnaire(gestionnaireKc);
        UUID bailleurId = seedBailleur("bailleur-affecte-" + UUID.randomUUID());
        UUID bienAffecte = seedBien(bailleurId);
        seedAffectation(bailleurId, bienAffecte, gestionnaireId, "ACTIVE");
        UUID eventVisible = seedNotificationEvent(bailleurId, bienAffecte, "PAIEMENT_RECU");
        seedDelivery(bailleurId, eventVisible, gestionnaireId, "SMS", "+33711112222", null);

        UUID autreBailleur = seedBailleur("bailleur-non-affecte-" + UUID.randomUUID());
        UUID bienNonAffecte = seedBien(autreBailleur);
        UUID eventInvisible = seedNotificationEvent(autreBailleur, bienNonAffecte, "BAIL_CREE");
        seedDelivery(autreBailleur, eventInvisible, gestionnaireId, "SMS", "+33711112222", null);
        UUID eventSansBien = seedNotificationEvent(bailleurId, null, "QUITTANCE_DISPONIBLE");
        seedDelivery(bailleurId, eventSansBien, gestionnaireId, "SMS", "+33711112222", null);

        mockMvc.perform(get("/api/notifications/history").with(gestionnaireJwt(gestionnaireKc)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].notificationType").value("PAIEMENT_RECU"))
                .andExpect(jsonPath("$[0].channel").value("SMS"))
                .andExpect(jsonPath("$[0].recipientAddressMasked").value("********"))
                .andExpect(jsonPath("$[0].recipientAddressMasked").value(not("+33711112222")))
                .andExpect(jsonPath("$[1]").doesNotExist());
    }

    @Test
    void gestionnaireSansCompteEnBaseRecoit403SurPreferences() throws Exception {
        String keycloakId = "gestionnaire-inconnu-" + UUID.randomUUID();
        mockMvc.perform(get("/api/notifications/preferences/current")
                        .with(gestionnaireJwt(keycloakId)))
                .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/notifications/preferences/current")
                        .with(gestionnaireJwt(keycloakId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"phoneE164":"+337****0000","preferredChannel":"SMS",
                                 "fallbackChannel":null,"whatsappOptIn":false,"smsOptIn":true,
                                 "consentSource":"FORMULAIRE_LOYERTRACKER","language":"fr"}
                                """))
                .andExpect(status().isForbidden());

        mockMvc.perform(post("/api/notifications/preferences/current/unsubscribe")
                        .with(gestionnaireJwt(keycloakId)))
                .andExpect(status().isForbidden());
    }

    @Test
    void gestionnairePeutConsulterPreferenceParDefautQuandAucuneExiste() throws Exception {
        String keycloakId = "gestionnaire-defaut-" + UUID.randomUUID();
        seedGestionnaire(keycloakId);

        mockMvc.perform(get("/api/notifications/preferences/current")
                        .with(gestionnaireJwt(keycloakId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enabled").value(false))
                .andExpect(jsonPath("$.preferredChannel").value("IN_APP"))
                .andExpect(jsonPath("$.language").value("fr"))
                .andExpect(jsonPath("$.phoneE164").doesNotExist());
    }

    @Test
    void gestionnairePeutModifierEtDesinscrireSaPreferenceGlobale() throws Exception {
        String keycloakId = "gestionnaire-lifecycle-" + UUID.randomUUID();
        UUID gestionnaireId = seedGestionnaire(keycloakId);

        mockMvc.perform(put("/api/notifications/preferences/current")
                        .with(gestionnaireJwt(keycloakId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"phoneE164":"+337****4444","preferredChannel":"WHATSAPP",
                                 "fallbackChannel":"SMS","whatsappOptIn":true,"smsOptIn":true,
                                 "consentSource":"FORMULAIRE_LOYERTRACKER","language":"en"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enabled").value(true))
                .andExpect(jsonPath("$.phoneE164").value("+337****4444"));

        mockMvc.perform(post("/api/notifications/preferences/current/unsubscribe")
                        .with(gestionnaireJwt(keycloakId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enabled").value(false))
                .andExpect(jsonPath("$.phoneE164").value("+337****4444"));

        assertThat(compter("""
                SELECT count(*) FROM gestionnaire_notification_preference
                WHERE gestionnaire_id = ? AND enabled = false
                """, gestionnaireId)).isEqualTo(1);
    }

    @Test
    void gestionnaireDesinscrireSansPreferenceRenvoie404() throws Exception {
        String keycloakId = "gestionnaire-no-pref-" + UUID.randomUUID();
        seedGestionnaire(keycloakId);

        mockMvc.perform(post("/api/notifications/preferences/current/unsubscribe")
                        .with(gestionnaireJwt(keycloakId)))
                .andExpect(status().isNotFound());
    }

    @Test
    void historiqueGestionnaireSansCompteRenvoieListeVide() throws Exception {
        String keycloakId = "gestionnaire-empty-" + UUID.randomUUID();

        mockMvc.perform(get("/api/notifications/history")
                        .with(gestionnaireJwt(keycloakId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    private int compter(String sql, Object... params) {
        return jdbc.queryForObject(sql, Integer.class, params);
    }

    private UUID seedBailleur(String keycloakId) {
        return UUID.fromString(jdbc.queryForObject("""
                INSERT INTO bailleur (id, keycloak_id, email, nom, prenom)
                VALUES (gen_random_uuid(), ?, ?, 'Durand', 'Alice') RETURNING id
                """, String.class, keycloakId, keycloakId + "@test.local"));
    }

    private UUID seedGestionnaire(String keycloakId) {
        return UUID.fromString(jdbc.queryForObject("""
                INSERT INTO gestionnaire (id, keycloak_id, email, nom, prenom, statut)
                VALUES (gen_random_uuid(), ?, ?, 'Martin', 'Bob', 'ACTIVE') RETURNING id
                """, String.class, keycloakId, keycloakId + "@test.local"));
    }

    private UUID seedBien(UUID bailleurId) {
        UUID patrimoineId = UUID.fromString(jdbc.queryForObject("""
                INSERT INTO patrimoine (id, bailleur_id, nom, adresse)
                VALUES (gen_random_uuid(), ?, 'Patrimoine test', '1 rue test') RETURNING id
                """, String.class, bailleurId));
        return UUID.fromString(jdbc.queryForObject("""
                INSERT INTO bien (id, bailleur_id, adresse, type, statut, patrimoine_id)
                VALUES (gen_random_uuid(), ?, '2 rue test', 'APPARTEMENT', 'LIBRE', ?) RETURNING id
                """, String.class, bailleurId, patrimoineId));
    }

    private void seedAffectation(UUID bailleurId, UUID bienId, UUID gestionnaireId, String statut) {
        jdbc.update("""
                INSERT INTO affectation (id, bailleur_id, bien_id, gestionnaire_id, type_honoraires,
                                         montant_honoraires, date_debut, statut)
                VALUES (gen_random_uuid(), ?, ?, ?, 'POURCENTAGE', 5.00, current_date, ?)
                """, bailleurId, bienId, gestionnaireId, statut);
    }

    private UUID seedNotificationEvent(UUID bailleurId, UUID bienId, String eventType) {
        return UUID.fromString(jdbc.queryForObject("""
                INSERT INTO notification_event
                    (id, bailleur_id, event_type, aggregate_type, aggregate_id, payload_minimal, bien_id)
                VALUES (gen_random_uuid(), ?, ?, 'BAIL', gen_random_uuid(), '{}'::jsonb, ?) RETURNING id
                """, String.class, bailleurId, eventType, bienId));
    }

    private void seedDelivery(UUID bailleurId, UUID eventId, UUID recipientId, String channel,
            String recipientAddress, String motif) {
        jdbc.update("""
                INSERT INTO notification_delivery
                    (id, bailleur_id, event_id, recipient_id, channel, provider, provider_message_id,
                     statut, attempt_count, error_code)
                VALUES (gen_random_uuid(), ?, ?, ?, ?, 'TWILIO', 'SID-' || gen_random_uuid(),
                        'QUEUED', 1, ?)
                """, bailleurId, eventId, recipientId, channel, motif);
        jdbc.update("""
                INSERT INTO notification_preference
                    (id, bailleur_id, recipient_type, recipient_id, phone_e164, preferred_channel,
                     whatsapp_opt_in, sms_opt_in, consent_at, consent_source, enabled)
                VALUES (gen_random_uuid(), ?, 'BAILLEUR', ?, ?, ?, true, true, now(),
                        'FORMULAIRE_LOYERTRACKER', true)
                ON CONFLICT DO NOTHING
                """, bailleurId, recipientId, recipientAddress, channel);
    }

    private static JwtRequestPostProcessor bailleurJwt(String keycloakId) {
        return jwt().jwt(token -> token.subject(keycloakId))
                .authorities(new SimpleGrantedAuthority("ROLE_BAILLEUR"));
    }

    private static JwtRequestPostProcessor gestionnaireJwt(String keycloakId) {
        return jwt().jwt(token -> token.subject(keycloakId))
                .authorities(new SimpleGrantedAuthority("ROLE_GESTIONNAIRE"));
    }
}
