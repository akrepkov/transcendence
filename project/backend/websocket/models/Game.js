import { Player } from './Player.js';
import { Ball } from './Ball.js';

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
  constructor() {
    this.ball = new Ball();
    this.players = [new Player(), new Player()];

    // this.player1 = new Player();
    // this.player2 = new Player();
  }
}
