import { showLoginView, showRegisterView } from '../navigation/navigation.js';

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
