import { test, expect, Page } from '@playwright/test';

type Mode = 'pong' | 'snake' | 'practice' | 'ai';

const MODES: Record<
  Mode,
  {
    button: string;
    pageId: string;
    path: string;
    dataView: string;
    // explicit back buttons (overlay and in-game)
    overlayBack?: string;
    inGameBack?: string;
  }
> = {
  pong: {
    button: '#pongButton',
    pageId: '#pongPage',
    path: '/pong',
    dataView: 'pong',
    overlayBack: '#backFromPong',
    inGameBack: '#stop-button-pong',
  },
  snake: {
    button: '#snakeButton',
    pageId: '#snakePage',
    path: '/snake',
    dataView: 'snake',
    overlayBack: '#backFromSnake',
    inGameBack: '#stop-button-snake',
  },
  practice: {
    button: '#practiceButton',
    pageId: '#practicePage',
    path: '/practice',
    dataView: 'practice',
    overlayBack: '#backFromPractice',
    inGameBack: '#stop-button-practice',
  },
  ai: {
    button: '#aiButton',
    pageId: '#aiPage',
    path: '/ai',
    dataView: 'ai',
    overlayBack: '#backFromAi',
    inGameBack: '#stop-button-ai',
  },
};

async function expectView(page: Page, view: string) {
  await expect(page.locator(`body[data-view="${view}"]`)).toBeVisible();
}

async function openMode(page: Page, mode: Mode) {
  const { button, pageId, path, dataView } = MODES[mode];
  await page.click(button);
  await expect(page.locator(pageId)).toBeVisible();
  await expectView(page, dataView);
  await expect(page).toHaveURL(new RegExp(`${path}$`));
}

async function clickBackInCurrentPage(page: Page, mode: Mode) {
  const { pageId, overlayBack, inGameBack } = MODES[mode];

  // Prefer a visible back button scoped to the current page
  const visibleScoped = page.locator(`${pageId} .back-button:visible`).first();
  if (await visibleScoped.isVisible()) {
    await visibleScoped.click();
    return;
  }

  // Fallback to explicit ids (overlay first, then in-game)
  if (overlayBack && (await page.locator(`${overlayBack}:visible`).isVisible())) {
    await page.click(overlayBack);
    return;
  }
  if (inGameBack && (await page.locator(`${inGameBack}:visible`).isVisible())) {
    await page.click(inGameBack);
    return;
  }

  // Last resort: wait for *any* visible back button inside the page, then click
  await page.locator(`${pageId} .back-button`).first().waitFor({ state: 'visible' });
  await page.locator(`${pageId} .back-button:visible`).first().click();
}

test('register and verify navigation for Pong/Snake/Practice/AI (arrows + Back button)', async ({
  page,
}) => {
  // 1) Register
  await page.goto('https://localhost:3000');
  await page.click('#toggleForm');
  await page.waitForSelector('#registerForm');

  const username = `nav_${Date.now()}`;
  await page.fill('#registerUsername', username);
  await page.fill('#registerEmail', `${username}@test.com`);
  await page.fill('#registerPassword', 'password123');
  await page.click('#registerForm button[type="submit"]');

  // 2) On landing
  await expectView(page, 'landing');
  await expect(page.locator('#landingPage')).toBeVisible();
  await expect(page).toHaveURL(/\/landing$/);

  // Back/forward + Back button loop
  for (const mode of Object.keys(MODES) as Mode[]) {
    await openMode(page, mode);

    // Browser back -> landing
    await page.goBack();
    await expectView(page, 'landing');
    await expect(page).toHaveURL(/\/landing$/);

    // Forward -> mode again
    await page.goForward();
    await expectView(page, MODES[mode].dataView);
    await expect(page.locator(MODES[mode].pageId)).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`${MODES[mode].path}$`));

    // Click visible Back button in that page (scoped!)
    await clickBackInCurrentPage(page, mode);
    await expectView(page, 'landing');
    await expect(page).toHaveURL(/\/landing$/);
  }

  // Quick second pass using only the Back button
  for (const mode of Object.keys(MODES) as Mode[]) {
    await openMode(page, mode);
    await clickBackInCurrentPage(page, mode);
    await expectView(page, 'landing');
  }
});
