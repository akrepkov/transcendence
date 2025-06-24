const connectedUsers = new Map();

function addConnection(newConnection) {
  const userId = newConnection.userId;
  console.log('New connection from user:', userId);

  if (!connectedUsers.has(userId)) {
    console.log('New User connected');
    connectedUsers.set(userId, new Set());
  } else {
    console.log('We already had this one');
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
    console.log(userId, 'has', connections.size, 'connections');
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

// export class WebSocketManager {
//     constructor() {
//         this.connectedUsers = new Map();
//         console.log('Created websocket manager');
//     }
//
//     #addConnection(newConnection) {
//         const userId = newClient.userId;
//         console.log('New connection from user:', userId);
//
//         if (!this.connectedUsers.has(userId)) {
//             console.log('New User connected');
//             this.connectedUsers.set(userId, new Set());
//         } else {
//             console.log('We already had this one');
//         }
//
//         let userClients = this.connectedUsers.get(userId);
//         userClients.add(newClient);
//         this.#printUsers();
//     }
//
//     #removeClient(connection) {
//         // possibly add stuff for removing from game
//         let userClients = this.connectedUsers.get(client.userId);
//         userClients.delete(client);
//         if (userClients.size === 0) {
//             this.connectedUsers.delete(client.userId);
//         }
//         this.#printUsers();
//     }
//
//     #printUsers() {
//         console.log('We currently have', this.connectedUsers.size, 'unique users connected:\n');
//         this.connectedUsers.forEach((clients, userId) => {
//             console.log(userId, 'has', clients.size, 'connections');
//         });
//     }
//
//     #setupSocketEvents(socket, client) {
//         socket.on('message', (message) => {
//             console.log('Message.');
//         });
//
//         socket.on('close', (code, reason) => {
//             console.log('Connection closed.:', code, ':', reason.toString());
//             this.#removeClient(client);
//         });
//
//         socket.on('error', (error) => {
//             console.error('Websocket error:', error);
//         });
//     }
//
//     handleNewConnection(socket, decodedToken) {
//         let newClient = new Client(socket, decodedToken.email);
//         this.#addClient(newClient);
//
//         console.log('New connection from user:', newClient.userId);
//
//         this.#setupSocketEvents(socket, newClient);
//     }
// }
