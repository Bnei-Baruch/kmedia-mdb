'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sagas = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.fetchTags = fetchTags;

var _effects = require('redux-saga/effects');

var _Api = require('../helpers/Api');

var _Api2 = _interopRequireDefault(_Api);

var _tags = require('../redux/modules/tags');

var _system = require('../redux/modules/system');

var _settings = require('../redux/modules/settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(fetchTags),
    _marked2 = /*#__PURE__*/_regenerator2.default.mark(watchFetchTags);

function fetchTags() {
  var language, _ref, data;

  return _regenerator2.default.wrap(function fetchTags$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return (0, _effects.select)(function (state) {
            return _settings.selectors.getLanguage(state.settings);
          });

        case 3:
          language = _context.sent;
          _context.next = 6;
          return (0, _effects.call)(_Api2.default.tags, { language: language });

        case 6:
          _ref = _context.sent;
          data = _ref.data;
          _context.next = 10;
          return (0, _effects.put)(_tags.actions.fetchTagsSuccess(data));

        case 10:
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context['catch'](0);
          _context.next = 16;
          return (0, _effects.put)(_tags.actions.fetchTagsFailure(_context.t0));

        case 16:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this, [[0, 12]]);
}

function watchFetchTags() {
  return _regenerator2.default.wrap(function watchFetchTags$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _effects.takeLatest)(_tags.types.FETCH_TAGS, fetchTags);

        case 2:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked2, this);
}

var sagas = exports.sagas = [watchFetchTags];