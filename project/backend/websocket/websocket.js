function websocketHandler(socket) {
  console.log('hello');
  socket.on('message', (message) => {
    console.log('Message.');
    console.log(message);
    console.log(message.toString());
    console.log(message.type);
  });

  socket.on('close', () => {
    console.log('Connection closed.');
  });

  socket.on('error', (error) => {
    console.error('Websocket error:', error);
  });
}

export default {
  websocketHandler,
};
