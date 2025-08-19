import { globalSession } from '../auth/auth.js';
import { translations } from '../translations/languages.js';

let settingsMessageTimer: number | undefined;

const backToProfile = document.getElementById('backToProfile') as HTMLButtonElement;

/**
 * Retrieves the current language preference from localStorage.
 *
 * @returns {'en' | 'pl' | 'ru' | 'ko'} The current language code, defaults to 'en' if not set.
 */
function getCurrentLang(): 'en' | 'pl' | 'ru' | 'ko' {
  return (localStorage.getItem('lang') as any) || 'en';
}

/**
 * Displays a localized settings message for username, password, or avatar changes.
 *
 * - Chooses the correct message element based on `messageType`.
 * - Sets the text color based on `isError`.
 * - Looks up the translation for the given key based on the current language.
 * - Clears the message after 4 seconds.
 *
 * @param {keyof (typeof translations)['en']} key - The translation key to display.
 * @param {boolean} [isError=false] - Whether the message indicates an error.
 * @param {'username' | 'password' | 'avatar'} [messageType='username'] - The type of message to show.
 */
function showSettingsMessageKey(
  key: keyof (typeof translations)['en'],
  isError = false,
  messageType: 'username' | 'password' | 'avatar' = 'username',
) {
  const usernameMessage = document.getElementById('UsernameSettingsMessage');
  const passwordMessage = document.getElementById('PasswordSettingsMessage');
  const avatarMessage = document.getElementById('AvatarSettingsMessage');
  if (!usernameMessage || !passwordMessage || !avatarMessage) return;

  if (settingsMessageTimer) {
    clearTimeout(settingsMessageTimer);
    settingsMessageTimer = undefined;
  }

  const el =
    messageType === 'username'
      ? usernameMessage
      : messageType === 'password'
        ? passwordMessage
        : avatarMessage;

  if (!el) return;

  el.classList.remove('text-green-400', 'text-yellow-400', 'hidden');
  el.classList.add(isError ? 'text-yellow-400' : 'text-green-400');

  el.setAttribute('data-i18n-msg-key', String(key));

  const lang = getCurrentLang();
  el.textContent = translations[lang][key] ?? translations['en'][key] ?? '';

  settingsMessageTimer = window.setTimeout(() => {
    el.textContent = '';
    el.removeAttribute('data-i18n-msg-key');
  }, 4000);
}

/**
 * Re-applies translated messages to settings message elements after a language change.
 *
 * - Checks for stored `data-i18n-msg-key` attributes on message elements.
 * - Updates the text content to the translation in the current language.
 */
export function reapplySettingsMessages() {
  const lang = getCurrentLang();
  ['UsernameSettingsMessage', 'PasswordSettingsMessage', 'AvatarSettingsMessage'].forEach((id) => {
    const el = document.getElementById(id);
    const key = el?.getAttribute('data-i18n-msg-key') as keyof (typeof translations)['en'] | null;
    if (el && key) el.textContent = translations[lang][key];
  });
}

/**
 * Initializes event listeners for settings actions.
 *
 * - Binds click events for username and password save buttons.
 * - Initializes avatar upload drag-and-drop functionality.
 */
export function initSettingsEvents() {
  const usernameButton = document.getElementById('saveUsername');
  const passwordButton = document.getElementById('savePassword');

  if (usernameButton) {
    usernameButton.addEventListener('click', (e) => {
      e.preventDefault();
      changeUsername();
    });
  }

  if (passwordButton) {
    passwordButton.addEventListener('click', (e) => {
      e.preventDefault();
      changePassword();
    });
  }

  initAvatarUpload();
}

/**
 * Sends a PATCH request to update the user's username.
 *
 * - Retrieves the new username from the input field with ID 'newUsername'.
 * - Validates the input.
 * - Sends the new username in JSON format to the server.
 * - Displays success or failure messages to the user.
 */
export async function changeUsername() {
  const input = document.getElementById('newUsername') as HTMLInputElement;
  const username = input?.value;

  if (!username) {
    showSettingsMessageKey('usernameRequired', true, 'username');
    return;
  }

  try {
    const response = await fetch('/api/update_user_profile', {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username }),
    });

    if (response.status === 418) {
      showSettingsMessageKey('usernameTaken', true, 'username');
      return;
    }
    if (response.status === 411) {
      showSettingsMessageKey('usernameTenChars', true, 'username');
      return;
    }
    if (!response.ok) {
      showSettingsMessageKey('usernameChangeFailed', true, 'username');
      return;
    }

    const data = await response.json();
    showSettingsMessageKey('usernameUpdated', false, 'username');
    globalSession.setUsername(data?.username ?? username);
  } catch (err) {
    alert((err as Error).message);
  }
}

/**
 * Sends a PATCH request to update the user's password.
 *
 * - Retrieves the new password from the input field with ID 'newPassword'.
 * - Validates the input.
 * - Sends the new password in JSON format to the server.
 * - Displays success or failure messages to the user.
 */
export async function changePassword() {
  const passwordInput = document.getElementById('newPassword') as HTMLInputElement;
  const password = passwordInput?.value;

  if (!password) {
    showSettingsMessageKey('passwordRequired', true, 'password');
    return;
  }

  try {
    const response = await fetch('/api/update_user_profile', {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password }),
    });

    if (!response.ok) {
      showSettingsMessageKey('passwordChangeFailed', true, 'password');
      return;
    }

    showSettingsMessageKey('passwordUpdated', false, 'password');
  } catch (err) {
    alert((err as Error).message);
  }
}

/**
 * Initializes avatar upload functionality with drag-and-drop and file input.
 *
 * - Supports image file selection via click, drag-and-drop, or file input.
 * - Previews the selected image.
 * - Sends a PATCH request with the avatar file to the server.
 * - Updates the displayed avatar on success.
 */
export function initAvatarUpload() {
  const dropZone = document.getElementById('avatar-drop-zone') as HTMLElement | null;
  const input = document.getElementById('avatar-input') as HTMLInputElement | null;
  const preview = document.getElementById('avatar-preview') as HTMLImageElement | null;
  const saveButton = document.getElementById('saveAvatar') as HTMLButtonElement | null;

  if (!dropZone || !input || !preview || !saveButton) return;

  let selectedFile: File | null = null;

  dropZone.addEventListener('click', () => input.click());

  input.addEventListener('change', () => {
    if (input.files && input.files[0]) previewFile(input.files[0]);
  });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('bg-black/70');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('bg-black/70');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('bg-black/70');
    const file = e.dataTransfer?.files?.[0];
    if (file) previewFile(file);
  });

  /**
   * Previews the selected image file in the avatar preview element.
   *
   * @param {File} file - The image file to preview.
   */
  function previewFile(file: File) {
    if (!file.type.startsWith('image/')) {
      showSettingsMessageKey('onlyImages', true, 'avatar');
      return;
    }

    selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      if (!preview) return; // guard to satisfy TS18047
      preview.src = reader.result as string;
      preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }

  saveButton.addEventListener('click', async () => {
    if (!selectedFile) {
      showSettingsMessageKey('noImageSelected', true, 'avatar');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const response = await fetch('/api/update_user_avatar', {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      });

      if (response.status === 418) {
        showSettingsMessageKey('imageTooBig', true, 'avatar');
        return;
      }
      if (!response.ok) {
        showSettingsMessageKey('avatarUploadFailed', true, 'avatar');
        return;
      }

      const result = await response.json();
      showSettingsMessageKey('avatarUpdated', false, 'avatar');

      globalSession.setAvatar(result.avatarUrl);
      document.getElementById('avatar')?.setAttribute('src', result.avatarUrl);
      document.getElementById('avatar-profile')?.setAttribute('src', result.avatarUrl);
    } catch (err) {
      alert((err as Error).message);
    }
  });
}

// User navigated with browser back/forward
window.addEventListener('popstate', () => {
  const username = document.getElementById('newUsername') as HTMLInputElement;
  username.value = '';
  const password = document.getElementById('newPassword') as HTMLInputElement;
  password.value = '';
  const avatar = document.getElementById('avatar-input') as HTMLInputElement;
  avatar.value = '';
});

// User is leaving or refreshing the page
window.addEventListener('beforeunload', () => {
  const username = document.getElementById('newUsername') as HTMLInputElement;
  username.value = '';
  const password = document.getElementById('newPassword') as HTMLInputElement;
  password.value = '';
  const avatar = document.getElementById('avatar-input') as HTMLInputElement;
  avatar.value = '';
});

backToProfile.addEventListener('click', () => {
  const username = document.getElementById('newUsername') as HTMLInputElement;
  username.value = '';
  const password = document.getElementById('newPassword') as HTMLInputElement;
  password.value = '';
  const avatar = document.getElementById('avatar-input') as HTMLInputElement;
  avatar.value = '';
});
