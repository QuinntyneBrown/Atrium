import { type Locator, type Page } from '@playwright/test';

/**
 * Page object for the application's health/landing view.
 *
 * Exposes the health status surfaced by the frontend so specs can assert on it
 * without reaching into raw selectors.
 */
export class HealthPage {
  readonly page: Page;
  readonly healthStatus: Locator;

  constructor(page: Page) {
    this.page = page;
    this.healthStatus = page.getByTestId('health-status');
  }

  /** Navigate to the application root. */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /** Return the text content of the health status element. */
  async getStatus(): Promise<string> {
    return (await this.healthStatus.textContent()) ?? '';
  }
}
