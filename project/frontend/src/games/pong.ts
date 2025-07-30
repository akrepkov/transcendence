import { GameStatePong } from './types.js';
import { GAME_CONSTS } from './types.js';
import { getCanvasContext } from './render.js';

export let animationFrame: number | null = null;

const keys: Record<'w' | 's' | 'ArrowUp' | 'ArrowDown', boolean> = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false,
};

export function createPongGame(data: GameStatePong, socket: WebSocket) {
  setupPaddleInput(socket);
  movePaddles(socket);
}

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

function movePaddles(socket: WebSocket) {
  function loop() {
    console.log('movePaddle loop is running');
    let direction: 'up' | 'down' | undefined;
    if (keys.w || keys.ArrowUp) direction = 'up';
    else if (keys.s || keys.ArrowDown) direction = 'down';

    if (direction && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'move', direction }));
    }
    animationFrame = requestAnimationFrame(loop);
  }
  loop();
}

export function drawPong(data: GameStatePong, ctx: CanvasRenderingContext2D) {
  console.log('drawPong is running');
  ctx.clearRect(0, 0, GAME_CONSTS.WIDTH, GAME_CONSTS.HEIGHT);
  ctx.fillStyle = 'black';
  ctx.fillRect(data.ball.x, data.ball.y, 10, 10);
  ctx.fillRect(0, data.players[0].paddleY, 10, 100);
  ctx.fillRect(GAME_CONSTS.WIDTH - 10, data.players[1].paddleY, 10, 100);
}

export function showPongScore(data: GameStatePong) {
  const scorePong = document.getElementById('pong-score');
  if (scorePong) scorePong.textContent = `${data.players[0].score} : ${data.players[1].score}`;
}

export function cleanPongField() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
  try {
    const ctx = getCanvasContext('pong');
    ctx.clearRect(0, 0, GAME_CONSTS.WIDTH, GAME_CONSTS.HEIGHT);
  } catch (e) {
    console.warn('Canvas could not be reset:', e);
  }
}

export function gameOverPong(winner: string) {
  const pongScore = document.getElementById('pong-score');
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
  const scoreText = `The winner is ${winner}`;
  if (pongScore && pongScore.offsetParent !== null) {
    pongScore.textContent = scoreText;
  }
}
