import {startGameEngine} from './gameLogic.js';


// const gameClients = new Set();
let players = [];
let nextPlayerId = 1;
// Game state object to keep track of all entities
// let gameState = {
//     leftPlayer: "player1",
//     rightPlayer: "player2",
// };

function sendMessageEveryone(message) {
    for (const player of players) {
        if (player.socket.readyState === 1) { // 1 - Websocket is open
            player.socket.send(message);
        }
    }
}

function broadcastGameState() {
    // const {
    //     leftPlayer,
    //     rightPlayer,
    //     ball
    // } = gameState;
    // const state = {
    //     type: 'stateUpdate',
    //     leftPlayer,  // Passing the whole leftPlayer array
    //     rightPlayer, // Passing the whole rightPlayer array
    // };
    // const message = JSON.stringify(pong.getGameState());
    // sendMessageEveryone(message);
    // for (const client of gameClients) {
    //     if (client.readyState === 1) {
    //         client.send(message);
    //     }
    // }
}



// Initialize game state

// const startGameLoop = () => {
//     console.log("Starting game loop!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
//     //add ststus after finishing the game
// }


function handleMessage(player, message) {
    const data = JSON.parse(message);
    switch (data.type) {
        case 'move':
            handlepaddleMovement(player, data.direction);
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
            startGameEngine(data.canvas, data.inviterId, data.opponentId);
            break;
        default:
            console.error('Unknown message type:', data.type);
    }
}
function denyGameInvitation(inviterId, opponentId) {
    const inviter = players.find(p => p.id === inviterId);
    console.log("Sending game invitation to opponent: ", opponentId, " from ", inviterId);

    if (inviter) {
        inviter.socket.send(JSON.stringify({
            type: 'gameDenied',
            message: `Player ${opponentId} declined the game.`
        }));
    }
}


function acceptGameInvitation(inviterId, opponentId) {
    const inviter = players.find(p => p.id === inviterId);
    const opponent = players.find(p => p.id === opponentId);
    inviter.status = 'playing';
    opponent.status = 'playing';
    if (inviter && opponent) {
        [inviter.socket, opponent.socket].forEach(sock =>
            sock.send(JSON.stringify({
                type: 'gameAccepted',
                message: `Game accepted!`,
                inviterId: inviter.id,
                opponentId: opponent.id
            }))
        );
        broadcastWaitingRoom();
    }
}

function sendGameInvitation(opponentId, inviterId) {
    const opponent = players.find(p => p.id === opponentId);
    const inviter = players.find(p => p.id === inviterId);
    console.log("Sending game invitation to opponent: ", opponentId, " from ", inviterId);
    if (opponent) {
        opponent.socket.send(JSON.stringify({
            type: 'gameInvitationReceived',
            theOnewhoInvited: inviter.id,
            me: opponent.id,
            message: `Player ${inviterId} wants to play!`
        }));
    }
}


function handleDisconnect(socket, player) {
    players = players.filter(player => player.socket !== socket);
    console.log("Player lisT : ", players);
    const playersList = players.map(player => ({ id: player.id }));
    // player.socket.delete();
    // players.forEach((players, index) => {
    //     players.id = index + 1;
    // });

    const disconnectMessage = JSON.stringify({
        type: 'playerDisconnected',
        message: `Player ${player.id} disconnected`,
        players: playersList
    });
    sendMessageEveryone(disconnectMessage);
}


function broadcastWaitingRoom() {
    //For each player in players, create a new object that only includes { id: player.id }.
    const playersList = players
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
        opponentId: null
    };
    players.push(player);
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
    broadcastGameState,
    handleMessage,
    handleDisconnect
};