var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
export function handleRegister() {
  const form = document.getElementById('registerForm');
  const emailInput = document.getElementById('registerEmail');
  const passwordInput = document.getElementById('registerPassword');
  const usernameInput = document.getElementById('registerUsername');
  const message = document.getElementById('registerMessage');
  form.addEventListener('submit', (e) =>
    __awaiter(this, void 0, void 0, function* () {
      e.preventDefault();
      //user, email, password
      const registerEmail = emailInput.value;
      const registerPassword = passwordInput.value;
      const registerUsername = usernameInput.value;
      try {
        const res = yield fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: registerUsername,
            email: registerEmail,
            password: registerPassword,
          }),
        });
        const data = yield res.json();
        if (res.ok) {
          message.textContent = 'User created successfully';
        } else {
          message.textContent = data.error;
        }
        form.reset();
      } catch (err) {
        message.textContent = 'Server error';
        console.error(err);
      }
    }),
  );
}
