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
    return reply.status(400).send({ error: 'Failed to save game results' });
  }
  if (!userServices.saveGameResults(winnerName, loserName, gameId)) {
    return reply.status(400).send({ error: 'Failed to save player scores' });
  }
  reply.send({ message: 'Game results saved', gameId });
};

const getGameHandler = async (request, reply) => {
  const { gameId } = request.body;
  if (!gameId) {
    return reply.status(400).send({ error: 'Game ID is required' });
  }

  const { game } = gameServices.getGame(gameId);
  if (!game) {
    return reply.status(400).send({ error: 'Unable to retrieve game' });
  }
  reply.send({ message: 'Game retrieved', game });
};

const tournamentHandler = async (request, reply) => {
  const { username } = request.body || {};
  if (!username) {
    return reply.status(400).send({ error: 'Username is required' });
  }
  await userServices.updateTournamentWins(username);
  reply.send({ mssage: 'Tournament Win saved.' });
};

export default {
  saveGameHandler,
  getGameHandler,
  tournamentHandler,
};
