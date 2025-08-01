import { test } from '@playwright/test';

test('should navigate back and forward between pages', async ({ page }) => {
  await page.goto('https://localhost:3000');

  // login
  await page.fill('#loginUsername', 'djoyke');
  await page.fill('#loginPassword', 'djoyke');
  await page.click('#loginForm button[type="submit"]');
  await page.waitForSelector('#landingPage', { state: 'visible' });

  // go to profile
  await page.click('#avatar');
  await page.waitForSelector('#profilePage', { state: 'visible' });

  // go to settings
  await page.click('#settingsToggle');
  await page.waitForSelector('#settingsPage', { state: 'visible' });

  // --- browser arrows ---

  // browser back to profile
  // Browser back ← (to Profile)
  await page.goBack();
  await page.waitForSelector('#profilePage', { state: 'visible' });

  // Browser back ← (to Landing)
  await page.goBack();
  await page.waitForSelector('#landingPage', { state: 'visible' });

  // Browser forward → (to Profile)
  await page.goForward();
  await page.waitForSelector('#profilePage', { state: 'visible' });

  // Browser forward → (to Settings)
  await page.goForward();
  await page.waitForSelector('#settingsPage', { state: 'visible' });
});

test('should stay on the correct view after reload', async ({ page }) => {
  await page.goto('https://localhost:3000');

  // Login
  await page.fill('#loginUsername', 'djoyke');
  await page.fill('#loginPassword', 'djoyke');
  await page.click('#loginForm button[type="submit"]');
  await page.waitForSelector('#landingPage', { state: 'visible' });

  // Go to Profile → Settings
  await page.click('#avatar');
  await page.waitForSelector('#profilePage', { state: 'visible' });
  await page.click('#settingsToggle');
  await page.waitForSelector('#settingsPage', { state: 'visible' });

  // Reload on settings
  await page.reload();
  await page.waitForSelector('#settingsPage', { state: 'visible' });

  // Go back → should go to profile
  await page.goBack();
  await page.waitForSelector('#profilePage', { state: 'visible' });
});

test('should handle back, forward, and reload together correctly', async ({ page }) => {
  await page.goto('https://localhost:3000');

  // Login
  await page.fill('#loginUsername', 'djoyke');
  await page.fill('#loginPassword', 'djoyke');
  await page.click('#loginForm button[type="submit"]');
  await page.waitForSelector('#landingPage', { state: 'visible' });

  // Go to Profile → Settings
  await page.click('#avatar');
  await page.waitForSelector('#profilePage', { state: 'visible' });
  await page.click('#settingsToggle');
  await page.waitForSelector('#settingsPage', { state: 'visible' });

  // Back → profile
  await page.goBack();
  await page.waitForSelector('#profilePage', { state: 'visible' });

  // Forward → settings
  await page.goForward();
  await page.waitForSelector('#settingsPage', { state: 'visible' });

  // Reload on settings
  await page.reload();
  await page.waitForSelector('#settingsPage', { state: 'visible' });

  // Back → profile
  await page.goBack();
  await page.waitForSelector('#profilePage', { state: 'visible' });

  // Forward → settings again
  await page.goForward();
  await page.waitForSelector('#settingsPage', { state: 'visible' });
});
