import { Player } from './Player.js';
import { Ball } from './Ball.js';
import { messageManager } from '../managers/messageManager.js';

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
  constructor(connection1, connection2) {
    this.ball = new Ball();
    this.players = [new Player(connection1, 0), new Player(connection2, GAME_CONSTS.WIDTH)];
    this.playerSockets = [connection1.socket, connection2.socket];
    this.state = {
      players: this.players,
      ball: this.ball,
    };
    this.gameLoop = null;
    this.running = false;
  }

  handleInput(playerId, direction) {
    const player = this.players.find((player) => player.connection.userId === playerId);
    if (direction === 'up' && player.paddleY > 0) {
      player.paddleY -= GAME_CONSTS.PADDLE_SPEED;
    } else if (
      direction === 'down' &&
      player.paddleY + GAME_CONSTS.PADDLE_HEIGHT / 2 < GAME_CONSTS.HEIGHT
    ) {
      player.paddleY += GAME_CONSTS.PADDLE_SPEED;
    }
  }

  broadcastState() {
    messageManager
      .createBroadcast({
        type: 'updateGameState',
        players: this.state.players,
        ball: this.state.ball,
      })
      .to.sockets(this.playerSockets);
  }

  handleWallCollision() {
    if (this.ball.topOrBottomCollision()) {
      this.ball.reverseYSpeed();
    }
  }

  handlePlayerCollision() {
    if (this.ball.collidesWith(this.players[0])) {
      this.ball.reverseXSpeed();
    } else if (this.ball.collidesWith(this.players[1])) {
      this.ball.reverseXSpeed();
    }
  }

  handleScoring() {}

  handleBallEvents() {
    this.handleWallCollision();
    this.handlePlayerCollision();
    this.handleScoring();
  }

  startGame() {
    this.gameLoop = setInterval(() => {
      this.ball.updateBall();
    });
  }

  // function for disconnect
  // function for pausing and resuming?
  // function for the loop
  // function for broadasting
  // function for stopping
  // function for the game logic
}

// getState() {
//   return {
//     player1: {
//       position: this.players[0].paddleY,
//       score: this.players[0].score,
//       id: this.players[0].connection.userId,
//     },
//     player2: {
//       position: this.players[1].paddleY,
//       score: this.players[1].score,
//       id: this.players[1].connection.userId,
//     },
//     ball: {
//       position: { x: this.ball.x, y: this.ball.y },
//     },
//     players: this.players,
//     ball: this.ball,
//   };
