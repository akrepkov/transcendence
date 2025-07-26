export interface Player {
  paddleY: number;
  paddleX: number;
  score: number;
  playerName: string;
}

export interface Ball {
  x: number;
  y: number;
  size: number;
}

export interface GameStatePong {
  gameId?: number;
  ball: Ball;
  players: Player[];
  state?: string;
  running?: boolean;
  //gameloop?
  //sockets?
}

export interface PlayerSnake {
  head: { x: number; y: number }[];
  score: number;
  playerName: string;
}

export interface Apple {
  x: number;
  y: number;
  size: number;
}

export interface GameStateSnake {
  gameId?: number;
  apple: Apple;
  players: PlayerSnake[];
  state?: string;
  running?: boolean;
  //gameloop?
  //sockets?
}
