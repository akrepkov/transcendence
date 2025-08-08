import { Player } from './Player.js';
import { Ball } from './Ball.js';
import { messageManager } from '../../managers/messageManager.js';
import { gameManager } from '../../managers/gameManager.js';
import { REJECT } from '../../managers/messageManager.js';

export const PONG_CONSTS = {
  WIDTH: 800,
  HEIGHT: 600,
  PADDLE_HEIGHT: 100,
  PADDLE_WIDTH: 10,
  BALL_SIZE: 20,
  MAX_SCORE: 3,
  BALL_SPEED: 5.6,
  PADDLE_SPEED: 10,
};

export class Pong {
  constructor(connection1, connection2, gameId) {
    this.gameId = gameId;
    this.ball = new Ball();
    this.players = [
      new Player(connection1.username, connection1.userId, 0),
      new Player(connection2.username, connection2.userId, PONG_CONSTS.WIDTH),
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
      player.direction = 'up';
    } else if (
      direction === 'down' &&
      player.paddleY + PONG_CONSTS.PADDLE_HEIGHT < PONG_CONSTS.HEIGHT
    ) {
      player.direction = 'down';
    } else if (direction === 'idle') {
      player.direction = 'idle';
    } else if (direction !== 'up' && direction !== 'down' && direction !== 'idle') {
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

  getWinnerAndLoser() {
    if (this.players[0].score > this.players[1].score) {
      return { winner: this.players[0], loser: this.players[1] };
    } else {
      return { winner: this.players[1], loser: this.players[0] };
    }
  }

  checkWinCondition() {
    if (
      this.players[0].score >= PONG_CONSTS.MAX_SCORE ||
      this.players[1].score >= PONG_CONSTS.MAX_SCORE
    ) {
      this.stopGame();
      const { winner, loser } = this.getWinnerAndLoser();
      messageManager
        .createBroadcast({
          type: 'gameOver',
          players: [this.players[0].getPlayerState(), this.players[1].getPlayerState()],
          winner: winner.playerName,
        })
        .to.sockets(this.playerSockets);
      gameManager.saveGameInDatabase(
        this.gameId,
        winner.playerName,
        loser.playerName,
        winner.score,
        loser.score,
      );
      gameManager.removeGame(this.gameId);
    }
  }

  handleScoring() {
    if (this.ball.x <= 0) {
      this.players[1].score++;
      this.ball.reset();
      this.checkWinCondition();
    } else if (this.ball.x >= PONG_CONSTS.WIDTH) {
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
      this.players.forEach((player) => {
        player.updatePaddle();
      });
      this.handleBallEvents();
      if (this.running) {
        this.broadcastState();
      }
    }, 1000 / 60);
  }
}
