import { DEFAULT_LANGUAGE, LANG_ENGLISH, LANGUAGE_OPTIONS } from './consts';

/**
 * Select language to use
 * @param contentLanguage -- preferable language for content
 * @param uiLanguage -- language of UI
 * @param languages -- languages we've got to choose from
 * @returns the most appropriate language
 */
export const selectSuitableLanguage = (contentLanguage, uiLanguage, languages = []) => {
  if (languages.length === 0) {
    // we don't have data for new UI language. Let's stay as we are.
    return DEFAULT_LANGUAGE;
  }

  if (languages.includes(contentLanguage)) {
    // Use content language [preferred one]
    return contentLanguage;
  }

  if (languages.includes(uiLanguage)) {
    // Or UI language
    return uiLanguage;
  }

  if (languages.includes(LANG_ENGLISH)) {
    // Or English
    return LANG_ENGLISH;
  }

  // Or first available language
  return languages[0];
};

export const getOptions = ({ languages, t }) =>
  LANGUAGE_OPTIONS
    .filter(x => languages.includes(x.value))
    .map(x => ({ ...x, text: t(`constants.languages.${x.value}`) }));

