'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _url = require('./url');

var _utils = require('./utils');

var _consts = require('./consts');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function calcAvailableMediaTypes(contentUnit, language) {
  if (!contentUnit) {
    return [];
  }

  return Array.from((contentUnit.files || []).reduce(function (acc, file) {
    if (file.language === language && (file.mimetype === getMimeType(_consts.MT_VIDEO) || file.mimetype === getMimeType(_consts.MT_AUDIO))) {
      acc.add(_consts.MIME_TYPE_TO_MEDIA_TYPE[file.mimetype]);
    }
    return acc;
  }, new Set()));
}

function getMimeType(mediaType) {
  return mediaType === _consts.MT_VIDEO ? _consts.MEDIA_TYPES.mp4.mime_type : _consts.MEDIA_TYPES.mp3.mime_type;
}

/**
 * Calculates available languages for content unit for specific language
 * is language is not provided calculates both video and audio available
 * languages.
 * @param {object} contentUnit
 * @param {string|null} mediaType if null will check available languages
 *    for both audio and video.
 * @return {!Array<string>}
 */
function calcAvailableLanguages(contentUnit) {
  var mediaType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (!contentUnit) {
    return [];
  }

  var mediaTypes = mediaType ? [mediaType] : [_consts.MT_VIDEO, _consts.MT_AUDIO];
  var mimeTypes = mediaTypes.map(function (mt) {
    return getMimeType(mt);
  });
  return Array.from((contentUnit.files || []).reduce(function (acc, file) {
    if (mediaTypes.includes(file.type) || mimeTypes.includes(file.mimetype)) {
      acc.add(file.language);
    }
    return acc;
  }, new Set()));
}

function playableItem(contentUnit, mediaType, language) {
  if (!contentUnit) {
    return null;
  }

  var allAvailableLanguages = calcAvailableLanguages(contentUnit);
  var requestedLanguage = language;
  // Fallback to English, if not, then to Hebrew (most probably source) then to
  // Russian (second most probable source), then to any other language.
  if (!allAvailableLanguages.includes(language)) {
    var fallbacks = [_consts.LANG_ENGLISH, _consts.LANG_HEBREW, _consts.LANG_RUSSIAN];
    language = fallbacks.find(function (f) {
      return allAvailableLanguages.includes(f);
    }) || allAvailableLanguages.length && allAvailableLanguages[0];
  }

  var availableMediaTypes = calcAvailableMediaTypes(contentUnit, language);
  var requestedMediaType = mediaType;
  // Fallback to other media type if this one not available.
  if (!availableMediaTypes.includes(mediaType)) {
    if (mediaType === _consts.MT_AUDIO) {
      mediaType = _consts.MT_VIDEO;
    }
    if (mediaType === _consts.MT_VIDEO) {
      mediaType = _consts.MT_AUDIO;
    }
  }

  var file = (contentUnit.files || []).find(function (f) {
    return f.language === language && f.mimetype === getMimeType(mediaType);
  });

  return Object.assign({
    contentUnitId: contentUnit.id,
    language: language,
    requestedLanguage: requestedLanguage,
    src: file ? (0, _utils.physicalFile)(file, true) : '',
    mediaType: mediaType,
    requestedMediaType: requestedMediaType,
    availableMediaTypes: availableMediaTypes,
    availableLanguages: allAvailableLanguages
  }, (0, _pick2.default)(contentUnit, 'content_type', 'film_date', 'name', 'duration'));
}

function playlist(collection, mediaType, language) {
  if (!collection) {
    return null;
  }

  var items = (collection.content_units || []).map(function (contentUnit) {
    return playableItem(contentUnit, mediaType, language);
  });

  return Object.assign({
    collectionId: collection.id,
    language: language,
    mediaType: mediaType,
    items: items
  }, (0, _pick2.default)(collection, 'content_type', 'film_date'));
}

function getMediaTypeFromQuery(location) {
  var defaultMediaType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _consts.MT_VIDEO;

  var query = (0, _url.getQuery)(location);
  return _consts.PLAYABLE_MEDIA_TYPES.find(function (media) {
    return media === (query.mediaType || '').toLowerCase();
  }) || defaultMediaType;
}

function setMediaTypeInQuery(history) {
  var mediaType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _consts.MT_VIDEO;

  (0, _url.updateQuery)(history, function (query) {
    return Object.assign({}, query, {
      mediaType: mediaType
    });
  });
}

function getLanguageFromQuery(location) {
  var fallbackLanguage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _consts.LANG_ENGLISH;

  var query = (0, _url.getQuery)(location);
  var language = query.language || fallbackLanguage;
  return language.toLowerCase();
}

function setLanguageInQuery(history, language) {
  (0, _url.updateQuery)(history, function (query) {
    return Object.assign({}, query, {
      language: language
    });
  });
}

exports.default = {
  playableItem: playableItem,
  playlist: playlist,
  getMediaTypeFromQuery: getMediaTypeFromQuery,
  setMediaTypeInQuery: setMediaTypeInQuery,
  getLanguageFromQuery: getLanguageFromQuery,
  setLanguageInQuery: setLanguageInQuery
};