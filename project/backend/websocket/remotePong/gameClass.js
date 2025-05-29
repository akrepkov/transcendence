import { getPlayerById } from "./websocketRemote.js";

class Player {
	constructor(id, height, gameId) {
		console.log("Create a player");
		this.id = id;
		this.gameId = gameId;
		this.paddleY = height / 2;
		this.paddleHeight = 100;
		this.paddleWidth = 10;
		this.score = 0;
		this.paddleSpeed = 10;
	}
}

class Ball {
	constructor(height, width, gameId) {
		console.log("Create a game");
		this.x = width / 2;
		this.y = height / 2;
		this.size = 10;
		this.speedX = 2;
		this.speedY = 2;
		this.color = "white";
		this.gameId = gameId;
	}
}

export class Game {
	constructor(height, width, gameId) {
		this.height = height;
		this.width = width;
		this.players = [];
		this.ball = new Ball(height, width, this.gameId);
		this.running = false;
		this.gameLoopId = null;
		this.gameId = gameId;
	}

	addPlayer(id) {
		const player = new Player(id, this.height, this.gameId);
		this.players.push(player);
	}
	handleInput(playerId, direction) {
		const player = this.players.find(p => p.id === playerId);
		if (!player) {
			console.error("Player not found:", playerId);
			return;
		}
		console.log("Player found:", playerId);
		if (direction === 'up' && player.paddleY > 0) {
			player.paddleY -= player.paddleSpeed;
		}
		if (direction === 'down' && (player.paddleY + player.paddleHeight) < this.height) {
			player.paddleY += player.paddleSpeed;
		}
	}
	checkBallCollision() {
		// Top/bottom wall collision
		if (this.ball.y <= 0 || this.ball.y + this.ball.size >= this.height) {
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
		if (this.ball.x + this.ball.size >= this.width - rightPlayer.paddleWidth &&
			this.ball.x <= this.width - rightPlayer.paddleWidth &&
			this.ball.y + this.ball.size >= rightPlayer.paddleY &&
			this.ball.y <= rightPlayer.paddleY + rightPlayer.paddleHeight) {
			this.ball.x = this.width - rightPlayer.paddleWidth - this.ball.size;
			this.ball.speedX = -this.ball.speedX;
		}
	}
	updateBall() {
		this.ball.x += this.ball.speedX;
		this.ball.y += this.ball.speedY;
	}
	getGameState() {
		if (this.players.length < 2) {
			this.stopGame();
			return null;
		}
		return {
			players: this.players,
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

	broadcastState() {
		if (!this.running) return;
		const state = this.getGameState();
		if (!state) return;

		const inviterId = this.players[0].id;
		const opponentId = this.players[1].id;
		const inviter = getPlayerById(inviterId);
		const opponent = getPlayerById(opponentId);

		if (inviter && opponent) {
			const message = JSON.stringify({
				type: 'updateGameState',
				players: state.players,
				ball: state.ball,
				ballDirection: state.ballDirection,
				gameId: state.gameId
			});
			[inviter.socket, opponent.socket].forEach(sock => {
				if (sock.readyState === 1) sock.send(message);
			});
		}
	}

	gameLoop() {
		if (this.running) return; 
		this.running = true;
		this.gameLoopId = setInterval(() => {
			this.updateBall();
			this.checkBallCollision();

			// console.log ("Game state in :", state);
			this.broadcastState();
		}, 1000/60)// 60 FPS
	}

	stopGame() {
		if (this.running) {
			clearInterval(this.gameLoopId);
			this.running = false;
			console.log("Game stopped");
		}
		this.players = [];
	}

}

