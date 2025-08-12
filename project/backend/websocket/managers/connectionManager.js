// map that holds all the users, it connects their IDs to a set of their connections
// a user can have multiple connections, think multiple browser tabs logged into the same account
import { getFriends, getUserById } from '../../database/services/userServices.js';

const connectedUsers = new Map();

// function to add a connection (socket) to a user
// if it is a new user, will create a new set in the map identifying the user's connections
function addConnection(newConnection) {
  const userId = newConnection.userId;
  console.log('New connection from user:', userId);

  // if it's a new user, create a new set in the map for the users connections
  if (!connectedUsers.has(userId)) {
    console.log('New User connected');
    connectedUsers.set(userId, new Set());
  }
  let userConnections = getUserConnections(userId);
  userConnections.add(newConnection);
  printUsers();
}

// function to remove a single connection (socket) from a user
// if the user has no more connections, removes the user from the map
function removeConnection(connection) {
  let userConnections = getUserConnections(connection.userId);
  userConnections.delete(connection);
  if (userConnections.size === 0) {
    connectedUsers.delete(connection.userId);
  }
  printUsers();
}

function printUsers() {
  console.log('\n=== START Connection System Status ===\n');
  console.log('We currently have', connectedUsers.size, 'unique users connected:\n');
  connectedUsers.forEach((connections, userId) => {
    console.log('user', getUserNameById(userId), 'has', connections.size, 'connections');
  });
  console.log('\n=== END Connection System Status ===\n');
}

function getUserConnectionsBySession(userId, sessionId) {
  const userConnections = getUserConnections(userId);
  if (!userConnections) {
    return null;
  }
  return Array.from(userConnections).filter((connection) => connection.sessionId === sessionId);
}

function getUserConnections(userId) {
  return connectedUsers.get(userId);
}

function getConnectedUsers() {
  return connectedUsers;
}

function getUserNameById(userId) {
  const userConnections = getUserConnections(userId);
  if (!userConnections || userConnections.size === 0) {
    return null;
  }
  return userConnections.values().next().value.username;
}

function getNamesOfConnectedUsers() {
  const userNames = [];
  connectedUsers.forEach((connections, userId) => {
    const userName = getUserNameById(userId);
    if (userName) {
      userNames.push(userName);
    }
  });
  return userNames;
}

function updateUsernameInConnections(userId, newUsername) {
  const userConnections = getUserConnections(userId);
  if (!userConnections) {
    return;
  }
  userConnections.forEach((connection) => {
    connection.username = newUsername;
  });
}

async function getOnlineFriendsHandler(request, reply) {
  const { username } = request.query;
  if (!username) {
    return reply.code(400).send({ error: 'Username is required' });
  }
  const friends = await getFriends(username);
  if (!friends || friends.length === 0) {
    console.log(`No friends found for user: ${username}`);
    return [];
  }
  const onlineFriends = [];
  friends.forEach((friend) => {
    if (connectionManager.getUserConnections(friend.userId) !== undefined) {
      onlineFriends.push(friend.username);
    }
  });
  return reply.code(200).send({ friends: onlineFriends });
}

export const connectionManager = {
  addConnection,
  removeConnection,
  getUserConnections,
  getUserConnectionsBySession,
  getConnectedUsers,
  updateUsernameInConnections,
  getOnlineFriendsHandler,
  getUserNameById,
  getNamesOfConnectedUsers,
  printUsers,
};
