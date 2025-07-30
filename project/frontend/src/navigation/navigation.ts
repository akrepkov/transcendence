const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const formTitle = document.getElementById('formTitle');
const toggle = document.getElementById('toggleForm');
const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');
const authPage = document.getElementById('authPage');
const landingPage = document.getElementById('landingPage');
const storedUsernameEl = document.getElementById('username'); // ✅ lowercase, clear name

let storedAvatar: string | null = null; // ✅ define this somewhere accessible

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

export function showLandingView(username: string, avatar?: string) {
  if (!authPage || !landingPage) {
    console.warn('Missing authPage or landingPage');
    return;
  }

  const usernameEl = document.getElementById('username');
  console.log('Rendering landing view for username:', username);
  if (usernameEl) {
    usernameEl.textContent = username;
  }

  const profilePic = document.getElementById('profilePic') as HTMLImageElement;
  const avatarProfile = document.getElementById('avatar-profile') as HTMLImageElement;

  if (avatar) {
    storedAvatar = avatar; // store avatar for future use
    if (profilePic) profilePic.src = avatar;
    if (avatarProfile) avatarProfile.src = avatar;
  } else {
    const defaultAvatar = '/avatars/default.png';
    if (profilePic) profilePic.src = defaultAvatar;
    if (avatarProfile) avatarProfile.src = defaultAvatar;
  }

  authPage.classList.add('hidden');
  landingPage.classList.remove('hidden');
}

export async function restoreViewOnReload() {
  const path = window.location.pathname;
  const user = await checkLoginStatus(); // ✅ check server session

  if (path === '/landing' && user) {
    showLandingView(user); // only if logged in
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

// ✅ fixed async function
export async function checkLoginStatus(): Promise<string | null> {
  try {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    });

    if (res.ok) {
      const data = await res.json();
      storedAvatar = data.avatar || null;
      return data.username; // logged in
    } else {
      return null;
    }
  } catch (err) {
    console.error('Error checking login status:', err);
    return null;
  }
}
