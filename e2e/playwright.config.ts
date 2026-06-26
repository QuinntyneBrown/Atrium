import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Atrium end-to-end tests.
 *
 * The full stack (API + Angular dev server) is started manually for M0, so no
 * `webServer` is configured here. Tests assume the Angular app is reachable at
 * `baseURL`.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    testIdAttribute: 'data-testid',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
