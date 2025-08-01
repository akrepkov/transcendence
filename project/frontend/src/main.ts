import { handleLogin, handleRegister } from './auth/auth.js';
import { toggleForms } from './toggle/toggleForms.js';
import { setupGameToggle, setupSocketEvents } from './games/gameToggle.js';
import { setupAiToggle } from './games/ai/aiToggle.js';
import { restoreViewOnReload } from './navigation/navigation.js';
import { initProfileEvents } from './profile/profile.js';
import { initLandingEvents, initBackToLanding } from './landing/landing.js';
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

  //back buttons
  initBackToLanding('stop-button-pong');
  initBackToLanding('stop-button-snake');
  initBackToLanding('stop-button-practice');
  initBackToLanding('stop-button-ai');
});

/* ANNA START*/
document.addEventListener('DOMContentLoaded', () => {
  const socket = new WebSocket(`wss://${window.location.hostname}:3000/ws/connect`);
  console.log('Am I logged IN : ', localStorage.getItem('username'));
  setupSocketEvents(socket);
  setupGameToggle(socket);
  // setupAiToggle();
});

/* ANNA END*/
