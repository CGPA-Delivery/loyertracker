package com.loyertracker.notifications;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.loyertracker.notifications.provider.NotificationProvider;
import com.loyertracker.notifications.provider.NotificationProvider.DemandeEnvoi;
import com.loyertracker.notifications.provider.NotificationProvider.ResultatEnvoi;
import com.loyertracker.securite.TenantContext;

import jakarta.persistence.EntityManager;

/**
 * Consomme l'Outbox transactionnelle et invoque le {@link NotificationProvider} actif (US-122/123,
 * ADR-18). Le rôle applicatif {@code loyertracker_api} reste sous RLS {@code FORCE} : la
 * réclamation cross-tenant des bailleurs concernés passe par la fonction {@code SECURITY DEFINER
 * notification_bailleurs_en_attente()} (V28, lecture seule), puis chaque bailleur est traité dans
 * sa propre transaction avec le contexte tenant positionné ({@link TenantContext#positionner}) —
 * même patron que les tests de concurrence du Sprint N, jamais un contournement RLS générique pour
 * les données métier (préférences, payload).
 */
@Service
public class NotificationDispatcher {

    private static final Logger log = LoggerFactory.getLogger(NotificationDispatcher.class);

    private final EntityManager em;
    private final TenantContext tenant;
    private final PlatformTransactionManager txManager;
    private final NotificationOutboxService outboxService;
    private final NotificationOutboxRepository outboxRepository;
    private final NotificationPreferenceRepository preferences;
    private final NotificationTemplateRepository templates;
    private final NotificationDeliveryService deliveryService;
    private final NotificationProvider provider;
    private final ObjectMapper json;
    private final int maxTentatives;
    private final NotificationMetrics metrics;
    private final NotificationBudgetService budgetService;
    private final NotificationFallbackService fallbackService;
    private final boolean externeActive;

    public NotificationDispatcher(EntityManager em, TenantContext tenant,
            PlatformTransactionManager txManager, NotificationOutboxService outboxService,
            NotificationOutboxRepository outboxRepository,
            NotificationPreferenceRepository preferences, NotificationTemplateRepository templates,
            NotificationDeliveryService deliveryService, NotificationProvider provider,
            ObjectMapper json, NotificationMetrics metrics,
            NotificationBudgetService budgetService, NotificationFallbackService fallbackService,
            @Value("${app.notifications.external.enabled:false}") boolean externeActive,
            @Value("${app.notifications.dispatch.max-tentatives:5}") int maxTentatives) {
        this.em = em;
        this.tenant = tenant;
        this.txManager = txManager;
        this.outboxService = outboxService;
        this.outboxRepository = outboxRepository;
        this.preferences = preferences;
        this.templates = templates;
        this.deliveryService = deliveryService;
        this.provider = provider;
        this.json = json;
        this.metrics = metrics;
        this.budgetService = budgetService;
        this.fallbackService = fallbackService;
        this.externeActive = externeActive;
        this.maxTentatives = maxTentatives;
    }

    /** @return le nombre de lignes Outbox effectivement traitées (tout statut de sortie confondu) */
    public int traiterLot(int limiteParBailleur) {
        // Kill switch maître (US-126). Distinct de `whatsapp.enabled`, qui choisit *quel*
        // fournisseur est instancié : ce drapeau-ci coupe le dispatch lui-même, sans redémarrage ni
        // reconfiguration du provider, et laisse les lignes en PENDING (aucune perte, aucun échec
        // comptabilisé). C'est le levier d'exploitation à actionner en incident Twilio.
        if (!externeActive) {
            metrics.killSwitchFerme();
            log.warn("Dispatch de notifications suspendu : app.notifications.external.enabled=false.");
            return 0;
        }

        // Garde-fou budgétaire (US-126, RSV-EP16-03) : évalué avant tout appel réseau, une fois par
        // lot. Les lignes restent PENDING — le plafond arrête, il ne détruit pas.
        NotificationBudgetService.EtatBudget budget = budgetService.etatCourant();
        if (budget.estEpuise()) {
            metrics.budgetEpuise();
            log.warn("Dispatch de notifications suspendu : plafond mensuel atteint ({}/{}).",
                    budget.consomme(), budget.plafond());
            return 0;
        }

        TransactionTemplate tx = new TransactionTemplate(txManager);
        // Auto-invocation intentionnelle en dehors du proxy Spring (@Transactional inopérant sur un
        // appel interne) : chaque unité de travail passe explicitement par TransactionTemplate,
        // découverte des bailleurs incluse — jamais de requête JPA hors transaction.
        List<UUID> bailleurs = tx.execute(status -> bailleursEnAttente());
        int traites = 0;
        for (UUID bailleurId : bailleurs == null ? List.<UUID>of() : bailleurs) {
            Integer pourCeBailleur = tx.execute(status -> traiterBailleur(bailleurId, limiteParBailleur));
            traites += pourCeBailleur == null ? 0 : pourCeBailleur;
        }
        return traites;
    }

    private List<UUID> bailleursEnAttente() {
        List<?> ids = em.createNativeQuery("SELECT bailleur_id FROM notification_bailleurs_en_attente()")
                .getResultList();
        return ids.stream().map(id -> (UUID) id).toList();
    }

    private int traiterBailleur(UUID bailleurId, int limite) {
        tenant.positionner(bailleurId);
        List<UUID> ids = outboxService.reclamerLot(limite);
        for (UUID outboxId : ids) {
            outboxRepository.findById(outboxId).ifPresent(this::traiterUneLigne);
        }
        return ids.size();
    }

    private void traiterUneLigne(NotificationOutbox row) {
        Optional<NotificationPreference> preference = preferences
                .findFirstByBailleurIdAndRecipientId(row.getBailleurId(), row.getRecipientId());
        if (preference.isEmpty() || !preference.get().estEligiblePour(row.getChannel())
                || preference.get().getPhoneE164() == null) {
            outboxService.marquerDead(row.getId(), "PREFERENCE_INTROUVABLE_OU_INELIGIBLE");
            metrics.dispatch(row.getChannel(), NotificationMetrics.Issue.INELIGIBLE);
            return;
        }
        NotificationPreference pref = preference.get();

        Optional<NotificationTemplate> template = templates
                .findByCodeAndChannelAndLanguageOrderByVersionDesc(row.getNotificationType().name(),
                        row.getChannel(), pref.getLanguage())
                .stream()
                .filter(NotificationTemplate::utilisablePourEnvoi)
                .findFirst();
        if (template.isEmpty()) {
            outboxService.marquerDead(row.getId(), "TEMPLATE_NON_APPROUVE");
            metrics.dispatch(row.getChannel(), NotificationMetrics.Issue.TEMPLATE_ABSENT);
            return;
        }

        Map<String, String> variables = lireVariables(row.getEventId());
        DemandeEnvoi demande = new DemandeEnvoi(pref.getPhoneE164(), row.getChannel(),
                template.get().getCode(), variables);
        ResultatEnvoi resultat = provider.envoyer(demande);

        if (resultat.accepte()) {
            deliveryService.creer(row.getBailleurId(), row.getEventId(), row.getRecipientId(),
                    row.getChannel(), resultat.providerMessageId());
            outboxService.marquerTraite(row.getId());
            metrics.dispatch(row.getChannel(), NotificationMetrics.Issue.ACCEPTE);
        } else if (resultat.estEchecPermanent()) {
            // Échec définitif (US-124) : rejouer à l'identique ne peut pas aboutir. La ligne est
            // close immédiatement, sans consommer le quota de tentatives, puis le fallback SMS est
            // évalué — c'est le seul chemin qui peut en déclencher un.
            log.info("Envoi refusé définitivement ({}) pour l'outbox {} — aucune nouvelle tentative.",
                    resultat.errorCode(), row.getId());
            outboxService.marquerDead(row.getId(), resultat.errorCode());
            metrics.dispatch(row.getChannel(), NotificationMetrics.Issue.ECHEC_PERMANENT);
            fallbackService.evaluer(row);
        } else {
            log.info("Envoi refusé par le fournisseur ({}) pour l'outbox {} — tentative {}.",
                    resultat.errorCode(), row.getId(), row.getAttemptCount() + 1);
            outboxService.marquerEchecTransitoire(row.getId(), resultat.errorCode(), maxTentatives);
            metrics.dispatch(row.getChannel(), NotificationMetrics.Issue.ECHEC_TEMPORAIRE);
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, String> lireVariables(UUID eventId) {
        String payloadJson = (String) em
                .createNativeQuery("SELECT payload_minimal::text FROM notification_event WHERE id = :id")
                .setParameter("id", eventId)
                .getSingleResult();
        try {
            Map<String, Object> brut = json.readValue(
                    payloadJson.getBytes(StandardCharsets.UTF_8),
                    new TypeReference<Map<String, Object>>() { });
            return brut.entrySet().stream()
                    .collect(Collectors.toMap(Map.Entry::getKey, e -> String.valueOf(e.getValue())));
        } catch (IOException e) {
            throw new IllegalStateException("Payload de notification illisible.", e);
        }
    }
}
