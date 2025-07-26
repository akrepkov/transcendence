import * as game from './render.js';

export const gameHandler = {
  pong: {
    create: game.createPongGame,
    draw: game.drawPong,
  },
  snake: {
    create: game.createSnakeGame,
    draw: game.drawSnake,
  },
};
