import {
  showPongView,
  showSnakeView,
  showPracticeView,
  showLandingView,
  showAiView,
  showTourView,
} from '../navigation/navigation.js';

/**
 * Initializes click event listeners on buttons within the landing page.
 *
 * - Each button navigates the user to a different feature view (Pong, Snake, Practice, AI).
 * - Updates the browser's history state accordingly.
 */
export function initLandingEvents(): void {
  const pongButton = document.getElementById('pongButton');
  const snakeButton = document.getElementById('snakeButton');
  const practiceButton = document.getElementById('practiceButton');
  const aiButton = document.getElementById('aiButton');
  const tourButton = document.getElementById('tourButton');

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
  if (tourButton) {
    tourButton.addEventListener('click', () => {
      showTourView();
      history.pushState({ view: 'tournament' }, '', '/tournament');
    });
  }
}

/**
 * Attaches a click event listener to a button that navigates back to the landing page.
 */
export function initBackToLanding(): void {
  const buttons = document.querySelectorAll('.back-button');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      console.log(`Back button clicked: ${btn.id}`);
      showLandingView();
      history.pushState({ view: 'landing' }, '', '/landing');
    });
  });
}
