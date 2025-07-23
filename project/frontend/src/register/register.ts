export function handleRegister(): void {
  const form = document.getElementById('registerForm') as HTMLFormElement;
  const emailInput = document.getElementById('registerEmail') as HTMLInputElement;
  const passwordInput = document.getElementById('registerPassword') as HTMLInputElement;
  const usernameInput = document.getElementById('registerUsername') as HTMLInputElement;
  const message = document.getElementById('registerMessage') as HTMLElement;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const registerEmail = emailInput.value;
    const registerPassword = passwordInput.value;
    const registerUsername: string = usernameInput.value;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await res.json();
      message.classList.remove('hidden'); // show the message

      if (res.ok) {
        message.textContent = 'User created successfully';
      } else {
        message.textContent = data.error;
      }
      form.reset();
    } catch (err) {
      message.classList.remove('hidden'); // show the message
      message.textContent = 'Server error';
      console.error(err);
    }
  });
}
