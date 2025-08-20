import { Game } from './frontendPong.js';
import { globalSession } from '../../auth/auth.js';
import { getCanvasContext, putMessageOnScoreField } from './frontendRender.js';
import { centerOnCanvas } from '../../utils/uiHelpers.js';

let game: Game | null = null;

type StartOptions = {
  // If provided, the game will wait for this promise to resolve (e.g., showModal(...))
  waitFor?: Promise<unknown>;
  // Extra wait time (ms) after waitFor (or immediately) before starting
  delaysMs?: number;
};

const gameModeMap: Record<string, { canvasId: string; scoreFieldId: string }> = {
  ai: { canvasId: 'ai', scoreFieldId: 'ai-score' },
  practice: { canvasId: 'practice', scoreFieldId: 'practice-score' },
  tournament: { canvasId: 'tournament', scoreFieldId: 'tournament-score' },
};

export async function handleStartGame(
  mode: string,
  player1Name?: string,
  player2Name?: string,
  options: StartOptions = {},
) {
  const { canvasId, scoreFieldId } = gameModeMap[mode];
  if (game?.isRunning) return;

  if (mode === 'ai') {
    game = new Game(canvasId, scoreFieldId, globalSession.getUsername());
  } else if (mode === 'tournament') {
    if (!player1Name || !player2Name) {
      console.error('The tournament needs at least 2 players.');
      return;
    }
    game = new Game(canvasId, scoreFieldId, player1Name, player2Name);
  } else {
    game = new Game(canvasId, scoreFieldId, player1Name!, player2Name!);
  }

  // if (!game)
  //   startDelay = options.delaysMs ??
  game!.drawCanvas();
  centerOnCanvas(canvasId);

  // Backward-compatible default: previously started after ~500ms
  const startDelay = options.delaysMs ?? 1;

  // If a promise was provided (e.g., showModal(...)), wait for it
  if (options.waitFor) {
    await options.waitFor;
  }

  // Then wait the configured delay (e.g., a few seconds)
  if (startDelay > 0) {
    await delay(startDelay);
  }

  game!.start();
}

// export function handleStartGame(mode: string, player1Name?: string, player2Name?: string) {
//   const { canvasId, scoreFieldId } = gameModeMap[mode];
//   if (game?.isRunning) return;
//   if (mode === 'ai') {
//     game = new Game(canvasId, scoreFieldId, globalSession.getUsername());
//   } else {
//     game = new Game(canvasId, scoreFieldId, player1Name!, player2Name!);
//   }
//   console.log('INSIDE MANAGER: ', canvasId, player1Name, player2Name);
//   game!.drawCanvas();
//   centerOnCanvas(canvasId);
//   setTimeout(() => {
//     game!.start();
//   }, 500);
// }

export function resetGame(mode: string) {
  const { canvasId, scoreFieldId } = gameModeMap[mode];
  const canvas = getCanvasContext(canvasId);
  canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
  putMessageOnScoreField(scoreFieldId, '0 : 0');
  if (game) {
    game.stopGame();
    game = null;
  }
}

export function getCurrentGame() {
  return game;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
