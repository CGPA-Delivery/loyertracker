package com.loyertracker.biens;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import jakarta.persistence.LockModeType;

public interface BienRepository extends JpaRepository<Bien, UUID> {

    List<Bien> findByBailleurIdOrderByAdresseAsc(UUID bailleurId);

    /**
     * Lecture avec verrou en écriture : sérialise les opérations de bail (création, clôture,
     * réouverture) et de statut sur un même bien, pour que le statut dérivé ne diverge pas du
     * bail sous concurrence.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Bien> findWithLockById(UUID id);
}
