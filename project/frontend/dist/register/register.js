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
  const form = document.getElementById('register-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const usernameInput = document.getElementById('username');
  const message = document.getElementById('register-message');
  form.addEventListener('submit', (e) =>
    __awaiter(this, void 0, void 0, function* () {
      e.preventDefault();
      //user, email, password
      const email = emailInput.value;
      const password = passwordInput.value;
      const username = usernameInput.value;
      try {
        const res = yield fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        });
        const data = yield res.json();
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
    }),
  );
}
