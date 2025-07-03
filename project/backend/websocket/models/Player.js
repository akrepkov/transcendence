import { GAME_CONSTS } from './Game.js';

export class Player {
  constructor() {
    console.log('Create a player');
    this.paddleY = GAME_CONSTS.HEIGHT / 2;
    this.score = 0;
    // below variables might be unnecessary, since they are kind of constant and the same for all players
    this.paddleHeight = GAME_CONSTS.PADDLE_HEIGHT;
    this.paddleWidth = GAME_CONSTS.PADDLE_WIDTH;
    this.paddleSpeed = GAME_CONSTS.PADDLE_SPEED;
  }
}
