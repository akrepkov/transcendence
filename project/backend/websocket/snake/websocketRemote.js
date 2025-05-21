import { updateBall, getGameState, moveLeftPaddle, moveRightPaddle } from './gameLogic.js';

let gameLoopStarted = false;
const gameClients = new Set();
let players = []; //for the differentiating players right now 1 and 2


function broadcastGameState() {
    const {
        ballX,
        ballY,
        leftPaddleY,
        rightPaddleY,
        leftPlayerScore,
        rightPlayerScore
    } = getGameState();
    const state = {
        type: 'stateUpdate',
        ball: { x: ballX, y: ballY },
        leftPaddleY,
        rightPaddleY,
        score: [leftPlayerScore, rightPlayerScore]
    };

    const message = JSON.stringify(state);
    for (const client of gameClients) {
        if (client.readyState === 1) { // 1 - Websocket is open
            client.send(message);
        }
    }
}

//setInterval(callback, delay, ...args);
//updateBall(); Moves the ball, checks for collisions, updates the score, etc.

//broadcastGameState(); Sends the updated game state to all connected clients via WebSocket.
//delay - 60 FPS (frames per second).
//setInterval returns an ID, which can be used to stop the interval later 
// using clearInterval(intervalId).






const startGameLoop = () => {
    console.log("Game loop started");
    //can start only once, otherwise will be asynchronized
    if (!gameLoopStarted) {
        console.log("Game loop go to update");
        gameLoopStarted = true;
        // Game loop (60 FPS)
        setInterval(() => {
            updateBall();
            broadcastGameState();
        }, 1000 / 60);
        // if (players.length === 0) {
        //     clearInterval(gameLoopInterval);
        //     gameLoopStarted = false;
        // }
    }
}



const gameWebsocketHandler = (socket) => {
    console.log('New game client connected:', gameClients.size);
    //add client to check for disconnections and send messages(changes)
    gameClients.add(socket);

    // Check if the game is full (2 players)
    if (players.length > 2) {
        socket.send(JSON.stringify({ type: 'error', message: 'Game is full' }));
        socket.close();
        return;
    }

    //otherwise, add the player to the game
    players.push(socket);
    const playerId = players.indexOf(socket) + 1; //was: players.length + 1, but the problem if someone reconnects, 
    // //id might be the same

    //send the player IDs
    socket.send(JSON.stringify({ type: 'playerId', playerId })); //send the player ID to the client
    
    
    if (players.length === 2)
        startGameLoop(); //running in the background



    socket.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Received message:', data, playerId);
        if (data.type === 'move') {
            if (playerId === 1) {
                if (data.key === 'ArrowUp') moveLeftPaddle('up');
                if (data.key === 'ArrowDown') moveLeftPaddle('down');
            }
            if (playerId === 2) {
                if (data.key === 'ArrowUp') moveRightPaddle('up');
                if (data.key === 'ArrowDown') moveRightPaddle('down');
            }
        }
    });

    socket.on('close', () => {
        //first delete a client, and after that remove the player using filter method
        //create new array and add there only players that are not equal to the socket
        gameClients.delete(socket);
        players = players.filter(p => p !== socket); 
    });
};


export default {
    gameWebsocketHandler
};