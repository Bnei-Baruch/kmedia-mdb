'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLanguageDirection = undefined;

var _consts = require('../helpers/consts');

var getLanguageDirection = exports.getLanguageDirection = function getLanguageDirection(language) {
  return _consts.RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
};