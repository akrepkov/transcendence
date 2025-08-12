// tests/settings.simple.spec.ts
import { test, expect, Page } from '@playwright/test';

async function loginAndOpenSettings(page: Page) {
  await page.goto('https://localhost:3000');
  await page.fill('#loginUsername', 'djoyke');
  await page.fill('#loginPassword', 'djoyke');
  await page.click('#loginForm button[type="submit"]');
  await page.waitForSelector('body[data-view="landing"]');

  // Profile → Settings
  await page.click('#avatar');
  await page.waitForSelector('body[data-view="profile"]');
  await page.click('#settingsToggle');
  await page.waitForSelector('body[data-view="settings"]');
}

// tiny 1x1 PNG for upload tests
const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9U7Y0iUAAAAASUVORK5CYII=',
  'base64',
);

// -------- USERNAME --------
test('username: success shows success message', async ({ page }) => {
  await loginAndOpenSettings(page);

  await page.route('**/api/update_user_profile', async (route) => {
    const body = await route.request().postDataJSON();
    if ('username' in body) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ username: body.username }),
      });
      return;
    }
    await route.fallback();
  });

  await page.fill('#newUsername', 'new_djoyke');
  await page.click('#saveUsername');

  await expect(page.locator('#UsernameSettingsMessage')).toHaveText(
    'Username updated successfully.',
  );
});

test('username: 418 shows inline "already in use" message', async ({ page }) => {
  await loginAndOpenSettings(page);

  await page.route('**/api/update_user_profile', async (route) => {
    const body = await route.request().postDataJSON();
    if ('username' in body) {
      await route.fulfill({ status: 418 });
      return;
    }
    await route.fallback();
  });

  await page.fill('#newUsername', 'taken');
  await page.click('#saveUsername');

  await expect(page.locator('#UsernameSettingsMessage')).toHaveText(
    'Username is already in use, try another one.',
  );
});

test('username: generic failure shows inline error', async ({ page }) => {
  await loginAndOpenSettings(page);

  await page.route('**/api/update_user_profile', async (route) => {
    const body = await route.request().postDataJSON();
    if ('username' in body) {
      await route.fulfill({ status: 500 });
      return;
    }
    await route.fallback();
  });

  await page.fill('#newUsername', 'x');
  await page.click('#saveUsername');

  await expect(page.locator('#UsernameSettingsMessage')).toHaveText('Username change failed');
});

// -------- PASSWORD --------
test('password: success shows success message', async ({ page }) => {
  await loginAndOpenSettings(page);

  await page.route('**/api/update_user_profile', async (route) => {
    const body = await route.request().postDataJSON();
    if ('password' in body) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      return;
    }
    await route.fallback();
  });

  await page.fill('#newPassword', 'supersecret');
  await page.click('#savePassword');

  await expect(page.locator('#PasswordSettingsMessage')).toHaveText(
    'Password updated successfully.',
  );
});

test('password: failure shows inline error', async ({ page }) => {
  await loginAndOpenSettings(page);

  await page.route('**/api/update_user_profile', async (route) => {
    const body = await route.request().postDataJSON();
    if ('password' in body) {
      await route.fulfill({ status: 500 });
      return;
    }
    await route.fallback();
  });

  await page.fill('#newPassword', 'oops');
  await page.click('#savePassword');

  await expect(page.locator('#PasswordSettingsMessage')).toHaveText('Password change failed.');
});

// -------- AVATAR --------
test('avatar: preview shows and upload success updates messages & avatars', async ({ page }) => {
  await loginAndOpenSettings(page);

  // preview
  await page.setInputFiles('#avatar-input', {
    name: 'tiny.png',
    mimeType: 'image/png',
    buffer: tinyPng,
  });
  await expect(page.locator('#avatar-preview')).toBeVisible();

  // upload success
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

test('avatar: 418 shows inline "too big" message', async ({ page }) => {
  await loginAndOpenSettings(page);

  await page.setInputFiles('#avatar-input', {
    name: 'huge.png',
    mimeType: 'image/png',
    buffer: tinyPng,
  });

  await page.route('**/api/update_user_avatar', (route) => route.fulfill({ status: 418 }));

  await page.click('#saveAvatar');

  await expect(page.locator('#AvatarSettingsMessage')).toHaveText(
    'Image is too big, try uploading something up to 1MB.',
  );
});

test('avatar: generic failure shows inline error', async ({ page }) => {
  await loginAndOpenSettings(page);

  await page.setInputFiles('#avatar-input', {
    name: 'tiny.png',
    mimeType: 'image/png',
    buffer: tinyPng,
  });

  await page.route('**/api/update_user_avatar', (route) => route.fulfill({ status: 500 }));

  await page.click('#saveAvatar');

  await expect(page.locator('#AvatarSettingsMessage')).toHaveText('Avatar upload failed.');
});
