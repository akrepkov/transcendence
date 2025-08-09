import { SNAKE_CONSTS } from './Snake.js';

export class SnakePlayer {
  constructor(username, userId, positions, xDir) {
    console.log('Create a player ', positions);
    this.positions = positions.map((pos) => ({ ...pos }));
    this.directions = { x: xDir, y: 0 };
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
    // console.log('Check collisions for player: ', this.playerName, head.x, ' ', head.y);
    if (
      head.x < 0 ||
      head.x > SNAKE_CONSTS.WIDTH - 20 ||
      head.y < 0 ||
      head.y > SNAKE_CONSTS.HEIGHT - 20
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
        console.log(`${this.playerName} collided with ${opponent.playerName}`);
        this.collision = true;
        return;
      }
    }
  }

  changeDirections() {
    if (this.positions.length >= 2) {
      const [head, neck] = this.positions;
      if (head.x > neck.x) {
        this.directions.x = 1;
        this.directions.y = 0;
      }
      if (head.x < neck.x) {
        this.directions.x = -1;
        this.directions.y = 0;
      }
      if (head.y > neck.y) {
        this.directions.x = 0;
        this.directions.y = 1;
      }
      if (head.y < neck.y) {
        this.directions.x = 0;
        this.directions.y = -1;
      }
    } else {
      this.directions.x = -this.directions.x;
      this.directions.y = -this.directions.y;
    }
  }

  automatedMove(apple, opponent) {
    const head = this.positions[0];
    // console.log("Automated positions", this.positions, " ", this.directions);
    const newHead = {
      x: head.x + this.directions.x * SNAKE_CONSTS.SNAKE_SPEED,
      y: head.y + this.directions.y * SNAKE_CONSTS.SNAKE_SPEED,
    };
    this.positions.unshift(newHead);
    if (apple.position.x === newHead.x && apple.position.y === newHead.y) {
      apple.getRandomApplePosition(this, opponent);
      this.score++;
    } else this.positions.pop();
  }
}
