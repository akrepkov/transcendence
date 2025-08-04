import { handleLogin, handleRegister } from './auth/auth.js';
import { toggleForms } from './toggle/toggleForms.js';
import { setupGameToggle, setupSocketEvents } from './games/gameToggle.js';
import { restoreViewOnReload } from './navigation/navigation.js';
import { initProfileEvents } from './profile/profile.js';
import { initLandingEvents, initBackToLanding } from './landing/landing.js';
import { initMainEvents } from './init/initMainEvents.js';
import { initHistoryHandling } from './init/initHistory.js';
// import { languageSwitcherFunction } from './translations/languageManager.js';
import { initCreditsNavigation } from './init/initCredits.js';

document.addEventListener('DOMContentLoaded', async () => {
  // languageSwitcherFunction();
  await handleLogin();
  await handleRegister();
  toggleForms();

  await restoreViewOnReload();

  initLandingEvents();
  initProfileEvents();
  initMainEvents();
  initHistoryHandling();
  initCreditsNavigation();

  //back buttons
  initBackToLanding('stop-button-pong');
  initBackToLanding('stop-button-snake');
  initBackToLanding('stop-button-practice');
  initBackToLanding('stop-button-ai');
});
