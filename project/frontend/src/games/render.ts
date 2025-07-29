import { GameStatePong, GameStateSnake } from './types.js';
import { gameHandler } from './gameHandler.js';

export function getCanvasContext(gameType: string): CanvasRenderingContext2D {
  const canvas = document.getElementById(gameType) as HTMLCanvasElement;
  if (!canvas) throw new Error('Canvas element not found');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D rendering context');
  return ctx;
}

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
        handler.score?.(data);
        handler.draw(data, ctx);
        break;
      case 'gameOver':
        handler.gameOver(data.winner);
        break;
      case 'opponentDisconnected':
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
