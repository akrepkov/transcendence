import { renderGame } from './render.js';
import { animationFrame } from './pong.js';
import { GAME_CONSTS } from './types.js';
import { getCanvasContext } from './render.js';

let gameType: string | null = null;

export function setupSocketEvents(socket: WebSocket) {
  socket.onopen = () => {
    console.log('WebSocket connection opened.');
  };
  socket.onerror = function (error) {
    console.error('WebSocket error:', error);
  };
  socket.onclose = function () {
    console.log('WebSocket connection closed.');
  };
}

export function setupGameToggle(socket: WebSocket) {
  console.log('Game Toggle');
  const pongBtn = document.getElementById('pong-btn');
  const snakeBtn = document.getElementById('snake-btn');
  const mainMenu = document.getElementById('main-menu');
  const pongStop = document.getElementById('stop-button-pong');
  const snakeStop = document.getElementById('stop-button-snake');
  const pongContainer = document.getElementById('pong-container');
  const snakeContainer = document.getElementById('snake-container');

  pongBtn?.addEventListener('click', () => {
    pongContainer?.classList.remove('hidden');
    snakeContainer?.classList.add('hidden');
    mainMenu?.classList.add('hidden');
  });

  snakeBtn?.addEventListener('click', () => {
    snakeContainer?.classList.remove('hidden');
    pongContainer?.classList.add('hidden');
    mainMenu?.classList.add('hidden');
  });

  const startPong = document.getElementById('start-button-pong');
  const startSnake = document.getElementById('start-button-snake');

  if (!startPong) throw new Error('Start button Pong element not found');
  if (!startSnake) throw new Error('Start button Snake element not found');

  startPong.addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'joinWaitingRoom', gameType: 'pong' }));
    gameType = 'pong';
    renderGame(socket, gameType);
  });
  startSnake.addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'joinWaitingRoom', gameType: 'snake' }));
    gameType = 'snake';
    renderGame(socket, gameType);
  });

  pongStop?.addEventListener('click', () => {
    //STOP THE Pong
    resetPongGame();
    pongContainer?.classList.add('hidden');
    mainMenu?.classList.remove('hidden');
  });
  snakeStop?.addEventListener('click', () => {
    //STOP THE Snake
    resetSnakeGame();
    snakeContainer?.classList.add('hidden');
    mainMenu?.classList.remove('hidden');
  });
}

export function resetPongGame() {
  const scorePong = document.getElementById('pong-score');
  if (scorePong) scorePong.textContent = '0 : 0';
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
  try {
    const ctx = getCanvasContext('pong');
    ctx.clearRect(0, 0, GAME_CONSTS.WIDTH, GAME_CONSTS.HEIGHT);
  } catch (e) {
    console.warn('Canvas could not be reset:', e);
  }
}

export function resetSnakeGame() {
  const scorePong = document.getElementById('snake-score');
  if (scorePong) scorePong.textContent = ''; //What do we have here
  try {
    const ctx = getCanvasContext('snake');
    ctx.clearRect(0, 0, GAME_CONSTS.WIDTH, GAME_CONSTS.HEIGHT);
  } catch (e) {
    console.warn('Canvas could not be reset:', e);
  }
}
