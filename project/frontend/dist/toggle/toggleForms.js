export function toggleForms() {
  const toggle = document.getElementById('toggleForm');
  const formTitle = document.getElementById('formTitle');
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const registerMessage = document.getElementById('registerMessage');
  const loginMessage = document.getElementById('loginMessage');
  if (!toggle || !formTitle || !registerForm || !loginForm || !registerMessage || !loginMessage) {
    console.warn('Missing form elements');
    return;
  }
  toggle.addEventListener('click', () => {
    const isRegistering = !registerForm.classList.contains('hidden');
    if (isRegistering) {
      // switch to login
      registerForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
      formTitle.textContent = 'Login';
      toggle.textContent = 'No account? Register';
      registerMessage.textContent = '';
    } else {
      // switch to register
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
      formTitle.textContent = 'Register';
      toggle.textContent = 'Already have an account? Login';
      loginMessage.textContent = '';
    }
  });
}
