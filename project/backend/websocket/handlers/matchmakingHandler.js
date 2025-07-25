import { gameManager } from '../managers/gameManager.js';
import { waitingListManager } from '../managers/waitingListManager.js';

const MATCHMAKING_INTERVAL = 5000; // 5 seconds
const MAX_WAIT_TIME = 10; // 10 seconds
const MAX_RANK_DIFFERENCE = 5; // Players can be matched if their ranks differ by 5 or less

function getPlayerRank() {
  return Math.floor(Math.random() * 100);
}

function isMatchable(player1, player2) {
  if (player1.waited >= MAX_WAIT_TIME && player2.waited >= MAX_WAIT_TIME) {
    return true; // Both players have waited at least 10 seconds
  }
  if (Math.abs(player1.rank - player2.rank) <= MAX_RANK_DIFFERENCE) {
    return true; // Players are within 5 ranks of each other
  }
  return false;
}

function matchPlayersByGameType(gameType, players) {
  let i = 0;

  while (i < players.length) {
    const player1 = players[i];
    let matched = false;

    for (let j = i + 1; j < players.length; ++j) {
      const player2 = players[j];

      if (!isMatchable(player1, player2)) {
        continue;
      }

      matched = true;
      players.splice(j, 1); // Removes player2
      players.splice(i, 1); // Removes player1
      gameManager.createGame(player1.connection, player2.connection, gameType);
      break; // Breaks the inner loop to restart matching with the next player1
    }

    if (!matched) {
      player1.waited += 5; // Increment wait time for player1
      i++; // We remove player1 from the list if a match was found, so we only increment if there was no match
    }
  }
}

function matchPlayers() {
  let waitingPlayerByGameType = {
    pong: waitingListManager.getWaitingPlayers().filter((player) => player.gameType === 'pong'),
    snake: waitingListManager.getWaitingPlayers().filter((player) => player.gameType === 'snake'),
  };
  for (const gameType in waitingPlayerByGameType) {
    let players = waitingPlayerByGameType[gameType];
    matchPlayersByGameType(gameType, players);
  }

  // After matching, update the waiting list with remaining players
  waitingListManager.setWaitingPlayers(
    waitingPlayerByGameType.pong.concat(waitingPlayerByGameType.snake),
  );
  gameManager.printGameSystemStatus();
}

let matchmakingInterval;

function unsetMatchmakingInterval() {
  if (matchmakingInterval) {
    clearInterval(matchmakingInterval);
  }
}

function setMatchmakingInterval() {
  if (matchmakingInterval) {
    matchmakingInterval = setInterval(matchPlayers, MATCHMAKING_INTERVAL);
  }
}

export const matchmakingHandler = {
  setMatchmakingInterval,
  unsetMatchmakingInterval,
  getPlayerRank,
};
