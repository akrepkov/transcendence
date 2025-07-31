import { handleLogin, handleRegister } from './auth/auth.js';
import { toggleForms } from './toggle/toggleForms.js';
import { restoreViewOnReload } from './navigation/navigation.js';
import { initProfileEvents } from './profile/profile.js';
import { initLandingEvents } from './landing/landing.js';
import { initMainEvents } from './init/initMainEvents.js';
import { initHistoryHandling } from './init/initHistory.js';

document.addEventListener('DOMContentLoaded', async () => {
  await handleLogin();
  await handleRegister();
  toggleForms();
  await restoreViewOnReload();
  initLandingEvents();
  initProfileEvents();
  initMainEvents();
  initHistoryHandling();
});
