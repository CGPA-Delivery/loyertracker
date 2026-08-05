package com.loyertracker.comptes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loyertracker.notifications.CanalNotification;
import com.loyertracker.notifications.NotificationEvent;
import com.loyertracker.notifications.NotificationEventRepository;
import com.loyertracker.notifications.NotificationOutbox;
import com.loyertracker.notifications.NotificationOutboxRepository;
import com.loyertracker.notifications.StatutOutbox;
import com.loyertracker.notifications.TypeAgregatNotification;
import com.loyertracker.notifications.TypeEvenementNotification;
import com.loyertracker.securite.TenantContext;

/**
 * Valide la génération d'invitation (US-11) contre PostgreSQL + Flyway (schéma complet, y compris
 * V27-V31), avec le même contrat de sécurité que l'API runtime. Couvre le chemin de résolution
 * tenant (ADR-09) : un bailleur inscrit obtient son contexte, un porteur de JWT sans compte
 * applicatif est refusé, ainsi que la voie transactionnelle EMAIL (ADR-19 §2/§6, EP-18 Sprint B,
 * US-139, TC-130/141/143) — via le véritable {@code InvitationService.inviter(...)}, pas un seed
 * JDBC (le comportement du {@code NotificationDispatcher} lui-même reste couvert par
 * {@code NotificationDispatchIntegrationTest}, inchangé).
 */
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class InvitationGenerationIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    MockMvc mockMvc;
    @Autowired
    ObjectMapper json;
    @Autowired
    TenantContext tenant;
    @Autowired
    PlatformTransactionManager txManager;
    @Autowired
    NotificationEventRepository eventRepository;
    @Autowired
    NotificationOutboxRepository outboxRepository;

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        // Seule l'URL est dynamique : datasource applicatif sous loyertracker_api (creds statiques
        // dans application.properties), Flyway en admin. On ne surcharge plus username/password.
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.security.oauth2.resourceserver.jwt.issuer-uri",
                () -> "https://localhost/auth/realms/loyertracker");
        registry.add("spring.security.oauth2.resourceserver.jwt.jwk-set-uri",
                () -> "http://localhost:0/realms/loyertracker/protocol/openid-connect/certs");
    }

    @Test
    void bailleurInscritGenereUneInvitationValide72h() throws Exception {
        String keycloakId = "kc-" + UUID.randomUUID();
        // Pré-requis : le bailleur doit exister côté application pour que le contexte se résolve.
        mockMvc.perform(post("/api/bailleurs/inscription").with(bailleurJwt(keycloakId)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/invitations")
                        .with(bailleurJwt(keycloakId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"gestionnaire@test.local\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("gestionnaire@test.local"))
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.statut").value("PENDING"))
                .andExpect(jsonPath("$.dateExpiration").isNotEmpty())
                .andExpect(jsonPath("$.lien").value(org.hamcrest.Matchers.containsString("/invitations/")));
    }

    @Test
    void invitationParUtilisateurSansCompteBailleurEstRefusee() throws Exception {
        // JWT rôle BAILLEUR mais aucun compte applicatif (subject jamais inscrit) → 403 (ADR-09).
        mockMvc.perform(post("/api/invitations")
                        .with(bailleurJwt("kc-" + UUID.randomUUID()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"gestionnaire@test.local\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void invitationSansRoleBailleurEstRefusee() throws Exception {
        mockMvc.perform(post("/api/invitations")
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"gestionnaire@test.local\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void invitationAvecEmailInvalideEstRejetee() throws Exception {
        mockMvc.perform(post("/api/invitations")
                        .with(bailleurJwt("kc-" + UUID.randomUUID()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"pas-un-email\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void invitationCreeEvenementEtLigneOutboxEmailDansLaMemeTransaction() throws Exception {
        // TC-130 (ADR-19 §2, EF-125) : voie transactionnelle — aucune NotificationPreference
        // n'existe pour cet invité (il n'a pas de compte), pourtant la ligne Outbox est PENDING.
        String keycloakId = "kc-" + UUID.randomUUID();
        mockMvc.perform(post("/api/bailleurs/inscription").with(bailleurJwt(keycloakId)))
                .andExpect(status().isCreated());

        String reponse = mockMvc.perform(post("/api/invitations")
                        .with(bailleurJwt(keycloakId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"gestionnaire-notif@test.local\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        UUID invitationId = UUID.fromString(json.readTree(reponse).get("id").asText());

        new TransactionTemplate(txManager).executeWithoutResult(status -> {
            tenant.activerDepuisKeycloak(keycloakId);

            List<NotificationEvent> evenements =
                    eventRepository.findByAggregateIdOrderByDateCreationDesc(invitationId);
            assertThat(evenements).hasSize(1);
            NotificationEvent evenement = evenements.get(0);
            assertThat(evenement.getEventType()).isEqualTo(TypeEvenementNotification.INVITATION_CREEE);
            assertThat(evenement.getAggregateType()).isEqualTo(TypeAgregatNotification.INVITATION);

            List<NotificationOutbox> lignes = outboxRepository.findByEventId(evenement.getId());
            assertThat(lignes).hasSize(1);
            NotificationOutbox ligne = lignes.get(0);
            assertThat(ligne.getChannel()).isEqualTo(CanalNotification.EMAIL);
            assertThat(ligne.getRecipientAddress()).isEqualTo("gestionnaire-notif@test.local");
            assertThat(ligne.getRecipientId()).isEqualTo(invitationId);
            assertThat(ligne.getStatut()).isEqualTo(StatutOutbox.PENDING);
        });
    }

    @Test
    void deuxInvitationsPourLeMemeEmailProduisentDeuxEvenementsDistinctsSansDoublon() throws Exception {
        // TC-141 : « régénération » = un nouvel appel à POST /api/invitations pour le même e-mail
        // (aucun endpoint de régénération dédié n'existe ni n'est nécessaire — recipient_id =
        // Invitation.id garantit deux lignes Outbox distinctes, sans violer la contrainte unique
        // d'idempotence héritée d'ADR-18 §4).
        String keycloakId = "kc-" + UUID.randomUUID();
        mockMvc.perform(post("/api/bailleurs/inscription").with(bailleurJwt(keycloakId)))
                .andExpect(status().isCreated());

        String premiere = mockMvc.perform(post("/api/invitations")
                        .with(bailleurJwt(keycloakId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"gestionnaire-regen@test.local\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        String seconde = mockMvc.perform(post("/api/invitations")
                        .with(bailleurJwt(keycloakId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"gestionnaire-regen@test.local\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        UUID premiereId = UUID.fromString(json.readTree(premiere).get("id").asText());
        UUID secondeId = UUID.fromString(json.readTree(seconde).get("id").asText());
        assertThat(premiereId).isNotEqualTo(secondeId);

        new TransactionTemplate(txManager).executeWithoutResult(status -> {
            tenant.activerDepuisKeycloak(keycloakId);
            assertThat(eventRepository.findByAggregateIdOrderByDateCreationDesc(premiereId)).hasSize(1);
            assertThat(eventRepository.findByAggregateIdOrderByDateCreationDesc(secondeId)).hasSize(1);
        });
    }

    @Test
    void notificationDInvitationEstIsoleeParBailleurRls() throws Exception {
        // TC-143 : un autre bailleur ne peut jamais lire l'événement/la ligne Outbox d'une
        // invitation qui ne lui appartient pas (RLS bailleur_isolation, héritée V27, inchangée).
        String keycloakA = "kc-" + UUID.randomUUID();
        String keycloakB = "kc-" + UUID.randomUUID();
        mockMvc.perform(post("/api/bailleurs/inscription").with(bailleurJwt(keycloakA)))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/api/bailleurs/inscription").with(bailleurJwt(keycloakB)))
                .andExpect(status().isCreated());

        String reponse = mockMvc.perform(post("/api/invitations")
                        .with(bailleurJwt(keycloakA))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"gestionnaire-iso@test.local\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        UUID invitationId = UUID.fromString(json.readTree(reponse).get("id").asText());

        new TransactionTemplate(txManager).executeWithoutResult(status -> {
            tenant.activerDepuisKeycloak(keycloakB);
            assertThat(eventRepository.findByAggregateIdOrderByDateCreationDesc(invitationId)).isEmpty();
        });
    }

    private static JwtRequestPostProcessor bailleurJwt(String keycloakId) {
        return jwt()
                .jwt(token -> token
                        .subject(keycloakId)
                        .claim("email", keycloakId + "@test.local")
                        .claim("given_name", "Alice")
                        .claim("family_name", "Durand"))
                .authorities(new SimpleGrantedAuthority("ROLE_BAILLEUR"));
    }
}
