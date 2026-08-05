package com.loyertracker.notifications.provider.resend;

import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Vérification de la signature webhook Resend (US-143, ADR-19 §Sécurité) — schéma Svix, le
 * mécanisme de livraison de webhooks documenté publiquement par Resend : en-têtes {@code svix-id}/
 * {@code svix-timestamp}/{@code svix-signature}, contenu signé {@code
 * "{svix-id}.{svix-timestamp}.{corps brut}"}, HMAC-SHA256 avec la partie base64 du secret
 * {@code RESEND_WEBHOOK_SECRET} (préfixe {@code whsec_} retiré avant décodage), comparaison en
 * temps constant. {@code svix-signature} peut porter plusieurs entrées {@code v1,<base64>}
 * séparées par un espace (rotation de secret) : une seule correspondance suffit.
 *
 * <p><strong>RSV-EP18-06</strong> — ce schéma est implémenté par recommandation par défaut fondée
 * sur la documentation publique Resend/Svix, jamais vérifié contre un webhook réel dans cette
 * mission (aucune activation, secret jamais lu). Vérification obligatoire avant tout Gate Staging.
 * Corps brut (jamais un DTO re-sérialisé) : {@code ResendCallbackController} transmet la chaîne
 * exacte reçue, condition nécessaire à l'exactitude du calcul HMAC.</p>
 */
@Component
public class ResendSignatureVerifier {

    private static final long FENETRE_FRAICHEUR_SECONDES = 5L * 60;
    private static final String PREFIXE_SECRET = "whsec_";

    private final String secretBrut;

    public ResendSignatureVerifier(@Value("${resend.webhook-secret:}") String secretBrut) {
        this.secretBrut = secretBrut;
    }

    /** {@code true} seulement si au moins une signature reçue correspond à celle calculée. */
    public boolean estValide(String svixId, String svixTimestamp, String svixSignature, String corpsBrut) {
        if (svixId == null || svixId.isBlank() || svixTimestamp == null || svixTimestamp.isBlank()
                || svixSignature == null || svixSignature.isBlank()
                || secretBrut == null || secretBrut.isBlank()) {
            return false;
        }
        if (!horodatageDansLaFenetre(svixTimestamp)) {
            return false;
        }
        byte[] cle = decoderSecret(secretBrut);
        if (cle.length == 0) {
            return false;
        }
        String donnees = svixId + "." + svixTimestamp + "." + corpsBrut;
        byte[] calcule = calculerHmac(cle, donnees);
        if (calcule == null) {
            return false;
        }
        String calculeB64 = Base64.getEncoder().encodeToString(calcule);
        for (String entree : svixSignature.trim().split("\\s+")) {
            String[] parties = entree.split(",", 2);
            if (parties.length != 2 || !"v1".equals(parties[0])) {
                continue;
            }
            if (MessageDigest.isEqual(calculeB64.getBytes(StandardCharsets.UTF_8),
                    parties[1].getBytes(StandardCharsets.UTF_8))) {
                return true;
            }
        }
        return false;
    }

    private boolean horodatageDansLaFenetre(String svixTimestamp) {
        try {
            long timestamp = Long.parseLong(svixTimestamp.trim());
            long ecart = Math.abs(Instant.now().getEpochSecond() - timestamp);
            return ecart <= FENETRE_FRAICHEUR_SECONDES;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private byte[] decoderSecret(String secret) {
        String sansPrefixe = secret.startsWith(PREFIXE_SECRET)
                ? secret.substring(PREFIXE_SECRET.length()) : secret;
        try {
            return Base64.getDecoder().decode(sansPrefixe);
        } catch (IllegalArgumentException e) {
            return new byte[0];
        }
    }

    private byte[] calculerHmac(byte[] cle, String donnees) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(cle, "HmacSHA256"));
            return mac.doFinal(donnees.getBytes(StandardCharsets.UTF_8));
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("Impossible de calculer la signature Resend.", e);
        }
    }
}
