
export function openRemoteTab() {
  // const canvas = document.getElementById('gameRemote');
  // const ctx = canvas.getContext('2d');

    // console.log("Im in REMOTE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  //socket for codeapaces__))
  const socket = new WebSocket('wss://congenial-system-x76557wwgx93px46-3000.app.github.dev/ws/game');
  // let gameState = {
  //   leftPaddleY: 250,
  //   rightPaddleY: 250,
  //   ball: { x: 400, y: 300 },
  //   score: [0, 0]
  // };
  // let usernames = ["Player 1", "Player 2"];
  socket.onopen = function () {
    console.log('Connected to WebSocket server!');
  };

  // updates from server
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'stateUpdate') {
      gameState = data;
      console.log("Game state updated: ", gameState);
    }
    if (data.type === "playerId") {
      usernames[data.playerId - 1] = `Player ${data.playerId}`;
    }
  };
  socket.onerror = function (error) {
    console.error('WebSocket error:', error);
  };

  socket.onclose = function () {
    console.log('WebSocket connection closed.');
  };
  //send the pressed keys
  document.addEventListener('keydown', function (event) {
    console.log("Pressed key: ", event.key);
    const data = { type: 'move', key: event.key };
    socket.send(JSON.stringify(data)); // This sends to backend!
  });

  //draw the updates from server. This is canvas, needs to change
  function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';

    // Left paddle
    ctx.fillRect(0, gameState.leftPaddleY, 10, 100);

    // Right paddle
    ctx.fillRect(canvas.width - 10, gameState.rightPaddleY, 10, 100);

    // Ball
    ctx.fillRect(gameState.ball.x, gameState.ball.y, 10, 10);

    // Score
    ctx.font = '24px Arial';
    ctx.fillText(`${usernames[0]} ${gameState.score[0]} - ${gameState.score[1]} ${usernames[1]} `, 370, 50);

    requestAnimationFrame(drawGame);
  }

  drawGame();
}