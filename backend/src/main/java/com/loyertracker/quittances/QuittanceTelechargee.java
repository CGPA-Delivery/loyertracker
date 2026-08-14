package com.loyertracker.quittances;

import java.util.Arrays;
import java.util.Objects;

/** Exemplaire public autorisé, accompagné uniquement de sa période certifiée de téléchargement. */
public record QuittanceTelechargee(byte[] pdf, String periode) {

    public QuittanceTelechargee {
        pdf = pdf.clone();
    }

    @Override
    public byte[] pdf() {
        return pdf.clone();
    }

    @Override
    public boolean equals(Object autre) {
        return autre instanceof QuittanceTelechargee(byte[] autrePdf, String autrePeriode)
                && Arrays.equals(pdf, autrePdf)
                && Objects.equals(periode, autrePeriode);
    }

    @Override
    public int hashCode() {
        return 31 * Arrays.hashCode(pdf) + Objects.hashCode(periode);
    }

    @Override
    public String toString() {
        return "QuittanceTelechargee[periode=" + periode + ", pdfLength=" + pdf.length + "]";
    }
}
