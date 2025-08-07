/**
 * Game canvas dimensions used for both Pong and Snake games.
 */
export const GAME_CONSTS = {
  WIDTH: 800,
  HEIGHT: 600,
};

/**
 * Represents a player in the Pong game.
 */
export interface Player {
  paddleY: number;
  paddleX: number;
  score: number;
  playerName: string;
}

/**
 * Represents the ball in the Pong game.
 */
export interface Ball {
  x: number;
  y: number;
  size: number;
}

/**
 * Represents the full game state for a Pong match.
 */
export interface GameStatePong {
  gameId?: number;
  ball: Ball;
  players: Player[];
  state?: string;
  running?: boolean;
  //gameloop?
  //sockets?
}

/**
 * Represents a player in the Snake game.
 */
export interface PlayerSnake {
  head: { x: number; y: number }[];
  score: number;
  playerName: string;
}

/**
 * Represents the apple object in Snake.
 */
export interface Apple {
  x: number;
  y: number;
  size: number;
}

/**
 * Represents the full game state for a Snake match.
 */
export interface GameStateSnake {
  gameId?: number;
  apple: Apple;
  players: PlayerSnake[];
  state?: string;
  running?: boolean;
}
