import { Game } from "./gameClass.js";
import { globalPlayers } from "./websocketRemote.js";
export let leftPlayerScore = 0;
export let rightPlayerScore = 0;

let games = [];

export function startGameEngine(height, width, inviterId, opponentId) {
    let game = new Game(height, width);
    game.addPlayer(inviterId);
    game.addPlayer(opponentId);
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