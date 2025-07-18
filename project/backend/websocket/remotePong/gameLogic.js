import { Game } from './gameClass.js';
import { globalPlayers, getPlayerById, updatePlayerStatus } from './websocketRemote.js';

export let leftPlayerScore = 0;
export let rightPlayerScore = 0;

let gameId = 1;

export class GameManager {
  constructor() {
    console.log('Created game manager');
    this.games = [];
  }

  removeGame(gameId) {
    this.games = this.games.filter((game) => game.gameId !== gameId);
  }

  getGameByPlayerId(playerId) {
    return this.games.find((game) => game.players.some((p) => p.id === playerId));
  }

  startGame(height, width, inviterId, opponentId) {
    let game = new Game(height, width, gameId);
    game.addPlayer(inviterId);
    game.addPlayer(opponentId);
    const inviter = getPlayerById(inviterId);
    const opponent = getPlayerById(opponentId);
    if (inviter && opponent) {
      updatePlayerStatus(inviter, 'playing', opponentId, gameId);
      updatePlayerStatus(opponent, 'playing', inviterId, gameId);
    }
    gameId++;
    this.games.push(game);
    game.gameLoop();
  }

  handlepaddleMovement(playerId, direction) {
    let game = this.getGameByPlayerId(playerId);
    if (!game) {
      console.error('Game not found for player:', playerId);
      return;
    }
    game.handleInput(playerId, direction);
  }

  stopGame(playerId) {
    let game = this.getGameByPlayerId(playerId);
    if (!game) {
      console.error('Game not found for player:', playerId);
      return;
    }
    if (!game.running) {
      console.log('Game already stopped:', game.gameId);
      return;
    }
    console.log('Stop game for: ', game.players[0].id, game.players[1].id);
    globalPlayers
      .filter((p) => p.gameId === game.gameId)
      .forEach((p) => {
        console.log('Go to waiting ', p.id);
        updatePlayerStatus(p, 'waiting');
      });
    game.stopGame();
    this.removeGame(game.gameId);
    console.log('Game stopped for player:', playerId);
  }
}
