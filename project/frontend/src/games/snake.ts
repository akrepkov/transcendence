import { GameStateSnake } from './types.js';
import { GAME_CONSTS } from './types.js';
import { getCanvasContext } from './render.js';

let running = false;
let keyListener: ((event: KeyboardEvent) => void) | undefined;

export function createSnakeGame(data: GameStateSnake, socket: WebSocket) {
  running = true;
  keyListener = (event) => moveSnakes(data, event, socket);
  document.addEventListener('keydown', keyListener);
}

export function drawSnake(data: GameStateSnake, ctx: CanvasRenderingContext2D) {
  if (running === true) {
    ctx.clearRect(0, 0, GAME_CONSTS.WIDTH, GAME_CONSTS.HEIGHT);
    ctx.fillStyle = 'black';
    ctx.fillRect(data.apple.x, data.apple.y, 20, 20);
    data.players.forEach((player, index) => {
      ctx.fillStyle = index === 0 ? 'red' : 'blue';
      for (const segment of player.head) {
        ctx.fillRect(segment.x, segment.y, 20, 20);
      }
    });
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
  const scoreSnake = document.getElementById('snake-score');
  if (scoreSnake)
    scoreSnake.innerHTML = `
  <span style="color: red;">${data.players[0].playerName}</span> ${data.players[0].score} : 
  ${data.players[1].score} <span style="color: blue;">${data.players[1].playerName}</span>`;
}

export function cleanSnakeField() {
  console.log('cleanSnakeField');
  if (keyListener) {
    document.removeEventListener('keydown', keyListener);
    keyListener = undefined;
  }
  try {
    const ctx = getCanvasContext('snake');
    ctx.clearRect(0, 0, GAME_CONSTS.WIDTH, GAME_CONSTS.HEIGHT);
    running = false;
  } catch (e) {
    console.warn('Canvas could not be reset:', e);
  }
}

export function gameOverSnake(winner: string) {
  if (winner === null) {
    winner = 'Me! The apple!';
  }
  cleanSnakeField();
  const snakeScore = document.getElementById('snake-score');
  const scoreText = `The winner is ${winner}`;
  if (snakeScore && snakeScore.offsetParent !== null) {
    snakeScore.textContent = scoreText;
  }
}
