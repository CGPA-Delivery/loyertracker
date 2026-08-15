import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash, randomBytes } from 'node:crypto';

const baseURL = process.env.E2E_BASE_URL ?? 'https://localhost';
const bailleurEmail = process.env.RESPONSIVE_BAILLEUR_EMAIL ?? 'bailleur-test@test.local';
const bailleurPassword = process.env.KEYCLOAK_TEST_BAILLEUR_PASSWORD ?? '';
const gestionnaireEmail = process.env.RESPONSIVE_GESTIONNAIRE_EMAIL ?? '';
const gestionnairePassword = process.env.RESPONSIVE_GESTIONNAIRE_PASSWORD ?? '';
const responsiveSeedRunId = process.env.RESPONSIVE_SEED_RUN_ID ?? '';
const touchTargetMin = 44;

const base64Url = (value: Buffer) => value.toString('base64url');

const viewports = [
  { name: '360', width: 360, height: 740 },
  { name: '390', width: 390, height: 844 },
  { name: '640', width: 640, height: 900 },
  { name: '1024', width: 1024, height: 768 },
] as const;

const bailleurRoutes = [
  { name: 'dashboard-bailleur', path: '/bailleur', heading: /Espace bailleur/i, needsSeed: false },
  { name: 'profil-bailleur', path: '/bailleur/profil', heading: /profil|bailleur/i, needsSeed: false },
  { name: 'locataires', path: '/bailleur/locataires', heading: /locataires/i, needsSeed: true },
  { name: 'gestionnaires', path: '/bailleur/gestionnaires', heading: /gestionnaires/i, needsSeed: true },
] as const;

function authorizationRequest(): string {
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
  return `/auth/realms/loyertracker/protocol/openid-connect/auth?${params.toString()}`;
}

async function login(page: Page, email: string, password: string): Promise<void> {
  await page.goto(authorizationRequest());
  await expect(page).toHaveURL(/\/protocol\/openid-connect\/auth/);
  await page.locator('#username').fill(email);
  await page.locator('#password').fill(password);
  await page.locator('input[type="submit"]').click();
  await page.waitForURL(/\/(bailleur|gestionnaire)(\?|$)/, { timeout: 20_000 });
}

async function assertNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    const clientWidth = document.documentElement.clientWidth;
    const overflowingElements = Array.from(document.querySelectorAll<HTMLElement>('body *'))
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.right > clientWidth + 1;
      });
    const offenders = overflowingElements
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id,
          className: String(element.className || ''),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          text: (element.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 80),
        };
      })
      .slice(0, 12);
    const ancestors: unknown[] = [];
    let ancestor: HTMLElement | null = overflowingElements[0] ?? null;
    while (ancestor) {
      const rect = ancestor.getBoundingClientRect();
      const style = getComputedStyle(ancestor);
      ancestors.push({
        tag: ancestor.tagName.toLowerCase(),
        className: String(ancestor.className || ''),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        display: style.display,
        minWidth: style.minWidth,
        maxWidth: style.maxWidth,
        boxSizing: style.boxSizing,
        gridTemplateColumns: style.gridTemplateColumns,
      });
      ancestor = ancestor.parentElement;
    }
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth,
      overflowX: document.documentElement.scrollWidth - clientWidth,
      offenders,
      ancestors,
    };
  });
  expect(overflow.overflowX, JSON.stringify(overflow)).toBeLessThanOrEqual(1);
}

async function assertNoBlockingAxeViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact ?? ''),
  );
  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
}

async function assertTouchTargets(page: Page): Promise<void> {
  const violations = await page.evaluate((minSize) => {
    const selectors = [
      'button',
      'a',
      'input:not([type="hidden"])',
      'select',
      'textarea',
      '[role="button"]',
      '[role="link"]',
      '[role="checkbox"]',
      '[role="radio"]',
    ];
    return Array.from(document.querySelectorAll<HTMLElement>(selectors.join(',')))
      .map((element) => {
        const target = element instanceof HTMLInputElement && element.type === 'checkbox'
          ? element.closest('label') ?? element
          : element;
        const rect = target.getBoundingClientRect();
        return {
          label: (element.getAttribute('aria-label') || element.textContent || element.tagName).trim().slice(0, 80),
          id: element.id,
          formControlName: element.getAttribute('formControlName'),
          parent: element.parentElement?.outerHTML.slice(0, 300) ?? '',
          className: String(element.className || ''),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      })
      .filter((item) => item.width > 0 && item.height > 0 && (item.width < minSize || item.height < minSize));
  }, touchTargetMin);

  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}

async function assertMobileFormsSingleColumn(page: Page): Promise<void> {
  const multiColumnForms = await page.evaluate(() => {
    return Array.from(document.querySelectorAll<HTMLElement>('form'))
      .filter((form) => {
        const style = window.getComputedStyle(form);
        if (style.display === 'grid') {
          const columns = style.gridTemplateColumns.split(' ').filter(Boolean);
          return columns.length > 1;
        }
        return false;
      })
      .map((form) => form.getAttribute('aria-label') || form.querySelector('h1,h2,h3')?.textContent?.trim() || form.className || 'form');
  });
  expect(multiColumnForms, JSON.stringify(multiColumnForms)).toEqual([]);
}

async function assertReducedMotionFriendly(page: Page): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const animated = await page.evaluate(() => {
    const toMilliseconds = (duration: string) => {
      const value = Number.parseFloat(duration);
      return duration.endsWith('ms') ? value : value * 1000;
    };
    return Array.from(document.querySelectorAll<HTMLElement>('body *'))
      .map((element) => {
        const style = window.getComputedStyle(element);
        return {
          label: element.id || element.className?.toString() || element.tagName,
          animationDuration: style.animationDuration,
          transitionDuration: style.transitionDuration,
        };
      })
      .filter((entry) => toMilliseconds(entry.animationDuration) > 1 || toMilliseconds(entry.transitionDuration) > 1)
      .slice(0, 20);
  });
  expect(animated, JSON.stringify(animated, null, 2)).toEqual([]);
}

test.describe('CHECK-RESPONSIVE-01 durable proof — authenticated Angular', () => {
  test.beforeAll(() => {
    // A skipped authenticated check is not CGPA evidence. Missing prerequisites must fail loudly.
    expect(bailleurPassword, 'KEYCLOAK_TEST_BAILLEUR_PASSWORD requis : aucune preuve authentifiée ne peut être produite sans lui.').not.toBe('');
    expect(gestionnaireEmail, 'RESPONSIVE_GESTIONNAIRE_EMAIL requis : exécuter le seed contrôlé avant la preuve.').not.toBe('');
    expect(gestionnairePassword, 'RESPONSIVE_GESTIONNAIRE_PASSWORD requis : exécuter le seed contrôlé avant la preuve.').not.toBe('');
    expect(responsiveSeedRunId, 'RESPONSIVE_SEED_RUN_ID requis : la preuve doit cibler les données du seed courant.').not.toBe('');
  });

  for (const viewport of viewports) {
    for (const route of bailleurRoutes) {
      test(`${route.name} — ${viewport.name}px`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await login(page, bailleurEmail, bailleurPassword);
        await page.goto(route.path);
        await page.waitForLoadState('networkidle');
        await expect.poll(() => new URL(page.url()).pathname).toBe(route.path);
        await expect(page.getByRole('heading', { name: route.heading }).first()).toBeVisible();

        await assertNoHorizontalOverflow(page);
        await assertNoBlockingAxeViolations(page);
        await assertTouchTargets(page);
        if (viewport.width <= 640) {
          await assertMobileFormsSingleColumn(page);
        }
        if (viewport.width === 390) {
          await assertReducedMotionFriendly(page);
        }
        if (route.needsSeed) {
          await expect(page.getByText(/Aucun bien|Aucun locataire|Aucun gestionnaire/i)).toHaveCount(0);
        }
        await page.screenshot({ path: `test-results/responsive/${route.name}-${viewport.name}.png`, fullPage: true });
      });
    }

    test(`dashboard-gestionnaire — ${viewport.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await login(page, gestionnaireEmail, gestionnairePassword);
      await page.goto('/gestionnaire');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/gestionnaire(\?|$)/);
      await expect(page.getByRole('heading', { name: /Espace gestionnaire/i })).toBeVisible();
      await assertNoHorizontalOverflow(page);
      await assertNoBlockingAxeViolations(page);
      await assertTouchTargets(page);
      await expect(page.getByText(/Aucun bien affecté/i)).toHaveCount(0);
      await page.screenshot({ path: `test-results/responsive/dashboard-gestionnaire-${viewport.name}.png`, fullPage: true });
    });

    test(`dialogue-retenue-garantie — ${viewport.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await login(page, bailleurEmail, bailleurPassword);
      await page.goto('/bailleur');
      await page.waitForLoadState('networkidle');

      await page.getByRole('button', {
        name: `Sélectionner la ligne : 21 avenue Responsive ${responsiveSeedRunId}`,
      }).click();
      await expect(page.getByRole('heading', { name: /Bail ·/i })).toBeVisible();
      await page.getByRole('button', { name: 'Garanties', exact: true }).first().click();
      await expect(page.getByRole('button', { name: /Utiliser pour un impayé/i })).toBeVisible();
      await page.getByRole('button', { name: /Utiliser pour un impayé/i }).click();

      const formulaire = page.locator('form.sous-formulaire').filter({ hasText: /Utiliser la garantie pour un impayé/i });
      const paiement = formulaire.getByLabel('Loyer impayé');
      await expect(paiement.locator('option')).not.toHaveCount(1);
      await paiement.selectOption({ index: 1 });
      await formulaire.getByLabel('Montant retenu').fill('1');

      let requetesRetenue = 0;
      page.on('request', (request) => {
        if (request.method() === 'POST' && request.url().includes('/retenue-loyer')) {
          requetesRetenue += 1;
        }
      });

      const declencheur = formulaire.getByRole('button', { name: 'Confirmer la retenue', exact: true });
      await declencheur.click();

      const dialogue = page.getByRole('alertdialog', { name: 'Confirmer la retenue' });
      const annuler = dialogue.getByRole('button', { name: 'Annuler' });
      const confirmer = dialogue.getByRole('button', { name: 'Confirmer la retenue', exact: true });
      await expect(dialogue).toBeVisible();
      await expect(dialogue).toContainText('PARTIEL');
      await expect(dialogue).toContainText(/Aucune quittance certifiée/i);
      await expect(annuler).toBeFocused();
      expect(requetesRetenue).toBe(0);

      await annuler.press('Tab');
      await expect(confirmer).toBeFocused();
      await confirmer.press('Tab');
      await expect(annuler).toBeFocused();
      await annuler.press('Shift+Tab');
      await expect(confirmer).toBeFocused();

      await assertNoHorizontalOverflow(page);
      await assertNoBlockingAxeViolations(page);
      for (const action of [annuler, confirmer]) {
        const box = await action.boundingBox();
        expect(box, 'le bouton du dialogue doit être rendu').not.toBeNull();
        expect(box!.width).toBeGreaterThanOrEqual(touchTargetMin);
        expect(box!.height).toBeGreaterThanOrEqual(touchTargetMin);
      }
      await page.screenshot({
        path: `test-results/responsive/dialogue-retenue-garantie-${viewport.name}.png`,
        fullPage: false,
      });

      await dialogue.press('Escape');
      await expect(dialogue).toBeHidden();
      await expect(declencheur).toBeFocused();
      expect(requetesRetenue).toBe(0);
    });
  }
});
