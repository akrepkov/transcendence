import { globalSession } from '../auth/auth.js';
import { showFriends, fetchUserProfile } from '../profile/profile.js';

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const formTitle = document.getElementById('formTitle');
const toggle = document.getElementById('toggleForm');
const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');
const authPage = document.getElementById('authPage');
const landingPage = document.getElementById('landingPage');
const profilePage = document.getElementById('profilePage');
// const settingsPage = document.getElementById('settingsPage');
const creditPage = document.getElementById('creditPage');

function hideAllPages() {
  [
    'authPage',
    'landingPage',
    'profilePage',
    'settingsPage',
    'pongPage',
    'snakePage',
    'practicePage',
    'creditPage',
  ].forEach((id) => document.getElementById(id)?.classList.add('hidden'));
}

function setView(viewName: string) {
  document.body.setAttribute('data-view', viewName);
}

export function showMessage(el: HTMLElement, text: string): void {
  el.classList.remove('hidden');
  el.textContent = text;
}

export function showLoginView() {
  if (!loginForm || !registerForm || !formTitle || !toggle || !loginMessage || !registerMessage)
    return;

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

export function showRegisterView() {
  if (!loginForm || !registerForm || !formTitle || !toggle || !loginMessage || !registerMessage)
    return;

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
  setView('landing'); //new
}

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
 * Displays the profile view for a specified user or defaults to the currently logged-in user.
 *
 * - Hides all other views before displaying the profile page.
 * - Fetches profile data from the server for the given or current user.
 * - Updates the profile heading and avatar.
 * - Handles fallback if no username is provided.
 *
 * @param {string} [username] - Optional username to display the profile for.
 *                              If not provided, defaults to the currently logged-in user via `globalSession.getUsername()`.
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
    // Hide "Add Friend" input if viewing another user's profile
    const isOwnProfile = providedUsername === globalSession.getUsername();
    const addFriendSection = document.getElementById('addFriendSection');

    if (addFriendSection) {
      if (isOwnProfile) {
        addFriendSection.classList.remove('hidden');
      } else {
        addFriendSection.classList.add('hidden');
      }
    }

    const backToOwnButton = document.getElementById('backToOwnProfile');
    if (backToOwnButton) {
      if (isOwnProfile) {
        backToOwnButton.classList.add('hidden');
      } else {
        backToOwnButton.classList.remove('hidden');
      }
    }

    profilePage?.classList.remove('hidden');
    setView('profile');
  } catch (err) {
    console.error('Error loading profile:', err);
    return;
  }
}

export function showSettingsView() {
  hideAllPages();
  document.getElementById('settingsPage')?.classList.remove('hidden');
  setView('settings');
}

export function showPongView() {
  hideAllPages();
  document.getElementById('pongPage')?.classList.remove('hidden');
  setView('pong');
}

export function showSnakeView() {
  hideAllPages();
  document.getElementById('snakePage')?.classList.remove('hidden');
  setView('snake');
}

export function showPracticeView() {
  hideAllPages();
  document.getElementById('practicePage')?.classList.remove('hidden');
  setView('practice');
}

export function showCreditView() {
  hideAllPages();
  document.getElementById('creditPage')?.classList.remove('hidden');
  setView('credits');
}

export async function checkLoginStatus() {
  try {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    });

    if (res.ok) {
      const data = await res.json();
      console.log('User data:', data);
      globalSession.login(data.username, data.email, data.avatar);
    }
  } catch (err) {
    console.error('Error checking login status:', err);
    return null;
  }
}

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
