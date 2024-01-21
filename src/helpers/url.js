import qs from 'qs';
import { parse as cookieParse } from 'cookie';

import {
  COOKIE_UI_LANG,
  DEFAULT_UI_LANGUAGE,
  LANGUAGES,
  LANG_UI_LANGUAGES,
} from './consts';

export const parse = str => qs.parse(str);

export const stringify = obj => qs.stringify(obj, { arrayFormat: 'repeat', skipNulls: true });

/**
 * Test if a url is an absolute url
 * @param {string} url
 * @return {boolean}
 */
export const isAbsoluteUrl = url => /^(?:[a-z]+:)?\/\//i.test(url);

const ensureStartsWithSlash = str => str && (str[0] === '/' ? str : `/${str}`);

export const splitPathByLanguage = path => {
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

export const isSocialUserAgent = userAgent => /facebook|facebot/i.test(userAgent);

export const getUILangFromPath = (path, headers, userAgent) => {
  console.log('getUILangFromPath', path);
  let { language } = splitPathByLanguage(path);
  if (!language && isSocialUserAgent(userAgent)) {
    language = parse(path).shareLang;
  }

  if (language && LANG_UI_LANGUAGES.includes(language)) {
    // UI lang is set as first part of the url path. i,e, /:lang/...
    return { language, redirect: false };
  }

  // UI lang is set in cookie - redirect 302 to /:lang/...
  const cookies = cookieParse(headers.cookie || '');
  language      = cookies[COOKIE_UI_LANG];
  // Only existing languages...
  if (language !== undefined && LANG_UI_LANGUAGES.includes(language)) {
    console.log(`language: ${language}, redirect: ${language !== DEFAULT_UI_LANGUAGE}`);
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
      return { language, redirect: true };
    }
  }

  // Default
  return { language: DEFAULT_UI_LANGUAGE, redirect: true };
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

// Extracts search query parameters from url, return object.
export const getQuery = location => {
  if (location?.search) {
    const q = parse(location.search.slice(1));
    if ('deb' in q) {
      q.deb = q.deb !== 'false';
    }

    return q;
  }

  return {};
};

export const updateQuery = (navigate, location, updater) => {
  if (!navigate) {
    return;
  }

  const query = getQuery(location);
  if (!query.deb) {
    delete query.deb;
  }

  navigate({
    search: stringify(updater(query)),
    state: location?.state ?? '',
    hash: location.hash
  }, { replace: true });
};

export const isDebMode = location => getQuery(location).deb || false;

export const getToWithLanguage = (navigateTo, location, language, contentLanguage) => {
  if (typeof navigateTo === 'string') {
    return prefixWithLanguage(navigateTo, location, language);
  }

  if (!navigateTo) {
    navigateTo = { ...location };
  }

  // We're changing 'search' in case contentLanguage was supplied
  // DON'T COMMI: NOT CLEAR WHAT THAT IS...
  if (contentLanguage) {
    const q           = getQuery(navigateTo);
    q.language        = contentLanguage;
    navigateTo.search = `?${stringify(q)}`;
  }

  return {
    ...navigateTo,
    pathname: prefixWithLanguage(navigateTo.pathname, location, language)
  };
};

export const getPathnameWithHost = pathname => {
  if (typeof window === 'undefined')
    return '';
  const { protocol, hostname, port } = window.location;
  return `${protocol}//${hostname}${port ? `:${port}` : ''}/${pathname}`;
};
