import prisma from '../prisma/prismaClient.js';
import * as userServices from './userServices.js';

// save the game in the db
export async function savePong(winnerName, loserName, scoreWinner, scoreLoser) {
  const winner = await userServices.getUserByUsername(winnerName);
  const loser = await userServices.getUserByUsername(loserName);
  if (!winner || !loser) {
    console.log('Player not found in the database');
    return false;
  }
  try {
    const pong = await prisma.pong.create({
      data: {
        player1Name: winner.username,
        player2Name: loser.username,
        winnerName: winner.username,
        player1Score: scoreWinner,
        player2Score: scoreLoser,
      },
    });
    console.log('Created game:', pong); // Add this line
    return pong;
  } catch (error) {
    console.error('Error saving game:', error);
    return false;
  }
}

// Find game saved in the db by its ID
export async function getPong(gameId) {
  try {
    const pong = await prisma.pong.findUnique({ gameId });
    return pong;
  } catch (error) {
    console.error('Game ID not found');
    return false;
  }
}

// Delete game saved in the db by its ID
export async function deletePong(gameId) {
  try {
    const pong = await prisma.pong.delete({
      where: { gameId },
    });
    return true;
  } catch (error) {
    console.error('Error deleting game', error);
    return false;
  }
}

// save the game in the db
export async function saveSnake(winnerName, loserName, scoreWinner, scoreLoser) {
  const winner = await userServices.getUserByUsername(winnerName);
  const loser = await userServices.getUserByUsername(loserName);
  if (!winner || !loser) {
    console.log('Player not found in the database');
    return false;
  }
  try {
    const snake = await prisma.snake.create({
      data: {
        player1Name: winner.username,
        player2Name: loser.username,
        winnerName: winner.username,
        player1Score: scoreWinner,
        player2Score: scoreLoser,
      },
    });
    console.log('Created game:', snake); // Add this line
    return snake;
  } catch (error) {
    console.error('Error saving game:', error);
    return false;
  }
}

// Find game saved in the db by its ID
export async function getSnake(gameId) {
  try {
    const snake = await prisma.snake.findUnique({ gameId });
    return snake;
  } catch (error) {
    console.error('Game ID not found');
    return false;
  }
}

// Delete game saved in the db by its ID
export async function deleteSnake(gameId) {
  try {
    const snake = await prisma.snake.delete({
      where: { gameId },
    });
    return true;
  } catch (error) {
    console.error('Error deleting game', error);
    return false;
  }
}
