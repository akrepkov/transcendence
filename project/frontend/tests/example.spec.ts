import { test, expect } from '@playwright/test';

test('tests if homepage has correct title and content', async ({ page }) => {
  await page.goto('https://localhost:3000');
  await expect(page).toHaveTitle(/Pong/i);
});
