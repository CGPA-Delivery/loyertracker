import { test, expect } from '@playwright/test';
import { createHash, randomBytes } from 'node:crypto';

const baseURL = process.env.E2E_BASE_URL ?? 'https://localhost';
const base64Url = (value: Buffer) => value.toString('base64url');

const VIEWPORTS = {
  mobile: { width: 390, height: 844, label: '390px (iPhone 14)' },
  breakpoint: { width: 640, height: 900, label: '640px (breakpoint DSG)' },
} as const;

const TOUCH_TARGET_MIN = 44; // px, DSG-001 §Responsive Rules

// ── Keycloak auth helpers ──────────────────────────────────────────────

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

async function loginAsBailleurTest(page: import('@playwright/test').Page) {
  await page.goto(buildAuthorizationRequest());
  await expect(page).toHaveURL(/\/protocol\/openid-connect\/auth/);
  await page.locator('#username').fill('bailleur-test@test.local');
  await page.locator('#password').fill(process.env.KEYCLOAK_TEST_BAILLEUR_PASSWORD ?? '');
  await page.locator('input[type="submit"]').click();
  // Après login, on est redirigé vers la SPA
  await page.waitForURL('**/bailleur', { timeout: 15_000 });
}

// ── Responsive checks ──────────────────────────────────────────────────

async function checkNoHorizontalScroll(page: import('@playwright/test').Page) {
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  return scrollWidth <= clientWidth + 1; // 1px tolerance
}

async function checkTouchTargets(page: import('@playwright/test').Page): Promise<{ pass: boolean; violations: string[] }> {
  const violations: string[] = [];
  const interactives = await page.evaluate((minSize) => {
    const elements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="link"], [role="checkbox"], [role="radio"], [tabindex]');
    const results: Array<{ tag: string; text: string; width: number; height: number }> = [];
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && (rect.width < minSize || rect.height < minSize)) {
        results.push({
          tag: el.tagName.toLowerCase(),
          text: (el as HTMLElement).innerText?.slice(0, 40) || '',
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      }
    });
    return results;
  }, TOUCH_TARGET_MIN);

  for (const v of interactives) {
    violations.push(`${v.tag} "${v.text}" → ${v.width}×${v.height}px (min ${TOUCH_TARGET_MIN}px)`);
  }
  return { pass: violations.length === 0, violations };
}

async function checkFormSingleColumn(page: import('@playwright/test').Page): Promise<boolean> {
  // Vérifie que les formulaires n'ont pas de layout multi-colonnes sous 640px
  return page.evaluate(() => {
    const forms = document.querySelectorAll('form');
    for (const form of forms) {
      const style = window.getComputedStyle(form);
      if (style.display === 'grid') {
        const cols = style.gridTemplateColumns.split(' ').length;
        if (cols > 1) return false;
      }
      // Vérifie les flex containers dans le formulaire
      const flexChildren = form.querySelectorAll('[style*="flex"], .row, .form-row');
      for (const child of flexChildren) {
        const cs = window.getComputedStyle(child);
        if (cs.display === 'flex' && cs.flexDirection !== 'column') {
          // Tolère flex-wrap
          if (cs.flexWrap === 'nowrap') return false;
        }
      }
    }
    return true;
  });
}

// ── Test fixtures ──────────────────────────────────────────────────────

const SCREENS = [
  { name: 'Keycloak Login', route: 'keycloak-login', auth: false },
  { name: 'Dashboard Bailleur', route: '/bailleur', auth: true },
  { name: 'Dashboard Gestionnaire', route: '/gestionnaire', auth: true },
  { name: 'Liste locataires', route: '/bailleur/locataires', auth: true },
  { name: 'Liste gestionnaires', route: '/bailleur/gestionnaires', auth: true },
  { name: 'Profil Bailleur', route: '/bailleur/profil', auth: true },
];

for (const screen of SCREENS) {
  for (const [vpKey, vp] of Object.entries(VIEWPORTS)) {
    test(`${screen.name} — ${vp.label}`, async ({ page }) => {
      test.setTimeout(60_000);
      await page.setViewportSize({ width: vp.width, height: vp.height });

      if (screen.route === 'keycloak-login') {
        await page.goto(buildAuthorizationRequest());
        await expect(page).toHaveURL(/\/protocol\/openid-connect\/auth/);
      } else {
        await loginAsBailleurTest(page);
        if (screen.route !== '/bailleur') {
          await page.goto(screen.route);
          await page.waitForLoadState('networkidle');
        }
      }

      // R01/R02: Pas de scroll horizontal
      const noHScroll = await checkNoHorizontalScroll(page);
      expect(noHScroll, `Scroll horizontal détecté sur ${screen.name} à ${vp.label}`).toBe(true);

      // R04: Touch targets
      const touchResult = await checkTouchTargets(page);
      if (!touchResult.pass) {
        console.warn(`[TOUCH] ${screen.name} @ ${vp.label}: ${touchResult.violations.length} violations`);
        for (const v of touchResult.violations.slice(0, 5)) {
          console.warn(`  - ${v}`);
        }
      }
      // Touch targets: non-bloquant, on log les violations
      expect(touchResult.violations.length, `Touch targets < ${TOUCH_TARGET_MIN}px`).toBeLessThan(20);

      // R05: Formulaires en une colonne (seulement au breakpoint)
      if (vpKey === 'breakpoint') {
        const singleCol = await checkFormSingleColumn(page);
        if (!singleCol) {
          console.warn(`[FORM] ${screen.name} @ ${vp.label}: formulaire multi-colonnes détecté`);
        }
      }

      // Screenshot pour inspection visuelle
      await page.screenshot({
        path: `test-results/responsive/${screen.name.replace(/\s+/g, '-').toLowerCase()}-${vpKey}.png`,
        fullPage: false,
      });
    });
  }
}
