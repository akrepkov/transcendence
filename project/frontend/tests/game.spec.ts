import { test, expect } from '@playwright/test';

async function loginToLanding(page) {
  await page.goto('https://localhost:3000');
  await page.fill('#loginUsername', 'djoyke');
  await page.fill('#loginPassword', 'djoyke');
  await page.click('#loginForm button[type="submit"]');
  await page.waitForSelector('body[data-view="landing"]');
}

async function openGame(page, buttonId: string, view: 'pong' | 'snake' | 'practice' | 'ai') {
  await page.click(`#${buttonId}`);
  await page.waitForSelector(`body[data-view="${view}"]`);
}

test('Pong instructions appear', async ({ page }) => {
  await loginToLanding(page);
  await openGame(page, 'pongButton', 'pong');
  // wait until the instructions element is not hidden
  await page.waitForSelector('#instructionsPong:not(.hidden)');
  await expect(page.locator('#instructionsPong')).toBeVisible();
});

test('Snake instructions appear', async ({ page }) => {
  await loginToLanding(page);
  await openGame(page, 'snakeButton', 'snake');
  await page.waitForSelector('#instructionsSnake:not(.hidden)');
  await expect(page.locator('#instructionsSnake')).toBeVisible();
});

test('Practice instructions appear', async ({ page }) => {
  await loginToLanding(page);
  await openGame(page, 'practiceButton', 'practice');
  await page.waitForSelector('#instructionsPractice:not(.hidden)');
  await expect(page.locator('#instructionsPractice')).toBeVisible();
});

test('AI instructions appear', async ({ page }) => {
  await loginToLanding(page);
  await openGame(page, 'aiButton', 'ai');
  await page.waitForSelector('#instructionsAi:not(.hidden)');
  await expect(page.locator('#instructionsAi')).toBeVisible();
});
