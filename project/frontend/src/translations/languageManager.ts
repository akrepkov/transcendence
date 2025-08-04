import { translations } from './languages.js';

// export function languageSwitcherFunction() {
//   const savedLang = localStorage.getItem('lang') as 'en' | 'pl' | 'ru' | null;
//   const defaultLang = savedLang || 'en';

//   const languageSwitcher = document.getElementById('language-switcher') as HTMLSelectElement;
//   languageSwitcher.value = defaultLang;
//   applyTranslations(defaultLang);
// }
// const languageSwitcher = document.getElementById('language-switcher') as HTMLSelectElement;
// languageSwitcher.addEventListener('change', (event) => {
//   const selectedLanguage = (event.target as HTMLSelectElement).value as 'en' | 'pl' | 'ru';
//   localStorage.setItem('lang', selectedLanguage);
//   console.log('Selected language:', selectedLanguage);
//   applyTranslations(selectedLanguage);
// });

export function applyTranslations(lang: 'en' | 'pl' | 'ru') {
  const t = translations[lang];
  const titleEl = document.getElementById('title');
  const formTitleEl = document.getElementById('formTitle');
  const toggleFormEl = document.getElementById('toggleForm');
  const loginUsernameEl = document.getElementById('loginUsername') as HTMLInputElement;
  const loginPasswordEl = document.getElementById('loginPassword') as HTMLInputElement;

  if (titleEl) titleEl.textContent = t.title;
  if (formTitleEl) formTitleEl.textContent = t.formTitle;
  if (toggleFormEl) toggleFormEl.textContent = t.toggleForm;
  if (loginUsernameEl) loginUsernameEl.placeholder = t.loginUsername;
  if (loginPasswordEl) loginPasswordEl.placeholder = t.loginPassword;
}
