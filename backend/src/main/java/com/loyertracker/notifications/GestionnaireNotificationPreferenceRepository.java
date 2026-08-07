package com.loyertracker.notifications;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GestionnaireNotificationPreferenceRepository
        extends JpaRepository<GestionnaireNotificationPreference, UUID> {

    Optional<GestionnaireNotificationPreference> findByGestionnaireId(UUID gestionnaireId);
}
