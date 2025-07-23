import { test, expect } from '@playwright/test';

test.setTimeout(60000);

test('should log in existing user', async ({ page }) => {
  await page.goto('https://localhost:3000');

  await expect(page.locator('#loginForm')).toBeVisible({ timeout: 10000 });
  await page.fill('#loginUsername', 'djoyke');
  await page.fill('#loginPassword', 'djoyke');
  await page.click('#loginForm button[type="submit"]');

  const message = page.locator('#loginMessage');
  await expect(message).toBeVisible({ timeout: 10000 });
  await expect(message).toHaveText('Logged in successfully');
});

test('should not log in non-existing user', async ({ page }) => {
  await page.goto('https://localhost:3000');

  await expect(page.locator('#loginForm')).toBeVisible({ timeout: 10000 });
  await page.fill('#loginUsername', 'djoy');
  await page.fill('#loginPassword', 'djoy');
  await page.click('#loginForm button[type="submit"]');

  const message = page.locator('#loginMessage');
  await expect(message).toBeVisible({ timeout: 10000 });
  await expect(message).toHaveText('Invalid credentials');
});
