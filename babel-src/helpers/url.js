'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateQuery = exports.getQuery = exports.prefixWithLanguage = exports.getLanguageFromPath = exports.isAbsoluteUrl = exports.stringify = exports.parse = undefined;

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _consts = require('./consts');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parse = exports.parse = function parse(str) {
  return _qs2.default.parse(str);
};

var stringify = exports.stringify = function stringify(obj) {
  return _qs2.default.stringify(obj, { arrayFormat: 'repeat', skipNulls: true });
};

/**
 * Test if a url is an absolute url
 * @param {string} url
 * @return {boolean}
 */
var isAbsoluteUrl = exports.isAbsoluteUrl = function isAbsoluteUrl(url) {
  return (/^(?:[a-z]+:)?\/\//i.test(url)
  );
};

var ensureStartsWithSlash = function ensureStartsWithSlash(str) {
  return str && (str[0] === '/' ? str : '/' + str);
};
var splitPathByLanguage = function splitPathByLanguage(path) {
  var pathWithSlash = ensureStartsWithSlash(path);
  var parts = pathWithSlash.split('/');

  if (_consts.LANGUAGES[parts[1]]) {
    return {
      language: parts[1],
      path: ensureStartsWithSlash(parts.slice(2).join('/')) || '/'
    };
  }

  return {
    path: pathWithSlash
  };
};

var getLanguageFromPath = exports.getLanguageFromPath = function getLanguageFromPath(_path) {
  var path = ensureStartsWithSlash(_path);
  var parts = splitPathByLanguage(path);

  return _consts.LANGUAGES[parts.language] ? parts.language : _consts.DEFAULT_LANGUAGE;
};

var prefixWithLanguage = exports.prefixWithLanguage = function prefixWithLanguage(path, location, toLanguage) {
  // NOTE: (yaniv) this assumes we don't use an absolute url to kmedia - might need to fix this
  if (isAbsoluteUrl(path)) {
    return path;
  }

  var _splitPathByLanguage = splitPathByLanguage(path),
      languagePrefix = _splitPathByLanguage.language,
      pathSuffix = _splitPathByLanguage.path;

  var _splitPathByLanguage2 = splitPathByLanguage(location.pathname),
      currentPathLangPrefix = _splitPathByLanguage2.language;

  // priority: language from args > language from link path > language from current path


  var language = toLanguage || languagePrefix || currentPathLangPrefix || '';
  return language ? '/' + language + pathSuffix : pathSuffix;
};

var getQuery = exports.getQuery = function getQuery(location) {
  if (location && location.search) {
    return parse(location.search.slice(1));
  }

  return {};
};

var updateQuery = exports.updateQuery = function updateQuery(history, updater) {
  if (!history) {
    return;
  }

  var query = getQuery(history.location);
  history.replace({ search: stringify(updater(query)) });
};