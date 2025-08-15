import { translations } from '../translations/languages.js';

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
  const duration = options?.duration ?? 4000;

  const prev = __messageTimers.get(el);
  if (prev) window.clearTimeout(prev);

  el.classList.remove('hidden', 'text-green-400', 'text-yellow-400');
  el.classList.add(isError ? 'text-yellow-400' : 'text-green-400');

  el.textContent = text;

  const t = window.setTimeout(() => {
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

/**
 * Prevents the browser from scrolling the page when the up or down arrow keys are pressed.
 *
 * @param {KeyboardEvent} event - The keyboard event to check.
 */
export function turnOffKeyboardScrolling(event: KeyboardEvent): void {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
  }
}

/**
 * Scrolls the page so that the specified canvas element is centered in the viewport.
 *
 * @param {string} canvasId - The ID of the canvas element to center on screen.
 */
export function centerOnCanvas(canvasId: string) {
  const rect = document.getElementById(canvasId)?.getBoundingClientRect();
  if (!rect) return;

  window.scrollTo({
    top: window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2,
    left: window.scrollX + rect.left - window.innerWidth / 2 + rect.width / 2,
    behavior: 'smooth',
  });
}

/**
 * Types text into a given element one character at a time, creating a "typewriter" effect.
 *
 * @param {HTMLElement} element - The element where the text will be typed.
 * @param {string} text - The text to display.
 * @param {number} [speed=40] - Delay (ms) between typing each character.
 */
function typeText(element: HTMLElement, text: string, speed = 40) {
  let i = 0;
  element.textContent = ''; // start with an empty string

  const interval = setInterval(() => {
    element.textContent += text[i++]; // add one character at a time
    if (i >= text.length) clearInterval(interval); // stop when done
  }, speed);
}

/**
 * Shows the game instructions for the given game ID with a typing animation.
 *
 * @param {string} gameId - The ID of the game ('pong', 'snake', 'practice', 'ai', 'tour').
 */
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

  const currentLang = (localStorage.getItem('lang') || 'en') as keyof typeof translations;
  const gameTranslations = translations[currentLang];

  if (gameId === 'pong') {
    instructionsPong.classList.remove('hidden');
    typeText(instructionsPong, gameTranslations.instructionsPong);
  } else if (gameId === 'ai') {
    instructionsAi.classList.remove('hidden');
    typeText(instructionsAi, gameTranslations.instructionsAi);
  } else if (gameId === 'practice') {
    instructionsPractice.classList.remove('hidden');
    typeText(instructionsPractice, gameTranslations.instructionsPractice);
  } else if (gameId === 'snake') {
    instructionsSnake.classList.remove('hidden');
    typeText(instructionsSnake, gameTranslations.instructionsSnake);
  } else if (gameId === 'tour') {
    instructionsTour.classList.remove('hidden');
    typeText(instructionsTour, gameTranslations.instructionsTour);
  }
}

/**
 * Displays a modal dialog with a message and an OK button.
 * Returns a Promise that resolves when the modal is closed.
 *
 * @param {string} message - The message text to display.
 * @param {object} [config] - Optional configuration.
 * @param {string} [config.okText='OK'] - Text for the OK button.
 * @returns {Promise<void>} Resolves when the user closes the modal.
 */
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

/**
 * Replaces a hidden <select> element with a custom-styled language dropdown.
 * The hidden select is still updated when the user chooses an option, so
 * existing event listeners for the select will continue to work.
 */
export function mountCustomLanguageDropdown() {
  const select = document.getElementById('language-switcher') as HTMLSelectElement | null;
  const mount = document.getElementById('language-dropdown-mount');
  if (!select || !mount) return;

  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'language-switcher-btn';

  const list = document.createElement('ul');
  list.className = 'language-switcher-list';
  list.style.display = 'none';

  // Initial label
  const current = select.selectedOptions[0] ?? select.options[0];
  btn.textContent = current?.textContent ?? 'Select';

  // Build items and click behavior
  Array.from(select.options).forEach((opt) => {
    const li = document.createElement('li');
    li.className = 'language-switcher-item';
    li.textContent = opt.textContent ?? opt.value;
    li.addEventListener('click', () => {
      select.value = opt.value; // update hidden select
      select.dispatchEvent(new Event('change', { bubbles: true })); // trigger existing logic
      btn.textContent = li.textContent; // update button label
      list.style.display = 'none'; // close
    });
    list.appendChild(li);
  });

  // Toggle open/close
  btn.addEventListener('click', () => {
    list.style.display = list.style.display === 'none' ? 'block' : 'none';
  });

  wrapper.appendChild(btn);
  wrapper.appendChild(list);
  mount.appendChild(wrapper);
}
