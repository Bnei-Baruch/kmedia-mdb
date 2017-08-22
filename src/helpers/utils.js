import {
  CT_CHILDREN_LESSON_PART,
  CT_CLIP,
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
  CT_SPECIAL_LESSON,
  CT_TEXT,
  CT_TRAINING,
  CT_UNITY_DAY,
  CT_UNKNOWN,
  CT_VIDEO_PROGRAM,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_VIRTUAL_LESSON,
  CT_WOMEN_LESSON_PART,
  MEDIA_TYPES
} from './consts';

export const isEmpty = (obj) => {
  // null and undefined are "empty"
  if (obj === null) {
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
 * A generator for interspersing a delimiter between items of an iterable.
 * @param iterable
 * @param delim
 */
export function* intersperse(iterable, delim) {
  let first = true;
  for (const item of iterable) {
    if (!first) yield delim;
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
  return `http://cdn.kabbalahmedia.info/${file.id}${suffix}`;
};

/**
 * Test if a url is an absolute url
 * @param {string} url
 * @return {boolean}
 */
export const isAbsoluteUrl = url => /^(?:[a-z]+:)?\/\//i.test(url);

export const canonicalLink = (entity) => {
  if (!entity) {
    return '/';
  }

  switch (entity.content_type) {
  case CT_DAILY_LESSON:
  case CT_SPECIAL_LESSON:
    return `/lessons/full/${entity.id}`;
  case CT_VIDEO_PROGRAM:
    return `/programs/full/${entity.id}`;
  case CT_LECTURE_SERIES:
    return `/lectures/full/${entity.id}`;
  case CT_FRIENDS_GATHERINGS:
  case CT_MEALS:
    return '/';
  case CT_CONGRESS:
  case CT_HOLIDAY:
  case CT_PICNIC:
  case CT_UNITY_DAY:
    return `/events/full/${entity.id}`;
  case CT_LESSON_PART:
    return `/lessons/part/${entity.id}`;
  case CT_LECTURE:
  case CT_VIRTUAL_LESSON:
  case CT_CHILDREN_LESSON_PART:
  case CT_WOMEN_LESSON_PART:
    return `/lectures/part/${entity.id}`;
  case CT_VIDEO_PROGRAM_CHAPTER:
    return `/programs/chapter/${entity.id}`;
  case CT_EVENT_PART:
  case CT_FULL_LESSON:
    return `/events/item/${entity.id}`;
  case CT_FRIENDS_GATHERING:
  case CT_MEAL:
  case CT_TEXT:
  case CT_UNKNOWN:
  case CT_CLIP:
  case CT_TRAINING:
  case CT_KITEI_MAKOR:
    return '/';
  default:
    return '/';
  }
};
