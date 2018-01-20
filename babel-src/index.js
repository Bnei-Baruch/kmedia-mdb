'use strict';

require('core-js/shim');

require('babel-polyfill');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactGa = require('react-ga');

var _reactGa2 = _interopRequireDefault(_reactGa);

var _createBrowserHistory = require('history/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _reactRedux = require('react-redux');

var _reactRouterRedux = require('react-router-redux');

var _reactI18next = require('react-i18next');

var _consts = require('./helpers/consts');

var _createStore = require('./redux/createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _i18nnext = require('./helpers/i18nnext');

var _i18nnext2 = _interopRequireDefault(_i18nnext);

var _MultiLanguageRouteProvider = require('./components/Language/MultiLanguageRouteProvider');

var _MultiLanguageRouteProvider2 = _interopRequireDefault(_MultiLanguageRouteProvider);

var _App = require('./components/App/App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactGa2.default.initialize('UA-108372395-1');

var history = (0, _createBrowserHistory2.default)();
var store = (0, _createStore2.default)(window.__data, history);

var i18nData = window.__i18n || { locale: _consts.DEFAULT_LANGUAGE };
_i18nnext2.default.changeLanguage(i18nData.locale);
if (i18nData.resources) {
  _i18nnext2.default.addResourceBundle(i18nData.locale, 'common', i18nData.resources, true);
} else {
  console.log('Note: No i18n resources from server.');
}

// Render regardless of application's state. let App decide what to render.
var appContainer = document.getElementById('root');
_reactDom2.default.render(_react2.default.createElement(
  _reactI18next.I18nextProvider,
  { i18n: _i18nnext2.default },
  _react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(
      _reactRouterRedux.ConnectedRouter,
      { history: history },
      _react2.default.createElement(
        _MultiLanguageRouteProvider2.default,
        null,
        _react2.default.createElement(_App2.default, null)
      )
    )
  )
), appContainer);