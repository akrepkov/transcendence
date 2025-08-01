import { showCreditView, showLoginView } from '../navigation/navigation.js';

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
      history.pushState({ view: 'auth', form: 'login' }, '', '/login');
      showLoginView();
    });
  }
}
