import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash, randomBytes } from 'node:crypto';

const seriousOrCritical = new Set(['serious', 'critical']);
const baseURL = process.env.E2E_BASE_URL ?? 'https://localhost';
const base64Url = (value: Buffer) => value.toString('base64url');

// Le client `loyertracker-spa` impose `pkce.code.challenge.method=S256`
// (infra/keycloak/realm-loyertracker.json) : sans `code_challenge`, Keycloak rejette la requête
// et redirige vers la SPA, qui rejoue son propre check-sso — l'écran Keycloak n'était alors
// atteint que par ricochet. Le code d'autorisation n'est jamais échangé : le `code_verifier`
// reste local au test, aucun secret ni Direct Grant.
function buildAuthorizationRequest(clientId = 'loyertracker-spa'): string {
  const codeVerifier = base64Url(randomBytes(32));
  const codeChallenge = base64Url(createHash('sha256').update(codeVerifier).digest());
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${baseURL}/`,
    response_type: 'code',
    scope: 'openid',
    prompt: 'login',
    state: base64Url(randomBytes(16)),
    nonce: base64Url(randomBytes(16)),
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  return `/auth/realms/loyertracker/protocol/openid-connect/auth?${params.toString()}`;
}

async function gotoKeycloakLogin(page: import('@playwright/test').Page) {
  await page.goto(buildAuthorizationRequest());
  // Invariant anti-ricochet : la requête d'autorisation doit rendre l'écran Keycloak elle-même.
  await expect(page).toHaveURL(/\/protocol\/openid-connect\/auth/);
}

async function expectKeycloakMainWithoutBlockingAxeViolations(page: import('@playwright/test').Page) {
  await expect(page.locator('#kc-content')).toHaveAttribute('role', 'main');
  await expect(page.locator('main#kc-content')).toHaveAttribute('aria-labelledby', 'kc-page-title');

  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((violation) => seriousOrCritical.has(violation.impact ?? ''));
  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
}

test('Keycloak login exposes one main landmark with no serious axe violations', async ({ page }) => {
  await gotoKeycloakLogin(page);
  await expectKeycloakMainWithoutBlockingAxeViolations(page);
});

test('Keycloak forgot-password flow reaches the reset-credentials screen with no serious axe violations', async ({ page }) => {
  await gotoKeycloakLogin(page);

  const forgotPasswordLink = page.locator('main#kc-content a[href*="login-actions/reset-credentials"]');
  await expect(forgotPasswordLink).toBeVisible();
  // Realm verrouillé sur `fr` (supportedLocales=["fr"], cf. infra/keycloak/activate-login-theme.sh,
  // DD-EP17-13) : le nom accessible du lien doit être le libellé français.
  await expect(forgotPasswordLink).toHaveAccessibleName(/mot de passe oubli/i);
  await forgotPasswordLink.click();

  await expect(page).toHaveURL(/\/login-actions\/reset-credentials/);
  await expect(page.locator('main#kc-content form')).toBeVisible();
  await expect(page.locator('#kc-page-title')).not.toBeEmpty();
  await expectKeycloakMainWithoutBlockingAxeViolations(page);
});

test('Keycloak session-expired page exposes the shared landmark with no serious axe violations', async ({ page }) => {
  await gotoKeycloakLogin(page);
  const action = await page.locator('main#kc-content form').getAttribute('action');
  expect(action).toBeTruthy();
  const tabId = new URL(action!, baseURL).searchParams.get('tab_id');
  expect(tabId).toBeTruthy();

  await page.goto(`/auth/realms/loyertracker/login-actions/authenticate?execution=BAD&client_id=loyertracker-spa&tab_id=${encodeURIComponent(tabId!)}`);
  await expect(page.locator('#kc-page-title')).toContainText(/page a expir/i);
  await expectKeycloakMainWithoutBlockingAxeViolations(page);
});

test('Keycloak bearer-only client denial exposes the error landmark with no serious axe violations', async ({ page }) => {
  await page.goto(buildAuthorizationRequest('loyertracker-api'));
  await expect(page.locator('#kc-page-title')).not.toBeEmpty();
  await expect(page.locator('main#kc-content')).toContainText(/Bearer-only/i);
  await expectKeycloakMainWithoutBlockingAxeViolations(page);
});

test('Keycloak logout confirmation page exposes the shared landmark with no serious axe violations', async ({ page }) => {
  await page.goto('/auth/realms/loyertracker/protocol/openid-connect/logout');
  await expect(page.locator('#kc-page-title')).toContainText(/déconnexion/i);
  await expect(page.locator('main#kc-content form')).toBeVisible();
  await expectKeycloakMainWithoutBlockingAxeViolations(page);
});

test('Keycloak password-reset flow via Mailpit action-token exposes the update-password form with no serious axe violations', async ({ page, request }) => {
  const testEmail = 'bailleur-test@test.local';
  const mailpitBase = 'http://localhost:8025';

  // 1. Aller sur l'écran de login et cliquer sur "Mot de passe oublié".
  await gotoKeycloakLogin(page);
  const forgotPasswordLink = page.locator('main#kc-content a[href*="login-actions/reset-credentials"]');
  await expect(forgotPasswordLink).toBeVisible();
  await forgotPasswordLink.click();
  await expect(page).toHaveURL(/\/login-actions\/reset-credentials/);

  // 2. Remplir l'email du compte de test et cliquer sur le bouton submit.
  await page.locator('main#kc-content input#username').fill(testEmail);
  await page.locator('main#kc-content input[type="submit"]').click();

  // 3. Keycloak doit confirmer l'envoi (message "Vous devriez recevoir un email...").
  await expect(page.locator('#kc-info-message')).toContainText(/email/i, { timeout: 15_000 });

  // 4. Poller Mailpit pour récupérer l'action-token.
  let actionTokenUrl: string | null = null;
  for (let attempt = 0; attempt < 20; attempt++) {
    const resp = await request.get(`${mailpitBase}/api/v1/messages`);
    expect(resp.ok(), `Mailpit API status ${resp.status()}`).toBeTruthy();
    const body = await resp.json();
    const messages: Array<{ ID: string }> = body.messages ?? [];

    for (const msg of messages) {
      const msgResp = await request.get(`${mailpitBase}/api/v1/message/${msg.ID}`);
      expect(msgResp.ok()).toBeTruthy();
      const msgData = await msgResp.json();
      const html: string = msgData.HTML ?? '';

      // L'action-token Keycloak est un lien vers login-actions/action-token
      const match = html.match(/https:\/\/localhost\/auth\/realms\/loyertracker\/login-actions\/action-token\?[^"\s<>]+/);
      if (match) {
        actionTokenUrl = match[0];
        break;
      }
    }
    if (actionTokenUrl) break;
    await page.waitForTimeout(1_500);
  }
  expect(actionTokenUrl, 'Action-token non trouvé dans Mailpit après 20 tentatives').toBeTruthy();

  // 5. Naviguer vers l'action-token (formulaire update-password).
  await page.goto(actionTokenUrl!);
  await expect(page.locator('main#kc-content form')).toBeVisible({ timeout: 10_000 });
  await expect(page.locator('#kc-page-title')).not.toBeEmpty();

  // 6. Audit axe du formulaire de réinitialisation.
  await expectKeycloakMainWithoutBlockingAxeViolations(page);
});
