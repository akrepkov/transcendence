import { connectionManager } from './connectionManager.js';

export const REJECT = {
  NOT_AUTHENTICATED: 4001,
  PLAYER_IN_GAME: 4002,
  PLAYER_IN_WAITING_ROOM: 4003,
  NOT_IN_WAITING_ROOM: 4004,
};

const SOCKET_REJECTS = {
  [REJECT.NOT_AUTHENTICATED]: 'You must be logged in to perform this action.',
  [REJECT.PLAYER_IN_GAME]: 'You are already in a game.',
  [REJECT.PLAYER_IN_WAITING_ROOM]: 'You are already in the waiting list.',
  [REJECT.NOT_IN_WAITING_ROOM]: 'You are not in the waiting list.',
};

function sendSocketRejection(socket, code) {
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

function sendErrorToClient(socket, error) {
  if (socket.readyState !== socket.OPEN) {
    console.error('Cannot send error to client: socket is not open');
    return;
  }
  const errorCode = parseInt(error.message);
  if (!Number.isNaN(errorCode)) {
    sendSocketRejection(socket, parseInt(error.message));
  } else {
    messageManager
      .createBroadcast({
        type: 'error',
        message: error.message,
      })
      .to.single(socket);
  }
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
  sendErrorToClient,
  createBroadcast,
  sendOnlineUsers,
  sendSocketRejection,
};
