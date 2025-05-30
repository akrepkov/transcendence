import playwright from 'playwright'; // web scraping

//To run it:
//First run the project, after that: node playwright.js

// 	page.$(selector)
// Selects a single element (the first one that matches).
// Returns a LocatorHandle (like a reference to that element).
// If no element is found, it returns null.
// 	page.$$(selector)
// Selects all elements that match the selector.
// Returns an array of element handles.
// Useful when you want to loop over elements (like all <li> items).

const NUM_CLIENTS = 4;
const URL = 'https://localhost:3000/'; // Replace with your actual dev URL

async function inviteClient(inviter, opponent) {
  const playersList = await inviter.page.$$('#playerList li');
  for (const li of playersList) {
    const text = await li.textContent();
    if (text.includes(opponent.playerId)) {
      const playBtn = await li.$('button');
      await playBtn.click();
    }
  }
}

(async () => {
  const browser = await playwright.chromium.launch({
    headless: false,
    slowMo: 200,
  });
  const clients = [];
  for (let i = 0; i < NUM_CLIENTS; i++) {
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
    });
    const page = await context.newPage();

    const alreadyLoggedIn = await page.$('#logoutBtn');
    if (!alreadyLoggedIn) {
      await page.goto(URL);
      await page.fill('#emailInput', '1');
      await page.fill('#passwordInput', '1');
      await page.click('#flipToProfileBtnLog');
    }
    await page.goto('https://localhost:3000/#remote');
    // Get the page title
    const title = await page.title();
    console.log('Page title:', title);
    await page.waitForSelector('#waitingRoom:not(.hidden)');
    clients.push({
      context,
      page,
      playerId: i + 1,
    });
  }
  await new Promise((r) => setTimeout(r, 2000));
  await inviteClient(clients[0], clients[1]);
  await clients[1].page.click('#acceptInvite');
  await inviteClient(clients[2], clients[3]);
  await clients[3].page.click('#acceptInvite');

  await new Promise((resolve) => setTimeout(resolve, 10000));
  await browser.close();
})();
