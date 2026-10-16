package com.loyertracker.biens;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

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
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.jayway.jsonpath.JsonPath;
import com.loyertracker.testsupport.RlsTestDataSourceConfig;

/**
 * Lot 1 du programme « Cycle de vie du bail » (plan {@code plan-execution-lot1-statut-bien-derive.md},
 * étape 3, décisions L1-D1 à L1-D4) : le statut {@code LOUE} / {@code LIBRE} d'un bien est déduit
 * des baux et n'est plus saisi à la main.
 *
 * <p>Ces scénarios ont été écrits <strong>avant</strong> le correctif : avec le code d'origine,
 * ceux qui décrivent le nouveau comportement échouent (le bien reste {@code LOUE} après une
 * clôture, le statut saisi est écrit tel quel, une clôture à date future est acceptée). Le scénario
 * de concurrence décrit un comportement déjà garanti par {@code uq_bail_actif} : il sert de test
 * de non-régression.</p>
 */
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@Import(RlsTestDataSourceConfig.class)
class BienStatutDeriveIntegrationTest {

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

    // ---- clôture et libération ------------------------------------------------------

    @Test
    void clotureLibereLeBienEtUnNouveauBailEstCreeSansIntervention() throws Exception {
        String bailleur = "kc-" + UUID.randomUUID();
        inscrireBailleur(bailleur);
        BienCree bien = creerBien(bailleur, "1 rue Liberation");
        String bailA = creerBail(bailleur, bien.id(), "2026-01-01", "2026-12-31");
        assertThat(statutDuBien(bailleur, bien.id())).isEqualTo("LOUE");

        mockMvc.perform(cloturer(bien.id(), bailA, bailleur, null)).andExpect(status().isOk());

        assertThat(statutDuBien(bailleur, bien.id())).isEqualTo("LIBRE");
        // Aucun UPDATE en base ni appel à PUT /api/biens : la création du bail B doit aboutir.
        creerBail(bailleur, bien.id(), "2027-01-01", "2027-12-31");
        assertThat(statutDuBien(bailleur, bien.id())).isEqualTo("LOUE");
    }

    @Test
    void reouvertureRemetLeBienLoue() throws Exception {
        String bailleur = "kc-" + UUID.randomUUID();
        inscrireBailleur(bailleur);
        BienCree bien = creerBien(bailleur, "2 rue Reouverture");
        String bailId = creerBail(bailleur, bien.id(), "2026-01-01", "2026-12-31");
        mockMvc.perform(cloturer(bien.id(), bailId, bailleur, null)).andExpect(status().isOk());
        assertThat(statutDuBien(bailleur, bien.id())).isEqualTo("LIBRE");

        mockMvc.perform(rouvrir(bien.id(), bailId, bailleur))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statut").value("ACTIF"));

        assertThat(statutDuBien(bailleur, bien.id())).isEqualTo("LOUE");
    }

    // ---- L1-D1 : réouverture refusée si le bien n'est pas libre ---------------------

    @Test
    void reouvertureRefuseeSiLeBienEstEnTravaux() throws Exception {
        String bailleur = "kc-" + UUID.randomUUID();
        inscrireBailleur(bailleur);
        BienCree bien = creerBien(bailleur, "3 rue Travaux");
        String bailId = creerBail(bailleur, bien.id(), "2026-01-01", "2026-12-31");
        mockMvc.perform(cloturer(bien.id(), bailId, bailleur, null)).andExpect(status().isOk());
        mockMvc.perform(modifierBien(bien, bailleur, "EN_TRAVAUX")).andExpect(status().isOk());

        mockMvc.perform(rouvrir(bien.id(), bailId, bailleur)).andExpect(status().isConflict());

        assertThat(statutDuBien(bailleur, bien.id())).isEqualTo("EN_TRAVAUX");
    }

    @Test
    void reouvertureRefuseeSiLeBienEstArchive() throws Exception {
        String bailleur = "kc-" + UUID.randomUUID();
        inscrireBailleur(bailleur);
        BienCree bien = creerBien(bailleur, "4 rue Archive");
        String bailId = creerBail(bailleur, bien.id(), "2026-01-01", "2026-12-31");
        mockMvc.perform(cloturer(bien.id(), bailId, bailleur, null)).andExpect(status().isOk());
        mockMvc.perform(archiver(bien.id(), bailleur)).andExpect(status().isOk());

        mockMvc.perform(rouvrir(bien.id(), bailId, bailleur)).andExpect(status().isConflict());

        assertThat(statutDuBien(bailleur, bien.id())).isEqualTo("ARCHIVE");
    }

    // ---- L1-D2 : EN_TRAVAUX et ARCHIVE refusés avec un bail ACTIF -------------------

    @Test
    void enTravauxRefuseAvecUnBailActif() throws Exception {
        String bailleur = "kc-" + UUID.randomUUID();
        inscrireBailleur(bailleur);
        BienCree bien = creerBien(bailleur, "5 rue Occupe");
        creerBail(bailleur, bien.id(), "2026-01-01", "2026-12-31");

        mockMvc.perform(modifierBien(bien, bailleur, "EN_TRAVAUX")).andExpect(status().isConflict());

        assertThat(statutDuBien(bailleur, bien.id())).isEqualTo("LOUE");
    }

    @Test
    void archivageRefuseAvecUnBailActif() throws Exception {
        String bailleur = "kc-" + UUID.randomUUID();
        inscrireBailleur(bailleur);
        BienCree bien = creerBien(bailleur, "6 rue Occupe");
        creerBail(bailleur, bien.id(), "2026-01-01", "2026-12-31");

        mockMvc.perform(archiver(bien.id(), bailleur)).andExpect(status().isConflict());

        assertThat(statutDuBien(bailleur, bien.id())).isEqualTo("LOUE");
    }

    @Test
    void clotureNeChangePasLEtatManuelDunBienEnTravauxHerite() throws Exception {
        String bailleur = "kc-" + UUID.randomUUID();
        inscrireBailleur(bailleur);
        BienCree bien = creerBien(bailleur, "12 rue Heritage");
        String bailId = creerBail(bailleur, bien.id(), "2026-01-01", "2026-12-31");
        // Donnée héritée d'avant le lot 1 (anomalie A4) : le contrôle L1-D2 empêche désormais de
        // la créer par l'API, elle n'est atteignable qu'en base.
        jdbc.update("UPDATE bien SET statut = 'EN_TRAVAUX' WHERE id = ?::uuid", bien.id());

        mockMvc.perform(cloturer(bien.id(), bailId, bailleur, null)).andExpect(status().isOk());

        assertThat(statutDuBien(bailleur, bien.id())).isEqualTo("EN_TRAVAUX");
    }

    // ---- L1-D3 : clôture à date future refusée jusqu'au lot 2 -----------------------

    @Test
    void clotureADateFutureRefuseeEtLeBailResteActif() throws Exception {
        String bailleur = "kc-" + UUID.randomUUID();
        inscrireBailleur(bailleur);
        BienCree bien = creerBien(bailleur, "7 rue Preavis");
        String bailId = creerBail(bailleur, bien.id(), "2026-01-01", "2026-12-31");
        String demain = LocalDate.now().plusDays(1).toString();

        mockMvc.perform(cloturer(bien.id(), bailId, bailleur,
                        "{\"dateClotureEffective\":\"" + demain + "\"}"))
                .andExpect(status().isBadRequest());

        assertThat(statutDuBail(bailId)).isEqualTo("ACTIF");
        assertThat(statutDuBien(bailleur, bien.id())).isEqualTo("LOUE");
    }

    // ---- L1-D4 : LOUE / LIBRE saisis sont ignorés, le statut dérivé est renvoyé ----

    @Test
    void statutLibreSaisiSurUnBienLoueEstIgnore() throws Exception {
        String bailleur = "kc-" + UUID.randomUUID();
        inscrireBailleur(bailleur);
        BienCree bien = creerBien(bailleur, "8 rue Ignore");
        creerBail(bailleur, bien.id(), "2026-01-01", "2026-12-31");

        mockMvc.perform(modifierBien(bien, bailleur, "LIBRE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statut").value("LOUE"));

        assertThat(statutDuBien(bailleur, bien.id())).isEqualTo("LOUE");
    }

    @Test
    void statutLoueSaisiSurUnBienSansBailEstIgnore() throws Exception {
        String bailleur = "kc-" + UUID.randomUUID();
        inscrireBailleur(bailleur);
        BienCree bien = creerBien(bailleur, "9 rue Libre");

        mockMvc.perform(modifierBien(bien, bailleur, "LOUE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statut").value("LIBRE"));

        assertThat(statutDuBien(bailleur, bien.id())).isEqualTo("LIBRE");
    }

    @Test
    void bienCreeAvecUnStatutLoueEstLibre() throws Exception {
        String bailleur = "kc-" + UUID.randomUUID();
        inscrireBailleur(bailleur);
        String patrimoineId = creerPatrimoine(bailleur, "Patrimoine creation");

        mockMvc.perform(post("/api/biens")
                        .with(bailleurJwt(bailleur))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpsBien("10 rue Creation", "LOUE", patrimoineId)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.statut").value("LIBRE"));
    }

    // ---- non-régression : concurrence -----------------------------------------------

    @Test
    void deuxCreationsSimultaneesSurLeMemeBienUneSeuleAboutit() throws Exception {
        String bailleur = "kc-" + UUID.randomUUID();
        inscrireBailleur(bailleur);
        BienCree bien = creerBien(bailleur, "11 rue Concurrence");
        String locataireA = creerLocataire(bailleur);
        String locataireB = creerLocataire(bailleur);

        CountDownLatch depart = new CountDownLatch(1);
        ExecutorService pool = Executors.newFixedThreadPool(2);
        try {
            Future<Integer> a = pool.submit(creationConcurrente(depart, bien.id(), bailleur, locataireA));
            Future<Integer> b = pool.submit(creationConcurrente(depart, bien.id(), bailleur, locataireB));
            depart.countDown();

            List<Integer> codes = List.of(a.get(), b.get());
            assertThat(codes).containsExactlyInAnyOrder(201, 409);
        } finally {
            pool.shutdownNow();
        }
        Integer actifs = jdbc.queryForObject(
                "SELECT count(*) FROM bail WHERE bien_id = ?::uuid AND statut = 'ACTIF'",
                Integer.class, bien.id());
        assertThat(actifs).isEqualTo(1);
        assertThat(statutDuBien(bailleur, bien.id())).isEqualTo("LOUE");
    }

    private Callable<Integer> creationConcurrente(CountDownLatch depart, String bienId,
            String bailleur, String locataireId) {
        return () -> {
            depart.await();
            return mockMvc.perform(post("/api/biens/{bienId}/baux", bienId)
                            .with(bailleurJwt(bailleur))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(corpsBail(locataireId, "2026-01-01", "2026-12-31")))
                    .andReturn().getResponse().getStatus();
        };
    }

    // ---- helpers --------------------------------------------------------------------

    /** Bien créé pour un test : l'identifiant et son patrimoine (requis pour {@code PUT}). */
    private record BienCree(String id, String adresse, String patrimoineId) {
    }

    private void inscrireBailleur(String keycloakId) throws Exception {
        mockMvc.perform(post("/api/bailleurs/inscription").with(bailleurJwt(keycloakId)))
                .andExpect(status().isCreated());
    }

    private String creerPatrimoine(String keycloakId, String nom) throws Exception {
        return JsonPath.read(mockMvc.perform(post("/api/patrimoines")
                        .with(bailleurJwt(keycloakId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nom\":\"" + nom + "\",\"adresse\":\"1 rue du " + nom + "\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString(), "$.id");
    }

    private BienCree creerBien(String keycloakId, String adresse) throws Exception {
        String patrimoineId = creerPatrimoine(keycloakId, "Patrimoine " + adresse);
        String id = JsonPath.read(mockMvc.perform(post("/api/biens")
                        .with(bailleurJwt(keycloakId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpsBien(adresse, "LIBRE", patrimoineId)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString(), "$.id");
        return new BienCree(id, adresse, patrimoineId);
    }

    private static String corpsBien(String adresse, String statut, String patrimoineId) {
        return "{\"adresse\":\"" + adresse + "\",\"type\":\"APPARTEMENT\",\"statut\":\"" + statut
                + "\",\"patrimoineId\":\"" + patrimoineId + "\"}";
    }

    private String creerLocataire(String keycloakId) throws Exception {
        return JsonPath.read(mockMvc.perform(post("/api/locataires").with(bailleurJwt(keycloakId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nom\":\"Locataire\",\"email\":\"loc@test.local\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString(), "$.id");
    }

    private static String corpsBail(String locataireId, String debut, String fin) {
        return "{\"locataireId\":\"" + locataireId
                + "\",\"loyerHc\":850.00,\"provisionCharges\":0.00,\"dateDebut\":\"" + debut
                + "\",\"dateFin\":\"" + fin + "\",\"devise\":\"EUR\"}";
    }

    private String creerBail(String keycloakId, String bienId, String debut, String fin)
            throws Exception {
        String locataireId = creerLocataire(keycloakId);
        return JsonPath.read(mockMvc.perform(post("/api/biens/{bienId}/baux", bienId)
                        .with(bailleurJwt(keycloakId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpsBail(locataireId, debut, fin)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString(), "$.id");
    }

    /** Statut du bien tel que l'API le publie (liste du bailleur), pas la colonne brute. */
    private String statutDuBien(String keycloakId, String bienId) throws Exception {
        String corps = mockMvc.perform(get("/api/biens").with(bailleurJwt(keycloakId)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        List<String> statuts = JsonPath.read(corps, "$[?(@.id=='" + bienId + "')].statut");
        assertThat(statuts).hasSize(1);
        return statuts.get(0);
    }

    private String statutDuBail(String bailId) {
        return jdbc.queryForObject("SELECT statut FROM bail WHERE id = ?::uuid", String.class, bailId);
    }

    private static MockHttpServletRequestBuilder modifierBien(BienCree bien, String bailleurKc,
            String statut) {
        return put("/api/biens/{id}", bien.id())
                .with(bailleurJwt(bailleurKc))
                .contentType(MediaType.APPLICATION_JSON)
                .content(corpsBien(bien.adresse(), statut, bien.patrimoineId()));
    }

    private static MockHttpServletRequestBuilder archiver(String bienId, String bailleurKc) {
        return patch("/api/biens/{id}/archivage", bienId).with(bailleurJwt(bailleurKc));
    }

    private static MockHttpServletRequestBuilder cloturer(String bienId, String bailId,
            String bailleurKc, String body) {
        var builder = post("/api/biens/{bienId}/baux/{bailId}/cloture", bienId, bailId)
                .with(bailleurJwt(bailleurKc));
        return body == null ? builder
                : builder.contentType(MediaType.APPLICATION_JSON).content(body);
    }

    private static MockHttpServletRequestBuilder rouvrir(String bienId, String bailId,
            String bailleurKc) {
        return post("/api/biens/{bienId}/baux/{bailId}/reouverture", bienId, bailId)
                .with(bailleurJwt(bailleurKc));
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
