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
export function handleLogin() {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const message = document.getElementById('loginMessage');
  form.addEventListener('submit', (e) =>
    __awaiter(this, void 0, void 0, function* () {
      e.preventDefault();
      // email and password
      const loginEmail = emailInput.value;
      const loginPassword = passwordInput.value;
      console.log('loginEmail: ', loginEmail);
      console.log('loginPassword: ', loginPassword);
      try {
        const res = yield fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
          }),
        });
        const data = yield res.json();
        if (res.ok) {
          message.textContent = 'Logged in successfully';
        } else {
          message.textContent = data.error;
        }
      } catch (err) {
        message.textContent = 'Server error';
        console.error(err);
      }
    }),
  );
}
