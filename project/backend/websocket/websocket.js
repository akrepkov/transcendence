import authControllers from '../controllers/authControllers.js';
const { authenticateSocketConnection } = authControllers;
import { connectionManager } from './managers/connectionManager.js';
import { Connection } from './models/Connection.js';
import { messageManager } from './managers/messageManager.js';

export const USER_LOGOUT = 3000;

function closeConnection(connection, code) {
  // TODO possibly add stuff for removing from game
  connectionManager.removeConnection(connection);

  // checks if the user logged out and if so, send logout request to all other sockets opened by that user
  let userConnections = connectionManager.getUserConnectionsBySession(
    connection.userId,
    connection.sessionId,
  );
  if (code === USER_LOGOUT && userConnections) {
    messageManager
      .createBroadcast({ type: 'logoutRequest' })
      .to.sockets(userConnections.map((connection) => connection.socket));
  }

  // if this was the last connection for the user, send updated online users to all other sockets
  if (connectionManager.getConnectedUsers().has(connection.userId) === false) {
    messageManager.sendOnlineUsers('all');
  }
}

function setupSocketEvents(socket, connection) {
  socket.on('message', (message) => {
    console.log('Message.');
    console.log(message.toString());
  });

  socket.on('close', (code, reason) => {
    console.log('Connection closed.:', code, ':', reason.toString());
    closeConnection(connection, code);
  });

  socket.on('error', (error) => {
    console.error('Websocket error:', error);
  });
}

function handleNewConnection(socket, decodedToken) {
  let newConnection = new Connection(socket, decodedToken);
  connectionManager.addConnection(newConnection);
  setupSocketEvents(socket, newConnection);

  // if a new user connected, send updated online users to all connected sockets,
  // otherwise send the online users to the new socket
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
