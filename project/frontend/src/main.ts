import { handleLogin, handleRegister } from './auth/auth.js';
import { toggleForms } from './toggle/toggleForms.js';
import { setupGameToggle, setupSocketEvents } from './games/gameToggle.js';
import { setupAiToggle } from './ai/aiToggle.js';
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
  initBackToLanding('backFromPong');
  initBackToLanding('backFromSnake');
  initBackToLanding('backFromPractice');
});

/* ANNA START*/
document.addEventListener('DOMContentLoaded', () => {
  const socket = new WebSocket(`wss://${window.location.hostname}:3000/ws/connect`);
  console.log('Am I logged IN : ', localStorage.getItem('username'));
  setupSocketEvents(socket);
  setupGameToggle(socket);
  setupAiToggle();
});

/* ANNA END*/
