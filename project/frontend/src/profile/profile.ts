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

export async function addFriend(userName: string, friendUsername: string) {
  const res = await fetch('/api/add_friend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userName,
      friendUsername,
    }),
  });

  if (res.ok) {
    const data = await res.json();
    // make friend visible on page happend automatically upon refresh showProfileView?
    console.log(data);
  } else {
    console.error('Error adding friend');
  }
}

export async function showFriendPage(friendUsername: string) {
  await showProfileView(friendUsername);
}

//game stats send api request from backend

//game history send api from backend
