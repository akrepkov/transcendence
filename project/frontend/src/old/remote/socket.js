import * as network from './network.js';
import { showSection, handleStatusUpdate } from './remote.js';

let inviter = {};

export function setupSocketEvents(socket) {
  showSection('waitingRoom');
  inviter.socket = socket;
  socket.onopen = () => {
    console.log('WebSocket connection opened.');
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case 'playerId':
        console.log('Player ID received:', data.playerId);
        inviter.id = data.playerId; //find out your own ID from gameWebsocketHandler
        break;
      case 'waitingRoom':
        updatePlayersList(data.players); //its a list of available players
        break;
      case 'gameInvitationReceived':
        network.showInvitationPrompt(data, socket);
        break;
      case 'updateGameState':
        network.updateGameState(data);
        break;
      case 'gameAccepted':
        network.startGame(data, socket);
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
      socket.send(
        JSON.stringify({
          type: 'move',
          direction: 'up',
          playerId: inviter.id,
        }),
      );
    } else if (e.key === 's' || e.key === 'ArrowDown') {
      socket.send(
        JSON.stringify({
          type: 'move',
          direction: 'down',
          playerId: inviter.id,
        }),
      );
    }
  });

  // window.addEventListener("hashchange", function (event) {
  //     if (event.oldURL !== event.newURL) {
  //         console.log("Hash changed from ", event.oldURL, " to ", event.newURL);
  //         socket.send(JSON.stringify({
  //             type: "stopGame",
  //             playerId: inviter.id
  //         }));

  //         network.stopGame();

  //     }
  // })

  // document.addEventListener("visibilitychange", function () {
  //     if (document.visibilityState === "hidden") {
  //         console.log("Tab is hidden");
  //         socket.send(JSON.stringify({
  //             type: "stopGame",
  //             playerId: inviter.id
  //         }));
  //         network.stopGame();
  //     }
  // });
  socket.onclose = function () {
    console.log('WebSocket connection closed.');
    // attemptReconnect();
  };

  // function attemptReconnect() {
  // 	setTimeout(() => {
  // 		const newSocket = new WebSocket("ws://yourserver.com/path");
  // 		setupSocketEvents(newSocket); // Re-attach handlers
  // 	}, 3000); // Try again after a short delay
  // }
}

export function updatePlayersList(players) {
  const playersList = document.getElementById('playersList');
  playersList.innerHTML = '';
  players.forEach((player) => {
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

export function changeHashfromRemote() {
  console.log('I am leaving!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  if (inviter) {
    inviter.socket.send(
      JSON.stringify({
        type: 'statusChange',
        playerId: inviter.id,
        status: 'left',
      }),
    );
    network.stopGame();
  }
}

export function changeHashToRemote() {
  console.log('I am coming back to frontend remote');
  if (inviter.socket) {
    inviter.socket.send(
      JSON.stringify({
        type: 'statusChange',
        playerId: inviter.id,
        status: 'returned',
      }),
    );
  }
}
