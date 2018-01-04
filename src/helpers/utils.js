import moment from 'moment';
import 'moment-duration-format';

import {
  CT_ARTICLE,
  CT_ARTICLES,
  CT_CHILDREN_LESSON,
  CT_CHILDREN_LESSONS,
  CT_CLIP,
  CT_CLIPS,
  CT_CONGRESS,
  CT_DAILY_LESSON,
  CT_EVENT_PART,
  CT_FRIENDS_GATHERING,
  CT_FRIENDS_GATHERINGS,
  CT_FULL_LESSON,
  CT_HOLIDAY,
  CT_KITEI_MAKOR,
  CT_LECTURE,
  CT_LECTURE_SERIES,
  CT_LESSON_PART,
  CT_MEAL,
  CT_MEALS,
  CT_PICNIC,
  CT_PUBLICATION,
  CT_SPECIAL_LESSON,
  CT_TRAINING,
  CT_UNITY_DAY,
  CT_UNKNOWN,
  CT_VIDEO_PROGRAM,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_VIRTUAL_LESSON,
  CT_VIRTUAL_LESSONS,
  CT_WOMEN_LESSON,
  CT_WOMEN_LESSONS,
  EVENT_TYPES,
  MEDIA_TYPES,
} from './consts';

import { CollectionsBreakdown } from './mdb';

export const isEmpty = (obj) => {
  // null and undefined are "empty"
  if (obj === null || obj === undefined) {
    return true;
  }

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
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
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return 'No response from server';
  } else if (error.message) {
    // Something happened in setting up the request that triggered an Error
    return error.message;
  } else if (typeof error.toString === 'function') {
    return error.toString();
  }
  return error;
};

/**
 * Format the given duration (seconds) in the given format
 * @param duration {numeric} number of seconds in this duration
 * @param fmt {String} default is 'hh:mm:ss'
 */
export const formatDuration = (duration, fmt = 'hh:mm:ss') =>
  moment.duration(duration, 'seconds').format(fmt);

/**
 * A generator for interspersing a delimiter between items of an iterable.
 * @param iterable
 * @param delim
 */
export function* intersperse(iterable, delim) {
  let first = true;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of iterable) {
    if (!first) {
      yield delim;
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
 * Extract type, sub_type and mime_type from a file
 * or infer based file name extension.
 * @param file
 * @returns {{type: String, sub_type: String, mime_type: String}}
 */
export const fileTypes = (file) => {
  let { type, sub_type, mime_type } = file;

  // infer from file extension in DB has nothing
  if (!type) {
    const ext = filenameExtension(file.name);
    ({ type, sub_type, mime_type } = MEDIA_TYPES[ext] || {});
  }

  return { type, sub_type, mime_type };
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
  return `https://cdn.kabbalahmedia.info/${file.id}${suffix}`;
};

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

export const canonicalLink = (entity) => {
  if (!entity) {
    return '/';
  }

  // collections
  switch (entity.content_type) {
  case CT_DAILY_LESSON:
  case CT_SPECIAL_LESSON:
    return `/lessons/full/${entity.id}`;
  case CT_VIDEO_PROGRAM:
    return `/programs/full/${entity.id}`;
  case CT_LECTURE_SERIES:
  case CT_VIRTUAL_LESSONS:
  case CT_WOMEN_LESSONS:
  case CT_CHILDREN_LESSONS:
    return `/lectures/c/${entity.id}`;
  case CT_ARTICLES:
    return `/publications/c/${entity.id}`;
  case CT_FRIENDS_GATHERINGS:
  case CT_MEALS:
  case CT_CLIPS:
  case CT_CONGRESS:
  case CT_HOLIDAY:
  case CT_PICNIC:
  case CT_UNITY_DAY:
    return `/events/full/${entity.id}`;
  default:
    break;
  }

  // units whose canonical collection is an event goes as an event item
  const collection = canonicalCollection(entity);
  if (collection && EVENT_TYPES.indexOf(collection.content_type) !== -1) {
    return `/events/item/${entity.id}`;
  }

  // unit based on type
  switch (entity.content_type) {
  case CT_LESSON_PART:
    return `/lessons/part/${entity.id}`;
  case CT_LECTURE:
  case CT_VIRTUAL_LESSON:
  case CT_CHILDREN_LESSON:
  case CT_WOMEN_LESSON:
    return `/lectures/cu/${entity.id}`;
  case CT_VIDEO_PROGRAM_CHAPTER:
    return `/programs/chapter/${entity.id}`;
  case CT_EVENT_PART:
  case CT_FULL_LESSON:
    return `/events/item/${entity.id}`;
  case CT_ARTICLE:
    return `/publications/cu/${entity.id}`;
  case CT_FRIENDS_GATHERING:
  case CT_MEAL:
  case CT_UNKNOWN:
  case CT_CLIP:
  case CT_TRAINING:
  case CT_KITEI_MAKOR:
  case CT_PUBLICATION:
    return '/';
  default:
    return '/';
  }
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
 * Used by shallowCompare
 * @param objA
 * @param objB
 * @returns {bool}
 */
const shallowEqual = (objA, objB) => {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
    typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  const bHasOwnProperty = Object.hasOwnProperty.bind(objB);
  for (let i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
};

/**
 * Shallow compare current (props, state) and next ones
 * @param instance object to take props and state from (usually should be "this")
 * @param nextProps new props
 * @param nextState new state
 * @returns {bool}
 */
export const shallowCompare = (instance, nextProps, nextState) => (
  !shallowEqual(instance.props, nextProps) ||
  !shallowEqual(instance.state, nextState)
);
