import { navigateTo, showProfileView, showSettingsView } from '../navigation/navigation.js';

export function initProfileEvents() {
  const avatar = document.getElementById('avatar');
  const settingsButon = document.getElementById('settingsToggle');
  const backButton = document.getElementById('backToProfile');

  if (avatar) {
    avatar.addEventListener('click', () => {
      navigateTo('profile', '/profile', showProfileView);
    });
  }

  if (settingsButon) {
    settingsButon.addEventListener('click', () => {
      navigateTo('settings', '/settings', showSettingsView);
    });
  }

  if (backButton) {
    backButton.addEventListener('click', () => {
      navigateTo('profile', '/profile', showProfileView);
    });
  }
}
