/**
 * WeakMap frees entry if element is removed from DOM
 */
const __messageTimers = new WeakMap<HTMLElement, number>();

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
export function showMessage(
  el: HTMLElement,
  text: string,
  options?: { isError?: boolean; duration?: number },
): void {
  if (!el) return;

  const isError = options?.isError ?? false;
  const duration = options?.duration ?? 1000;

  // clear prior timer for this element
  const prev = __messageTimers.get(el);
  if (prev) window.clearTimeout(prev);

  // apply styles similar to settings.ts (green for success, yellow for error)
  el.classList.remove('hidden', 'text-green-400', 'text-yellow-400');
  el.classList.add(isError ? 'text-yellow-400' : 'text-green-400');

  el.textContent = text;

  const t = window.setTimeout(() => {
    // you can either clear or just hide; settings clears text, so mirror that
    el.textContent = '';
    el.classList.add('hidden');
  }, duration);

  __messageTimers.set(el, t);
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
  const instructionsTour = document.getElementById('instructionsTour') as HTMLParagraphElement;

  if (
    !instructionsPong ||
    !instructionsSnake ||
    !instructionsPractice ||
    !instructionsAi ||
    !instructionsTour
  )
    return;

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
  } else if (gameId === 'tour') {
    instructionsTour.classList.remove('hidden');
    typeText(
      instructionsTour,
      'Up: ↑ / W\n' +
        'Down: ↓ / S\n Rules: Keep the ball in play. First to 5 points wins. Amount of players needs to be 2^n. The player pairs will be assigned randomly, the winner from each pair will move on to the next round. After the final round, the Winner is declared.',
    );
  }
}

export function showModal(message: string, { okText = 'OK' } = {}) {
  return new Promise<void>((resolve) => {
    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.className = 'fixed inset-0 flex items-center justify-center z-50';

    backdrop.innerHTML = `
      <div class="absolute inset-0 bg-black/70"></div>
      <div class="relative bg-black/80 text-white max-w-md w-[90%] p-6 rounded-lg pixelated-border text-center">
        <p class="whitespace-pre-line text-xl mb-6">${message}</p>
        <button id="__modal_ok__"
          class="pixelated-button w-full hover:text-black text-xl">${okText}</button>
      </div>
    `;

    document.body.appendChild(backdrop);

    const okBtn = backdrop.querySelector('#__modal_ok__') as HTMLButtonElement | null;
    const onClose = () => {
      backdrop.remove();
      document.body.style.overflow = '';
      resolve();
    };

    okBtn?.addEventListener('click', onClose);
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Enter' || e.key === 'Escape') {
        document.removeEventListener('keydown', onKey);
        onClose();
      }
    });

    document.body.style.overflow = 'hidden';

    // Focus the button if it exists
    setTimeout(() => okBtn?.focus(), 0);
  });
}
