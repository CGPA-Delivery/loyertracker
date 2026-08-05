package com.loyertracker.comptes;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.loyertracker.notifications.NotificationOutboxService;
import com.loyertracker.notifications.TypeAgregatNotification;
import com.loyertracker.notifications.TypeEvenementNotification;
import com.loyertracker.securite.TenantContext;

/**
 * Génération d'invitations de délégation (US-11, EF-02/03).
 *
 * <p>Un bailleur authentifié invite un gestionnaire par e-mail. Le service produit une capacité
 * tokenisée (UUID v4) à usage unique, valable {@value #VALIDITE_HEURES} h, et renvoie le lien
 * d'acceptation. L'écriture est scopée au tenant via le contexte RLS (ADR-01/ADR-09) : le bailleur
 * émetteur est résolu depuis le JWT, jamais depuis la requête.</p>
 *
 * <p>Voie transactionnelle EMAIL (ADR-19 §2/§6, EP-18 Sprint B, US-139) : dans la même transaction
 * que la persistance de l'invitation, un événement {@code INVITATION_CREEE} et une ligne Outbox
 * {@code EMAIL} sont émis via {@link NotificationOutboxService#emettreTransactionnel} — sans
 * consultation de {@code NotificationPreference} (l'invité n'a pas encore de compte). Une panne
 * Resend ultérieure ne modifie jamais l'état de l'invitation déjà persistée : l'écriture Outbox est
 * la seule chose garantie ici, l'envoi réel reste un traitement asynchrone du
 * {@code NotificationDispatcher}.</p>
 */
@Service
public class InvitationService {

    static final long VALIDITE_HEURES = 72;

    private final InvitationRepository invitations;
    private final TenantContext tenant;
    private final NotificationOutboxService notifications;
    private final String baseUrl;

    public InvitationService(InvitationRepository invitations, TenantContext tenant,
            NotificationOutboxService notifications,
            @Value("${app.invitation.base-url:https://localhost}") String baseUrl) {
        this.invitations = invitations;
        this.tenant = tenant;
        this.notifications = notifications;
        this.baseUrl = baseUrl;
    }

    @Transactional
    public InvitationDto inviter(Jwt jwt, String email) {
        UUID bailleurId = tenant.activerDepuisKeycloak(jwt.getSubject());

        OffsetDateTime expiration = OffsetDateTime.now(ZoneOffset.UTC)
                .plus(Duration.ofHours(VALIDITE_HEURES));
        Invitation invitation = new Invitation(
                UUID.randomUUID(), bailleurId, email, UUID.randomUUID().toString(), expiration);

        Invitation enregistree = invitations.saveAndFlush(invitation);
        String lien = lienAcceptation(enregistree.getToken());

        // Payload minimal (RGPD, ADR-19 §RGPD « rien d'autre ») : uniquement ce que le gabarit
        // INVITATION_CREEE (V31) substitue — ni l'e-mail (déjà porté par recipient_address), ni le
        // token brut (l'ADR rejette la reconstruction d'URL par un composant générique), ni aucun
        // identifiant interne.
        notifications.emettreTransactionnel(bailleurId, TypeEvenementNotification.INVITATION_CREEE,
                TypeAgregatNotification.INVITATION, enregistree.getId(),
                Map.of("lien", lien, "dureeValiditeHeures", String.valueOf(VALIDITE_HEURES)),
                enregistree.getId(), email);

        return InvitationDto.from(enregistree, lien);
    }

    private String lienAcceptation(String token) {
        return baseUrl + "/invitations/" + token;
    }
}
