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

  // preview image
  const reader = new FileReader();
  reader.onload = () => {
    avatarpreview.src = reader.result as string;
    avatarpreview.classList.remove('hidden'); // needs to be hidden?
  };
  reader.readAsDataURL(file);

  // upload to server (replace URL as needed)
  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const response = await fetch('api/upload-avatar', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed.');
    }

    alert('Avatar uploaded successfully.');
  } catch (err) {
    alert((err as Error).message);
  }
});
