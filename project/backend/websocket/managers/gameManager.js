import { messageManager } from './messageManager.js';
import { Game } from '../models/Game.js';
import { REJECT } from './messageManager.js';

const activeGames = new Map();
const playingUsers = new Map();
const waitingPlayers = [];

// Counter for generating unique game IDs
let gameIdCounter = 1;

function generateGameId() {
  return `game_${gameIdCounter++}`;
}

function addPlayerToWaitingList(connection) {
  if (playingUsers.has(connection.userId)) {
    console.log('Player already in game:', connection.userId);
    messageManager.sendSocketRejection(connection.socket, REJECT.PLAYER_IN_GAME);
    return;
  }
  if (waitingPlayers.some((player) => player.userId === connection.userId)) {
    console.log('Player already in waiting list:', connection.userId);
    messageManager.sendSocketRejection(connection.socket, REJECT.PLAYER_IN_WAITING_ROOM);
    return;
  }
  connection.updateState('waitingRoom');
  waitingPlayers.push(connection);
  messageManager
    .createBroadcast({
      type: 'waitingForOpponent',
    })
    .to.single(connection.socket);

  console.log('Added player to waiting list:', connection.userId);
  matchPlayers();
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

function removeFromWaitingList(connection) {
  if (connection.state !== 'waitingRoom') {
    console.warn('Player is not in waiting list:', connection.userId);

    return;
  }
  const index = waitingPlayers.findIndex((player) => player.userId === userId);
  if (index !== -1) {
    waitingPlayers.splice(index, 1);
    console.log('Removed player from waiting list:', userId);
  }
}

function createGame(connection1, connection2) {
  const gameId = generateGameId();
  const game = new Game(connection1, connection2, gameId);
  activeGames.set(gameId, game);

  connection1.updateState('inGame');
  connection2.updateState('inGame');

  messageManager
    .createBroadcast({
      type: 'gameStarting',
      opponent1: connection1.userId,
      opponent2: connection2.userId,
    })
    .to.sockets([connection1.socket, connection2.socket]);

  playingUsers.set(connection1.userId, gameId);
  playingUsers.set(connection2.userId, gameId);
  game.startGame();
  console.log('Created new game:', gameId);
}

function removeGame(gameId) {
  const game = activeGames.get(gameId);
  if (game) {
    game.stopGame();
    game.playerConnections.forEach((connection) => {
      connection.updateState('idle');
      playingUsers.delete(connection.userId);
    });
    activeGames.delete(gameId);
    console.log('Removed game:', gameId);
  }
}

function handleInput(userId, direction) {
  const game = activeGames.get(playingUsers.get(userId)) || null;
  if (game) {
    game.handleInput(userId, direction);
  } else {
    console.warn('No game found for player:', userId);
  }
}

function handleDisconnect(userId, reason = 'disconnected') {
  removeFromWaitingList(userId);

  const game = activeGames.get(playingUsers.get(userId)) || null;
  if (game) {
    const otherPlayer = game.playerConnections.find((connection) => connection.userId !== userId);
    if (otherPlayer) {
      messageManager
        .createBroadcast({
          type: 'opponentDisconnected',
          reason: reason,
        })
        .to.single(otherPlayer.socket);
    }
    removeGame(game.gameId);
  }
}

function getActiveGamesCount() {
  return activeGames.size;
}

function getWaitingPlayersCount() {
  return waitingPlayers.length;
}

function printGameSystemStatus() {
  let statusReport = '=== Game System Status ===\n';

  let amountOfGames = getActiveGamesCount();
  let amountOfWaitingPlayers = getWaitingPlayersCount();

  statusReport += `\nWaiting Players (${amountOfWaitingPlayers}):\n`;
  if (amountOfWaitingPlayers > 0) {
    waitingPlayers.forEach((player) => {
      statusReport += `- Player ${player.userId}\n`;
    });
  } else {
    statusReport += '- No players waiting\n';
  }

  // Active games info
  statusReport += `\nActive Games (${amountOfGames}):\n`;
  if (amountOfGames > 0) {
    activeGames.forEach((game, gameId) => {
      const player1 = game.players[0].userId;
      const player2 = game.players[1].userId;
      statusReport += `- Game ${gameId}: ${player1} vs ${player2}\n`;
    });
  } else {
    statusReport += '- No active games\n';
  }

  // Connected users info
  statusReport += `\nTotal Connected Users: ${playingUsers.size}\n`;

  console.log(statusReport);
  return statusReport;
}

export const gameManager = {
  addPlayerToWaitingList,
  printGameSystemStatus,
  removeFromWaitingList,
  handleInput,
  handleDisconnect,
  removeGame,
  getActiveGamesCount,
  getWaitingPlayersCount,
};
