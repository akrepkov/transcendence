import { GameManager } from './gameLogic.js';

export let globalPlayers = [];
export const gameManager = new GameManager();
let nextPlayerId = 1;
let height = 600;
let width = 800;



export function getPlayerById(id) {
	return globalPlayers.find(p => p.id === id) || null;
}

export function updatePlayerStatus(player, status, opponentId = null, gameId = null) {
	player.status = status;
	player.opponentId = opponentId;
	player.gameId = status === 'playing' ? gameId : null;
	player.socket.send(JSON.stringify({
		type: 'statusUpdate',
		status,
		opponentId,
		gameId: player.gameId
	}));
	broadcastWaitingRoom();
}

function sendMessageEveryone(message) {
	for (const player of globalPlayers) {
		if (player.socket.readyState === 1) { // 1 - Websocket is open
			player.socket.send(message);
		}
	}
}

function handleMessage(player, message) {
	let data;
	try {
		data = JSON.parse(message);
	} catch (err) {
		console.error("Invalid JSON from client:", message);
		return;
	}
	switch (data.type) {
		case 'gameInvitation':
			sendGameInvitation(data.opponentId, data.inviterId);
			break;
		case 'gameAccepted':
			acceptGameInvitation(data.inviterId, data.opponentId);
			break;
		case 'gameDenied':
			denyGameInvitation(data.inviterId, data.opponentId);
			break;
		case 'move':
			gameManager.handlepaddleMovement(data.playerId, data.direction);
			break;
		case 'stopGame':
			gameManager.stopGame(data.playerId);
			break;
		default:
			console.error('Unknown message type:', data.type);
	}
}
function denyGameInvitation(inviterId, opponentId) {
	const inviter = getPlayerById(inviterId);
	const opponent = getPlayerById(opponentId);
	if (!inviter || !opponent) return;
	// inviter.socket.send(JSON.stringify({
	// 	type: 'gameDenied',
	// 	message: `Player ${opponentId} declined the game.`
	// }));
	updatePlayerStatus(inviter, 'rejection');
	setTimeout(() => {
		updatePlayerStatus(inviter, 'waiting');
	}, 2000);
	updatePlayerStatus(opponent, 'waiting');
}


function acceptGameInvitation(inviterId, opponentId) {
	const inviter = getPlayerById(inviterId);
	const opponent = getPlayerById(opponentId);
	if (!inviter || !opponent) return;
	updatePlayerStatus(inviter, 'playing', opponentId);
	updatePlayerStatus(opponent, 'playing', inviterId);
	[inviter.socket, opponent.socket].forEach(sock =>
		sock.send(JSON.stringify({
			type: 'gameAccepted',
			message: `Game accepted!`,
			inviterId: inviter.id,
			opponentId: opponent.id
		}))
	);
	gameManager.startGame(height, width, inviterId, opponentId);

}

function sendGameInvitation(opponentId, inviterId) {
	const inviter = getPlayerById(inviterId);
	const opponent = getPlayerById(opponentId);
	if (!inviter || !opponent) return;
	// console.log("Sending game invitation to opponent: ", opponentId, " from ", inviterId);
	updatePlayerStatus(inviter, 'invitation', opponentId);
	updatePlayerStatus(opponent, 'invited', inviterId);
	opponent.socket.send(JSON.stringify({
		type: 'gameInvitationReceived',
		theOnewhoInvited: inviter.id,
		me: opponent.id,
		message: `Player ${inviterId} wants to play!`
	}));
}


function handleDisconnect(socket, player) {
	let opponent = getPlayerById(player.opponentId);
	if (opponent) {
		updatePlayerStatus(opponent, 'waiting');
	}
	gameManager.stopGame(player.id);
	globalPlayers = globalPlayers.filter(player => player.socket !== socket);
	const playersList = globalPlayers.map(player => ({ id: player.id }));
	updatePlayerStatus(player, "disconnected")
}


function broadcastWaitingRoom() {
	//For each player in players, create a new object that only includes { id: player.id }.
	const playersList = globalPlayers
		.filter(player => player.status === 'waiting')
		.map(player => ({ id: player.id }));
	//playersList = [
	//   { id: 1 },
	//   { id: 2 }
	// ];
	const stringifiedMessage = JSON.stringify({
		type: 'waitingRoom',
		players: playersList
	});
	sendMessageEveryone(stringifiedMessage);
}

const gameWebsocketHandler = (socket) => {
	const player = {
		id: nextPlayerId++, //will be added or changed to usernames
		socket,
		status: 'waiting',
		gameId: null,
		opponentId: null
	};
	globalPlayers.push(player);
	socket.send(JSON.stringify({
		type: 'playerId',
		playerId: player.id
	}));

	broadcastWaitingRoom();

	socket.on('message', (message) => {
		handleMessage(player, message)
	});

	socket.on('close', () => {
		handleDisconnect(socket, player)
	});
}

export default {
	gameWebsocketHandler,
	handleMessage,
	handleDisconnect
};