import { connectionManager } from './connectionManager.js';

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
};
