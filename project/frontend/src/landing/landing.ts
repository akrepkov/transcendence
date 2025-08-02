import {
  showPongView,
  showSnakeView,
  showPracticeView,
  showLandingView,
  showAiView,
} from '../navigation/navigation.js';

export function initLandingEvents(): void {
  const pongButton = document.getElementById('pongButton');
  const snakeButton = document.getElementById('snakeButton');
  const practiceButton = document.getElementById('practiceButton');
  const aiButton = document.getElementById('aiButton');

  if (pongButton) {
    pongButton.addEventListener('click', () => {
      showPongView();
      history.pushState({ view: 'pong' }, '', '/pong');
    });
  }

  if (snakeButton) {
    snakeButton.addEventListener('click', () => {
      showSnakeView();
      history.pushState({ view: 'snake' }, '', '/snake');
    });
  }

  if (practiceButton) {
    practiceButton.addEventListener('click', () => {
      showPracticeView();
      history.pushState({ view: 'practice' }, '', '/practice');
    });
  }
  if (aiButton) {
    aiButton.addEventListener('click', () => {
      showAiView();
      history.pushState({ view: 'ai' }, '', '/ai');
    });
  }
}

export function initBackToLanding(buttonId: string): void {
  const btn = document.getElementById(buttonId);
  if (btn) {
    btn.addEventListener('click', () => {
      showLandingView();
      history.pushState({ view: 'landing' }, '', '/landing');
    });
  }
}
