import { WebSocketManager } from './managers/WebSocketManager.js';
import jwt from 'jsonwebtoken';
import cookie from '@fastify/cookie';
import { JWT_SECRET } from '../config.js';

const wsManager = new WebSocketManager();

// const JWT_SECRET = '' + process.env.JWT_SECRET;

export function websocketHandler(socket, req) {
  // const token = req.cookie.token;

  const token = req.cookies.token || null;
  console.log('Websocket connection request received with token:', token);
  if (!token) {
    console.log('No token found');
    socket.close(1008, 'No token provided');
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Successfully decoded token:', decoded);

    wsManager.handleNewConnection(socket);
  } catch (error) {
    console.error('Token verification failed. Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);

    socket.close(1008, 'Invalid token');
    return;
  }

  // const cookies = cookie.parse(req.headers.cookie || '');
  // console.log('Websocket connection request received with cookies:', cookies);
  // email = cookies.email || null;
  // console.log('Websocket connection request received with email:', email);
  // email2 = jwt.decode(token)?.email || null;
  // console.log('Websocket connection request received with email2:', email2);
  // const email3 = jwt.verify(token, process.env.JWT_SECRET);
  // console.log('Websocket connection request received with email3:', email3);
  // const sessionId = req.cookies.sessionId;

  // console.log('Websocket connection request received with token:', token);
  // console.log('Websocket connection request received with sessionId:', sessionId);

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
