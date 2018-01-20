'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;
exports.renderHead = renderHead;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _reactRedux = require('react-redux');

var _history = require('history');

var _reactRouterRedux = require('react-router-redux');

var _reactI18next = require('react-i18next');

var _consts = require('./helpers/consts');

var _MultiLanguageRouteProvider = require('./components/Language/MultiLanguageRouteProvider');

var _MultiLanguageRouteProvider2 = _interopRequireDefault(_MultiLanguageRouteProvider);

var _App = require('./components/App/App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function render(req, store, context) {
  var memoryHistory = (0, _history.createMemoryHistory)({
    initialEntries: [req.url]
  });

  return (0, _server.renderToString)(_react2.default.createElement(
    _reactI18next.I18nextProvider,
    { i18n: context.i18n },
    _react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(
        _reactRouterRedux.ConnectedRouter,
        { history: memoryHistory },
        _react2.default.createElement(
          _MultiLanguageRouteProvider2.default,
          null,
          _react2.default.createElement(_App2.default, null)
        )
      )
    )
  ));
}

function renderHead(context) {
  return context.head.map(function (h) {
    return (0, _server.renderToStaticMarkup)(h);
  }).join('');
}