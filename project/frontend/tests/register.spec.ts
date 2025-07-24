// import { test, expect, Page } from '@playwright/test';
// import { deleteUser } from '../../backend/database/services/userServices.js';
//
// test.setTimeout(60000);
//
// const timestamp = Date.now();
// const testUsername = `testUser-${timestamp}`;
// const testEmail = `testEmail-${timestamp}@example.com`;
// const testPassword = `testPassword-${timestamp}`;
//
// /**
//  * Wait until an element is present and no longer has the `hidden` class.
//  */
// async function waitUntilUnhidden(page: Page, selector: string, timeout = 5000) {
//   await page.waitForLoadState('domcontentloaded');
//   await page.waitForFunction(
//     (sel) => {
//       const el = document.querySelector(sel);
//       return el && !el.classList.contains('hidden');
//     },
//     selector,
//     { timeout },
//   );
// }
//
// async function registerUser(page: Page, username: string, email: string, password: string) {
//   await page.goto('https://localhost:3000?e2e=register');
//   await waitUntilUnhidden(page, '#registerForm');
//
//   await page.fill('#registerUsername', username);
//   await page.fill('#registerEmail', email);
//   await page.fill('#registerPassword', password);
//   await page.click('#registerForm button[type="submit"]');
//
//   await waitUntilUnhidden(page, '#registerMessage');
// }
//
// test.describe('User Registration', () => {
//   test('registers a new user successfully', async ({ page }) => {
//     try {
//       await registerUser(page, testUsername, testEmail, testPassword);
//       await expect(page.locator('#registerMessage')).toHaveText('User created successfully');
//     } finally {
//       await deleteUser(testUsername);
//     }
//   });
//
//   test('does not register a user with an existing username', async ({ page }) => {
//     try {
//       await registerUser(page, testUsername, testEmail, testPassword);
//       await expect(page.locator('#registerMessage')).toHaveText('User created successfully');
//
//       await page.reload({ waitUntil: 'load' });
//       await registerUser(page, testUsername, testEmail, testPassword);
//       await expect(page.locator('#registerMessage')).toHaveText(
//         'Username or email is already in use',
//       );
//     } finally {
//       await deleteUser(testUsername);
//     }
//   });
// });
