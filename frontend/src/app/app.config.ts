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
import { ConfirmationService, MessageService } from 'primeng/api';

import { httpErrorRedirectInterceptor } from './core/http/http-error-redirect.interceptor';
import { routes } from './app.routes';
import { LtPreset } from '../styles/tokens/lt-preset';

// Le Bearer est attaché à tous les appels /api SAUF /api/public/ : la surface publique de
// vérification des quittances (US-102) est atteinte par des tiers non authentifiés (check-sso, sans
// token). Sans cette exclusion, includeBearerTokenInterceptor bloquerait ces appels faute de token.
const apiBearerCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^\/api\/(?!public\/).*/i,
  bearerPrefix: 'Bearer',
});

/**
 * URL de retour Keycloak pour le `check-sso` initial.
 *
 * Le runtime HTTPS local charge l'Angular directement sur des deep links
 * (`/gestionnaire`, `/bailleur/profil`, etc.). Si `check-sso` revient toujours sur `/`,
 * Angular évalue ensuite la route racine et finit sur `/bailleur`, ce qui masque les routes
 * déclarées. On conserve donc le chemin demandé, en retirant seulement le fragment OAuth/SPA.
 */
export function currentBrowserRedirectUri(): string {
  return `${globalThis.location.origin}${globalThis.location.pathname}${globalThis.location.search}`;
}

export const appConfig: ApplicationConfig = {
  providers: [
    ConfirmationService,
    MessageService,
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
        redirectUri: currentBrowserRedirectUri(),
      },
    }),
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [apiBearerCondition],
    },
    provideHttpClient(withInterceptors([httpErrorRedirectInterceptor, includeBearerTokenInterceptor])),
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
