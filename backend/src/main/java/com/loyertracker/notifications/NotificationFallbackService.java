package com.loyertracker.notifications;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Fallback SMS contrôlé (US-124, EP-16 Sprint N+2, ADR-18 §6).
 *
 * <p>Un échec WhatsApp <strong>définitif</strong> peut déclencher un SMS de secours, mais jamais par
 * défaut. Trois conditions cumulatives, toutes vérifiées ici, toutes traçées en métrique :</p>
 *
 * <ol>
 *   <li><strong>Politique activée</strong> — {@code app.notifications.fallback.enabled}, à
 *       {@code false} par défaut. L'arbitrage <strong>K5</strong> du 2026-07-19 a tranché « pas de
 *       fallback automatique au premier pilote » : le socle est donc livré fermé, et son ouverture
 *       est un acte d'exploitation délibéré, pas un effet de bord du déploiement.</li>
 *   <li><strong>Consentement explicite</strong> — le destinataire a un {@code sms_opt_in} actif
 *       <em>et</em> a désigné SMS comme canal de secours. La seule présence d'un numéro n'a jamais
 *       valeur de consentement (K3).</li>
 *   <li><strong>Aucun SMS déjà en file</strong> pour le même événement — garanti en dernier ressort
 *       par la contrainte d'unicité {@code uq_notification_outbox_idempotence} sur
 *       {@code (event_id, recipient_id, notification_type, channel)}, qui rend structurellement
 *       impossible un second SMS de secours : « un unique SMS est tenté ».</li>
 * </ol>
 *
 * <p>Un fallback ne se déclenche que depuis {@link CanalNotification#WHATSAPP} : une ligne SMS en
 * échec ne produit jamais de nouveau fallback, ce qui exclut toute boucle.</p>
 */
@Service
public class NotificationFallbackService {

    private static final Logger log = LoggerFactory.getLogger(NotificationFallbackService.class);

    private final NotificationOutboxRepository outbox;
    private final NotificationPreferenceRepository preferences;
    private final NotificationMetrics metrics;
    private final boolean politiqueActivee;

    public NotificationFallbackService(NotificationOutboxRepository outbox,
            NotificationPreferenceRepository preferences, NotificationMetrics metrics,
            @Value("${app.notifications.fallback.enabled:false}") boolean politiqueActivee) {
        this.outbox = outbox;
        this.preferences = preferences;
        this.metrics = metrics;
        this.politiqueActivee = politiqueActivee;
    }

    /**
     * Évalue et, le cas échéant, met en file l'unique SMS de secours d'une ligne WhatsApp en échec
     * permanent. Exécuté dans la transaction et le contexte tenant du dispatcher.
     *
     * @return {@code true} si un SMS de secours a effectivement été mis en file
     */
    @Transactional
    public boolean evaluer(NotificationOutbox echec) {
        if (echec.getChannel() != CanalNotification.WHATSAPP) {
            return false; // jamais de fallback d'un fallback : aucune boucle possible
        }
        if (!politiqueActivee) {
            metrics.fallback(NotificationMetrics.IssueFallback.REFUSE_POLITIQUE);
            return false;
        }

        Optional<NotificationPreference> preference = preferences
                .findFirstByBailleurIdAndRecipientId(echec.getBailleurId(), echec.getRecipientId());
        boolean consentement = preference
                .filter(pref -> pref.getFallbackChannel() == CanalNotification.SMS)
                .filter(pref -> pref.estEligiblePour(CanalNotification.SMS))
                .filter(pref -> pref.getPhoneE164() != null)
                .isPresent();
        if (!consentement) {
            metrics.fallback(NotificationMetrics.IssueFallback.REFUSE_CONSENTEMENT);
            return false;
        }

        boolean dejaEnFile = outbox.findByEventId(echec.getEventId()).stream()
                .anyMatch(ligne -> ligne.getChannel() == CanalNotification.SMS
                        && ligne.getRecipientId().equals(echec.getRecipientId())
                        && ligne.getNotificationType() == echec.getNotificationType());
        if (dejaEnFile) {
            metrics.fallback(NotificationMetrics.IssueFallback.DEJA_EN_FILE);
            return false;
        }

        outbox.save(new NotificationOutbox(echec.getBailleurId(), echec.getEventId(),
                echec.getRecipientId(), echec.getNotificationType(), CanalNotification.SMS));
        metrics.fallback(NotificationMetrics.IssueFallback.DECLENCHE);
        log.info("Fallback SMS mis en file pour l'événement {} (outbox WhatsApp {} en échec permanent).",
                echec.getEventId(), echec.getId());
        return true;
    }
}
