'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectors = exports.reducer = exports.actions = exports.types = undefined;

var _reduxActions = require('redux-actions');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* Types */

var BOOT = 'System/BOOT';
var INIT = 'System/INIT';
var READY = 'System/READY';

var types = exports.types = {
  BOOT: BOOT,
  INIT: INIT,
  READY: READY
};

/* Actions */

var boot = (0, _reduxActions.createAction)(BOOT);
var init = (0, _reduxActions.createAction)(INIT);
var ready = (0, _reduxActions.createAction)(READY);

var actions = exports.actions = {
  boot: boot,
  init: init,
  ready: ready
};

/* Reducer */

var initialState = {
  isReady: false
};

var reducer = exports.reducer = (0, _reduxActions.handleActions)(_defineProperty({}, READY, function (state) {
  return Object.assign({}, state, {
    isReady: true
  });
}), initialState);

/* Selectors */

var isReady = function isReady(state) {
  return state.isReady;
};

var selectors = exports.selectors = {
  isReady: isReady
};