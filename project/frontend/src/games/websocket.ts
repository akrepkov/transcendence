export function setupSocketEvents(socket: WebSocket) {
  socket.onopen = () => {
    console.log('WebSocket connection opened.');
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
