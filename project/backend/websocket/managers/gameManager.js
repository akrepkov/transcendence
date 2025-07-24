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
    console.log('Player already in game:', connection.username);
    throw new Error(`${REJECT.PLAYER_IN_GAME}`);
  }
  if (waitingPlayers.some((player) => player.userId === connection.userId)) {
    console.log('Player already in waiting list:', connection.username);
    throw new Error(`${REJECT.PLAYER_IN_WAITING_ROOM}`);
  }
  connection.updateState('waitingRoom');
  waitingPlayers.push(connection);
  messageManager
    .createBroadcast({
      type: 'waitingForOpponent',
    })
    .to.single(connection.socket);

  console.log('Added player to waiting list:', connection.username);
}

function matchPlayers() {
  console.log('Matching players...');
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
    console.warn('Connection is not in waiting list:', connection.username);
    throw new Error(`${REJECT.NOT_IN_WAITING_ROOM}`);
  }
  const index = waitingPlayers.findIndex((player) => player.userId === connection.userId);
  if (index !== -1) {
    waitingPlayers.splice(index, 1);
    connection.updateState('idle');
    console.log('Removed player from waiting list:', connection.username);
  } else {
    console.warn('Player not found in waiting list:', connection.username);
    connection.updateState('idle');
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
      opponent1: connection1.username,
      opponent2: connection2.username,
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

function handleInput(connection, direction) {
  if (connection.state !== 'inGame') {
    console.warn('Connection is not in game:', connection.username);
    throw new Error(`${REJECT.NOT_IN_GAME}`);
  }
  const game = activeGames.get(playingUsers.get(connection.userId)) || null;
  if (game) {
    game.handleInput(connection.userId, direction);
  } else {
    console.warn('No game found for player:', connection.username);
    connection.updateState('idle');
  }
}

function handleDisconnect(connection, reason = 'disconnected') {
  if (connection.state === 'waitingRoom') {
    removeFromWaitingList(connection);
  } else if (connection.state === 'inGame') {
    const game = activeGames.get(playingUsers.get(connection.userId)) || null;
    if (game) {
      const otherPlayer = game.playerConnections.find(
        (player) => player.userId !== connection.userId,
      );
      if (otherPlayer) {
        messageManager
          .createBroadcast({
            type: 'opponentDisconnected',
            reason: reason,
          })
          .to.single(otherPlayer.socket);
      }
      removeGame(game.gameId);
    } else {
      console.warn('No game found for player:', connection.username);
      connection.updateState('idle');
    }
  } else if (connection.closing === false) {
    console.warn('Connection is not in game or waiting room:', connection.username);
    throw new Error(`${REJECT.NOT_IN_GAME}`);
  }
}

function getActiveGamesCount() {
  return activeGames.size;
}

function getWaitingPlayersCount() {
  return waitingPlayers.length;
}

function printGameSystemStatus() {
  let statusReport = '\n=== START Game System Status ===\n';

  let amountOfGames = getActiveGamesCount();
  let amountOfWaitingPlayers = getWaitingPlayersCount();

  statusReport += `\nWaiting Players (${amountOfWaitingPlayers}):\n`;
  if (amountOfWaitingPlayers > 0) {
    waitingPlayers.forEach((player) => {
      statusReport += `- Player ${player.username}\n`;
    });
  } else {
    statusReport += '- No players waiting\n';
  }

  // Active games info
  statusReport += `\nActive Games (${amountOfGames}):\n`;
  if (amountOfGames > 0) {
    activeGames.forEach((game, gameId) => {
      const player1 = game.players[0].playerName;
      const player2 = game.players[1].playerName;
      statusReport += `- Game ${gameId}: ${player1} vs ${player2}\n`;
    });
  } else {
    statusReport += '- No active games\n';
  }

  // Connected users info
  statusReport += `\nTotal Connected Users: ${playingUsers.size}\n`;
  statusReport += `\n=== END Game System Status ===\n`;

  console.log(statusReport);
  return statusReport;
}

const matchmakingInterval = setInterval(matchPlayers, 5000);

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
