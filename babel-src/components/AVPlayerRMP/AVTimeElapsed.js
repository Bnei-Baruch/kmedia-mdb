'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _AVDuration = require('./AVDuration');

var _AVDuration2 = _interopRequireDefault(_AVDuration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AVTimeElapsed = function AVTimeElapsed(props) {
  var start = props.start,
      end = props.end;


  return _react2.default.createElement(
    'div',
    { className: 'player-control-time-elapsed' },
    _react2.default.createElement(_AVDuration2.default, { value: start }),
    '\xA0/\xA0',
    _react2.default.createElement(_AVDuration2.default, { value: end })
  );
};

AVTimeElapsed.propTypes = {
  start: _propTypes2.default.number,
  end: _propTypes2.default.number
};

AVTimeElapsed.defaultProps = {
  start: undefined,
  end: undefined
};

exports.default = AVTimeElapsed;