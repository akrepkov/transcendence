export class Client {
  constructor(socket, userId) {
    this.userId = userId;
    this.socket = socket;
    this.state = 'idle';
  }
}
