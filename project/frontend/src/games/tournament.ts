// import { Game } from './types'; TODO FOR JAN
import { globalSession, checkLoginStatus } from '../auth/auth.js';

// let game: Game;

type Player = string;
const players: Player[] = [];
const isLoggedIn = globalSession.getLogstatus();
console.log('isLoggedIn: ', isLoggedIn);
if (isLoggedIn) {
  const host = globalSession.getUsername();
  players.push(host);
  renderPlayerList();
}

console.log('players: ', players);

const usernameInput = document.getElementById('tournamentUsername') as HTMLInputElement;
const addPlayerButton = document.getElementById('add-player-button') as HTMLButtonElement;
const playerList = document.getElementById('player-list') as HTMLUListElement;

addPlayerButton?.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username && !players.includes(username)) {
    players.push(username);
    renderPlayerList();
    usernameInput.value = '';
  }
});

function renderPlayerList() {
  playerList.innerHTML = '';
  players.forEach((player) => {
    const li = document.createElement('li');
    li.textContent = player;
    playerList.appendChild(li);
  });
}

// add Enter key support
document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    addPlayerButton.click();
  }
});
