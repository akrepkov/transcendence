import { SNAKE_CONSTS } from './Game.js';

export class SnakePlayer {
  constructor(userId, positions) {
    console.log('Create a player');
    this.positions = positions;
    this.directions = { x: 0, y: -1 };
    this.score = 0;
    this.playerName = userId;
  }

  getPlayerState() {
    return {
      playerName: this.playerName,
    };
  }

  checkCollisions() {
    const head = this.positions[0];
    // Check for collision with walls
    if (head.x < 0 || head.x >= SNAKE_CONSTS.WIDTH || head.y < 0 || head.y >= SNAKE_CONSTS.HEIGHT) {
      console.log(`${this.userId} Player hit the wall`);
      //resetGame();
    }
    // Check for collision with self
    // for (let i = 1; i < this.positions.length; i++) {
    //   if (head.x === this.positions[i].x && head.y === this.positions[i].y) {
    //     console.log('Left player hit itself');
    //     resetGame();
    //   }
    // }

    // Check for collision with other player
    // for (let i = 0; i < gameState.rightPlayer.length; i++) {
    //   if (leftHead.x === gameState.rightPlayer[i].x && leftHead.y === gameState.rightPlayer[i].y) {
    //     console.log('Left player hit right player');
    //     resetGame();
    //   }
    // }
  }
  automatedMove() {
    const head = this.positions[0];

    const newHead = {
      x: head.x + this.directions.x,
      y: head.y + this.directions.y,
    };
    this.positions.unshift(newHead);
    this.positions.pop();
    checkCollisions();
    //ADD EATING THE APPLE and appearing the apple
  }
}
