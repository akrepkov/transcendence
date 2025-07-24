import { Player } from './Player.js';
import { Ball } from './Ball.js';
import { messageManager } from '../managers/messageManager.js';
import { gameManager } from '../managers/gameManager.js';
import { REJECT } from '../managers/messageManager.js';

export const GAME_CONSTS = {
  WIDTH: 800,
  HEIGHT: 600,
  PADDLE_HEIGHT: 100,
  PADDLE_WIDTH: 10,
  BALL_SIZE: 10,
  MAX_SCORE: 3,
  BALL_SPEED: 2,
  PADDLE_SPEED: 10,
};

export class Game {
  constructor(connection1, connection2, gameId) {
    this.gameId = gameId;
    this.ball = new Ball();
    this.players = [
      new Player(connection1.username, connection1.userId, 0),
      new Player(connection2.username, connection2.userId, GAME_CONSTS.WIDTH),
    ];
    this.playerSockets = [connection1.socket, connection2.socket];
    this.playerConnections = [connection1, connection2];
    this.state = {
      players: this.players,
      ball: this.ball,
    };
    this.gameLoop = null;
    this.running = false;
  }

  handleInput(playerId, direction) {
    const player = this.players.find((player) => player.playerId === playerId);
    if (direction === 'up' && player.paddleY > 0) {
      player.paddleY -= GAME_CONSTS.PADDLE_SPEED;
    } else if (
      direction === 'down' &&
      player.paddleY + GAME_CONSTS.PADDLE_HEIGHT / 2 < GAME_CONSTS.HEIGHT
    ) {
      player.paddleY += GAME_CONSTS.PADDLE_SPEED;
    } else {
      console.warn(`Invalid direction: ${direction} for player: ${player.playerName}`);
      throw new Error(`${REJECT.WRONG_DIRECTION}`);
    }
  }

  broadcastState() {
    messageManager
      .createBroadcast({
        type: 'updateGameState',
        players: [this.players[0].getPlayerState(), this.players[1].getPlayerState()],
        ball: this.ball.getBallState(),
      })
      .to.sockets(this.playerSockets);
  }

  handleWallCollision() {
    if (this.ball.topOrBottomCollision()) {
      this.ball.reverseYSpeed();
    }
  }

  handlePlayerCollision() {
    if (this.ball.collidesWithLeftPlayer(this.players[0])) {
      this.ball.reverseXSpeed();
    } else if (this.ball.collidesWithRightPlayer(this.players[1])) {
      this.ball.reverseXSpeed();
    }
  }

  checkWinCondition() {
    if (
      this.players[0].score >= GAME_CONSTS.MAX_SCORE ||
      this.players[1].score >= GAME_CONSTS.MAX_SCORE
    ) {
      this.stopGame();
      messageManager
        .createBroadcast({
          type: 'gameOver',
          players: [this.players[0].getPlayerState(), this.players[1].getPlayerState()],
          winner:
            this.players[0].score > this.players[1].score
              ? this.players[0].playerName
              : this.players[1].playerName,
        })
        .to.sockets(this.playerSockets);
      gameManager.removeGame(this.gameId);
    }
  }

  handleScoring() {
    if (this.ball.x <= 0) {
      this.players[1].score++;
      this.ball.reset();
      this.checkWinCondition();
    } else if (this.ball.x >= GAME_CONSTS.WIDTH) {
      this.players[0].score++;
      this.ball.reset();
      this.checkWinCondition();
    }
  }

  handleBallEvents() {
    this.handleWallCollision();
    this.handlePlayerCollision();
    this.handleScoring();
  }

  stopGame() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    this.running = false;
  }

  startGame() {
    if (this.running) return;

    this.running = true;
    this.gameLoop = setInterval(() => {
      this.ball.updateBall();
      this.handleBallEvents();
      if (this.running) {
        this.broadcastState();
      }
    }, 1000 / 60); // 60 FPS
  }

  // function for pausing and resuming?
  // function for the loop
}
