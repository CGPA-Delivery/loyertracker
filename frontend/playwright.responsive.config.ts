import { defineConfig } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'https://localhost';

export default defineConfig({
  testDir: './e2e/responsive',
  testMatch: 'authenticated-angular-responsive.spec.ts',
  outputDir: 'test-results/responsive',
  fullyParallel: false,
  forbidOnly: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['html', { outputFolder: 'playwright-report/responsive', open: 'never' }],
    ['junit', { outputFile: 'test-results/responsive/junit.xml' }],
    ['list'],
  ],
  use: {
    baseURL,
    screenshot: 'on',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    // Responsive evidence must use the same trusted public TLS route as OIDC.
    // Do not set ignoreHTTPSErrors=true for durable CGPA proof.
    ignoreHTTPSErrors: false,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
