import { DEFAULT_CONTENT_LANGUAGE, LANGUAGE_OPTIONS, POPULAR_LANGUAGES } from './consts';

/**
 * Selects language to use.
 * @param contentLanguage       -- Languages user knows
 * @param languages             -- languages available for content we've got to choose from
 * @param originalLanguage      -- prefered language
 * @param defaultReturnLanguage -- if not empty, will return this language by default
 * @returns the most appropriate language or empty string if nothing fits.
 */
export const selectSuitableLanguage = (contentLanguages, languages = [], originalLanguage = '', defaultReturnLanguage = DEFAULT_CONTENT_LANGUAGE, mustReturnSomething = false) => {
  if (languages.length === 0) {
    // Content not available for any language.
    return defaultReturnLanguage;
  }

  // Prefer original languages that user knows.
  if (originalLanguage && contentLanguages.includes(originalLanguage) && languages.includes(originalLanguage)) {
    return originalLanguage;
  }

  // Choose existing language
  const contentLanguage = contentLanguages.find(language => languages.includes(language));
  if (contentLanguage) {
    return contentLanguage;
  }

  // Nothing fits.
  if (!mustReturnSomething) {
    return defaultReturnLanguage;
  }

  // Must return something, prefer major languages otherwise the first one.
  const something = POPULAR_LANGUAGES.concat(languages[0]);
  return something.find(language => languages.includes(language));
};

export const getLanguageName = language => {
  const option = LANGUAGE_OPTIONS.find(x => x.value === language);
  return (option && option.name) || '';
};

export const getOptions = ({ languages = [] }) =>
  LANGUAGE_OPTIONS
    .filter(x => languages.includes(x.value))
    .map(x => ({ ...x, text: x.name }));

export const updateHtmlLang = lang => {
  if (document) {
    document.documentElement.setAttribute('lang', lang);
  }
};

