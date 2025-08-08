import { navigateTo, showProfileView, showSettingsView } from '../navigation/navigation.js';
import { globalSession } from '../auth/auth.js';

/**
 * Checks if a specific friend is currently online by comparing against the live list from the WebSocket.
 *
 * @param {string} friendUsername - The username of the friend to check.
 * @returns {Promise<boolean>} Resolves to true if the friend is online, false otherwise.
 */
async function isFriendOnline(friendUsername: string): Promise<boolean> {
  try {
    const onlineFriends = await globalSession.getOnlineFriends();
    return Array.isArray(onlineFriends) && onlineFriends.includes(friendUsername);
  } catch (err) {
    console.error('Failed to fetch online friends:', err);
    return false;
  }
}

/**
 * Initializes all event listeners related to the user profile section.
 *
 * - Avatar click navigates to profile view.
 * - Settings button opens the settings view.
 * - Back buttons return to profile view or current user profile.
 * - Add friend button sends a friend request.
 */
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

/**
 * Displays a temporary success or error message related to friend actions.
 *
 * - Accepts text and optional error flag to style the message.
 * - Message disappears after 4 seconds.
 *
 * @param {string} text - The message text to display.
 * @param {boolean} [isError=false] - Whether the message is an error (affects color).
 */
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

/**
 * Fetches user profile data from the backend.
 *
 * - Makes a GET request to `/api/view_user_profile`.
 *
 * @param {string} username - The username of the profile to fetch.
 * @returns {Promise<any>} The parsed JSON response containing profile data.
 * @throws {Error} If the request fails or returns a non-OK status.
 */
export async function fetchUserProfile(username: string) {
  const res = await fetch(`/api/view_user_profile?username=${encodeURIComponent(username)}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user profile');
  }
  return res.json();
}

/**
 * Sends a request to add a new friend.
 *
 * - Reads the username from the add friend input field.
 * - Sends a POST request to `/api/add_friend` with the current user and the friend’s username.
 * - If successful, refreshes the friends list and clears the input.
 * - Displays success or error messages accordingly.
 */
export async function addFriend() {
  const input = document.getElementById('addFriendInput') as HTMLInputElement | null;

  if (!input) {
    console.error('addFriendInput not found in DOM — make sure Profile view is visible');
    return;
  }

  const friendUsername = input.value.trim();
  if (!friendUsername) return;

  const username = globalSession.getUsername();

  try {
    const res = await fetch('/api/add_friend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, friendUsername }),
    });

    if (res.ok) {
      await showFriends(username);
      input.value = ''; // clear input after adding
      showFriendMessage('Friend added successfully');
    } else {
      // const { message } = await res.json().catch(() => ({}));
      showFriendMessage('Could not add friend');
    }
  } catch (err) {
    console.error('Request failed:', err);
    showFriendMessage('Server error. Please try again later.', true);
  }
}

/**
 * Fetches and displays the friends list for the specified user.
 *
 * - Retrieves the user's friends from the backend.
 * - For each friend, checks their online status and displays an indicator:
 *   🟢 = online, 🔴 = offline, ⚪ = status unknown.
 * - Each friend's name is rendered as a clickable list item that navigates to their profile.
 * - Handles the empty list case with a fallback message.
 * - Catches and logs errors gracefully if fetching data fails.
 *
 * @param {string} username - The username whose friends list should be displayed.
 */
export async function showFriends(username: string) {
  const list = document.getElementById('friendsList')?.querySelector('ul');
  if (!list) return;

  try {
    const data = await fetchUserProfile(username);
    const friends = data.friends ?? [];

    list.innerHTML = '';

    if (friends.length === 0) {
      list.innerHTML = '<li class="text-black text-lg">No friends yet</li>';
      return;
    }

    for (const friend of friends) {
      const li = document.createElement('li');
      li.className =
        'border-b border-black pb-1 cursor-pointer hover:text-pink-400 transition-colors flex items-center gap-2';

      // Check if friend is online
      let onlineIndicator = '';
      try {
        const isOnline = await isFriendOnline(friend.username);
        onlineIndicator = isOnline ? '🟢' : '🔴';
      } catch (err) {
        console.warn(`Failed to check online status for ${friend.username}:`, err);
        onlineIndicator = '⚪';
      }

      li.innerHTML = `<span>${onlineIndicator}</span><span>${friend.username}</span>`;

      // Navigate to friend's profile
      li.addEventListener('click', () => {
        navigateTo(
          'profile',
          `/profile?username=${encodeURIComponent(friend.username)}`,
          () => showProfileView(friend.username),
          { username: friend.username },
        );
      });

      list.appendChild(li);
    }
  } catch (err) {
    console.error('Error loading friends:', err);
  }
}

/**
 * Fetches and displays the game statistics for a given user.
 *
 * - Retrieves the user's profile data from the backend.
 * - Extracts Pong and Snake win/loss counts.
 * - Calculates the total number of games played.
 * - Updates the corresponding DOM elements in the profile page.
 *
 * @param {string} username - The username whose game stats should be displayed.
 */
export async function showGameStats(username: string) {
  try {
    const data = await fetchUserProfile(username);

    //game history send api from backend
    const pongWins = data.pongWins ?? 0;
    const pongLosses = data.pongLosses ?? 0;
    const snakeWins = data.snakeWins ?? 0;
    const snakeLosses = data.snakeLosses ?? 0;
    const totalGames = pongWins + pongLosses + snakeWins + snakeLosses;

    // Update DOM
    const setText = (id: string, value: number) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value.toString();
    };

    setText('pongWins', pongWins);
    setText('pongLosses', pongLosses);
    setText('snakeWins', snakeWins);
    setText('snakeLosses', snakeLosses);
    setText('totalGames', totalGames);
  } catch (err) {
    console.error('Error loading game stats:', err);
  }
}

export async function showGameHistory(username: string) {
  const list = document.getElementById('historyList')?.querySelector('ul');
  if (!list) return;

  try {
    const data = await fetchUserProfile(username);

    console.log("DATA FROM USER RE PONG:", data.pong);
    const gameHistory = data.gameHistory ?? [];

    list.innerHTML = '';

    if (gameHistory.length === 0) {
      list.innerHTML = '<li class="text-black text-lg">No game history yet</li>';
      return;
    }

    for (const game of gameHistory) {
      const li = document.createElement('li');
      li.className =
        'border-b border-black pb-1 flex items-center gap-2';


    }
  }
}
