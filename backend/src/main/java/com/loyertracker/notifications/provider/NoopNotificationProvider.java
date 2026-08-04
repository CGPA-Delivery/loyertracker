package com.loyertracker.notifications.provider;

import java.util.EnumSet;
import java.util.Set;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.loyertracker.notifications.CanalNotification;

/**
 * Implémentation sandbox par défaut (US-121) : n'effectue strictement aucun appel réseau, toujours
 * un succès simulé sans {@code providerMessageId} réel. Bean actif tant que {@code
 * app.notifications.whatsapp.enabled} (K8) n'est pas explicitement passé à {@code true} — garantit
 * un démarrage sûr sans configuration Twilio, socle désactivé par défaut dans tous les
 * environnements tant qu'une activation explicite n'est pas décidée par le PO (même flag que
 * {@link TwilioNotificationProvider}, en exclusion mutuelle : un seul fournisseur candidat par
 * canal à tout instant, cf. {@link ChannelNotificationProvider}).
 */
@Component
@ConditionalOnProperty(prefix = "app.notifications", name = "whatsapp.enabled",
        havingValue = "false", matchIfMissing = true)
public class NoopNotificationProvider implements ChannelNotificationProvider {

    @Override
    public Set<CanalNotification> canaux() {
        return EnumSet.of(CanalNotification.WHATSAPP, CanalNotification.SMS);
    }

    @Override
    public ResultatEnvoi envoyer(DemandeEnvoi demande) {
        return ResultatEnvoi.accepte(null);
    }
}
