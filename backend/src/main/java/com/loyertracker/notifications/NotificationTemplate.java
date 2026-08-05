package com.loyertracker.notifications;

import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Référentiel administrable des templates de notification externe (US-122, ADR-18 §Templates),
 * partagé entre bailleurs, sans RLS (patron {@code TypeBien}, V12). {@code code} correspond au nom
 * du {@link TypeEvenementNotification} porté par l'événement d'origine (ex. {@code
 * QUITTANCE_DISPONIBLE}). La soumission réelle à l'approbation Twilio est hors périmètre de ce
 * projet — seul le mécanisme de statut est opérationnel : un template dont {@code approvalStatus}
 * n'est pas {@link StatutApprobationTemplate#APPROUVE} (ou {@code enabled=false}) ne peut jamais
 * être utilisé pour un envoi ({@link NotificationDispatcher}).
 */
@Entity
@Table(name = "notification_template")
public class NotificationTemplate {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, updatable = false, length = 50)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, updatable = false, length = 20)
    private CanalNotification channel;

    @Column(nullable = false, updatable = false, length = 5)
    private String language;

    @Column(nullable = false, updatable = false)
    private int version;

    @Column(name = "provider_template_id")
    private String providerTemplateId;

    /** ADR-19 §5 (EP-18) : contenu réel du gabarit, utilisé uniquement pour {@code channel = EMAIL}. */
    @Column
    private String subject;

    @Column(name = "html_body")
    private String htmlBody;

    @Column(name = "text_body")
    private String textBody;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false, length = 20)
    private StatutApprobationTemplate approvalStatus;

    @Column(nullable = false)
    private boolean enabled;

    @Column(name = "date_creation", nullable = false, updatable = false, insertable = false)
    private OffsetDateTime dateCreation;

    protected NotificationTemplate() {
        // requis par JPA
    }

    /**
     * Utilisable pour un envoi réel : actif et approuvé par le fournisseur. Pour EMAIL (ADR-19
     * §5), exige en plus un sujet et un corps HTML non vides — un template EMAIL sans contenu ne
     * peut jamais servir à un envoi, même {@code APPROUVE}.
     */
    public boolean utilisablePourEnvoi() {
        boolean base = enabled && approvalStatus == StatutApprobationTemplate.APPROUVE;
        if (channel != CanalNotification.EMAIL) {
            return base;
        }
        return base && subject != null && !subject.isBlank()
                && htmlBody != null && !htmlBody.isBlank();
    }

    public UUID getId() { return id; }
    public String getCode() { return code; }
    public CanalNotification getChannel() { return channel; }
    public String getLanguage() { return language; }
    public int getVersion() { return version; }
    public String getProviderTemplateId() { return providerTemplateId; }
    public String getSubject() { return subject; }
    public String getHtmlBody() { return htmlBody; }
    public String getTextBody() { return textBody; }
    public StatutApprobationTemplate getApprovalStatus() { return approvalStatus; }
    public boolean isEnabled() { return enabled; }
    public OffsetDateTime getDateCreation() { return dateCreation; }
}
