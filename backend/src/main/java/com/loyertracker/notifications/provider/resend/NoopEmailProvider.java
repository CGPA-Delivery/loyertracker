package com.loyertracker.notifications.provider.resend;

import java.util.EnumSet;
import java.util.Set;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.loyertracker.notifications.CanalNotification;
import com.loyertracker.notifications.provider.ChannelNotificationProvider;

/**
 * Implémentation sandbox par défaut du canal EMAIL (ADR-19, EP-18) : n'effectue strictement aucun
 * appel réseau, toujours un succès simulé sans {@code providerMessageId} réel. Bean actif tant que
 * {@code app.notifications.email.enabled} n'est pas explicitement passé à {@code true} — garantit
 * un démarrage sûr sans configuration Resend, socle désactivé par défaut dans tous les
 * environnements tant qu'une activation explicite n'est pas décidée par le PO (même patron que
 * {@link com.loyertracker.notifications.provider.NoopNotificationProvider}/
 * {@link com.loyertracker.notifications.provider.TwilioNotificationProvider}, flag dédié, aucune
 * activation d'un canal n'affecte l'autre).
 */
@Component
@ConditionalOnProperty(prefix = "app.notifications", name = "email.enabled",
        havingValue = "false", matchIfMissing = true)
public class NoopEmailProvider implements ChannelNotificationProvider {

    @Override
    public Set<CanalNotification> canaux() {
        return EnumSet.of(CanalNotification.EMAIL);
    }

    @Override
    public ResultatEnvoi envoyer(DemandeEnvoi demande) {
        return ResultatEnvoi.accepte(null);
    }
}
