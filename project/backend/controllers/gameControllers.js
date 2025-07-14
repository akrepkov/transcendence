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

  if (!userServices.saveWinnerHandler(request, reply)) {
    return reply.status(500).send({ error: 'Failed to save player scores' });
  }
  reply.send({ message: 'Game results saved', gameId });
};

export { saveGameHandler };
