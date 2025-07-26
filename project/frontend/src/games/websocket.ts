let gameType: string | null = null;

export function getGameType() {
  console.log('Game Type ', gameType);
  return gameType;
}
export function setupSocketEvents(socket: WebSocket) {
  socket.onopen = () => {
    console.log('WebSocket connection opened.');
    const startPong = document.getElementById('start-button-pong');
    if (!startPong) {
      throw new Error('Start button element not found');
    }
    const startSnake = document.getElementById('start-button-snake');
    if (!startSnake) {
      throw new Error('Start button element not found');
    }
    startPong.addEventListener('click', () => {
      socket.send(JSON.stringify({ type: 'joinWaitingRoom', gameType: 'pong' }));
      gameType = 'pong';
    });
    startSnake.addEventListener('click', () => {
      socket.send(JSON.stringify({ type: 'joinWaitingRoom', gameType: 'snake' }));
      gameType = 'snake';
    });
  };
  socket.onerror = function (error) {
    console.error('WebSocket error:', error);
  };
  socket.onclose = function () {
    console.log('WebSocket connection closed.');
  };
}
/*
Jan:
What we do on error?
What we do on close?
*/
