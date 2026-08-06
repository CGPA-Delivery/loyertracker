package com.loyertracker.notifications;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.loyertracker.notifications.NotificationApiService.HistoriqueItem;
import com.loyertracker.notifications.NotificationApiService.PreferenceRequest;
import com.loyertracker.notifications.NotificationApiService.PreferenceResponse;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationApiService service;

    public NotificationController(NotificationApiService service) {
        this.service = service;
    }

    @GetMapping("/preferences/current")
    @PreAuthorize("hasAnyRole('BAILLEUR', 'GESTIONNAIRE')")
    public PreferenceResponse consulterPreference(Authentication authentication) {
        return service.consulterPreference(authentication);
    }

    @PutMapping("/preferences/current")
    @PreAuthorize("hasAnyRole('BAILLEUR', 'GESTIONNAIRE')")
    public PreferenceResponse enregistrerPreference(@RequestBody PreferenceRequest request,
            Authentication authentication) {
        return service.enregistrerPreference(authentication, request);
    }

    @PostMapping("/preferences/current/unsubscribe")
    @PreAuthorize("hasAnyRole('BAILLEUR', 'GESTIONNAIRE')")
    public PreferenceResponse desinscrire(Authentication authentication) {
        return service.desinscrire(authentication);
    }

    @GetMapping("/history")
    @PreAuthorize("hasAnyRole('BAILLEUR', 'GESTIONNAIRE')")
    public List<HistoriqueItem> consulterHistorique(Authentication authentication) {
        return service.consulterHistorique(authentication);
    }
}
