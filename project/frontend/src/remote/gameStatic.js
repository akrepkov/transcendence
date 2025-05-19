

console.log('gameStatic.js loaded, requesting for view-remote');

let state = {
    leftPlayer: 100,
    rightPlayer: 100,
    ball: {
        x: 50,
        y: 50
    },
    ballDirection: {
        x: 1,
        y: 1
    }
}


export function draw(canvas) {
    updateGameState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ball
    ctx.fillStyle = "white";
    ctx.fillRect(state.ball.x, state.ball.y, 10, 10);

    // Draw paddles
    ctx.fillStyle = "white";
    if (state.players.length === 2) {
        ctx.fillRect(0, state.players[0].y, 10, 100); // left
        ctx.fillRect(canvas.width - 10, state.players[1].y, 10, 100); // right
    }

    requestAnimationFrame(draw(canvas));
}





export function updateGameState(data) {
    if (data) {
        state = {
            leftPlayer: state.leftPlayerY,
            rightPlayer: state.rightPlayerY,
            ball: {
                x: state.ball.x,
                y: state.ball.y
            },
            ballDirection: {
                x: state.ballDirection.x,
                y: state.ballDirection.y
            }

        }
    } else {
        state = {
            leftPlayer: 100,
            rightPlayer: 100,
            ball: {
                x: 50,
                y: 50
            },
            ballDirection: {
                x: 1,
                y: 1
            }
        }
        console.log("Game state updated:", state);
    }
}

