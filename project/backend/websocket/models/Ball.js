import { GAME_CONSTS } from './Game.js';

export class Ball {
  constructor() {
    console.log('Create a ball');
    this.x = GAME_CONSTS.WIDTH / 2;
    this.y = GAME_CONSTS.HEIGHT / 2;
    this.size = GAME_CONSTS.BALL_SIZE;
    this.speedX = GAME_CONSTS.BALL_SPEED;
    this.speedY = GAME_CONSTS.BALL_SPEED;
    this.color = 'white';
  }

  reset() {
    this.x = GAME_CONSTS.WIDTH / 2;
    this.y = GAME_CONSTS.HEIGHT / 2;
    this.speedX = -this.speedX;
  }

  updateBall() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  topOrBottomCollision() {
    if (this.y <= 0 || this.y + this.size >= GAME_CONSTS.HEIGHT) {
      return true;
    }
  }

  reverseYSpeed() {
    this.speedY *= -1;
  }

  reverseXSpeed() {
    this.speedX *= -1;
  }

  collidesWithLeftPlayer(player) {
    if (
      this.x <= player.paddleWidth &&
      this.y + this.size >= player.y &&
      this.y <= player.y + player.paddleHeight
    ) {
      return true;
    }
  }

  collidesWithRightPlayer(player) {
    if (
      this.x + this.size >= GAME_CONSTS.WIDTH - player.paddleWidth &&
      this.x <= GAME_CONSTS.WIDTH - player.paddleWidth &&
      this.y + this.size >= player.y &&
      this.y <= player.y + player.paddleHeight
    ) {
      return true;
    }
  }
}
