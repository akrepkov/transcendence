export function setupAuth() {
  window.setupAuthForms = function () {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Login failed');
        // handle success
      } catch (err) {
        console.error(err);
        // show error UI
      }
    });

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = registerForm.emailR.value;
      const password = registerForm.passwordR.value;
      const username = registerForm.username.value;

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, username }),
        });

        if (!res.ok) throw new Error('Register failed');
        // handle success
      } catch (err) {
        console.error(err);
        // show error UI
      }
    });
  };
}
