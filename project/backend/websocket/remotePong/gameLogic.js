import { Game } from "./gameClass.js";
import { globalPlayers } from "./websocketRemote.js";
export let leftPlayerScore = 0;
export let rightPlayerScore = 0;

let games = [];
let gameId = 1;

export function startGameEngine(height, width, inviterId, opponentId) {
	console.log( "existing games: ", games);
	const isPlayerInGame = games.some(game =>
		game.players.some(p => p.id === inviterId || p.id === opponentId)
	);

	if (isPlayerInGame) {
		console.warn(`One of the players is already in a game`);
		return;
	}
    let game = new Game(height, width, gameId);
    game.addPlayer(inviterId);
    game.addPlayer(opponentId);
    const inviter = globalPlayers.find(p => p.id === inviterId);
    const opponent = globalPlayers.find(p => p.id === opponentId);
    if (inviter) {
        inviter.status = 'playing';
        inviter.gameId = gameId;
    }
    if (opponent) {
        opponent.status = 'playing';
        opponent.gameId = gameId;
    }
	gameId++;
    games.push(game);
    game.gameLoop();

}

export function handlepaddleMovement(playerId, direction) {
    let game = games.find(game =>
        game.players.find(p => p.id === playerId)
    );
    if (!game) {
        console.error("Game not found for player:", playerId);
        return;
    }
    game.handleInput(playerId, direction);
    // broadcastGameState();
}


export function broadcastGameState(state) {
	if (!state) return;
	console.log("Broadcasting game state:", state);
	let inviterId = state.players[0].id;
	let opponentId = state.players[1].id;
	if (!inviterId || !opponentId) {
		console.error("Inviter or opponent ID not found in game state");
		return;
	}
	const message = {
		type: 'updateGameState',
		players: state.players,
		ball: state.ball,
		ballDirection: state.ballDirection
	};
	let inviter = globalPlayers.find(p => p.id === inviterId);
	let opponent = globalPlayers.find(p => p.id === opponentId);		
	if (inviter && opponent) {
		console.log("Inviter: ", inviter.id, "Opponent: ", opponent.id);
		[inviter.socket, opponent.socket].forEach(sock =>
			sock.send(JSON.stringify({
				type: 'updateGameState',
				...message //instead of passing the whole object, I pass the properties
			}))
		);
	}
	else {
		console.error("Inviter or opponent not found in globalPlayers");
	}
}


export function stopGame(playerId) {
	let game = games.find(game =>
        game.players.find(p => p.id === playerId)
    );
    if (!game) {
		console.error("Game not found for player:", playerId);
        return;
    }
	game.stopGame();
	globalPlayers.find(p => p.gameId === gmeme.gameId).status = 'waiting';
	games = games.filter(g => g !== game);
	console.log("Game not really stopped for player:", playerId);
}