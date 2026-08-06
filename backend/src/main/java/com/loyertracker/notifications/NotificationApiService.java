package com.loyertracker.notifications;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.loyertracker.notifications.NotificationPreferenceService.DefinitionPreference;
import com.loyertracker.securite.TenantContext;

import jakarta.persistence.EntityManager;

@Service
public class NotificationApiService {

    public record PreferenceRequest(String phoneE164, CanalNotification preferredChannel,
            CanalNotification fallbackChannel, boolean whatsappOptIn, boolean smsOptIn,
            String consentSource, String language) {
    }

    public record PreferenceResponse(boolean enabled, String phoneE164,
            CanalNotification preferredChannel, CanalNotification fallbackChannel,
            boolean whatsappOptIn, boolean smsOptIn, OffsetDateTime consentAt,
            String consentSource, String language) {
        static PreferenceResponse defaut() {
            return new PreferenceResponse(false, null, CanalNotification.IN_APP, null, false, false,
                    null, null, "fr");
        }

        static PreferenceResponse from(NotificationPreference preference) {
            return new PreferenceResponse(preference.isEnabled(), preference.getPhoneE164(),
                    preference.getPreferredChannel(), preference.getFallbackChannel(),
                    preference.isWhatsappOptIn(), preference.isSmsOptIn(), preference.getConsentAt(),
                    preference.getConsentSource(), preference.getLanguage());
        }

        static PreferenceResponse from(GestionnaireNotificationPreference preference) {
            return new PreferenceResponse(preference.isEnabled(), preference.getPhoneE164(),
                    preference.getPreferredChannel(), preference.getFallbackChannel(),
                    preference.isWhatsappOptIn(), preference.isSmsOptIn(), preference.getConsentAt(),
                    preference.getConsentSource(), preference.getLanguage());
        }
    }

    public record HistoriqueItem(UUID id, OffsetDateTime dateCreation, String notificationType,
            CanalNotification channel, String recipientAddressMasked, String statut, String motif) {
    }

    private final NotificationPreferenceService bailleurPreferences;
    private final GestionnaireNotificationPreferenceRepository gestionnairePreferences;
    private final TenantContext tenant;
    private final EntityManager em;

    public NotificationApiService(NotificationPreferenceService bailleurPreferences,
            GestionnaireNotificationPreferenceRepository gestionnairePreferences, TenantContext tenant,
            EntityManager em) {
        this.bailleurPreferences = bailleurPreferences;
        this.gestionnairePreferences = gestionnairePreferences;
        this.tenant = tenant;
        this.em = em;
    }

    @Transactional(readOnly = true)
    public PreferenceResponse consulterPreference(Authentication authentication) {
        if (estGestionnaire(authentication)) {
            UUID gestionnaireId = activerGestionnaire(authentication);
            return gestionnairePreferences.findByGestionnaireId(gestionnaireId)
                    .map(PreferenceResponse::from)
                    .orElseGet(PreferenceResponse::defaut);
        }
        UUID bailleurId = tenant.activerDepuisKeycloak(sujet(authentication));
        return bailleurPreferences.trouver(bailleurId, TypeDestinataire.BAILLEUR, bailleurId)
                .map(PreferenceResponse::from)
                .orElseGet(PreferenceResponse::defaut);
    }

    @Transactional
    public PreferenceResponse enregistrerPreference(Authentication authentication, PreferenceRequest requete) {
        if (estGestionnaire(authentication)) {
            UUID gestionnaireId = activerGestionnaire(authentication);
            GestionnaireNotificationPreference preference = gestionnairePreferences
                    .findByGestionnaireId(gestionnaireId)
                    .orElseGet(() -> gestionnairePreferences
                            .save(new GestionnaireNotificationPreference(gestionnaireId)));
            preference.definir(requete.phoneE164(), requete.preferredChannel(),
                    requete.fallbackChannel(), requete.whatsappOptIn(), requete.smsOptIn(),
                    requete.consentSource(), requete.language());
            return PreferenceResponse.from(preference);
        }
        UUID bailleurId = tenant.activerDepuisKeycloak(sujet(authentication));
        NotificationPreference preference = bailleurPreferences.definir(bailleurId,
                TypeDestinataire.BAILLEUR, bailleurId,
                new DefinitionPreference(requete.phoneE164(), requete.preferredChannel(),
                        requete.fallbackChannel(), requete.whatsappOptIn(), requete.smsOptIn(),
                        requete.consentSource(), requete.language()));
        return PreferenceResponse.from(preference);
    }

    @Transactional
    public PreferenceResponse desinscrire(Authentication authentication) {
        if (estGestionnaire(authentication)) {
            UUID gestionnaireId = activerGestionnaire(authentication);
            GestionnaireNotificationPreference preference = gestionnairePreferences
                    .findByGestionnaireId(gestionnaireId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Préférence de notification introuvable."));
            preference.desinscrire();
            return PreferenceResponse.from(preference);
        }
        UUID bailleurId = tenant.activerDepuisKeycloak(sujet(authentication));
        bailleurPreferences.desinscrire(bailleurId, TypeDestinataire.BAILLEUR, bailleurId);
        return bailleurPreferences.trouver(bailleurId, TypeDestinataire.BAILLEUR, bailleurId)
                .map(PreferenceResponse::from)
                .orElseThrow();
    }

    @Transactional(readOnly = true)
    public List<HistoriqueItem> consulterHistorique(Authentication authentication) {
        if (estGestionnaire(authentication)) {
            UUID gestionnaireId = resoudreGestionnaire(sujet(authentication));
            if (gestionnaireId == null) {
                return List.of();
            }
            @SuppressWarnings("unchecked")
            List<Object[]> lignes = em.createNativeQuery("""
                    SELECT id, date_creation, event_type, channel, statut, motif
                      FROM notifications_gestionnaire(CAST(:g AS uuid))
                    """)
                    .setParameter("g", gestionnaireId.toString())
                    .getResultList();
            return lignes.stream()
                    .map(l -> new HistoriqueItem((UUID) l[0], dateCreation(l[1]), (String) l[2],
                            CanalNotification.valueOf((String) l[3]), adresseMasqueeGestionnaire(),
                            (String) l[4], (String) l[5]))
                    .toList();
        }
        UUID bailleurId = tenant.activerDepuisKeycloak(sujet(authentication));
        @SuppressWarnings("unchecked")
        List<Object[]> lignes = em.createNativeQuery("""
                SELECT d.id, d.date_creation, e.event_type, d.channel, d.statut, d.error_code,
                       COALESCE(p.email, p.phone_e164) AS recipient_address
                  FROM notification_delivery d
                  JOIN notification_event e ON e.id = d.event_id
                  LEFT JOIN notification_preference p
                    ON p.bailleur_id = d.bailleur_id AND p.recipient_id = d.recipient_id
                 WHERE d.bailleur_id = CAST(:b AS uuid)
                 ORDER BY d.date_creation DESC
                """)
                .setParameter("b", bailleurId.toString())
                .getResultList();
        return lignes.stream()
                .map(l -> new HistoriqueItem((UUID) l[0], dateCreation(l[1]), (String) l[2],
                        CanalNotification.valueOf((String) l[3]), masquer((String) l[6]),
                        (String) l[4], (String) l[5]))
                .toList();
    }

    private static OffsetDateTime dateCreation(Object valeur) {
        if (valeur instanceof OffsetDateTime offsetDateTime) {
            return offsetDateTime;
        }
        if (valeur instanceof java.time.Instant instant) {
            return instant.atOffset(ZoneOffset.UTC);
        }
        throw new IllegalArgumentException("Type de date de création non supporté: " + valeur);
    }

    private UUID activerGestionnaire(Authentication authentication) {
        UUID gestionnaireId = resoudreGestionnaire(sujet(authentication));
        if (gestionnaireId == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Aucun compte gestionnaire n'est rattaché à cette identité.");
        }
        em.createNativeQuery("SELECT set_config('app.current_gestionnaire_id', :id, true)")
                .setParameter("id", gestionnaireId.toString())
                .getSingleResult();
        return gestionnaireId;
    }

    private UUID resoudreGestionnaire(String keycloakId) {
        List<?> resultats = em.createNativeQuery("SELECT id FROM gestionnaire WHERE keycloak_id = :s")
                .setParameter("s", keycloakId)
                .getResultList();
        return resultats.isEmpty() ? null : (UUID) resultats.get(0);
    }

    private static String sujet(Authentication authentication) {
        return ((Jwt) authentication.getPrincipal()).getSubject();
    }

    private static boolean estGestionnaire(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_GESTIONNAIRE".equals(a.getAuthority()));
    }

    private static String masquer(String adresse) {
        if (adresse == null || adresse.isBlank()) {
            return "********";
        }
        int arobase = adresse.indexOf('@');
        if (arobase > 1) {
            return adresse.charAt(0) + "***" + adresse.substring(arobase);
        }
        if (adresse.length() <= 6) {
            return "******";
        }
        return adresse.substring(0, 4) + "******" + adresse.substring(adresse.length() - 2);
    }

    private static String adresseMasqueeGestionnaire() {
        return "********";
    }
}
