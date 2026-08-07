package com.loyertracker.notifications;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

class GestionnaireNotificationPreferenceTest {

    @Test
    void constructeurInitialiseLesValeursParDefaut() {
        UUID gestionnaireId = UUID.randomUUID();
        GestionnaireNotificationPreference preference = new GestionnaireNotificationPreference(
                gestionnaireId);

        assertThat(preference.getId()).isNotNull();
        assertThat(preference.getGestionnaireId()).isEqualTo(gestionnaireId);
        assertThat(preference.getPreferredChannel()).isEqualTo(CanalNotification.IN_APP);
        assertThat(preference.getLanguage()).isEqualTo("fr");
        assertThat(preference.isEnabled()).isTrue();
        assertThat(preference.getPhoneE164()).isNull();
        assertThat(preference.getFallbackChannel()).isNull();
        assertThat(preference.isWhatsappOptIn()).isFalse();
        assertThat(preference.isSmsOptIn()).isFalse();
        assertThat(preference.getConsentAt()).isNull();
        assertThat(preference.getConsentSource()).isNull();
        assertThat(preference.getDateDesactivation()).isNull();
    }

    @Test
    void definirCouvreTousLesChampsEtGetters() {
        GestionnaireNotificationPreference preference = new GestionnaireNotificationPreference(
                UUID.randomUUID());

        preference.definir("+337****1111", CanalNotification.SMS, CanalNotification.SMS,
                true, true, "FORMULAIRE_LOYERTRACKER", "en");

        assertThat(preference.getPhoneE164()).isEqualTo("+337****1111");
        assertThat(preference.getPreferredChannel()).isEqualTo(CanalNotification.SMS);
        assertThat(preference.getFallbackChannel()).isEqualTo(CanalNotification.SMS);
        assertThat(preference.isWhatsappOptIn()).isTrue();
        assertThat(preference.isSmsOptIn()).isTrue();
        assertThat(preference.getConsentSource()).isEqualTo("FORMULAIRE_LOYERTRACKER");
        assertThat(preference.getLanguage()).isEqualTo("en");
        assertThat(preference.getConsentAt()).isNotNull();
        assertThat(preference.isEnabled()).isTrue();
        assertThat(preference.getDateDesactivation()).isNull();
    }

    @Test
    void definirAvecLangueNullUtiliseFrancaisParDefaut() {
        GestionnaireNotificationPreference preference = new GestionnaireNotificationPreference(
                UUID.randomUUID());

        preference.definir("+337****2222", CanalNotification.WHATSAPP, null,
                false, false, "FORMULAIRE_PROFIL", null);

        assertThat(preference.getLanguage()).isEqualTo("fr");
    }

    @Test
    void definirAvecFallbackInvalideLanceBadRequest() {
        GestionnaireNotificationPreference preference = new GestionnaireNotificationPreference(
                UUID.randomUUID());

        assertThatThrownBy(() -> preference.definir("+337****3333",
                CanalNotification.WHATSAPP, CanalNotification.WHATSAPP, true, false,
                "FORMULAIRE_PROFIL", "fr"))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        erreur -> assertThat(erreur.getStatusCode())
                                .isEqualTo(HttpStatus.BAD_REQUEST));

        assertThat(preference.getPhoneE164()).isNull();
        assertThat(preference.getPreferredChannel()).isEqualTo(CanalNotification.IN_APP);
    }

    @Test
    void preferenceGlobaleDuGestionnaireEstDesactiveeParDesinscription() {
        GestionnaireNotificationPreference preference = new GestionnaireNotificationPreference(
                UUID.randomUUID());

        preference.desinscrire();

        assertThat(preference.isEnabled()).isFalse();
        assertThat(preference.getDateDesactivation()).isNotNull();
    }
}
