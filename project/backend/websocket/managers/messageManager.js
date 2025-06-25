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

function sendOnlineUsers(target, socket = null) {
  const connectedUsers = connectionManager.getConnectedUsers().keys();
  if (target === 'all') {
    broadcastToAll(JSON.stringify({ type: 'onlineUsers', users: Array.from(connectedUsers) }));
  } else if (target === 'single') {
    socket.send(JSON.stringify({ type: 'onlineUsers', users: Array.from(connectedUsers) }));
  }
}

export const messageManager = {
  broadcastToAll,
  sendOnlineUsers,
};
