import authControllers from '../controllers/authControllers.js';
const { authenticateSocketConnection } = authControllers;
import { connectionManager } from './managers/connectionManager.js';
import { Connection } from './models/Connection.js';
import { messageManager } from './managers/messageManager.js';

function setupSocketEvents(socket, connection) {
  socket.on('message', (message) => {
    console.log('Message.');
    console.log(message.toString());
  });

  socket.on('close', (code, reason) => {
    console.log('Connection closed.:', code, ':', reason.toString());
    connectionManager.removeConnection(connection);
    if (!connectionManager.getUserConnections(connection.userId)) {
      messageManager.sendOnlineUsers('all');
    }
  });

  socket.on('error', (error) => {
    console.error('Websocket error:', error);
  });
}

function handleNewConnection(socket, decodedToken) {
  let newConnection = new Connection(socket, decodedToken.email);
  connectionManager.addConnection(newConnection);
  console.log('New connection from user:', newConnection.userId);
  setupSocketEvents(socket, newConnection);

  // if a new user connected, send updated online users to all connected sockets
  if (connectionManager.getUserConnections(newConnection.userId).size === 1) {
    messageManager.sendOnlineUsers('all');
  } else {
    messageManager.sendOnlineUsers('single', socket);
  }
}

export function websocketHandler(socket, req) {
  const decodedToken = authenticateSocketConnection(req, socket);
  if (!decodedToken) {
    return;
  }
  handleNewConnection(socket, decodedToken);
}
