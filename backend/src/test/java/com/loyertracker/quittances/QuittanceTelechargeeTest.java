package com.loyertracker.quittances;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class QuittanceTelechargeeTest {

    @Test
    void compareLeContenuPdfSansLexposerDansToString() {
        QuittanceTelechargee premier = new QuittanceTelechargee(new byte[] { 1, 2, 3 }, "2026-01");
        QuittanceTelechargee second = new QuittanceTelechargee(new byte[] { 1, 2, 3 }, "2026-01");

        assertThat(premier).isEqualTo(second).hasSameHashCodeAs(second);
        assertThat(premier).hasToString("QuittanceTelechargee[periode=2026-01, pdfLength=3]");
    }
}
