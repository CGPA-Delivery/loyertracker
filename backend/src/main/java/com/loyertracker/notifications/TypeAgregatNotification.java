package com.loyertracker.notifications;

/**
 * Type de l'agrégat métier à l'origine d'un {@link NotificationEvent} (ADR-18 §Modèle).
 * {@link #INVITATION} (ADR-19 §2, EP-18 Sprint B) : voie transactionnelle sans préférence.
 */
public enum TypeAgregatNotification {
    BAIL,
    GARANTIE,
    QUITTANCE,
    PAIEMENT,
    INVITATION
}
