import { Game } from '../games/frontendGame/frontendPong.js';
import { toggleHandler } from './gameHandler.js';
import * as frontendGameManager from '../games/frontendGame/frontendGameManager.js';
import { globalSession } from '../auth/auth.js';
import { showMessage, showModal } from '../utils/uiHelpers.js';

const usernameInput = document.getElementById('tournamentUsername') as HTMLInputElement;
const addPlayerButton = document.getElementById('add-player-button') as HTMLButtonElement;
const startButton = document.getElementById('start-button-tour') as HTMLButtonElement;
const playerList = document.getElementById('player-list') as HTMLUListElement;
const tournamentMessage = document.getElementById('TournamentMessage') as HTMLElement;
const stopButton = document.getElementById('stop-button-tour') as HTMLButtonElement;

type Player = string;
const players: Player[] = [];
type Match = { round: number; player1: string; player2: string; winner: string };
const tour: Match[][] = [];
let tournamentActive = false;

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
    console.error('Could not validate player', error);
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

async function generatePlayerBrackets(rounds: number, currentRound: number) {
  if (!tour[currentRound - 1]) {
    tour[currentRound - 1] = [];
  }
  if (currentRound == 1) {
    for (let i = 0; i < players.length; i += 2) {
      const player1 = players[i];
      const player2 = players[i + 1];
      const match: Match = {
        round: currentRound,
        player1: player1,
        player2: player2,
        winner: 'nobody',
      };
      tour[currentRound - 1].push(match);
    }
  } else if (currentRound > 1) {
    for (let i = 0; i < tour[currentRound - 2].length; i += 2) {
      const player1 = tour[currentRound - 2][i].winner;
      const player2 = tour[currentRound - 2][i + 1].winner;
      const match: Match = {
        round: currentRound,
        player1: player1,
        player2: player2,
        winner: 'nobody',
      };
      tour[currentRound - 1].push(match);
    }
  }
}

async function playGame(currentRound: number) {
  for (let i = 0; i < tour[currentRound - 1].length; i++) {
    if (!tournamentActive) return;
    const player1 = tour[currentRound - 1][i].player1;
    const player2 = tour[currentRound - 1][i].player2;

    console.log('Starting game for:', player1, player2);
    await frontendGameManager.handleStartGame('tournament', player1, player2, {
      waitFor: showModal(
        `Round ${currentRound}: Match ${i + 1}: ${player1} vs ${player2}\nPress OK when ready to start!`,
      ),
      delaysMs: 100,
    });
    if (!tournamentActive) return;
    // Wait for the game to be created and started
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (!tournamentActive) return;

    const game = frontendGameManager.getCurrentGame();

    if (game) {
      await waitForGameToEnd(game);
      if (!tournamentActive) return;
      if (game.winner != 'nobody' && tour[currentRound - 1])
        tour[currentRound - 1][i].winner = game.winner;
      frontendGameManager.resetGame('tournament');
      // Wait a bit before starting the next game to ensure reset is complete
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (!tournamentActive) return;
    } else {
      console.error('No game instance returned!');
      return;
    }
  }
}

async function startTournament() {
  tournamentActive = true;
  tour.length = 0;
  const rounds = Math.log2(players.length);
  for (let i = 0; i < rounds; i++) {
    if (!tournamentActive) return;
    await generatePlayerBrackets(rounds, i + 1);
    if (!tournamentActive) return;
    await showModal(`Round ${i + 1} is about to start.`);
    if (!tournamentActive) return;
    await playGame(i + 1);
  }
  if (tour[rounds - 1] && tournamentActive) {
    tournamentActive = false;
    const finalWinner = tour[rounds - 1][0].winner;
    // Hide the game canvas
    document.getElementById('tournament')?.classList.add('hidden');

    const reply = await fetch('/api/auth/tournament', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: finalWinner }),
    });
    if (!reply.ok) {
      console.error('Winner results not saved.');
      return;
    }
  } else {
    tour.length = 0;
  }
}

export function initTournamentPlayers() {
  players.length = 0;
  playerList.innerHTML = '';
  document.getElementById('TournamentMessage')?.classList.add('hidden');
}

addPlayerButton?.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  if (players.includes(username)) {
    usernameInput.value = '';
    showMessage(tournamentMessage, "You're already in.");
  }
  if (username && !players.includes(username)) {
    const isValid = await validatePlayers(username);
    if (isValid) {
      players.push(username);
      renderPlayersList();
      usernameInput.value = '';
    } else {
      showMessage(tournamentMessage, 'This user is not registered, please register first.');
      return;
    }
  }
});

startButton?.addEventListener('click', async () => {
  if (players.length < 2 || (players.length & (players.length - 1)) !== 0) {
    showMessage(tournamentMessage, 'The number of players must be a power of 2');
    return;
  } else {
    toggleHandler.tourPage.clean();
    toggleHandler.tourPage.start();
    await startTournament();
  }
});
// add Enter key support
usernameInput.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    addPlayerButton.click();
  }
});

stopButton?.addEventListener('click', async () => {
  tournamentActive = false;
  tour.length = 0;
  players.length = 0;
  toggleHandler.tourPage.reset();
});
