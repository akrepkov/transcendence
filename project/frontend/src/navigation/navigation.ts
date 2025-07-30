const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const formTitle = document.getElementById('formTitle');
const toggle = document.getElementById('toggleForm');
const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');
const authPage = document.getElementById('authPage');
const landingPage = document.getElementById('landingPage');
const username = document.getElementById('username');

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
}

export function showLandingView() {
  const storedUsername = localStorage.getItem('username');
  const storedAvatar = localStorage.getItem('avatar'); // optional: only if you're storing avatar path

  if (!storedUsername) {
    console.warn('User not logged in - redirect to login');
    history.replaceState({ view: 'auth', form: 'login' }, '', '/login');
    showLoginView();
    return;
  }

  if (!authPage || !landingPage) {
    console.warn('Missing authPage or landingPage');
    return;
  }

  const usernameEl = document.getElementById('username');
  if (usernameEl) {
    usernameEl.textContent = storedUsername;
  }

  const profilePic = document.getElementById('profilePic') as HTMLImageElement;
  const avatarProfile = document.getElementById('avatar-profile') as HTMLImageElement;

  if (storedAvatar) {
    if (profilePic) profilePic.src = storedAvatar;
    if (avatarProfile) avatarProfile.src = storedAvatar;
  } else {
    // fallback avatar
    const defaultAvatar = '/avatars/default.png';
    if (profilePic) profilePic.src = defaultAvatar;
    if (avatarProfile) avatarProfile.src = defaultAvatar;
  }

  authPage.classList.add('hidden');
  landingPage.classList.remove('hidden');
}

export function restoreViewOnReload() {
  const path = window.location.pathname;
  const isLoggedIn = !!localStorage.getItem('username');

  if (path === '/landing' && isLoggedIn) {
    showLandingView();
    history.replaceState({ view: 'landing' }, '', '/landing');
  } else if (path === '/register') {
    showRegisterView();
    history.replaceState({ view: 'auth', form: 'register' }, '', '/register');
  } else {
    // Default to login
    showLoginView();
    history.replaceState({ view: 'auth', form: 'login' }, '', '/login');
  }
}
