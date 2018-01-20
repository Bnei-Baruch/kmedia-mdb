'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRouterDom = require('react-router-dom');

var _MultiLanguageLinkCreator = require('./MultiLanguageLinkCreator');

var _MultiLanguageLinkCreator2 = _interopRequireDefault(_MultiLanguageLinkCreator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Use this component instead of react-router-dom's Link to keep the current language in the destination route
 */

exports.default = (0, _MultiLanguageLinkCreator2.default)()(_reactRouterDom.Link);