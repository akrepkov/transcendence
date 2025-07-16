import { test, expect } from '@playwright/test';

test('tests if homepage has correct title', async ({ page }) => {
  await page.goto('http://localhost:3000'); // Adjust the port if needed
  await expect(page).toHaveTitle(/My App/i);
});
