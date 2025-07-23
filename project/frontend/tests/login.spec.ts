import { test, expect, Page } from '@playwright/test';

test.setTimeout(60000);

const EXISTING_USER = {
  username: 'djoyke',
  password: 'djoyke',
  successMessage: 'Logged in successfully',
};

const NON_EXISTING_USER = {
  username: 'djoy',
  password: 'djoy',
  errorMessage: 'Invalid credentials',
};

async function performLogin(page: Page, username: string, password: string) {
  await page.goto('https://localhost:3000?e2e=login');
  await page.evaluate(() => {
    document.getElementById('registerForm')?.classList.add('hidden');
    document.getElementById('loginForm')?.classList.remove('hidden');
  });
  const form = page.locator('#loginForm');

  await expect(form).toBeVisible({ timeout: 10000 });

  await page.fill('#loginUsername', username);
  await page.fill('#loginPassword', password);
  await page.click('#loginForm button[type="submit"]');
}

test.describe('Login Flow', () => {
  test('should log in existing user', async ({ page }) => {
    await performLogin(page, EXISTING_USER.username, EXISTING_USER.password);

    const message = page.locator('#loginMessage');
    await expect(message).toBeVisible({ timeout: 10000 });
    await expect(message).toHaveText(EXISTING_USER.successMessage);
  });

  test('should not log in non-existing user', async ({ page }) => {
    await performLogin(page, NON_EXISTING_USER.username, NON_EXISTING_USER.password);

    const message = page.locator('#loginMessage');
    await expect(message).toBeVisible({ timeout: 10000 });
    await expect(message).toHaveText(NON_EXISTING_USER.errorMessage);
  });
});
