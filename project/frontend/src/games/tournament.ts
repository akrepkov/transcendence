// import { Game } from './types'; TODO FOR JAN
import { globalSession } from '../auth/auth.js';

// let game: Game;

const usernameInput = document.getElementById('tournamentUsername') as HTMLInputElement;
const addPlayerButton = document.getElementById('add-player-button') as HTMLButtonElement;
const playerList = document.getElementById('player-list') as HTMLUListElement;

async function validatePlayers(username: string) {
  try {
    const response = await fetch('/api/auth/me?username=${username}', {
      method: 'GET',
    });
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (error) {
    console.log('Internal Server Error', error);
    return false;
  }
}

export function initTournamentPlayers() {
  playerList.innerHTML = '';
  type Player = string;
  const players: Player[] = [];
  const isLoggedIn = globalSession.getLogstatus();
  if (isLoggedIn) {
    const host = globalSession.getUsername();
    players.push(host);
    const li = document.createElement('li');
    li.textContent = host;
    playerList.appendChild(li);
  }
  addPlayerButton?.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    if (username && !players.includes(username)) {
      players.push(username);
      const isValid = await validatePlayers(username);
      if (isValid) {
        const li = document.createElement('li');
        li.textContent = username;
        usernameInput.value = '';
        playerList.appendChild(li);
      } else {
        alert('This user is not registered, please register first.');
        return;
      }
    }
  });
}

// add Enter key support
document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    addPlayerButton.click();
  }
});
