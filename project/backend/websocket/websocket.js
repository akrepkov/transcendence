import { WebSocketManager } from './managers/WebSocketManager.js';

const wsManager = new WebSocketManager();

export function websocketHandler(socket) {
  wsManager.handleNewConnection(socket);
  console.log('hello');
  socket.on('message', (message) => {
    console.log('Message.');
    console.log(message);
    console.log(message.toString());
    console.log(message.type);
  });

  // TODO handle closing and errors, potentially adding reconnect depending on reason
  socket.on('close', (code, reason) => {
    console.log('Connection closed.: ', code, reason.toString());
  });

  // TODO again handle errors depending on code
  socket.on('error', (error) => {
    console.error('Websocket error:', error);
  });
}

// export default {
//   websocketHandler,
// };
