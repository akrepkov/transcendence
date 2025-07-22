export function handleLogin(): void {
  const form = document.getElementById('loginForm') as HTMLFormElement;
  const emailInput = document.getElementById('loginEmail') as HTMLInputElement;
  const passwordInput = document.getElementById('loginPassword') as HTMLInputElement;
  const message = document.getElementById('loginMessage') as HTMLElement;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // email and password
    const loginEmail = emailInput.value;
    const loginPassword = passwordInput.value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginEmail, loginPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        message.textContent = 'Logged in successfully';
        message.classList.remove('text-red-500');
        message.classList.add('text-green-500');
      } else {
        message.textContent = data.error || 'Invalid credentials';
        message.classList.remove('text-green-500');
        message.classList.add('text-red-500');
      }
    } catch (err) {
      message.textContent = 'Server error';
      console.error(err);
    }
  });
}
