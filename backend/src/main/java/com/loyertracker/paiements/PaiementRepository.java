package com.loyertracker.paiements;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

public interface PaiementRepository extends JpaRepository<Paiement, UUID> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Paiement p where p.id = :id")
    Optional<Paiement> findByIdForUpdate(@Param("id") UUID id);

    List<Paiement> findByBienIdOrderByPeriodeDesc(UUID bienId);

    Optional<Paiement> findByBienIdAndPeriode(UUID bienId, String periode);

    /** US-115/ADR-17 K4 : détecte des paiements en cours pour l'avertissement de clôture. */
    boolean existsByBailIdAndStatutIn(UUID bailId, Collection<StatutPaiement> statuts);

    /** US-117/ADR-17 K6 : purge l'échéancier futur non exigible à la clôture. `periode` est un
     *  CHAR(7) 'YYYY-MM' — comparaison lexicographique correcte pour ce format zero-paddé, même
     *  convention que to_char(..., 'YYYY-MM') déjà utilisé par le batch d'échéances (V18). */
    long deleteByBailIdAndStatutAndPeriodeGreaterThan(UUID bailId, StatutPaiement statut, String periode);
}
