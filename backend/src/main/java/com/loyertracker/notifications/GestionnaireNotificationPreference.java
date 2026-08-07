package com.loyertracker.notifications;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Préférences globales d'un Gestionnaire multi-bailleur (US-125). La préférence appartient à
 * l'identité Gestionnaire, jamais à un tenant Bailleur arbitraire.
 */
@Entity
@Table(name = "gestionnaire_notification_preference")
public class GestionnaireNotificationPreference {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "gestionnaire_id", nullable = false, unique = true, updatable = false)
    private UUID gestionnaireId;

    @Column(name = "phone_e164")
    private String phoneE164;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_channel", nullable = false, length = 20)
    private CanalNotification preferredChannel;

    @Enumerated(EnumType.STRING)
    @Column(name = "fallback_channel", length = 20)
    private CanalNotification fallbackChannel;

    @Column(name = "whatsapp_opt_in", nullable = false)
    private boolean whatsappOptIn;

    @Column(name = "sms_opt_in", nullable = false)
    private boolean smsOptIn;

    @Column(name = "consent_at")
    private OffsetDateTime consentAt;

    @Column(name = "consent_source")
    private String consentSource;

    @Column(nullable = false, length = 5)
    private String language;

    @Column(nullable = false)
    private boolean enabled;

    @Column(name = "date_desactivation")
    private OffsetDateTime dateDesactivation;

    protected GestionnaireNotificationPreference() {
        // requis par JPA
    }

    public GestionnaireNotificationPreference(UUID gestionnaireId) {
        this.id = UUID.randomUUID();
        this.gestionnaireId = gestionnaireId;
        this.preferredChannel = CanalNotification.IN_APP;
        this.language = "fr";
        this.enabled = true;
    }

    public void definir(String phoneE164, CanalNotification preferredChannel,
            CanalNotification fallbackChannel, boolean whatsappOptIn, boolean smsOptIn,
            String consentSource, String language) {
        if (fallbackChannel != null && fallbackChannel != CanalNotification.SMS) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Seul SMS peut être un canal de secours (K5).");
        }
        this.phoneE164 = phoneE164;
        this.preferredChannel = preferredChannel;
        this.fallbackChannel = fallbackChannel;
        this.whatsappOptIn = whatsappOptIn;
        this.smsOptIn = smsOptIn;
        this.consentSource = consentSource;
        this.language = language != null ? language : "fr";
        this.consentAt = OffsetDateTime.now();
        this.enabled = true;
        this.dateDesactivation = null;
    }

    public void desinscrire() {
        this.enabled = false;
        this.dateDesactivation = OffsetDateTime.now();
    }

    public UUID getId() { return id; }
    public UUID getGestionnaireId() { return gestionnaireId; }
    public String getPhoneE164() { return phoneE164; }
    public CanalNotification getPreferredChannel() { return preferredChannel; }
    public CanalNotification getFallbackChannel() { return fallbackChannel; }
    public boolean isWhatsappOptIn() { return whatsappOptIn; }
    public boolean isSmsOptIn() { return smsOptIn; }
    public OffsetDateTime getConsentAt() { return consentAt; }
    public String getConsentSource() { return consentSource; }
    public String getLanguage() { return language; }
    public boolean isEnabled() { return enabled; }
    public OffsetDateTime getDateDesactivation() { return dateDesactivation; }
}
