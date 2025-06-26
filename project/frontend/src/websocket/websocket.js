import AuthManager from '../managers/authManager.js';

let socket = null;

function handleMessage(event) {
  let data = JSON.parse(event.data);
  console.log(`[${new Date().toLocaleTimeString()}] Message received of type: `, data.type);
  switch (data.type) {
    case 'onlineUsers':
      console.log('online users', data.users);
      break;
    case 'logoutRequest':
      console.log('logout requested');
      AuthManager.requestedLogout();
      break;
    case 'default':
      console.log('Unknown message type');
  }
}

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
    handleMessage(event);
    // console.log('Message received:', event.data);
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

export function closeConnection(code, reason) {
  console.log('%c closing websocket', 'color:green');
  socket.close(code, reason);
  socket = null;
}
