import { test, expect } from '@playwright/test';

// Stel Playwright in om HTTPS-fouten te negeren (voor zelfondertekende certificaten).
test.use({
  ignoreHTTPSErrors: true, // Voorkomt SSL-certificaat gerelateerde fouten zoals ERR_CERT_AUTHORITY_INVALID
});

test('tests if homepage has correct title and content', async ({ page }) => {
  // Ga naar de juiste URL van je applicatie
  await page.goto('https://localhost:3000');

  // Controleer of de pagina de juiste titel heeft
  await expect(page).toHaveTitle(/Pong Game/i);
  // Optioneel: Maak een screenshot voor visuele bevestiging
  await page.screenshot({ path: 'homepage-screenshot.png', fullPage: true });
});
