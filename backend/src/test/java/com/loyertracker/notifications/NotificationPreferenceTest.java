package com.loyertracker.notifications;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * Verrouille le consentement explicite des notifications externes (US-119, ADR-18 §Consentement) :
 * un numéro seul ne vaut jamais opt-in, l'éligibilité est propre à chaque canal et SMS reste le
 * seul canal de secours autorisé.
 */
class NotificationPreferenceTest {

    @Test
    void initialiseUnePreferenceInterneActiveSansConsentementExterne() {
        UUID bailleurId = UUID.randomUUID();
        UUID recipientId = UUID.randomUUID();

        NotificationPreference preference = new NotificationPreference(bailleurId,
                TypeDestinataire.LOCATAIRE, recipientId);

        assertThat(preference.getId()).isNotNull();
        assertThat(preference.getBailleurId()).isEqualTo(bailleurId);
        assertThat(preference.getRecipientType()).isEqualTo(TypeDestinataire.LOCATAIRE);
        assertThat(preference.getRecipientId()).isEqualTo(recipientId);
        assertThat(preference.getPreferredChannel()).isEqualTo(CanalNotification.IN_APP);
        assertThat(preference.getFallbackChannel()).isNull();
        assertThat(preference.getPhoneE164()).isNull();
        assertThat(preference.isWhatsappOptIn()).isFalse();
        assertThat(preference.isSmsOptIn()).isFalse();
        assertThat(preference.getConsentAt()).isNull();
        assertThat(preference.getConsentSource()).isNull();
        assertThat(preference.getLanguage()).isEqualTo("fr");
        assertThat(preference.isEnabled()).isTrue();
        assertThat(preference.getDateCreation()).isNull();
        assertThat(preference.getDateDesactivation()).isNull();
        assertThat(preference.estEligiblePour(CanalNotification.IN_APP)).isFalse();
        assertThat(preference.estEligiblePour(CanalNotification.WHATSAPP)).isFalse();
        assertThat(preference.estEligiblePour(CanalNotification.SMS)).isFalse();
    }

    @Test
    void definitLesOptInParCanalEtUtiliseLeFrancaisParDefaut() {
        NotificationPreference preference = nouvellePreference();

        preference.definir("+243810000000", CanalNotification.WHATSAPP, CanalNotification.SMS,
                true, false, "FORMULAIRE_PROFIL", null);

        assertThat(preference.getPhoneE164()).isEqualTo("+243810000000");
        assertThat(preference.getPreferredChannel()).isEqualTo(CanalNotification.WHATSAPP);
        assertThat(preference.getFallbackChannel()).isEqualTo(CanalNotification.SMS);
        assertThat(preference.isWhatsappOptIn()).isTrue();
        assertThat(preference.isSmsOptIn()).isFalse();
        assertThat(preference.getConsentSource()).isEqualTo("FORMULAIRE_PROFIL");
        assertThat(preference.getLanguage()).isEqualTo("fr");
        assertThat(preference.getConsentAt()).isNotNull();
        assertThat(preference.estEligiblePour(CanalNotification.WHATSAPP)).isTrue();
        assertThat(preference.estEligiblePour(CanalNotification.SMS)).isFalse();
    }

    @Test
    void conserveLaLangueExpliciteEtRendSmsEligibleSelonSonPropreOptIn() {
        NotificationPreference preference = nouvellePreference();

        preference.definir("+33600000000", CanalNotification.SMS, null, false, true,
                "FORMULAIRE_PROFIL", "en");

        assertThat(preference.getLanguage()).isEqualTo("en");
        assertThat(preference.estEligiblePour(CanalNotification.WHATSAPP)).isFalse();
        assertThat(preference.estEligiblePour(CanalNotification.SMS)).isTrue();
    }

    @Test
    void refuseUnCanalDeSecoursAutreQueSmsSansModifierLaPreference() {
        NotificationPreference preference = nouvellePreference();

        assertThatThrownBy(() -> preference.definir("+243810000000",
                CanalNotification.WHATSAPP, CanalNotification.WHATSAPP, true, false,
                "FORMULAIRE_PROFIL", "fr"))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        erreur -> assertThat(erreur.getStatusCode())
                                .isEqualTo(HttpStatus.BAD_REQUEST));

        assertThat(preference.getPhoneE164()).isNull();
        assertThat(preference.getPreferredChannel()).isEqualTo(CanalNotification.IN_APP);
        assertThat(preference.getConsentAt()).isNull();
    }

    @Test
    void desinscriptionEstImmediateEtUneSecondeTentativeEstEnConflit() {
        NotificationPreference preference = nouvellePreference();
        preference.definir("+243810000000", CanalNotification.WHATSAPP, CanalNotification.SMS,
                true, true, "FORMULAIRE_PROFIL", "fr");

        preference.desinscrire();

        assertThat(preference.isEnabled()).isFalse();
        assertThat(preference.getDateDesactivation()).isNotNull();
        assertThat(preference.estEligiblePour(CanalNotification.WHATSAPP)).isFalse();
        assertThatThrownBy(preference::desinscrire)
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        erreur -> assertThat(erreur.getStatusCode())
                                .isEqualTo(HttpStatus.CONFLICT));
    }

    @Test
    void reactiverRetablitEligibiliteEtRefuseUneSecondeReactivation() {
        NotificationPreference preference = nouvellePreference();
        preference.definir("+243810000000", CanalNotification.WHATSAPP, CanalNotification.SMS,
                true, false, "FORMULAIRE_PROFIL", "fr");
        preference.desinscrire();

        preference.reactiver();

        assertThat(preference.isEnabled()).isTrue();
        assertThat(preference.getDateDesactivation()).isNull();
        assertThat(preference.estEligiblePour(CanalNotification.WHATSAPP)).isTrue();
        assertThatThrownBy(preference::reactiver)
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        erreur -> assertThat(erreur.getStatusCode())
                                .isEqualTo(HttpStatus.CONFLICT));
    }

    @Test
    void estEligiblePourEmailRetourneFalseCarEmailOptInNonActive() {
        NotificationPreference preference = nouvellePreference();
        assertThat(preference.estEligiblePour(CanalNotification.EMAIL)).isFalse();
    }

    @Test
    void isEmailOptInRefleteLaValeurParDefaut() {
        NotificationPreference preference = nouvellePreference();
        assertThat(preference.isEmailOptIn()).isFalse();
    }

    private static NotificationPreference nouvellePreference() {
        return new NotificationPreference(UUID.randomUUID(), TypeDestinataire.LOCATAIRE,
                UUID.randomUUID());
    }
}
