import * as pong from './pong.js';
import * as snake from './snake.js';

export const gameHandler = {
  pong: {
    create: pong.createPongGame,
    draw: pong.drawPong,
    score: pong.showPongScore,
    gameOver: pong.gameOverPong,
  },
  snake: {
    create: snake.createSnakeGame,
    draw: snake.drawSnake,
    score: snake.showSnakeScore,
    gameOver: snake.gameOverSnake,
  },
};
