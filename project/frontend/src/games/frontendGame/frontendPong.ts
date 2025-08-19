import { getCanvasContext } from './frontendRender.js';
import { turnOffKeyboardScrolling } from '../../utils/uiHelpers.js';
import { translations } from '../../translations/languages.js';

function getCurrentLang(): 'en' | 'pl' | 'ru' | 'ko' {
  return (localStorage.getItem('lang') as any) || 'en';
}

export const GAME_CONSTS = {
  WIDTH: 800,
  HEIGHT: 600,
  MAX_SCORE: 5,
  SPEED: 5.6,
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

  getRandomDirection() {
    const min = GAME_CONSTS.SPEED * 0.5;
    const directionSign = this.speedX > 0 ? -1 : 1;
    const value = Math.random() * (GAME_CONSTS.SPEED - min) + min;
    return value * directionSign;
  }

  reset(): void {
    this.x = GAME_CONSTS.WIDTH / 2;
    this.y = GAME_CONSTS.HEIGHT / 2;
    this.speedX = this.getRandomDirection();
    this.speedY = Math.sqrt(GAME_CONSTS.SPEED ** 2 - this.speedX ** 2);
    console.log('Speed in reset X:', this.speedX);
    console.log('Speed in reset Y:', this.speedY);
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
  private lastCheck: number = Date.now();
  private direction: string = 'idle';
  private targetY: number = (GAME_CONSTS.HEIGHT - this.height) / 2;

  constructor(x: number) {
    super(x, 'AI');
  }

  // So we calculate first how far the ball is from the paddle.
  // Then how long it will take to reach the paddle with the ball speedX.
  // Then we predict where the ball will be after said time in the y-axis.
  // This does not take into account bounces off the walls, so the Ai is beatable.
  predictBallYPosition(ball: Ball): number {
    const distanceBallToPaddle = GAME_CONSTS.WIDTH - ball.x;
    const timeUntilImpact = distanceBallToPaddle / ball.speedX;
    const predictedPaddleY = ball.y + ball.speedY * timeUntilImpact;
    return predictedPaddleY;
  }

  move(ball: Ball): void {
    if (Date.now() - this.lastCheck > 1000) {
      if (ball.speedX > 0) {
        this.targetY = this.predictBallYPosition(ball);
        if (this.targetY < this.y + this.height / 2) {
          this.direction = 'up';
        } else if (this.targetY > this.y + this.height / 2) {
          this.direction = 'down';
        } else {
          this.direction = 'idle';
        }
        this.lastCheck = Date.now();
      }
    }
    if (this.direction === 'up' && this.y > 0) {
      this.y -= this.paddleSpeed;
    } else if (this.direction === 'down' && this.y + this.height < GAME_CONSTS.HEIGHT) {
      this.y += this.paddleSpeed;
    }
    if (Math.abs(this.y + this.height / 2 - this.targetY) < this.paddleSpeed) {
      this.direction = 'idle';
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

  drawCanvas(): void {
    this.canvasContext.clearRect(0, 0, GAME_CONSTS.WIDTH, GAME_CONSTS.HEIGHT);
    this.player1.draw(this.canvasContext);
    this.player2.draw(this.canvasContext);
    this.ball.draw(this.canvasContext);
    this.showPongScore();
  }

  gameLoop = () => {
    if (!this.isRunning) return;
    this.player1.move(this.ball);
    this.player2.move(this.ball);
    this.ball.update();
    this.drawCanvas();
    this.checkBall();
    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    document.addEventListener('keydown', turnOffKeyboardScrolling);
    this.reset();
    this.animationId = requestAnimationFrame(this.gameLoop);
  }

  stopGame() {
    console.log('Stopping game');
    document.removeEventListener('keydown', turnOffKeyboardScrolling);
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
    const lang = getCurrentLang();

    const template = translations[lang]?.pongWinner ?? translations.en.pongWinner;
    const scoreText = template.replace('{winner}', this.winner);

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
