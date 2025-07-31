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

  authPage.classList.add('hidden');
  landingPage.classList.remove('hidden');
  profilePage?.classList.add('hidden');
}

export async function restoreViewOnReload() {
  const path = window.location.pathname;
  await checkLoginStatus();

  if (globalSession.getLogstatus()) {
    showLandingView();
    history.replaceState({ view: 'landing' }, '', '/landing');
  } else if (path === '/register') {
    showRegisterView();
    history.replaceState({ view: 'auth', form: 'register' }, '', '/register');
  } else {
    showLoginView();
    history.replaceState({ view: 'auth', form: 'login' }, '', '/login');
  }
}

export function showProfileView() {
  document.getElementById('authPage')?.classList.add('hidden');
  document.getElementById('landingPage')?.classList.add('hidden');
  document.getElementById('profilePage')?.classList.remove('hidden');

  history.pushState({ view: 'profile' }, '', '/profile');
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
