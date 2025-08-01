import { getCanvasContext } from './render.js';
import { showPongScore } from './render.js';
export const GAME_CONSTS = {
  WIDTH: 800,
  HEIGHT: 600,
  MAX_SCORE: 3,
};

const context = getCanvasContext();

type Key = 'w' | 's' | 'ArrowUp' | 'ArrowDown';

const keys: Record<Key, boolean> = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false,
};

export class Ball {
  public x: number;
  public y: number;
  public speedX: number;
  public speedY: number;
  public size: number;

  constructor(dirX: number, dirY: number) {
    this.x = GAME_CONSTS.WIDTH / 2;
    this.y = GAME_CONSTS.HEIGHT / 2;
    this.speedX = dirX;
    this.speedY = dirY;
    this.size = 20;
  }

  update(): void {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  draw(): void {
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

export class Paddle {
  public width: number;
  public height: number;
  public x: number;
  public y: number;
  public paddleSpeed: number;
  public score: number;
  public name: string;

  constructor(x: number, name: string) {
    this.width = 10;
    this.height = 100;
    this.x = x;
    this.y = (GAME_CONSTS.HEIGHT - this.height) / 2;
    this.paddleSpeed = 8;
    this.score = 0;
    this.name = name;
  }

  draw(): void {
    context.fillStyle = 'white';
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

export class Game {
  public player: Paddle;
  public ai: Paddle;
  public ball: Ball;
  public winner: string;
  public animationId: number | null = null;
  public isRunning: boolean = false;
  private aiReactionCounter: number = 0;
  private aiReactionRate: number = 5;

  constructor() {
    this.player = new Paddle(0, 'Player');
    this.ai = new Paddle(GAME_CONSTS.WIDTH - 10, 'AI');
    this.ball = new Ball(4, 4);
    this.winner = 'Nobody';
  }

  reset(): void {
    this.player.score = 0;
    this.ai.score = 0;
    this.ball.reset();
  }

  checkBall(): void {
    const { ball, player, ai } = this;
    if (ball.y <= 0 || ball.y + ball.size >= GAME_CONSTS.HEIGHT) {
      ball.speedY = -ball.speedY;
    }
    if (
      ball.x <= player.x + player.width &&
      ball.y + ball.size >= player.y &&
      ball.y <= player.y + player.height
    ) {
      ball.x = player.x + player.width;
      ball.speedX = -ball.speedX;
    }
    if (
      ball.x + ball.size >= ai.x &&
      ball.x <= ai.x + ai.width &&
      ball.y + ball.size >= ai.y &&
      ball.y <= ai.y + ai.height
    ) {
      ball.x = ai.x - ball.size;
      ball.speedX = -ball.speedX;
    }
    if (ball.x <= 0) {
      this.ai.score++;
      ball.reset();
    }
    if (ball.x + ball.size >= GAME_CONSTS.WIDTH) {
      this.player.score++;
      ball.reset();
    }
    this.checkWinCondition();
  }

  gameLoop = () => {
    if (!this.isRunning) return;
    context.clearRect(0, 0, GAME_CONSTS.WIDTH, GAME_CONSTS.HEIGHT);
    this.movePlayer();
    this.moveAi();
    this.player.draw();
    this.ai.draw();
    this.ball.update();
    this.ball.draw();
    this.checkBall();
    showPongScore();
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
      context.clearRect(0, 0, GAME_CONSTS.WIDTH, GAME_CONSTS.HEIGHT);
    } catch (e) {
      console.warn('Canvas could not be reset:', e);
    }
    const aiScoreEl = document.getElementById('ai-score');
    const scoreText = `The winner is ${this.winner}`;
    if (aiScoreEl && aiScoreEl.offsetParent !== null) {
      aiScoreEl.textContent = scoreText;
    }
  }

  checkWinCondition() {
    if (this.player.score >= GAME_CONSTS.MAX_SCORE) {
      this.winner = this.player.name;
      this.stopGame();
    } else if (this.ai.score >= GAME_CONSTS.MAX_SCORE) {
      this.winner = this.ai.name;
      this.stopGame();
    }
  }

  movePlayer() {
    if (keys.w && this.player.y > 0) {
      this.player.y -= this.player.paddleSpeed;
    }
    if (keys.s && this.player.y + this.player.height < GAME_CONSTS.HEIGHT) {
      this.player.y += this.player.paddleSpeed;
    }
  }
  moveAi() {
    this.aiReactionCounter++;
    if (this.aiReactionCounter % this.aiReactionRate !== 0) return;
    if (this.ball.speedX > 0) {
      if (this.ball.y < this.ai.y + this.ai.height / 2) {
        this.ai.y -= this.ai.paddleSpeed;
      } else if (this.ball.y > this.ai.y + this.ai.height / 2) {
        this.ai.y += this.ai.paddleSpeed;
      }
      if (this.ai.y < 0) {
        this.ai.y = 0;
      } else if (this.ai.y + this.ai.height > GAME_CONSTS.HEIGHT) {
        this.ai.y = GAME_CONSTS.HEIGHT - this.ai.height;
      }
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
