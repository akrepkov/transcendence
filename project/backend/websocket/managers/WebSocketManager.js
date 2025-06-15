export class WebSocketManager {
  constructor() {
    this.clients = new Map();
    this.users = new Map();
    console.log('Created websocket manager');
  }

  handleNewConnection(socket) {
    // this.clients.set(socket, )
  }
}
