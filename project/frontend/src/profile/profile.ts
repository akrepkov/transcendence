import { navigateTo, showProfileView, showSettingsView } from '../navigation/navigation.js';
import { globalSession } from '../auth/auth.js';

let friendsRenderToken = 0;
let currentFriends = new Set<string>();
let profileEventsInitialized = false;

/**
 * Initializes all event listeners related to the user profile section.
 *
 * - Avatar click navigates to profile view.
 * - Settings button opens the settings view.
 * - Back buttons return to profile view or current user profile.
 * - Add friend button sends a friend request.
 */
export function initProfileEvents() {
  if (profileEventsInitialized) return;
  profileEventsInitialized = true;

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
  if (friendUsername === username) {
    showFriendMessage('You cannot add yourself as a friend');
    return;
  }

  if (currentFriends.has(friendUsername)) {
    showFriendMessage(`${friendUsername} is already your friend`, true);
    return;
  }

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
      showFriendMessage('Profile does not exist');
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
 * - Each friend's name is rendered as a clickable list item that navigates to their profile.
 * - Handles the empty list case with a fallback message.
 * - Catches and logs errors gracefully if fetching data fails.
 *
 * @param {string} username - The username whose friends list should be displayed.
 */
export async function showFriends(username: string) {
  const list = document.getElementById('friendsList')?.querySelector('ul');
  if (!list) return;

  const token = ++friendsRenderToken;

  try {
    // Fetch profile + online list in parallel
    const [data, onlineFriends] = await Promise.all([
      fetchUserProfile(username),
      globalSession.getOnlineFriends(),
    ]);

    if (token !== friendsRenderToken) return;

    const friends = data.friends ?? [];
    currentFriends = new Set(friends.map((f: { username: string }) => f.username));
    const onlineSet = new Set<string>(Array.isArray(onlineFriends) ? onlineFriends : []);

    if (friends.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'text-black text-lg';
      empty.textContent = 'No friends yet';
      list.replaceChildren(empty);
      return;
    }

    const frag = document.createDocumentFragment();

    for (const friend of friends) {
      const li = document.createElement('li');
      li.className =
        'border-b border-black pb-1 cursor-pointer hover:text-pink-400 transition-colors flex items-center gap-2';

      const isOnline = onlineSet.has(friend.username);
      const indicator = isOnline
        ? '<img src="/assets/online_status.png" alt="Online" class="w-4 h-4" />'
        : '<img src="/assets/offline_status.png" alt="Offline" class="w-4 h-4" />';

      li.innerHTML = `<span>${indicator}</span><span>${friend.username}</span>`;

      li.addEventListener('click', () => {
        navigateTo(
          'profile',
          `/profile?username=${encodeURIComponent(friend.username)}`,
          () => showProfileView(friend.username),
          { username: friend.username },
        );
      });

      frag.appendChild(li);
    }

    if (token !== friendsRenderToken) return;
    list.replaceChildren(frag);
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

interface Match {
  gameId: number;
  player1Id: number;
  player2Id: number;
  winnerId: number;
  player1Score: number;
  player2Score: number;
  createdAt: string; // ISO
  // Optional if backend ever supplies them:
  player1Name?: string;
  player2Name?: string;
}

type WithType = Match & { gameType: 'Pong' | 'Snake' };

/**
 * Fetches and displays the game history for a given user.
 *
 * - Retrieves the user's Pong and Snake match data from the backend via `fetchUserProfile`.
 * - Merges both game types into a single list with an added `gameType` property.
 * - Sorts the matches by date in descending order (newest first).
 * - Renders each match as a list item with:
 *    - Game type icon and label.
 *    - Match date/time.
 *    - Player names and scores.
 *    - Winner’s name.
 * - Highlights the current user’s name in the match details.
 * - Handles the case where the user has no game history with a fallback message.
 * - Replaces any existing list content with the newly generated match history.
 *
 * @param {string} username - The username whose game history should be displayed.
 * @returns {Promise<void>} Resolves when the game history has been rendered to the DOM.
 */
export async function showGameHistory(username: string) {
  const list = document.getElementById('historyList')?.querySelector('ul');
  if (!list) return;

  try {
    const data = await fetchUserProfile(username);

    const gameHistory: WithType[] = [
      ...(data.pong ?? []).map((g: Match) => ({ ...g, gameType: 'Pong' })),
      ...(data.snake ?? []).map((g: Match) => ({ ...g, gameType: 'Snake' })),
    ];

    gameHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    list.innerHTML = '';

    if (gameHistory.length === 0) {
      list.innerHTML = '<li class="text-black text-lg">No game history yet</li>';
      return;
    }

    const youId = data.userId as number;
    const youName = data.username as string;
    const nameFor = (id: number, fallbackName?: string) =>
      id === youId ? youName : fallbackName || `User#${id}`;

    for (const game of gameHistory) {
      const li = document.createElement('li');
      li.className = 'border-b border-black pb-1 flex flex-col gap-1';

      // header: icon + title + date
      const header = document.createElement('div');
      header.className = 'flex items-center justify-between';

      const left = document.createElement('div');
      left.className = 'flex items-center gap-2';

      const iconImg = document.createElement('img');
      iconImg.src = game.gameType === 'Pong' ? '/assets/pong_icon.png' : '/assets/snake_icon.png';
      iconImg.alt = `${game.gameType} icon`;
      iconImg.className = 'w-5 h-5';
      (iconImg.style as any).imageRendering = 'pixelated';

      const title = document.createElement('span');
      title.className = 'font-bold';
      title.textContent = game.gameType;

      left.appendChild(iconImg);
      left.appendChild(title);

      const when = document.createElement('span');
      when.className = 'text-sm text-black';
      when.textContent = new Date(game.createdAt).toLocaleString();

      header.appendChild(left);
      header.appendChild(when);

      // details: names + scores + winner
      const p1Name = nameFor(game.player1Id, game.player1Name);
      const p2Name = nameFor(game.player2Id, game.player2Name);
      const winnerName =
        game.winnerId === game.player1Id
          ? p1Name
          : game.winnerId === game.player2Id
            ? p2Name
            : `User#${game.winnerId}`;

      const details = document.createElement('div');
      details.textContent = `${p1Name}: ${game.player1Score} vs ${p2Name}: ${game.player2Score} — Winner: ${winnerName}`;

      li.appendChild(header);
      li.appendChild(details);
      list.appendChild(li);
    }
  } catch (err) {
    console.error('Error loading game history:', err);
  }
}
