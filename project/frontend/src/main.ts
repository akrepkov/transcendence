import { handleLogin, handleRegister } from './auth/auth.js';
import { toggleForms } from './toggle/toggleForms.js';
// import { setupGameToggle, setupSocketEvents } from './games/gameToggle.js';
import { restoreViewOnReload } from './navigation/navigation.js';
import { initProfileEvents } from './profile/profile.js';
import { initLandingEvents, initBackToLanding } from './landing/landing.js';
import { initMainEvents } from './init/initMainEvents.js';
import { initHistoryHandling } from './init/initHistory.js';
import { languageSwitcherFunction } from './translations/languageManager.js';
import { initCreditsNavigation } from './init/initCredits.js';
import { initSettingsEvents } from './settings/settings.js';
import { mountCustomLanguageDropdown } from './utils/uiHelpers.js';

/**
 * Initializes the application after the DOM is fully loaded.
 *
 * - Sets up authentication (login & register forms)
 * - Handles toggle between login and register views
 * - Restores the appropriate view on page refresh
 * - Initializes event listeners and UI behaviors for:
 *   - Landing page
 *   - Profile page
 *   - Game views
 *   - History handling (browser navigation)
 *   - Credits navigation
 * - Sets up back buttons for exiting mini-games and AI view
 */
document.addEventListener('DOMContentLoaded', async () => {
  languageSwitcherFunction();
  mountCustomLanguageDropdown();
  await handleLogin();
  await handleRegister();
  toggleForms();

  await restoreViewOnReload();

  initLandingEvents();
  initProfileEvents();
  initMainEvents();
  initSettingsEvents();
  initHistoryHandling();
  initCreditsNavigation();

  initBackToLanding();
});
