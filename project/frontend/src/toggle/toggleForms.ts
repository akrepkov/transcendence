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

  const showRegister = () => {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    formTitle.textContent = 'Register';
    toggle.textContent = 'Already have an account? Login';

    loginMessage.textContent = '';
    loginMessage.classList.add('hidden');
    registerMessage.classList.remove('hidden');
  };

  const showLogin = () => {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    formTitle.textContent = 'Login';
    toggle.textContent = 'No account? Register';

    registerMessage.textContent = '';
    registerMessage.classList.add('hidden');
    loginMessage.classList.remove('hidden');
  };

  // 🔄 On click toggle
  toggle.addEventListener('click', () => {
    const isRegistering = !registerForm.classList.contains('hidden');
    if (isRegistering) {
      showLogin();
    } else {
      showRegister();
    }
  });

  // 🆕 Check URL query param on load
  const params = new URLSearchParams(window.location.search);
  if (params.get('form') === 'register') {
    showRegister();
  } else {
    showLogin(); // fallback
  }
}
