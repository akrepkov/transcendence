import { globalSession, checkLoginStatus } from '../auth/auth.js';
import { showFriends, fetchUserProfile, showGameStats } from '../profile/profile.js';
import { hideAllPages, setView, toggleOwnProfileButtons } from '../utils/uiHelpers.js';

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
 * Restores the appropriate view on page reload or direct access via URL.
 *
 * - Checks login status via the backend.
 * - Matches the current path to a registered view.
 * - If logged in or on an auth page, loads the appropriate view.
 * - Otherwise, redirects to the login page.
 */
export async function restoreViewOnReload() {
  await checkLoginStatus();

  const path = window.location.pathname;
  const isLoggedIn = globalSession.getLogstatus();

  const views: Record<string, () => void> = {
    '/login': showLoginView,
    '/register': showRegisterView,
    '/landing': showLandingView,
    '/profile': showProfileView,
    '/settings': showSettingsView,
    '/pong': showPongView,
    '/snake': showSnakeView,
    '/practice': showPracticeView,
    '/credits': showCreditView,
    '/ai': showAiView, // is this the path?
  };

  const viewFunc = views[path];

  if (!viewFunc) {
    if (isLoggedIn) {
      navigateTo('landing', '/landing', showLandingView);
      return;
    } else {
      // Unknown path — redirect to login
      history.replaceState({ view: 'auth', form: 'login' }, '', '/login');
      showLoginView();
      return;
    }
  }

  const isAuthPage = path === '/login' || path === '/register';

  if (isLoggedIn || isAuthPage) {
    viewFunc();

    // Only set history if there's no state (i.e. refresh or direct entry)
    if (!history.state) {
      const state = isAuthPage
        ? { view: 'auth', form: path === '/register' ? 'register' : 'login' }
        : { view: path.slice(1) };

      history.pushState(state, '', path);
    }
  } else {
    // Not logged in — go to login page
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
        avatarProfile.src = '/uploads/avatars/wow_cat.jpg'; //TODO remove after backend database fix
      } else {
        avatarProfile.src = jsonResult.avatar;
      }
    }
    await showFriends(providedUsername);
    await showGameStats(providedUsername);

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
 * Displays the AI page.
 *
 * - Hides all other views and shows the AI page.
 * - Does not explicitly set a view (optionally could add setView('ai')).
 */
export function showAiView() {
  hideAllPages();
  document.getElementById('aiPage')?.classList.remove('hidden');
}

/**
 * Handles navigation and view updates across the application.
 *
 * - Pushes a new state to browser history if the view has changed.
 * - Invokes the provided function to display the corresponding view.
 *
 * @param {string} view - A unique identifier for the view.
 * @param {string} url - The URL path to navigate to.
 * @param {Function} showView - The function that displays the view content.
 * @param {Record<string, never>} [extraState={}] - Optional extra state to pass with navigation.
 */
export function navigateTo(
  view: string,
  url: string,
  showView: () => void,
  extraState: Record<string, never> = {},
): void {
  const currentState = history.state;

  if (!currentState || currentState.view !== view) {
    history.pushState({ view, ...extraState }, '', url);
  }

  showView();
}
