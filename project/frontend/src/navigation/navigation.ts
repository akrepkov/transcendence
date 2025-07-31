import { globalSession } from '../auth/auth.js';

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const formTitle = document.getElementById('formTitle');
const toggle = document.getElementById('toggleForm');
const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');
const authPage = document.getElementById('authPage');
const landingPage = document.getElementById('landingPage');
const profilePage = document.getElementById('profilePage');

function hideAllPages() {
  [
    'authPage',
    'landingPage',
    'profilePage',
    'settingsPage',
    'pongPage',
    'snakePage',
    'practicePage',
  ].forEach((id) => document.getElementById(id)?.classList.add('hidden'));
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
  authPage?.classList.remove('hidden');
  landingPage?.classList.add('hidden');
  profilePage?.classList.add('hidden');
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
  authPage?.classList.remove('hidden');
  landingPage?.classList.add('hidden');
  profilePage?.classList.add('hidden');
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
    './pong': showPongView, // is this the path?
    './snake': showSnakeView, // is this the path?
    './practice': showPracticeView, // is this the path?
  };

  const viewFunc = views[path];

  if (!viewFunc) {
    // Unknown path — redirect to login
    history.replaceState({ view: 'auth', form: 'login' }, '', '/login');
    showLoginView();
    return;
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

export function showProfileView() {
  hideAllPages();
  document.getElementById('profilePage')?.classList.remove('hidden');

  const heading = document.getElementById('profileHeading');
  if (heading) {
    const username = globalSession.getUsername();
    heading.textContent = `${username}'s Profile`;
  }

  const avatarProfile = document.getElementById('avatar-profile') as HTMLImageElement;
  if (avatarProfile) {
    avatarProfile.src = globalSession.getAvatar();
  }
  profilePage?.classList.remove('hidden');
}

export function showSettingsView() {
  hideAllPages();
  document.getElementById('settingsPage')?.classList.remove('hidden');
}

export function showPongView() {
  hideAllPages();
  document.getElementById('pongPage')?.classList.remove('hidden');
}

export function showSnakeView() {
  hideAllPages();
  document.getElementById('snakePage')?.classList.remove('hidden');
}

export function showPracticeView() {
  hideAllPages();
  document.getElementById('practicePage')?.classList.remove('hidden');
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
