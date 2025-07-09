//A Manager is just a small object (or function) that controls access to some important piece of data.
//It hides the details inside it (private data).
//It exposes only the allowed actions (public functions).
//(function() { ... })() →  runs immediately
// (this is called an Immediately Invoked Function Expression — IIFE).
import { openConnection, closeConnection } from '../websocket/websocket.js';

export const USER_LOGOUT = 3000;
export const REQUESTED_LOGOUT = 3001;

const AuthManager = (function () {
  let loggedIn = false;
  let user = null;
  return {
    login(userdata) {
      loggedIn = true;
      user = userdata;
      openConnection();
    },
    logout() {
      loggedIn = false;
      user = null;
      closeConnection(USER_LOGOUT, 'User logged out');
    },
    requestedLogout() {
      loggedIn = false;
      user = null;
      closeConnection(REQUESTED_LOGOUT, 'User logged out on request of server');
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
