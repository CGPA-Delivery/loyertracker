package com.loyertracker.db;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.loyertracker.testsupport.RlsTestDataSourceConfig;

/**
 * Preuve d'exécution du script {@code infra/scripts/detection-incoherences-bail-bien.sql}
 * (plan cycle de vie du bail, §6) sur le schéma réel migré par Flyway, avec des données
 * strictement synthétiques : une anomalie isolée par bien, plus des cas sains qui ne doivent
 * rien produire.
 *
 * <p>Le script est exécuté tel quel, via le datasource admin (contournement RLS, comme requis
 * par le script). Le test vérifie aussi qu'il ne modifie aucune donnée.</p>
 */
@SpringBootTest
@Testcontainers
@Import(RlsTestDataSourceConfig.class)
class DetectionIncoherencesBailBienScriptTest {

    private static final Path SCRIPT = Path.of("..", "infra", "scripts",
            "detection-incoherences-bail-bien.sql");

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    @Qualifier("admin")
    JdbcTemplate jdbc;

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.security.oauth2.resourceserver.jwt.issuer-uri",
                () -> "https://localhost/auth/realms/loyertracker");
        registry.add("spring.security.oauth2.resourceserver.jwt.jwk-set-uri",
                () -> "http://localhost:0/realms/loyertracker/protocol/openid-connect/certs");
    }

    @BeforeEach
    void nettoyerBase() {
        jdbc.execute("""
                TRUNCATE audit_log, alerte, honoraire, garantie, paiement, affectation, bail,
                         locataire, bien, patrimoine, invitation, bailleur, gestionnaire
                RESTART IDENTITY CASCADE
                """);
    }

    // ------------------------------------------------------------------ garde statique

    @Test
    void scriptEstEnTransactionLectureSeuleSansInstructionDEcriture() throws Exception {
        String sql = Files.readString(SCRIPT, StandardCharsets.UTF_8);
        String code = sql.replaceAll("--[^\\n]*", "").strip();

        assertThat(code).startsWith("BEGIN READ ONLY;").endsWith("ROLLBACK;");
        assertThat(Pattern.compile("\\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|GRANT|COMMIT)\\b",
                Pattern.CASE_INSENSITIVE).matcher(code).find())
                .as("le script ne doit contenir aucune instruction d'écriture ni de DDL")
                .isFalse();
    }

    // ------------------------------------------------------------------ détection

    @Test
    void chaqueRegleDetecteSonAnomalieEtLesCasSainsNeProduisentRien() throws Exception {
        UUID b1 = bailleur();
        UUID b2 = bailleur();
        UUID p1 = patrimoine(b1);
        UUID l1 = locataire(b1, "ACTIVE");
        UUID l1Archive = locataire(b1, "ARCHIVE");
        UUID l2 = locataire(b2, "ACTIVE");

        // Cas sains : ne doivent produire aucune ligne.
        UUID sain1 = bien(b1, p1, "LOUE");
        bail(b1, sain1, l1, "ACTIF", "2025-01-01", "2099-12-31", null);
        UUID sain2 = bien(b1, p1, "LIBRE");
        bail(b1, sain2, l1, "CLOS", "2024-01-01", "2024-12-31", "2024-12-31");
        UUID sainVide = bien(b1, p1, "LIBRE");
        UUID sainTravaux = bien(b1, p1, "EN_TRAVAUX");

        // A1 : LOUE sans aucun bail ACTIF.
        UUID a1 = bien(b1, p1, "LOUE");
        // A2 / A3 / A4 : bail ACTIF sur un bien LIBRE / ARCHIVE / EN_TRAVAUX.
        UUID a2 = bien(b1, p1, "LIBRE");
        bail(b1, a2, l1, "ACTIF", "2025-01-01", null, null);
        UUID a3 = bien(b1, p1, "ARCHIVE");
        bail(b1, a3, l1, "ACTIF", "2025-01-01", null, null);
        UUID a4 = bien(b1, p1, "EN_TRAVAUX");
        bail(b1, a4, l1, "ACTIF", "2025-01-01", null, null);
        // A5 : terme dépassé sans clôture.
        UUID a5 = bien(b1, p1, "LOUE");
        bail(b1, a5, l1, "ACTIF", "2019-01-01", "2020-01-01", null);
        // A6 : CLOS sans date de clôture effective.
        UUID a6 = bien(b1, p1, "LIBRE");
        bail(b1, a6, l1, "CLOS", "2025-01-01", null, null);
        // A7 : clôture antérieure au début (ne doit pas faire échouer daterange()).
        UUID a7 = bien(b1, p1, "LIBRE");
        bail(b1, a7, l1, "CLOS", "2025-06-01", null, "2025-01-01");
        // A8 : deux baux CLOS aux périodes qui se chevauchent.
        UUID a8 = bien(b1, p1, "LIBRE");
        bail(b1, a8, l1, "CLOS", "2024-01-01", "2024-12-31", "2024-12-31");
        bail(b1, a8, l1, "CLOS", "2024-06-01", "2025-03-31", "2025-03-31");
        // A9 : A_VENIR postérieure au mois de clôture (2025-04) ; celle de 2025-03 est légitime.
        UUID a9 = bien(b1, p1, "LIBRE");
        UUID bailA9 = bail(b1, a9, l1, "CLOS", "2025-01-01", "2025-03-15", "2025-03-15");
        paiement(b1, bailA9, a9, "2025-03", "A_VENIR", "800.00", "0.00");
        paiement(b1, bailA9, a9, "2025-04", "A_VENIR", "800.00", "0.00");
        // A10 : créances ouvertes : IMPAYE 800 + PARTIEL (800 - 300) -> reste dû 1300.00.
        UUID a10 = bien(b1, p1, "LIBRE");
        UUID bailA10 = bail(b1, a10, l1, "CLOS", "2025-01-01", "2025-03-31", "2025-03-31");
        paiement(b1, bailA10, a10, "2025-01", "IMPAYE", "800.00", "0.00");
        paiement(b1, bailA10, a10, "2025-02", "PARTIEL", "800.00", "300.00");
        paiement(b1, bailA10, a10, "2025-03", "RECU", "800.00", "800.00"); // non compté
        // A11 : bail ACTIF dont le locataire est archivé.
        UUID a11 = bien(b1, p1, "LOUE");
        bail(b1, a11, l1Archive, "ACTIF", "2025-01-01", null, null);
        // A12 : trois incohérences de bailleur_id.
        UUID a12Bien = bien(b1, p1, "LOUE");
        bail(b2, a12Bien, l2, "ACTIF", "2025-01-01", null, null); // bail.bailleur <> bien.bailleur
        UUID a12Loc = bien(b1, p1, "LOUE");
        bail(b1, a12Loc, l2, "ACTIF", "2025-01-01", null, null); // bail.bailleur <> locataire.bailleur
        UUID a12Pai = bien(b1, p1, "LOUE");
        UUID bailA12 = bail(b1, a12Pai, l1, "ACTIF", "2025-01-01", null, null);
        paiement(b2, bailA12, a12Pai, "2025-01", "RECU", "800.00", "800.00"); // paiement.bailleur <> bail

        Map<String, Integer> avant = comptes();
        Resultat r = executerScript();
        assertThat(comptes()).as("le script ne doit modifier aucune donnée").isEqualTo(avant);

        assertThat(r.codes(sain1)).isEmpty();
        assertThat(r.codes(sain2)).isEmpty();
        assertThat(r.codes(sainVide)).isEmpty();
        assertThat(r.codes(sainTravaux)).isEmpty();

        assertThat(r.codes(a1)).containsExactly("A1");
        assertThat(r.codes(a2)).containsExactly("A2");
        assertThat(r.codes(a3)).containsExactly("A3");
        assertThat(r.codes(a4)).containsExactly("A4");
        assertThat(r.codes(a5)).containsExactly("A5");
        assertThat(r.codes(a6)).containsExactly("A6");
        assertThat(r.codes(a7)).containsExactly("A7");
        assertThat(r.codes(a8)).containsExactly("A8");
        assertThat(r.codes(a9)).containsExactly("A9");
        assertThat(r.codes(a10)).containsExactly("A10");
        assertThat(r.codes(a11)).containsExactly("A11");
        assertThat(r.codes(a12Bien)).containsExactly("A12");
        assertThat(r.codes(a12Loc)).containsExactly("A12");
        assertThat(r.codes(a12Pai)).containsExactly("A12");

        assertThat(r.detail(a9, "A9")).startsWith("1 échéance(s) A_VENIR").contains("2025-04");
        assertThat(r.detail(a10, "A10")).startsWith("2 créance(s) ouverte(s)").endsWith("1300.00");
        assertThat(r.detail(a5, "A5")).contains("2020-01-01");

        assertThat(r.volumetrie)
                .containsEntry("biens", count("bien"))
                .containsEntry("baux ACTIF", count("bail WHERE statut = 'ACTIF'"))
                .containsEntry("paiements", count("paiement"));
    }

    @Test
    void baseVideNeProduitAucuneAnomalie() throws Exception {
        Resultat r = executerScript();
        assertThat(r.lignes).isEmpty();
        assertThat(r.volumetrie.get("biens")).isZero();
    }

    // ------------------------------------------------------------------ exécution du script

    private record Ligne(String code, String gravite, UUID bienId, String detail) {
    }

    private static final class Resultat {
        final List<Ligne> lignes = new ArrayList<>();
        final Map<String, Integer> volumetrie = new HashMap<>();

        List<String> codes(UUID bienId) {
            return lignes.stream().filter(l -> bienId.equals(l.bienId())).map(Ligne::code).toList();
        }

        String detail(UUID bienId, String code) {
            return lignes.stream()
                    .filter(l -> bienId.equals(l.bienId()) && l.code().equals(code))
                    .map(Ligne::detail).findFirst().orElseThrow();
        }
    }

    /** Exécute le fichier tel quel (plusieurs instructions) et collecte les deux jeux de résultats. */
    private Resultat executerScript() throws Exception {
        String sql = Files.readString(SCRIPT, StandardCharsets.UTF_8);
        Resultat resultat = new Resultat();
        try (Connection c = jdbc.getDataSource().getConnection(); Statement st = c.createStatement()) {
            boolean estResultSet = st.execute(sql);
            while (estResultSet || st.getUpdateCount() != -1) {
                if (estResultSet) {
                    try (ResultSet rs = st.getResultSet()) {
                        collecter(rs, resultat);
                    }
                }
                estResultSet = st.getMoreResults();
            }
        }
        return resultat;
    }

    private static void collecter(ResultSet rs, Resultat resultat) throws SQLException {
        ResultSetMetaData md = rs.getMetaData();
        boolean anomalies = "code".equalsIgnoreCase(md.getColumnLabel(1));
        while (rs.next()) {
            if (anomalies) {
                resultat.lignes.add(new Ligne(rs.getString("code"), rs.getString("gravite"),
                        rs.getObject("bien_id", UUID.class), rs.getString("detail")));
            } else {
                resultat.volumetrie.put(rs.getString("objet"), rs.getInt("total"));
            }
        }
    }

    // ------------------------------------------------------------------ données synthétiques

    private Map<String, Integer> comptes() {
        Map<String, Integer> m = new HashMap<>();
        for (String t : List.of("bailleur", "patrimoine", "locataire", "bien", "bail", "paiement")) {
            m.put(t, count(t));
        }
        return m;
    }

    private int count(String fromClause) {
        return jdbc.queryForObject("SELECT count(*) FROM " + fromClause, Integer.class);
    }

    private UUID bailleur() {
        UUID id = UUID.randomUUID();
        jdbc.update("INSERT INTO bailleur (id, keycloak_id, email, nom, prenom) VALUES (?,?,?,?,?)",
                id, "kc-" + id, id + "@test.local", "Nom", "Prenom");
        return id;
    }

    private UUID patrimoine(UUID bailleurId) {
        return jdbc.queryForObject(
                "INSERT INTO patrimoine (bailleur_id, nom, adresse) VALUES (?, 'Patrimoine test', "
                        + "'1 rue Test') RETURNING id", UUID.class, bailleurId);
    }

    private UUID locataire(UUID bailleurId, String statut) {
        UUID id = UUID.randomUUID();
        jdbc.update("INSERT INTO locataire (id, bailleur_id, nom, statut) VALUES (?,?,'Locataire test',?)",
                id, bailleurId, statut);
        return id;
    }

    private UUID bien(UUID bailleurId, UUID patrimoineId, String statut) {
        return jdbc.queryForObject(
                "INSERT INTO bien (bailleur_id, adresse, type, statut, patrimoine_id) "
                        + "VALUES (?, '2 rue Test', 'APPARTEMENT', ?, ?) RETURNING id",
                UUID.class, bailleurId, statut, patrimoineId);
    }

    private UUID bail(UUID bailleurId, UUID bienId, UUID locataireId, String statut,
            String debut, String fin, String clotureEffective) {
        return jdbc.queryForObject("""
                INSERT INTO bail (bailleur_id, bien_id, locataire_id, loyer_hc, provision_charges,
                                  loyer_cc, date_debut, date_fin, statut, devise,
                                  date_cloture_effective)
                VALUES (?, ?, ?, 800.00, 0.00, 800.00, ?::date, ?::date, ?, 'EUR', ?::date)
                RETURNING id
                """, UUID.class, bailleurId, bienId, locataireId, debut, fin, statut, clotureEffective);
    }

    private void paiement(UUID bailleurId, UUID bailId, UUID bienId, String periode, String statut,
            String attendu, String recu) {
        jdbc.update("""
                INSERT INTO paiement (bailleur_id, bail_id, bien_id, periode, montant_attendu,
                                      montant_recu, date_exigibilite, statut)
                VALUES (?, ?, ?, ?, ?::numeric, ?::numeric, ?::date, ?)
                """, bailleurId, bailId, bienId, periode, attendu, recu, periode + "-05", statut);
    }
}
