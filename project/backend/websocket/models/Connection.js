export class Connection {
  constructor(socket, userId) {
    this.userId = userId;
    this.socket = socket;
    this.state = 'online';
  }
}
