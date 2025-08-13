/**
 * Hides all main application pages by adding the 'hidden' class to their elements.
 *
 * This function is typically used when navigating between different views
 * to ensure that only the target view is visible.
 */
export function hideAllPages(): void {
  const pageIds = [
    'authPage',
    'landingPage',
    'profilePage',
    'settingsPage',
    'pongPage',
    'snakePage',
    'practicePage',
    'creditPage',
    'aiPage',
    'tourPage',
  ];

  pageIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
}

/**
 * Sets the current application view by updating a `data-view` attribute on the body.
 *
 * @param {string} viewName - The name of the view to set (e.g., 'login', 'landing').
 */
export function setView(viewName: string) {
  document.body.setAttribute('data-view', viewName);
}

/**
 * Displays a message element with the provided text content.
 *
 * @param {HTMLElement} el - The HTML element where the message should be displayed.
 * @param {string} text - The text content to show in the message element.
 */
export function showMessage(el: HTMLElement, text: string): void {
  el.classList.remove('hidden');
  el.textContent = text;
}

/**
 * Toggles the visibility of a DOM element based on the `show` flag.
 *
 * @param {string} id - The ID of the DOM element to show or hide.
 * @param {boolean} show - If true, shows the element; if false, hides it.
 */
export function toggleElement(id: string, show: boolean) {
  const el = document.getElementById(id);
  if (!el) return;

  if (show) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

/**
 * Toggles visibility of profile-related buttons depending on whether
 * the user is viewing their own profile or someone else's.
 *
 * @param {boolean} isOwnProfile - True if viewing own profile, false for another user's profile.
 */
export function toggleOwnProfileButtons(isOwnProfile: boolean) {
  toggleElement('addFriendSection', isOwnProfile);
  toggleElement('addFriendButton', isOwnProfile);
  toggleElement('settingsToggle', isOwnProfile);
  toggleElement('backToOwnProfile', !isOwnProfile);
}

export function turnOffKeyboardScrolling(event: KeyboardEvent): void {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
  }
}

export function centerOnCanvas(canvasId: string) {
  const rect = document.getElementById(canvasId)?.getBoundingClientRect();
  if (!rect) return;

  window.scrollTo({
    top: window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2,
    left: window.scrollX + rect.left - window.innerWidth / 2 + rect.width / 2,
    behavior: 'smooth',
  });
}

function typeText(element: HTMLElement, text: string, speed = 40) {
  let i = 0;
  element.textContent = ''; // start with an empty string

  const interval = setInterval(() => {
    element.textContent += text[i++]; // add one character at a time
    if (i >= text.length) clearInterval(interval); // stop when done
  }, speed);
}

export function showInstructions(gameId: string) {
  const instructionsPong = document.getElementById('instructionsPong') as HTMLParagraphElement;
  const instructionsSnake = document.getElementById('instructionsSnake') as HTMLParagraphElement;
  const instructionsPractice = document.getElementById(
    'instructionsPractice',
  ) as HTMLParagraphElement;
  const instructionsAi = document.getElementById('instructionsAi') as HTMLParagraphElement;

  if (!instructionsPong || !instructionsSnake || !instructionsPractice || !instructionsAi) return;

  if (gameId === 'pong') {
    instructionsPong.classList.remove('hidden');
    typeText(
      instructionsPong,
      'Up: ↑ / W\n' + 'Down: ↓ / S\n Rules: Keep the ball in play. First to 5 points wins.',
    );
  } else if (gameId === 'ai') {
    instructionsAi.classList.remove('hidden');
    typeText(
      instructionsAi,
      'Up: W\n ' + 'Down: S\n Rules: Keep the ball in play. First to 5 points wins.',
    );
  } else if (gameId === 'practice') {
    instructionsPractice.classList.remove('hidden');
    typeText(
      instructionsPractice,
      'Up: ↑ / W\n' + 'Down: ↓ / S\n Rules: Keep the ball in play. First to 5 points wins.',
    );
  } else if (gameId === 'snake') {
    instructionsSnake.classList.remove('hidden');
    typeText(
      instructionsSnake,
      'Up: ↑ / W \n   ' +
        'Down: ↓ / S\n  ' +
        'Left: ← / A\n   ' +
        'Right: → / D\n   ' +
        'Reverse: R\n ' +
        'Rules: \n' +
        'Eat apples to grow longer.\n' +
        'Win by eating 10 apples the fastest, making your opponent crash into a wall, their own tail, or your snake.\n' +
        'If both players crash in the same frame the game restarts.',
    );
  }
}
