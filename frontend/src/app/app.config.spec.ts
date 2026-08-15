import { ConfirmationService, MessageService } from 'primeng/api';

import { appConfig, currentBrowserRedirectUri } from './app.config';

describe('appConfig Keycloak redirectUri', () => {
  const originalUrl = window.location.href;

  afterEach(() => {
    history.pushState(null, '', originalUrl);
  });

  it('déclare les services PrimeNG requis par les préférences de notification', () => {
    expect(appConfig.providers).toContain(ConfirmationService);
    expect(appConfig.providers).toContain(MessageService);
  });

  it('préserve la route Angular demandée pendant le check-sso initial', () => {
    history.pushState(null, '', '/bailleur/profil?onglet=notifications#oidc-noise');

    expect(currentBrowserRedirectUri()).toBe(`${window.location.origin}/bailleur/profil?onglet=notifications`);
  });
});
