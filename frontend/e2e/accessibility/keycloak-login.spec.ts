import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const seriousOrCritical = new Set(['serious', 'critical']);
const authorizationRequest = '/auth/realms/loyertracker/protocol/openid-connect/auth?client_id=loyertracker-spa&redirect_uri=https%3A%2F%2Flocalhost%2F&response_type=code&scope=openid';

async function expectKeycloakMainWithoutBlockingAxeViolations(page: import('@playwright/test').Page) {
  await expect(page.locator('#kc-content')).toHaveAttribute('role', 'main');
  await expect(page.locator('main#kc-content')).toHaveAttribute('aria-labelledby', 'kc-page-title');

  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((violation) => seriousOrCritical.has(violation.impact ?? ''));
  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
}

test('Keycloak login exposes one main landmark with no serious axe violations', async ({ page }) => {
  await page.goto(authorizationRequest);
  await expectKeycloakMainWithoutBlockingAxeViolations(page);
});

test('Keycloak forgot-password flow reaches the reset-credentials screen with no serious axe violations', async ({ page }) => {
  await page.goto(authorizationRequest);
  await page.getByRole('link', { name: /forgot password/i }).click();

  await expect(page).toHaveURL(/\/login-actions\/reset-credentials/);
  await expect(page.locator('form')).toContainText(/reset password/i);
  await expectKeycloakMainWithoutBlockingAxeViolations(page);
});
