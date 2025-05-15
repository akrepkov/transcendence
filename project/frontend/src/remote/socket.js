

export function setupSocketEvents() {
    const socket = new WebSocket('wss://congenial-system-x76557wwgx93px46-3000.app.github.dev/ws/snake');
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