'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.playerModeProp = undefined;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var playerModeProp = exports.playerModeProp = _propTypes2.default.oneOf(Object.values(_constants.PLAYER_MODE));