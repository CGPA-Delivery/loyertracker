package com.loyertracker.notifications.provider;

import java.util.Map;

import com.loyertracker.notifications.CanalNotification;
import com.loyertracker.notifications.CategorieErreurNotification;

/**
 * Abstraction du transport externe (WhatsApp/SMS, US-121, ADR-18 §5). Le domaine métier
 * (paiements, garanties, alertes, quittances) ne connaît jamais le SDK Twilio, les credentials, les
 * numéros expéditeurs ni les Content SID — uniquement cette interface. Permet de remplacer Twilio,
 * ou d'ajouter un second fournisseur, sans réécrire les règles métier.
 */
public interface NotificationProvider {

    /** Tente l'envoi d'une notification externe et retourne le résultat immédiat du fournisseur. */
    ResultatEnvoi envoyer(DemandeEnvoi demande);

    /** Requête d'envoi minimale — jamais de texte codé en dur, toujours un template résolu en amont. */
    record DemandeEnvoi(String phoneE164, CanalNotification canal, String templateCode,
            Map<String, String> variables) {
    }

    /**
     * Résultat immédiat (avant callback asynchrone de statut, cf. Sprint N+1 US-123).
     *
     * <p>{@code categorieErreur} (US-124) classe un refus : {@link CategorieErreurNotification#TEMPORAIRE}
     * autorise une nouvelle tentative sur le même canal, {@link CategorieErreurNotification#PERMANENT}
     * la rend inutile et devient le seul déclencheur admissible d'un fallback SMS. Toujours
     * {@code null} quand l'envoi est accepté.</p>
     */
    record ResultatEnvoi(boolean accepte, String providerMessageId, String errorCode,
            CategorieErreurNotification categorieErreur) {

        /** Succès : identifiant fournisseur, aucune erreur. */
        public static ResultatEnvoi accepte(String providerMessageId) {
            return new ResultatEnvoi(true, providerMessageId, null, null);
        }

        /** Refus temporaire : nouvelle tentative possible sur le même canal, jamais de fallback. */
        public static ResultatEnvoi echecTemporaire(String errorCode) {
            return new ResultatEnvoi(false, null, errorCode, CategorieErreurNotification.TEMPORAIRE);
        }

        /** Refus définitif : aucune nouvelle tentative sur ce canal ; seul cas ouvrant le fallback. */
        public static ResultatEnvoi echecPermanent(String errorCode) {
            return new ResultatEnvoi(false, null, errorCode, CategorieErreurNotification.PERMANENT);
        }

        /** Vrai uniquement pour un refus explicitement classé {@code PERMANENT}. */
        public boolean estEchecPermanent() {
            return !accepte && categorieErreur == CategorieErreurNotification.PERMANENT;
        }
    }
}
