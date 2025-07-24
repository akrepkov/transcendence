import prisma from '../prisma/prismaClient.js';
import * as userServices from './userServices.js';

// save the game in the db
export async function saveGame(winnerName, loserName, scoreWinner, scoreLoser) {
  const winner = await userServices.getUserByUsername(winnerName);
  const loser = await userServices.getUserByUsername(loserName);
  if (!winner || !loser) {
    console.log('Player not found in the database');
    return false;
  }
  try {
    const game = await prisma.game.create({
      data: {
        player1Id: winner.userId,
        player2Id: loser.userId,
        winnerId: winner.userId,
        player1Score: scoreWinner,
        player2Score: scoreLoser,
      },
    });
    console.log('Created game:', game); // Add this line
    return game;
  } catch (error) {
    console.error('Error saving game:', error);
    return false;
  }
}

// Find game saved in the db by its ID
export async function getGame(gameId) {
  try {
    const game = await prisma.game.findUnique({ gameId });
    return game;
  } catch (error) {
    console.error('Game ID not found');
    return false;
  }
}

// Delete game saved in the db by its ID
export async function deleteGame(gameId) {
  try {
    const game = await prisma.game.delete({
      where: { gameId },
    });
    return true;
  } catch (error) {
    console.error('Error deleting game', error);
    return false;
  }
}
