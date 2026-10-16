package com.loyertracker.biens;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * Transitions de statut d'un bien liées aux baux (lot 1 « Cycle de vie du bail »). Aucun contexte
 * Spring : ces règles vivent sur l'entité, comme {@code Bail.cloturer()} / {@code rouvrir()}.
 */
class BienStatutTest {

    private Bien bien(StatutBien statut) {
        return new Bien(UUID.randomUUID(), UUID.randomUUID(), "1 rue Test", "APPARTEMENT", statut,
                UUID.randomUUID());
    }

    @Test
    void libererPasseUnBienLoueALibre() {
        Bien b = bien(StatutBien.LOUE);

        b.liberer();

        assertThat(b.getStatut()).isEqualTo(StatutBien.LIBRE);
    }

    @Test
    void libererNeChangePasLesEtatsManuelsNiUnBienDejaLibre() {
        for (StatutBien statut : new StatutBien[] {StatutBien.LIBRE, StatutBien.EN_TRAVAUX,
                StatutBien.ARCHIVE}) {
            Bien b = bien(statut);

            b.liberer();

            assertThat(b.getStatut()).isEqualTo(statut);
        }
    }

    @Test
    void louerPasseUnBienLibreALoue() {
        Bien b = bien(StatutBien.LIBRE);

        b.louer();

        assertThat(b.getStatut()).isEqualTo(StatutBien.LOUE);
    }

    @Test
    void louerUnBienDejaLoueResteIdempotent() {
        Bien b = bien(StatutBien.LOUE);

        b.louer();

        assertThat(b.getStatut()).isEqualTo(StatutBien.LOUE);
    }

    @Test
    void louerUnBienEnTravauxOuArchiveLeve409EtLaisseLeStatut() {
        for (StatutBien statut : new StatutBien[] {StatutBien.EN_TRAVAUX, StatutBien.ARCHIVE}) {
            Bien b = bien(statut);

            assertThatThrownBy(b::louer)
                    .isInstanceOf(ResponseStatusException.class)
                    .extracting("statusCode").isEqualTo(HttpStatus.CONFLICT);
            assertThat(b.getStatut()).isEqualTo(statut);
        }
    }
}
