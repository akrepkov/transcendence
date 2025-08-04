import { SNAKE_CONSTS } from './Snake.js';

export class SnakePlayer {
  constructor(username, userId, positions) {
    console.log('Create a player ', positions);
    this.positions = positions.map((pos) => ({ ...pos }));
    this.directions = { x: 0, y: -1 };
    this.score = 0;
    this.playerName = username;
    this.playerId = userId;
    this.collision = false;
  }

  getPlayerState() {
    return {
      playerName: this.playerName,
      head: this.positions,
      score: this.score,
    };
  }

  checkCollisions(opponent) {
    const head = this.positions[0];
    if (
      (console.log('Check collisions for player: ', this.playerName, head.x, ' ', head.y),
      head.x < 0 ||
        head.x > SNAKE_CONSTS.WIDTH - 20 ||
        head.y < 0 ||
        head.y > SNAKE_CONSTS.HEIGHT - 20)
    ) {
      console.log(`${this.playerName} Player hit the wall`);
      this.collision = true;
      return;
    }
    for (let i = 1; i < this.positions.length; i++) {
      if (head.x === this.positions[i].x && head.y === this.positions[i].y) {
        console.log('Left player hit itself');
        this.collision = true;
        return;
      }
    }
    for (let segment of opponent.positions) {
      if (head.x === segment.x && head.y === segment.y) {
        console.log(`${this.userId} collided with ${opponent.userId}`);
        this.collision = true;
        return;
      }
    }
  }

  automatedMove(apple, opponent) {
    const head = this.positions[0];
    const newHead = {
      x: head.x + this.directions.x * SNAKE_CONSTS.SNAKE_SPEED,
      y: head.y + this.directions.y * SNAKE_CONSTS.SNAKE_SPEED,
    };
    this.positions.unshift(newHead);
    if (apple.position.x === head.x && apple.position.y === head.y) {
      apple.getRandomApplePosition(this, opponent);
      this.score++;
    } else this.positions.pop();
  }
}
