import qs from 'qs';
import { LANG_UI_LANGUAGES } from '../../src/helpers/consts';
import { getLanguageLocaleWORegion } from '../../src/helpers/i18n-utils';
import { isEmpty } from '../../src/helpers/utils';

const BASE_URL = process.env.REACT_APP_BASE_URL;

/**
 * Strips UI language prefix from path
 * @param {string} path - Original path
 * @param {string} lang - UI language
 * @returns {string} - Path without language prefix
 */
function stripLanguageFromPath(path, lang) {
  if (lang && path.startsWith(`/${lang}`)) {
    return path.substring(3);
  }
  return path;
}

/**
 * Strips leading slash from path
 * @param {string} path - Path to process
 * @returns {string} - Path without leading slash
 */
function stripLeadingSlash(path) {
  return path.startsWith('/') ? path.substring(1) : path;
}

/**
 * Generates canonical link tag for SEO
 * See: https://yoast.com/rel-canonical/
 * @param {Object} req - Express request object
 * @param {string} lang - UI language
 * @returns {string} - Canonical link HTML tag
 */
export function canonicalLink(req, lang) {
  let cPath = stripLanguageFromPath(req.originalUrl, lang);
  const parts = cPath.split('?');

  // Start with path part
  cPath = parts[0];

  // Strip leading slash as it comes from BASE_URL
  cPath = stripLeadingSlash(cPath);

  // Strip trailing slash as we don't use those
  if (cPath.endsWith('/')) {
    cPath = cPath.substring(0, cPath.length - 1);
  }

  // Clean content invariant keys from search part (query)
  if (parts.length > 1) {
    const query = qs.parse(parts[1]);
    
    // Remove content-invariant parameters
    delete query.sstart;      // player slice start
    delete query.send;        // player slice end
    delete query.language;    // content language
    
    // This one is conceptually wrong as changing the active part in a playlist
    // would most definitely change the page's content. However, it's logically
    // not easy and some units may not have their own CU page so we skip it.
    delete query.ap;          // playlist active part

    if (!isEmpty(query)) {
      cPath = `${cPath}?${qs.stringify(query)}`;
    }
  }

  // Handle Rabash Group Articles special case
  if (/\/gr-/.test(cPath)) {
    const result = /(.+)\/gr-(.+)$/.exec(cPath);
    if (result) {
      cPath = `${result[1]}/${result[2]}`;
    }
  }

  return `<link rel="canonical" href="${BASE_URL}${cPath}" />`;
}

/**
 * Generates alternate language links for SEO
 * See: https://yoast.com/hreflang-ultimate-guide/
 * @param {Object} req - Express request object
 * @param {string} lang - Current UI language
 * @returns {string} - Alternate link HTML tags
 */
export function alternateLinks(req, lang) {
  let aPath = stripLanguageFromPath(req.originalUrl, lang);
  aPath = stripLeadingSlash(aPath);

  return LANG_UI_LANGUAGES
    .map(x => {
      const locale = getLanguageLocaleWORegion(x);
      return `<link rel="alternate" href="${BASE_URL}${x}/${aPath}" hreflang="${locale}" />`;
    })
    .join('');
}

/**
 * Generates Open Graph URL meta tag
 * @param {Object} req - Express request object
 * @param {string} lang - UI language
 * @returns {string} - OG URL meta tag
 */
export function ogUrl(req, lang) {
  let aPath = stripLanguageFromPath(req.originalUrl, lang);
  aPath = stripLeadingSlash(aPath);

  return `<meta property="og:url" content="${BASE_URL}${lang}/${aPath}" />`;
}

/**
 * Generates all SEO meta tags
 * @param {Object} req - Express request object
 * @param {string} lang - UI language
 * @returns {string} - Combined SEO meta tags
 */
export function generateSEOTags(req, lang) {
  return `${canonicalLink(req, lang)}${alternateLinks(req, lang)}${ogUrl(req, lang)}`;
}

