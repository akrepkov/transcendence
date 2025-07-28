function showMessage(el: HTMLElement, text: string): void {
  el.classList.remove('hidden');
  el.textContent = text;
}

/**
 * Handle login form submission
 * Verifies user credentials and displays a success or error message
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
        body: JSON.stringify({
          username: usernameInput.value,
          password: passwordInput.value,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('username', usernameInput.value);
        showMessage(loginMessage, 'Logged in successfully');

        document.getElementById('username')!.textContent = usernameInput.value;

        // SPA Navigation
        document.getElementById('authPage')?.classList.add('hidden');
        document.getElementById('landingPage')?.classList.remove('hidden');
      } else {
        showMessage(loginMessage, data.error || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      showMessage(loginMessage, 'Server error');
    }
  });
}

/**
 * Handle registration form submission
 * Validates input fields and displays a success or error message
 */
export async function handleRegister(): Promise<void> {
  // Prevent form from reloading the page
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
        body: JSON.stringify({
          username: usernameInput.value,
          email: emailInput.value,
          password: passwordInput.value,
        }),
      });

      const data = await res.json();
      showMessage(registerMessage, res.ok ? 'User registered successfully' : data.error);
      registerForm.reset();
    } catch (err) {
      console.error(err);
      showMessage(registerMessage, 'Server error');
    }
  });
}
