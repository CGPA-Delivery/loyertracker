import { defineConfig } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'https://localhost';

export default defineConfig({
  testDir: './e2e/accessibility',
  outputDir: 'test-results/accessibility',
  fullyParallel: false,
  forbidOnly: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['html', { outputFolder: 'playwright-report/accessibility', open: 'never' }],
    ['junit', { outputFile: 'test-results/accessibility/junit.xml' }],
    ['list'],
  ],
  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    // A trusted TLS chain is a prerequisite of the evidence: never bypass it here.
    ignoreHTTPSErrors: false,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
