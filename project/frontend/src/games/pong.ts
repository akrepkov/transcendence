import { GameStatePong } from './types.js';
import { GAME_CONSTS } from './types.js';
import { getCanvasContext } from './render.js';

/**
 * Stores the current animation frame ID for cancellation.
 */
export let animationFrame: number | null = null;

/**
 * Tracks whether the Pong game loop is currently running.
 */
let running = false;

/**
 * Keypress state map for controlling paddles.
 * Supports both WASD and arrow keys.
 */
const keys: Record<'w' | 's' | 'ArrowUp' | 'ArrowDown', boolean> = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false,
};

/**
 * Initializes a Pong game.
 *
 * - Sets the `running` flag to true.
 * - Starts listening for paddle input.
 * - Begins the paddle movement loop.
 *
 * @param {GameStatePong} data - The initial state of the Pong game.
 * @param {WebSocket} socket - The WebSocket used to send movement data to the server.
 */
export function createPongGame(data: GameStatePong, socket: WebSocket) {
  running = true;
  setupPaddleInput(socket);
  movePaddles(socket);
}

/**
 * Registers event listeners for paddle key input (keydown and keyup).
 *
 * @param {WebSocket} socket - The WebSocket to use (not used here but passed for future-proofing).
 */
function setupPaddleInput(socket: WebSocket) {
  document.addEventListener('keydown', handlePaddleKeyDown);
  document.addEventListener('keyup', handlePaddleKeyUp);

  function handlePaddleKeyDown(event: KeyboardEvent) {
    if (event.key in keys) keys[event.key as keyof typeof keys] = true;
  }

  function handlePaddleKeyUp(event: KeyboardEvent) {
    if (event.key in keys) keys[event.key as keyof typeof keys] = false;
  }
}

/**
 * Continuously checks which direction the player is pressing
 * and sends a movement message via WebSocket to the server.
 *
 * @param {WebSocket} socket - The WebSocket connection to send movement data.
 */
function movePaddles(socket: WebSocket) {
  function loop() {
    // console.log('movePaddle loop is running');
    let direction: 'up' | 'down' | 'idle';
    if (keys.w || keys.ArrowUp) direction = 'up';
    else if (keys.s || keys.ArrowDown) direction = 'down';
    else direction = 'idle';

    if (direction && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'move', direction }));
    }
    animationFrame = requestAnimationFrame(loop);
  }
  loop();
}

/**
 * Renders the current game state onto the Pong canvas.
 * Draws ball and player paddles.
 *
 * @param {GameStatePong} data - The latest game state received from the server.
 * @param {CanvasRenderingContext2D} ctx - The 2D canvas context used for drawing.
 */
export function drawPong(data: GameStatePong, ctx: CanvasRenderingContext2D) {
  //   console.log('drawPong is running');
  if (running === true) {
    ctx.clearRect(0, 0, GAME_CONSTS.WIDTH, GAME_CONSTS.HEIGHT);
    ctx.fillStyle = 'white';
    ctx.fillRect(data.ball.x, data.ball.y, 20, 20);
    ctx.fillStyle = 'red';
    ctx.fillRect(0, data.players[0].paddleY, 10, 100);
    ctx.fillStyle = 'blue';
    ctx.fillRect(GAME_CONSTS.WIDTH - 10, data.players[1].paddleY, 10, 100);
  }
}

/**
 * Displays a message in the Pong game UI.
 *
 * @param {string} message - The message to display.
 */
export function showMessagePong(message: string) {
  const messageElement = document.getElementById('pong-score');
  if (messageElement) {
    messageElement.textContent = message;
  }
}

/**
 * Displays the current game score on the page.
 *
 * @param {GameStatePong} data - The game state including player scores and names.
 */
export function showPongScore(data: GameStatePong) {
  if (running === true) {
    const scorePong = document.getElementById('pong-score');
    if (scorePong)
      scorePong.innerHTML = `
  <span style="color: red;">${data.players[0].playerName}</span> ${data.players[0].score} : 
  ${data.players[1].score} <span style="color: blue;">${data.players[1].playerName}</span>`;
  }
}

/**
 * Stops the game loop, clears the canvas, and resets internal state.
 * Safely handles the case where canvas context may not be found.
 */
export function cleanPongField() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
    running = false;
  }
  try {
    console.log('cleaning canvas');
    const ctx = getCanvasContext('pong');
    ctx.clearRect(0, 0, GAME_CONSTS.WIDTH, GAME_CONSTS.HEIGHT);
  } catch (e) {
    console.warn('Canvas could not be reset:', e);
  }
}

/**
 * Ends the Pong game and shows the winner on the score display.
 *
 * @param {string} winner - The name of the player who won the game.
 */
export function gameOverPong(winner: string) {
  cleanPongField();
  console.log(`Game over, winner: ${winner}`);
  const pongScore = document.getElementById('pong-score');
  const scoreText = `The winner is ${winner}`;
  if (pongScore && pongScore.offsetParent !== null) {
    pongScore.textContent = scoreText;
  }
}
