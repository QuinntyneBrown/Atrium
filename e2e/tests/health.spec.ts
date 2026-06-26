import { test, expect } from '@playwright/test';
import { HealthPage } from '../pages/health.page';

test('displays a healthy status', async ({ page }) => {
  const healthPage = new HealthPage(page);
  await healthPage.goto();

  await expect(healthPage.healthStatus).toHaveText('Healthy');
});
