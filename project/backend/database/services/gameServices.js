import prisma from '../prisma/prismaClient.js';

export async function saveGame({ gameId, winnerName, loserName, scoreWinner, scoreLoser }) {
  const game = prisma.game.create({ where : { gameId : gameId},
          { player1Id : winnerName }, 
          { played2Id : loserName },
          { winnerId : winnerName },
          { player1Score : scoreWinner },
          { player2Score : scoreLoser } });

  return;
}
