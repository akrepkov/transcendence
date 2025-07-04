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
    if (this.y - this.size <= 0 || this.y + this.size >= GAME_CONSTS.HEIGHT) {
      return true;
    }
  }

  reverseYSpeed() {
    this.speedY *= -1;
  }

  reverseXSpeed() {
    this.speedX *= -1;
  }

  collidesWith(player) {
    if (
      this.x - this.size <= player.x + player.width &&
      this.x + this.size >= player.x &&
      this.y - this.size <= player.y + player.height &&
      this.y + this.size >= player.y
    ) {
      return true;
    }
  }
}
