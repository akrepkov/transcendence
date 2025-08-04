import { navigateTo, showProfileView, showSettingsView } from '../navigation/navigation.js';
import { globalSession } from '../auth/auth.js';

export function initProfileEvents() {
  const avatar = document.getElementById('avatar');
  const settingsButon = document.getElementById('settingsToggle');
  const backButton = document.getElementById('backToProfile');
  const addFriendButton = document.getElementById('addFriendButton');

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

  if (addFriendButton) {
    addFriendButton.addEventListener('click', () => {
      const username = globalSession.getUsername();
      addFriend(); // needs value from promise?
    });
  }

  const backToOwnButton = document.getElementById('backToOwnProfile');
  if (backToOwnButton) {
    backToOwnButton.addEventListener('click', () => {
      const myUsername = globalSession.getUsername();
      navigateTo('profile', '/profile', () => showProfileView(myUsername));
    });
  }
}

function showFriendMessage(text: string, isError = false) {
  const message = document.getElementById('friendMessage');
  if (!message) return;

  message.textContent = text;
  message.classList.remove('text-blue-800', 'text-red-800', 'hidden');
  message.classList.add(isError ? 'text-red-800' : 'text-blue-800');

  setTimeout(() => {
    message.textContent = '';
  }, 4000);
}

export async function fetchUserProfile(username: string) {
  const res = await fetch(`/api/view_user_profile?userName=${encodeURIComponent(username)}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return res.json();
}

export async function addFriend() {
  const input = document.getElementById('addFriendInput') as HTMLInputElement | null;

  if (!input) {
    console.error('addFriendInput not found in DOM — make sure Profile view is visible');
    return;
  }

  const friendUsername = input.value.trim();
  if (!friendUsername) return;

  const userName = globalSession.getUsername();

  try {
    const res = await fetch('/api/add_friend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, friendUsername }),
    });

    if (res.ok) {
      await showFriends(userName);
      input.value = ''; // clear input after adding
      showFriendMessage('${friendUsername} Friend added successfully');
    } else {
      const { message } = await res.json().catch(() => ({}));
      showFriendMessage(message || 'Could not add friend', true);
    }
  } catch (err) {
    console.error('Request failed:', err);
    showFriendMessage('Server error. Please try again later.', true);
  }
}

export async function showFriends(username: string) {
  const list = document.getElementById('friendsList')?.querySelector('ul');
  if (!list) return;

  try {
    const data = await fetchUserProfile(username);
    const friends = data.friends ?? [];

    list.innerHTML = ''; //sets list to empty?

    if (friends.length === 0) {
      list.innerHTML = '<li class="text-black text-lg">No friends yet</li>';
      return;
    }

    for (const friend of friends) {
      const li = document.createElement('li');
      li.className =
        'border-b border-black pb-1 cursor-pointer hover:text-pink-400 transition-colors';
      li.textContent = friend.username;

      // make username clickable: view their profile on click
      li.addEventListener('click', () => {
        showProfileView(friend.username);
      });
      list.appendChild(li);
    }
  } catch (err) {
    console.error('Error loading friends:', err);
  }
}

//game stats send api request from backend

//game history send api from backend
