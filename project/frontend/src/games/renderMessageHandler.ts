let renderMessageTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * Displays a custom message in the render page and hides it after a timeout.
 *
 * @param message The message to display.
 */
export function showRenderMessage(message: string, id: string) {
  const messageElementPong = document.getElementById('renderMessagePong');
  const messageElementSnake = document.getElementById('renderMessageSnake');

  if (!messageElementPong || !messageElementSnake) {
    return;
  }

  if (messageElementPong || messageElementSnake) {
    // Clear any existing timer
    if (renderMessageTimer) {
      clearTimeout(renderMessageTimer);
    }

    const gameType = id;

    if (id === 'pong') {
      messageElementPong.textContent = message;
      messageElementPong.classList.remove('hidden');

      renderMessageTimer = setTimeout(() => {
        messageElementPong.classList.add('hidden');
      }, 5000);
    } else {
      // Set the message and make it visible
      messageElementSnake.textContent = message;
      messageElementSnake.classList.remove('hidden'); // Show the message

      // Hide the message after 5 seconds
      renderMessageTimer = setTimeout(() => {
        messageElementSnake.classList.add('hidden');
      }, 5000);
    }
  }
}
