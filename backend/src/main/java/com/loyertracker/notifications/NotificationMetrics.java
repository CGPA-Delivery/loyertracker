package com.loyertracker.notifications;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Component;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;

/**
 * Instrumentation Micrometer de la chaîne de notification externe (US-126, EP-16 Sprint N+2).
 *
 * <p><strong>Aucune donnée personnelle en label.</strong> C'est une exigence explicite du critère
 * d'acceptation d'US-126 et une contrainte structurelle de Prometheus : chaque valeur de label crée
 * une série temporelle persistante, indexée et exportée. Un numéro de téléphone, un identifiant de
 * destinataire ou un identifiant de bailleur en label produirait une cardinalité non bornée
 * <em>et</em> une fuite de données personnelles dans un système de supervision non conçu pour en
 * héberger. Les seules dimensions autorisées ici sont donc des <em>énumérations fermées</em> :
 * canal ({@link CanalNotification}) et issue ({@link Issue}).</p>
 *
 * <p>Les identifiants restent disponibles pour l'investigation dans {@code notification_outbox} et
 * {@code notification_delivery}, sous RLS — la supervision indique <em>qu'</em>un problème existe et
 * de quelle nature ; la base indique <em>qui</em> est concerné.</p>
 */
@Component
public class NotificationMetrics {

    /** Issue d'une tentative de dispatch — énumération fermée, sûre comme label Prometheus. */
    public enum Issue {
        /** Remis au fournisseur, qui l'a accepté. */
        ACCEPTE,
        /** Refus temporaire : nouvelle tentative programmée sur le même canal. */
        ECHEC_TEMPORAIRE,
        /** Refus définitif : aucune nouvelle tentative sur ce canal. */
        ECHEC_PERMANENT,
        /** Préférence absente, désactivée ou sans opt-in pour le canal (K3). */
        INELIGIBLE,
        /** Aucun template approuvé pour ce couple code/canal/langue. */
        TEMPLATE_ABSENT,
        /** Aucun {@code ChannelNotificationProvider} enregistré pour ce canal (ADR-19, EP-18). */
        PROVIDER_INDISPONIBLE
    }

    /** Issue de l'évaluation d'un fallback SMS (US-124) — trace aussi les refus, jamais silencieux. */
    public enum IssueFallback {
        /** Fallback effectivement mis en file sur le canal SMS. */
        DECLENCHE,
        /** Politique de fallback désactivée (défaut, K5). */
        REFUSE_POLITIQUE,
        /** Destinataire sans opt-in SMS ou sans canal de secours défini (K3). */
        REFUSE_CONSENTEMENT,
        /** Un SMS de secours existait déjà pour cet événement : jamais un second. */
        DEJA_EN_FILE
    }

    private final MeterRegistry registry;
    private final AtomicLong budgetConsomme = new AtomicLong(0);
    private final AtomicLong budgetPlafond = new AtomicLong(0);

    public NotificationMetrics(MeterRegistry registry) {
        this.registry = registry;
        Gauge.builder("notification.budget.consomme", budgetConsomme, AtomicLong::get)
                .description("Envois externes remis au fournisseur depuis le début du mois courant, tous bailleurs confondus")
                .register(registry);
        Gauge.builder("notification.budget.plafond", budgetPlafond, AtomicLong::get)
                .description("Plafond mensuel d'envois externes configuré (0 = envois externes interdits)")
                .register(registry);
    }

    /** Une tentative de dispatch s'est conclue par {@code issue} sur {@code canal}. */
    public void dispatch(CanalNotification canal, Issue issue) {
        Counter.builder("notification.dispatch.total")
                .description("Tentatives de dispatch de notification externe, par canal et par issue")
                .tag("canal", canal.name())
                .tag("issue", issue.name())
                .register(registry)
                .increment();
    }

    /** L'évaluation d'un fallback SMS s'est conclue par {@code issue}. */
    public void fallback(IssueFallback issue) {
        Counter.builder("notification.fallback.total")
                .description("Évaluations de fallback SMS, par issue — les refus sont comptés au même titre que les déclenchements")
                .tag("issue", issue.name())
                .register(registry)
                .increment();
    }

    /** Un lot de dispatch a été refusé faute de budget mensuel disponible. */
    public void budgetEpuise() {
        Counter.builder("notification.budget.bloque.total")
                .description("Lots de dispatch interrompus par atteinte du plafond budgétaire mensuel")
                .register(registry)
                .increment();
    }

    /** Un lot de dispatch a été refusé parce que le kill switch externe est fermé. */
    public void killSwitchFerme() {
        Counter.builder("notification.killswitch.bloque.total")
                .description("Lots de dispatch interrompus par le kill switch app.notifications.external.enabled")
                .register(registry)
                .increment();
    }

    /** Publie l'état budgétaire courant sur les jauges (appelé à chaque lot). */
    public void majBudget(long consomme, long plafond) {
        budgetConsomme.set(consomme);
        budgetPlafond.set(plafond);
    }
}
