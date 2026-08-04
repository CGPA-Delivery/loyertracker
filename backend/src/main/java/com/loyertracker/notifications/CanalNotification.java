package com.loyertracker.notifications;

/**
 * Canal de notification (ADR-18 §6) : IN_APP obligatoire (K2), WHATSAPP principal, SMS secours.
 * EMAIL (ADR-19, EP-18) : second fournisseur externe (Resend), indépendant de WhatsApp/SMS.
 */
public enum CanalNotification {
    IN_APP,
    WHATSAPP,
    SMS,
    EMAIL
}
