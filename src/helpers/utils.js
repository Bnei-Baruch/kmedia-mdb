import moment from 'moment';
import 'moment-duration-format';
import escapeRegExp from 'lodash/escapeRegExp';

import { CollectionsBreakdown } from './mdb';
import { LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH } from './consts';

const CDN_URL     = process.env.REACT_APP_CDN_URL;
const PUBLIC_BASE = process.env.REACT_APP_PUBLIC_BASE;

export const isEmpty = (obj) => {
  // null and undefined are "empty"
  if (obj === null || obj === undefined) {
    return true;
  }

  // Assume if it has a length property with a non-zero value
  // that property is correct.
  if (obj.length > 0) {
    return false;
  }
  if (obj.length === 0) {
    return true;
  }

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== 'object') {
    return true;
  }

  return Object.getOwnPropertyNames(obj).length <= 0;
};

export const isNotEmptyArray = arr => (Array.isArray(arr) && arr.length > 0);

/**
 * Format the given error into a user friendly string
 * Intended to format axios errors but may be extended to handle other errors as well
 *
 * @see https://github.com/mzabriskie/axios#handling-errors
 *
 * @param error
 * @returns {String}
 */
export const formatError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const msg = error.response.data.error;
    return error.response.statusText + (msg ? `: ${msg}` : '');
  }
  if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return 'No response from server';
  }
  if (error.message) {
    // Something happened in setting up the request that triggered an Error
    return error.message;
  }
  if (typeof error.toString === 'function') {
    return error.toString();
  }
  return error;
};

/**
 * Format the given duration (seconds) in the given format
 * @param duration {numeric} number of seconds in this duration
 * @param fmt {String} default is 'hh:mm:ss'
 */
export const formatDuration = (duration, fmt = 'hh:mm:ss') => moment.duration(duration, 'seconds').format(fmt);

/**
 * A generator for interspersing a delimiter between items of an iterable.
 * @param iterable
 * @param delimiter
 */
export function* intersperse(iterable, delimiter) {
  let first = true;
  for (const item of iterable) { // eslint-disable-line no-unused-vars
    if (!first) {
      yield delimiter;
    }
    first = false;
    yield item;
  }
}

/**
 * Reconstruct a node's path up a tree
 * @param {Object} node Tree node whose path we want
 * @param {Function} getById a function to return a node in the tree by it's id
 * @returns {[Object]} Array of the given node ancestor, from root to node including.
 */
export const tracePath = (node, getById) => {
  let x      = node;
  const path = [node];
  while (x && x.parent_id) {
    x = getById(x.parent_id);
    if (x) {
      path.unshift(x);
    }
  }
  return path;
};

/**
 * Returns the given string suffix after the last dot '.'
 * The empty string '' is returned if no dots found.
 * @param name {string}
 * @returns {string}
 */
export const filenameExtension = (name) => {
  const lastDot = name.lastIndexOf('.');
  if (lastDot === -1) {
    return '';
  }
  return name.substring(lastDot + 1, name.length);
};

/**
 * Returns the url to the physical file
 * @param file
 * @param ext {boolean} include file name extension in url or not
 */
export const physicalFile = (file, ext = false) => {
  let suffix = '';
  if (ext) {
    suffix = `.${filenameExtension(file.name)}`;
  }
  return `${CDN_URL}${file.id}${suffix}`;
  // return `https://cdn.kabbalahmedia.info/${file.id}${suffix}`;
};

export const publicFile = relativePath => `${PUBLIC_BASE}${relativePath}`;

export const canonicalCollection = (unit) => {
  if (!unit) {
    return null;
  }

  if (isEmpty(unit.collections)) {
    return null;
  }

  const collections = Array.isArray(unit.collections) ? unit.collections : Object.values(unit.collections);
  if (collections.length === 1) {
    return collections[0];
  }

  const breakdown = new CollectionsBreakdown(collections);
  const lessons   = breakdown.getDailyLessons();
  const events    = breakdown.getEvents();
  if (lessons.length > 0 && events.length > 0) {
    const { start_date: start, end_date: end } = events[0];
    const { film_date: filmDate }              = unit;
    if (start && end && filmDate) {
      return (moment(filmDate).isBetween(start, end, 'day', '[]')) ? events[0] : lessons[0];
    }
  }

  return collections[0];
};

/**
 * Return n adjacent indices in array around idx (excluding idx).
 * @param idx center neighborhood, in range [-1,len)
 * @param len array length
 * @param n size of neighborhood
 * @returns {Array<int>}
 */
export const neighborIndices = (idx, len, n) => {
  const neighbors = [];
  let step        = 1;

  while (neighbors.length <= n) {
    const l = idx - step;
    if (l >= 0) {
      neighbors.unshift(l);
    }

    const r = idx + step;
    if (r < len) {
      neighbors.push(r);
    }

    if (r >= len && l < 0) {
      break;
    }

    step++;
  }

  return neighbors.slice(0, n);
};

/**
 * Compare two strings for use with Array.sort
 * @param a {string}
 * @param b {string}
 */
export const strCmp = (a, b) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

export const getEscapedRegExp = (term) => {
  const escaped = term.replace(/[/)(.+\\]/g, '\\$&');
  try {
    return new RegExp(escaped, 'i');
  } catch (e) {
    return new RegExp(escapeRegExp(escaped), 'i');
  }
};

export const getRSSFeedByLang = (language) => {
  switch (language) {
  case LANG_HEBREW:
    return 'KabbalahVideoHeb';
  case LANG_RUSSIAN:
    return 'KabbalahVideoRus';
  case LANG_SPANISH:
    return 'kabbalah-archive/spa';
  default:
    return 'KabbalahVideoEng';
  }
};

export const getRSSLinkByLang = (language) => {
  return 'https://feeds.feedburner.com/' + getRSSFeedByLang(language);
};
