import {
  showPongView,
  showSnakeView,
  showPracticeView,
  showLandingView,
} from '../navigation/navigation.js';

export function initLandingEvents(): void {
  const pongButton = document.getElementById('pongButton');
  const snakeButton = document.getElementById('snakeButton');
  const practiceButton = document.getElementById('practiceButton');

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
