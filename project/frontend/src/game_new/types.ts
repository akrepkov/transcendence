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

//Do we need it???????????????????
export interface GameState {
  opponent1?: string;
  gameId?: number;
  ball: Ball;
  players: Player[];
  state?: string;
  running?: boolean;
  //gameloop?
  //sockets?
}
