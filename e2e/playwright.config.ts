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
  // One local retry too: several specs exercise real external services (Ollama, the
  // plantuml render server) and Chromium launch under load, which can flake on first try.
  retries: process.env.CI ? 2 : 1,
  reporter: 'html',
  use: {
    // Defaults to the Angular dev server's conventional port; override with
    // ATRIUM_E2E_BASE_URL when 4200 is unavailable (e.g. reserved by the OS).
    baseURL: process.env['ATRIUM_E2E_BASE_URL'] ?? 'http://localhost:4200',
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
