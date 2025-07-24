import { test, expect } from '@playwright/test';
import { deleteUser } from '../../backend/database/services/userServices.js';

const username = `test_${Date.now()}`;

test.describe.serial('Auth Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://localhost:3000');
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  const injectLoginHandler = async (page) => {
    await page.addScriptTag({
      content: `
        import('/dist/main.js').then(mod => {
          const form = document.querySelector('#loginForm');
          if (form) {
            form.addEventListener('submit', async function(e) {
              e.preventDefault();
              await mod.handleLogin();
            });
          }
        });
      `,
      type: 'module',
    });
  };

  const injectRegisterHandler = async (page) => {
    await page.addScriptTag({
      content: `
        import('/dist/main.js').then(mod => {
          const form = document.querySelector('#registerForm');
          if (form) {
            form.addEventListener('submit', async function(e) {
              e.preventDefault();
              await mod.handleRegister();
            });
          }
        });
      `,
      type: 'module',
    });
  };

  test('should log in an existing user', async ({ page }) => {
    await injectLoginHandler(page);

    await page.fill('#loginUsername', 'djoyke');
    await page.fill('#loginPassword', 'djoyke');
    await page.click('#loginForm button[type="submit"]');

    await page.waitForFunction(() => {
      const el = document.querySelector('#loginMessage');
      return el && !el.classList.contains('hidden');
    });

    await expect(page.locator('#loginMessage')).toBeVisible();
    await expect(page.locator('#loginMessage')).toHaveText('Logged in successfully');
  });

  test('should not log in a non-existing user', async ({ page }) => {
    await injectLoginHandler(page);

    await page.fill('#loginUsername', 'wronguser');
    await page.fill('#loginPassword', 'wrongpass');
    await page.click('#loginForm button[type="submit"]');

    await page.waitForFunction(() => {
      const el = document.querySelector('#loginMessage');
      return el && !el.classList.contains('hidden');
    });

    await expect(page.locator('#loginMessage')).toBeVisible();
    await expect(page.locator('#loginMessage')).toHaveText('Invalid credentials');
  });

  test('should register a new user', async ({ page }) => {
    await page.click('#toggleForm');
    await injectRegisterHandler(page);

    await page.fill('#registerUsername', username);
    await page.fill('#registerEmail', `${username}@test.com`);
    await page.fill('#registerPassword', 'password123');
    await page.click('#registerForm button[type="submit"]');

    await page.waitForFunction(() => {
      const el = document.querySelector('#registerMessage');
      return el && el.textContent?.trim().length > 0;
    });

    await expect(page.locator('#registerMessage')).toBeVisible();
    await expect(page.locator('#registerMessage')).toHaveText('User registered successfully');
  });

  test('should not register an existing user', async ({ page }) => {
    await page.click('#toggleForm');
    await injectRegisterHandler(page);

    await page.fill('#registerUsername', username);
    await page.fill('#registerEmail', `${username}@test.com`);
    await page.fill('#registerPassword', 'password123');
    await page.click('#registerForm button[type="submit"]');

    await page.waitForFunction(() => {
      const el = document.querySelector('#registerMessage');
      return el && el.textContent?.trim().length > 0;
    });

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
