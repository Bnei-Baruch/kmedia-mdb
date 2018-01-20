'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = createStore;

var _redux = require('redux');

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _sagaMonitor = require('../sagas/helpers/sagaMonitor');

var _sagaMonitor2 = _interopRequireDefault(_sagaMonitor);

var _multiLanguageRouterMiddleware = require('./middleware/multiLanguageRouterMiddleware');

var _multiLanguageRouterMiddleware2 = _interopRequireDefault(_multiLanguageRouterMiddleware);

var _defferedSagasMiddleware = require('./middleware/defferedSagasMiddleware');

var _defferedSagasMiddleware2 = _interopRequireDefault(_defferedSagasMiddleware);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _sagas = require('../sagas');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createStore(initialState, history) {
  var isClient = typeof window !== 'undefined'; // NOTE (yaniv): need a better check for this
  var isProduction = process.env.NODE_ENV === 'production';
  var devToolsArePresent = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && typeof window.devToolsExtension !== 'undefined';
  var devToolsStoreEnhancer = function devToolsStoreEnhancer() {
    return isClient && devToolsArePresent ? window.devToolsExtension() : function (f) {
      return f;
    };
  };

  var middlewares = [(0, _defferedSagasMiddleware2.default)(), (0, _multiLanguageRouterMiddleware2.default)(history)];

  var sagaMiddlewareOptions = isProduction ? {} : { sagaMonitor: _sagaMonitor2.default };
  var sagaMiddleWare = (0, _reduxSaga2.default)(sagaMiddlewareOptions);
  middlewares.push(sagaMiddleWare);

  var store = (0, _redux.createStore)(_index2.default, initialState, (0, _redux.compose)(_redux.applyMiddleware.apply(undefined, middlewares), devToolsStoreEnhancer()));

  sagaMiddleWare.run(_sagas.rootSaga);

  store.stopSagas = function () {
    return store.dispatch(_reduxSaga.END);
  };
  store.sagaMiddleWare = sagaMiddleWare;

  return store;
}