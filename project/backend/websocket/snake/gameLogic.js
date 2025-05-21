
const WIDTH = 800;
const HEIGHT = 600;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;

let leftPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let rightPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let ballX = WIDTH / 2;
let ballY = HEIGHT / 2;
let ballSpeedX = 4;
let ballSpeedY = 2;
let leftPlayerScore = 0;
let rightPlayerScore = 0;

function resetBall() {
    ballX = WIDTH / 2;
    ballY = HEIGHT / 2;
    ballSpeedX = -ballSpeedX; //change direction
}

export function updateBall() {
    // console.log("Ball x: y: ", ballX, ballY);
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY + BALL_SIZE >= HEIGHT) { //up and down walls
        ballSpeedY = -ballSpeedY;
    }

    // Left paddle collision
    if (ballX <= 10 && ballY > leftPaddleY && ballY < leftPaddleY + PADDLE_HEIGHT) {
        ballSpeedX = -ballSpeedX;
    }

    // Right paddle collision
    if (ballX >= WIDTH - 10 - BALL_SIZE && ballY > rightPaddleY && ballY < rightPaddleY + PADDLE_HEIGHT) {
        ballSpeedX = -ballSpeedX;
    }

    // Scoring
    if (ballX <= 0) {
        rightPlayerScore++;
        resetBall();
    }
    if (ballX >= WIDTH) {
        leftPlayerScore++;
        resetBall();
    }
}

export function moveLeftPaddle(direction) {
    if (direction === 'up' && leftPaddleY > 0) {
        leftPaddleY -= 10;
    } else if (direction === 'down' && leftPaddleY < HEIGHT - PADDLE_HEIGHT) {
        leftPaddleY += 10;
    }
}
export function moveRightPaddle(direction) {
    if (direction === 'up' && rightPaddleY > 0) {
        rightPaddleY -= 10;
    } else if (direction === 'down' && rightPaddleY < HEIGHT - PADDLE_HEIGHT) {
        rightPaddleY += 10;
    }
}

export function getGameState() {
    return {
        ballX,
        ballY,
        leftPaddleY,
        rightPaddleY,
        leftPlayerScore,
        rightPlayerScore
    };
}