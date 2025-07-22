import { test, expect } from '@playwright/test';
import { deleteUser } from '../../backend/database/services/userServices.js';

test('registers a new user successfully', async ({ page }) => {
  await page.goto('https://localhost:3000');

  const testUsername = `testUser-${Date.now()}`;
  const testEmail = `testEmail-${Date.now()}.com`;
  const testPassword = `testPassword-${Date.now()}`;

  // Fill out the form
  await page.fill('#registerUsername', testUsername);
  await page.fill('#registerEmail', testEmail);
  await page.fill('#registerPassword', testPassword);

  // Submit the form
  await page.click('#registerForm button[type="submit"]');

  // Wait for the success message
  const message = page.locator('#registerMessage');
  await expect(message).toHaveText(/User created successfully/i);
  await expect(message).toHaveClass(/text-green-500/);

  // Optional: Screenshot
  await page.screenshot({ path: 'registration-success.png', fullPage: true });

  // Cleanup
  await deleteUser(testUsername);
});
