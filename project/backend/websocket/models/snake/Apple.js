import { SNAKE_CONSTS } from './Snake.js';

export class Apple {
  constructor() {
    console.log('Create an apple');
    this.y = SNAKE_CONSTS.HEIGHT / 2;
    this.x = SNAKE_CONSTS.WIDTH / 2;
    this.size = 10;
    this.color = 'white';
  }
  getAppleState() {
    return {
      x: this.x,
      y: this.y,
      size: this.size,
    };
  }

  getRandomApplePosition() {
    this.y = SNAKE_CONSTS.HEIGHT / 2;
    this.x = SNAKE_CONSTS.WIDTH / 2;
    //   let maxAttempts = WIDTH * HEIGHT - 2; //2 blocks are already occupied with snakes
    //   let x, y;
    //   let applePositionValid = false;
    //   let attempts = 0;
    //   while (!applePositionValid && attempts < maxAttempts) {
    //     x = Math.floor((Math.random() * WIDTH) / 10) * 10;
    //     y = Math.floor((Math.random() * HEIGHT) / 10) * 10;
    //     applePositionValid = true;
    //     for (let segment of gameState.leftPlayer) {
    //       if (segment.x === x && segment.y === y) {
    //         applePositionValid = false;
    //         break;
    //       }
    //     }
    //     for (let segment of gameState.rightPlayer) {
    //       if (segment.x === x && segment.y === y) {
    //         applePositionValid = false;
    //         break;
    //       }
    //     }
    //     if (!applePositionValid) {
    //       getRandomApplePosition(WIDTH, HEIGHT);
    //     }
    //     attempts++;
    //     if (attempts >= maxAttempts) {
    //       console.error('Failed to find a valid apple position after ' + maxAttempts + ' attempts.');
    //       resetGame(WIDTH, HEIGHT);
    //     }
    //   }
    //   gameState.apple = { x, y };
  }
}
