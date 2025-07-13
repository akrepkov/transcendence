import { connectionManager } from './connectionManager.js';
import WebsocketSnake from '../snake/websocketSnake.js';

export const REJECT = {
  NOT_AUTHENTICATED: 4001,
  PLAYER_IN_GAME: 4002,
  PLAYER_IN_WAITING_ROOM: 4003,
};

const SOCKET_REJECTS = {
  [REJECT.NOT_AUTHENTICATED]: 'You must be logged in to perform this action.',
  [REJECT.PLAYER_IN_GAME]: 'You are already in a game.',
  [REJECT.PLAYER_IN_WAITING_ROOM]: 'You are already in the waiting list.',
};

function sendSocketRejection(socket, code) {
  console.log('Sending socket rejection:', SOCKET_REJECTS);
  console.log('Sending socket rejection:', REJECT);
  console.log('Sending socket rejection:', SOCKET_REJECTS[code]);
  if (!Object.values(REJECT).includes(code)) {
    // throw new Error(`Invalid socket rejection code: ${code}`);
    return;
  }

  messageManager
    .createBroadcast({
      type: 'socketRejection',
      code: code,
      message: SOCKET_REJECTS[code],
    })
    .to.single(socket);
}

function broadcastToAll(message) {
  const connectedUsers = connectionManager.getConnectedUsers();
  console.log('New broadcast');
  connectedUsers.forEach((userConnections) => {
    userConnections.forEach((connection) => {
      if (connection.socket.readyState === 1) {
        connection.socket.send(message);
      }
    });
  });
}

function createBroadcast(message) {
  if (typeof message !== 'string') {
    message = JSON.stringify(message);
  }

  return {
    to: {
      all: () => broadcastToAll(message),
      single: (socket) => socket.send(message),
      sockets: (sockets) => sockets.forEach((socket) => socket.send(message)),
    },
  };
}

function sendOnlineUsers(target, sockets = null) {
  createBroadcast({
    type: 'onlineUsers',
    users: Array.from(connectionManager.getConnectedUsers().keys()),
  }).to[target](sockets);
}

export const messageManager = {
  broadcastToAll,
  createBroadcast,
  sendOnlineUsers,
  sendSocketRejection,
};
