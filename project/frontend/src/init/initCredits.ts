import { showCreditView } from '../navigation/navigation.js';

/**
 * Initializes navigation for the Credits screen.
 *
 * - Sets up click event listeners for:
 *   - Navigating to the credits view from a link.
 *   - Returning from the credits view to the login screen.
 *
 * - Updates the browser history state to reflect the active view.
 */
export function initCreditsNavigation() {
  const creditLink = document.getElementById('creditLink');
  const backFromCredit = document.getElementById('backFromCredit');

  if (creditLink) {
    creditLink.addEventListener('click', () => {
      history.pushState({ view: 'credits' }, '', '/credits');
      showCreditView();
    });
  }

  if (backFromCredit) {
    backFromCredit.addEventListener('click', () => {
      history.back(); // Go back instead of pushing a new state
    });
  }
}
