import { test, expect } from '@playwright/test';
import { deleteUser } from '../../backend/database/services/userServices.js';

const timestamp = Date.now();
const testUsername = `testUser-${timestamp}`;
const testEmail = `testEmail-${timestamp}@example.com`;
const testPassword = `testPassword-${timestamp}`;

test('registers a new user successfully', async ({ page }) => {
  await page.goto('https://localhost:3000');

  // Switch to register form
  await page.click('#toggleForm');

  // Wait for register form fields to be visible
  const registerUsername = page.locator('#registerUsername');
  await expect(registerUsername).toBeVisible();

  await registerUsername.fill(testUsername);
  await page.fill('#registerEmail', testEmail);
  await page.fill('#registerPassword', testPassword);

  await page.click('#registerForm button[type="submit"]');

  const message = page.locator('#registerMessage');
  await expect(message).toHaveText('User created successfully');

  await deleteUser(testUsername);
});

test('does not register a user with an existing username', async ({ page }) => {
  await page.goto('https://localhost:3000');

  // Switch to register form
  await page.click('#toggleForm');
  const registerUsername = page.locator('#registerUsername');
  await expect(registerUsername).toBeVisible();

  // First registration
  await registerUsername.fill(testUsername);
  await page.fill('#registerEmail', testEmail);
  await page.fill('#registerPassword', testPassword);
  await page.click('#registerForm button[type="submit"]');

  // Reload page to reset state
  await page.reload();
  await page.click('#toggleForm');
  await expect(registerUsername).toBeVisible();

  // Attempt second registration
  await registerUsername.fill(testUsername);
  await page.fill('#registerEmail', testEmail);
  await page.fill('#registerPassword', testPassword);
  await page.click('#registerForm button[type="submit"]');

  const message = page.locator('#registerMessage');
  await expect(message).toHaveText('Username or email is already in use');

  await deleteUser(testUsername);
});
