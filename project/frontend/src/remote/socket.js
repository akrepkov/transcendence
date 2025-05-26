import * as network from './network.js';
// import { updateGameState } from './gameStatic.js';
let inviter = {};

export function showSection(divToShow) {
    /*
el.classList.toggle(className, force) is a DOM method that toggles a class on the element:
If force is true, it adds the class.
If force is false, it removes the class.
    */
    const sections = ['waitingRoom', 'invitation', 'rejection', 'gameContainer'];
    sections.forEach(section => {
        const el = document.getElementById(section);
        if (el) {
            el.classList.toggle('hidden', section !== divToShow);
        }
    });
}

export function setupSocketEvents(socket) {
    showSection('waitingRoom');
    inviter.socket = socket;
    socket.onopen = () => {
        console.log("WebSocket connection opened.");
    };
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
            case 'playerId':
                console.log("Player ID received:", data.playerId);
                inviter.id = data.playerId; //find out your own ID from gameWebsocketHandler
                break;
            case 'waitingRoom':
                updatePlayersList(data.players); //its a list of available players
                break;
            case 'gameInvitationReceived':
                network.showInvitationPrompt(data, socket);
                break;
            case 'updateGameState':
                // console.log("updateGameState called in socket with data:", data);
                network.updateGameState(data);
                break;
            case 'gameAccepted':
                network.startGame(data, socket);
                break;
            case 'gameDenied':
                network.showRejectionNotice();
                break;
            case 'playerDisconnected':
                handleWaitingRoomDisconnection(data.players);
                break;
            case 'statusUpdate':
                handleStatusUpdate(data);
                break;
        }
    };
    socket.onerror = function (error) {
        console.error('WebSocket error:', error);
    };
    socket.onclose = function () {
        console.log('WebSocket connection closed.');
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'w' || e.key === 'ArrowUp') {
            socket.send(JSON.stringify({
                type: "move",
                direction: "up",
                playerId: inviter.id
            }));
        }
        else if (e.key === 's' || e.key === 'ArrowDown') {
            socket.send(JSON.stringify({
                type: "move",
                direction: "down",
                playerId: inviter.id
            }));
        }
    });

    window.addEventListener("hashchange", function (event) {
        if (event.oldURL !== event.newURL) {
            console.log("Hash changed from ", event.oldURL, " to ", event.newURL);
        }
    })

    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") {
            console.log("Tab is hidden");
            socket.send(JSON.stringify({
                type: "stopGame",
                playerId: inviter.id
            }));
            network.stopGame();
            // socket.close(); //??????????????????????
        }
    });

}

export function updatePlayersList(players) {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    players.forEach(player => {
        if (player.id !== inviter.id) {
            const listItem = document.createElement('li');
            listItem.textContent = player.id;
            const button = document.createElement('button');
            button.textContent = 'Play';
            button.onclick = () => network.sendGameInvitation(player.id, inviter);
            //when you create a new item, you need to add it to DOM
            listItem.appendChild(button);
            playersList.appendChild(listItem);
        }
    });
}

function handleWaitingRoomDisconnection(players) {
    updatePlayersList(players);
}

function handleStatusUpdate({ status, opponentId }) {
    switch (status) {
        case 'waiting':
            showSection('waitingRoom');
            break;
        case 'invited':
            showSection('invitation');
            break;
        case 'playing':
            showSection('gameContainer');
            break;
    }
}