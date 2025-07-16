import prisma from '../prisma/prismaClient.js';

// save the game in the db
export async function saveGame({ winnerName, loserName, scoreWinner, scoreLoser }) {
  try {
    const game = await prisma.game.create({
      data: {
        player1Id: winnerName,
        player2Id: loserName,
        winnerId: winnerName,
        player1Score: scoreWinner,
        player2Score: scoreLoser,
      },
    });
    return true;
  } catch (error) {
    console.error('Error saving game:', error);
    return false;
  }
}

// Find game saved in the db by its ID
export async function getGame({ gameId }) {
  try {
    const game = await prisma.game.findUnique({ gameId });
    return game;
  } catch (error) {
    console.error('Game ID not found');
    return false;
  }
}
