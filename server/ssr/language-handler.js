import { parse as cookieParse } from 'cookie';
import { getUILangFromPath } from '../../src/helpers/url';
import {
  COOKIE_UI_LANG,
  COOKIE_CONTENT_LANGS,
  LANG_UKRAINIAN
} from '../../src/helpers/consts';

const BASE_URL = process.env.REACT_APP_BASE_URL;

/**
 * Extracts and validates UI language from request
 * @param {Object} req - Express request object
 * @returns {Object} - { uiLang, shouldRedirect, redirectUrl }
 */
export function extractUILanguage(req) {
  const { language: uiLang, redirect } = getUILangFromPath(
    req.originalUrl,
    req.headers,
    req.get('user-agent')
  );

  if (redirect) {
    const redirectUrl = `${BASE_URL}${uiLang}${req.originalUrl}`;
    return { uiLang, shouldRedirect: true, redirectUrl };
  }

  return { uiLang, shouldRedirect: false };
}

/**
 * Extracts language preferences from cookies
 * @param {Object} req - Express request object
 * @param {string} defaultUILang - Default UI language
 * @returns {Object} - { cookieUILang, cookieContentLanguages }
 */
export function extractCookieLanguages(req, defaultUILang) {
  const cookies = cookieParse(req.headers.cookie || '');
  
  const cookieUILang = cookies[COOKIE_UI_LANG] || defaultUILang;
  let cookieContentLanguages = cookies[COOKIE_CONTENT_LANGS] || [defaultUILang];
  
  if (typeof cookieContentLanguages === 'string' || cookieContentLanguages instanceof String) {
    cookieContentLanguages = cookieContentLanguages.split(',');
  }

  return { cookieUILang, cookieContentLanguages };
}

/**
 * Gets the appropriate moment locale for the UI language
 * @param {string} uiLang - UI language code
 * @returns {string} - Moment locale code
 */
export function getMomentLocale(uiLang) {
  return uiLang === LANG_UKRAINIAN ? 'uk' : uiLang;
}

