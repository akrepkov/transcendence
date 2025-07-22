import { test, expect } from '@playwright/test';
import { deleteUser } from '../../backend/database/services/userServices.js';

const timestamp = Date.now();
const testUsername = `testUser-${timestamp}`;
const testEmail = `testEmail-${timestamp}@example.com`;
const testPassword = `testPassword-${timestamp}`;

test('registers a new user successfully', async ({ page }) => {
  await page.goto('https://localhost:3000');

  await page.fill('#registerUsername', testUsername);
  await page.fill('#registerEmail', testEmail);
  await page.fill('#registerPassword', testPassword);

  await page.click('#registerForm button[type="submit"]');

  const message = page.locator('#registerMessage');
  await expect(message).toHaveText('User created successfully');

  await deleteUser(testUsername);
});

test('does not register a user with an existing username', async ({ page }) => {
  // Create user first
  await page.goto('https://localhost:3000');

  await page.fill('#registerUsername', testUsername);
  await page.fill('#registerEmail', testEmail);
  await page.fill('#registerPassword', testPassword);
  await page.click('#registerForm button[type="submit"]');

  // Reload to reset form state
  await page.reload();

  // Attempt to register again with same credentials
  await page.fill('#registerUsername', testUsername);
  await page.fill('#registerEmail', testEmail);
  await page.fill('#registerPassword', testPassword);
  await page.click('#registerForm button[type="submit"]');

  const message = page.locator('#registerMessage');
  await expect(message).toHaveText('Username or email is already in use');

  // Clean up once
  await deleteUser(testUsername);
});
