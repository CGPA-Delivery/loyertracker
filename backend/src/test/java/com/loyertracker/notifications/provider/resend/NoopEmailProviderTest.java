package com.loyertracker.notifications.provider.resend;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import org.junit.jupiter.api.Test;

import com.loyertracker.notifications.CanalNotification;
import com.loyertracker.notifications.provider.NotificationProvider.DemandeEnvoi;
import com.loyertracker.notifications.provider.NotificationProvider.NotificationRecipient;
import com.loyertracker.notifications.provider.NotificationProvider.ResultatEnvoi;

class NoopEmailProviderTest {

    @Test
    void neFaitAucunAppelReseauEtAccepteToujours() {
        NoopEmailProvider provider = new NoopEmailProvider();
        DemandeEnvoi demande = new DemandeEnvoi(
                new NotificationRecipient(CanalNotification.EMAIL, "test@exemple.fr"),
                "CODE", Map.of(), "Sujet", "<p>Corps</p>", null);

        ResultatEnvoi resultat = provider.envoyer(demande);

        assertThat(resultat.accepte()).isTrue();
        assertThat(resultat.providerMessageId()).isNull();
        assertThat(provider.canaux()).containsExactly(CanalNotification.EMAIL);
    }
}
