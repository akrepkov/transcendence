import { renderGame } from './render.js';
import { cleanPongField } from './pong.js';
import { cleanSnakeField } from './snake.js';

let gameType: string | null = null;

export function setupSocketEvents(socket: WebSocket) {
  socket.onopen = () => {
    console.log('WebSocket connection opened.');
  };
  socket.onerror = function (error) {
    console.error('WebSocket error:', error);
  };
  socket.onclose = function (event) {
    console.log('WebSocket connection closed.');
    console.log('Code:', event.code); // Close code
    console.log('Reason:', event.reason); // Optional reason
    console.log('Was clean:', event.wasClean); // true if closed cleanly
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
  const startPong = document.getElementById('start-button-pong');
  const startSnake = document.getElementById('start-button-snake');

  if (!startPong) throw new Error('Start button Pong element not found');
  if (!startSnake) throw new Error('Start button Snake element not found');

  pongBtn?.addEventListener('click', () => {
    pongContainer?.classList.remove('hidden');
    startPong?.classList.remove('hidden');
    snakeContainer?.classList.add('hidden');
    mainMenu?.classList.add('hidden');
    const scorePong = document.getElementById('pong-score');
    if (scorePong) scorePong.textContent = '0 : 0';
    cleanPongField();
  });

  snakeBtn?.addEventListener('click', () => {
    console.log('Snake button clicked');
    snakeContainer?.classList.remove('hidden');
    startSnake?.classList.remove('hidden');
    pongContainer?.classList.add('hidden');
    mainMenu?.classList.add('hidden');
    const scoreSnake = document.getElementById('snake-score');
    if (scoreSnake) scoreSnake.textContent = '0 : 0';
    cleanSnakeField();
  });

  startPong.addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'joinWaitingRoom', gameType: 'pong' }));
    gameType = 'pong';
    startPong?.classList.add('hidden');
    renderGame(socket, gameType);
  });
  startSnake.addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'joinWaitingRoom', gameType: 'snake' }));
    gameType = 'snake';
    startSnake?.classList.add('hidden');
    renderGame(socket, gameType);
  });

  pongStop?.addEventListener('click', () => {
    //STOP THE Pong
    resetPongGame(socket);
    pongContainer?.classList.add('hidden');
    mainMenu?.classList.remove('hidden');
  });
  snakeStop?.addEventListener('click', () => {
    //STOP THE Snake
    resetSnakeGame(socket);
    snakeContainer?.classList.add('hidden');
    mainMenu?.classList.remove('hidden');
  });
}

export function resetPongGame(socket: WebSocket) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'disconnectFromGame' }));
  }
  cleanPongField();
}

export function resetSnakeGame(socket: WebSocket) {
  console.log('resetSnakeGame');
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'disconnectFromGame' }));
  }
  cleanSnakeField();
}
