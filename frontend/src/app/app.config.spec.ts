import { currentBrowserRedirectUri } from './app.config';

describe('appConfig Keycloak redirectUri', () => {
  const originalUrl = window.location.href;

  afterEach(() => {
    history.pushState(null, '', originalUrl);
  });

  it('préserve la route Angular demandée pendant le check-sso initial', () => {
    history.pushState(null, '', '/bailleur/profil?onglet=notifications#oidc-noise');

    expect(currentBrowserRedirectUri()).toBe(`${window.location.origin}/bailleur/profil?onglet=notifications`);
  });
});
