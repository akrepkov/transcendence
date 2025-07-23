import { test, expect, Page } from '@playwright/test';
import { deleteUser } from '../../backend/database/services/userServices.js';

test.setTimeout(60000);

const timestamp = Date.now();
const testUsername = `testUser-${timestamp}`;
const testEmail = `testEmail-${timestamp}@example.com`;
const testPassword = `testPassword-${timestamp}`;

async function registerUser(page: Page, username: string, email: string, password: string) {
  await page.goto('https://localhost:3000?e2e=register');

  // Force show the register form to bypass hidden class
  await page.evaluate(() => {
    document.getElementById('registerForm')?.classList.remove('hidden');
    document.getElementById('loginForm')?.classList.add('hidden');
  });

  await page.fill('#registerUsername', username);
  await page.fill('#registerEmail', email);
  await page.fill('#registerPassword', password);
  await page.click('#registerForm button[type="submit"]');
}

test.describe('User Registration', () => {
  test('registers a new user successfully', async ({ page }) => {
    try {
      await registerUser(page, testUsername, testEmail, testPassword);

      await expect(page.locator('#registerMessage')).toHaveText('User created successfully', {
        timeout: 10000,
      });
    } finally {
      await deleteUser(testUsername);
    }
  });

  test('does not register a user with an existing username', async ({ page }) => {
    try {
      await registerUser(page, testUsername, testEmail, testPassword);

      await expect(page.locator('#registerMessage')).toHaveText('User created successfully', {
        timeout: 10000,
      });

      // Try duplicate registration
      await registerUser(page, testUsername, testEmail, testPassword);
      await expect(page.locator('#registerMessage')).toHaveText(
        'Username or email is already in use',
        { timeout: 10000 },
      );
    } finally {
      await deleteUser(testUsername);
    }
  });
});
