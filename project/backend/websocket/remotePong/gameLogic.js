import { Game } from "./gameClass.js";
import { globalPlayers, getPlayerById, updatePlayerStatus } from "./websocketRemote.js";
export let leftPlayerScore = 0;
export let rightPlayerScore = 0;

// let games = [];
let gameId = 1;


export class GameManager {
	constructor() {
		console.log("Created game manager")
		this.games = [];
	}

	addGame(game) {
		this.games.push(game);
	}

	removeGame(gameId) {
		this.games = this.games.filter(game => game.gameId !== gameId);
	}

	getGameByPlayerId(playerId) {
		return this.games.find(game =>
			game.players.some(p => p.id === playerId)
		);
	}
	startGame(height, width, inviterId, opponentId) {
		//console.log("existing games: ", this.games);
		let game = new Game(height, width, gameId);
		game.addPlayer(inviterId);
		game.addPlayer(opponentId);
		const inviter = getPlayerById(inviterId);
		const opponent = getPlayerById(opponentId);
		if (inviter && opponent) {
			updatePlayerStatus(inviter, 'playing', opponentId);
			updatePlayerStatus(opponent, 'playing', inviterId);
		}
		gameId++;
		this.games.push(game);
		game.gameLoop();
	}
	handlepaddleMovement(playerId, direction) {
		let game = this.getGameByPlayerId(playerId);
		if (!game) {
			console.error("Game not found for player:", playerId);
			return;
		}
		game.handleInput(playerId, direction);
	}
	stopGame(playerId) {
		let game = this.getGameByPlayerId(playerId);
		if (!game) {
			console.error("Game not found for player:", playerId);
			return;
		}
		game.stopGame();
		globalPlayers.filter(p => p.gameId === game.gameId).forEach(p => {
			updatePlayerStatus(p, 'waiting', p.opponentId);
		});
		this.removeGame(game.gameId);
		console.log("Game stopped for player:", playerId);
	}
}


export const gameManager = new GameManager();

export function startGameEngine(data) {
    const { inviterId, opponentId, height, width } = data;
    const inviter = getPlayerById(inviterId);
    const opponent = getPlayerById(opponentId);
	console.log("Start game for ", inviterId, " and , opponentId", opponentId);
    if (!inviter || !opponent) {
        console.error("Players not found for game start.");
        return;
    }

    updatePlayerStatus(inviter, 'playing', opponentId);
    updatePlayerStatus(opponent, 'playing', inviterId);

    gameManager.startGame(height, width, inviterId, opponentId);
	// console.log("existing games: ", games);
	// /*
	// The some() tests whether at least one element in the array 
	// passes the test implemented by function. 
	// It returns true if it finds an element for which the provided function returns true;
	// */
	// // const isPlayerInGame = games.some(game =>
	// // 	game.players.some(p => p.id === inviterId || p.id === opponentId)
	// // );

	// // if (isPlayerInGame) {
	// // 	console.warn(`One of the players is already in a game`);
	// // 	return;
	// // }
	// let game = new Game(height, width, gameId);
	// game.addPlayer(inviterId);
	// game.addPlayer(opponentId);
	// const inviter = getPlayerById(inviterId);
	// const opponent = getPlayerById(opponentId);
	// if (inviter && opponent) {
	// 	updatePlayerStatus(inviter, 'playing', opponentId);
	// 	updatePlayerStatus(opponent, 'playing', inviterId);
	// }
	// gameId++;
	// games.push(game);
	// game.gameLoop();

}

// export function handlepaddleMovement(playerId, direction) {
// 	let game = games.find(game =>
// 		game.players.find(p => p.id === playerId)
// 	);
// 	if (!game) {
// 		console.error("Game not found for player:", playerId);
// 		return;
// 	}
// 	game.handleInput(playerId, direction);
// 	// broadcastGameState();
// }


// // export function broadcastGameState(state) {
// // 	if (!state) return;
// // 	// console.log("Broadcasting game state:", state);
// // 	let inviterId = state.players[0].id;
// // 	let opponentId = state.players[1].id;
// // 	// if (!inviterId || !opponentId) {
// // 	// 	console.error("Inviter or opponent ID not found in game state");
// // 	// 	// stopGame(inviterId);
// // 	// 	// stopGame(opponentId);
// // 	// 	return;
// // 	// }
// // 	const message = {
// // 		type: 'updateGameState',
// // 		players: state.players,
// // 		ball: state.ball,
// // 		ballDirection: state.ballDirection
// // 	};
// // 	const inviter = getPlayerById(inviterId);
// // 	const opponent = getPlayerById(opponentId);
// // 	if (inviter && opponent) {
// // 		// console.log("Inviter: ", inviter.id, "Opponent: ", opponent.id);
// // 		[inviter.socket, opponent.socket].forEach(sock =>
// // 			sock.send(JSON.stringify({
// // 				type: 'updateGameState',
// // 				...message //instead of passing the whole object, I pass the properties
// // 			}))
// // 		);
// // 	}
// // 	else {
// // 		console.error("Inviter or opponent not found in globalPlayers");
// // 	}
// // }


// export function stopGame(playerId) {
// 	let game = games.find(game =>
// 		game.players.find(p => p.id === playerId)
// 	);
// 	if (!game) {
// 		console.error("Game not found for player:", playerId);
// 		return;
// 	}
// 	game.stopGame();
// 	// let opponent = getPlayerById(getPlayerById(playerId).opponentId);
// 	// if (!opponent) {
// 	// 	console.error("Opponent not found for player:", playerId);
// 	// 	return;
// 	// }
// 	// opponent.status = 'waiting';
// 	// opponent.gameId = null;
// 	// opponent.opponentId = null;
// 	globalPlayers.filter(p => p.gameId === game.gameId).forEach(p => {
// 		updatePlayerStatus(p, 'waiting', p.opponentId);
// 	});
// 	games = games.filter(g => g !== game);
// 	console.log("Game not really stopped for player:", playerId);
// }