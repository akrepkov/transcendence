// import { test, expect, Page } from '@playwright/test';
//
// test.setTimeout(60000);
//
// const EXISTING_USER = {
//   username: 'djoyke',
//   password: 'djoyke',
//   successMessage: 'Logged in successfully',
// };
//
// const NON_EXISTING_USER = {
//   username: 'djoy',
//   password: 'djoy',
//   errorMessage: 'Invalid credentials',
// };
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
// async function performLogin(page: Page, username: string, password: string) {
//   await page.goto('https://localhost:3000?e2e=login');
//   await waitUntilUnhidden(page, '#loginForm');
//
//   await page.fill('#loginUsername', username);
//   await page.fill('#loginPassword', password);
//   await page.click('#loginForm button[type="submit"]');
//
//   await waitUntilUnhidden(page, '#loginMessage');
// }
//
// test.describe('Login Flow', () => {
//   test('should log in existing user', async ({ page }) => {
//     await performLogin(page, EXISTING_USER.username, EXISTING_USER.password);
//     await expect(page.locator('#loginMessage')).toHaveText(EXISTING_USER.successMessage);
//   });
//
//   test('should not log in non-existing user', async ({ page }) => {
//     await performLogin(page, NON_EXISTING_USER.username, NON_EXISTING_USER.password);
//     await expect(page.locator('#loginMessage')).toHaveText(NON_EXISTING_USER.errorMessage);
//   });
// });
