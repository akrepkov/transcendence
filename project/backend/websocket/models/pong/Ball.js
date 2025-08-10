import { PONG_CONSTS } from './Pong.js';

export class Ball {
  constructor() {
    console.log('Create a ball');
    this.size = PONG_CONSTS.BALL_SIZE;
    this.reset();
    this.color = 'white';
  }

  getRandomDirection() {
    const min = PONG_CONSTS.BALL_SPEED * 0.5;
    const directionSign = this.speedX > 0 ? -1 : 1;
    const value = Math.random() * (PONG_CONSTS.BALL_SPEED - min) + min;
    return value * directionSign;
  }

  reset() {
    this.x = PONG_CONSTS.WIDTH / 2;
    this.y = PONG_CONSTS.HEIGHT / 2;
    this.speedX = this.getRandomDirection();
    this.speedY = Math.sqrt(PONG_CONSTS.BALL_SPEED ** 2 - this.speedX ** 2);
  }

  updateBall() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  topOrBottomCollision() {
    if (this.y <= 0 || this.y + this.size >= PONG_CONSTS.HEIGHT) {
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
      this.y + this.size >= player.paddleY &&
      this.y <= player.paddleY + player.paddleHeight &&
      this.speedX < 0
    ) {
      return true;
    }
  }

  collidesWithRightPlayer(player) {
    if (
      this.x + this.size >= PONG_CONSTS.WIDTH - player.paddleWidth &&
      this.x <= PONG_CONSTS.WIDTH - player.paddleWidth &&
      this.y + this.size >= player.paddleY &&
      this.y <= player.paddleY + player.paddleHeight &&
      this.speedX > 0
    ) {
      return true;
    }
  }

  getBallState() {
    return {
      x: this.x,
      y: this.y,
      size: this.size,
    };
  }
}
