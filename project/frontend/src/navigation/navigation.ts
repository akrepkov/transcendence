import { globalSession, checkLoginStatus } from '../auth/auth.js';
import {
  showFriends,
  fetchUserProfile,
  showGameStats,
  showGameHistory,
} from '../profile/profile.js';
import {
  hideAllPages,
  setView,
  toggleOwnProfileButtons,
  showInstructions,
} from '../utils/uiHelpers.js';
import { initTournamentPlayers } from '../games/tournament.js';

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const formTitle = document.getElementById('formTitle');
const toggle = document.getElementById('toggleForm');
const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');
const authPage = document.getElementById('authPage');
const landingPage = document.getElementById('landingPage');
const profilePage = document.getElementById('profilePage');
const creditPage = document.getElementById('creditPage');
const tourPage = document.getElementById('tourPage');

/**
 * Displays the login form view.
 *
 * - Hides the registration form and shows the login form.
 * - Updates form title and toggle text.
 * - Shows login message, sets current view to 'login', and updates visible page to auth.
 */
export function showLoginView() {
  if (!loginForm || !registerForm || !formTitle || !toggle || !loginMessage || !registerMessage)
    return;

  hideAllPages();

  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
  formTitle.textContent = 'Login';
  toggle.textContent = 'No account? Register';

  loginMessage.classList.remove('hidden');
  setView('login'); //new
  authPage?.classList.remove('hidden');
  landingPage?.classList.add('hidden');
  profilePage?.classList.add('hidden');
  creditPage?.classList.add('hidden');
  tourPage?.classList.add('hidden');
}

/**
 * Displays the registration form view.
 *
 * - Hides the login form and shows the registration form.
 * - Updates form title and toggle text.
 * - Shows registration message, sets current view to 'register', and updates visible page to auth.
 */
export function showRegisterView() {
  if (!loginForm || !registerForm || !formTitle || !toggle || !loginMessage || !registerMessage)
    return;

  hideAllPages();

  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
  formTitle.textContent = 'Register';
  toggle.textContent = 'Already have an account? Login';

  loginMessage.classList.add('hidden');
  registerMessage.classList.remove('hidden');
  setView('register'); //new
  authPage?.classList.remove('hidden');
  landingPage?.classList.add('hidden');
  profilePage?.classList.add('hidden');
  creditPage?.classList.add('hidden');
  creditPage?.classList.add('hidden');
}

/**
 * Displays the landing page view for a logged-in user.
 *
 * - Updates username and avatar from the global session.
 * - Hides all other pages and shows the landing page.
 * - Sets the current view to 'landing'.
 */
export function showLandingView() {
  if (!authPage || !landingPage) {
    console.warn('Missing authPage or landingPage');
    return;
  }

  const usernameElement = document.getElementById('username');
  if (usernameElement) {
    usernameElement.textContent = globalSession.getUsername();
  }

  const avatarProfile = document.getElementById('avatar') as HTMLImageElement;
  if (avatarProfile) {
    avatarProfile.src = globalSession.getAvatar();
  }

  hideAllPages();
  landingPage.classList.remove('hidden');
  setView('landing');
}

/**
 * Restores the appropriate application view on page reload or direct URL access.
 *
 * - Checks if the user is logged in via the backend session.
 * - Parses the current URL path and query parameters.
 * - Matches the path to a predefined view and invokes its corresponding render function.
 * - Supports friend profiles via the `?username=...` query param on `/profile`.
 * - Handles authenticated and unauthenticated routes accordingly.
 * - If no matching view is found, defaults to landing (if logged in) or login (if not).
 * - Pushes or replaces browser history state if it's not already set.
 */
export async function restoreViewOnReload() {
  await checkLoginStatus();

  const url = new URL(window.location.href);
  const path = url.pathname;
  const usernameParam = url.searchParams.get('username');
  const isLoggedIn = globalSession.getLogstatus();

  const views: Record<string, () => void> = {
    '/login': showLoginView,
    '/register': showRegisterView,
    '/landing': showLandingView,
    '/profile': () => showProfileView(usernameParam || undefined), // support friend profiles
    '/settings': showSettingsView,
    '/pong': showPongView,
    '/snake': showSnakeView,
    '/practice': showPracticeView,
    '/credits': showCreditView,
    '/ai': showAiView,
    '/tournament': showTourView,
  };

  const viewFunc = views[path];

  const isAuthPage = path === '/login' || path === '/register';

  if (!viewFunc) {
    if (isLoggedIn) {
      navigateTo('landing', '/landing', showLandingView);
    } else {
      history.replaceState({ view: 'auth', form: 'login' }, '', '/login');
      showLoginView();
    }
    return;
  }

  if (isLoggedIn || isAuthPage) {
    viewFunc();

    // Push correct history state if missing
    if (!history.state) {
      const state = isAuthPage
        ? { view: 'auth', form: path === '/register' ? 'register' : 'login' }
        : path === '/profile' && usernameParam
          ? { view: 'profile', username: usernameParam }
          : { view: path.slice(1) };

      history.replaceState(state, '', url.pathname + url.search);
    }
  } else {
    history.replaceState({ view: 'auth', form: 'login' }, '', '/login');
    showLoginView();
  }
}

/**
 * Displays the profile page for a specified user or the currently logged-in user.
 *
 * - Fetches user profile data and friends list.
 * - Updates the profile heading and avatar.
 * - Toggles visibility of profile-related buttons based on whether the viewed profile is the user's own.
 *
 * @param {string} [username] - Optional username to show profile for. Defaults to the logged-in user.
 */
export async function showProfileView(username?: string) {
  hideAllPages();

  const providedUsername = username || globalSession.getUsername();
  try {
    document.getElementById('profilePage')?.classList.remove('hidden');

    const jsonResult = await fetchUserProfile(providedUsername);
    const heading = document.getElementById('profileHeading');
    if (heading) {
      heading.textContent = jsonResult.username;
    }

    const avatarProfile = document.getElementById('avatar-profile') as HTMLImageElement;
    if (avatarProfile) {
      if (jsonResult.avatar === null) {
        console.log('avatar is null');
        avatarProfile.src = '/uploads/avatars/wow_cat.jpg'; //TODO remove after backend database fix
      } else {
        avatarProfile.src = jsonResult.avatar;
      }
    }
    await showFriends(providedUsername);
    await showGameStats(providedUsername);
    await showGameHistory(providedUsername);

    const isOwnProfile = providedUsername === globalSession.getUsername();
    toggleOwnProfileButtons(isOwnProfile);

    profilePage?.classList.remove('hidden');
    setView('profile');
  } catch (err) {
    console.error('Error loading profile:', err);
    return;
  }
}

/**
 * Displays the settings page.
 *
 * - Hides all other views and shows the settings page.
 * - Sets the current view to 'settings'.
 */
export function showSettingsView() {
  hideAllPages();
  document.getElementById('settingsPage')?.classList.remove('hidden');
  setView('settings');
}

/**
 * Displays the Pong game page.
 *
 * - Hides all other views and shows the Pong page.
 * - Sets the current view to 'pong'.
 */
export function showPongView() {
  hideAllPages();
  document.getElementById('pongPage')?.classList.remove('hidden');
  setView('pong');
  showInstructions('pong');
}

/**
 * Displays the Snake game page.
 *
 * - Hides all other views and shows the Snake page.
 * - Sets the current view to 'snake'.
 */
export function showSnakeView() {
  hideAllPages();
  document.getElementById('snakePage')?.classList.remove('hidden');
  setView('snake');
  showInstructions('snake');
}

/**
 * Displays the Practice page.
 *
 * - Hides all other views and shows the Practice page.
 * - Sets the current view to 'practice'.
 */
export function showPracticeView() {
  hideAllPages();
  document.getElementById('practicePage')?.classList.remove('hidden');
  setView('practice');
  showInstructions('practice');
}

/**
 * Displays the Credits page.
 *
 * - Hides all other views and shows the Credits page.
 * - Sets the current view to 'credits'.
 */
export function showCreditView() {
  hideAllPages();
  document.getElementById('creditPage')?.classList.remove('hidden');
  setView('credits');
}

/**
 * Displays the Tournament page.
 *
 * - Hides all other views and shows the Tournament page.
 * - Does not explicitly set a view (optionally could add setView('Tour')).
 */
export function showTourView() {
  hideAllPages();
  document.getElementById('tourPage')?.classList.remove('hidden');
  initTournamentPlayers();
  setView('tournament');
  showInstructions('tour');
}

/**
 * Displays the AI page.
 *
 * - Hides all other views and shows the AI page.
 * - Does not explicitly set a view (optionally could add setView('ai')).
 */
export function showAiView() {
  hideAllPages();
  document.getElementById('aiPage')?.classList.remove('hidden');
  setView('ai');
  showInstructions('ai');
}

/**
 * Navigates to a new application view and updates the browser history.
 *
 * - Pushes a new state to the browser's history stack if it differs from the current one.
 * - Updates the URL using `history.pushState`.
 * - Calls the provided `showView` function to render the corresponding view.
 * - Avoids redundant state pushes by comparing the new and current state.
 *
 * @param {string} view - A unique identifier for the target view (e.g., 'profile', 'settings').
 * @param {string} url - The URL to reflect in the browser's address bar (should match the view).
 * @param {() => void} showView - A callback that renders the target view.
 * @param {Record<string, any>} [extraState={}] - Optional additional state to include in history (e.g., username).
 */
export function navigateTo(
  view: string,
  url: string,
  showView: () => void,
  extraState: Record<string, any> = {},
): void {
  const currentState = history.state;

  const newState = { view, ...extraState };

  // Prevent duplicate state pushes
  if (!currentState || JSON.stringify(currentState) !== JSON.stringify(newState)) {
    history.pushState(newState, '', url);
  }

  showView();
}
