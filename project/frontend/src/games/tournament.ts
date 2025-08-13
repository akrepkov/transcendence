import { Game } from '../games/frontendGame/frontendPong.js';
import * as frontendGameManager from '../games/frontendGame/frontendGameManager.js';
import { globalSession } from '../auth/auth.js';

export const MAX_SCORE = 3;

const game: Game | null = null;

const usernameInput = document.getElementById('tournamentUsername') as HTMLInputElement;
const addPlayerButton = document.getElementById('add-player-button') as HTMLButtonElement;
const startButton = document.getElementById('start-button-tour') as HTMLButtonElement;
const playerList = document.getElementById('player-list') as HTMLUListElement;

type Player = string;
const players: Player[] = [];
type Tournament = {
  match: number;
  player1: string;
  player2: string;
  winner: string;
};

async function validatePlayers(username: string) {
  try {
    const response = await fetch(`/api/view_user_profile?username=${username}`, {
      method: 'GET',
    });
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.log('Internal Server Error', error);
    return false;
  }
}

function renderPlayersList() {
  playerList.innerHTML = '';
  const host = globalSession.getUsername();
  players.forEach((player) => {
    const li = document.createElement('li');
    li.textContent = player === host ? `${player} (host)` : player;
    playerList.appendChild(li);
  });
}

function getWinnerAndLoser(game: Game, player1: string, player2: string) {
  if (game.player1.score > game.player2.score) {
    return { winner: game.player1, loser: game.player2 };
  } else {
    return { winner: game.player2, loser: game.player1 };
  }
}

function waitForGameToEnd(game: Game): Promise<void> {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (!game.isRunning) {
        clearInterval(interval);
        resolve();
      }
    }, 100); // check every 100ms
  });
}

function checkWinCondition(game: Game, player1: string, player2: string) {
  if (game.player1.score >= MAX_SCORE || game.player2.score >= MAX_SCORE) {
    game.stopGame();
    const { winner, loser } = getWinnerAndLoser(game, player1, player2);
    alert('Game Over! And the winner is ' + winner + '!');
  }
}

function generatePlayerBrackets() {}

export function initTournamentPlayers() {
  playerList.innerHTML = '';
  const isLoggedIn = globalSession.getLogstatus();
  if (isLoggedIn) {
    const host = globalSession.getUsername();
    if (host) {
      players.push(host);
    }
  }
  renderPlayersList();
  addPlayerButton?.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    if (username && !players.includes(username)) {
      const isValid = await validatePlayers(username);
      if (isValid) {
        players.push(username);
        renderPlayersList();
        usernameInput.value = '';
      } else {
        alert('This user is not registered, please register first.');
        return;
      }
    }
  });

  startButton?.addEventListener('click', async () => {
    console.log('START button clicked');
    if (players.length < 2 || (players.length & (players.length - 1)) !== 0) {
      alert('The number of players must be a power of 2');
      return;
    }
    const tour: Tournament[] = [];
    for (let i = 0; i < players.length; i += 2) {
      const player1 = players[i];
      const player2 = players[i + 1];
      console.log('Starting game for:', player1, player2);
      frontendGameManager.handleStartGame('tournament', player1, player2);

      // Wait for the game to be created and started
      await new Promise((resolve) => setTimeout(resolve, 600));

      const game = frontendGameManager.getCurrentGame();
      console.log('THE GAME IS: ', game);
      if (game) {
        console.log('Game started:', game);
        await waitForGameToEnd(game);
        tour.push({
          match: i + 1,
          player1: game.player1.name,
          player2: game.player2.name,
          winner: game.winner,
        });
        frontendGameManager.resetGame('tournament');
        // Wait a bit before starting the next game to ensure reset is complete
        await new Promise((resolve) => setTimeout(resolve, 200));
      } else {
        console.log('No game instance returned!');
      }
    }
  });
}

// add Enter key support
usernameInput.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    addPlayerButton.click();
  }
});
