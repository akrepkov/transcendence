const connectedUsers = new Map();

function addConnection(newConnection) {
  const userId = newConnection.userId;
  console.log('New connection from user:', userId);

  if (!connectedUsers.has(userId)) {
    console.log('New User connected');
    connectedUsers.set(userId, new Set());
  }
  let userConnections = getUserConnections(userId);
  userConnections.add(newConnection);
  printUsers();
}

function removeConnection(connection) {
  // possibly add stuff for removing from game
  let userConnections = getUserConnections(connection.userId);
  userConnections.delete(connection);
  if (userConnections.size === 0) {
    connectedUsers.delete(connection.userId);
  }
  printUsers();
}

function printUsers() {
  console.log('We currently have', connectedUsers.size, 'unique users connected:\n');
  connectedUsers.forEach((connections, userId) => {
    console.log('user', userId, 'has', connections.size, 'connections');
  });
}

function getUserConnections(userId) {
  return connectedUsers.get(userId);
}

function getConnectedUsers() {
  return connectedUsers;
}

export const connectionManager = {
  addConnection,
  removeConnection,
  getUserConnections,
  getConnectedUsers,
  printUsers,
};
