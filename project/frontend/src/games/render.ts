import { gameHandler, toggleHandler } from './gameHandler.js';

export const REJECT = {
  NOT_AUTHENTICATED: 4001,
  PLAYER_IN_GAME: 4002,
  PLAYER_IN_WAITING_ROOM: 4003,
  NOT_IN_WAITING_ROOM: 4004,
  NOT_IN_GAME: 4005,
  WRONG_DIRECTION: 4006,
  INVALID_GAME_TYPE: 4007,
};

const SOCKET_REJECTS = {
  [REJECT.NOT_AUTHENTICATED]: 'You must be logged in to perform this action.',
  [REJECT.PLAYER_IN_GAME]: 'You are already in a game.',
  [REJECT.PLAYER_IN_WAITING_ROOM]: 'You are already in the waiting list.',
  [REJECT.NOT_IN_WAITING_ROOM]: 'Your connection is not in the waiting list.',
  [REJECT.NOT_IN_GAME]: 'Your connection is not in a game.',
  [REJECT.WRONG_DIRECTION]: 'Invalid direction specified. Use "up" or "down".',
  [REJECT.INVALID_GAME_TYPE]: 'Invalid game type specified or none given. Use "pong" or "snake".',
};

/**
 * Retrieves the 2D rendering context for the given game's canvas element.
 *
 * - Looks up a `<canvas>` element by ID based on the `gameType`.
 * - Throws an error if the canvas or context cannot be found.
 *
 * @param {string} gameType - The type of game ('pong', 'snake', etc.), used as the canvas element ID.
 * @returns {CanvasRenderingContext2D} The 2D rendering context for the canvas.
 * @throws Will throw an error if the canvas or 2D context is not found.
 */
export function getCanvasContext(gameType: string): CanvasRenderingContext2D {
  const canvas = document.getElementById(gameType) as HTMLCanvasElement;
  if (!canvas) throw new Error('Canvas element not found');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D rendering context');
  return ctx;
}

/**
 * Sets up the WebSocket message handler and connects rendering logic
 * to the appropriate game (Pong or Snake).
 *
 * - Attaches a `message` listener to the WebSocket.
 * - Handles various message types such as game state updates, game start, game over, etc.
 * - Uses the `gameHandler` to call the appropriate render and game logic for the given type.
 *
 * @param {WebSocket} socket - The WebSocket connection to receive game state updates.
 * @param {string} gameType - The type of game being played ('pong' or 'snake').
 * @throws Will throw an error if the provided `gameType` is not supported.
 */
export function renderGame(socket: WebSocket, gameType: string) {
  const ctx = getCanvasContext(gameType);
  if (!['pong', 'snake'].includes(gameType)) {
    throw new Error('Invalid gameType');
  }
  const handler = gameHandler[gameType as 'pong' | 'snake'];

  console.log(`Game type ${gameType}`);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case 'waitingForOpponent':
        console.log('Waiting for the opponent');
        handler.showMessage('Waiting for an opponent...');
        break;
      case 'gameStarting':
        handler.create(data, socket);
        handler.showMessage('Game starting...');
        break;
      case 'updateGameState':
        console.log('Sent updateGameState');
        handler.score?.(data);
        handler.draw(data, ctx);
        break;
      case 'gameOver':
        handler.gameOver(data.winner);
        break;
      case 'opponentDisconnected':
        console.log(`Opponent disconnected, winner: ${data.winner}`);
        handler.gameOver(data.winner);
        break;
      case 'resetGame':
        console.log('resetGame', data);
        handler.showMessage("You're both silly geese, resetting game...");
        break;
      /* What do we do in these situations?*/
      case 'logoutRequest':
        console.log('logoutRequest', data);
        break;
      case 'onlineFriends':
        console.log('onlineUsers', data);
        break;
      case 'socketRejection':
        console.log('socketRejection', data);
        if (data.code === REJECT.PLAYER_IN_GAME || data.code === REJECT.PLAYER_IN_WAITING_ROOM) {
          alert(SOCKET_REJECTS[data.code]);
          if (gameType === 'pong') {
            toggleHandler.pongPage.reset(socket);
          } else if (gameType === 'snake') {
            toggleHandler.snakePage.reset(socket);
          }
        }
        break;
      default:
        console.warn('Unknown message type:', data.type);
    }
  };
}
