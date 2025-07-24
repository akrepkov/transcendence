import { messageManager } from '../../managers/messageManager.js';
import { gameManager } from '../../managers/gameManager.js';
import { REJECT } from '../../managers/messageManager.js';
import { SnakePlayer } from './Player.js';
import { GAME_CONSTS } from '../Game.js';

export const SNAKE_CONSTS = {
  WIDTH: 800,
  HEIGHT: 600,
  SNAKE_SPEED: 1,
  LEFT_PLAYER: [{ x: 0, y: HEIGHT / 2 }],
  RIGHT_PLAYER: [{ x: WIDTH - 10, y: HEIGHT / 2 }], //TODO change to a real position
};

export class Snake {
  constructor(connection1, connection2, gameId) {
    this.gameId = gameId;
    this.apple = new Apple();
    this.players = [
      new SnakePlayer(connection1.userId, GAME_CONSTS.LEFT_PLAYER),
      new SnakePlayer(connection2.userId, GAME_CONSTS.RIGHT_PLAYER),
    ];
    this.playerSockets = [connection1.socket, connection2.socket];
    this.playerConnections = [connection1, connection2];
    this.state = {
      players: this.players,
      apple: this.apple,
    };
    this.gameLoop = null;
    this.running = false;
  }

  handleInput(playerId, direction) {
    const player = this.players.find((player) => player.playerName === playerId);
    const oldHead = player.positions[0];
    let newHead;
    switch (direction) {
      case 'up':
        newHead = { x: oldHead.x, y: oldHead.y - GAME_CONSTS.SNAKE_SPEED };
        player.directions = { x: 0, y: -1 };
        break;
      case 'down':
        newHead = { x: oldHead.x, y: oldHead.y + GAME_CONSTS.SNAKE_SPEED };
        player.directions = { x: 0, y: 1 };
        break;
      case 'left':
        newHead = { x: oldHead.x - GAME_CONSTS.SNAKE_SPEED, y: oldHead.y };
        player.directions = { x: -1, y: 0 };
        break;
      case 'right':
        newHead = { x: oldHead.x + GAME_CONSTS.SNAKE_SPEED, y: oldHead.y };
        player.directions = { x: 1, y: 0 };
        break;
      default:
        console.warn(`Invalid direction: ${direction} for player: ${playerId}`);
        throw new Error(`${REJECT.WRONG_DIRECTION}`);
    }
    player.checkCollisions();
    player.positions.unshift(newHead);
    player.positions.pop();
  }

  broadcastState() {
    messageManager
      .createBroadcast({
        gameType: 'snake',
        type: 'updateGameState',
        players: [this.players[0].getPlayerState(), this.players[1].getPlayerState()],
        apple: this.apple.getAppleState(),
      })
      .to.sockets(this.playerSockets);
  }

  //JAN___JAN___JAN
  // checkWinCondition() {
  //   if (
  //     this.players[0].score >= GAME_CONSTS.MAX_SCORE ||
  //     this.players[1].score >= GAME_CONSTS.MAX_SCORE
  //   ) {
  //     this.stopGame();
  //     messageManager
  //       .createBroadcast({
  //         type: 'gameOver',
  //         players: [this.players[0].getPlayerState(), this.players[1].getPlayerState()],
  //         winner:
  //           this.players[0].score > this.players[1].score
  //             ? this.players[0].playerName
  //             : this.players[1].playerName,
  //       })
  //       .to.sockets(this.playerSockets);
  //     gameManager.removeGame(this.gameId);
  //   }
  // }

  // handleScoring() {
  //   if (this.ball.x <= 0) {
  //     this.players[1].score++;
  //     // this.ball.reset();
  //     this.checkWinCondition();
  //   } else if (this.ball.x >= GAME_CONSTS.WIDTH) {
  //     this.players[0].score++;
  //     // this.ball.reset();
  //     this.checkWinCondition();
  //   }
  // }

  stopGame() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    this.running = false;
  }

  startGame() {
    if (this.running) return;
    this.running = true;
    console.log('Game starts');
    while (this.running === true) {
      this.players[0].automatedMove();
      this.players[1].automatedMove();
      if (this.running) {
        this.broadcastState();
        console.log('Return');
        return;
      }
    }
  }
}
