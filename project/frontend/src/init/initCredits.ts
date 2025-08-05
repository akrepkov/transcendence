import { showCreditView } from '../navigation/navigation.js';

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
