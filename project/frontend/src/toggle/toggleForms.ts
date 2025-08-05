import { showLoginView, showRegisterView } from '../navigation/navigation.js';

/**
 * Sets up the toggle behavior between login and registration forms.
 *
 * - Attaches a click event listener to the form toggle element.
 * - When clicked, it checks whether the registration form is currently visible.
 * - If the user is registering, switches to the login view and updates browser history.
 * - If the user is logging in, switches to the registration view and updates browser history.
 *
 * Handles cases where DOM elements are missing by logging a warning.
 */
export function toggleForms() {
  const toggle = document.getElementById('toggleForm');
  const registerForm = document.getElementById('registerForm');

  if (!toggle || !registerForm) {
    console.warn('Missing toggle or registerForm');
    return;
  }

  toggle.addEventListener('click', () => {
    const isRegistering = !registerForm.classList.contains('hidden');

    if (isRegistering) {
      showLoginView();
      history.pushState({ view: 'auth', form: 'login' }, '', '/login');
    } else {
      showRegisterView();
      history.pushState({ view: 'auth', form: 'register' }, '', '/register');
    }
  });
}
