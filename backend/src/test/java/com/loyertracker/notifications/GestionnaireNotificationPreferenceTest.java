package com.loyertracker.notifications;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.UUID;

import org.junit.jupiter.api.Test;

class GestionnaireNotificationPreferenceTest {

    @Test
    void preferenceGlobaleDuGestionnaireEstDesactiveeParDesinscription() {
        GestionnaireNotificationPreference preference = new GestionnaireNotificationPreference(
                UUID.randomUUID());

        preference.desinscrire();

        assertThat(preference.isEnabled()).isFalse();
        assertThat(preference.getDateDesactivation()).isNotNull();
    }
}
