import { messageManager } from '../managers/messageManager.js';
import { Game } from './Game.js';

const activeGames = new Map();
const connectedUsers = new Set();
const waitingPlayers = [];

// Counter for generating unique game IDs
let gameIdCounter = 1;

function generateGameId() {
  return `game_${gameIdCounter++}`;
}

function addPlayerToWaitingList(connection) {
  if () {
    console.log('Player already in game:', connection.userId);
    return;
  }
  const existingPlayer = waitingPlayers.find((player) => player.userId === connection.userId);
  if (existingPlayer) {
    console.log('Player already in waiting list:', connection.userId);
    return;
  }
  waitingPlayers.push(connection);
  messageManager.createBroadcast({
    type: 'waitingForOpponent',
  }).to.socket(connection.socket);

  console.log('Added player to waiting list:', connection.userId);
  matchPlayers();
}

function removeFromWaitingList(userId) {
  const index = waitingPlayers.findIndex((player) => player.userId === userId);
  if (index !== -1) {
    waitingPlayers.splice(index, 1);
    console.log('Removed player from waiting list:', userId);
  }
}

function matchPlayers() {
  while (waitingPlayers.length >= 2) {
    const player1 = waitingPlayers.shift();
    const player2 = waitingPlayers.shift();

    if (player1 && player2) {
      createGame(player1, player2);
    }
  }
}

function createGame(connection1, connection2) {
  const gameId = generateGameId();
  const game = new Game(connection1, connection2);

  activeGames.set(gameId, game);

  connection1.updateState('inGame');
  connection2.updateState('inGame');

  messageManager.createBroadcast({
    type: 'gameStarting',
    opponent1: connection1.userId,
    opponent2: connection2.userId,
  }).to.sockets([connection1.socket, connection2.socket]);

  game.startGame();
  console.log('Created new game:', gameId);
}

function removeGame(gameId) {
  const game = activeGames.get(gameId);
  if (game) {
    game.stopGame();
    game.players.forEach(player => {
      player.connection.updateState('idle');
    });
    activeGames.delete(gameId);
    console.log('Removed game:', gameId);
  }
}

function findGameByPlayerId(userId) {
  for (const [_, game] of activeGames) {
    if (game.players.some(p => p.connection.userId === userId)) {
      return game;
    }
  }
  return null;
}

function handleInput(userId, direction) {
  const game = findGameByPlayerId(userId);
  if (game) {
    game.handleInput(userId, direction);
  } else {
    console.warn('No game found for player:', userId);
  }
}

function handleDisconnect(userId) {
  // Remove from waiting list if present
  removeFromWaitingList(userId);

  // Find and end any active game
  const game = findGameByPlayerId(userId);
  if (game) {
    const [gameId] = Array.from(activeGames.entries())
      .find(([_, g]) => g === game) || [];

    if (gameId) {
      // Notify other player
      const otherPlayer = game.players.find(p => p.connection.userId !== userId);
      if (otherPlayer) {
        messageManager.createMessage({
          type: 'opponentDisconnected'
        }).to.socket(otherPlayer.connection.socket);
      }

      removeGame(gameId);
    }
  }
}

function cleanupInactivePlayers() {
  const TIMEOUT = 5 * 60 * 1000; // 5 minutes
  const now = Date.now();

  waitingPlayers.forEach((player, index) => {
    if (now - player.timestamp > TIMEOUT) {
      messageManager.createMessage({
        type: 'matchmakingTimeout'
      }).to.socket(player.connection.socket);

      waitingPlayers.splice(index, 1);
    }
  });
}

// Set up cleanup interval
setInterval(cleanupInactivePlayers, 60000); // Run every minute

function getActiveGamesCount() {
  return activeGames.size;
}

function getWaitingPlayersCount() {
  return waitingPlayers.length;
}

export const gameManager = {
  addPlayerToWaitingList,
  removeFromWaitingList,
  handleInput,
  handleDisconnect,
  removeGame,
  findGameByPlayerId,
  getActiveGamesCount,
  getWaitingPlayersCount
};