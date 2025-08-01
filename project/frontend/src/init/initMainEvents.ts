import { handleLogout } from '../auth/auth.js';
import { showLandingView, showProfileView } from '../navigation/navigation.js';

export function initMainEvents(): void {
  const logoutButton = document.getElementById('logoutLanding');
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }

  const returnButton = document.getElementById('return-to-landing');
  if (returnButton) {
    returnButton.addEventListener('click', () => {
      history.pushState({ view: 'landing' }, '', '/landing');
      showLandingView();
    });
  }

  const backToProfile = document.getElementById('backToProfile');
  if (backToProfile) {
    backToProfile.addEventListener('click', () => {
      history.pushState({ view: 'profile' }, '', '/profile');
      showProfileView();
    });
  }
}
