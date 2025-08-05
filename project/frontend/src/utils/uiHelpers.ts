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
  ];

  pageIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
}

export function setView(viewName: string) {
  document.body.setAttribute('data-view', viewName);
}

export function showMessage(el: HTMLElement, text: string): void {
  el.classList.remove('hidden');
  el.textContent = text;
}

export function toggleElement(id: string, show: boolean) {
  const el = document.getElementById(id);
  if (!el) return;

  if (show) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

export function toggleOwnProfileButtons(isOwnProfile: boolean) {
  toggleElement('addFriendSection', isOwnProfile);
  toggleElement('addFriendButton', isOwnProfile);
  toggleElement('settingsToggle', isOwnProfile);
  toggleElement('backToOwnProfile', !isOwnProfile);
}
