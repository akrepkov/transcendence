import { startGameEngine, stopGame } from './gameLogic.js';
import { handlepaddleMovement } from './gameLogic.js';

// const gameClients = new Set();
export let globalPlayers = [];
let nextPlayerId = 1;


export function getPlayerById(id) {
    return globalPlayers.find(p => p.id === id) || null;
}

export function updatePlayerStatus(player, status, opponentId = null) {
    player.status = status;
    player.opponentId = opponentId;
    player.gameId = status === 'playing' ? player.gameId : null;
    player.socket.send(JSON.stringify({
        type: 'statusUpdate',
        status,
        opponentId
    }));
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
        case 'move':
            handlepaddleMovement(data.playerId, data.direction);
            break;
        case 'gameInvitation':
            sendGameInvitation(data.opponentId, data.inviterId);
            break;
        case 'gameAccepted':
            acceptGameInvitation(data.inviterId, data.opponentId);
            break;
        case 'gameDenied':
            denyGameInvitation(data.inviterId, data.opponentId);
            break;
        case 'startGame':
            startGameEngine(data.height, data.width, data.inviterId, data.opponentId);
            break;
        case 'stopGame':
            stopGame(data.playerId);
            break;
        default:
            console.error('Unknown message type:', data.type);
    }
}
function denyGameInvitation(inviterId, opponentId) {
    const inviter = getPlayerById(inviterId);
    const opponent = getPlayerById(opponentId);
    if (!inviter || !opponent) return;
    console.log("DENYED!!!!!!!!!!! Sending game invitation to opponent: ", opponentId, " from ", inviterId);
    updatePlayerStatus(inviter, 'waiting');
    updatePlayerStatus(opponent, 'waiting');
    inviter.socket.send(JSON.stringify({
        type: 'gameDenied',
        message: `Player ${opponentId} declined the game.`
    }));

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

}

function sendGameInvitation(opponentId, inviterId) {
    const inviter = getPlayerById(inviterId);
    const opponent = getPlayerById(opponentId);
    if (!inviter || !opponent) return;
    console.log("Sending game invitation to opponent: ", opponentId, " from ", inviterId);
    updatePlayerStatus(inviter, 'inviting', opponentId);
    updatePlayerStatus(opponent, 'invited', inviterId);
    opponent.socket.send(JSON.stringify({
        type: 'gameInvitationReceived',
        theOnewhoInvited: inviter.id,
        me: opponent.id,
        message: `Player ${inviterId} wants to play!`
    }));
    broadcastWaitingRoom();
}


function handleDisconnect(socket, player) {
    let opponent = getPlayerById(player.opponentId);
    if (opponent) {
        updatePlayerStatus(opponent, 'waiting');
    }
    stopGame(player.id);
    globalPlayers = globalPlayers.filter(player => player.socket !== socket);
    // console.log("Player lisT : ", globalPlayers);
    const playersList = globalPlayers.map(player => ({ id: player.id }));
    const disconnectMessage = JSON.stringify({
        type: 'playerDisconnected',
        message: `Player ${player.id} disconnected`,
        players: playersList
    });
    sendMessageEveryone(disconnectMessage);
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
    // gameClients.add(socket);
    const player = {
        id: nextPlayerId++,
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