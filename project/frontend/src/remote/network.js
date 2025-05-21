
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
    canvas = document.getElementById('gameRemote');
    if (!canvas) {
        console.error("Canvas not found in updatePlayersList");
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


export function updateGameState(data) {
	console.log("updateGameState called with data in:", data);
	if (data.players && data.ball && data.ballDirection) {
		state.players = data.players;
		state.ball.x = data.ball.x;
		state.ball.y = data.ball.y;
		state.ballDirection = data.ballDirection;
		draw(); // Redraw after updating the state
	}
	else {
		console.error("No data received in updateGameState");
		if (loop !== null) {
			cancelAnimationFrame(loop);
			loop = null;
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
	}
}


let loop = "";
console.log('gameStatic.js loaded, requesting for view-remote');

export function draw() {
    // updateGameState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ball
    ctx.fillStyle = "white";
    ctx.fillRect(state.ball.x, state.ball.y, 10, 10);
	console.log("Ball position:", state.ball.x, state.ball.y);
    // Draw paddles
    ctx.fillStyle = "white";
    ctx.fillRect(0, state.players[0].paddleY, 10, 100); // left
    ctx.fillRect(canvas.width - 10, state.players[1].paddleY, 10, 100); // right
    // setTimeout(() => {
	// 	if (!state.ball) {
	// 		cancelAnimationFrame(loop);
	// 	}
    // }, 3000);
    loop = requestAnimationFrame(draw);
}


export function stopGame() {
	if (loop !== null) {
		cancelAnimationFrame(loop);
		loop = null;
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	document.getElementById('remote-game-container').style.display = 'none';
	document.getElementById('waitingRoom').style.display = 'block';
}