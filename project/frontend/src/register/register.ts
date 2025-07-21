export function handleRegister(): void {
  const form = document.getElementById('register-form') as HTMLFormElement;
  const emailInput = document.getElementById('email') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;
  const usernameInput = document.getElementById('username') as HTMLInputElement;
  const message = document.getElementById('register-message') as HTMLElement;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    //user, email, password
    const email = emailInput.value;
    const password = passwordInput.value;
    const username: string = usernameInput.value;

    try {
      const res = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        message.textContent = 'User created successfully';
        message.classList.remove('text-red-500');
        message.classList.add('text-green-500');
      } else {
        message.textContent = data.error || 'Something went wrong';
      }
    } catch (err) {
      message.textContent = 'Server error: ';
      console.error(err);
    }
  });
}
