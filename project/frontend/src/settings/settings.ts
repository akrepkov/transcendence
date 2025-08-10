import { globalSession } from '../auth/auth.js';

export function initSettingsEvents() {
  const usernameButton = document.getElementById('saveUsername');
  const passwordButton = document.getElementById('savePassword');
  const avatarButton = document.getElementById('saveAvatar');

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
    alert('Username is required.'); // TODO make into message
    return;
  }

  try {
    const response = await fetch('/api/update_user_profile', {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username }),
    });

    if (!response.ok) {
      alert('Username change failed.'); // TODO make into message
      return;
    }

    const data = await response.json();
    alert('Username updated successfully.'); // TODO make into message
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
    alert('Password is required.'); // TODO make into message
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
      alert('Password change failed.'); // TODO make into message
      return;
    }

    alert('Password updated successfully.'); // TODO make into message
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
      alert('Only image files are allowed.');
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
      alert('No image selected.');
      return;
    }

    const formData = new FormData();
    console.log(formData);
    formData.append('avatar', selectedFile);
    console.log(formData);

    try {
      const response = await fetch('/api/update_user_profile', {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      });

      if (response.status == 418) {
        alert('Image is too big, try uploading something up to 1MB.');
        return;
      } else if (!response.ok) {
        alert('Avatar upload failed.');
        return;
      }

      const result = await response.json();
      alert('Avatar updated successfully.');

      // Update avatars across app
      globalSession.setAvatar(result.avatarUrl);
      document.getElementById('avatar')?.setAttribute('src', result.avatarUrl);
      document.getElementById('avatar-profile')?.setAttribute('src', result.avatarUrl);
    } catch (err) {
      alert((err as Error).message);
    }
  });
}
