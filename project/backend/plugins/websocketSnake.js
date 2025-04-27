import * as snake from './snakeLogic.js';

let gameLoopStarted = false;
const gameClients = new Set();
let players = [];
let gameLoopId = null;

//Sends updated game state to all connected clients.
function broadcastGameState() {
    const {
        leftPlayer,
        rightPlayer,
        apple,
        directionLeft,
        directionRight
     } = snake.getGameState();

    const state = {
        type: 'stateUpdate',
        leftPlayer,  // Passing the whole leftPlayer array
        rightPlayer, // Passing the whole rightPlayer array
        apple,
        directionLeft,
        directionRight
    };
    const message = JSON.stringify(state);

    for (const client of gameClients) {
        if (client.readyState === 1) {
            client.send(message);
        }
    }
}

//Starts the main game loop if not already started.
const startGameLoop = () => {
    console.log("Starting game loop!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    if (!gameLoopStarted) {
        gameLoopStarted = true;
        gameLoopId = setInterval(() => {
            snake.moveForward();
            broadcastGameState();
        }, 1000 / 10); // 10 FPS for Snake
    }
};

//doesnt work yet
const stopGameLoop = () => {   
    console.log("Stopping game loop!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    if (gameLoopStarted) {
        clearInterval(gameLoopId);
        gameLoopStarted = false;
        gameLoopId = null;
    }
}

//Sends a a list of players to all clients in the waiting room.
function broadcastWaitingRoom() {
    //.map() is a JavaScript array method that goes through each element in an array and 
    // creates a new array by applying a function to every element.
    const playersList = players.map(p => ({ id: p.id }))
    const stringifiedMessage = JSON.stringify({ 
        type: 'waitingRoom', 
        players: playersList 
    });
    for (const client of gameClients) {
        if (client.readyState === 1)
            client.send(stringifiedMessage);
    }
}

//The main function that handles the WebSocket connection for the Snake game.
//It manages player connections, game invitations, and game state updates.
//It also handles player disconnections and resets the game state.
//The function takes a WebSocket object as an argument and adds it to the gameClients set.
//When a new player connects, it assigns them an ID and sends them their ID and the waiting room list.
//When a player sends a move command, it updates the game state accordingly.
//When a player sends a game invitation, it finds the opponent's socket and sends them the invitation.
//When a player accepts a game invitation, it notifies both players and starts the game loop.
//When a player disconnects, it removes them from the gameClients set and updates the player list.
//It also resets the game state and sends a disconnection message to all clients.
const snakeWebsocketHandler = (socket) => {
    // Register new player
    gameClients.add(socket);
    const newPlayer = { id: players.length + 1, socket };
    players.push(newPlayer);

    // Send the new player their ID
    socket.send(JSON.stringify({
        type: 'playerId',
        playerId: newPlayer.id
    }));

    // Send waiting room list for everyone when someone connects
    broadcastWaitingRoom();
    
    socket.on('message', (message) => {
        //This is a message I receive from the client
        const data = JSON.parse(message);
        const {type} = data; //the same as const type = data.type
        console.log("ID " + newPlayer.id); //check
        
        switch (type) {
            case 'move':
                snake.movePlayer(data.key, newPlayer.id);
                break;

            case 'gameInvitation': {
                const { opponentId, inviterId } = data;
                const opponent = players.find(p => p.id === opponentId);
                if (opponent) {
                    opponent.socket.send(JSON.stringify({
                        type: 'gameInvitationReceived',
                        inviterId,
                        message: `Player ${inviterId} wants to play!`
                    }));
                }
                break;
            }
            case 'gameAccepted': {
                const { inviterId, opponentId } = data;
                const inviter = players.find(p => p.id === inviterId);
                const opponent = players.find(p => p.id === opponentId);
                if (inviter && opponent) {
                    [inviter.socket, opponent.socket].forEach(sock =>
                        sock.send(JSON.stringify({
                            type: 'gameAccepted',
                            message: `Game accepted!`
                        }))
                    );
                    startGameLoop();
                }
                break;
            }

            case 'gameDenied': {
                const { inviterId, opponentId } = data;
                const inviter = players.find(p => p.id === inviterId);
                if (inviter) {
                    inviter.socket.send(JSON.stringify({
                        type: 'gameDenied',
                        message: `Player ${opponentId} declined the game.`
                    }));
                }
                break;
            }

            //doesnt work yet
            case 'stopGame': {
                const { inviterId, opponentId } = data;
                const inviter = players.find(p => p.id === inviterId);
                const opponent = players.find(p => p.id === opponentId);

                if (inviter) {
                    inviter.socket.send(JSON.stringify({
                        type: 'leaveGame',
                        message: `Opponent ${opponentId} has left the game.`
                    }));
                }

                if (opponent) {
                    opponent.socket.send(JSON.stringify({
                        type: 'leaveGame',
                        message: `You have left the game.`
                    }));
                }

                stopGameLoop();
                break;
            }
        }
    });

    socket.on('close', () => {
        gameClients.delete(socket);
        players = players.filter(p => p.socket !== socket);
        players.forEach((players, index) => {
            players.id = index + 1;
        });

        const disconnectMessage = JSON.stringify({
            type: 'playerDisconnected',
            message: `Player ${newPlayer.id} disconnected`
        });
        for (const client of gameClients) {
            if (client.readyState === 1) {
                client.send(disconnectMessage);
            }
        }
        stopGameLoop();
        // snake.resetGame()
    });
};

export default {
    snakeWebsocketHandler
};