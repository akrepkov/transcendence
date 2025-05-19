class Player {
    constructor(id, canvas) {
        this.id = id;
        this.paddleY = canvas.height / 2;
        this.paddleHeight = 100;
        this.paddleWidth = 10;
        this.score = 0;
        this.canvas = canvas;
        this.speed = 10;
    }
}

class Ball {
    constructor(canvas) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.size = 10;
        this.speedX = 2;
        this.speedY = 2;
        this.color = "white";
    }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.players = [];
        this.ball = new Ball(canvas);
        this.running = false;
    }

    addPlayer(id) {
        const player = new Player(id, this.canvas);
        this.players.push(player);
    }
    handleInput(playerId, direction) {
        const player = this.players.find(p => p.id === playerId);
        if (!player) return;
        if (direction === 'up' && player.paddleY > 0) {
            player.paddleY -= this.paddleSpeed;
        }
        if (direction === 'down' && player.paddleY + player.paddleHeight < this.canvas.height) {
            player.paddleY += this.paddleSpeed;
        }
    }
    checkBallCollision() {
        // Top/bottom wall collision
        if (this.ball.y <= 0 || this.ball.y + this.ball.size >= this.canvas.height) {
            this.ball.speedY = -this.ball.speedY;
        }
        // Left paddle collision
        const leftPlayer = this.players[0];
        if (this.ball.x <= leftPlayer.paddleWidth &&
            this.ball.y + this.ball.size >= leftPlayer.paddleY &&
            this.ball.y <= leftPlayer.paddleY + leftPlayer.paddleHeight) {
            this.ball.x = leftPlayer.paddleWidth;
            this.ball.speedX = -this.ball.speedX;
        }
        // Right paddle collision
        const rightPlayer = this.players[1];
        if (this.ball.x + this.ball.size >= rightPlayer.canvas.width - rightPlayer.paddleWidth &&
            this.ball.x <= rightPlayer.canvas.width - rightPlayer.paddleWidth &&
            this.ball.y + this.ball.size >= rightPlayer.paddleY &&
            this.ball.y <= rightPlayer.paddleY + rightPlayer.paddleHeight) {
            this.ball.x = rightPlayer.canvas.width - rightPlayer.paddleWidth - this.ball.size;
            this.ball.speedX = -this.ball.speedX;
        }
    }
    updateBall() {
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;
    }
    getGameState() {
        return {
            leftPlayerY: this.players[0].paddleY,
            rightPlayerY: this.players[1].paddleY,
            ball: {
                x: this.ball.x,
                y: this.ball.y
            },
            ballDirection: {
                x: this.ball.speedX,
                y: this.ball.speedY
            }
        };
    }
    broadcastGameState() {
        const state = this.getGameState();
        const message = JSON.stringify({
            type: 'stateUpdate',
            leftPlayerY: state.leftPlayerY,
            rightPlayerY: state.rightPlayerY,
            ball: state.ball,
            ballDirection: state.ballDirection
        });
        const inviter = players.find(p => p.id === players[0].id);
        const opponent = players.find(p => p.id === players[1].id);
        if (inviter && opponent) {
            [inviter.socket, opponent.socket].forEach(sock =>
                sock.send(JSON.stringify({
                    type: 'updateGameState',
                    message
                }))
            );
        }
    }

    gameLoop() {
        setInterval(() => {
            this.updateBall();
            this.checkBallCollision();
            this.getGameState();
            this.broadcastGameState();
        }, 1000 / 60);
    }

}

