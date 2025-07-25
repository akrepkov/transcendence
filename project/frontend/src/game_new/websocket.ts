export function setupSocketEvents(socket: WebSocket) {
  socket.onopen = () => {
    console.log('WebSocket connection opened.');
    const start = document.getElementById('start-button');
    if (!start) {
      throw new Error('Start button element not found');
    }
    start.addEventListener('click', () => {
      socket.send(JSON.stringify({ type: 'joinWaitingRoom' }));
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
