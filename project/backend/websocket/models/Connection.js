export const wsState = Object.freeze({
  IDLE: 'idle',
  IN_GAME: 'inGame',
  WAITING_ROOM: 'waitingRoom',
});

export class Connection {
  constructor(socket, decodedToken) {
    this.userId = decodedToken.email;
    this.sessionId = decodedToken.sessionId;
    this.socket = socket;
    this.socket.isAlive = true;
    this.state = 'idle';
    this.gameId = null;
    this.closing = false;
  }

  updateState(newState) {
    if (Object.values(wsState).includes(newState)) {
      this.state = newState;
    }
  }
}
