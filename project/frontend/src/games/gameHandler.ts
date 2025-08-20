import * as pong from './pong.js';
import * as snake from './snake.js';
import { renderGame } from './render.js';
import { cleanPongField } from './pong.js';
import { cleanSnakeField } from './snake.js';
import { handleStartGame, resetGame } from './frontendGame/frontendGameManager.js';
import { getRandomPlayerNames } from './frontendGame/playerNames.js';
import { globalSession } from '../auth/auth.js';
import { showModal } from '../utils/uiHelpers.js';
import { translations } from '../translations/languages.js';

type Lang = 'en' | 'pl' | 'ru' | 'ko';
const getLang = (): Lang => (localStorage.getItem('lang') as Lang) || 'en';

/**
 * Handles game-specific logic bindings for Pong and Snake.
 *
 * Each entry defines the key functions needed to:
 * - create the game
 * - render the canvas
 * - show scores
 * - handle game over logic
 */
export const gameHandler = {
  pong: {
    create: pong.createPongGame,
    draw: pong.drawPong,
    score: pong.showPongScore,
    gameOver: pong.gameOverPong,
    showMessage: pong.showMessagePong,
  },
  snake: {
    create: snake.createSnakeGame,
    draw: snake.drawSnake,
    score: snake.showSnakeScore,
    gameOver: snake.gameOverSnake,
    showMessage: snake.showMessageSnake,
  },
};

function handleHistoryPopPong(event: PopStateEvent): void {
  toggleHandler.pongPage.reset(globalSession.getSocket());
  window.removeEventListener('popstate', handleHistoryPopPong);
}

function handleHistoryPopSnake(event: PopStateEvent): void {
  toggleHandler.snakePage.reset(globalSession.getSocket());
  window.removeEventListener('popstate', handleHistoryPopSnake);
}

function handleHistoryPopPractice(event: PopStateEvent): void {
  toggleHandler.practicePage.reset();
  window.removeEventListener('popstate', handleHistoryPopPractice);
}

function handleHistoryPopAi(event: PopStateEvent): void {
  toggleHandler.aiPage.reset();
  window.removeEventListener('popstate', handleHistoryPopAi);
}

function handleHistoryPopTour(event: PopStateEvent): void {
  toggleHandler.tourPage.reset();
  window.removeEventListener('popstate', handleHistoryPopTour);
}

/**
 * Handles UI toggling, socket coordination, and cleanup for different game pages.
 *
 * Each entry represents a game view and contains:
 * - DOM element references (start, stop, container IDs)
 * - `start`: initiates the game (and sends socket event if multiplayer)
 * - `clean`: resets UI and score state
 * - `reset`: hides game, shows start screen, and resets socket and game field
 */
export const toggleHandler = {
  pongPage: {
    startContainer: 'pong-start-container',
    gameContainer: 'pong-container',
    startBtn: 'start-button-pong',
    stopBtn: 'stop-button-pong',

    /**
     * Starts Pong game: joins waiting room and renders game.
     * @param {WebSocket} socket - Active WebSocket connection
     */
    start(socket: WebSocket) {
      document.getElementById(this.startContainer)?.classList.add('hidden');
      document.getElementById(this.gameContainer)?.classList.remove('hidden');
      renderGame(socket, 'pong');
      socket.send(JSON.stringify({ type: 'joinWaitingRoom', gameType: 'pong' }));
      window.addEventListener('popstate', handleHistoryPopPong);
    },

    /**
     * Resets the score display and clears the Pong canvas.
     */
    clean() {
      const scorePong = document.getElementById('pong-score');
      if (scorePong) scorePong.textContent = '0 : 0';
      cleanPongField();
    },

    /**
     * Resets the Pong UI and disconnects from the game.
     * @param {WebSocket} socket - Active WebSocket connection
     */
    reset(socket: WebSocket | null) {
      document.getElementById(this.startContainer)?.classList.remove('hidden');
      document.getElementById(this.gameContainer)?.classList.add('hidden');
      if (socket && socket.readyState === WebSocket.OPEN) {
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

    /**
     * Starts Snake game: joins waiting room and renders game.
     * @param {WebSocket} socket - Active WebSocket connection
     */
    start(socket: WebSocket) {
      document.getElementById(this.startContainer)?.classList.add('hidden');
      document.getElementById(this.gameContainer)?.classList.remove('hidden');
      renderGame(socket, 'snake');
      socket.send(JSON.stringify({ type: 'joinWaitingRoom', gameType: 'snake' }));
      window.addEventListener('popstate', handleHistoryPopSnake);
    },

    /**
     * Resets the score display and clears the Snake canvas.
     */
    clean() {
      const scoresnake = document.getElementById('snake-score');
      if (scoresnake) scoresnake.textContent = '0 : 0';
      cleanSnakeField();
    },

    /**
     * Resets the Snake UI and disconnects from the game.
     * @param {WebSocket} socket - Active WebSocket connection
     */
    reset(socket: WebSocket | null) {
      document.getElementById(this.startContainer)?.classList.remove('hidden');
      document.getElementById(this.gameContainer)?.classList.add('hidden');
      if (socket && socket.readyState === WebSocket.OPEN) {
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

    /**
     * Starts the practice game (currently commented out).
     * Intended for local single-player games.
     */
    start() {
      document.getElementById(this.startContainer)?.classList.add('hidden');
      document.getElementById(this.gameContainer)?.classList.remove('hidden');
      const [player1Name, player2Name] = getRandomPlayerNames();
      handleStartGame('practice', player1Name, player2Name, {
        waitFor: showModal(translations[getLang()].pressOkPractice),
        delaysMs: 100,
      });
      window.addEventListener('popstate', handleHistoryPopPractice);
    },

    /**
     * Cleans up practice game UI and score (currently commented out).
     */
    clean() {
      resetGame('practice');
    },

    /**
     * Resets practice UI and game state (currently commented out).
     */
    reset() {
      document.getElementById(this.startContainer)?.classList.remove('hidden');
      document.getElementById(this.gameContainer)?.classList.add('hidden');
      resetGame('practice');
      document.getElementById('practicePage')?.classList.add('hidden');
    },
  },
  aiPage: {
    startContainer: 'ai-start-container',
    gameContainer: 'ai-container',
    startBtn: 'start-button-ai',
    stopBtn: 'stop-button-ai',

    /**
     * Starts the AI game by hiding the start screen and showing the game,
     * then calling the AI game render logic.
     */
    start() {
      document.getElementById(this.startContainer)?.classList.add('hidden');
      document.getElementById(this.gameContainer)?.classList.remove('hidden');
      handleStartGame('ai', undefined, undefined, {
        waitFor: showModal(translations[getLang()].pressOkAi),
        delaysMs: 100,
      });
      window.addEventListener('popstate', handleHistoryPopAi);
    },

    /**
     * Resets the AI game score and canvas field.
     */
    clean() {
      resetGame('ai');
    },

    /**
     * Resets AI game UI and hides the AI page.
     */
    reset() {
      document.getElementById(this.startContainer)?.classList.remove('hidden');
      document.getElementById(this.gameContainer)?.classList.add('hidden');
      resetGame('ai');
      document.getElementById('aiPage')?.classList.add('hidden');
    },
  },

  tourPage: {
    startContainer: 'tour-start-container',
    gameContainer: 'tour-container',
    startBtn: 'start-button-tour',
    stopBtn: 'stop-button-tour',

    /**
     * Starts the Tournament game by hiding the start screen and showing the game,
     * then calling the game render logic.
     */
    start() {
      document.getElementById(this.startContainer)?.classList.add('hidden');
      document.getElementById(this.gameContainer)?.classList.remove('hidden');
      handleStartGame('tournament');
      window.addEventListener('popstate', handleHistoryPopTour);
    },

    /**
     * Resets the tournament game score and canvas field.
     */
    clean() {
      resetGame('tournament');
    },

    /**
     * Resets game UI and hides the Tournament page.
     */
    reset() {
      document.getElementById(this.startContainer)?.classList.remove('hidden');
      document.getElementById(this.gameContainer)?.classList.add('hidden');
      resetGame('tournament');
      document.getElementById('tourPage')?.classList.add('hidden');
    },
  },
};
