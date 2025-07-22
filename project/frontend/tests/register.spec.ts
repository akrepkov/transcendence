import { test, expect } from '@playwright/test';
import { deleteUser, getUsers } from '../../backend/database/services/userServices.js';

test('registers a new user successfully', async ({ page }) => {
  const timestamp = Date.now();
  const testUsername = `testUser-${timestamp}`;
  const testEmail = `testEmail-${timestamp}@example.com`;
  const testPassword = `testPassword-${timestamp}`;

  await page.goto('https://localhost:3000');

  await page.fill('#registerUsername', testUsername);
  await page.fill('#registerEmail', testEmail);
  await page.fill('#registerPassword', testPassword);

  await page.click('#registerForm button[type="submit"]');

  const message = page.locator('#registerMessage');
  await expect(message).toHaveText('User created successfully');

  console.log(await getUsers());
  await deleteUser(testUsername);
});
