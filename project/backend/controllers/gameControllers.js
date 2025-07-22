import * as authServices from '../database/services/authServices.js';
import * as userServices from '../database/services/userServices.js';
import * as gameServices from '../database/services/gameServices.js';

const saveGameHandler = (request, reply) => {
  const { winnerName, loserName, scoreWinner, scoreLoser } = request.body;
  if (!winnerName || !loserName || !scoreWinner || !scoreLoser) {
    return reply.status(400).send({ error: 'Player names and scores are required' });
  }

  const gameId = gameServices.saveGame(winnerName, loserName, scoreWinner, scoreLoser);
  if (!gameId) {
    return reply.status(500).send({ error: 'Failed to save game results' });
  }
  if (!userServices.saveGameResults(winnerName, loserName, gameId)) {
    return reply.status(500).send({ error: 'Failed to save player scores' });
  }
  reply.send({ message: 'Game results saved', gameId });
};

const getGameHandler = (request, reply) => {
  const { gameId } = request.body;
  if (!gameId) {
    return reply.status(400).send({ error: 'Game ID is required' });
  }

  const { game } = gameServices.getGame(gameId);
  if (!game) {
    return reply.status(500).send({ error: 'Unable to retrieve game' });
  }
  reply.send({ message: 'Game retrieved', game });
};

export default {
  saveGameHandler,
  getGameHandler,
};
