import authControllers from '../controllers/authControllers.js';
const { authenticateSocketConnection } = authControllers;
import { connectionManager } from './managers/connectionManager.js';
import { Connection } from './models/Connection.js';

function setupSocketEvents(socket, connection) {
  socket.on('message', (message) => {
    console.log('Message.');
  });

  socket.on('close', (code, reason) => {
    console.log('Connection closed.:', code, ':', reason.toString());
    connectionManager.removeConnection(connection);
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
}

export function websocketHandler(socket, req) {
  const decodedToken = authenticateSocketConnection(req, socket);
  console.log('Decoded token:', decodedToken);
  if (!decodedToken) {
    return;
  }
  handleNewConnection(socket, decodedToken);
}
