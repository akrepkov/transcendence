export class Session {
  private username: string = '';
  private email: string = '';
  private avatar: string = '';
  private loggedIn: boolean = false;
  private snakeStats: string = '';
  private pongStats: string = '';

  public constructor() {
    this.reset();
  }

  public reset() {
    this.username = '';
    this.email = '';
    this.avatar = '';
    this.loggedIn = false;
    this.snakeStats = '';
    this.pongStats = '';
  }

  public login(username: string, email: string, avatar: string) {
    this.username = username;
    this.email = email;
    this.avatar = avatar;
    this.loggedIn = true;
  }

  public logout() {
    this.reset();
  }

  public getLogstatus() {
    return this.loggedIn;
  }

  public getUsername() {
    return this.username;
  }

  // call after POST to database
  public setUsername(newUsername: string) {
    this.username = newUsername;
  }

  public getEmail() {
    return this.email;
  }

  // call after POST to database
  public setEmail(newEmail: string) {
    this.email = newEmail;
  }

  public getAvatar() {
    return this.avatar;
  }

  // call after POST to database
  public setAvatar(newAvatar: string) {
    this.avatar = newAvatar;
  }

  public getSnakeStats() {
    return this.snakeStats;
  }

  public getPongStats() {
    return this.pongStats;
  }

  // need a set/update pong/snakeStats?
}
