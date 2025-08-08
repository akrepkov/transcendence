import { Game } from './frontendPong.js';

let game: Game | null = null;

const gameModeMap: Record<string, { canvasId: string; scoreFieldId: string }> = {
  ai: { canvasId: 'ai', scoreFieldId: 'ai-score' },
  practice: { canvasId: 'practice', scoreFieldId: 'practice-score' },
};

export function getCanvasContext(canvasId: string) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) throw new Error('Canvas element not found');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D rendering context');
  return ctx;
}

export function handleStartGame(mode: string, player1Name?: string, player2Name?: string) {
  const { canvasId, scoreFieldId } = gameModeMap[mode];
  if (game?.isRunning) return;
  if (mode === 'ai') {
    game = new Game(canvasId, scoreFieldId, 'Player');
  } else {
    game = new Game(canvasId, scoreFieldId, player1Name!, player2Name!);
  }
  game!.drawCanvas();
  setTimeout(() => {
    game!.start();
  }, 3000);
}

export function resetGame(mode: string) {
  const { canvasId, scoreFieldId } = gameModeMap[mode];
  const canvas = getCanvasContext(canvasId);
  canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
  const scoreAi = document.getElementById(scoreFieldId);
  if (scoreAi) scoreAi.textContent = '0 : 0';
  if (game) {
    game.stopGame();
    game = null;
  }
}
