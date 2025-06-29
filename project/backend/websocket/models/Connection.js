export class Connection {
  constructor(socket, decodedToken) {
    this.userId = decodedToken.email;
    this.sessionId = decodedToken.sessionId;
    this.socket = socket;
    this.socket.isAlive = true;
    this.state = 'idle';
  }
}
