import { showSection } from "./socket.js";

let state = {
    players: [
        { id: 2, paddleY: 300, paddleHeight: 100, paddleWidth: 10, score: 0, paddleSpeed: 10 },
        { id: 1, paddleY: 300, paddleHeight: 100, paddleWidth: 10, score: 0, paddleSpeed: 10 }
    ],
    ball: { x: 412, y: 312 },
    ballDirection: { x: 2, y: 2 }
};

let canvas = null;
let ctx = null;

let inviterTimeout = null;
let opponentTimeout = null;

function clearAllInvitationTimeouts() {
    clearTimeout(inviterTimeout);
    clearTimeout(opponentTimeout);
    inviterTimeout = null;
    opponentTimeout = null;
}

export function sendGameInvitation(opponentId, inviter) {
    showSection("");
    inviter.socket.send(JSON.stringify({
        type: 'gameInvitation',
        opponentId,
        inviterId: inviter.id
    }));

    inviterTimeout = setTimeout(() => {
        console.log("Game invitation timeout. I am Inviter");
        inviter.socket.send(JSON.stringify({
            type: 'gameDenied',
            inviterId: inviter.id,
            opponentId
        }));
        clearAllInvitationTimeouts();
    }, 5000);
}

export function showInvitationPrompt({ theOnewhoInvited, me }, socket) {
    showSection("invitation");

    opponentTimeout = setTimeout(() => {
        console.log("Game invitation timeout. I am opponent");
        socket.send(JSON.stringify({
            type: 'gameDenied',
            inviterId: theOnewhoInvited,
            opponentId: me
        }));
        clearAllInvitationTimeouts();
        showSection("waitingRoom");
    }, 5000);

    document.getElementById('acceptInvite').onclick = () => {
        clearAllInvitationTimeouts();
        socket.send(JSON.stringify({
            type: 'gameAccepted',
            inviterId: theOnewhoInvited,
            opponentId: me
        }));
    };

    document.getElementById('declineInvite').onclick = () => {
        clearAllInvitationTimeouts();
        socket.send(JSON.stringify({
            type: 'gameDenied',
            inviterId: theOnewhoInvited,
            opponentId: me
        }));
        showSection("waitingRoom");
    };
}

export function showRejectionNotice() {
    showSection("rejection");
    setTimeout(() => showSection("waitingRoom"), 2000);
}

// Start game (called when accepted)
export function startGame({ inviterId, opponentId }, socket) {
    clearAllInvitationTimeouts();
    showSection("gameContainer");
    console.log("start Game called — starting game...");
    canvas = document.getElementById('gameRemote');
    if (!canvas) {
        console.error("Canvas not found in startGame");
        return;
    }
    ctx = canvas.getContext('2d');
    socket.send(JSON.stringify({
        type: 'startGame',
        height: canvas.height,
        width: canvas.width,
        inviterId,
        opponentId
    }));
    draw();
    console.log('Game constructor called');
}

// Update game visuals
export function updateGameState(data) {
    if (data.players && data.ball && data.ballDirection) {
        state.players = data.players;
        state.ball = { ...data.ball };
        state.ballDirection = { ...data.ballDirection };
        draw();
    } else {
        console.error("Invalid data in updateGameState");
        if (loop !== null) {
            cancelAnimationFrame(loop);
            loop = null;
        }
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

let loop = null;
console.log('gameStatic.js loaded, requesting view-remote');

// Draw loop
export function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(state.ball.x, state.ball.y, 10, 10);
    ctx.fillRect(0, state.players[0].paddleY, 10, 100); // left
    ctx.fillRect(canvas.width - 10, state.players[1].paddleY, 10, 100); // right
    loop = requestAnimationFrame(draw);
}

// Stop game
export function stopGame() {
    if (loop !== null) {
        cancelAnimationFrame(loop);
        loop = null;
    }
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    clearAllInvitationTimeouts();
    showSection("waitingRoom");
}
