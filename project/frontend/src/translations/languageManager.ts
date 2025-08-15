import { translations } from './languages.js';
import { reapplyDynamicText } from '../profile/profile.js';
import { reapplySettingsMessages } from '../settings/settings.js';

/**
 * Retrieves the current language preference from localStorage.
 *
 * @returns {'en' | 'pl' | 'ru' | 'ko'} The current language code, defaults to 'en' if not set.
 */
function getCurrentLang(): 'en' | 'pl' | 'ru' | 'ko' {
  return (localStorage.getItem('lang') as 'en' | 'pl' | 'ru' | 'ko') || 'en';
}

/**
 * Applies translations to elements in the DOM based on their data-i18n attributes.
 *
 * - Updates `textContent` for elements with `[data-i18n]`.
 * - Updates `placeholder` for elements with `[data-i18n-placeholder]`.
 * - Updates `title` for elements with `[data-i18n-title]`.
 *
 * @param {Record<string, string>} translations - An object mapping translation keys to translated strings.
 */
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

/**
 * Initializes the language switcher dropdown and applies translations.
 *
 * - Loads the current language from localStorage and applies translations.
 * - Binds a `change` event to the language switcher element to update:
 *   - Translations on the page
 *   - Dynamic text in the profile section
 *   - Settings messages in the settings page
 * - Persists the selected language in localStorage.
 */
export function languageSwitcherFunction() {
  const defaultLang = getCurrentLang();
  applyTranslations(translations[defaultLang]);
  reapplyDynamicText();

  const languageSwitcher = document.getElementById('language-switcher') as HTMLSelectElement;
  if (!languageSwitcher) return;

  languageSwitcher.value = defaultLang;

  languageSwitcher.addEventListener('change', (event) => {
    const selectedLanguage = (event.target as HTMLSelectElement).value as 'en' | 'pl' | 'ru' | 'ko';
    localStorage.setItem('lang', selectedLanguage);
    applyTranslations(translations[selectedLanguage]);
    reapplyDynamicText();
    reapplySettingsMessages();
  });
}
