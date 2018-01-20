'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sagas = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _effects = require('redux-saga/effects');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _consts = require('../helpers/consts');

var _i18nUtils = require('../helpers/i18n-utils');

var _language = require('../helpers/language');

var _settings = require('../redux/modules/settings');

var _sources = require('../redux/modules/sources');

var _tags = require('../redux/modules/tags');

var _i18nnext = require('../helpers/i18nnext');

var _i18nnext2 = _interopRequireDefault(_i18nnext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(setLanguage),
    _marked2 = /*#__PURE__*/_regenerator2.default.mark(watchSetLanguages);

function changeDirectionIfNeeded(language) {
  var currentDirection = (0, _i18nUtils.getCurrentDirection)() || 'ltr';
  var newDirection = (0, _language.getLanguageDirection)(language);

  if (currentDirection !== newDirection) {
    (0, _i18nUtils.changeDirection)(newDirection);
  }
}

function setLanguage(action) {
  var language;
  return _regenerator2.default.wrap(function setLanguage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          language = action.payload;

          // TODO (edo): promisify callback and check for errors

          _i18nnext2.default.changeLanguage(language);

          // change global moment.js locale
          _moment2.default.locale(language);

          // change page direction and fetch css

          // NOTE: yaniv -> edo (i18n object has a dir getter)
          // https://github.com/i18next/i18next/blob/master/src/i18next.js#L281
          changeDirectionIfNeeded(language);

          _context.next = 6;
          return (0, _effects.put)(_sources.actions.fetchSources());

        case 6:
          _context.next = 8;
          return (0, _effects.put)(_tags.actions.fetchTags());

        case 8:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this);
}

function watchSetLanguages() {
  return _regenerator2.default.wrap(function watchSetLanguages$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _effects.takeLatest)([_settings.types.SET_LANGUAGE], setLanguage);

        case 2:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked2, this);
}

var sagas = exports.sagas = [watchSetLanguages];