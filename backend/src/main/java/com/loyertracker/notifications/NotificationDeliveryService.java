package com.loyertracker.notifications;

import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;

/**
 * Crée et met à jour les {@link NotificationDelivery} (US-123, ADR-18 §Ledger ; US-143, ADR-19
 * §Sécurité). La création ({@link #creer}) se fait en JPA, dans le même contexte tenant que
 * {@link NotificationDispatcher} (bailleur déjà positionné, RLS pleinement appliquée). La mise à
 * jour par callback ({@link #appliquerCallback} pour Twilio, {@link #appliquerCallbackResend} pour
 * Resend) délègue entièrement à la fonction {@code SECURITY DEFINER
 * notification_delivery_appliquer_statut} (V28, générique — réutilisée telle quelle pour les deux
 * fournisseurs, aucune migration Sprint C) : ces callbacks sont des endpoints publics non
 * authentifiés, sans contexte tenant — même patron que {@code lire_quittance_publique} (V22).
 */
@Service
public class NotificationDeliveryService {

    /** Correspondance statut Twilio (Message Status Callback) → statut interne. */
    private static final Map<String, StatutDelivery> STATUTS_TWILIO = Map.of(
            "queued", StatutDelivery.QUEUED,
            "accepted", StatutDelivery.ACCEPTED,
            "sent", StatutDelivery.SENT,
            "delivered", StatutDelivery.DELIVERED,
            "read", StatutDelivery.READ,
            "failed", StatutDelivery.FAILED,
            "undelivered", StatutDelivery.UNDELIVERED);

    /**
     * Correspondance type d'événement webhook Resend → statut interne (US-143, ADR-19 §Sécurité).
     * {@code email.bounced}/{@code email.complained} sont classés {@code UNDELIVERED}/{@code
     * FAILED} sans distinguer bounce dur/mou (simplification assumée, RSV-EP18-06). Tout type non
     * listé ici (ex. {@code email.delivery_delayed}, {@code email.clicked}) est ignoré avant même
     * d'atteindre la fonction SQL — même patron que {@code MessageStatus} inconnu côté Twilio.
     */
    private static final Map<String, StatutDelivery> STATUTS_RESEND = Map.of(
            "email.sent", StatutDelivery.SENT,
            "email.delivered", StatutDelivery.DELIVERED,
            "email.opened", StatutDelivery.READ,
            "email.bounced", StatutDelivery.UNDELIVERED,
            "email.complained", StatutDelivery.FAILED);

    private final NotificationDeliveryRepository deliveries;
    private final EntityManager em;

    public NotificationDeliveryService(NotificationDeliveryRepository deliveries, EntityManager em) {
        this.deliveries = deliveries;
        this.em = em;
    }

    /** Créée après acceptation immédiate par le fournisseur (jamais pour un envoi refusé). */
    @Transactional
    public NotificationDelivery creer(UUID bailleurId, UUID eventId, UUID recipientId,
            CanalNotification channel, String providerMessageId) {
        return deliveries.save(new NotificationDelivery(bailleurId, eventId, recipientId, channel,
                providerMessageId));
    }

    /**
     * Applique un callback de statut Twilio. Un {@code MessageStatus} inconnu (ex. {@code
     * "sending"}, état transitoire non retenu par ce modèle) est ignoré avant même d'atteindre la
     * fonction SQL — ni ce cas ni un SID introuvable ni un callback dupliqué ne sont distingués
     * côté appelant (réponse toujours indifférenciée, {@code TwilioCallbackController}).
     *
     * @return {@code true} si une transition a effectivement été appliquée
     */
    @Transactional
    public boolean appliquerCallback(String providerMessageId, String messageStatus, String errorCode) {
        StatutDelivery nouveauStatut = STATUTS_TWILIO.get(messageStatus == null ? "" : messageStatus.toLowerCase());
        if (nouveauStatut == null) {
            return false;
        }
        String errorCategory = errorCode == null ? null : CategorieErreurNotification.PERMANENT.name();
        return appliquerStatut(providerMessageId, nouveauStatut, errorCode, errorCategory);
    }

    /**
     * Applique un callback de statut webhook Resend (US-143, ADR-19 §Sécurité). Un {@code type}
     * inconnu ou non retenu par ce modèle (ex. {@code "email.clicked"}) est ignoré avant même
     * d'atteindre la fonction SQL — ni ce cas, ni un {@code email_id} introuvable, ni un callback
     * dupliqué ne sont distingués côté appelant (réponse toujours indifférenciée,
     * {@code ResendCallbackController}). {@code errorCode} est dérivé du {@code type} lui-même
     * (jamais transmis par l'appelant) : le payload Resend n'a pas d'équivalent direct au
     * {@code ErrorCode} Twilio pour {@code bounced}/{@code complained}.
     *
     * @return {@code true} si une transition a effectivement été appliquée
     */
    @Transactional
    public boolean appliquerCallbackResend(String providerMessageId, String eventType) {
        StatutDelivery nouveauStatut = STATUTS_RESEND.get(eventType == null ? "" : eventType.toLowerCase());
        if (nouveauStatut == null) {
            return false;
        }
        String errorCode = switch (nouveauStatut) {
            case UNDELIVERED -> "RESEND_BOUNCED";
            case FAILED -> "RESEND_COMPLAINED";
            default -> null;
        };
        String errorCategory = errorCode == null ? null : CategorieErreurNotification.PERMANENT.name();
        return appliquerStatut(providerMessageId, nouveauStatut, errorCode, errorCategory);
    }

    /**
     * Délégation commune, réutilisée par {@link #appliquerCallback} (Twilio) et
     * {@link #appliquerCallbackResend} (Resend) — extrait sans changement de comportement
     * observable (US-143) : la fonction SQL elle-même ne connaît ni Twilio ni Resend, uniquement
     * des chaînes {@code statut}/{@code provider_message_id} (V28, générique, aucune migration
     * requise pour Sprint C).
     */
    private boolean appliquerStatut(String providerMessageId, StatutDelivery nouveauStatut,
            String errorCode, String errorCategory) {
        return (Boolean) em.createNativeQuery(
                        "SELECT notification_delivery_appliquer_statut(:sid, :statut, :err, :cat)")
                .setParameter("sid", providerMessageId)
                .setParameter("statut", nouveauStatut.name())
                .setParameter("err", errorCode)
                .setParameter("cat", errorCategory)
                .getSingleResult();
    }
}
