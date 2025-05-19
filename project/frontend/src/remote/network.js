// import { Game } from './gameStatic.js';
import {draw} from './gameStatic.js';

// let socket = "";
//User pressed play next to opponent, I send my and opponentId to backend
export function sendGameInvitation(opponentId, inviter) {
    inviter.socket.send(JSON.stringify({
        type: 'gameInvitation',
        opponentId,
        inviterId: inviter.id
    }));
}
//opponent gets div block open with a choice to play or not
export function showInvitationPrompt(data, socket) {
    const { theOnewhoInvited, me } = data;
    const popup = document.getElementById('invitation');
    popup.style.display = "block";

    document.getElementById('acceptInvite').onclick = () => {
        popup.style.display = "none";
        socket.send(JSON.stringify({
            type: 'gameAccepted',
            inviterId: theOnewhoInvited,
            opponentId: me
        }));
    };

    document.getElementById('declineInvite').onclick = () => {
        popup.style.display = "none";
        socket.send(JSON.stringify({
            type: 'gameDenied',
            inviterId: theOnewhoInvited,
            opponentId: me
        }));
    };
}


//inviter gets a message that opponent rejected the game
export function showRejectionNotice() {
    const popup = document.getElementById('rejection');
    const room = document.getElementById('waitingRoom');
    popup.style.display = "block";
    room.style.display = "none";
    setTimeout(() => {
        popup.style.display = "none";
        room.style.display = "block";
    }, 4000);
}

//starts if json data.type is game accepted
export function startGame({inviterId, opponentId}, socket) {
    document.getElementById('waitingRoom').style.display = 'none';
    document.getElementById('remote-game-container').style.display = 'block';
    console.log("start Game called — starting game...");
    const canvas = document.getElementById('gameRemote');
    if (!canvas) {
        console.error("Canvas not found in updatePlayersList");
        return;
    }
    let ctx = canvas.getContext('2d');
    socket.send(JSON.stringify({
        type: 'startGame',
        height: canvas.height,
        width: canvas.width,
        inviterId,
        opponentId
    }));
    draw(canvas, ctx);
    
    console.log('Game constructor called');
}