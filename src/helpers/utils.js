import moment from 'moment';
import 'moment-duration-format';
import escapeRegExp from 'lodash/escapeRegExp';
import _ from 'lodash';
import isEqual from 'react-fast-compare';
import { useEffect, useRef } from 'react';

import { CollectionsBreakdown } from './mdb';
import { canonicalSectionByUnit } from './links';
import * as consts from './consts';
import { LANGUAGES } from './consts';

const CDN_URL     = process.env.REACT_APP_CDN_URL;
const PUBLIC_BASE = process.env.REACT_APP_PUBLIC_BASE;

export const isEmpty = obj => {
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
export const formatError = error => {
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
  while (x?.parent_id) {
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
export const filenameExtension = name => {
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

export const canonicalCollection = unit => {
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
export const strCmp = (a, b) =>
  a < b
    ? -1
    : a > b
      ? 1
      : 0;

export const getEscapedRegExp = term => {
  const escaped = term.replace(/[/)(.+\\]/g, '\\$&');
  try {
    return new RegExp(escaped, 'i');
  } catch (e) {
    return new RegExp(escapeRegExp(escaped), 'i');
  }
};

export const getRSSFeedByLang = language => {
  switch (language) {
    case consts.LANG_HEBREW:
      return 'KabbalahVideoHeb';
    case consts.LANG_RUSSIAN:
      return 'KabbalahVideoRus';
    case consts.LANG_SPANISH:
      return 'kabbalah-archive/spa';
    default:
      return 'KabbalahVideoEng';
  }
};

export const getRSSLinkByLang = language => `https://feeds.feedburner.com/${  getRSSFeedByLang(language)}`;

export const getRSSLinkByTopic = (topicId, language) => `https://kabbalahmedia.info/feeds/collections/${LANGUAGES[language].lang3}/${topicId}`;

const podcastLinks = new Map([
  [consts.LANG_HEBREW, 'קבלה-מדיה-mp3-kab-heb/id1109848638?l=iw'],
  [consts.LANG_RUSSIAN, 'каббала-медиа-mp3-kab-rus/id1109845737?l=iw'],
  [consts.LANG_TURKISH, 'kabala-günlük-dersler-mp3-kab-trk/id1106592672?l=iw'],
  [consts.LANG_ITALIAN, 'kabbalah-media-mp3-kab-ita/id1109848953?l=iw'],
  [consts.LANG_GERMAN, 'kabbalah-media-mp3-kab-ger/id1109848570?l=iw'],
  [consts.LANG_SPANISH, 'kcabalá-media-mp3-kab-spa/id1109848764?l=iw'],
]);

export const getPodcastLinkByLang = language => {
  const hash = podcastLinks.get(language) || 'kabbalah-media-mp3-kab-eng/id1109845884?l=iw';
  return `https://podcasts.apple.com/il/podcast/${  hash}`;
};

// Compare properties without functions
const removeFunctions = fromObj => {
  const obj = {};
  // @description it only removes functions that are not inside nested object properties.
  // you can improve with recursion to remove all functions inside an object.
  Object.keys(fromObj).forEach(key => !_.isFunction(fromObj[key]) && (obj[key] = fromObj[key]));
  return obj;
};

export const areEqual = (prevProps, nextProps) => {
  const [prev, next] = [prevProps, nextProps].map(removeFunctions);
  return isEqual(prev, next);
};

// map units to sections
export const unitsBySection = units => units?.reduce((acc, u) => {
  const section = canonicalSectionByUnit(u);
  if (acc[section]) {
    acc[section].push(u);
  } else {
    acc[section] = [u];
  }

  return acc;
}, {});

// returns the value from common.json for translation
export const getSectionForTranslation = content_type => {
  switch (content_type) {
    case consts.CT_LESSON_PART:
      return 'lessons.tabs.daily';
    case consts.CT_LESSONS_SERIES:
      return 'lessons.tabs.series';
    case consts.CT_LECTURE_SERIES:
      return 'lessons.tabs.series';
    case consts.CT_DAILY_LESSON:
      return 'lessons.tabs.daily';
    case consts.CT_WOMEN_LESSON:
      return 'lessons.tabs.women';
    case consts.CT_VIRTUAL_LESSON:
      return 'lessons.tabs.virtual';
    case consts.CT_CONGRESS:
      return 'events.tabs.conventions';
    case consts.CT_HOLIDAY:
      return 'events.tabs.holidays';
    case consts.CT_FRIENDS_GATHERING:
      return 'events.tabs.friends-gatherings';
    case consts.CT_MEAL:
      return 'events.tabs.meals';
    case consts.CT_ARTICLE:
      return 'publications.tabs.articles';
    case consts.CT_VIDEO_PROGRAM_CHAPTER:
      return 'programs.tabs.main';
    case consts.CT_CLIP:
      return 'programs.tabs.clips';
    default:
      return '';
  }
};

export const noop = () => {};

// Used in React hooks to remember previous props.
export const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
