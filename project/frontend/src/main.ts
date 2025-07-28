import { handleRegister, handleLogin } from './auth/auth.js';
import { toggleForms } from './toggle/toggleForms.js';
import {
  showLoginView,
  showRegisterView,
  showLandingView,
  restoreViewOnReload,
} from './navigation/navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  handleLogin();
  handleRegister();
  toggleForms();

  // restoreViewOnReload();

  // Replace initial history state
  const formTitle = document.getElementById('formTitle')?.textContent || 'Login';
  const initialState = { view: 'auth', form: formTitle.toLowerCase() };
  history.replaceState(initialState, '', location.pathname);

  // Listen for browser back/forward
  window.addEventListener('popstate', (event) => {
    const state = event.state;
    if (!state) return;

    const isLoggedIn = !!localStorage.getItem('username');

    if (state.view === 'auth') {
      if (state.form === 'login') {
        showLoginView();
      } else if (state.form === 'register') {
        showRegisterView();
      }
    } else if (state.view === 'landing') {
      if (isLoggedIn) {
        showLandingView();
      } else {
        // User not logged in, redirect to login
        history.replaceState({ view: 'auth', form: 'login' }, '', '/login');
        showLoginView();
      }
    }
  });
});
