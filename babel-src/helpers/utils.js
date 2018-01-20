'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.neighborIndices = exports.canonicalLink = exports.canonicalCollection = exports.physicalFile = exports.fileTypes = exports.filenameExtension = exports.tracePath = exports.formatError = exports.isEmpty = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.intersperse = intersperse;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _consts = require('./consts');

var _mdb = require('./mdb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(intersperse);

var isEmpty = exports.isEmpty = function isEmpty(obj) {
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
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
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
var formatError = exports.formatError = function formatError(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    var msg = error.response.data.error;
    return error.response.statusText + (msg ? ': ' + msg : '');
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
function intersperse(iterable, delim) {
  var first, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item;

  return _regenerator2.default.wrap(function intersperse$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          first = true;
          // eslint-disable-next-line no-restricted-syntax

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 4;
          _iterator = iterable[Symbol.iterator]();

        case 6:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 17;
            break;
          }

          item = _step.value;

          if (first) {
            _context.next = 11;
            break;
          }

          _context.next = 11;
          return delim;

        case 11:
          first = false;
          _context.next = 14;
          return item;

        case 14:
          _iteratorNormalCompletion = true;
          _context.next = 6;
          break;

        case 17:
          _context.next = 23;
          break;

        case 19:
          _context.prev = 19;
          _context.t0 = _context['catch'](4);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 23:
          _context.prev = 23;
          _context.prev = 24;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 26:
          _context.prev = 26;

          if (!_didIteratorError) {
            _context.next = 29;
            break;
          }

          throw _iteratorError;

        case 29:
          return _context.finish(26);

        case 30:
          return _context.finish(23);

        case 31:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this, [[4, 19, 23, 31], [24,, 26, 30]]);
}

/**
 * Reconstruct a node's path up a tree
 * @param {Object} node Tree node whose path we want
 * @param {Function} getById a function to return a node in the tree by it's id
 * @returns {[Object]} Array of the given node ancestor, from root to node including.
 */
var tracePath = exports.tracePath = function tracePath(node, getById) {
  var x = node;
  var path = [node];
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
var filenameExtension = exports.filenameExtension = function filenameExtension(name) {
  var lastDot = name.lastIndexOf('.');
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
var fileTypes = exports.fileTypes = function fileTypes(file) {
  var type = file.type,
      sub_type = file.sub_type,
      mime_type = file.mime_type;

  // infer from file extension in DB has nothing

  if (!type) {
    var ext = filenameExtension(file.name);

    var _ref = _consts.MEDIA_TYPES[ext] || {};

    type = _ref.type;
    sub_type = _ref.sub_type;
    mime_type = _ref.mime_type;
  }

  return { type: type, sub_type: sub_type, mime_type: mime_type };
};

/**
 * Returns the url to the physical file
 * @param file
 * @param ext {boolean} include file name extension in url or not
 */
var physicalFile = exports.physicalFile = function physicalFile(file) {
  var ext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var suffix = '';
  if (ext) {
    suffix = '.' + filenameExtension(file.name);
  }
  return 'https://cdn.kabbalahmedia.info/' + file.id + suffix;
};

var canonicalCollection = exports.canonicalCollection = function canonicalCollection(unit) {
  if (!unit) {
    return null;
  }

  if (isEmpty(unit.collections)) {
    return null;
  }

  var collections = Array.isArray(unit.collections) ? unit.collections : Object.values(unit.collections);
  if (collections.length === 1) {
    return collections[0];
  }

  var breakdown = new _mdb.CollectionsBreakdown(collections);
  var lessons = breakdown.getDailyLessons();
  var events = breakdown.getEvents();
  if (lessons.length > 0 && events.length > 0) {
    var _events$ = events[0],
        start = _events$.start_date,
        end = _events$.end_date;
    var filmDate = unit.film_date;

    if (start && end && filmDate) {
      return (0, _moment2.default)(filmDate).isBetween(start, end, 'day', '[]') ? events[0] : lessons[0];
    }
  }

  return collections[0];
};

var canonicalLink = exports.canonicalLink = function canonicalLink(entity) {
  if (!entity) {
    return '/';
  }

  // collections
  switch (entity.content_type) {
    case _consts.CT_DAILY_LESSON:
    case _consts.CT_SPECIAL_LESSON:
      return '/lessons/full/' + entity.id;
    case _consts.CT_VIDEO_PROGRAM:
      return '/programs/full/' + entity.id;
    case _consts.CT_LECTURE_SERIES:
      return '/lectures/full/' + entity.id;
    case _consts.CT_FRIENDS_GATHERINGS:
    case _consts.CT_MEALS:
      return '/';
    case _consts.CT_CONGRESS:
    case _consts.CT_HOLIDAY:
    case _consts.CT_PICNIC:
    case _consts.CT_UNITY_DAY:
      return '/events/full/' + entity.id;
    default:
      break;
  }

  // units whose canonical collection is an event goes as an event item
  var collection = canonicalCollection(entity);
  if (collection && _consts.EVENT_TYPES.indexOf(collection.content_type) !== -1) {
    return '/events/item/' + entity.id;
  }

  // unit based on type
  switch (entity.content_type) {
    case _consts.CT_LESSON_PART:
      return '/lessons/part/' + entity.id;
    case _consts.CT_LECTURE:
    case _consts.CT_VIRTUAL_LESSON:
    case _consts.CT_CHILDREN_LESSON:
    case _consts.CT_WOMEN_LESSON:
      return '/lectures/part/' + entity.id;
    case _consts.CT_VIDEO_PROGRAM_CHAPTER:
      return '/programs/chapter/' + entity.id;
    case _consts.CT_EVENT_PART:
    case _consts.CT_FULL_LESSON:
      return '/events/item/' + entity.id;
    case _consts.CT_FRIENDS_GATHERING:
    case _consts.CT_MEAL:
    case _consts.CT_TEXT:
    case _consts.CT_UNKNOWN:
    case _consts.CT_CLIP:
    case _consts.CT_TRAINING:
    case _consts.CT_KITEI_MAKOR:
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
var neighborIndices = exports.neighborIndices = function neighborIndices(idx, len, n) {
  var neighbors = [];
  var step = 1;

  while (neighbors.length <= n) {
    var l = idx - step;
    if (l >= 0) {
      neighbors.unshift(l);
    }

    var r = idx + step;
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