import { Game } from './frontendPong.js';
import { globalSession } from '../../auth/auth.js';
import { getCanvasContext, putMessageOnScoreField } from './frontendRender.js';
import { centerOnCanvas } from '../../utils/uiHelpers.js';

let game: Game | null = null;

const gameModeMap: Record<string, { canvasId: string; scoreFieldId: string }> = {
  ai: { canvasId: 'ai', scoreFieldId: 'ai-score' },
  practice: { canvasId: 'practice', scoreFieldId: 'practice-score' },
};

export function handleStartGame(mode: string, player1Name?: string, player2Name?: string) {
  const { canvasId, scoreFieldId } = gameModeMap[mode];
  if (game?.isRunning) return;
  if (mode === 'ai') {
    game = new Game(canvasId, scoreFieldId, globalSession.getUsername());
  } else {
    game = new Game(canvasId, scoreFieldId, player1Name!, player2Name!);
  }
  game!.drawCanvas();
  centerOnCanvas(canvasId);
  setTimeout(() => {
    game!.start();
  }, 500);
}

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
