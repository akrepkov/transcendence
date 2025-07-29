import { renderGame } from './render.js';

let gameType: string | null = null;

export function getGameType() {
  console.log('Game Type ', gameType);
  return gameType;
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
  pongStop?.addEventListener('click', () => {
    //STOP THE GAME
    pongContainer?.classList.add('hidden');
    mainMenu?.classList.remove('hidden');
  });
  snakeStop?.addEventListener('click', () => {
    //STOP THE GAME
    snakeContainer?.classList.add('hidden');
    mainMenu?.classList.remove('hidden');
  });
  const startPong = document.getElementById('start-button-pong');
  if (!startPong) {
    throw new Error('Start button Pong element not found');
  }
  const startSnake = document.getElementById('start-button-snake');
  if (!startSnake) {
    throw new Error('Start button Snake element not found');
  }
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
}
