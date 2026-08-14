package com.loyertracker.quittances;

/** Noms de téléchargement stables pour les quittances certifiées, sans donnée personnelle. */
public final class QuittanceFilenameFactory {

    private QuittanceFilenameFactory() {
    }

    public static String quittanceCertifiee(String periode) {
        return "quittance-certifiee-" + periode + ".pdf";
    }
}
