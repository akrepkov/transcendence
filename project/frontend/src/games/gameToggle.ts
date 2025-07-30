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
    const scorePong = document.getElementById('pong-score');
    if (scorePong) scorePong.textContent = '0 : 0';
    renderGame(socket, gameType);
  });
  startSnake.addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'joinWaitingRoom', gameType: 'snake' }));
    gameType = 'snake';
    const scoreSnake = document.getElementById('snake-score');
    if (scoreSnake) scoreSnake.textContent = '';
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
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'disconnectFromGame' }));
  }
  cleanSnakeField();
}
