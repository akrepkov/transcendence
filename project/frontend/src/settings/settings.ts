/**
 * Sends a PATCH request to update the user's username.
 *
 * - Retrieves the new username from the input field with ID 'username-input'.
 * - Validates the input.
 * - Sends the new username in JSON format to the server.
 * - Displays success or failure messages to the user.
 */
export async function changeUsername() {
  const input = document.getElementById('username-input') as HTMLInputElement;
  const username = input?.value;

  if (!username) {
    alert('Username is required.');
    return;
  }

  try {
    const response = await fetch('/api/update_user_profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      alert('Username change failed.');
      return;
    }

    alert('Username updated successfully.');
  } catch (err) {
    alert((err as Error).message);
  }
}

/**
 * Sends a PATCH request to update the user's password.
 *
 * - Retrieves the new password from the input field with ID 'password-input'.
 * - Validates the input.
 * - Sends the new password in JSON format to the server.
 * - Displays success or failure messages to the user.
 */
export async function changePassword() {
  const passwordInput = document.getElementById('password-input') as HTMLInputElement;
  const password = passwordInput?.value;

  if (!password) {
    alert('Password is required.');
    return;
  }

  try {
    const response = await fetch('/api/update_user_profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      alert('Password change failed.');
      return;
    }

    alert('Password updated successfully.');
  } catch (err) {
    alert((err as Error).message);
  }
}

/**
 * Initializes avatar upload logic via form submission.
 *
 * - Attaches a submit handler to the form with ID 'avatar-form'.
 * - Validates that an image file is selected.
 * - Previews the selected image using FileReader.
 * - Uploads the image to the server using a FormData-based PATCH request.
 * - Displays success or failure messages to the user.
 */
export async function changeAvatar() {
  const avatarform = document.getElementById('avatar-form') as HTMLFormElement;
  const avatarinput = document.getElementById('avatar-input') as HTMLInputElement;
  const avatarpreview = document.getElementById('avatar-preview') as HTMLImageElement;

  avatarform.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const file = avatarinput.files?.[0];
    if (!file) {
      alert('Please select an image');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = () => {
      avatarpreview.src = reader.result as string;
      avatarpreview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);

    // Prepare form data
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('/api/update_user_profile', {
        method: 'PATCH',
        body: formData, // No JSON.stringify and no Content-Type
      });

      if (!response.ok) {
        alert('Avatar upload failed.');
        return;
      }

      alert('Avatar uploaded successfully.');
    } catch (err) {
      alert((err as Error).message);
    }
  });
}
