import { test, expect, Page } from '@playwright/test';

async function loginAndOpenSettings(page: Page) {
  await page.goto('https://localhost:3000');
  await page.fill('#loginUsername', 'djoyke');
  await page.fill('#loginPassword', 'djoyke');
  await page.click('#loginForm button[type="submit"]');
  await page.waitForSelector('body[data-view="landing"]');
  await page.click('#avatar'); // to Profile
  await page.waitForSelector('body[data-view="profile"]');
  await page.click('#settingsToggle'); // to Settings
  await page.waitForSelector('body[data-view="settings"]');
}

// tiny 1x1 PNG for upload
const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9U7Y0iUAAAAASUVORK5CYII=',
  'base64',
);

// ——— USERNAME ———
test('username: success', async ({ page }) => {
  await loginAndOpenSettings(page);

  await page.route('**/api/update_user_profile', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ username: 'new_djoyke' }),
    }),
  );

  await page.fill('#newUsername', 'new_djoyke');
  await page.click('#saveUsername');

  await expect(page.locator('#UsernameSettingsMessage')).toHaveText(
    'Username updated successfully.',
  );
});

test('username: already in use (418) shows alert', async ({ page }) => {
  await loginAndOpenSettings(page);

  await page.route('**/api/update_user_profile', (route) => route.fulfill({ status: 418 }));

  const dialog = new Promise<void>((resolve) => {
    page.once('dialog', (d) => {
      expect(d.message()).toMatch(/already in use/i);
      d.accept();
      resolve();
    });
  });

  await page.fill('#newUsername', 'taken');
  await page.click('#saveUsername');
  await dialog;
});

// ——— PASSWORD ———
test('password: success', async ({ page }) => {
  await loginAndOpenSettings(page);

  await page.route('**/api/update_user_profile', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }),
  );

  await page.fill('#newPassword', 'secret');
  await page.click('#savePassword');

  await expect(page.locator('#PasswordSettingsMessage')).toHaveText(
    'Password updated successfully.',
  );
});

test('password: failure shows message', async ({ page }) => {
  await loginAndOpenSettings(page);

  await page.route('**/api/update_user_profile', (route) => route.fulfill({ status: 500 }));

  await page.fill('#newPassword', 'oops');
  await page.click('#savePassword');

  await expect(page.locator('#PasswordSettingsMessage')).toHaveText('Password change failed.');
});

// ——— AVATAR ———
test('avatar: preview + upload success', async ({ page }) => {
  await loginAndOpenSettings(page);

  await page.setInputFiles('#avatar-input', {
    name: 'a.png',
    mimeType: 'image/png',
    buffer: tinyPng,
  });
  await expect(page.locator('#avatar-preview')).toBeVisible();

  await page.route('**/api/update_user_avatar', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ avatarUrl: '/uploads/avatars/new.png' }),
    }),
  );

  await page.click('#saveAvatar');

  await expect(page.locator('#AvatarSettingsMessage')).toHaveText('Avatar updated successfully.');
  await expect(page.locator('#avatar')).toHaveAttribute('src', '/uploads/avatars/new.png');
  await expect(page.locator('#avatar-profile')).toHaveAttribute('src', '/uploads/avatars/new.png');
});

test('avatar: too big (418) shows alert', async ({ page }) => {
  await loginAndOpenSettings(page);

  await page.setInputFiles('#avatar-input', {
    name: 'big.png',
    mimeType: 'image/png',
    buffer: tinyPng,
  });

  await page.route('**/api/update_user_avatar', (route) => route.fulfill({ status: 418 }));

  const dialog = new Promise<void>((resolve) => {
    page.once('dialog', (d) => {
      expect(d.message()).toMatch(/too big/i);
      d.accept();
      resolve();
    });
  });

  await page.click('#saveAvatar');
  await dialog;
});

test('avatar: generic failure shows message', async ({ page }) => {
  await loginAndOpenSettings(page);

  await page.setInputFiles('#avatar-input', {
    name: 'a.png',
    mimeType: 'image/png',
    buffer: tinyPng,
  });

  await page.route('**/api/update_user_avatar', (route) => route.fulfill({ status: 500 }));

  await page.click('#saveAvatar');

  await expect(page.locator('#AvatarSettingsMessage')).toHaveText('Avatar upload failed.');
});
