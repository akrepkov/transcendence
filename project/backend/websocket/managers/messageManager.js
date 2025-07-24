import { connectionManager } from './connectionManager.js';

export const REJECT = {
  NOT_AUTHENTICATED: 4001,
  PLAYER_IN_GAME: 4002,
  PLAYER_IN_WAITING_ROOM: 4003,
  NOT_IN_WAITING_ROOM: 4004,
  NOT_IN_GAME: 4005,
  WRONG_DIRECTION: 4006,
};

const SOCKET_REJECTS = {
  [REJECT.NOT_AUTHENTICATED]: 'You must be logged in to perform this action.',
  [REJECT.PLAYER_IN_GAME]: 'You are already in a game.',
  [REJECT.PLAYER_IN_WAITING_ROOM]: 'You are already in the waiting list.',
  [REJECT.NOT_IN_WAITING_ROOM]: 'Your connection is not in the waiting list.',
  [REJECT.NOT_IN_GAME]: 'Your connection is not in a game.',
  [REJECT.WRONG_DIRECTION]: 'Invalid direction specified. Use "up" or "down".',
};

function sendSocketRejection(socket, code) {
  if (!Object.values(REJECT).includes(code)) {
    console.warn(`Invalid socket rejection code: ${code}`);
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
    throw new Error('Cannot send error to client: socket is not open');
  }
  const errorCode = parseInt(error.message);
  if (Number.isInteger(errorCode)) {
    sendSocketRejection(socket, errorCode);
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
    users: connectionManager.getNamesOfConnectedUsers(),
  }).to[target](sockets);
}

export const messageManager = {
  broadcastToAll,
  sendErrorToClient,
  createBroadcast,
  sendOnlineUsers,
  sendSocketRejection,
};
