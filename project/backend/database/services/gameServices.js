import prisma from '../prisma/prismaClient.js';

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
