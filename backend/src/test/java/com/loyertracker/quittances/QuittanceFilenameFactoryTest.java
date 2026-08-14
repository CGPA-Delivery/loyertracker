package com.loyertracker.quittances;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIllegalArgumentException;

import org.junit.jupiter.api.Test;

class QuittanceFilenameFactoryTest {

    @Test
    void quittanceCertifieeProduitUnNomStableSansPii() {
        assertThat(QuittanceFilenameFactory.quittanceCertifiee("2026-01"))
                .isEqualTo("quittance-certifiee-2026-01.pdf");
    }

    @Test
    void quittanceCertifieeRejetteUnePeriodeQuiPourraitPolluerUnNomDeFichier() {
        assertThatIllegalArgumentException()
                .isThrownBy(() -> QuittanceFilenameFactory.quittanceCertifiee("2026-01/../../nom-prive"));
    }
}
