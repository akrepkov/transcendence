import { GameClient } from './gameStatic.js';
import { showSection, clearAllInvitationTimeouts } from './remote.js';

let gameClient = null;
let inviterTimeout = null;
let opponentTimeout = null;

/*Inviter*/
export function sendGameInvitation(opponentId, inviter) {
  showSection('');
  inviter.socket.send(
    JSON.stringify({
      type: 'gameInvitation',
      opponentId,
      inviterId: inviter.id,
    }),
  );
}

/*Opponent*/
export function showInvitationPrompt({ theOnewhoInvited, me }, socket) {
  showSection('invitation');
  opponentTimeout = setTimeout(() => {
    socket.send(
      JSON.stringify({
        type: 'gameDenied',
        inviterId: theOnewhoInvited,
        opponentId: me,
      }),
    );
    clearAllInvitationTimeouts(inviterTimeout, opponentTimeout);
    showSection('waitingRoom');
  }, 5000);
  document.getElementById('acceptInvite').onclick = () => {
    clearAllInvitationTimeouts(inviterTimeout, opponentTimeout);
    socket.send(
      JSON.stringify({
        type: 'gameAccepted',
        inviterId: theOnewhoInvited,
        opponentId: me,
      }),
    );
  };
  document.getElementById('declineInvite').onclick = () => {
    clearAllInvitationTimeouts(inviterTimeout, opponentTimeout);
    socket.send(
      JSON.stringify({
        type: 'gameDenied',
        inviterId: theOnewhoInvited,
        opponentId: me,
      }),
    );
  };
}

export async function startGame(data, socket) {
  clearAllInvitationTimeouts(inviterTimeout, opponentTimeout);
  showSection('gameContainer');
  gameClient = new GameClient('gameRemote');
  gameClient.running = true;
}

export function updateGameState(data) {
  if (gameClient.loop === null) {
    gameClient.draw();
  }
  if (gameClient) {
    gameClient.updateState(data);
  }
}

export function stopGame() {
  if (gameClient) {
    gameClient.stop();
  }
  showSection('waitingRoom');
}
