function showMessage(el: HTMLElement, text: string): void {
  el.classList.remove('hidden');
  el.textContent = text;
}

export function handleLogin(): void {
  const form = document.getElementById('loginForm') as HTMLFormElement;
  const usernameInput = document.getElementById('loginUsername') as HTMLInputElement;
  const passwordInput = document.getElementById('loginPassword') as HTMLInputElement;
  const message = document.getElementById('loginMessage') as HTMLElement;

  if (!form || !usernameInput || !passwordInput || !message) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.value,
          password: passwordInput.value,
        }),
      });

      const data = await res.json();
      showMessage(message, res.ok ? 'Logged in successfully' : data.error);
    } catch (err) {
      console.error(err);
      showMessage(message, 'Server error');
    }
  });
}

export function handleRegister(): void {
  const form = document.getElementById('registerForm') as HTMLFormElement;
  const emailInput = document.getElementById('registerEmail') as HTMLInputElement;
  const passwordInput = document.getElementById('registerPassword') as HTMLInputElement;
  const usernameInput = document.getElementById('registerUsername') as HTMLInputElement;
  const message = document.getElementById('registerMessage') as HTMLElement;

  if (!form || !emailInput || !passwordInput || !usernameInput || !message) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.value,
          email: emailInput.value,
          password: passwordInput.value,
        }),
      });

      const data = await res.json();
      showMessage(message, res.ok ? 'User created successfully' : data.error);
      form.reset();
    } catch (err) {
      console.error(err);
      showMessage(message, 'Server error');
    }
  });
}

// logic for testing
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const e2eMode = params.get('e2e');

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (!loginForm || !registerForm) return;

  if (e2eMode === 'register') {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  } else if (e2eMode === 'login') {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  }
});
