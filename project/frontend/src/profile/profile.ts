import { showProfileView } from '../navigation/navigation.js';

export function initProfileEvents() {
  const profilePic = document.getElementById('profilePic');

  if (profilePic) {
    profilePic.addEventListener('click', () => {
      showProfileView();
      history.pushState({ view: 'profile' }, '', '/profile');
    });
  }
}
