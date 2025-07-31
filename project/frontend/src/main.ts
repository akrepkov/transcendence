import { handleRegister, handleLogin, handleLogout } from './auth/auth.js';
import { toggleForms } from './toggle/toggleForms.js';
import {
  showLoginView,
  showRegisterView,
  showLandingView,
  restoreViewOnReload,
  showProfileView,
} from './navigation/navigation.js';
import { initProfileEvents } from './profile/profile.js';
import { globalSession } from './auth/auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  await handleLogin();
  await handleRegister();
  toggleForms();
  await restoreViewOnReload();
  initProfileEvents();

  // Logout button event
  const logoutButton = document.getElementById('logoutLanding');
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }

  const formTitle = document.getElementById('formTitle')?.textContent || 'Login';
  const initialState = { view: 'auth', form: formTitle.toLowerCase() };
  history.replaceState(initialState, '', location.pathname);

  // Listen for browser back/forward
  window.addEventListener('popstate', async (event) => {
    const state = event.state;
    if (!state) return;

    if (state.view === 'auth') {
      if (state.form === 'login') showLoginView();
      else if (state.form === 'register') showRegisterView();
    } else if (state.view === 'landing') {
      if (globalSession.getLogstatus()) {
        showLandingView();
      } else {
        history.replaceState({ view: 'auth', form: 'login' }, '', '/login');
        showLoginView();
      }
    } else if (state.view === 'profile') {
      if (globalSession.getLogstatus()) {
        showProfileView();
      } else {
        history.replaceState({ view: 'auth', form: 'login' }, '', '/login');
        showLoginView();
      }
    }
  });
});
