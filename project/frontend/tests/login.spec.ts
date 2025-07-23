// import { test, expect } from '@playwright/test';
//
// test('should log in existing user', async ({ page }) => {
//   await page.goto('https://localhost:3000');
//
//   // Wait for login form to be ready
//   await page.waitForSelector('#loginForm:not(.hidden)', { state: 'attached' });
//   await page.waitForSelector('#loginUsername', { state: 'visible' });
//
//   await page.fill('#loginUsername', 'djoyke');
//   await page.fill('#loginPassword', 'djoyke');
//
//   await page.click('#loginForm button[type="submit"]');
//
//   const message = page.locator('#loginMessage');
//   await expect(message).toHaveText('Logged in successfully');
// });
//
// test('should not log in non-existing user', async ({ page }) => {
//   await page.goto('https://localhost:3000');
//
//   // Wait for login form to be ready
//   await page.waitForSelector('#loginForm:not(.hidden)', { state: 'attached' });
//   await page.waitForSelector('#loginUsername', { state: 'visible' });
//
//   await page.fill('#loginUsername', 'djoy');
//   await page.fill('#loginPassword', 'djoy');
//
//   await page.click('#loginForm button[type="submit"]');
//
//   const message = page.locator('#loginMessage');
//   await expect(message).toHaveText('Invalid credentials');
// });

import { test, expect } from '@playwright/test';

test.setTimeout(60000); // Extend timeout for CI stability

test('should log in existing user', async ({ page }) => {
  await page.goto('https://localhost:3000');

  // Ensure login form is visible
  await page.waitForSelector('#loginForm:not(.hidden)', { state: 'attached' });
  await page.waitForSelector('#loginUsername', { state: 'visible' });

  await page.fill('#loginUsername', 'djoyke');
  await page.fill('#loginPassword', 'djoyke');
  await page.click('#loginForm button[type="submit"]');

  const message = page.locator('#loginMessage');
  await expect(message).toBeVisible({ timeout: 10000 }); // 👈 ensure visible
  await expect(message).toHaveText('Logged in successfully', { timeout: 10000 });
});

test('should not log in non-existing user', async ({ page }) => {
  await page.goto('https://localhost:3000');

  // Ensure login form is visible
  await page.waitForSelector('#loginForm:not(.hidden)', { state: 'attached' });
  await page.waitForSelector('#loginUsername', { state: 'visible' });

  await page.fill('#loginUsername', 'djoy');
  await page.fill('#loginPassword', 'djoy');
  await page.click('#loginForm button[type="submit"]');

  const message = page.locator('#loginMessage');
  await expect(message).toBeVisible({ timeout: 10000 });
  await expect(message).toHaveText('Invalid credentials', { timeout: 10000 });
});
