let socket = null;

export function openConnection() {
  console.log('%c opening websocket', 'color:green');
  if (socket === null) {
    socket = new WebSocket('wss://localhost:3000/ws/connect');
  }
  socket.onopen = () => {
    console.log('WebSocket connection opened.');
    socket.send(JSON.stringify({ type: 'connect' }));
    // socket.send('connect');
  };

  socket.onmessage = (event) => {
    console.log('Message received:', event.data);
  };

  socket.onclose = (error) => {
    console.log('Websocket connection closed.', error.code, error.reason);
    socket = null;
  };

  socket.onerror = (error) => {
    console.error('Websocket error:', error);
    socket = null;
  };
}

export function sendMessage() {
  socket.send(JSON.stringify({ type: 'connect' }));
  socket.send('connect');
}

export function closeConnection() {
  console.log('%c closing websocket', 'color:green');
  socket.close(1000, 'Closing connection');
  socket = null;
}
