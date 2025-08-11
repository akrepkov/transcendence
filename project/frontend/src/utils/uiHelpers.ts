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
