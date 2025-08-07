import { handleLogout } from '../auth/auth.js';
import { showLandingView, showProfileView } from '../navigation/navigation.js';

/**
 * Initializes main application-level event listeners.
 *
 * - Handles logout from the landing page.
 * - Handles navigation back to the landing page.
 * - Handles navigation back to the profile page.
 *
 * This setup is meant for buttons that are reused across views
 * and control key navigation or session behavior.
 */
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
