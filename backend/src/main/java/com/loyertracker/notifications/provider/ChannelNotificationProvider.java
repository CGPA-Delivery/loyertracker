package com.loyertracker.notifications.provider;

import java.util.Set;

import com.loyertracker.notifications.CanalNotification;

/**
 * Fournisseur de notification résolu par canal (ADR-19 §3, EP-18). Le {@code NotificationDispatcher}
 * construit une {@code Map<CanalNotification, ChannelNotificationProvider>} à partir de tous les
 * beans candidats : un même fournisseur peut couvrir plusieurs canaux (ex. Twilio : WhatsApp+SMS),
 * jamais l'inverse — un canal a exactement un fournisseur actif à tout instant (exclusion mutuelle
 * Spring par flag dédié, patron déjà en place pour Twilio/Noop).
 */
public interface ChannelNotificationProvider extends NotificationProvider {

    /** Canaux couverts par ce fournisseur. Jamais vide. */
    Set<CanalNotification> canaux();
}
