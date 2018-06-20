import { LANG_ENGLISH } from './consts';

/**
 * Select language to use
 * @param contentLanguage -- preferable language for content
 * @param uiLanguage -- language of UI
 * @param languages -- languages we've got to choose from
 * @returns the most appropriate language
 */
export const selectSuitableLanguage = (contentLanguage, uiLanguage, languages = []) => {
  if (languages.indexOf(contentLanguage) !== -1) {
    // Use content language [preferred one]
    return contentLanguage;
  } else if (languages.indexOf(uiLanguage) !== -1) {
    // Or UI language
    return uiLanguage;
  } else if (languages.indexOf(LANG_ENGLISH) !== -1) {
    // Or English
    return LANG_ENGLISH;
  } else if (languages.length > 0) {
    // Or first available language
    // eslint-disable-next-line prefer-destructuring
    return languages[0];
  }

  // we don't have data for new UI language. Let's stay as we are.
  return false;
};

