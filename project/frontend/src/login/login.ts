export function handleLogin(): void {
  const form = document.getElementById('loginForm') as HTMLFormElement;
  const usernameInput = document.getElementById('loginUsername') as HTMLInputElement;
  const passwordInput = document.getElementById('loginPassword') as HTMLInputElement;
  const message = document.getElementById('loginMessage') as HTMLElement;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // email and password
    const loginUsername = usernameInput.value;
    const loginPassword = passwordInput.value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        message.textContent = 'Logged in successfully';
      } else {
        message.textContent = data.error;
      }
    } catch (err) {
      message.textContent = 'Server error';
      console.error(err);
    }
  });
}
