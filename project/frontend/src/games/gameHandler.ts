import * as pong from './pong.js';
import * as snake from './snake.js';
import { renderGame } from './render.js';
import { cleanPongField } from './pong.js';
import { cleanSnakeField } from './snake.js';
import { handleStartGame } from './ai/render.js';
import { cleanAiField } from './ai/render.js';
export const gameHandler = {
  pong: {
    create: pong.createPongGame,
    draw: pong.drawPong,
    score: pong.showPongScore,
    gameOver: pong.gameOverPong,
  },
  snake: {
    create: snake.createSnakeGame,
    draw: snake.drawSnake,
    score: snake.showSnakeScore,
    gameOver: snake.gameOverSnake,
  },
};

export const toggleHandler = {
  pongPage: {
    startContainer: 'pong-start-container',
    gameContainer: 'pong-container',
    startBtn: 'start-button-pong',
    stopBtn: 'stop-button-pong',
    start(socket: WebSocket) {
      socket.send(JSON.stringify({ type: 'joinWaitingRoom', gameType: 'pong' }));
      document.getElementById(this.startContainer)?.classList.add('hidden');
      document.getElementById(this.gameContainer)?.classList.remove('hidden');
      renderGame(socket, 'pong');
    },
    clean() {
      const scorePong = document.getElementById('pong-score');
      if (scorePong) scorePong.textContent = '0 : 0';
      cleanPongField();
    },
    reset(socket: WebSocket) {
      document.getElementById(this.startContainer)?.classList.remove('hidden');
      document.getElementById(this.gameContainer)?.classList.add('hidden');
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'disconnectFromGame' }));
      }
      cleanPongField();
    },
  },
  snakePage: {
    startContainer: 'snake-start-container',
    gameContainer: 'snake-container',
    startBtn: 'start-button-snake',
    stopBtn: 'stop-button-snake',
    start(socket: WebSocket) {
      socket.send(JSON.stringify({ type: 'joinWaitingRoom', gameType: 'snake' }));
      document.getElementById(this.startContainer)?.classList.add('hidden');
      document.getElementById(this.gameContainer)?.classList.remove('hidden');
      renderGame(socket, 'snake');
    },
    clean() {
      const scoresnake = document.getElementById('snake-score');
      if (scoresnake) scoresnake.textContent = '0 : 0';
      cleanSnakeField();
    },
    reset(socket: WebSocket) {
      document.getElementById(this.startContainer)?.classList.remove('hidden');
      document.getElementById(this.gameContainer)?.classList.add('hidden');
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'disconnectFromGame' }));
      }
      cleanSnakeField();
    },
  },
  practicePage: {
    startContainer: 'practice-start-container',
    gameContainer: 'practice-container',
    startBtn: 'start-button-practice',
    stopBtn: 'stop-button-practice',
    start() {
      // document.getElementById(this.startContainer)?.classList.add('hidden');
      // document.getElementById(this.gameContainer)?.classList.remove('hidden');
      // handleStartGame();
    },
    clean() {
      // const scorepractice = document.getElementById('practice-score');
      // if (scorepractice) scorepractice.textContent = '0 : 0';
      // cleanPracticeField();
    },
    reset() {
      // document.getElementById(this.startContainer)?.classList.remove('hidden');
      // document.getElementById(this.gameContainer)?.classList.add('hidden');
      // if (socket.readyState === WebSocket.OPEN) {
      // 	socket.send(JSON.stringify({ type: 'disconnectFromGame' }));
      // }
      // cleanPracticeField();
    },
  },
  aiPage: {
    startContainer: 'ai-start-container',
    gameContainer: 'ai-container',
    startBtn: 'start-button-ai',
    stopBtn: 'stop-button-ai',
    start() {
      document.getElementById(this.startContainer)?.classList.add('hidden');
      document.getElementById(this.gameContainer)?.classList.remove('hidden');
      handleStartGame();
    },
    clean() {
      const scoreai = document.getElementById('ai-score');
      if (scoreai) scoreai.textContent = '0 : 0';
      cleanAiField();
    },
    reset() {
      document.getElementById(this.startContainer)?.classList.remove('hidden');
      document.getElementById(this.gameContainer)?.classList.add('hidden');
      cleanAiField();
      document.getElementById('aiPage')?.classList.add('hidden');
    },
  },
};
