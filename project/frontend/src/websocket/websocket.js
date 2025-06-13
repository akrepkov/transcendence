let socket = null;

export function openConnection() {
  console.log('opening websocket');
  if (socket === null) {
    socket = new WebSocket('wss://localhost:3000/ws/connect');
  }
  socket.onopen = () => {
    console.log('WebSocket connection opened.');
    socket.send(JSON.stringify({ type: 'connect' }));
  };

  socket.onmessage = (event) => {
    console.log('Message received:', event.data);
  };

  socket.onclose = () => {
    console.log('Websocket connection closed.');
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
