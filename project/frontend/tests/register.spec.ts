import { test, expect } from '@playwright/test';
import { deleteUser } from '../../backend/database/services/userServices.js';

test.setTimeout(60000);

const timestamp = Date.now();
const testUsername = `testUser-${timestamp}`;
const testEmail = `testEmail-${timestamp}@example.com`;
const testPassword = `testPassword-${timestamp}`;

test('registers a new user successfully', async ({ page }) => {
  await page.goto('https://localhost:3000?form=register');

  await expect(page.locator('#registerForm')).toBeVisible({ timeout: 10000 });

  await page.fill('#registerUsername', testUsername);
  await page.fill('#registerEmail', testEmail);
  await page.fill('#registerPassword', testPassword);
  await page.click('#registerForm button[type="submit"]');

  const message = page.locator('#registerMessage');
  await expect(message).toBeVisible({ timeout: 10000 });
  await expect(message).toHaveText('User created successfully');

  await deleteUser(testUsername);
});

test('does not register a user with an existing username', async ({ page }) => {
  await page.goto('https://localhost:3000?form=register');

  await page.fill('#registerUsername', testUsername);
  await page.fill('#registerEmail', testEmail);
  await page.fill('#registerPassword', testPassword);
  await page.click('#registerForm button[type="submit"]');

  await expect(page.locator('#registerMessage')).toHaveText('User created successfully', {
    timeout: 10000,
  });

  // Attempt to re-register same credentials
  await page.fill('#registerUsername', testUsername);
  await page.fill('#registerEmail', testEmail);
  await page.fill('#registerPassword', testPassword);
  await page.click('#registerForm button[type="submit"]');

  await expect(page.locator('#registerMessage')).toHaveText('Username or email is already in use', {
    timeout: 10000,
  });

  await deleteUser(testUsername);
});
