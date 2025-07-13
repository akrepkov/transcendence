import * as authServices from '../database/services/authServices.js';
import * as userServices from '../database/services/userServices.js';
import * as userServices from '../database/services/gameServices.js';
import { handleError } from '../utils/utils.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';



const saveGameHandler = (request, reply) => {
  const { winnerName, loserName } = request.body;
  if (!winnerName || !loserName) {
    return reply.status(400).send({ error: 'Player names are required' });
  }

  const gameId = gameServices.saveGame(winnerName, loserName);

  if (!userServices.saveGameResults(winnerName, loserName) || !gameId) {
    return reply.status(500).send({ error: 'Failed to save game results' });
  }

  reply.send({ message: 'Game results saved', gameId });
};