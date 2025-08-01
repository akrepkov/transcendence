import { toggleHandler } from './gameHandler.js';

// let gameType: string | null = null;

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

  /* Container holding start*/
  // const pongStartContainer = document.getElementById('pong-start-container"');
  // const snakeStartContainer = document.getElementById('snake-start-container"');
  // const practiceStartContainer = document.getElementById('practice-start-container"');
  // const aiStartContainer = document.getElementById('ai-start-container"');

  /*Previous Enter, starting game*/
  const startPong = document.getElementById('start-button-pong');
  const startSnake = document.getElementById('start-button-snake');
  const startPractice = document.getElementById('start-button-practice');
  const startAi = document.getElementById('start-button-ai');

  /*Go to menu */
  const pongStop = document.getElementById('stop-button-pong');
  const snakeStop = document.getElementById('stop-button-snake');
  const practiceStop = document.getElementById('stop-button-practice');
  const aiStop = document.getElementById('stop-button-ai');

  /* Canvas Container*/
  // const pongContainer = document.getElementById('pong-container');
  // const snakeContainer = document.getElementById('snake-container');
  // const practiceContainer = document.getElementById('practice-container');
  // const aiContainer = document.getElementById('ai-container');

  if (!startPong || !startSnake || !startAi || !startPractice)
    throw new Error('Start button Pong element not found');

  startPong.addEventListener('click', () => {
    toggleHandler.pongPage.clean();
    toggleHandler.pongPage.start(socket);
  });

  pongStop?.addEventListener('click', () => {
    toggleHandler.pongPage.reset(socket);
  });

  startSnake.addEventListener('click', () => {
    toggleHandler.snakePage.clean();
    toggleHandler.snakePage.start(socket);
  });

  snakeStop?.addEventListener('click', () => {
    toggleHandler.snakePage.reset(socket);
  });

  startPractice.addEventListener('click', () => {
    toggleHandler.practicePage.clean();
    toggleHandler.practicePage.start();
  });

  practiceStop?.addEventListener('click', () => {
    toggleHandler.practicePage.reset();
  });

  startAi.addEventListener('click', () => {
    toggleHandler.aiPage.clean();
    toggleHandler.aiPage.start();
  });

  aiStop?.addEventListener('click', () => {
    toggleHandler.aiPage.reset();
  });
}
