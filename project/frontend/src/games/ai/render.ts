import { Game } from './types.js';

let game: Game;

export function getCanvasContext() {
  const canvas = document.getElementById('ai') as HTMLCanvasElement;
  if (!canvas) throw new Error('Canvas element not found');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D rendering context');
  return ctx;
}

export function showPongScore() {
  const scoreAi = document.getElementById('ai-score');
  if (scoreAi) {
    scoreAi.innerHTML = `
      <span style="color: red;">${game.player.name}</span> ${game.player.score} : 
      ${game.ai.score} <span style="color: blue;">${game.ai.name}</span>`;
  }
}

export function handleStartGame() {
  if (game?.isRunning) return;
  game = new Game();
  game.start();
}
