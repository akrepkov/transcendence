import * as network from './network.js';
import { updateGameState } from './gameStatic.js';
let inviter = {};
export function setupSocketEvents(socket) {
    inviter.socket = socket;
    socket.onopen = () => {
        console.log("WebSocket connection opened.");
    };
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
            case 'playerId':
                inviter.id = data.playerId; //find out your own ID from gameWebsocketHandler
                break;
            case 'waitingRoom':
                updatePlayersList(data.players); //its a list of available players
                break;
            case 'gameInvitationReceived':
                network.showInvitationPrompt(data, socket);
                break;
            case 'stateUpdate':
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
            case 'updateGameState':
                updateGameState(data);
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
