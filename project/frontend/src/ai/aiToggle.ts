import { handleStartGame } from './render.js';

export function getCanvasContext() {
  const canvas = document.getElementById('ai') as HTMLCanvasElement;
  if (!canvas) throw new Error('Canvas element not found');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D rendering context');
  return ctx;
}

export function setupAiToggle() {
  console.log('Ai Toggle');
  const mainMenu = document.getElementById('main-menu');
  const aiBtn = document.getElementById('ai-btn');
  const aiStop = document.getElementById('stop-button-ai');
  const aiContainer = document.getElementById('ai-container');
  const startAi = document.getElementById('start-button-ai');

  if (!startAi) throw new Error('Start button Ai element not found');

  aiBtn?.addEventListener('click', () => {
    aiContainer?.classList.remove('hidden');
    startAi?.classList.remove('hidden');
    mainMenu?.classList.add('hidden');
  });

  startAi.addEventListener('click', () => {
    startAi?.classList.add('hidden');
    handleStartGame();
  });
  aiStop?.addEventListener('click', () => {
    aiContainer?.classList.add('hidden');
    mainMenu?.classList.remove('hidden');
  });
}
