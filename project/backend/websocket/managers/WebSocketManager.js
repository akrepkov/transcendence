import { Connection } from '../models/Connection.js';

export class WebSocketManager {
  constructor() {
    this.connectedUsers = new Map();
    console.log('Created websocket manager');
  }

  #addConnection(newConnection) {
    const userId = newConnection.userId;
    console.log('New connection from user:', userId);

    if (!this.connectedUsers.has(userId)) {
      console.log('New User connected');
      this.connectedUsers.set(userId, new Set());
    } else {
      console.log('We already had this one');
    }

    let userConnections = this.connectedUsers.get(userId);
    userConnections.add(newConnection);
    this.#printUsers();
  }

  #removeConnection(connection) {
    // possibly add stuff for removing from game
    let userConnections = this.connectedUsers.get(connection.userId);
    userConnections.delete(connection);
    if (userConnections.size === 0) {
      this.connectedUsers.delete(connection.userId);
    }
    this.#printUsers();
  }

  #printUsers() {
    console.log('We currently have', this.connectedUsers.size, 'unique users connected:\n');
    this.connectedUsers.forEach((clients, userId) => {
      console.log(userId, 'has', clients.size, 'connections');
    });
  }

  #setupSocketEvents(socket, connection) {
    socket.on('message', (message) => {
      console.log('Message.');
    });

    socket.on('close', (code, reason) => {
      console.log('Connection closed.:', code, ':', reason.toString());
      this.#removeConnection(connection);
    });

    socket.on('error', (error) => {
      console.error('Websocket error:', error);
    });
  }

  handleNewConnection(socket, decodedToken) {
    let newConnection = new Connection(socket, decodedToken.email);
    this.#addConnection(newConnection);

    console.log('New connection from user:', newConnection.userId);

    this.#setupSocketEvents(socket, newConnection);
  }
}
