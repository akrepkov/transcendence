import { handleRegister, handleLogin } from './auth/auth.js';
import { toggleForms } from './toggle/toggleForms.js';
import {
  showLoginView,
  showRegisterView,
  showLandingView,
  restoreViewOnReload,
  showProfileView,
  checkLoginStatus,
} from './navigation/navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  handleLogin();
  handleRegister();
  toggleForms();
  restoreViewOnReload();

  const formTitle = document.getElementById('formTitle')?.textContent || 'Login';
  const initialState = { view: 'auth', form: formTitle.toLowerCase() };
  history.replaceState(initialState, '', location.pathname);

  // Listen for browser back/forward
  window.addEventListener('popstate', async (event) => {
    const state = event.state;
    if (!state) return;

    const username = await checkLoginStatus();

    if (state.view === 'auth') {
      if (state.form === 'login') showLoginView();
      else if (state.form === 'register') showRegisterView();
    } else if (state.view === 'landing') {
      if (username) {
        showLandingView(username);
      } else {
        history.replaceState({ view: 'auth', form: 'login' }, '', '/login');
        showLoginView();
      }
    } else if (state.view === 'profile') {
      if (username) {
        showProfileView();
      } else {
        history.replaceState({ view: 'auth', form: 'login' }, '', '/login');
        showLoginView();
      }
    }
  });
});
