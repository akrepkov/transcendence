
let loop = "";
console.log('gameStatic.js loaded, requesting for view-remote');

let state = {
    leftPlayerY: 100,
    rightPlayerY: 100,
    ball: {
        x: 50,
        y: 50
    },
    ballDirection: {
        x: 1,
        y: 1
    }
}


export function draw(canvas, ctx) {
    // updateGameState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ball
    ctx.fillStyle = "white";
    ctx.fillRect(state.ball.x, state.ball.y, 10, 10);

    // Draw paddles
    ctx.fillStyle = "white";
    ctx.fillRect(0, state.leftPlayerY, 10, 100); // left
    ctx.fillRect(canvas.width - 10, state.rightPlayerY, 10, 100); // right
    // setTimeout(() => {
    // }, 1000);
    // loop = requestAnimationFrame(() => draw(canvas, ctx));
}



export function updateGameState(data) {
    console.log("updateGameState called with data:", data);
    if (data) {
        state.leftPlayerY = data.leftPlayerY;
        state.rightPlayerY = data.rightPlayerY;
        state.ball.x = data.ball.x;
        state.ball.y = data.ball.y;
        state.ballDirection = data.ballDirection;

        const canvas = document.getElementById('gameRemote');
        const ctx = canvas.getContext('2d');
        draw(canvas, ctx);
    }
}
