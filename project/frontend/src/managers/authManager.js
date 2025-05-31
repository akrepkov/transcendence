//A Manager is just a small object (or function) that controls access to some important piece of data.
//It hides the details inside it (private data).
//It exposes only the allowed actions (public functions).
//(function() { ... })() →  runs immediately
// (this is called an Immediately Invoked Function Expression — IIFE).

const AuthManager = (function () {
  let loggedIn = false;
  let user = null;
  return {
    login(userdata) {
      loggedIn = true;
      user = userdata;
    },
    logout() {
      loggedIn = false;
      user = null;
    },
    isLoggedIn() {
      return loggedIn;
    },
    getUsername() {
      return user;
    },
  };
})();

export default AuthManager;
