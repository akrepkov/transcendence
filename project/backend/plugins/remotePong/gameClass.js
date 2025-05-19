
export class Ball {
    constructor(dirX, dirY, ballColor) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = dirX;
        this.speedY = dirY;
        this.size = 20;
        this.color = ballColor;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX;
    }
}

export class Paddle {
    constructor(x) {
        this.height = 100;
        this.width = 10;
        this.x = x;
        this.y = (canvas.height - this.height) / 2;
        this.paddleSpeed = 10;
    }

    drawPaddle() {
        context.fillStyle = 'white';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
};

// export default class PracticeGame {
//     constructor() {
//         this.running = false;
//         this.animationId = null;
//         this.balls = [];
//         this.leftPlayerScore = 0;
//         this.rightPlayerScore = 0;
//         this.maxScore = 3;
//         this.rgbColor = "white";
//         this.context = null;
//         this.canvas = document.getElementById("pong");
//         if (this.canvas) {
//             this.context = this.canvas.getContext("2d");
//         } else {
//             console.warn("Canvas not available.");
//         }
//     }

//     resetGame() {
//         this.balls = [];
//         this.rgbColor = "white";
//         this.leftPlayerScore = 0;
//         this.rightPlayerScore = 0;
//         this.maxScore = 3;
//     }

//     handleStartGame(counter) {
//         if (this.running) return;

//         this.running = true;
//         ActivityManager.setPracticePong();
//         const ballCount = counter || 1;
//         this.balls = [];
//         if (ballCount === 1) {
//             this.createBall(1, 1, this.rgbColor);
//         } else {
//             if (ballCount > 2) this.maxScore = 30;
//             for (let i = 0; i < ballCount; i++) {
//                 this.rgbColor = this.getRandomColor();
//                 const dirX = this.getRandomDirection();
//                 const dirY = this.getRandomDirection();
//                 this.createBall(dirX, dirY, this.rgbColor);
//             }
//         }
//         this.gameLoop();
//     }

//     handleStopGame() {
//         console.log("Stopping game");
//         if (this.animationId !== null) {
//             cancelAnimationFrame(this.animationId);
//             this.animationId = null;
//             this.running = false;
//         }
//         this.resetGameState();
//     }

//     resetGameState() {
//         this.balls = [];
//         this.leftPlayerScore = 0;
//         this.rightPlayerScore = 0;
//         this.maxScore = 3;

//         this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

//         this.leftPaddle = new Paddle(0);
//         this.rightPaddle = new Paddle(this.canvas.width - 10);

//         ActivityManager.unsetPracticePong();

//         console.log("Game fully stopped and cleared.");
//     }

//     createBall(dirX, dirY, ballColor) {
//         let ball = new Ball(dirX, dirY, ballColor);
//         console.log("The ball is created: ", dirX, dirY, ballColor);
//         this.balls.push(ball);
//     }

//     getRandomColor() {
//         return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
//     }

//     getRandomDirection() {
//         const directionSign = Math.random() > 0.5 ? -1 : 1;
//         return (Math.floor(Math.random() * 90) + 20) / 100 * directionSign;
//     }

//     updateGameStatus() {
//         const gameStatus = document.getElementById("gameStatusFrontend");
//         gameStatus.innerHTML = `${this.leftPlayerScore} - ${this.rightPlayerScore}`;
//     }

//     gameLoop() {
//         if (!this.running) return;

//         this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
//         this.movePaddles();
//         this.leftPaddle.drawPaddle();
//         this.rightPaddle.drawPaddle();
//         for (const ball of this.balls) {
//             ball.update();
//             ball.drawBall();
//             this.checkBall(ball);
//         }
//         this.updateGameStatus();

//         if (this.leftPlayerScore >= this.maxScore || this.rightPlayerScore >= this.maxScore) {
//             let winner = this.leftPlayerScore >= this.maxScore ? "Player 1" : "Player 2";
//             console.log(`${winner} wins!`);
//             this.handleStopGame();
//             return;
//         }

//         this.animationId = requestAnimationFrame(() => this.gameLoop());
//     }

//     checkBall(ball) {
//         // Top/bottom wall collision
//         if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
//             ball.speedY = -ball.speedY;
//         }
//         // Left paddle collision
//         if (ball.x <= leftPaddle.x + leftPaddle.width &&
//             ball.y + ball.size >= leftPaddle.y && ball.y <= leftPaddle.y + leftPaddle.height) {
//             ball.x = leftPaddle.x + leftPaddle.width;
//             ball.speedX = -ball.speedX;
//         }
//         // Right paddle collision
//         if (ball.x + ball.size >= rightPaddle.x &&
//             ball.x <= rightPaddle.x + rightPaddle.width &&
//             ball.y + ball.size >= rightPaddle.y &&
//             ball.y <= rightPaddle.y + rightPaddle.height) {
//             ball.x = rightPaddle.x - ball.size;
//             ball.speedX = -ball.speedX;
//         }
//         if (ball.x <= 0) {
//             rightPlayerScore++;
//             ball.reset();
//         }
//         if (ball.x + ball.size >= canvas.width) {
//             leftPlayerScore++;
//             console.log("leftPlayerScore", leftPlayerScore);
//             ball.reset();
//         }
//     }

//     movePaddles() {
//         if (keys.w && leftPaddle.y > 0) {
//             leftPaddle.y -= leftPaddle.paddleSpeed;
//         }
//         if (keys.s && leftPaddle.y + leftPaddle.height < canvas.height) {
//             leftPaddle.y += leftPaddle.paddleSpeed;
//         }
//         if (keys.ArrowUp && rightPaddle.y > 0) {
//             rightPaddle.y -= rightPaddle.paddleSpeed;
//         }
//         if (keys.ArrowDown && rightPaddle.y + rightPaddle.height < canvas.height) {
//             rightPaddle.y += rightPaddle.paddleSpeed;
//         }
//     }
// }