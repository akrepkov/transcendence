import { GameStatePong } from './types.js';
import { GameStateSnake } from './types.js';
import { getGameType } from './websocket.js';
import { gameHandler } from './gameHandler.js';

export const GAME_CONSTS = {
  WIDTH: 800,
  HEIGHT: 600,
  BALL_SIZE: 10,
};

const keys = new Set<string>(); //class containing unique strings

export function renderGame(socket: WebSocket) {
  const canvas = document.getElementById('pong') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('Canvas element not found');
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get 2D rendering context');
  }
  const gameType = getGameType();
  //ADD after having pages for games
  if (!gameType || !['pong', 'snake'].includes(gameType)) {
    // throw new Error('GameType is null');
    // console.log('GameType is null');
    return;
  }
  const handler = gameHandler[gameType as 'pong' | 'snake'];
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case 'waitingForOpponent':
        console.log('Waiting for the opponent');
        break;
      case 'gameStarting':
        console.log('gameStarting', data);
        handler.create(data, socket);
        break;
      case 'updateGameState':
        handler.draw(data, ctx);
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

export function drawPong(data: GameStatePong, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, GAME_CONSTS.WIDTH, GAME_CONSTS.HEIGHT);
  ctx.fillStyle = 'black';
  ctx.fillRect(data.ball.x, data.ball.y, 10, 10);
  ctx.fillRect(0, data.players[0].paddleY, 10, 100);
  ctx.fillRect(GAME_CONSTS.WIDTH - 10, data.players[1].paddleY, 10, 100);
}

export function createPongGame(data: GameStatePong, socket: WebSocket) {
  const game: GameStatePong = data;
  document.addEventListener('keydown', (e) => keys.add(e.key));
  document.addEventListener('keyup', (e) => keys.delete(e.key));
  movePaddles(game, socket);
}

export function movePaddles(game: GameStatePong, socket: WebSocket) {
  function loop() {
    let direction;
    if (keys.has('w') || keys.has('ArrowUp')) {
      direction = 'up';
    } else if (keys.has('s') || keys.has('ArrowDown')) {
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
    requestAnimationFrame(loop);
  }
  loop();
}

export function drawSnake(data: GameStateSnake, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, GAME_CONSTS.WIDTH, GAME_CONSTS.HEIGHT);
  ctx.fillStyle = 'black';
  console.log(`Apple ${data.apple}`);
  console.log(`Players head ${data.players[0].head}`);
  ctx.fillRect(data.apple.x, data.apple.y, 10, 10);
  for (const segment of data.players[0].head) {
    ctx.fillRect(segment.x, segment.y, 10, 10);
  }
  for (const segment of data.players[1].head) {
    ctx.fillRect(segment.x, segment.y, 10, 10);
  }
}

export function createSnakeGame(data: GameStateSnake, socket: WebSocket) {
  console.log('Created snake game');
  const game: GameStateSnake = data;
  document.addEventListener('keydown', (event) => {
    moveSnakes(game, event, socket);
  });
}

export function moveSnakes(game: GameStateSnake, event: KeyboardEvent, socket: WebSocket) {
  let direction;
  if (event.key === 'w' || event.key === 'ArrowUp') {
    direction = 'up';
  } else if (event.key === 's' || event.key === 'ArrowDown') {
    direction = 'down';
  } else if (event.key === 'a' || event.key === 'ArrowLeft') {
    direction = 'left';
  } else if (event.key === 'd' || event.key === 'ArrowRight') {
    direction = 'right';
  }
  console.log('Moving snake', direction);
  if (direction && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: 'move',
        direction,
      }),
    );
  }
}
