import authControllers from '../controllers/authControllers.js';
const { authenticateSocketConnection } = authControllers;
import { connectionManager } from './managers/connectionManager.js';
import { Connection } from './models/Connection.js';
import { messageManager } from './managers/messageManager.js';
import { gameManager } from './managers/gameManager.js';

export const USER_LOGOUT = 3000;

function handleMessage(connection, data) {
  switch (data.type) {
    case 'joinWaitingRoom':
      gameManager.addPlayerToWaitingList(connection);
      gameManager.printGameSystemStatus();
      break;
    case 'leaveWaitingRoom':
      gameManager.removeFromWaitingList(connection);
      gameManager.printGameSystemStatus();
      break;
    case 'move':
      gameManager.handleInput(connection, data.direction);
      break;
    case 'stopGame':
      gameManager.handleDisconnect(connection, 'opponent requested to stop the game');
      gameManager.printGameSystemStatus();
      break;
    case 'disconnectFromGame':
      gameManager.handleDisconnect(connection, 'opponent disconnected');
      gameManager.printGameSystemStatus();
      break;
    default:
      console.warn('Unknown message type:', data.type);
  }
}

function handleError(connection, error) {
  try {
    messageManager.sendErrorToClient(connection.socket, error);
  } catch (err) {
    console.error('Critical error during error handling: ', err.message);
    closeConnection(connection);
  }
}

function messageHandler(connection, message) {
  console.log('Message.');
  try {
    const data = JSON.parse(message);
    handleMessage(connection, data);
  } catch (err) {
    console.error('Error processing Websocket message:', err.message);
    handleError(connection, err);
  }
}

function closeConnection(connection, code) {
  // TODO possibly add stuff for removing from game
  if (connection.socket.readyState === connection.socket.OPEN) {
    connection.socket.close(code);
  }
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
    messageHandler(connection, message);
  });

  socket.on('close', (code, reason) => {
    console.log('Connection closed.:', code, ':', reason.toString());
    closeConnection(connection, code);
  });

  socket.on('error', (error) => {
    console.error('Websocket error:', error);
  });

  socket.on('pong', () => {
    socket.isAlive = true;
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
