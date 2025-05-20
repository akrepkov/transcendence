import { globalPlayers } from "./websocketRemote.js";
import { broadcastGameState } from "./gameLogic.js";

let gameLoopId = null;
class Player {
	constructor(id, height) {
		this.id = id;
		this.paddleY = height / 2;
		this.paddleHeight = 100;
		this.paddleWidth = 10;
		this.score = 0;
		this.paddleSpeed = 10;
	}
}

class Ball {
	constructor(height, width) {
		this.x = width / 2;
		this.y = height / 2;
		this.size = 10;
		this.speedX = 2;
		this.speedY = 2;
		this.color = "white";
	}
}

export class Game {
	constructor(height, width) {
		this.height = height;
		this.width = width;
		this.players = [];
		this.ball = new Ball(height, width);
		this.running = false;
	}

	addPlayer(id) {
		const player = new Player(id, this.height);
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
			// leftPlayerY: this.players[0].paddleY,
			// rightPlayerY: this.players[1].paddleY,
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
	// broadcastGameState() {
	// 	const state = this.getGameState();
	// 	if (!state) return;
	// 	console.log("Broadcasting game state:", state);
	// 	const message = {
	// 		type: 'stateUpdate',
	// 		leftPlayerY: state.leftPlayerY,
	// 		rightPlayerY: state.rightPlayerY,
	// 		ball: state.ball,
	// 		ballDirection: state.ballDirection
	// 	};
	// 	let inviterId = this.players[0].id;
	// 	let opponentId = this.players[1].id;
	// 	let inviter = globalPlayers.find(player => player.id === inviterId);
	// 	let opponent = globalPlayers.find(player => player.id === opponentId);		
	// 	console.log("Inviter: ", inviter.id, "Opponent: ", opponent.id);
	// 	if (inviter && opponent) {
	// 		[inviter.socket, opponent.socket].forEach(sock =>
	// 			sock.send(JSON.stringify({
	// 				type: 'updateGameState',
	// 				...message //instead of passing the whole object, I pass the properties
	// 			}))
	// 		);
	// 	}
	// 	else {
	// 		console.error("Inviter or opponent not found in globalPlayers");
	// 	}
	// }

	gameLoop() {
		this.running = true;
		gameLoopId = setInterval(() => {
			this.updateBall();
			this.checkBallCollision();
			let state = this.getGameState();
			console.log ("Game state in :", state);
			broadcastGameState(state);
		}, 3000)// 60 FPS
	}

	stopGame() {
		if (!this.running) {
			this.running = false;
			this.players = [];
			clearInterval(gameLoopId);
			console.log("Game stopped");
		}
	}

}

