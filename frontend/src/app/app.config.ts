import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
  createInterceptorCondition,
  includeBearerTokenInterceptor,
  provideKeycloak,
} from 'keycloak-angular';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { LtPreset } from '../styles/tokens/lt-preset';

// Le Bearer est attaché à tous les appels /api SAUF /api/public/ : la surface publique de
// vérification des quittances (US-102) est atteinte par des tiers non authentifiés (check-sso, sans
// token). Sans cette exclusion, includeBearerTokenInterceptor bloquerait ces appels faute de token.
const apiBearerCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^\/api\/(?!public\/).*/i,
  bearerPrefix: 'Bearer',
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideKeycloak({
      config: {
        url: '/auth',
        realm: 'loyertracker',
        clientId: 'loyertracker-spa',
      },
      initOptions: {
        // check-sso (et non login-required) : l'application n'impose plus l'authentification au
        // bootstrap. Les routes protégées restent gardées par `authGuard` (qui déclenche le login
        // au besoin) ; la page publique de vérification `/verify/receipt/:id` (US-103) est ainsi
        // atteignable sans compte ni formulaire de connexion.
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
        redirectUri: window.location.origin + '/',
      },
    }),
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [apiBearerCondition],
    },
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
    // US-130 (Lot 1) : thème LoyerTracker (DSG-001.md v0.2.0). `darkModeSelector: '.p-dark'` fige
    // le mode sombre indépendamment de la préférence système — l'app n'a qu'un seul mode
    // (DSG-001.md §Dark Mode), classe posée sur <html> dans index.html.
    //
    // `license` : clé PrimeUI Community — secret hors code (DSO-03), non câblée ici. Sans elle,
    // PrimeNG affiche une bannière « Invalid PrimeUI License » (cosmétique, ne bloque aucune
    // fonctionnalité) — l'injection de la clé réelle dans le build déployé relève d'un mécanisme
    // CI/DevSecOps distinct, hors périmètre de US-130 (cf. project-state.md).
    providePrimeNG({
      theme: {
        preset: LtPreset,
        options: { darkModeSelector: '.p-dark' },
      },
      ripple: false, // DSG-001.md §Principes « Sobriété » : pas de décoration sans fonction.
    }),
  ],
};
