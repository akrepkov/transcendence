import { PONG_CONSTS } from './Pong.js';

export class Player {
  constructor(username, userId, startX) {
    console.log('Create a player');
    this.paddleY = PONG_CONSTS.HEIGHT / 2 - PONG_CONSTS.PADDLE_HEIGHT / 2;
    this.paddleX = startX;
    this.score = 0;
    this.playerName = username;
    this.playerId = userId;
    this.direction = 'idle';
    // below variables might be unnecessary, since they are kind of constant and the same for all players
    this.paddleHeight = PONG_CONSTS.PADDLE_HEIGHT;
    this.paddleWidth = PONG_CONSTS.PADDLE_WIDTH;
    this.paddleSpeed = PONG_CONSTS.PADDLE_SPEED;
  }

  updatePaddle() {
    if (this.direction === 'up' && this.paddleY > 0) {
      this.paddleY -= PONG_CONSTS.PADDLE_SPEED;
    } else if (
      this.direction === 'down' &&
      this.paddleY + PONG_CONSTS.PADDLE_HEIGHT < PONG_CONSTS.HEIGHT
    ) {
      this.paddleY += PONG_CONSTS.PADDLE_SPEED;
    }
  }

  getPlayerState() {
    return {
      playerName: this.playerName,
      paddleY: this.paddleY,
      paddleX: this.paddleX,
      score: this.score,
    };
  }
}
