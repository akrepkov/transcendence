import { gameHandler } from './gameHandler.js';

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
        break;
      case 'gameStarting':
        handler.create(data, socket);
        break;
      case 'updateGameState':
        console.log('Sent updataGameState');
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
      /* What do we do in these situations?*/
      case 'logoutRequest':
        console.log('logoutRequest', data);
        break;
      case 'onlineUsers':
        console.log('onlineUsers', data);
        break;
      case 'socketRejection':
        console.log('socketRejection', data);
        break;
      default:
        console.warn('Unknown message type:', data.type);
    }
  };
}
