

console.log('gameStatic.js loaded, requesting for view-remote');
export class Game {
    constructor() {
        let canvas = document.getElementById('gameRemote');
        if (!canvas) {
            console.error('Canvas element not found');
            return ;
        }
        this.ctx = canvas.getContext('2d');
        this.gameState = {
            leftPaddleY: 250,
            rightPaddleY: 250,
            ball: { x: 400, y: 300 },
            score: [0, 0],
            player1: "",
            player2: ""
        };
    }
    drawGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        ctx.fillRect(0, this.gameState.leftPaddleY, 10, 100);
        ctx.fillRect(canvas.width - 10, this.gameState.rightPaddleY, 10, 100);
        ctx.fillRect(this.gameState.ball.x, this.gameState.ball.y, 10, 10);

        // Score
        // ctx.font = '24px Arial';
        // ctx.fillText(`${this.gameState.player1} ${this.gameState.score[0]} - ${this.gameState.score[1]} ${this.gameState.player2}`, 370, 50);

        requestAnimationFrame(this.drawGame.bind(this));
    }
}

//game updates for canvas
function updateGameState(data) {
    gameState.leftPlayer = data.leftPlayer || [];
    gameState.rightPlayer = data.rightPlayer || [];
    gameState.apple = data.apple || { x: 0, y: 0 };
    gameState.directionLeft = data.directionLeft || { x: 1, y: 0 };
    gameState.directionRight = data.directionRight || { x: -1, y: 0 };
}

