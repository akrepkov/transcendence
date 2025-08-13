import { globalSession } from '../auth/auth.js';

let settingsMessageTimer: number | undefined;

function showSettingsMessage(
  text: string,
  isError = false,
  messageType: 'username' | 'password' | 'avatar' = 'username',
) {
  const usernameMessage = document.getElementById('UsernameSettingsMessage');
  const passwordMessage = document.getElementById('PasswordSettingsMessage');
  const avatarMessage = document.getElementById('AvatarSettingsMessage');
  if (!usernameMessage || !passwordMessage || !avatarMessage) return;

  // reset timeout
  if (settingsMessageTimer) {
    clearTimeout(settingsMessageTimer);
    settingsMessageTimer = undefined;
  }

  const element =
    messageType === 'username'
      ? usernameMessage
      : messageType === 'password'
        ? passwordMessage
        : messageType === 'avatar'
          ? avatarMessage
          : null;

  if (!element) return;

  // reset colors
  element.classList.remove('text-green-400', 'text-yellow-400', 'hidden');
  element.classList.add(isError ? 'text-yellow-400' : 'text-green-400');
  element.textContent = text;

  // empty after 4 seconds
  settingsMessageTimer = window.setTimeout(() => {
    element.textContent = '';
  }, 4000);
}

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
    showSettingsMessage('Username is required.', true, 'username');
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
      showSettingsMessage('Username is already in use, try another one.', true, 'username');
      return;
    }
    if (!response.ok) {
      showSettingsMessage('Username change failed', true, 'username');
      return;
    }

    const data = await response.json();
    showSettingsMessage('Username updated successfully.', false, 'username');
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
    showSettingsMessage('Password is required.', true, 'password');
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
      showSettingsMessage('Password change failed.', true, 'password');
      return;
    }

    showSettingsMessage('Password updated successfully.', false, 'password');
  } catch (err) {
    alert((err as Error).message);
  }
}

export function initAvatarUpload() {
  const dropZone = document.getElementById('avatar-drop-zone') as HTMLElement;
  const input = document.getElementById('avatar-input') as HTMLInputElement;
  const preview = document.getElementById('avatar-preview') as HTMLImageElement;
  const saveButton = document.getElementById('saveAvatar') as HTMLButtonElement;

  let selectedFile: File | null = null;

  // Click to browse
  dropZone.addEventListener('click', () => input.click());

  // File selected manually
  input.addEventListener('change', () => {
    if (input.files && input.files[0]) {
      previewFile(input.files[0]);
    }
  });

  // Drag events
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

  function previewFile(file: File) {
    if (!file.type.startsWith('image/')) {
      showSettingsMessage('Only image files are allowed.', true, 'avatar');
      return;
    }

    selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result as string;
      preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }

  saveButton.addEventListener('click', async () => {
    if (!selectedFile) {
      showSettingsMessage('No image selected.', true, 'avatar');
      return;
    }

    const formData = new FormData();
    console.log(formData);
    formData.append('avatar', selectedFile);
    console.log(formData);

    try {
      const response = await fetch('/api/update_user_avatar', {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      });

      if (response.status == 418) {
        showSettingsMessage('Image is too big, try uploading something up to 1MB.', true, 'avatar');
        return;
      } else if (!response.ok) {
        showSettingsMessage('Avatar upload failed.', true, 'avatar');
      }

      if (!response.ok) {
        showSettingsMessage('Avatar upload failed.', true, 'avatar');
        return;
      }

      const result = await response.json();
      showSettingsMessage('Avatar updated successfully.', false, 'avatar');

      // Update avatars across app
      globalSession.setAvatar(result.avatarUrl);
      document.getElementById('avatar')?.setAttribute('src', result.avatarUrl);
      document.getElementById('avatar-profile')?.setAttribute('src', result.avatarUrl);
    } catch (err) {
      alert((err as Error).message);
    }
  });
}
