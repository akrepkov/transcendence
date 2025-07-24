import { test, expect } from '@playwright/test';

test.describe.serial('Auth Flow', () => {
  test('should log in an existing user', async ({ page }) => {
    await page.goto('https://localhost:3000?e2e=login');

    // Bind handleLogin to the login form's submit event
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

    await page.fill('#loginUsername', 'djoyke');
    await page.fill('#loginPassword', 'djoyke');
    await page.click('#loginForm button[type="submit"]');

    await expect(page.locator('#loginMessage')).toBeVisible();
    await expect(page.locator('#loginMessage')).toHaveText('Logged in successfully');
  });

  test('should not log in a non-existing user', async ({ page }) => {
    await page.goto('https://localhost:3000?e2e=login');

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

    await page.fill('#loginUsername', 'wronguser');
    await page.fill('#loginPassword', 'wrongpass');
    await page.click('#loginForm button[type="submit"]');

    await expect(page.locator('#loginMessage')).toBeVisible();
    await expect(page.locator('#loginMessage')).toHaveText('Invalid credentials');
  });

  test('should register a new user', async ({ page }) => {
    await page.goto('https://localhost:3000?e2e=login');

    // Switch to register form
    await page.click('#toggleForm');

    // Bind handleRegister to the register form's submit event
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

    const username = `test_${Date.now()}`;

    await page.fill('#registerUsername', username);
    await page.fill('#registerEmail', `${username}@test.com`);
    await page.fill('#registerPassword', 'password123');
    await page.click('#registerForm button[type="submit"]');

    await expect(page.locator('#registerMessage')).toBeVisible();
    await expect(page.locator('#registerMessage')).toHaveText('User registered successfully');
  });
});

