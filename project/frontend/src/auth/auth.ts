import { showLoginView, showLandingView, navigateTo } from '../navigation/navigation.js';
import { Session } from '../session/session.js';
import { showMessage, showModal } from '../utils/uiHelpers.js';
import { translations } from '../translations/languages.js';

type Lang = 'en' | 'pl' | 'ru' | 'ko';
const getLang = (): Lang => (localStorage.getItem('lang') as Lang) || 'en';

export const globalSession = new Session();

/**
 * Handles the login form submission event.
 *
 * - Retrieves user input for username and password.
 * - Sends a POST request to the `/api/auth/login` endpoint.
 * - If login is successful, updates the session, shows a success message,
 *   and navigates to the landing page.
 * - If login fails, displays an appropriate error message.
 *
 * @returns {Promise<void>} A Promise that resolves when the login process completes.
 */
export async function handleLogin(): Promise<void> {
  const loginForm = document.getElementById('loginForm') as HTMLFormElement;
  const loginMessage = document.getElementById('loginMessage') as HTMLElement;

  if (!loginForm || !loginMessage) {
    console.warn('Login form or message element not found in the DOM.');
    return;
  }

  // Get input values from login form
  const usernameInput = document.getElementById('loginUsername') as HTMLInputElement;
  const passwordInput = document.getElementById('loginPassword') as HTMLInputElement;

  if (!usernameInput || !passwordInput) {
    console.error('Login input fields are missing.');
    return;
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: usernameInput.value,
          password: passwordInput.value,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        globalSession.login(data.username, data.email, data.avatar);
        navigateTo('landing', '/landing', showLandingView);
      } else {
        showMessage(loginMessage, data.error || translations[getLang()].loginFailed);
      }
    } catch (err) {
      console.error(err);
      showMessage(loginMessage, translations[getLang()].loginServerError);
    }
  });
}

/**
 * Handles the registration form submission event.
 *
 * - Retrieves user input for username, email, and password.
 * - Sends a POST request to the `/api/auth/register` endpoint.
 * - If registration is successful, logs in the user, resets the form,
 *   and navigates to the landing page.
 * - If registration fails (e.g., due to duplicate credentials),
 *   displays an appropriate error message.
 *
 * @returns {Promise<void>} A Promise that resolves when the registration process completes.
 */
export async function handleRegister(): Promise<void> {
  const registerForm = document.getElementById('registerForm') as HTMLFormElement;
  const registerMessage = document.getElementById('registerMessage') as HTMLElement;

  if (!registerForm || !registerMessage) {
    console.warn('Register form or message element not found in the DOM.');
    return;
  }

  // Get input values from register form
  const emailInput = document.getElementById('registerEmail') as HTMLInputElement;
  const passwordInput = document.getElementById('registerPassword') as HTMLInputElement;
  const usernameInput = document.getElementById('registerUsername') as HTMLInputElement;

  if (!usernameInput || !emailInput || !passwordInput) {
    console.error('Register input fields are missing.');
    return;
  }

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: usernameInput.value,
          email: emailInput.value,
          password: passwordInput.value,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        globalSession.login(data.username, data.email, data.avatar);
        navigateTo('landing', '/landing', showLandingView);
        registerForm.reset();
      } else if (res.status == 418) {
        showMessage(registerMessage, translations[getLang()].registerMaxChars);
      } else {
        showMessage(registerMessage, translations[getLang()].invalidCredentials);
      }
    } catch (err) {
      console.error(err);
      showMessage(registerMessage, translations[getLang()].registerServerError);
    }
  });
}

/**
 * Handles the user logout process.
 *
 * - Sends a POST request to the `/api/auth/logout` endpoint.
 * - If successful, clears the session and redirects the user to the login view.
 * - If logout fails, shows an alert to notify the user.
 *
 * @returns {Promise<void>} A Promise that resolves when the logout process completes.
 */
export async function handleLogout() {
  try {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (res.ok) {
      globalSession.logout();
      navigateTo('auth', 'login', showLoginView);
    } else {
      await showModal(translations[getLang()].failedToLogout);
    }
  } catch (error) {
    console.error('Logout error:', error);
    await showModal(translations[getLang()].errorLogout);
  }
}

/**
 * Checks if the user is currently logged in by verifying session status from the backend.
 *
 * - Sends a request to `/api/auth/me`.
 * - If valid session found, logs the user into `globalSession`.
 */
export async function checkLoginStatus() {
  try {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    });

    if (res.ok) {
      const data = await res.json();
      globalSession.login(data.username, data.email, data.avatar);
    }
  } catch (err) {
    console.error('Error checking login status:', err);
    return null;
  }
}
