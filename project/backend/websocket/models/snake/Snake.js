import { messageManager } from '../../managers/messageManager.js';
import { gameManager } from '../../managers/gameManager.js';
import { REJECT } from '../../managers/messageManager.js';
import { SnakePlayer } from './Player.js';
import { Apple } from './Apple.js';

export const SNAKE_CONSTS = {
  WIDTH: 800,
  HEIGHT: 600,
  SNAKE_SPEED: 20,
  LEFT_PLAYER: [{ x: 0, y: 300 }],
  RIGHT_PLAYER: [{ x: 780, y: 300 }],
  MAX_SCORE: 5,
};

export class Snake {
  constructor(connection1, connection2, gameId) {
    this.gameId = gameId;
    this.apple = new Apple();
    this.players = [
      new SnakePlayer(connection1.username, connection1.userId, SNAKE_CONSTS.LEFT_PLAYER),
      new SnakePlayer(connection2.username, connection2.userId, SNAKE_CONSTS.RIGHT_PLAYER),
    ];
    this.playerSockets = [connection1.socket, connection2.socket];
    this.playerConnections = [connection1, connection2];
    this.state = {
      players: this.players,
      apple: this.apple,
    };
    this.gameLoop = null;
    this.running = false;
  }

  handleInput(playerId, direction) {
    const player = this.players.find((player) => player.playerId === playerId);
    switch (direction) {
      case 'up':
        if (player.directions.y != 1) player.directions = { x: 0, y: -1 };
        break;
      case 'down':
        if (player.directions.y != -1) player.directions = { x: 0, y: 1 };
        break;
      case 'left':
        if (player.directions.x != 1) player.directions = { x: -1, y: 0 };
        break;
      case 'right':
        if (player.directions.x != -1) player.directions = { x: 1, y: 0 };
        break;
      default:
        console.warn(`Invalid direction: ${direction} for player: ${playerId}`);
        throw new Error(`${REJECT.WRONG_DIRECTION}`);
    }
  }

  broadcastState() {
    messageManager
      .createBroadcast({
        gameType: 'snake',
        type: 'updateGameState',
        players: [this.players[0].getPlayerState(), this.players[1].getPlayerState()],
        apple: this.apple.position,
      })
      .to.sockets(this.playerSockets);
  }

  stopGame() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    this.running = false;
  }

  checkWinCondition() {
    const [player1, player2] = this.players;
    let winner = null;
    let loser = null;
    let gameOver = false;
    console.log(`Player 1 ${player1.collision} Player 2 ${player2.collision}`);
    if (player1.collision || player2.collision) {
      gameOver = true;
      if (player1.collision && !player2.collision) {
        winner = player2.playerName;
        loser = player1.playerName;
      } else if (player2.collision && !player1.collision) {
        winner = player1.playerName;
        loser = player2.playerName;
      } else {
        winner = null;
      }
    }
    if (
      !gameOver &&
      (player1.score >= SNAKE_CONSTS.MAX_SCORE || player2.score >= SNAKE_CONSTS.MAX_SCORE)
    ) {
      gameOver = true;
      if (player1.score > player2.score) {
        winner = player1.playerName;
        loser = player2.playerName;
      } else if (player2.score > player1.score) {
        winner = player2.playerName;
        loser = player1.playerName;
      }
    }
    if (gameOver) {
      this.stopGame();
      messageManager
        .createBroadcast({
          type: 'gameOver',
          players: [player1.getPlayerState(), player2.getPlayerState()],
          winner,
        })
        .to.sockets(this.playerSockets);
      // gameManager.saveGameInDatabase(this.gameId, winner, loser, ...)
      gameManager.removeGame(this.gameId);
    }
  }

  updatePlayers() {
    const [player1, player2] = this.players;
    player1.checkCollisions(player2);
    player2.checkCollisions(player1);
    player1.automatedMove(this.apple, player2);
    player2.automatedMove(this.apple, player1);

    if (player1.collision || player2.collision) {
      this.checkWinCondition();
    }
  }

  startGame() {
    if (this.running) return;
    this.running = true;
    console.log('Game starts');
    this.gameLoop = setInterval(() => {
      this.updatePlayers();
      if (this.running) this.broadcastState();
    }, 500);
  }
}
