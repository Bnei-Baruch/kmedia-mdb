import { DEFAULT_CONTENT_LANGUAGE, LANG_ENGLISH, LANGUAGE_OPTIONS } from './consts';

/**
 * Select language to use
 * @param contentLanguage -- preferable language for content
 * @param languages -- languages we've got to choose from
 * @returns the most appropriate language
 */
export const selectSuitableLanguage = (contentLanguages, languages = [], originalLanguage = '') => {
  if (languages.length === 0) {
    // Content not available for any language.
    return DEFAULT_CONTENT_LANGUAGE;
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

  // No matching language try default.
  if (languages.includes(DEFAULT_CONTENT_LANGUAGE)) {
    return DEFAULT_CONTENT_LANGUAGE;
  }

  // Or first available language.
  return languages[0];
};

export const getLanguageName = (language) => {
  const option = LANGUAGE_OPTIONS.find(x => x.value === language);
  return option && option.name || ''
};

export const getOptions = ({ languages }) =>
  LANGUAGE_OPTIONS
    .filter(x => languages.includes(x.value))
    .map(x => ({ ...x, text: x.name }));

