import { messageManager } from './messageManager.js';
import { Pong } from '../models/pong/Pong.js';
import { Snake } from '../models/snake/Snake.js';
import { REJECT } from './messageManager.js';
import { matchmakingHandler } from '../handlers/matchmakingHandler.js';
import { waitingListManager } from './waitingListManager.js';
import * as gameServices from '../../database/services/gameServices.js';
import { saveGameResults } from '../../database/services/userServices.js';

const activeGames = new Map();
const playingUsers = new Map();

// Counter for generating unique game IDs
let gameIdCounter = 1;

function generateGameId() {
  return `game_${gameIdCounter++}`;
}

function createGame(connection1, connection2, gameType) {
  const gameId = generateGameId();
  let game;
  if (gameType === 'pong') {
    game = new Pong(connection1, connection2, gameId);
  } else if (gameType === 'snake') {
    console.log('Creating Snake game, sssssssssss');
    game = new Snake(connection1, connection2, gameId);
  }
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
    printGameSystemStatus();
  }
}

async function saveGameInDatabase(gameId, winnerName, loserName, scoreWinner, scoreLoser) {
  const game = activeGames.get(gameId);
  if (!game) {
    console.error('Game not found:', gameId);
    return;
  }
  if (game instanceof Pong) {
    const databaseGame = await gameServices.savePong(
      winnerName,
      loserName,
      scoreWinner,
      scoreLoser,
    );
    if (databaseGame && (await saveGameResults('pong', winnerName, loserName, databaseGame))) {
      console.log(
        `Game saved: winner: ${winnerName} loser: ${loserName}, score: ${scoreWinner} - ${scoreLoser}`,
      );
    } else {
      console.error('Failed to save game results in database');
    }
    // } else if (game instanceof Snake) {
    //   const databaseGame = gameServices.saveSnake(winnerName, loserName, scoreWinner, scoreLoser);
    //   if (databaseGame && saveGameResults('snake', winnerName, loserName, databaseGame)) {
    //     console.log(`Game saved: winner: ${winnerName} loser: ${loserName}, score: ${scoreWinner} - ${scoreLoser}`);
    //   } else {
    //     console.error('Failed to save game results in database');
    //   }
  } else {
    console.error('Unknown game type:', game);
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

async function handleDisconnect(connection, reason = 'disconnected') {
  if (connection.state === 'waitingRoom') {
    waitingListManager.removeFromWaitingList(connection);
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
      await saveGameInDatabase(
        game.gameId,
        otherPlayer.username,
        connection.username,
        game.players[0].score,
        game.players[1].score,
      );
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

function printGameSystemStatus() {
  let statusReport = '\n=== START Pong System Status ===\n';

  let amountOfGames = getActiveGamesCount();
  let amountOfWaitingPlayers = waitingListManager.getWaitingPlayers().length;

  statusReport += `\nWaiting Players (${amountOfWaitingPlayers}):\n`;
  if (amountOfWaitingPlayers > 0) {
    waitingListManager.getWaitingPlayers().forEach((player) => {
      statusReport += `- Player ${player.connection.username} with rank ${player.rank} has been waiting ${player.waited} seconds, for ${player.gameType}\n`;
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

matchmakingHandler.setMatchmakingInterval();

export const gameManager = {
  printGameSystemStatus,
  handleInput,
  handleDisconnect,
  saveGameInDatabase,
  removeGame,
  createGame,
  getActiveGames: () => activeGames,
  getPlayingUsers: () => playingUsers,
  getActiveGamesCount,
};
