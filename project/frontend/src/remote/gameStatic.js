
let loop = "";
console.log('gameStatic.js loaded, requesting for view-remote');

export function draw(canvas, ctx) {
    // updateGameState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ball
    ctx.fillStyle = "white";
    ctx.fillRect(state.ball.x, state.ball.y, 10, 10);
	console.log("Ball position:", state.ball.x, state.ball.y);
    // Draw paddles
    ctx.fillStyle = "white";
    ctx.fillRect(0, state.leftPlayerY, 10, 100); // left
    ctx.fillRect(canvas.width - 10, state.rightPlayerY, 10, 100); // right
    // setTimeout(() => {
    // }, 1000);
    loop = requestAnimationFrame(() => draw(canvas, ctx));
}



export function updateGameState(data) {
    console.log("updateGameState called with data:", data);
    if (data) {
        state.leftPlayerY = data.leftPlayerY;
        state.rightPlayerY = data.rightPlayerY;
        state.ball.x = data.ball.x;
        state.ball.y = data.ball.y;
        state.ballDirection = data.ballDirection;
    }
	else {
		console.error("No data received in updateGameState");
	if (loop !== null) {
		cancelAnimationFrame(loop);
		loop = null;
	}
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	}
}
