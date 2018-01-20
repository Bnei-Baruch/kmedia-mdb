'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _Layout = require('../Layout/Layout');

var _Layout2 = _interopRequireDefault(_Layout);

var _Design = require('../Design/Design2');

var _Design2 = _interopRequireDefault(_Design);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Routes = function Routes() {
  return _react2.default.createElement(
    _reactRouterDom.Switch,
    null,
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/design2', component: _Design2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { component: _Layout2.default })
  );
};

exports.default = Routes;