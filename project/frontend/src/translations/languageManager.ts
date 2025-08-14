import { translations } from './languages.js';

export function languageSwitcherFunction() {
  const savedLang = localStorage.getItem('lang') as 'en' | 'pl' | 'ru' | 'ko' | null;
  const defaultLang = savedLang || 'en';

  const languageSwitcher = document.getElementById('language-switcher') as HTMLSelectElement;
  languageSwitcher.value = defaultLang;
  applyTranslations(translations[defaultLang]);
}

const languageSwitcher = document.getElementById('language-switcher') as HTMLSelectElement;
languageSwitcher.addEventListener('change', (event) => {
  const selectedLanguage = (event.target as HTMLSelectElement).value as 'en' | 'pl' | 'ru' | 'ko';
  localStorage.setItem('lang', selectedLanguage);
  console.log('Selected language:', selectedLanguage);
  applyTranslations(translations[selectedLanguage]);
});

export function applyTranslations(translations: Record<string, string>) {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key && translations[key]) el.textContent = translations[key];
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key && translations[key]) (el as HTMLInputElement).placeholder = translations[key];
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (key && translations[key]) el.title = translations[key];
  });
}
