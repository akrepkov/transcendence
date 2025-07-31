import { showProfileView } from '../navigation/navigation.js';

// /api/view_user_profile
// getUserProfileHandler check for what to pass in the body

export function initProfileEvents() {
  const profilePic = document.getElementById('avatar');

  if (profilePic) {
    profilePic.addEventListener('click', () => {
      showProfileView();
      history.pushState({ view: 'profile' }, '', '/profile');
    });
  }
}
