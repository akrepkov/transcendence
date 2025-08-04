import { SNAKE_CONSTS } from './Snake.js';

export class Apple {
  constructor() {
    console.log('Create an apple');
    this.position = { x: 400, y: 300 };
    this.size = 10;
    this.color = 'white';
  }

  getRandomApplePosition(player1, player2) {
    this.y = SNAKE_CONSTS.HEIGHT / 2;
    this.x = SNAKE_CONSTS.WIDTH / 2;
    let maxAttempts = 100;
    let x, y;
    let applePositionValid = false;
    let attempts = 0;

    while (!applePositionValid && attempts < maxAttempts) {
      x = Math.floor((Math.random() * SNAKE_CONSTS.WIDTH - 60) / 20) * 20;
      y = Math.floor((Math.random() * SNAKE_CONSTS.HEIGHT - 60) / 20) * 20;
      applePositionValid = true;
      for (let segment of player1.positions) {
        if (segment.x === x && segment.y === y) {
          applePositionValid = false;
          break;
        }
      }
      for (let segment of player2.positions) {
        if (segment.x === x && segment.y === y) {
          applePositionValid = false;
          break;
        }
      }
      if (applePositionValid) {
        this.position = { x, y };
      }
      attempts++;
    }
  }
}
