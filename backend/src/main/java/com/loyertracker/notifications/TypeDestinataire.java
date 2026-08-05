package com.loyertracker.notifications;

/**
 * Nature polymorphe d'un destinataire de notification (ADR-18, patron Alerte/AuditLog).
 *
 * <p>{@link #INVITATION} (ADR-19 §2, EP-18 Sprint B) : catégorie de la voie transactionnelle sans
 * préférence — porte l'{@code id} d'une {@code Invitation} (sans FK stricte, même patron
 * polymorphe que {@link #BAILLEUR}/{@link #GESTIONNAIRE}/{@link #LOCATAIRE}). Documentaire
 * uniquement : {@code notification_outbox} n'a pas de colonne dédiée à ce type, seul
 * {@code recipient_id} le porte.</p>
 */
public enum TypeDestinataire {
    BAILLEUR,
    GESTIONNAIRE,
    LOCATAIRE,
    INVITATION
}
