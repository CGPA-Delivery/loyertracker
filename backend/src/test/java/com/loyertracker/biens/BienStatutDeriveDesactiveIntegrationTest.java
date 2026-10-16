package com.loyertracker.biens;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
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

import com.jayway.jsonpath.JsonPath;
import com.loyertracker.testsupport.RlsTestDataSourceConfig;

/**
 * Lot 1, décision L1-D5 : avec {@code app.biens.statut-derive.enabled=false}, le comportement
 * antérieur au lot 1 est rétabli (retour arrière par configuration, sans redéploiement du code).
 */
@SpringBootTest(properties = "app.biens.statut-derive.enabled=false")
@AutoConfigureMockMvc
@Testcontainers
@Import(RlsTestDataSourceConfig.class)
class BienStatutDeriveDesactiveIntegrationTest {

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
                TRUNCATE audit_log, alerte, honoraire, garantie, paiement, affectation, bail,
                         locataire, bien, patrimoine, invitation, bailleur, gestionnaire
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
    }

    @Test
    void drapeauDesactiveLaClotureNeLiberePasLeBienEtLeStatutSaisiEstEcrit() throws Exception {
        String bailleur = "kc-" + UUID.randomUUID();
        mockMvc.perform(post("/api/bailleurs/inscription").with(bailleurJwt(bailleur)))
                .andExpect(status().isCreated());
        String patrimoineId = JsonPath.read(mockMvc.perform(post("/api/patrimoines")
                        .with(bailleurJwt(bailleur))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nom\":\"P\",\"adresse\":\"1 rue P\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString(), "$.id");
        String bienId = JsonPath.read(mockMvc.perform(post("/api/biens")
                        .with(bailleurJwt(bailleur))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpsBien("1 rue Retour", "LIBRE", patrimoineId)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString(), "$.id");
        String locataireId = JsonPath.read(mockMvc.perform(post("/api/locataires")
                        .with(bailleurJwt(bailleur))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nom\":\"Locataire\",\"email\":\"loc@test.local\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString(), "$.id");
        String bailId = JsonPath.read(mockMvc.perform(post("/api/biens/{bienId}/baux", bienId)
                        .with(bailleurJwt(bailleur))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"locataireId\":\"" + locataireId + "\",\"loyerHc\":850.00,"
                                + "\"provisionCharges\":0.00,\"dateDebut\":\"2026-01-01\","
                                + "\"dateFin\":\"2026-12-31\",\"devise\":\"EUR\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString(), "$.id");

        // Comportement d'origine : une date de clôture future est acceptée, et la clôture ne
        // touche pas au bien, qui reste LOUE.
        String demain = LocalDate.now(ZoneId.systemDefault()).plusDays(1).toString();
        mockMvc.perform(post("/api/biens/{bienId}/baux/{bailId}/cloture", bienId, bailId)
                        .with(bailleurJwt(bailleur))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"dateClotureEffective\":\"" + demain + "\"}"))
                .andExpect(status().isOk());
        assertThat(statutDuBien(bailleur, bienId)).isEqualTo("LOUE");

        // Comportement d'origine : le statut saisi est écrit tel quel.
        mockMvc.perform(put("/api/biens/{id}", bienId)
                        .with(bailleurJwt(bailleur))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpsBien("1 rue Retour", "EN_TRAVAUX", patrimoineId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statut").value("EN_TRAVAUX"));
    }

    private static String corpsBien(String adresse, String statut, String patrimoineId) {
        return "{\"adresse\":\"" + adresse + "\",\"type\":\"APPARTEMENT\",\"statut\":\"" + statut
                + "\",\"patrimoineId\":\"" + patrimoineId + "\"}";
    }

    private String statutDuBien(String keycloakId, String bienId) throws Exception {
        String corps = mockMvc.perform(get("/api/biens").with(bailleurJwt(keycloakId)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        List<String> statuts = JsonPath.read(corps, "$[?(@.id=='" + bienId + "')].statut");
        assertThat(statuts).hasSize(1);
        return statuts.get(0);
    }

    private static JwtRequestPostProcessor bailleurJwt(String keycloakId) {
        return jwt()
                .jwt(token -> token.subject(keycloakId)
                        .claim("email", keycloakId + "@test.local")
                        .claim("given_name", "Alice")
                        .claim("family_name", "Durand"))
                .authorities(new SimpleGrantedAuthority("ROLE_BAILLEUR"));
    }
}
