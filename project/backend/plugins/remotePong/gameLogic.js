import { Game}  from "./gameClass.js";
export let leftPlayerScore = 0;
export let rightPlayerScore = 0;

let games = [];

export function startGameEngine(canvas, inviterId, opponentId) {
    let game = new Game(canvas);
    games.push(game);
    game.addPlayer(inviterId);
    game.addPlayer(opponentId);
    game.gameLoop();

}

export function handlepaddleMovement(player, direction) {
    let game = games.find(game => game.players(player => player.id === player.id));
    if (!game) {
        console.error("Game not found for player:", player.id);
        return;
    }
    game.handleInput(player.id, direction);
    game.broadcastGameState();
}
