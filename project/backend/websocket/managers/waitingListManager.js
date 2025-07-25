import { messageManager } from './messageManager.js';
import { Pong } from '../models/pong/Pong.js';
import { REJECT } from './messageManager.js';
import { matchmakingHandler } from '../handlers/matchmakingHandler.js';
import { gameManager } from './gameManager.js';

let waitingPlayers = [];

function addPlayerToWaitingList(connection, gameType) {
  if (gameManager.getPlayingUsers().has(connection.userId)) {
    console.log('Player already in game:', connection.username);
    throw new Error(`${REJECT.PLAYER_IN_GAME}`);
  }
  if (waitingPlayers.some((player) => player.userId === connection.userId)) {
    console.log('Player already in waiting list:', connection.username);
    throw new Error(`${REJECT.PLAYER_IN_WAITING_ROOM}`);
  }
  if (gameType !== 'pong' && gameType !== 'snake') {
    console.warn(`User ${connection.username} specified invalid game type:`, gameType);
    throw new Error(`${REJECT.INVALID_GAME_TYPE}`);
  }
  connection.updateState('waitingRoom');
  waitingPlayers.push({
    connection,
    gameType,
    userId: connection.userId,
    waited: 0,
    rank: matchmakingHandler.getPlayerRank(),
  });
  messageManager
    .createBroadcast({
      type: 'waitingForOpponent',
    })
    .to.single(connection.socket);

  console.log('Added player to waiting list:', connection.username);
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

function setWaitingPlayers(players) {
  waitingPlayers = players;
}

export const waitingListManager = {
  addPlayerToWaitingList,
  removeFromWaitingList,
  setWaitingPlayers,
  getWaitingPlayers: () => waitingPlayers,
};
