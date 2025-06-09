function websocketHandler(socket) {
  console.log('hello');
  socket.onopen = () => {
    console.log('hello');
  };
}

export default {
  websocketHandler,
};
