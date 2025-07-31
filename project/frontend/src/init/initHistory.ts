import {
  showLoginView,
  showRegisterView,
  showLandingView,
  showProfileView,
  showSettingsView,
  showSnakeView,
  showPongView,
  showPracticeView,
} from '../navigation/navigation.js';
import { globalSession } from '../auth/auth.js';

export function initHistoryHandling(): void {
  const formTitle = document.getElementById('formTitle')?.textContent || 'Login';
  const initialState = { view: 'auth', form: formTitle.toLowerCase() };

  if (!history.state) {
    history.replaceState(initialState, '', location.pathname);
  }

  window.addEventListener('popstate', async (event) => {
    const state = event.state;
    if (!state) return;

    const isLoggedIn = globalSession.getLogstatus();

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
        showLoginView();
        setTimeout(() => {
          history.pushState({ view: 'auth', form: 'login' }, '', '/login');
        }, 0);
      }
    } else if (state.view === 'profile') {
      if (isLoggedIn) {
        showProfileView();
      } else {
        showLoginView();
        setTimeout(() => {
          history.pushState({ view: 'auth', form: 'login' }, '', '/login');
        }, 0);
      }
    } else if (state.view === 'settings') {
      if (isLoggedIn) {
        showSettingsView();
      } else {
        showLoginView();
        setTimeout(() => {
          history.pushState({ view: 'auth', form: 'login' }, '', '/login');
        }, 0);
      }
    } else if (state.view === 'pong') {
      if (isLoggedIn) {
        showPongView();
      } else {
        showLoginView();
        setTimeout(() => {
          history.pushState({ view: 'auth', form: 'login' }, '', '/login');
        }, 0);
      }
    } else if (state.view === 'snake') {
      if (isLoggedIn) {
        showSnakeView();
      } else {
        showLoginView();
        setTimeout(() => {
          history.pushState({ view: 'auth', form: 'login' }, '', '/login');
        }, 0);
      }
    } else if (state.view === 'practice') {
      if (isLoggedIn) {
        showPracticeView();
      } else {
        showLoginView();
        setTimeout(() => {
          history.pushState({ view: 'auth', form: 'login' }, '', '/login');
        }, 0);
      }
    }
  });
}
