import qs from 'qs';
import { parse as cookieParse } from 'cookie';

import { COOKIE_UI_LANG, DEFAULT_LANGUAGE, LANG_UI_LANGUAGES, LANGUAGES } from './consts';

export const parse = str => qs.parse(str);

export const stringify = obj => qs.stringify(obj, { arrayFormat: 'repeat', skipNulls: true });

/**
 * Test if a url is an absolute url
 * @param {string} url
 * @return {boolean}
 */
export const isAbsoluteUrl = url => /^(?:[a-z]+:)?\/\//i.test(url);

const ensureStartsWithSlash = str => str && (str[0] === '/' ? str : `/${str}`);

const splitPathByLanguage = (path) => {
  const pathWithSlash = ensureStartsWithSlash(path);
  const parts         = pathWithSlash.split('/');

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

export const getLanguageFromPath = (path, headers) => {
  let { language } = splitPathByLanguage(path);
  if (language && LANG_UI_LANGUAGES.includes(language)) {
    // UI lang is set as first part of the url path. i,e, /:lang/...
    return { language, redirect: false };
  }

  // UI lang is set in cookie - redirect 302 to /:lang/...
  const cookies = cookieParse(headers.cookie || '');
  language      = cookies[COOKIE_UI_LANG];
  // Only existing languages...
  if (language !== undefined && LANG_UI_LANGUAGES.includes(language)) {
    console.log(`language: ${language}, redirect: ${language !== DEFAULT_LANGUAGE}`);
    return { language, redirect: true };
  }

  // Educated guess: HTTP header
  const acceptLanguage = headers['accept-language'];
  if (acceptLanguage) {
    const languages = acceptLanguage.match(/[a-zA-Z-]{2,10}/g) || [];
    console.log(`accept-languages: ${headers['accept-language']}\nlanguages: ${languages}`);
    const headerLanguages = languages.map(lang => lang.substr(0, 2)).filter(lang => LANG_UI_LANGUAGES.includes(lang));
    if (headerLanguages.length > 0) {
      console.log(`header-languages: ${headerLanguages}\n`);
      // THAT'S NOT STRUCTURE, THAT'S ARRAY OF LANGUAGES
      language = headerLanguages[0];
      return { language, redirect: language !== DEFAULT_LANGUAGE };
    }
  }

  // English
  return { language: DEFAULT_LANGUAGE, redirect: false };
};

export const prefixWithLanguage = (path, location, toLanguage) => {
  // NOTE: (yaniv) this assumes we don't use an absolute url to kmedia - might need to fix this
  if (isAbsoluteUrl(path)) {
    return path;
  }

  const { language: languagePrefix, path: pathSuffix } = splitPathByLanguage(path);
  const { language: currentPathLangPrefix }            = splitPathByLanguage(location.pathname);

  // priority: language from args > language from link path > language from current path
  const language = toLanguage || languagePrefix || currentPathLangPrefix || '';
  return language ? `/${language}${pathSuffix}` : pathSuffix;
};

export const getQuery = (location) => {
  if (location && location.search) {
    const q = parse(location.search.slice(1));
    if ('deb' in q) {
      q.deb = q.deb !== 'false';
    }
    return q;
  }

  return {};
};

export const updateQuery = (history, updater) => {
  if (!history) {
    return;
  }

  const query = getQuery(history.location);
  if (!query.deb) {
    delete query.deb;
  }
  history.replace({ search: stringify(updater(query)) });
};

export const isDebMode = location => getQuery(location).deb || false;

export const getToWithLanguage = (navigateTo, location, language, contentLanguage) => {
  let toWithLanguage;

  if (typeof navigateTo === 'string') {
    toWithLanguage = prefixWithLanguage(navigateTo, location, language); 
  }
  else {
    if (!navigateTo) {
      navigateTo = { ...location };
    }

    // we're changing 'search' in case contentLanguage was supplied
    if (contentLanguage) {
      const q = getQuery(navigateTo);
      q.language = contentLanguage;
      navigateTo.search = `?${stringify(q)}`;
    }

    toWithLanguage = {
      ...navigateTo,
      pathname: prefixWithLanguage(navigateTo.pathname, location, language)
    };
  }

  return toWithLanguage;
}

