import { getCanvasContext } from './frontendRender.js';
export const GAME_CONSTS = {
  WIDTH: 800,
  HEIGHT: 600,
  MAX_SCORE: 3,
};

type Key = 'w' | 's' | 'ArrowUp' | 'ArrowDown';

const keys: Record<Key, boolean> = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false,
};

export class Ball {
  public x: number = GAME_CONSTS.WIDTH / 2;
  public y: number = GAME_CONSTS.HEIGHT / 2;
  public speedX: number;
  public speedY: number;
  public size: number = 20;

  constructor(dirX: number, dirY: number) {
    this.speedX = dirX;
    this.speedY = dirY;
  }

  update(): void {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = 'white';
    context.fillRect(this.x, this.y, this.size, this.size);
  }

  reset(): void {
    this.x = GAME_CONSTS.WIDTH / 2;
    this.y = GAME_CONSTS.HEIGHT / 2;
    this.speedX = -this.speedX;
    console.log('Speed in reset:', this.speedX);
  }
}

abstract class Paddle {
  public width: number = 10;
  public height: number = 100;
  public x: number;
  public y: number = (GAME_CONSTS.HEIGHT - this.height) / 2;
  public paddleSpeed: number = 8;
  public score: number = 0;
  public name: string;

  constructor(x: number, name: string) {
    this.x = x;
    this.name = name;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = 'white';
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  abstract move(ball: Ball): void;
}

class Player extends Paddle {
  private readonly upKey: Key;
  private readonly downKey: Key;

  constructor(x: number, name: string, upKey: Key, downKey: Key) {
    super(x, name);
    this.upKey = upKey;
    this.downKey = downKey;
  }

  move(ball: Ball): void {
    if (keys[this.upKey] && this.y > 0) {
      this.y -= this.paddleSpeed;
    }
    if (keys[this.downKey] && this.y + this.height < GAME_CONSTS.HEIGHT) {
      this.y += this.paddleSpeed;
    }
  }
}

class AI extends Paddle {
  private aiReactionCounter: number = 0;
  private aiReactionRate: number = 1;

  constructor(x: number) {
    super(x, 'AI');
  }

  move(ball: Ball): void {
    this.aiReactionCounter++;
    if (this.aiReactionCounter % this.aiReactionRate !== 0) return;
    if (ball.speedX > 0) {
      if (ball.y < this.y + this.height / 2) {
        this.y -= this.paddleSpeed;
      } else if (ball.y > this.y + this.height / 2) {
        this.y += this.paddleSpeed;
      }
      if (this.y < 0) {
        this.y = 0;
      } else if (this.y + this.height > GAME_CONSTS.HEIGHT) {
        this.y = GAME_CONSTS.HEIGHT - this.height;
      }
    }
  }
}

export class Game {
  public player1: Paddle;
  public player2: Paddle;
  public ball: Ball = new Ball(4, 4);
  public winner: string = 'Nobody';
  public animationId: number | null = null;
  public isRunning: boolean = false;
  public canvasId: string;
  public scoreFieldId: string;
  public canvasContext: CanvasRenderingContext2D;

  constructor(canvasId: string, scoreFieldId: string, player1Name: string, player2Name?: string) {
    this.canvasId = canvasId;
    this.scoreFieldId = scoreFieldId;
    this.canvasContext = getCanvasContext(this.canvasId);
    this.player1 = new Player(0, player1Name, 'w', 's');
    if (player2Name) {
      this.player2 = new Player(GAME_CONSTS.WIDTH - 10, player2Name, 'ArrowUp', 'ArrowDown');
    } else {
      this.player2 = new AI(GAME_CONSTS.WIDTH - 10);
    }
  }

  reset(): void {
    this.player1.score = 0;
    this.player2.score = 0;
    this.ball.reset();
  }

  checkBall(): void {
    const { ball, player1, player2 } = this;
    if (ball.y <= 0 || ball.y + ball.size >= GAME_CONSTS.HEIGHT) {
      ball.speedY = -ball.speedY;
    }
    if (
      ball.x <= player1.x + player1.width &&
      ball.y + ball.size >= player1.y &&
      ball.y <= player1.y + player1.height
    ) {
      ball.x = player1.x + player1.width;
      ball.speedX = -ball.speedX;
    }
    if (
      ball.x + ball.size >= player2.x &&
      ball.x <= player2.x + player2.width &&
      ball.y + ball.size >= player2.y &&
      ball.y <= player2.y + player2.height
    ) {
      ball.x = player2.x - ball.size;
      ball.speedX = -ball.speedX;
    }
    if (ball.x <= 0) {
      this.player2.score++;
      ball.reset();
    }
    if (ball.x + ball.size >= GAME_CONSTS.WIDTH) {
      this.player1.score++;
      ball.reset();
    }
    this.checkWinCondition();
  }

  showPongScore(): void {
    const scoreField = document.getElementById(this.scoreFieldId);
    if (scoreField) {
      scoreField.innerHTML = `
      <span style="color: red;">${this.player1.name}</span> ${this.player1.score} : 
      ${this.player2.score} <span style="color: blue;">${this.player2.name}</span>`;
    }
  }

  gameLoop = () => {
    if (!this.isRunning) return;
    this.canvasContext.clearRect(0, 0, GAME_CONSTS.WIDTH, GAME_CONSTS.HEIGHT);
    this.player1.move(this.ball);
    this.player2.move(this.ball);
    this.player1.draw(this.canvasContext);
    this.player2.draw(this.canvasContext);
    this.ball.update();
    this.ball.draw(this.canvasContext);
    this.checkBall();
    this.showPongScore();
    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.reset();
    this.animationId = requestAnimationFrame(this.gameLoop);
  }

  stopGame() {
    console.log('Stopping game');
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isRunning = false;

    try {
      this.canvasContext.clearRect(0, 0, GAME_CONSTS.WIDTH, GAME_CONSTS.HEIGHT);
    } catch (e) {
      console.warn('Canvas could not be reset:', e);
    }
    console.log('Game stopped, winner:', this.winner);
    const scoreField = document.getElementById(this.scoreFieldId);
    const scoreText = `The winner is ${this.winner}`;
    if (scoreField && scoreField.offsetParent !== null) {
      scoreField.textContent = scoreText;
    }
  }

  checkWinCondition() {
    if (this.player1.score >= GAME_CONSTS.MAX_SCORE) {
      this.winner = this.player1.name;
      this.stopGame();
    } else if (this.player2.score >= GAME_CONSTS.MAX_SCORE) {
      this.winner = this.player2.name;
      this.stopGame();
    }
  }
}

document.addEventListener('keydown', (event: KeyboardEvent): void => {
  if (event.key in keys) {
    keys[event.key as Key] = true;
  }
});

document.addEventListener('keyup', (event: KeyboardEvent): void => {
  if (event.key in keys) {
    keys[event.key as Key] = false;
  }
});
