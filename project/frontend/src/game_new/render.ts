import { GameState } from './types.js';

export const GAME_CONSTS = {
  WIDTH: 800,
  HEIGHT: 600,
  BALL_SIZE: 10,
};

export function renderGame(socket: WebSocket) {
  const canvas = document.getElementById('snake') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('Canvas element not found');
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get 2D rendering context');
  }
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case 'waitingForOpponent':
        console.log('Waiting for the opponent');
        break;
      case 'gameStarting':
        console.log('gameStarting', data);
        createGame(data, socket);
        break;
      case 'updateGameState':
        //console.log('updateGameState', data);
        // const gameState: GameState = {
        //   players: data.players,
        //   ball: data.ball,
        // };
        draw(data, ctx);
        break;
      /* What do we do in these situations?*/
      case 'opponentDisconnected':
        console.log('opponentDisconnected', data);
        break;
      case 'logoutRequest':
        console.log('logoutRequest', data);
        break;
      case 'onlineUsers':
        console.log('onlineUsers', data);
        break;
      case 'gameOver':
        console.log('gameOver', data);
        break;
      case 'socketRejection':
        console.log('socketRejection', data);
        break;
      default:
        console.warn('Unknown message type:', data.type);
    }
  };
}

function draw(data: GameState, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, GAME_CONSTS.WIDTH, GAME_CONSTS.HEIGHT);
  ctx.fillStyle = 'black';
  ctx.fillRect(data.ball.x, data.ball.y, 10, 10);
  ctx.fillRect(0, data.players[0].paddleY, 10, 100);
  ctx.fillRect(GAME_CONSTS.WIDTH - 10, data.players[1].paddleY, 10, 100);
}

function createGame(data: GameState, socket: WebSocket) {
  const game: GameState = data;
  document.addEventListener('keydown', (event) => {
    movePaddles(game, event, socket);
  });
}

function movePaddles(game: GameState, event: KeyboardEvent, socket: WebSocket) {
  let direction;
  if (event.key === 'w' || event.key === 'ArrowUp') {
    direction = 'up';
  } else if (event.key === 's' || event.key === 'ArrowDown') {
    direction = 'down';
  }
  console.log('Moving paddle', direction);
  if (direction && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: 'move',
        direction,
      }),
    );
  }
}
