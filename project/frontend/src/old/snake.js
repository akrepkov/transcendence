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
<<<<<<< HEAD:project/frontend/src/snake.js

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
=======

    // const socket = new WebSocket('wss://congenial-system-x76557wwgx93px46-3000.app.github.dev/ws/snake');
	const socket = new WebSocket('ws://127.0.0.1:3000/ws/snake');
    setupSocketEvents(socket);
    // setupKeyboardControls(socket);
    // handleVisibilityChange(socket);

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
                case 'waitingRoom':
                    updatePlayersList(data.players); //its a list of available players
                    break;
                case 'stateUpdate':
                    updateGameState(data);
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









    function updateGameState(data) {
        gameState.leftPlayer = data.leftPlayer || [];
        gameState.rightPlayer = data.rightPlayer || [];
        gameState.apple = data.apple || { x: 0, y: 0 };
        gameState.directionLeft = data.directionLeft || { x: 1, y: 0 };
        gameState.directionRight = data.directionRight || { x: -1, y: 0 };        
    }






    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'playerId') {
            currentPlayerId = data.playerId; // <-- store your own ID
        }
        if (data.type === 'waitingRoom') {
            updatePlayersList(data.players);
        }
        if (data.type === 'stateUpdate') {
            gameState.leftPlayer = data.leftPlayer || [];
            gameState.rightPlayer = data.rightPlayer || [];
            gameState.apple = data.apple || { x: 0, y: 0 };
        }
        //I received game invitation and need to make a choice
        if (data.type === 'gameInvitationReceived') {
            // document.getElementById('playerList').style.display = "none";
            const { inviterId, message } = data;
            document.getElementById('invitation').style.display = "block";
            document.getElementById('acceptInvite').addEventListener('click', () => {
                document.getElementById('invitation').style.display = "none";
                socket.send(JSON.stringify({
                    type: 'gameAccepted',
                    inviterId: inviterId,
                    opponentId: currentPlayerId
                }));
            });
            document.getElementById('declineInvite').addEventListener('click', () => {
                document.getElementById('invitation').style.display = "none";
                socket.send(JSON.stringify({
                    type: 'gameDenied',
                    inviterId: inviterId,
                    opponentId: currentPlayerId
                }));
            });
        }
        if (data.type === 'gameAccepted') {
            // Start the game
            console.log(`Player ${currentPlayerId} accepted the game invitation from player ${data.inviterId}`);
            // Hide waiting room and show game
            document.getElementById('waitingRoom').style.display = 'none';
            document.getElementById('snakeContainer').style.display = 'block';
            snakeOn = true;
        }
        if (data.type === 'gameDenied') {
            const popup = document.getElementById('rejection');
            const room = document.getElementById('waitingRoom');
            // document.getElementById('playerList').style.display = "block";
            popup.style.display = "block";
            room.style.display = "none";
            setTimeout(() => {
                // Double-check they still exist in the DOM
                if (document.contains(popup)) {
                    popup.style.display = "none";
                    room.style.display = "block";
                }
            }, 4000);
            snakeOn = false;
        }
    };
>>>>>>> windows:project/frontend/src/old/snake.js

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

    drawGame();
    if (snakeOn === true) {
    document.addEventListener('visibilitychange', () => {
        console.log('Visibility changed:', document.visibilityState);
        if (document.visibilityState === 'hidden') {
            socket.send(JSON.stringify({ 
                type: 'stopGame', 
                opponentId: opponentId,
                inviterId: currentPlayerId
            }));
            if (animationFrame != null) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
            snakeOn = false;
        } 
    });
}

    function sendGameInvitation(opponentId) {
        console.log(`Inviting player ${opponentId} to play against you!`);
        // Send a message to the backend that player is inviting the opponent
        socket.send(JSON.stringify({
            type: 'gameInvitation',
            opponentId: opponentId,
            inviterId: currentPlayerId
        }));

    }













export function pauseSnakeGame() {
    if (!snakeOn) return;

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'stopGame',
            opponentId,
            inviterId: currentPlayerId
        }));
    }

    if (animationFrame != null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }

    snakeOn = false;
    console.log('Game paused (switched tab or visibility lost)');
}

