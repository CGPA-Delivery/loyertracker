package com.loyertracker.notifications;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;

/**
 * Garde-fou budgétaire des envois externes (US-126, EP-16 Sprint N+2, RSV-EP16-03).
 *
 * <p>Twilio est facturé à l'envoi : une boucle de retry mal bornée, un fan-out inattendu ou un
 * incident de données peuvent produire une facture sans rapport avec l'usage réel. Le plafond est
 * une donnée d'exploitation <strong>globale</strong> (un seul compte facturé pour tous les
 * bailleurs), lue via {@code notification_envois_du_mois()} (V29, SECURITY DEFINER, retour
 * strictement agrégé).</p>
 *
 * <p>Le plafond agit en <em>arrêt</em>, jamais en dégradation silencieuse : lorsqu'il est atteint,
 * le lot de dispatch s'interrompt et les lignes d'Outbox restent {@code PENDING}. Aucune n'est
 * perdue ni marquée en échec — elles repartiront au mois suivant, ou dès que le plafond sera relevé
 * par une décision d'exploitation explicite.</p>
 *
 * <p>Valeur par défaut {@code 0} : <strong>aucun envoi externe autorisé</strong> tant qu'un plafond
 * n'a pas été décidé et configuré. Cohérent avec K8/ADR-18 — le socle est livré fermé, et l'ouvrir
 * est un acte d'exploitation délibéré.</p>
 */
@Service
public class NotificationBudgetService {

    private static final Logger log = LoggerFactory.getLogger(NotificationBudgetService.class);

    private final EntityManager em;
    private final NotificationMetrics metrics;
    private final long plafondMensuel;
    private final double seuilAlerte;

    public NotificationBudgetService(EntityManager em, NotificationMetrics metrics,
            @Value("${app.notifications.budget.mensuel-max:0}") long plafondMensuel,
            @Value("${app.notifications.budget.seuil-alerte:0.8}") double seuilAlerte) {
        this.em = em;
        this.metrics = metrics;
        this.plafondMensuel = plafondMensuel;
        this.seuilAlerte = seuilAlerte;
    }

    /**
     * État budgétaire du mois courant.
     *
     * @param consomme envois déjà remis au fournisseur ce mois-ci
     * @param plafond  plafond configuré
     */
    public record EtatBudget(long consomme, long plafond) {

        /** Vrai lorsque plus aucun envoi n'est autorisé ce mois-ci. */
        public boolean estEpuise() {
            return consomme >= plafond;
        }

        /** Part du plafond déjà consommée, entre 0 et 1 ({@code 1} si le plafond est nul). */
        public double ratio() {
            return plafond <= 0 ? 1d : (double) consomme / plafond;
        }
    }

    /**
     * Lit la consommation du mois et publie les jauges. Lecture seule, hors contexte tenant : la
     * fonction SQL est SECURITY DEFINER et ne retourne qu'un entier agrégé.
     */
    @Transactional(readOnly = true)
    public EtatBudget etatCourant() {
        long consomme = ((Number) em.createNativeQuery("SELECT notification_envois_du_mois()")
                .getSingleResult()).longValue();
        metrics.majBudget(consomme, plafondMensuel);
        EtatBudget etat = new EtatBudget(consomme, plafondMensuel);
        if (!etat.estEpuise() && etat.ratio() >= seuilAlerte) {
            log.warn("Budget de notifications externes à {}% du plafond mensuel ({}/{}).",
                    Math.round(etat.ratio() * 100), consomme, plafondMensuel);
        }
        return etat;
    }
}
