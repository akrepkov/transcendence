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
}
