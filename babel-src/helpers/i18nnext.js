'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _i18next = require('i18next');

var _i18next2 = _interopRequireDefault(_i18next);

var _i18nextXhrBackend = require('i18next-xhr-backend');

var _i18nextXhrBackend2 = _interopRequireDefault(_i18nextXhrBackend);

var _i18nextNodeRemoteBackend = require('i18next-node-remote-backend');

var _i18nextNodeRemoteBackend2 = _interopRequireDefault(_i18nextNodeRemoteBackend);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment/locale/he');

require('moment/locale/ru');

var _consts = require('./consts');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Cache from 'i18next-localstorage-cache';
// import LanguageDetector from 'i18next-browser-languagedetector';

var LOCALES_BACKEND = process.env.NODE_ENV === 'production' ? process.env.PUBLIC_URL : process.env.REACT_APP_LOCALES_BACKEND;

// Initialize moment global locale to default language
_moment2.default.locale(_consts.DEFAULT_LANGUAGE);

// TODO (yaniv -> edo) should we use a file system backend? the locales are in this repo
var isServer = typeof window === 'undefined';
var BACKEND = isServer ? _i18nextNodeRemoteBackend2.default : _i18nextXhrBackend2.default;

// TODO (yaniv): we might not need to initially load any resources on the client since we get resouces from the server

_i18next2.default.use(BACKEND)
// .use(Cache)
// .use(LanguageDetector)
.init({

  backend: {
    loadPath: LOCALES_BACKEND + '/locales/{{lng}}/{{ns}}.json',
    crossDomain: true
  },

  fallbackLng: _consts.DEFAULT_LANGUAGE,

  react: {
    wait: !isServer // globally set to wait for loaded translations in translate hoc
    // exposeNamespace: true // exposes namespace on data-i18next-options to be used in eg. locize-editor
  },

  // have a common namespace used around the full app
  ns: ['common'],
  defaultNS: 'common',

  debug: true,

  interpolation: {
    escapeValue: false, // not needed for react!!
    format: function format(value, _format) {
      if (value instanceof Date) {
        return (0, _moment2.default)(value).format(_format);
      }
      return value;
    }
  }

  // cache: {
  //   enabled: true
  // },
});

exports.default = _i18next2.default;