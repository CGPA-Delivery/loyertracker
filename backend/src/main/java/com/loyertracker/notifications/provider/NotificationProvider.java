package com.loyertracker.notifications.provider;

import java.util.Map;

import com.loyertracker.notifications.CanalNotification;
import com.loyertracker.notifications.CategorieErreurNotification;

/**
 * Abstraction du transport externe (WhatsApp/SMS/EMAIL, US-121, ADR-18 §5 ; généralisée par canal
 * en ADR-19 §3, EP-18). Le domaine métier (paiements, garanties, alertes, quittances, invitations)
 * ne connaît jamais le SDK/l'API d'un fournisseur, les credentials, les numéros expéditeurs, les
 * Content SID Twilio ni les DTO Resend — uniquement cette interface. Permet de remplacer un
 * fournisseur, ou d'en ajouter un second pour un autre canal, sans réécrire les règles métier.
 */
public interface NotificationProvider {

    /** Tente l'envoi d'une notification externe et retourne le résultat immédiat du fournisseur. */
    ResultatEnvoi envoyer(DemandeEnvoi demande);

    /**
     * Destinataire générique d'un envoi externe (ADR-19 §3, EP-18) : une adresse portée par un
     * canal — numéro E.164 pour WHATSAPP/SMS, adresse e-mail validée pour EMAIL.
     */
    record NotificationRecipient(CanalNotification canal, String address) {
    }

    /**
     * Requête d'envoi minimale — jamais de texte codé en dur, toujours un template résolu en amont.
     * {@code subject}/{@code htmlBody}/{@code textBody} portent le contenu réel du gabarit
     * uniquement pour EMAIL (ADR-19 §5) — {@code null} pour WHATSAPP/SMS, qui continuent le rendu
     * {@code templateCode}+{@code variables} existant ({@link TwilioNotificationProvider#rendre}).
     */
    record DemandeEnvoi(NotificationRecipient destinataire, String templateCode,
            Map<String, String> variables, String subject, String htmlBody, String textBody) {

        /** Canal de cet envoi (raccourci vers {@code destinataire.canal()}). */
        public CanalNotification canal() {
            return destinataire.canal();
        }

        /** Demande sans contenu résolu (WhatsApp/SMS — rendu par code+variables, ADR-18). */
        public static DemandeEnvoi sansContenuResolu(NotificationRecipient destinataire,
                String templateCode, Map<String, String> variables) {
            return new DemandeEnvoi(destinataire, templateCode, variables, null, null, null);
        }
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
