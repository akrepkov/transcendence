import { test, expect } from '@playwright/test';

test('should register a new user and add as friend', async ({ page }) => {
  // 1. Go to site and register a new user
  await page.goto('https://localhost:3000');
  await page.click('#toggleForm'); // Switch to Register
  await page.waitForSelector('#registerForm');

  const username = `test_${Date.now()}`;
  await page.fill('#registerUsername', username);
  await page.fill('#registerEmail', `${username}@test.com`);
  await page.fill('#registerPassword', 'password123');
  await page.click('#registerForm button[type="submit"]');

  // Wait for landing page after registration
  await page.waitForSelector('body[data-view="landing"]');

  // 2. Logout
  await page.click('#logoutLanding');
  await page.waitForSelector('body[data-view="login"]');

  // 3. Login as existing user
  await page.fill('#loginUsername', 'djoyke');
  await page.fill('#loginPassword', 'djoyke');
  await page.click('#loginForm button[type="submit"]');
  await page.waitForSelector('body[data-view="landing"]');

  // 4. Go to profile
  await page.click('#avatar');
  await page.waitForSelector('body[data-view="profile"]');

  // 5. Add the newly registered user as a friend
  await page.fill('#addFriendInput', username);
  await page.click('#addFriendButton');

  // 6. Wait for friend to appear in list (replace timeout with proper check)
  const friendListItem = page.locator(`#friendsList ul >> text=${username}`);
  await expect(friendListItem).toBeVisible();

  // 7. Click on the friend's name to view their profile
  await friendListItem.scrollIntoViewIfNeeded();
  await friendListItem.click();

  // 8. Verify profile view and correct username in heading
  const profileHeading = page.locator('#profileHeading');
  await expect(profileHeading).toBeVisible();
  await expect(profileHeading).toHaveText(username);
});
