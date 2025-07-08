import { messageManager } from 'messageManager.js';
import { Game } from '../models/Game.js';

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
    return;
  }
  if (waitingPlayers.some((player) => player.userId === connection.userId)) {
    console.log('Player already in waiting list:', connection.userId);
    return;
  }
  connection.updateState('waitingRoom');
  waitingPlayers.push(connection);
  messageManager
    .createBroadcast({
      type: 'waitingForOpponent',
    })
    .to.socket(connection.socket);

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

function handleDisconnect(userId) {
  removeFromWaitingList(userId);

  const game = activeGames.get(playingUsers.get(userId)) || null;
  if (game) {
    const otherPlayer = game.playerConnections.find((connection) => connection.userId !== userId);
    if (otherPlayer) {
      messageManager
        .createBroadcast({
          type: 'opponentDisconnected',
        })
        .to.socket(otherPlayer.socket);
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

// function printGameSystemStatus() {
//   let statusReport = '=== Game System Status ===\n';
//
//   statusReport += `\nWaiting Players (${waitingPlayers.length}):\n`;
//   if (waitingCount > 0) {
//     waitingPlayers.forEach(player => {
//       const waitTime = Math.round((Date.now() - player.timestamp) / 1000);
//       statusReport += `- Player ${player.userId} (waiting for ${waitTime} seconds)\n`;
//     });
//   } else {
//     statusReport += '- No players waiting\n';
//   }
//
//   // Active games info
//   statusReport += `\nActive Games (${activeGames}):\n`;
//   if (activeGames > 0) {
//     activeGames.forEach((game, gameId) => {
//       const player1 = game.players[0].connection.userId;
//       const player2 = game.players[1].connection.userId;
//       statusReport += `- Game ${gameId}: ${player1} vs ${player2}\n`;
//     });
//   } else {
//     statusReport += '- No active games\n';
//   }
//
//   // Connected users info
//   statusReport += `\nTotal Connected Users: ${connectedUsers.size}\n`;
//
//   console.log(statusReport);
//   return statusReport;
// }

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
