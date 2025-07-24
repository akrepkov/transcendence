import { GameState } from './types.js';
import { Player } from './types.js';
import { Ball } from './types.js';

export function renderGame(ctx: CanvasRenderingContext2D, socket: WebSocket) {
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case 'waitingForOpponent':
        console.log('Waiting for the opponent');
        break;
      case 'gameStarting':
        console.log('gameStarting');
        createGame(data.payload);
        break;
      case 'updateGameState':
        console.log('updateGameState');
        draw(data.payload, ctx);
        break;
      default:
        console.warn('Unknown message type:', data.type);
    }
  };
}

function draw(data: GameState, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, 800, 600);
  ctx.fillStyle = 'white';
  ctx.fillRect(data.ball.x, data.ball.y, 10, 10);
  ctx.fillRect(0, data.players[0].paddleY, 10, 100);
  ctx.fillRect(800 - 10, data.players[1].paddleY, 10, 100);
}

function createGame(data: GameState) {
  const game: GameState = data;
}
