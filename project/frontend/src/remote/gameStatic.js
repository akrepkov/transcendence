


export class Player {
    constructor(id, socket = null) {
        this.id = id;
        this.socket = socket;
        this.paddleY = 300;
        this.paddleHeight = 100;
        this.paddleWidth = 10;
        this.score = 0;
        this.paddleSpeed = 10;
    }
}
export class GameClient {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.state = {
            players: [],
            ball: { x: 412, y: 312 },
            ballDirection: { x: 2, y: 2 }
        };
        this.loop = null;
		this.running = false;
    }

    updateState(data) {
        if (!data.players[0] || !data.players[1] || !data.ball) {
            console.error("Invalid game state");
            return;
        }
        this.state.players = data.players;
        this.state.ball = data.ball;
        this.state.ballDirection = data.ballDirection;
		// console.log("Backend sends update");
    }

    draw() {
        const { ctx, canvas, state } = this;
		// console.log("Running in frontend");
        if (!state.players[0] || !state.players[1]) {
            console.warn("Draw skipped: players not yet initialized");
            return;
        }
		if (!this.running){
			console.log("Leave, please");
			return ;
		}
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.fillRect(state.ball.x, state.ball.y, 10, 10);
        ctx.fillRect(0, state.players[0].paddleY, 10, 100);
        ctx.fillRect(canvas.width - 10, state.players[1].paddleY, 10, 100);
        this.loop = requestAnimationFrame(this.draw.bind(this));
    }

    stop() {
		console.log ("STOPPING INSIDE THE CALSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
        if (this.loop) {
			cancelAnimationFrame(this.loop);
			this.loop = null;
		}
		this.running = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}