import authControllers from '../controllers/authControllers.js';
const { authenticateSocketConnection } = authControllers;
import { connectionManager } from './managers/connectionManager.js';
import { Connection } from './models/Connection.js';
import { messageManager } from './managers/messageManager.js';
import { gameManager } from './managers/gameManager.js';
import { waitingListManager } from './managers/waitingListManager.js';
import { getUserById } from '../database/services/userServices.js';

export const USER_LOGOUT = 3000;

async function handleMessage(connection, data) {
  switch (data.type) {
    case 'joinWaitingRoom':
      await waitingListManager.addPlayerToWaitingList(connection, data.gameType);
      gameManager.printGameSystemStatus();
      break;
    case 'leaveWaitingRoom':
      waitingListManager.removeFromWaitingList(connection);
      gameManager.printGameSystemStatus();
      break;
    case 'move':
      gameManager.handleInput(connection, data.direction);
      break;
    case 'stopGame':
      await gameManager.handleDisconnect(connection, 'opponent requested to stop the game');
      gameManager.printGameSystemStatus();
      break;
    case 'disconnectFromGame':
      await gameManager.handleDisconnect(connection, 'opponent disconnected');
      gameManager.printGameSystemStatus();
      break;
    case 'getLoggedInFriends':
      await messageManager.sendLoggedInFriends(connection);
      break;
    default:
      console.warn('Unknown message type:', data.type);
  }
}

function handleWebsocketError(connection, error) {
  try {
    messageManager.sendErrorToClient(connection.socket, error);
  } catch (err) {
    console.error('Critical error during error handling: ', err.message);
    if (connection.socket.readyState === connection.socket.OPEN) {
      connection.socket.close(1011, 'Critical error during error handling.');
    }
  }
}

async function messageHandler(connection, message) {
  console.log('Message.');
  console.log(message.toString());
  try {
    const data = JSON.parse(message);
    await handleMessage(connection, data);
  } catch (err) {
    console.error('Error processing Websocket message:', err.message);
    handleWebsocketError(connection, err);
  }
}

async function closeConnection(connection, code) {
  if (connection.closing === true) {
    return;
  }
  connection.closing = true;
  await gameManager.handleDisconnect(connection, 'opponent closed his connection');
  if (connection.socket.readyState === connection.socket.OPEN) {
    connection.socket.close(code);
  }
  connectionManager.removeConnection(connection);
  gameManager.printGameSystemStatus();

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
}

async function setupSocketEvents(socket, connection) {
  socket.on('message', (message) => {
    messageHandler(connection, message);
  });

  socket.on('close', (code, reason) => {
    console.log('Connection closed.:', code, ':', reason.toString());
    closeConnection(connection, code);
  });

  socket.on('error', (error) => {
    console.error('Websocket error:', error);
    handleWebsocketError(connection, error);
  });

  socket.on('pong', () => {
    socket.isAlive = true;
  });
}

async function handleNewConnection(socket, decodedToken) {
  let newConnection = new Connection(socket, decodedToken);
  let user = await getUserById(newConnection.userId);
  if (!user) {
    console.error('User not found in the database:', newConnection.userId);
    handleWebsocketError(newConnection, new Error('User not found in the database'));
    return;
  }
  newConnection.username = user.username;
  connectionManager.addConnection(newConnection);
  await setupSocketEvents(socket, newConnection);
}

export async function websocketHandler(socket, req) {
  const decodedToken = authenticateSocketConnection(req, socket);
  if (!decodedToken) {
    return;
  }
  await handleNewConnection(socket, decodedToken);
}

const loggingInterval = setInterval(() => {
  gameManager.printGameSystemStatus();
  connectionManager.printUsers();
}, 15000);
