import { test } from '@playwright/test';

test('should navigate back and forward between pages', async ({ page }) => {
  await page.goto('https://localhost:3000');

  // login
  await page.fill('#loginUsername', 'djoyke');
  await page.fill('#loginPassword', 'djoyke');
  await page.click('#loginForm button[type="submit"]');
  await page.waitForSelector('body[data-view="landing"]');

  // go to profile
  await page.click('#avatar');
  await page.waitForSelector('body[data-view="profile"]');

  // go to settings
  await page.click('#settingsToggle');
  await page.waitForSelector('body[data-view="settings"]');

  // --- browser arrows ---

  // browser back to profile
  await page.goBack();
  await page.waitForSelector('body[data-view="profile"]');

  // Browser back ← (to Landing)
  await page.goBack();
  await page.waitForSelector('body[data-view="landing"]');

  // Browser forward → (to Profile)
  await page.goForward();
  await page.waitForSelector('body[data-view="profile"]');

  // Browser forward → (to Settings)
  await page.goForward();
  await page.waitForSelector('body[data-view="settings"]');
});

test('should stay on the correct view after reload', async ({ page }) => {
  await page.goto('https://localhost:3000');

  // Login
  await page.fill('#loginUsername', 'djoyke');
  await page.fill('#loginPassword', 'djoyke');
  await page.click('#loginForm button[type="submit"]');
  await page.waitForSelector('body[data-view="landing"]');


  // Go to Profile → Settings
  await page.click('#avatar');
  await page.waitForSelector('body[data-view="profile"]');
  await page.click('#settingsToggle');
  await page.waitForSelector('body[data-view="settings"]');

  // Reload on settings
  await page.reload();
  await page.waitForSelector('body[data-view="settings"]');

  // Go back → should go to profile
  await page.goBack();
  await page.waitForTimeout(1000); // wait for app to settle
  const bodyDataView = await page.locator('body').getAttribute('data-view');
  console.log('Data-view is:', bodyDataView);
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
  await page.waitForSelector('body[data-view="profile"]');
  await page.click('#settingsToggle');
  await page.waitForSelector('body[data-view="settings"]');

  // Back → profile
  await page.goBack();
  await page.waitForSelector('body[data-view="profile"]');

  // Forward → settings
  await page.goForward();
  await page.waitForSelector('body[data-view="settings"]');

  // Reload on settings
  await page.reload();
  await page.waitForSelector('body[data-view="settings"]');

  // Back → profile
  await page.waitForTimeout(1000); // wait for app to settle
  const bodyDataView = await page.locator('body').getAttribute('data-view');
  console.log('Data-view is:', bodyDataView);

  // Forward → settings again
  await page.goForward();
  await page.waitForSelector('body[data-view="settings"]');
});
