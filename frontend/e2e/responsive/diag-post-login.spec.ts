import { test } from '@playwright/test';
import { createHash, randomBytes } from 'node:crypto';

const baseURL = 'https://localhost';
const base64Url = (value: Buffer) => value.toString('base64url');

test('DIAG — capture post-login state', async ({ page }) => {
  test.setTimeout(30_000);

  const codeVerifier = base64Url(randomBytes(32));
  const codeChallenge = base64Url(createHash('sha256').update(codeVerifier).digest());
  const params = new URLSearchParams({
    client_id: 'loyertracker-spa',
    redirect_uri: `${baseURL}/`,
    response_type: 'code',
    scope: 'openid',
    prompt: 'login',
    state: base64Url(randomBytes(16)),
    nonce: base64Url(randomBytes(16)),
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  await page.goto(`/auth/realms/loyertracker/protocol/openid-connect/auth?${params.toString()}`);
  await page.locator('#username').fill('bailleur-test@test.local');
  await page.locator('#password').fill(process.env.KEYCLOAK_TEST_BAILLEUR_PASSWORD ?? '');
  await page.locator('input[type="submit"]').click();

  // Attendre que la navigation post-submit se stabilise
  await page.waitForTimeout(3000);

  // Screenshot de ce qu'on voit après submit
  await page.screenshot({ path: 'test-results/responsive/diag-post-login.png', fullPage: false });

  // Afficher l'URL courante et le titre
  const url = page.url();
  const title = await page.title();
  const bodyText = await page.evaluate(() => document.body?.innerText?.slice(0, 500) || 'EMPTY');
  console.log(`URL: ${url}`);
  console.log(`TITLE: ${title}`);
  console.log(`BODY: ${bodyText}`);
});
