// import {handleError} from '../utils/utils.js';

const clients = new Set();

const chatWebsocketHandler = (connection) => {
  // Add the connection to the clients set
  clients.add(connection);
  console.log('Client connected. Total:', clients.size);

  // Handle incoming messages
  connection.on('message', (message) => {
    const msgText = message.toString();
    console.log('Received:', msgText);

    // Broadcast the message to all other connected clients
    for (const client of clients) {
      if (client.readyState === 1 && client!== connection) {
        client.send(msgText);
      }
    }
  });

  // Handle when the connection is closed
  connection.on('close', () => {
    clients.delete(connection);
    console.log('Client disconnected. Total:', clients.size);
  });
};


export default {
  chatWebsocketHandler
};