import { test, expect, Page } from '@playwright/test';

const APP_URL = 'https://localhost:3000';

function uniq(prefix: string) {
  const remain = Math.max(1, 10 - prefix.length);
  const id = Math.random()
    .toString(36)
    .slice(2, 2 + remain);
  return `${prefix}${id}`;
}

async function loginAs(page: Page, user = 'djoyke', pass = 'djoyke') {
  await page.goto(APP_URL);
  await page.fill('#loginUsername', user);
  await page.fill('#loginPassword', pass);
  await page.click('#loginForm button[type="submit"]');
  await page.waitForSelector('#landingPage', { state: 'visible' });
}

async function goToProfile(page: Page) {
  await page.click('#avatar');
  await page.waitForSelector('#profilePage', { state: 'visible' });
}

async function registerTempUser(page: Page) {
  const username = uniq('test');
  await page.goto(APP_URL);
  await page.click('#toggleForm'); // switch to register
  await page.waitForSelector('#registerForm', { state: 'visible' });
  await page.fill('#registerUsername', username);
  await page.fill('#registerEmail', `${username}@test.com`);
  await page.fill('#registerPassword', 'password123');
  await page.click('#registerForm button[type="submit"]');
  await page.waitForSelector('#landingPage', { state: 'visible' });
  return username;
}

// Wait until the <li> count stabilizes (handles async population / rerenders)
async function waitForStableCount(list: ReturnType<Page['locator']>, tries = 10, pauseMs = 150) {
  let prev = -1;
  for (let i = 0; i < tries; i++) {
    const cur = await list.count();
    if (cur === prev) return cur;
    prev = cur;
    await pageWait(pauseMs);
  }
  return prev;
}

function pageWait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

test('should register a new user and add as friend', async ({ page }) => {
  // 1) Register a brand-new user (in its own session)
  const newUser = await registerTempUser(page);

  // 2) Logout to auth
  await page.click('#logoutLanding');
  await page.waitForSelector('#authPage', { state: 'visible' });

  // 3) Login as existing user and go to profile
  await loginAs(page);
  await goToProfile(page);

  // 4) Add the newly registered user as a friend
  await page.fill('#addFriendInput', newUser);
  await page.click('#addFriendButton');

  const friendListItem = page.locator(`#friendsList ul >> text=${newUser}`);
  await expect(friendListItem).toBeVisible();

  // 5) Click friend → verify profile heading
  await friendListItem.scrollIntoViewIfNeeded();
  await friendListItem.click();

  const profileHeading = page.locator('#profileHeading');
  await expect(profileHeading).toBeVisible();
  await expect(profileHeading).toHaveText(newUser);
});

test('cannot add the same user twice', async ({ page }) => {
  // 0) Create the user we’re going to add
  const friend = await registerTempUser(page); // ends on #landingPage
  await page.click('#logoutLanding');
  await page.waitForSelector('#authPage', { state: 'visible' });

  // 1) Login as djoyke → profile
  await loginAs(page);
  await goToProfile(page);

  // 2) Add once
  await page.fill('#addFriendInput', friend);
  await page.click('#addFriendButton');

  // Wait for either the list item OR a success message—whichever your UI does
  const friendListItem = page.locator(`#friendsList ul >> text=${friend}`);
  await expect(friendListItem).toBeVisible();

  // 3) Snapshot stable count
  const list = page.locator('#friendsList ul > li');
  const before = await waitForStableCount(list);

  // 4) Try to add again
  await page.fill('#addFriendInput', friend);
  await page.click('#addFriendButton');

  // Error message (tweak text/selector to match your UI)
  await expect(page.locator('#friendMessage')).toContainText(/already.*friend/i);

  // 5) Ensure list size didn’t change
  await expect(list).toHaveCount(before);
});
