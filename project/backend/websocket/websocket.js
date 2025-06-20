import { WebSocketManager } from './managers/WebSocketManager.js';
import jwt from 'jsonwebtoken';
import cookie from '@fastify/cookie';
import authcontrollers from '../controllers/authControllers.js';
const { authenticateSocketConnection } = authcontrollers;

const wsManager = new WebSocketManager();

export function websocketHandler(socket, req) {
  const decodedToken = authenticateSocketConnection(req, socket);
  console.log('Decoded token:', decodedToken);
  if (!decodedToken) {
    return;
  }
  wsManager.handleNewConnection(socket, decodedToken);
}
