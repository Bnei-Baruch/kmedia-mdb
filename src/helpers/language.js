import { LANGUAGES } from './consts';
import { isAbsoluteUrl } from './utils';

const ensureStartsWithSlash = str => str && (str[0] === '/' ? str : `/${str}`);
const splitPathByLanguage = (path) => {
  const pathWithSlash = ensureStartsWithSlash(path);
  const parts = pathWithSlash.split('/');

  if (LANGUAGES[parts[1]]) {
    return {
      language: parts[1],
      path: ensureStartsWithSlash(parts.slice(2).join('/')) || '/'
    };
  }

  return {
    path: pathWithSlash
  };
};

export const prefixWithLanguage = (path, location, toLanguage) => {
  // NOTE: (yaniv) this assumes we don't use an absolute url to kmedia - might need to fix this
  if (isAbsoluteUrl(path)) {
    return path;
  }

  const { language: languagePrefix, path: pathSuffix } = splitPathByLanguage(path);
  const { language: currentPathLangPrefix } = splitPathByLanguage(location.pathname);

  // priority: language from args > language from link path > language from current path
  const language = toLanguage || languagePrefix || currentPathLangPrefix || '';
  return language ? `/${language}${pathSuffix}` : pathSuffix;
};
