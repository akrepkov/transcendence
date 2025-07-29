document.addEventListener('DOMContentLoaded', () => {
  const welcomeEl = document.getElementById('welcomeUsername');
  const username = localStorage.getItem('username');

  if (welcomeEl && username) {
    welcomeEl.textContent = username;
  }
});
