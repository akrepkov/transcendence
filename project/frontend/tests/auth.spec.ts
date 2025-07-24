import { test, expect } from '@playwright/test';
import { deleteUser } from '../../backend/database/services/userServices.js';

const username = `test_${Date.now()}`;

test.describe.serial('Auth Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://localhost:3000');
    await page.context().clearCookies();
  });

  test('should log in an existing user', async ({ page }) => {
    await page.fill('#loginUsername', 'djoyke');
    await page.fill('#loginPassword', 'djoyke');
    await page.click('#loginForm button[type="submit"]');

    await page.waitForTimeout(1000); //temp check
    console.log(await page.locator('#loginMessage').innerText()); //temp check


    await expect(page.locator('#loginMessage')).toBeVisible();
    await expect(page.locator('#loginMessage')).toHaveText('Logged in successfully');
  });

  test('should not log in a non-existing user', async ({ page }) => {
    await page.fill('#loginUsername', 'wronguser');
    await page.fill('#loginPassword', 'wrongpass');
    await page.click('#loginForm button[type="submit"]');

    await expect(page.locator('#loginMessage')).toBeVisible();
    await expect(page.locator('#loginMessage')).toHaveText('Invalid credentials');
  });

  test('should register a new user', async ({ page }) => {
    await page.click('#toggleForm');

    await page.fill('#registerUsername', username);
    await page.fill('#registerEmail', `${username}@test.com`);
    await page.fill('#registerPassword', 'password123');
    await page.click('#registerForm button[type="submit"]');

    await expect(page.locator('#registerMessage')).toBeVisible();
    await expect(page.locator('#registerMessage')).toHaveText('User registered successfully');
  });

  test('should not register an existing user', async ({ page }) => {
    await page.click('#toggleForm');

    await page.fill('#registerUsername', username);
    await page.fill('#registerEmail', `${username}@test.com`);
    await page.fill('#registerPassword', 'password123');
    await page.click('#registerForm button[type="submit"]');

    await expect(page.locator('#registerMessage')).toBeVisible();
    await expect(page.locator('#registerMessage')).toHaveText('Username or email is already in use');

    // Safe cleanup
    try {
      await deleteUser(username);
    } catch (err) {
      if (err.code === 'P2025') {
        console.warn(`User '${username}' already deleted or not found. Skipping cleanup.`);
      } else {
        throw err;
      }
    }
  });
});
