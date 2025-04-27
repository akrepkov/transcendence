let snakeOn = false;
let currentPlayerId;
let animationFrame;
let gameState = {
    leftPlayer: [{ x: 0, y: 0 }],
    rightPlayer: [{ x: 790, y: 590 }],
    apple: { x: 400, y: 300 },
    directionLeft: { x: 1, y: 0 },
    directionRight: { x: -1, y: 0 }
};


export function openSnakeTab() {
    const canvas = document.getElementById('snakeGame');
    const ctx = canvas.getContext('2d');
    const playersList = document.getElementById('playersList');

    const socket = new WebSocket('wss://congenial-system-x76557wwgx93px46-3000.app.github.dev/ws/snake');

    setupSocketEvents(socket);
    setupKeyboardControls(socket);
    handleVisibilityChange(socket);

    //first we receive json from backend and decide what to do with it
    function setupSocketEvents(socket) {
        socket.onopen = () => {
            console.log('Connected to Snake WebSocket server!');
        };
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'playerId':
                    currentPlayerId = data.playerId; //find out your own ID
                    break;
                case 'stateUpdate':
                    updateGameState(data);
                    break;
                case 'waitingRoom':
                    updatePlayersList(data.players); //its a list of available players
                    break;
                case 'gameInvitationReceived':
                    showInvitationPrompt(data, socket);
                    break;
                case 'gameAccepted':
                    startGame();
                    break;
                case 'gameDenied':
                    showRejectionNotice();
                    break;
            }
        };
    }

    //game updates for canvas
    function updateGameState(data) {
        gameState.leftPlayer = data.leftPlayer || [];
        gameState.rightPlayer = data.rightPlayer || [];
        gameState.apple = data.apple || { x: 0, y: 0 };
        gameState.directionLeft = data.directionLeft || { x: 1, y: 0 };
        gameState.directionRight = data.directionRight || { x: -1, y: 0 };        
    }

    //Here I create a list of players and add buttons to play against them
    //if user chose the opponent, I send a game invitation
    function updatePlayersList(players) {
        playersList.innerHTML = '';
        players.forEach(player => {
            if (player.id !== currentPlayerId) {
                const listItem = document.createElement('li');
                listItem.textContent = player.id;
                const button = document.createElement('button');
                button.textContent = 'Play';
                button.onclick = () => sendGameInvitation(player.id);
                //when you create a new item, you need to add it to DOM
                listItem.appendChild(button);
                playersList.appendChild(listItem);
            }
        });
    }
    //User pressed play next to opponent, I send my and opponentId to backend
    function sendGameInvitation(opponentId, socket) {
        socket.send(JSON.stringify({
            type: 'gameInvitation',
            opponentId,
            inviterId: currentPlayerId
        }));
    }
    //opponent gets div block open with a choice to play or not
    function showInvitationPrompt({ inviterId }, socket) {
        const popup = document.getElementById('invitation');
        popup.style.display = "block";

        document.getElementById('acceptInvite').onclick = () => {
            popup.style.display = "none";
            socket.send(JSON.stringify({ 
                type: 'gameAccepted', 
                inviterId, 
                opponentId: currentPlayerId }));
        };

        document.getElementById('declineInvite').onclick = () => {
            popup.style.display = "none";
            socket.send(JSON.stringify({ 
                type: 'gameDenied', 
                inviterId, 
                opponentId: currentPlayerId }));
        };
    }
    //inviter gets a message that opponent rejected the game
    function showRejectionNotice() {
        const popup = document.getElementById('rejection');
        const room = document.getElementById('waitingRoom');
        popup.style.display = "block";
        room.style.display = "none";
        setTimeout(() => {
            popup.style.display = "none";
            room.style.display = "block";
        }, 4000);
        snakeOn = false;
    }

    //starts if json data.type is game accepted
    function startGame() {
        document.getElementById('waitingRoom').style.display = 'none';
        document.getElementById('snakeContainer').style.display = 'block';
        snakeOn = true;
        drawGame();
    }

    //I get all information from stateUpdate
    function drawGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';

        // Now snake is an array of segments
        for (let segment of gameState.leftPlayer) {
            ctx.fillRect(segment.x, segment.y, 10, 10);
        }
        for (let segment of gameState.rightPlayer) {
            ctx.fillRect(segment.x, segment.y, 10, 10);
        }
        // Draw apple
        ctx.fillRect(gameState.apple.x, gameState.apple.y, 10, 10);

        animationFrame = requestAnimationFrame(drawGame);
    }

    //sends key pressed to the backend//here i react on pressed buttons
    function setupKeyboardControls(socket) {
        document.addEventListener('keydown', (event) => {
            socket.send(JSON.stringify({
                type: 'move', 
                key: event.key }));
        });
    }


    //doesnt work yet
    function handleVisibilityChange(socket) {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden' && snakeOn) {
                socket.send(JSON.stringify({
                    type: 'stopGame',
                    inviterId: currentPlayerId,
                    opponentId: getOpponentId()
                }));
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
                snakeOn = false;
            }
        });
    }
}


// export function pauseSnakeGame() {
//     if (!snakeOn) return;

//     if (socket && socket.readyState === WebSocket.OPEN) {
//         socket.send(JSON.stringify({
//             type: 'stopGame',
//             opponentId,
//             inviterId: currentPlayerId
//         }));
//     }

//     if (animationFrame != null) {
//         cancelAnimationFrame(animationFrame);
//         animationFrame = null;
//     }

//     snakeOn = false;
//     console.log('Game paused (switched tab or visibility lost)');
// }
