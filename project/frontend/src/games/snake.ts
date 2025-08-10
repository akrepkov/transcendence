import { GameStateSnake } from './types.js';
import { GAME_CONSTS } from './types.js';
import { getCanvasContext } from './render.js';
import { centerOnCanvas, turnOffKeyboardScrolling } from '../utils/uiHelpers.js';

let running = false;
let keyListener: ((event: KeyboardEvent) => void) | undefined;

/**
 * Initializes the Snake game logic.
 *
 * - Sets the game to running state.
 * - Attaches a keydown event listener for movement input.
 *
 * @param {GameStateSnake} data - The initial game state.
 * @param {WebSocket} socket - The WebSocket used to send movement commands.
 */
export function createSnakeGame(data: GameStateSnake, socket: WebSocket) {
  running = true;
  keyListener = (event) => moveSnakes(data, event, socket);
  document.addEventListener('keydown', keyListener);
  document.addEventListener('keydown', turnOffKeyboardScrolling);
  centerOnCanvas('snake');
}

/**
 * Renders the current Snake game state on the canvas.
 *
 * - Draws apple and each player's snake.
 * - Red snake = player 1, Blue snake = player 2.
 *
 * @param {GameStateSnake} data - The current game state from the server.
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
 */
export function drawSnake(data: GameStateSnake, ctx: CanvasRenderingContext2D) {
  if (running === true) {
    ctx.clearRect(0, 0, GAME_CONSTS.WIDTH, GAME_CONSTS.HEIGHT);
    ctx.fillStyle = 'white';
    ctx.fillRect(data.apple.x, data.apple.y, 20, 20);
    data.players.forEach((player, index) => {
      ctx.fillStyle = index === 0 ? 'red' : 'blue';
      for (const segment of player.head) {
        ctx.fillRect(segment.x, segment.y, 20, 20);
      }
    });
  }
}

/**
 * Handles snake movement based on user keypress.
 *
 * - Translates keys into direction commands.
 * - Sends direction to server via WebSocket.
 *
 * @param {GameStateSnake} game - The current game state (unused, could be used for validation).
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {WebSocket} socket - The WebSocket connection to send movement messages.
 */
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
  } else if (event.key === 'r') {
    console.log('KEY ', event.key);
    direction = 'reverse';
  }
  console.log('Moving snake', direction);
  if (direction && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'move', direction }));
  }
}

/**
 * Displays a message in the Snake game UI.
 *
 * - Updates the text content of the element with ID 'snake-score'.
 *
 * @param {string} message - The message to display.
 */
export function showMessageSnake(message: string) {
  const messageElement = document.getElementById('snake-score');
  if (messageElement) {
    messageElement.textContent = message;
  }
}

/**
 * Displays the current score for both Snake players.
 *
 * - Player 1 (red) on the left, Player 2 (blue) on the right.
 *
 * @param {GameStateSnake} data - The game state containing player names and scores.
 */
export function showSnakeScore(data: GameStateSnake) {
  if (running === true) {
    const scoreSnake = document.getElementById('snake-score');
    if (scoreSnake)
      scoreSnake.innerHTML = `
  <span style="color: red;">${data.players[0].playerName}</span> ${data.players[0].score} : 
  ${data.players[1].score} <span style="color: blue;">${data.players[1].playerName}</span>`;
  }
}

/**
 * Cleans up the Snake game UI and event listeners.
 *
 * - Removes keydown event listener.
 * - Clears the canvas and resets running flag.
 */
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

/**
 * Handles game over logic for the Snake game.
 *
 * - Stops the game.
 * - Displays winner message.
 * - Defaults to "Me! The apple!" if winner is null.
 *
 * @param {string} winner - The name of the winning player.
 */
export function gameOverSnake(winner: string) {
  if (winner === null) {
    winner = 'Me! The apple!';
  }
  cleanSnakeField();
  document.removeEventListener('keydown', turnOffKeyboardScrolling);
  const snakeScore = document.getElementById('snake-score');
  const scoreText = `The winner is ${winner}`;
  if (snakeScore && snakeScore.offsetParent !== null) {
    snakeScore.textContent = scoreText;
  }
}
