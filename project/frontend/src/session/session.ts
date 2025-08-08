import { setupSocketEvents } from '../games/gameToggle.js';
import { setupGameToggle } from '../games/gameToggle.js';

/**
 * Class representing a user's session in the application.
 * Handles login/logout state, user identity, avatar, game stats,
 * and WebSocket communication setup.
 */
export class Session {
  private username: string = '';
  private email: string = '';
  private avatar: string = '';
  private loggedIn: boolean = false;
  private snakeStats: string = '';
  private pongStats: string = '';
  private socket: WebSocket | null = null;

  /**
   * Creates a new session instance and initializes default values.
   */
  public constructor() {
    this.reset();
  }

  /**
   * Resets the session to its default (logged out) state.
   * Clears username, email, avatar, stats, and disconnects the socket.
   */
  public reset() {
    this.username = '';
    this.email = '';
    this.avatar = '';
    this.loggedIn = false;
    this.snakeStats = '';
    this.pongStats = '';
    this.socket = null;
  }

  /**
   * Logs the user in and sets session data.
   * Establishes a WebSocket connection and initializes socket-based game features.
   *
   * @param {string} username - The user's username.
   * @param {string} email - The user's email address.
   * @param {string} avatar - The user's avatar image URL (can be null or empty).
   */
  public login(username: string, email: string, avatar: string) {
    this.username = username;
    this.email = email;
    this.socket = new WebSocket(`wss://${window.location.hostname}:3000/ws/connect`);
    // console.log('Am I logged IN : ', localStorage.getItem('username'));
    setupSocketEvents(this.socket);
    setupGameToggle(this.socket);

    if (!avatar) {
      this.avatar = '/uploads/avatars/wow_cat.jpg';
    } else {
      this.avatar = avatar;
    }
    this.loggedIn = true;
  }

  /**
   * Logs the user out and clears the session.
   * Closes any active WebSocket connection.
   */
  public logout() {
    this.socket?.close();
    this.reset();
  }

  /**
   * Returns the current login status.
   *
   * @returns {boolean} True if the user is logged in, otherwise false.
   */
  public getLogstatus() {
    return this.loggedIn;
  }

  /**
   * Gets the current username.
   *
   * @returns {string} The current username.
   */
  public getUsername() {
    return this.username;
  }

  /**
   * Updates the username.
   * call after POST to database
   * @param {string} newUsername - The new username to set.
   */
  public setUsername(newUsername: string) {
    this.username = newUsername;
  }

  /**
   * Gets the current email.
   *
   * @returns {string} The current email address.
   */
  public getEmail() {
    return this.email;
  }

  /**
   * Updates the email address.
   * call after POST to database
   * @param {string} newEmail - The new email address to set.
   */
  public setEmail(newEmail: string) {
    this.email = newEmail;
  }

  /**
   * Gets the current avatar URL.
   *
   * @returns {string} The URL of the avatar image.
   */
  public getAvatar() {
    return this.avatar;
  }

  /**
   * Updates the avatar image URL.
   * call after POST to database
   * @param {string} newAvatar - The new avatar URL to set.
   */
  public setAvatar(newAvatar: string) {
    this.avatar = newAvatar;
  }

  /**
   * Gets the WebSocket connection for the session.
   *
   * * @returns {WebSocket | null} The WebSocket connection, or null if not connected.
   */
  public getSocket() {
    return this.socket;
  }

  /**
   * Sets the WebSocket connection for the session.
   *
   * @param {WebSocket} socket - The WebSocket connection to set.
   */
  public setSocket(socket: WebSocket | null) {
    this.socket = socket;
  }

  /**
   * Fetches the list of online friends from the server via WebSocket.
   * Returns a promise that resolves with the list of friends or rejects on error.
   * Please await
   */
  public async getOnlineFriends() {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }
      const handler = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        console.log(data);
        if (data.type === 'onlineFriends') {
          this.socket!.removeEventListener('message', handler);
          resolve(data.friends);
        }
      };

      this.socket.addEventListener('message', handler);

      const sendOrRetry = (attempt = 0) => {
        if (!this.socket) {
          reject(new Error('Socket not initialized'));
          return;
        }
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'getLoggedInFriends' }));
        } else if (attempt < 10) {
          setTimeout(() => sendOrRetry(attempt + 1), 100);
        } else {
          this.socket!.removeEventListener('message', handler);
          reject(new Error('Socket not open after retry'));
        }
      };

      sendOrRetry();

      setTimeout(() => {
        this.socket!.removeEventListener('message', handler);
        reject(new Error('Timeout while waiting for online friends'));
      }, 5000);
    });
  }
}
