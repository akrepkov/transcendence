import { GameStatePong } from './types.js';
import { GAME_CONSTS } from './types.js';
import { getCanvasContext } from './render.js';

export let animationFrame: number | null = null;
let running = false;

const keys: Record<'w' | 's' | 'ArrowUp' | 'ArrowDown', boolean> = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false,
};

export function createPongGame(data: GameStatePong, socket: WebSocket) {
  running = true;
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
    // console.log('movePaddle loop is running');
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
  //   console.log('drawPong is running');
  if (running === true) {
    ctx.clearRect(0, 0, GAME_CONSTS.WIDTH, GAME_CONSTS.HEIGHT);
    ctx.fillStyle = 'white';
    ctx.fillRect(data.ball.x, data.ball.y, 10, 10);
    ctx.fillStyle = 'red';
    ctx.fillRect(0, data.players[0].paddleY, 10, 100);
    ctx.fillStyle = 'blue';
    ctx.fillRect(GAME_CONSTS.WIDTH - 10, data.players[1].paddleY, 10, 100);
  }
}

export function showPongScore(data: GameStatePong) {
  const scorePong = document.getElementById('pong-score');
  if (scorePong)
    scorePong.innerHTML = `
  <span style="color: red;">${data.players[0].playerName}</span> ${data.players[0].score} : 
  ${data.players[1].score} <span style="color: blue;">${data.players[1].playerName}</span>`;
}

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

export function gameOverPong(winner: string) {
  cleanPongField();
  const pongScore = document.getElementById('pong-score');
  const scoreText = `The winner is ${winner}`;
  if (pongScore && pongScore.offsetParent !== null) {
    pongScore.textContent = scoreText;
  }
}
