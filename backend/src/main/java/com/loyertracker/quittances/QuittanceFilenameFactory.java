package com.loyertracker.quittances;

/** Noms de téléchargement stables pour les quittances certifiées, sans donnée personnelle. */
public final class QuittanceFilenameFactory {

    private QuittanceFilenameFactory() {
    }

    public static String quittanceCertifiee(String periode) {
        if (periode == null || !periode.matches("\\d{4}-(0[1-9]|1[0-2])")) {
            throw new IllegalArgumentException("La période doit respecter YYYY-MM.");
        }
        return "quittance-certifiee-" + periode + ".pdf";
    }
}
