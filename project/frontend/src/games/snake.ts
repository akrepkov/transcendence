import { gameHandler } from './gameHandler.js';
import { GameStateSnake } from './types.js';
import { GAME_CONSTS } from './types.js';

export function createSnakeGame(data: GameStateSnake, socket: WebSocket) {
  document.addEventListener('keydown', (event) => moveSnakes(data, event, socket));
}

export function drawSnake(data: GameStateSnake, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, GAME_CONSTS.WIDTH, GAME_CONSTS.HEIGHT);
  ctx.fillStyle = 'black';

  ctx.fillRect(data.apple.x, data.apple.y, 20, 20);

  for (const player of data.players) {
    for (const segment of player.head) {
      ctx.fillRect(segment.x, segment.y, 20, 20);
    }
  }
}

export function moveSnakes(game: GameStateSnake, event: KeyboardEvent, socket: WebSocket) {
  let direction;
  if (event.key === 'w' || event.key === 'ArrowUp') {
    direction = 'up';
  } else if (event.key === 's' || event.key === 'ArrowDown') {
    direction = 'down';
  } else if (event.key === 'a' || event.key === 'ArrowLeft') {
    direction = 'left';
  } else if (event.key === 'd' || event.key === 'ArrowRight') {
    direction = 'right';
  }
  console.log('Moving snake', direction);
  if (direction && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'move', direction }));
  }
}

export function showSnakeScore(data: GameStateSnake) {
  /*Jan, are we going to have here something? */
}

export function gameOverSnake(winner: string) {
  const snakeScore = document.getElementById('snake-score');
  const scoreText = `The winner is ${winner}`;
  if (snakeScore && snakeScore.offsetParent !== null) {
    snakeScore.textContent = scoreText;
  }
}
