import { handleRegister, handleLogin } from './auth/auth.js';
import { toggleForms } from './toggle/toggleForms.js';
import { showLoginView, showRegisterView, showLandingView } from './navigation/navigation.js';
import { setupGameToggle, setupSocketEvents } from './games/gameToggle.js';

document.addEventListener('DOMContentLoaded', () => {
  handleLogin();
  handleRegister();
  toggleForms();

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

/* ANNA START*/
document.addEventListener('DOMContentLoaded', () => {
  const socket = new WebSocket(`wss://${window.location.hostname}/ws/connect`);
  setupSocketEvents(socket);
  setupGameToggle(socket);
});

//Anna TODO add port to frontend websocket
//uncomment cert in index.js
//Added button ids for games in index.html
// Change snake size
// Add scores
//Add practice game
//Why matching takes so long???
//What we do with stop button?
//What we do if user logs out, on err and so on??

/* ANNA END*/
