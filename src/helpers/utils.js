import { useEffect, useRef } from 'react';
import isEqual from 'react-fast-compare';
import escapeRegExp from 'lodash/escapeRegExp';
import isFunction from 'lodash/isFunction';
import moment from 'moment';
import 'moment-duration-format';

import { CollectionsBreakdown } from './mdb';
import { canonicalSectionByUnit } from './links';
import {
  CT_ARTICLE,
  CT_CLIP,
  CT_CONGRESS,
  CT_DAILY_LESSON,
  CT_FRIENDS_GATHERING,
  CT_HOLIDAY,
  CT_LECTURE_SERIES,
  CT_LESSONS_SERIES,
  CT_LESSON_PART,
  CT_MEAL,
  CT_SONGS,
  CT_SPECIAL_LESSON,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_VIRTUAL_LESSON,
  CT_WOMEN_LESSON,
  VS_HLS,
  LANGUAGES,
  LANG_ENGLISH,
  LANG_GERMAN,
  LANG_HEBREW,
  LANG_ITALIAN,
  LANG_RUSSIAN,
  LANG_SPANISH,
  LANG_TURKISH
} from './consts';

const CDN_URL     = process.env.REACT_APP_CDN_URL;
const CDN_HLS_URL = process.env.REACT_APP_CDN_HLS_URL;
const PUBLIC_BASE = process.env.REACT_APP_PUBLIC_BASE;

export const isEmpty = obj => {
  // null and undefined are "empty"
  if (obj === null || obj === undefined) {
    return true;
  }

  if (obj.hasOwnProperty('length')) {
    return obj.length === 0;
  }

  if (typeof obj == 'object') {
    return Object.getOwnPropertyNames(obj).length === 0;
  }

  return true;
};

export const isNotEmptyArray = arr => (Array.isArray(arr) && arr.length > 0);

export const randomizeArray = items => {
  const randomArr = items.map(() => Math.random() * items.length);
  items.sort((a, b) => {
    const ai = items.indexOf(a);
    const bi = items.indexOf(b);

    return randomArr[ai] - randomArr[bi];
  });
};

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
    let msg = error.response.data?.error;
    if (!msg) {
      msg = error.message;
    } else {
      msg = error.response.statusText + (msg ? `: ${msg}` : '');
    }

    return msg;
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
export const formatDuration = (duration, fmt) => {
  fmt = duration < 60 ? '[0:]ss' : fmt || 'hh:mm:ss';
  return moment.duration(duration, 'seconds').format(fmt);
};

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
  if (file.is_hls || file.video_size === VS_HLS) {
    return `${CDN_HLS_URL}${file.id}.m3u8`;
  }

  let suffix = '';
  if (ext) {
    suffix = `.${filenameExtension(file.name)}`;
  }

  return `${CDN_URL}${file.id}${suffix}`;
};

export const downloadLink = (file, ext = false) => {
  if (file.is_hls) {
    const { lang3 } = LANGUAGES[file.language];
    let src         = `${CDN_HLS_URL}get/${file.id}.mp4?audio=${lang3.toLowerCase()}`;

    if (file.video_size)
      src = `${src}&video=${file.video_size.toLowerCase()}`;
    return src;
  }

  return physicalFile(file, ext);
};

export const publicFile = relativePath => `${PUBLIC_BASE}${relativePath}`;

export const canonicalCollectionImpl = unit => {
  if (!unit || isEmpty(unit.collections)) {
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

export const canonicalCollection = unit => {
  const c = canonicalCollectionImpl(unit);
  return c;
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

const RSS_FEED_LANGUAGES = new Map([
  [LANG_ENGLISH, 'KabbalahVideoEng'],
  [LANG_HEBREW, 'KabbalahVideoHeb'],
  [LANG_RUSSIAN, 'KabbalahVideoRus'],
  [LANG_SPANISH, 'kabbalah-archive/spa']
]);

// Finds the RSS feed by first matching content language.
export const getRSSFeedByLangs = contentLanguages => {
  const language = contentLanguages.find(language => RSS_FEED_LANGUAGES.has(language)) || LANG_ENGLISH;
  return RSS_FEED_LANGUAGES.get(language);
};

export const getRSSLinkByLangs = contentLanguages => `https://feeds.feedburner.com/${getRSSFeedByLangs(contentLanguages)}`;

export const getRSSLinkByTopic = (topicId, contentLanguages) => `https://kabbalahmedia.info/feeds/collections/${LANGUAGES[contentLanguages[0]].lang3}/${topicId}`;

const PODCAST_LINKS = new Map([
  [LANG_ENGLISH, 'kabbalah-media-mp3-kab-eng/id1109845884?l=iw'],
  [LANG_GERMAN, 'kabbalah-media-mp3-kab-ger/id1109848570?l=iw'],
  [LANG_HEBREW, 'קבלה-מדיה-mp3-kab-heb/id1109848638?l=iw'],
  [LANG_ITALIAN, 'kabbalah-media-mp3-kab-ita/id1109848953?l=iw'],
  [LANG_RUSSIAN, 'каббала-медиа-mp3-kab-rus/id1109845737?l=iw'],
  [LANG_SPANISH, 'kcabalá-media-mp3-kab-spa/id1109848764?l=iw'],
  [LANG_TURKISH, 'kabala-günlük-dersler-mp3-kab-trk/id1106592672?l=iw']
]);

export const getPodcastLinkByLangs = contentLanguages => {
  const language = contentLanguages.find(language => PODCAST_LINKS.has(language)) || LANG_ENGLISH;
  return `https://podcasts.apple.com/il/podcast/${PODCAST_LINKS.get(language)}`;
};

// Compare properties without functions
const removeFunctions = fromObj => {
  const obj = {};
  // @description it only removes functions that are not inside nested object properties.
  // you can improve with recursion to remove all functions inside an object.
  Object.keys(fromObj).forEach(key => !isFunction(fromObj[key]) && (obj[key] = fromObj[key]));
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
    case CT_LESSON_PART:
      return 'lessons.tabs.daily';
    case CT_LESSONS_SERIES:
      return 'lessons.tabs.series';
    case CT_LECTURE_SERIES:
      return 'lessons.tabs.series';
    case CT_DAILY_LESSON:
      return 'lessons.tabs.daily';
    case CT_WOMEN_LESSON:
      return 'lessons.tabs.women';
    case CT_VIRTUAL_LESSON:
      return 'lessons.tabs.virtual';
    case CT_CONGRESS:
      return 'events.tabs.conventions';
    case CT_HOLIDAY:
      return 'events.tabs.holidays';
    case CT_FRIENDS_GATHERING:
      return 'events.tabs.friends-gatherings';
    case CT_MEAL:
      return 'events.tabs.meals';
    case CT_ARTICLE:
      return 'publications.tabs.articles';
    case CT_VIDEO_PROGRAM_CHAPTER:
      return 'programs.tabs.main';
    case CT_CLIP:
      return 'programs.tabs.clips';
    default:
      return '';
  }
};

export const isToday = selectedDate => moment().isSame(moment(selectedDate), 'date');

export const noop = () => {};

// Used in React hooks to remember previous props.
export const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

// Assigns properties from source to target, only if they exist in the what object.
// what properties may have values of type:
//   1. true - Take the whole property using assignment.
//   2. false - Ignore the property.
//   3. object - See inside object each property.
// Example:
//   target = {}
//   source = {a: {b: 2, c: 3, d: {e: 1, f: 2}}}
//   what {a: {b: true, f: }
// will yield: {a: {b: 2}}
export const partialAssign = (target, source, what = true) => {
  if (what === true) {
    target = source;
    return source;
  }

  if (what === false) {
    return undefined;
  }

  if (source === null || source === undefined) {
    return source;
  }

  if (typeof what === 'object' && what !== null) {
    for (const property in what) {
      if (source.hasOwnProperty(property)) {
        if (Array.isArray(source[property])) {
          target[property] = source[property].map(sourceArrValue => partialAssign({}, sourceArrValue, what[property]));
        } else {
          target[property] = partialAssign({}, source[property], what[property]);
        }
      }
      // Ignore unexisting field
    }

    return target;
  }

  console.error('Unexpected what for partialAssign:', what);
  return {};
};

export const cuPartNameByCCUType = ct => {
  const prefix = 'pages.unit.info.';

  switch (ct) {
    case CT_DAILY_LESSON:
    case CT_SPECIAL_LESSON:
    case CT_CONGRESS:
      return `${prefix}lesson-episode`;
    case CT_LESSONS_SERIES:
      return `${prefix}series-episode`;
    case CT_SONGS:
      return `${prefix}song`;
    default:
      return `${prefix}episode`;
  }
};

export const stopBubbling = e => {
  if (!e) return;
  e.preventDefault();
  e.stopPropagation();
};

export const getSourcesCollections = (sources, getPathById) =>
  Object.values(sources.map(source => getPathById(source))
    .map(path => (path && path.length >= 2 && path[path.length - 2]) || null).filter(collectionSource => !!collectionSource)
    .reduce((acc, source) => {
      if (!(source.id in acc)) {
        acc[source.id] = source;
      }

      return acc;
    }, {})).filter(source => source && source.children && source.children.length);

export const buildById = items => {
  const byId = {};

  // We BFS the tree, extracting each item by its ID
  // and normalizing its children
  let s = [...items];
  while (s.length > 0) {
    const node = s.pop();
    if (node.children) {
      s = s.concat(node.children);
    }

    byId[node.id] = {
      ...node,
      children: node.children ? node.children.map(x => x.id) : []
    };
  }

  return byId;
};
