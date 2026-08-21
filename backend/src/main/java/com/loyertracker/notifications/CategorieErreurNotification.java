package com.loyertracker.notifications;

/** Classification d'une erreur de livraison (US-123) — pilote la politique de retry de l'Outbox. */
public enum CategorieErreurNotification {
    /** Réseau, timeout, indisponibilité momentanée du fournisseur : nouvelle tentative possible. */
    TEMPORAIRE,
    /** Numéro invalide, opt-out, template rejeté : nouvelle tentative inutile. */
    PERMANENT,
    /** Bounce mou (boîte pleine, réponse temporaire) : retry possible après délai. */
    SOFT_BOUNCE,
    /** Bounce dur (adresse inexistante, domaine invalide) : nouvelle tentative inutile. */
    HARD_BOUNCE,
    /** Plainte spam (destinataire a marqué le message comme indésirable). */
    COMPLAINT
}
